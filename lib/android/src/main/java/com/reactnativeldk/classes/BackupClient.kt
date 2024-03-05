package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.reactnativeldk.UiThreadDebouncer
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import com.reactnativeldk.hexEncodedString
import com.reactnativeldk.hexa
import com.reactnativeldk.putDateOrNull
import org.json.JSONObject
import org.ldk.structs.Result_StrSecp256k1ErrorZ.Result_StrSecp256k1ErrorZ_OK
import org.ldk.structs.UtilMethods
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Date
import java.util.Random
import java.util.UUID
import java.util.concurrent.locks.ReentrantLock
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

class BackupError : Exception() {
    companion object {
        val requiresSetup = RequiresSetup()
        val missingBackup = MissingBackup()
        val signingError = SigningError()
        val serverChallengeResponseFailed = ServerChallengeResponseFailed()
        val checkError = BackupCheckError()
    }
}

class RequiresSetup() : Exception("BackupClient requires setup")
class MissingBackup() : Exception("Retrieve failed. Missing backup.")
class InvalidServerResponse(code: Int) : Exception("Invalid backup server response ($code)")
class DecryptFailed(msg: String) : Exception("Failed to decrypt backup payload. $msg")
class SigningError() : Exception("Failed to sign message")
class ServerChallengeResponseFailed() : Exception("Server challenge response failed")
class BackupCheckError() : Exception("Backup self check failed")

class CompleteBackup(
    val files: Map<String, ByteArray>,
    val channelFiles: Map<String, ByteArray>
)

typealias BackupCompleteCallback = (Exception?) -> Unit

class BackupQueueEntry(
    val uuid: UUID,
    val label: BackupClient.Label,
    val bytes: ByteArray,
    val callback: BackupCompleteCallback? = null
)

data class BackupFileState(
    var lastQueued: Date,
    var lastPersisted: Date?,
    var lastFailed: Date?,
    var lastErrorMessage: String?
) {
    val encoded: WritableMap
        get() {
            val body = Arguments.createMap()
            body.putDouble("lastQueued", lastQueued.time.toDouble())
            body.putDateOrNull("lastPersisted", lastPersisted)
            body.putDateOrNull("lastFailed", lastFailed)
            if (lastErrorMessage != null) {
                body.putString("lastErrorMessage", lastErrorMessage)
            } else {
                body.putNull("lastErrorMessage")
            }

            return body
        }
}

sealed class BackupStateUpdateType {
    object Queued : BackupStateUpdateType()
    object Success : BackupStateUpdateType()
    data class Fail(val e: Exception) : BackupStateUpdateType()
}

class BackupClient {
    sealed class Label(val string: String, channelId: String = "") {
        data class PING(val customName: String = "") : Label("ping")
        data class CHANNEL_MANAGER(val customName: String = "") : Label("channel_manager")
        data class CHANNEL_MONITOR(val customName: String = "", val channelId: String) :
            Label("channel_monitor")

        data class MISC(val customName: String) :
            Label(customName.replace(".json", "").replace(".bin", ""))

        val queueId: String
            get() = when (this) {
                is CHANNEL_MONITOR -> "$string-$channelId"
                is MISC -> "$string-$customName"
                else -> string
            }

        val backupStateKey: String?
            get() = when (this) {
                is CHANNEL_MANAGER -> "$string"
                is CHANNEL_MONITOR -> "${string}_${channelId}"
                is MISC -> "$string"
                else -> null
            }
    }

