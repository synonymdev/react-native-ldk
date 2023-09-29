package com.reactnativeldk.classes
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkErrors
import com.reactnativeldk.LdkEventEmitter
import com.reactnativeldk.handleReject
import com.reactnativeldk.hexEncodedString
import com.reactnativeldk.hexa
import org.json.JSONObject
import org.ldk.structs.Result_StringErrorZ.Result_StringErrorZ_OK
import org.ldk.structs.UtilMethods
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Random
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

class BackupError : Exception() {
    companion object {
        val requiresSetup = RequiresSetup()
        val missingBackup = MissingBackup()
        val invalidServerResponse = InvalidServerResponse(0)
        val decryptFailed = DecryptFailed("")
        val signingError = SigningError()
        val serverChallengeResponseFailed = ServerChallengeResponseFailed()
    }
}

class InvalidNetwork() : Exception("Invalid network passed to BackupClient setup")
class RequiresSetup() : Exception("BackupClient requires setup")
class MissingBackup() : Exception("Retrieve failed. Missing backup.")
class InvalidServerResponse(code: Int) : Exception("Invalid backup server response ($code)")
class DecryptFailed(msg: String) : Exception("Failed to decrypt backup payload. $msg")
class SigningError() : Exception("Failed to sign message")
class ServerChallengeResponseFailed() : Exception("Server challenge response failed")

class CompleteBackup(
    val files: Map<String, ByteArray>,
    val channelFiles: Map<String, ByteArray>
)

class BackupClient {
    sealed class Label(val string: String, channelId: String = "") {
        data class PING(val customName: String = "") : Label("ping")
        data class CHANNEL_MANAGER(val customName: String = "") : Label("channel_manager")
        data class CHANNEL_MONITOR(val customName: String = "", val channelId: String) :
            Label("channel_monitor")

        data class MISC(val customName: String) :
            Label(customName.replace(".json", "").replace(".bin", ""))
    }

