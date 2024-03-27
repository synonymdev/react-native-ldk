package com.reactnativeldk

import com.facebook.react.bridge.JavaOnlyArray
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.reactnativeldk.testutils.ShadowArguments
import org.junit.Before
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith
import org.ldk.impl.bindings.get_ldk_version
import org.mockito.kotlin.any
import org.mockito.kotlin.check
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.isNull
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import java.io.File
import kotlin.test.assertTrue

private const val FS_ROOT = "build/test-files"

private val INVOICE_EXPIRED =
    "lnbcrt120n1pjlrxz9pp599l2jlsrt4qeczdyh90rzhfsfrkxhu6dged8yhfyhw0kt3sfzsyqdqdw4hxjaz5v4ehgcqzzsxqyz5vqsp54ehunpcenrejgq4tfwr8a4s5tlyrchhk27e70a0vagwr60n8mwhq9qyyssq5t6dqjwu4r6rnjfz7uk9mx0p2h2rxlr00fqyzjtudglay6lzfqp370ml6y8hnwfz8eamhdt4nu7s6jwy64gd9gtl9t8zz5l67cq6j6qqkgmr5v"

@Config(
    manifest = Config.NONE,
    shadows = [ShadowArguments::class],
)
@RunWith(RobolectricTestRunner::class)
class LdkModuleTest {
    private val eventEmitter = mock<RCTDeviceEventEmitter>()
    private val reactContext = mock<ReactApplicationContext> {
        on { getJSModule(RCTDeviceEventEmitter::class.java) } doReturn eventEmitter
    }

    private val randomSeed = "fcab948ff9fdc573d53901ce825b4999307af9dbe36b9d2afce75f2edcb11d2d"
    private val backupServer = "http://0.0.0.0:3003"
    private val backupServerPubKey = "serverPubKey"
    private val regtest = "regtest"

    private val accountStoragePath = "$FS_ROOT/wallet0"
    private val logsPath = "$accountStoragePath/logs/ldk.log"

    private val blockHash = "207b2b781f08be676158d834393c4ae7615e5ea9c8740ca046fc948d2ae1da6f"
    private val blockHeight = 21795.0

    private lateinit var _promise: Promise
    private lateinit var ldkModule: LdkModule

    @Before
    fun setUp() {
        _promise = mock<Promise>()
        ldkModule = LdkModule(reactContext)
    }

    // MARK: Startup methods

    @Test
    fun test_init() {
        assertTrue { ldkModule.name == "Ldk" }
        assertTrue { LdkModule.accountStoragePath == "" }
        assertTrue { LdkModule.channelStoragePath == "" }
    }

    @Test
    fun test_setAccountStoragePath() {
        val promise = mock<Promise>()

        ldkModule.setAccountStoragePath(accountStoragePath, promise)

        assertTrue { LdkModule.accountStoragePath.endsWith(accountStoragePath) }
        assertTrue { LdkModule.channelStoragePath.contains(accountStoragePath) }
        verify(promise).resolve(LdkCallbackResponses.storage_path_set.name)
    }

    @Test
    fun test_setLogFilePath() {
        val promise = mock<Promise>()

        ldkModule.setLogFilePath(logsPath, promise)

        verify(promise).resolve(LdkCallbackResponses.log_path_updated.name)
    }

    @Test
    fun test_writeToLogFile() {
        // TODO Refactor to remove file reading in tests
        val line = "test"
        ldkModule.setLogFilePath(logsPath, _promise)

        ldkModule.writeToLogFile(line, _promise)

        assertTrue { File(logsPath).readText().endsWith("$line\n") }
    }

    @Test
    fun test_initKeysManager() {
        // TODO Test error cases
        initKeysManager()

        verify(_promise).resolve(LdkCallbackResponses.keys_manager_init_success.name)
    }

    @Test
    fun test_initUserConfig() {
        // TODO Extend to check expected configs are set
        ldkModule.initUserConfig(mock(), _promise)

        verify(_promise).resolve(LdkCallbackResponses.config_init_success.name)
    }

    @Test
    fun test_initNetworkGraph() {
        // TODO Extend
        val promise = mock<Promise>()
        initStorage()

        initNetworkGraph(promise)

        verify(promise).resolve(LdkCallbackResponses.network_graph_init_success.name)
    }

    @Ignore("No downloads in tests")
    @Test
    fun test_downloadScorer() {
        ldkModule.downloadScorer("url", 0.1, _promise)

        verify(_promise).resolve(LdkCallbackResponses.scorer_download_success.name)
    }

