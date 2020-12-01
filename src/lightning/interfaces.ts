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
  openChannel = 'OpenChannel',
  connectPeer = 'ConnectPeer',
  listChannels = 'ListChannels'
}