    companion object {
        enum class Method(val value: String) {
            PERSIST("persist"),
            RETRIEVE("retrieve"),
            LIST("list"),
            AUTH_CHALLENGE("auth/challenge"),
            AUTH_RESPONSE("auth/response")
        }

        private var version = "v1"
        private var signedMessagePrefix = "react-native-ldk backup server auth:"

        var skipRemoteBackup = true //Allow dev to opt out (for development), will not throw error when attempting to persist

        private var network: String? = null
        private var server: String? = null
        private var serverPubKey: String? = null
        private var secretKey: ByteArray? = null
        private val encryptionKey: SecretKeySpec?
            get() = if (secretKey != null) {
                SecretKeySpec(secretKey, "AES")
            } else {
                null
            }
        private var pubKey: ByteArray? = null

        val requiresSetup: Boolean
            get() = server == null

        fun setup(secretKey: ByteArray, pubKey: ByteArray, network: String, server: String, serverPubKey: String) {
            this.secretKey = secretKey
            this.pubKey = pubKey
            this.network = network
            this.server = server
            this.serverPubKey = serverPubKey

            LdkEventEmitter.send(
                EventTypes.native_log,
                "BackupClient setup for synchronous remote persistence. Server: $server"
            )

            if (requiresSetup) {
                throw RuntimeException(this.server)
            }
        }

        @Throws(BackupError::class)
        private fun backupUrl(
            method: Method,
            label: Label? = null
        ): URL {
            val network = network ?: throw BackupError.requiresSetup
            val server = server ?: throw BackupError.requiresSetup

            var urlString = "$server/$version/${method.value}?network=$network"

            label?.let {
                urlString += "&label=${it.string}"
            }

            if (label is Label.CHANNEL_MONITOR) {
                urlString += "&channelId=${label.channelId}"
            }

            return URL(urlString)
        }

        @Throws(BackupError::class)
        private fun encrypt(blob: ByteArray): ByteArray {
            if (encryptionKey == null) {
                throw BackupError.requiresSetup
            }

            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            val random = SecureRandom()
            val nonce = ByteArray(12)
            random.nextBytes(nonce)

            val gcmParameterSpec = GCMParameterSpec(128, nonce)

            cipher.init(Cipher.ENCRYPT_MODE, encryptionKey, gcmParameterSpec)
            val cipherBytes = cipher.doFinal(blob)
            return nonce + cipherBytes
        }

        private fun hash(blob: ByteArray): String {
            val messageDigest = MessageDigest.getInstance("SHA-256")
            val hash = messageDigest.digest(blob)
            return hash.joinToString("") { String.format("%02x", it) }
        }

        private fun decrypt(blob: ByteArray): ByteArray {
            if (encryptionKey == null) {
                throw BackupError.requiresSetup
            }

            val nonce = blob.take(12).toByteArray()
            val encrypted = blob.copyOfRange(12, blob.size)

            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            val gcmSpec = GCMParameterSpec(128, nonce)

            cipher.init(Cipher.DECRYPT_MODE, encryptionKey, gcmSpec)
            val decryptedBytes = cipher.doFinal(encrypted)
            return decryptedBytes
        }

        @Throws(BackupError::class)
        fun persist(label: Label, bytes: ByteArray) {
            if (skipRemoteBackup) {
                return
            }

            if (pubKey == null || serverPubKey == null) {
                throw BackupError.requiresSetup
            }

            val pubKeyHex = pubKey!!.hexEncodedString()
            val encryptedBackup = encrypt(bytes)
            val signedHash = sign(hash(encryptedBackup))
            //Hash of pubKey+timestamp
            val clientChallenge = hash("$pubKeyHex${System.currentTimeMillis()}".toByteArray(Charsets.UTF_8))

            val url = backupUrl(Method.PERSIST, label)

            LdkEventEmitter.send(
                EventTypes.native_log,
                "Sending backup to $url"
            )

            val urlConnection = url.openConnection() as HttpURLConnection
            urlConnection.requestMethod = "POST"
            urlConnection.doOutput = true
            urlConnection.setRequestProperty("Content-Type", "application/octet-stream")
            urlConnection.setRequestProperty("Signed-Hash", signedHash)
            urlConnection.setRequestProperty("Public-Key", pubKeyHex)
            urlConnection.setRequestProperty("Challenge", clientChallenge)

            val outputStream = urlConnection.outputStream
            outputStream.write(encryptedBackup)
            outputStream.close()

            if (urlConnection.responseCode != 200) {
                LdkEventEmitter.send(
                    EventTypes.native_log,
                    "Remote persist failed for ${label.string} with response code ${urlConnection.responseCode}"
                )

                throw InvalidServerResponse(urlConnection.responseCode)
            }

            //Verify signed response
            val inputStream = urlConnection.inputStream
            val jsonString = inputStream.bufferedReader().use { it.readText() }
            inputStream.close()

            val signature = JSONObject(jsonString).getString("signature")

            if (!verifySignature(clientChallenge, signature, serverPubKey!!)) {
                throw BackupError.serverChallengeResponseFailed
            }

            LdkEventEmitter.send(
                EventTypes.native_log,
                "Remote persist success for ${label.string}"
            )
        }

        @Throws(BackupError::class)
        fun retrieve(label: Label): ByteArray {
            val bearer = "TODO"
            val url = backupUrl(Method.RETRIEVE, label)

            LdkEventEmitter.send(
                EventTypes.native_log,
                "Retrieving backup from $url"
            )

            val urlConnection = url.openConnection() as HttpURLConnection
            urlConnection.requestMethod = "GET"
            urlConnection.setRequestProperty("Content-Type", "application/octet-stream")
            urlConnection.setRequestProperty("Authorization", bearer)

            val responseCode = urlConnection.responseCode

            if (responseCode == 404) {
                throw BackupError.missingBackup
            }

            if (responseCode != 200) {
                LdkEventEmitter.send(
                    EventTypes.native_log,
                    "Remote retrieve failed for ${label.string} with response code $responseCode"
                )

                throw InvalidServerResponse(responseCode)
            }

            val inputStream = urlConnection.inputStream
            val encryptedBackup = inputStream.readBytes()
            inputStream.close()

            LdkEventEmitter.send(
                EventTypes.native_log,
                "Remote retrieve success for ${label.string}"
            )

            val decryptedBackup = decrypt(encryptedBackup)

            return decryptedBackup
        }

        @Throws(BackupError::class)
        fun retrieveCompleteBackup(): CompleteBackup {
            val bearer = "TODO"

            val url = backupUrl(Method.LIST)

            LdkEventEmitter.send(
                EventTypes.native_log,
                "Retrieving backup from $url"
            )

            val urlConnection = url.openConnection() as HttpURLConnection
            urlConnection.requestMethod = "GET"
            urlConnection.setRequestProperty("Content-Type", "application/json")
            urlConnection.setRequestProperty("Authorization", bearer)

            val responseCode = urlConnection.responseCode

            if (responseCode == 404) {
                throw BackupError.missingBackup
            }

            if (responseCode != 200) {
                throw InvalidServerResponse(responseCode)
            }

            val inputStream = urlConnection.inputStream
            val jsonString = inputStream.bufferedReader().use { it.readText() }
            inputStream.close()

            val jsonObject = JSONObject(jsonString)

            val files = mutableMapOf<String, ByteArray>()
            val fileNames = jsonObject.getJSONArray("list")
            for (i in 0 until fileNames.length()) {
                val filename = fileNames.getString(i)
                files[filename] = retrieve(Label.MISC(filename))
            }

            val channelFiles = mutableMapOf<String, ByteArray>()
            val channelFileNames = jsonObject.getJSONArray("channel_monitors")
            for (i in 0 until channelFileNames.length()) {
                val filename = channelFileNames.getString(i)

                channelFiles[filename] = retrieve(Label.CHANNEL_MONITOR(channelId=filename.replace(".bin", "")))
            }

            return CompleteBackup(files = files, channelFiles = channelFiles)
        }

        @Throws(BackupError::class)
        fun selfCheck() {
            val ping = "ping${Random().nextInt(1000)}"
            persist(Label.PING(), ping.toByteArray())

            //TODO add check back
//            val pingRetrieved = BackupClient.retrieve(BackupClient.Label.PING())
//            if (pingRetrieved.toString(Charsets.UTF_8) != ping) {
//
//            }
        }

        fun sign(message: String): String {
            if (secretKey == null) {
                throw BackupError.requiresSetup
            }

            val res = UtilMethods.sign("$signedMessagePrefix$message".toByteArray(Charsets.UTF_8), secretKey)
            if (!res.is_ok) {
                throw BackupError.signingError
            }

            return (res as Result_StringErrorZ_OK).res
        }

        private fun verifySignature(message: String, signature: String, pubKey: String): Boolean {
            return UtilMethods.verify(
                "$signedMessagePrefix$message".toByteArray(Charsets.UTF_8),
                signature,
                pubKey.hexa()
            )
        }
    }
}
