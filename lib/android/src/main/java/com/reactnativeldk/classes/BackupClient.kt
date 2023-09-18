package com.reactnativeldk.classes
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import com.reactnativeldk.hexEncodedString
import com.reactnativeldk.hexa
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.security.SecureRandom
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
    }
}

class InvalidNetwork() : Exception("Invalid network passed to BackupClient setup")
class RequiresSetup() : Exception("BackupClient requires setup")
class MissingBackup() : Exception("Retrieve failed. Missing backup.")
class InvalidServerResponse(code: Int) : Exception("Invalid backup server response ($code)")
class DecryptFailed(msg: String) : Exception("Failed to decrypt backup payload. $msg")

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
            LIST("list")
        }

        var skipRemoteBackup = true //Allow dev to opt out (for development), will not throw error when attempting to persist

        private val version = "v1"
        var network: String? = null
        var server: String? = null
        var encryptionKey: SecretKeySpec? = null
        var token: String? = null

        var requiresSetup = {
            server == null
        }

        fun setup(seed: ByteArray, network: String, server: String, token: String) {
            this.network = network
            this.server = server
            this.encryptionKey = SecretKeySpec(seed, "AES")
            this.token = token
        }

        @Throws(BackupError::class)
        private fun backupUrl(
            method: Method,
            label: Label? = null,
            channelId: String = ""
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
            val iv = ByteArray(12)

            random.nextBytes(iv)

            val gcmParameterSpec = GCMParameterSpec(128, iv)

            cipher.init(Cipher.ENCRYPT_MODE, encryptionKey, gcmParameterSpec)

            // Encrypt the plain text
            val cipherText = cipher.doFinal(blob)

            // Return the IV concatenated with the cipher text
            return iv + cipherText
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

            val encryptedBackup = encrypt(bytes)
            val url = backupUrl(Method.PERSIST, label)

            LdkEventEmitter.send(
                EventTypes.native_log,
                "Sending backup to $url"
            )

            val urlConnection = url.openConnection() as HttpURLConnection
            urlConnection.requestMethod = "POST"
            urlConnection.doOutput = true
            urlConnection.setRequestProperty("Content-Type", "application/octet-stream")
            urlConnection.setRequestProperty("Authorization", token)

            val outputStream = urlConnection.outputStream
            outputStream.write(encryptedBackup)
            outputStream.close()

            val responseCode = urlConnection.responseCode
            LdkEventEmitter.send(
                EventTypes.native_log,
                "Remote persist success for ${label.string}"
            )
        }

        @Throws(BackupError::class)
        fun retrieve(label: Label): ByteArray {
            val url = backupUrl(Method.RETRIEVE, label)

            LdkEventEmitter.send(
                EventTypes.native_log,
                "Retrieving backup from $url"
            )

            val urlConnection = url.openConnection() as HttpURLConnection
            urlConnection.requestMethod = "GET"
            urlConnection.setRequestProperty("Content-Type", "application/octet-stream")
            urlConnection.setRequestProperty("Authorization", token)

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
            val url = backupUrl(Method.LIST)

            LdkEventEmitter.send(
                EventTypes.native_log,
                "Retrieving backup from $url"
            )

            val urlConnection = url.openConnection() as HttpURLConnection
            urlConnection.requestMethod = "GET"
            urlConnection.setRequestProperty("Content-Type", "application/json")
            urlConnection.setRequestProperty("Authorization", token)

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
    }
}