    @Test
    fun test_initChannelManager() {
        // TODO extend to check other exit points
        val promise = mock<Promise>()
        initStorage()
        initKeysManager()
        initUserConfig()
        initNetworkGraph(promise)

        ldkModule.initChannelManager(regtest, blockHash, blockHeight, promise)

        verify(promise).resolve(LdkCallbackResponses.channel_manager_init_success.name)
    }

    @Test
    fun test_restart() {
        // TODO extend to check non-happy flows
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.restart(promise)

        verify(eventEmitter).emit(eq(EventTypes.channel_manager_restarted.name), any())
        verify(promise).resolve(LdkCallbackResponses.ldk_restart.name)
    }

    @Test
    fun test_stop() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.stop(promise)

        verify(promise).resolve(LdkCallbackResponses.ldk_stop.name)
    }

    // MARK: Update methods

    @Test
    fun test_updateFees() {
        val promise = mock<Promise>()

        ldkModule.updateFees(
            1.0,
            2.0,
            3.0,
            4.0,
            5.0,
            5.0,
            promise
        )

        verify(promise).resolve(LdkCallbackResponses.fees_updated.name)
    }

    @Test
    fun test_setLogLevel() {
        ldkModule.setLogLevel("INFO", true, _promise)
        ldkModule.setLogLevel("WARN", true, _promise)
        ldkModule.setLogLevel("ERROR", true, _promise)
        ldkModule.setLogLevel("DEBUG", true, _promise)

        verify(_promise, times(4)).resolve(LdkCallbackResponses.log_level_updated.name)
    }

    @Test
    fun test_syncToTip() {
        // TODO extend to check non-happy flows
        val promise = mock<Promise>()
        val newHeader =
            "00000020f37e0babff84b49ebe154a828220a9964b4a4013e7293b48c7f9d5bc0323f464569f4f647e27085c9f2dab72c710f55b5d43fdf0ffc9ef63b3759427afbfe94981a8ec65ffff7f2001000000"
        val newHeight = 21806.0
        val newBlockHash = "207b2b781f08be676158d834393c4ae7615e5ea9c8740ca046fc948d2ae1da6f"
        setupChannelManager()

        ldkModule.syncToTip(newHeader, newBlockHash, newHeight, promise)

        verify(promise).resolve(LdkCallbackResponses.chain_sync_success.name)
    }

    @Test
    @Ignore("No networking in tests")
    fun test_addPeer() {
        val promise = mock<Promise>()
        setupChannelManager()

        val pubKey = "027b2b7158f8f4995629eaa7710aa06bb0d1d9d53adfd6dfff60a91314726f352b"
        ldkModule.addPeer(
            address = "127.0.0.1",
            port = 9735.0,
            pubKey = pubKey,
            timeout = 1.0,
            promise
        )

        verify(promise).resolve(LdkCallbackResponses.add_peer_success.name)
    }

    @Test
    fun test_setTxConfirmed() {
        val promise = mock<Promise>()
        // TODO add txData to test, if figured out how to get Rust code not to panic
        val newHeader =
            "00000020f37e0babff84b49ebe154a828220a9964b4a4013e7293b48c7f9d5bc0323f464569f4f647e27085c9f2dab72c710f55b5d43fdf0ffc9ef63b3759427afbfe94981a8ec65ffff7f2001000000"
        val newHeight = 21806.0
        // val txArrayList = arrayListOf<Any>(
        //     hashMapOf(
        //         "transaction" to "7433e396972882e249b1c1773919ed4ebbaccf88f89277b18a745db883e3a7da",
        //         "pos" to 0.0
        //     )
        // )
        val txData = mock<ReadableArray> {
            // on { toArrayList() } doReturn txArrayList
        }
        setupChannelManager()

        ldkModule.setTxConfirmed(newHeader, txData, newHeight, promise)

        verify(promise).resolve(LdkCallbackResponses.tx_set_confirmed.name)
    }

    @Test
    fun test_setTxUnconfirmed() {
        val promise = mock<Promise>()
        val txId = "7433e396972882e249b1c1773919ed4ebbaccf88f89277b18a745db883e3a7da"
        setupChannelManager()

        ldkModule.setTxUnconfirmed(txId, promise)

        verify(promise).resolve(LdkCallbackResponses.tx_set_unconfirmed.name)
    }

    @Test
    @Ignore("Probably too complex for unit tests?! Current err: 'Can't find a peer matching the passed counterparty node_id'")
    fun test_acceptChannel() {
        // TODO test error cases
        val promise = mock<Promise>()
        // val pubKey = "027b2b7158f8f4995629eaa7710aa06bb0d1d9d53adfd6dfff60a91314726f352b"
        // ldkModule.addPeer(address = "127.0.0.1", port = 9735.0, pubKey = pubKey, timeout = 1.0, promise)
        val temporaryChannelId = "54b490a65d999b63c5a1f3abb0a429e45a51dfffc4dbdcca5f158f034b546652"
        val counterPartyNodeId =
            "027b2b7158f8f4995629eaa7710aa06bb0d1d9d53adfd6dfff60a91314726f352b"
        val trustedPeer0Conf = true
        setupChannelManager()

        ldkModule.acceptChannel(temporaryChannelId, counterPartyNodeId, trustedPeer0Conf, promise)

        verify(promise).resolve(LdkCallbackResponses.accept_channel_success.name)
    }

    @Test
    @Ignore("Probably too complex for unit tests?! Current err: 'Can't find a peer matching the passed counterparty node_id'")
    fun test_closeChannel() {
        // TODO test error cases
        val promise = mock<Promise>()
        // val pubKey = "027b2b7158f8f4995629eaa7710aa06bb0d1d9d53adfd6dfff60a91314726f352b"
        // ldkModule.addPeer(address = "127.0.0.1", port = 9735.0, pubKey = pubKey, timeout = 1.0, promise)
        val channelId = "f0f0d39c66b7fda6cc4707abcf84144fa01ffc9ac3f4b6b6561f6ad030129435"
        val counterPartyNodeId =
            "027b2b7158f8f4995629eaa7710aa06bb0d1d9d53adfd6dfff60a91314726f352b"
        setupChannelManager()

        ldkModule.closeChannel(channelId, counterPartyNodeId, false, _promise)

        verify(promise).resolve(LdkCallbackResponses.close_channel_success.name)
    }

    @Test
    fun test_forceCloseAllChannels() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.forceCloseAllChannels(false, promise)

        verify(promise).resolve(LdkCallbackResponses.close_channel_success.name)
    }

    @Ignore("Too complex for unit tests?! parked for now")
    @Test
    fun test_spendOutputs() {
        setupChannelManager()
        ldkModule.spendOutputs(mock(), mock(), "script", 1.0, _promise)
    }

    // MARK: Payments

    @Test
    fun test_decode() {
        ldkModule.decode(INVOICE_EXPIRED, _promise)

        verify(_promise).resolve(check<ReadableMap> {
            // Schema
            assertTrue { it.hasKey("description") }
            assertTrue { it.hasKey("check_signature") }
            assertTrue { it.hasKey("is_expired") }
            assertTrue { it.hasKey("duration_since_epoch") }
            assertTrue { it.hasKey("expiry_time") }
            assertTrue { it.hasKey("min_final_cltv_expiry") }
            assertTrue { it.hasKey("payee_pub_key") }
            assertTrue { it.hasKey("recover_payee_pub_key") }
            assertTrue { it.hasKey("payment_hash") }
            assertTrue { it.hasKey("payment_secret") }
            assertTrue { it.hasKey("timestamp") }
            assertTrue { it.hasKey("features") }
            assertTrue { it.hasKey("currency") }
            assertTrue { it.hasKey("to_str") }
            assertTrue { it.hasKey("route_hints") }
            // Values
            assertTrue { it.getString("description") == "unitTest" }
            assertTrue { it.getDouble("amount_satoshis") == 12.0 }
            assertTrue { it.getString("to_str") == INVOICE_EXPIRED }
        })
    }

    @Test
    fun test_pay_expiredInvoice() {
        // TODO: Add test for happy flow + other error cases
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.pay(INVOICE_EXPIRED, 0.0, 2.5, promise)

        verify(promise).reject(
            eq(LdkErrors.invoice_payment_fail_payment_expired.name),
            eq(LdkErrors.invoice_payment_fail_payment_expired.name),
        )
    }

    @Test
    fun test_abandonPayment() {
        val paymentId = "297ea97e035d419c09a4b95e315d3048ec6bf34d465a725d24bb9f65c6091408"
        setupChannelManager()

        ldkModule.abandonPayment(paymentId, _promise)

        verify(_promise).resolve(LdkCallbackResponses.abandon_payment_success.name)
    }

    @Test
    fun test_createPaymentRequest() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.createPaymentRequest(11.0, "test", 3600.0, promise)

        verify(promise).resolve(check<ReadableMap> {
            // Schema
            assertTrue { it.hasKey("description") }
            assertTrue { it.hasKey("check_signature") }
            assertTrue { it.hasKey("is_expired") }
            assertTrue { it.hasKey("duration_since_epoch") }
            assertTrue { it.hasKey("expiry_time") }
            assertTrue { it.hasKey("min_final_cltv_expiry") }
            assertTrue { it.hasKey("payee_pub_key") }
            assertTrue { it.hasKey("recover_payee_pub_key") }
            assertTrue { it.hasKey("payment_hash") }
            assertTrue { it.hasKey("payment_secret") }
            assertTrue { it.hasKey("timestamp") }
            assertTrue { it.hasKey("features") }
            assertTrue { it.hasKey("currency") }
            assertTrue { it.hasKey("to_str") }
            assertTrue { it.hasKey("route_hints") }
            // Values
            assertTrue { it.getString("description") == "test" }
        })
    }

    @Test
    fun test_processPendingHtlcForwards() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.processPendingHtlcForwards(promise)

        verify(promise).resolve(LdkCallbackResponses.process_pending_htlc_forwards_success.name)
    }

    @Test
    fun test_claimFunds() {
        val promise = mock<Promise>()
        val paymentPreImage = "297ea97e035d419c09a4b95e315d3048ec6bf34d465a725d24bb9f65c6091408"
        setupChannelManager()

        ldkModule.claimFunds(paymentPreImage, promise)

        verify(promise).resolve(LdkCallbackResponses.claim_funds_success.name)
    }

    // MARK: Fetch methods
    @Test
    fun test_version() {
        ldkModule.version(_promise)

        verify(_promise).resolve(check<String> {
            assertTrue { it.contains("c_bindings") }
            assertTrue { it.contains("ldk") }
        })
    }

    @Test
    fun test_nodeId() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.nodeId(promise)

        verify(promise).resolve(check<String> {
            assertTrue { it.length == 66 }
        })
    }

    @Test
    fun test_listPeers() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.listPeers(promise)

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_listChannels() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.listChannels(promise)

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_listUsableChannels() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.listUsableChannels(promise)

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_listChannelFiles() {
        val promise = mock<Promise>()
        initStorage()

        ldkModule.listChannelFiles(promise)

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_networkGraphListNodeIds() {
        val promise = mock<Promise>()
        initNetworkGraph()

        ldkModule.networkGraphListNodeIds(promise)

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_networkGraphNodes() {
        val promise = mock<Promise>()
        initNetworkGraph()

        ldkModule.networkGraphNodes(JavaOnlyArray(), promise)

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_networkGraphListChannels() {
        val promise = mock<Promise>()
        initNetworkGraph()

        ldkModule.networkGraphListChannels(promise)

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_networkGraphChannel() {
        val promise = mock<Promise>()
        initNetworkGraph()

        ldkModule.networkGraphChannel("1", promise)

        verify(promise).resolve(isNull())
    }

    @Test
    fun test_claimableBalances() {
        // TODO: test happy flow w/ claimable balances
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.claimableBalances(true, promise)

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_writeToFile() {
        val promise = mock<Promise>()
        val fileName = "test-file.txt"
        val content = "test"
        initStorage()

        ldkModule.writeToFile(fileName, "", content, "", false, promise)

        verify(promise).resolve(LdkCallbackResponses.file_write_success.name)
    }

    @Test
    fun test_readFromFile() {
        val promise = mock<Promise>()
        val fileName = "test-file.txt"
        val content = "test"
        initStorage()
        ldkModule.writeToFile(fileName, "", content, "", false, this._promise)

        ldkModule.readFromFile(fileName, "", "", promise)

        verify(promise).resolve(check<ReadableMap> {
            assertTrue { it.hasKey("content") }
            assertTrue { it.hasKey("timestamp") }
            assertTrue { it.getString("content") == content }
        })
    }

    // MARK: Misc methods

    @Test
    fun test_reconstructAndSpendOutputs() {
        // TODO: extend
        val promise = mock<Promise>()
        val outTxId = "7433e396972882e249b1c1773919ed4ebbaccf88f89277b18a745db883e3a7da"
        val outIndex = 0.0
        val outValue = 1.0
        val changeDestScript = "03a6406c95e3df5300a7bf7fbd86352fb39db94a52ffae2b12feafe0b3f0aab51c"
        val outPubKey = "0b6bd267533b7b8883e8690ad9b951d8f0642c23"
        val feeRate = 1.0
        setupChannelManager()

        ldkModule.reconstructAndSpendOutputs(
            outPubKey,
            outValue,
            outTxId,
            outIndex,
            feeRate,
            changeDestScript,
            promise
        )

        verify(promise).resolve(check<String> {
            assertTrue { it.length == 24 }
        })
    }

    @Test
    fun test_spendRecoveredForceCloseOutputs() {
        // TODO: extend
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.spendRecoveredForceCloseOutputs(
            "transaction",
            1.0,
            "changeDestinationScript",
            promise
        )

        verify(promise).resolve(check<ReadableArray> {
            assertTrue { it.size() == 0 }
        })
    }

    @Test
    fun test_nodeSign() {
        val message = "test"
        val expected =
            "d6f89jkci9emiq47kt3g4m1k5zog3fyz15ga6jaoorxgsge4o589yh1wj4tjx4qtew19oke4rtdkw39ze7kh1ixmbcz8sxzrkq4u5n9q"
        val promise = mock<Promise>()
        initKeysManager()

        ldkModule.nodeSign(message, promise)

        verify(promise).resolve(expected)
    }

    @Test
    fun test_nodeStateDump() {
        val promise = mock<Promise>()
        setupChannelManager()

        ldkModule.nodeStateDump(promise)

        verify(promise).resolve(check<String> {
            assertTrue { it.startsWith("********NODE STATE********") }
        })
    }

    // MARK: Backups

    // TODO: Extract BackupClient as constructor param to enhance testability

    @Test
    fun test_backupSetup() {
        val promise = mock<Promise>()

        ldkModule.backupSetup(randomSeed, regtest, backupServer, backupServerPubKey, promise)

        verify(promise).resolve(LdkCallbackResponses.backup_client_setup_success.name)
    }

    @Ignore("No http in tests")
    @Test
    fun test_restoreFromRemoteBackup() {
        backupSetup()

        ldkModule.restoreFromRemoteBackup(false, _promise)
    }

    @Ignore("No http in tests")
    @Test
    fun test_backupSelfCheck() {
        backupSetup()

        ldkModule.backupSelfCheck(_promise)
    }

    @Ignore("No http in tests")
    @Test
    fun test_backupListFiles() {
        backupSetup()

        ldkModule.backupListFiles(_promise)
    }

    @Ignore("No http in tests")
    @Test
    fun test_backupFile() {
        backupSetup()

        ldkModule.backupFile("file", "content", _promise)
    }

    @Ignore("No http in tests")
    @Test
    fun test_fetchBackupFile() {
        backupSetup()

        ldkModule.fetchBackupFile("file", _promise)
    }

    // MARK: Helpers

    private fun initStorage() {
        ldkModule.setAccountStoragePath(accountStoragePath, _promise)
        ldkModule.setLogFilePath(logsPath, _promise)
    }

    private fun initKeysManager() {
        val destScriptPubKey = "03a6406c95e3df5300a7bf7fbd86352fb39db94a52ffae2b12feafe0b3f0aab51c"
        val witnessProgram = "0b6bd267533b7b8883e8690ad9b951d8f0642c23"
        val witnessProgramVer = 1.0

        ldkModule.initKeysManager(
            randomSeed,
            destScriptPubKey,
            witnessProgram,
            witnessProgramVer,
            _promise
        )
    }

    private fun setupChannelManager() {
        initStorage()
        initKeysManager()
        initUserConfig()
        initNetworkGraph()
        ldkModule.initChannelManager(regtest, blockHash, blockHeight, _promise)
    }

    private fun initUserConfig() {
        val userConfig = mock<ReadableMap>()

        ldkModule.initUserConfig(userConfig, _promise)
    }

    private fun initNetworkGraph(promise: Promise = _promise) {
        ldkModule.initNetworkGraph(
            network = regtest,
            rapidGossipSyncUrl = "",
            skipHoursThreshold = 3.0,
            promise = promise
        )
    }

    private fun backupSetup() {
        ldkModule.backupSetup(randomSeed, regtest, backupServer, backupServerPubKey, _promise)
    }
}