    companion object {
        enum class Method(val value: String) {
            PERSIST("persist"),
            RETRIEVE("retrieve"),
            LIST("list"),
            AUTH_CHALLENGE("auth/challenge"),
            AUTH_RESPONSE("auth/response")
        }

        class CachedBearer(
            val bearer: String,
            val expires: Long
        )

        private var version = "v1"
        private var signedMessagePrefix = "react-native-ldk backup server auth:"

        private var persistQueues: HashMap<String, ArrayList<BackupQueueEntry>> = HashMap()
        private var persistQueuesLock: HashMap<String, Boolean> = HashMap()

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
        private var cachedBearer: CachedBearer? = null

        val requiresSetup: Boolean
            get() = server == null

        private var backupState: HashMap<String, BackupFileState> = HashMap()

        fun setup(secretKey: ByteArray, pubKey: ByteArray, network: String, server: String, serverPubKey: String) {
            this.secretKey = secretKey
            this.pubKey = pubKey
            this.network = network
            this.server = server
            this.serverPubKey = serverPubKey
            this.cachedBearer = null

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

            if (method == Method.LIST) {
                urlString += "&fileGroup=ldk"
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

        @Throws(BackupError::class)
        private fun decrypt(blob: ByteArray): ByteArray {
            try {
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
            } catch (e: Exception) {
                throw DecryptFailed(e.message ?: "")
            }
        }

        @Throws(BackupError::class)
        private fun persist(label: Label, bytes: ByteArray, retry: Int, onTryFail: ((Exception) -> Unit)) {
            var attempts = 0
            var persistError: Exception? = null

            while (attempts < retry) {
                try {
                    persist(label, bytes)

                    LdkEventEmitter.send(
                        EventTypes.native_log,
                        "Remote persist success for ${label.string} after ${attempts+1} attempts"
                    )
                    return
                } catch (error: Exception) {
                    persistError = error
                    onTryFail(error)
                    attempts += 1
                    LdkEventEmitter.send(
                        EventTypes.native_log,
                        "Remote persist failed for ${label.string} ($attempts attempts)"
                    )
                    Thread.sleep(attempts.toLong()) // Ease off with each attempt
                }
            }

            if (persistError != null) {
                throw persistError
            }
        }

        @Throws(BackupError::class)
        private fun persist(label: Label, bytes: ByteArray) {
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
            val bearer = authToken()
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
        fun listFiles(): Pair<Array<String>, Array<String>> {
            val bearer = authToken()

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
            val fileList = jsonObject.getJSONArray("list")
            val channelFileList = jsonObject.getJSONArray("channel_monitors")

            println("fileList: $fileList")

            return Pair(
                Array(fileList.length()) { idx ->
                    fileList.getString(idx)
                },
                Array(channelFileList.length()) { idx ->
                    channelFileList.getString(idx)
                },
            )
        }

        @Throws(BackupError::class)
        fun retrieveCompleteBackup(): CompleteBackup {
            val list = listFiles()
            val fileNames = list.first
            val channelFileNames = list.second

            val files = mutableMapOf<String, ByteArray>()
            for (fileName in fileNames) {
                files[fileName] = retrieve(Label.MISC(fileName))
            }

            val channelFiles = mutableMapOf<String, ByteArray>()
            for (fileName in channelFileNames) {
                channelFiles[fileName] = retrieve(Label.CHANNEL_MONITOR(channelId=fileName.replace(".bin", "")))
            }

            return CompleteBackup(files = files, channelFiles = channelFiles)
        }

        @Throws(BackupError::class)
        fun selfCheck() {
            val ping = "ping${Random().nextInt(1000)}"
            persist(Label.PING(), ping.toByteArray())

            val pingRetrieved = retrieve(Label.PING())
            if (pingRetrieved.toString(Charsets.UTF_8) != ping) {
                LdkEventEmitter.send(
                    EventTypes.native_log,
                    "Backup check failed to verify ping content."
                )

                throw BackupError.checkError
            }
        }

        private fun sign(message: String): String {
            if (secretKey == null) {
                throw BackupError.requiresSetup
            }

            val res = UtilMethods.sign("$signedMessagePrefix$message".toByteArray(Charsets.UTF_8), secretKey)
            if (!res.is_ok) {
                throw BackupError.signingError
            }

            return (res as Result_StrSecp256k1ErrorZ_OK).res
        }

        private fun verifySignature(message: String, signature: String, pubKey: String): Boolean {
            return UtilMethods.verify(
                "$signedMessagePrefix$message".toByteArray(Charsets.UTF_8),
                signature,
                pubKey.hexa()
            )
        }

        @Throws(BackupError::class)
        private fun authToken(): String {
            if (cachedBearer != null && cachedBearer!!.expires > System.currentTimeMillis()) {
                return cachedBearer!!.bearer
            }

            if (pubKey == null) {
                throw BackupError.requiresSetup
            }

            //Fetch challenge with signed timestamp as nonce
            val pubKeyHex = pubKey!!.hexEncodedString()
            val timestamp = System.currentTimeMillis()
            val payload = JSONObject(
                mapOf(
                    "timestamp" to timestamp,
                    "signature" to sign(timestamp.toString())
                )
            )

            val url = backupUrl(Method.AUTH_CHALLENGE)

            val urlConnection = url.openConnection() as HttpURLConnection
            urlConnection.requestMethod = "POST"
            urlConnection.setRequestProperty("Content-Type", "application/json")
            urlConnection.setRequestProperty("Public-Key", pubKeyHex)
            val outputStream = urlConnection.outputStream
            outputStream.write(payload.toString().toByteArray())
            outputStream.close()

            if (urlConnection.responseCode != 200) {
                LdkEventEmitter.send(
                    EventTypes.native_log,
                    "Fetch server challenge failed."
                )

                throw InvalidServerResponse(urlConnection.responseCode)
            }

            val inputStream = urlConnection.inputStream
            val jsonString = inputStream.bufferedReader().use { it.readText() }
            inputStream.close()
            val challenge = JSONObject(jsonString).getString("challenge")

            //Sign challenge and fetch bearer token
            val urlBearer = backupUrl(Method.AUTH_RESPONSE)
            val urlConnectionBearer = urlBearer.openConnection() as HttpURLConnection
            urlConnectionBearer.requestMethod = "POST"
            urlConnectionBearer.setRequestProperty("Content-Type", "application/json")
            urlConnectionBearer.setRequestProperty("Public-Key", pubKeyHex)
            val outputStreamBearer = urlConnectionBearer.outputStream
            outputStreamBearer.write(JSONObject(
                mapOf(
                    "signature" to sign(challenge)
                )
            ).toString().toByteArray())
            outputStreamBearer.close()

            if (urlConnectionBearer.responseCode != 200) {
                LdkEventEmitter.send(
                    EventTypes.native_log,
                    "Fetch bearer token failed."
                )

                throw InvalidServerResponse(urlConnection.responseCode)
            }

            val inputStreamBearer = urlConnectionBearer.inputStream
            val jsonBearer = JSONObject(inputStreamBearer.bufferedReader().use { it.readText() })
            inputStreamBearer.close()
            val bearer = jsonBearer.getString("bearer")
            val expires = jsonBearer.getLong("expires")

            cachedBearer = CachedBearer(bearer, expires)
            return bearer
        }

        private val backupStateLock = ReentrantLock()
        private fun updateBackupState(label: Label, type: BackupStateUpdateType) {
            if (label.backupStateKey == null) {
                return
            }

            backupStateLock.lock()
            backupState[label.backupStateKey!!] = backupState[label.backupStateKey!!] ?: BackupFileState(
                Date(),
                null,
                null,
                null
            )

            when (type) {
                is BackupStateUpdateType.Queued -> {
                    backupState[label.backupStateKey!!]!!.lastQueued = Date()
                    backupState[label.backupStateKey!!]!!.lastFailed = null
                    backupState[label.backupStateKey!!]!!.lastErrorMessage = null
                }
                is BackupStateUpdateType.Success -> {
                    backupState[label.backupStateKey!!]!!.lastPersisted = Date()
                    backupState[label.backupStateKey!!]!!.lastFailed = null
                    backupState[label.backupStateKey!!]!!.lastErrorMessage = null
                }
                is BackupStateUpdateType.Fail -> {
                    backupState[label.backupStateKey!!]!!.lastFailed = Date()
                    backupState[label.backupStateKey!!]!!.lastErrorMessage = type.e.message
                }
            }

            val body = Arguments.createMap()
            backupState.forEach { (key, state) ->
                body.putMap(key, state.encoded)
            }

            UiThreadDebouncer.debounce(interval = 250, key = "backupStateUpdate") {
                LdkEventEmitter.send(EventTypes.backup_state_update, body)
            }

            backupStateLock.unlock()
        }

        //Backup queue management
        fun addToPersistQueue(label: Label, bytes: ByteArray, callback: BackupCompleteCallback? = null) {
            if (BackupClient.skipRemoteBackup) {
                callback?.invoke(null)
                LdkEventEmitter.send(
                    EventTypes.native_log,
                    "Skipping remote backup queue append for ${label.string}"
                )
                return
            }

            persistQueues[label.queueId] = persistQueues[label.queueId] ?: ArrayList()
            persistQueues[label.queueId]!!.add(BackupQueueEntry(UUID.randomUUID(), label, bytes, callback))

            updateBackupState(label, BackupStateUpdateType.Queued)

            processPersistNextInQueue(label)
        }

        private val backupQueueLock = ReentrantLock()
        private fun processPersistNextInQueue(label: Label) {
            //Check if queue is locked, if not lock it and process next in queue
            var backupEntry: BackupQueueEntry? = null
            backupQueueLock.lock()
            try {
                if (persistQueuesLock[label.queueId] == true) {
                    return
                }

                persistQueuesLock[label.queueId] = true

                backupEntry = persistQueues[label.queueId]?.firstOrNull()
                if (backupEntry == null) {
                    persistQueuesLock[label.queueId] = false
                    return
                }
            } finally {
                backupQueueLock.unlock()
            }

            Thread {
                try {
                    persist(backupEntry!!.label, backupEntry.bytes, 10) {
                        updateBackupState(label, BackupStateUpdateType.Fail(it))
                    }

                    updateBackupState(label, BackupStateUpdateType.Success)
                    backupEntry.callback?.invoke(null)
                } catch (e: Exception) {
                    LdkEventEmitter.send(
                        EventTypes.native_log,
                        "Remote persist failed for ${label.string} with error ${e.message}"
                    )
                    updateBackupState(label, BackupStateUpdateType.Fail(e))
                    backupEntry?.callback?.invoke(e)
                } finally {
                    backupQueueLock.lock()
                    try {
                        persistQueues[label.queueId]?.remove(backupEntry)
                        persistQueuesLock[label.queueId] = false
                    } finally {
                        backupQueueLock.unlock()
                    }

                    processPersistNextInQueue(label)
                }
            }.start()
        }
    }
}



