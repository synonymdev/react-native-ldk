import mempoolJS from '@mempool/mempool.js';
import { Vout } from '@mempool/mempool.js/lib/interfaces/bitcoin/transactions';
import { TTransactionData, TTransactionPosition, TVout } from '@synonymdev/react-native-ldk';
import { getAddressFromScriptPubKey, getScriptHash } from '../utils/helpers';
import { mempoolHostname } from '../utils/constants';

const { bitcoin: { blocks, transactions, addresses } } = mempoolJS({
  hostname: mempoolHostname,
  network: "regtest"
})

export const subScribeToBlocks = async () => {
  const {
    bitcoin: { websocket },
  } = mempoolJS({
    hostname: mempoolHostname,
  });

  const ws = websocket.initClient({
    options: ['blocks'],
  });

  ws.addEventListener('message', function incoming({data}) {
    console.log(data);
    const res = JSON.parse(data.toString());
    if (res.blocks) {
      console.log(res.blocks);
    }
  });
};

export const getTransactionData = async (transactionId:string)  => {
  const transaction = await transactions.getTx({txid: transactionId})
  const ldkVout: TVout[] = convertElectrsVoutToLdkVout(transaction.vout)

  const blockHeader = await blocks.getBlockHeader({hash: transaction.status.block_hash})
  const transactionData: TTransactionData = {
    header: blockHeader,
    height: transaction.status.block_height,
    transaction: transactionId,
    vout: ldkVout
  }

  return transactionData

}

export const convertElectrsVoutToLdkVout = (mempoolTxn: Vout[]): TVout[] => {
  let voutArray: TVout[] = []
  mempoolTxn.map(vout => {
    const ldkVout: TVout = {
      hex: vout.scriptpubkey,
      n: mempoolTxn.indexOf(vout),
      value: vout.value
    } 
    voutArray.push(ldkVout)
  })
  return voutArray
}

export const getTransactionPosition = async ({tx_hash, height}): Promise<TTransactionPosition> => {
  const merkleProof = await transactions.getTxMerkleProof({txid: tx_hash})
  const txMerkleProof = merkleProof.find(merkleProof => merkleProof.block_height === height)
  if (!txMerkleProof) {
    return -1
  }
  return txMerkleProof.pos
}

export const getScriptPubKeyHistory = async (scriptPubkey: string) => {
  const address = getAddressFromScriptPubKey(scriptPubkey)
  const scriptHash = getScriptHash(address)
  const scriptHashHistory = await addresses.getAddressTxs({address: scriptHash})

  let history: {txid: string, height: number}[] = []

  scriptHashHistory.map(result => {
    history.push({
      txid: result.txid,
      height: result.status.block_height
    })
  })
  return history
}

/**
 * Returns the balance in sats of the provided Bitcoin address.
 * @param {string} [address]
 * @returns {Promise<number>}
 */
export const getAddressBalance = async (address = ''): Promise<number> => {
	try {
    const addressBalance = await addresses.getAddress({address: address})
		return addressBalance.chain_stats.funded_txo_sum - addressBalance.chain_stats.spent_txo_sum;
	} catch {
		return 0;
	}
};

export const broadcastTransaction = async (rawTx: string) => {
  try {
    const transaction = await transactions.postTx({txhex: rawTx})
    return transaction
  } catch (e) {
    console.log("Error broadcasting transaction", e)
    return ''
  }
} 