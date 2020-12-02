export type CurrentLndState = {
  lndRunning: boolean;
  walletUnlocked: boolean;
  grpcReady: boolean;
};

export enum GrpcMethods {
  getInfo = 'GetInfo',
  getWalletBalance = 'WalletBalance',
  newAddress = 'NewAddress',
  getChannelBalance = 'ChannelBalance',
  openChannelSync = 'OpenChannelSync',
  connectPeer = 'ConnectPeer',
  listChannels = 'ListChannels',
  sendPaymentSync = 'OpenChannelSync',
  closeChannel = 'CloseChannel',
  addInvoice = 'AddInvoice',
  listInvoices = 'ListInvoices'
}

export enum Networks {
  regtest = 'regtest',
  testnet = 'testnet',
  mainnet = 'mainnet'
}
