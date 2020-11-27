import * as $protobuf from "protobufjs";
/** Namespace lnrpc. */
export namespace lnrpc {

    /** Represents a Lightning */
    class Lightning extends $protobuf.rpc.Service {

        /**
         * Constructs a new Lightning service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new Lightning service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Lightning;

        /**
         * Calls WalletBalance.
         * @param request WalletBalanceRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and WalletBalanceResponse
         */
        public walletBalance(request: lnrpc.IWalletBalanceRequest, callback: lnrpc.Lightning.WalletBalanceCallback): void;

        /**
         * Calls WalletBalance.
         * @param request WalletBalanceRequest message or plain object
         * @returns Promise
         */
        public walletBalance(request: lnrpc.IWalletBalanceRequest): Promise<lnrpc.WalletBalanceResponse>;

        /**
         * Calls ChannelBalance.
         * @param request ChannelBalanceRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ChannelBalanceResponse
         */
        public channelBalance(request: lnrpc.IChannelBalanceRequest, callback: lnrpc.Lightning.ChannelBalanceCallback): void;

        /**
         * Calls ChannelBalance.
         * @param request ChannelBalanceRequest message or plain object
         * @returns Promise
         */
        public channelBalance(request: lnrpc.IChannelBalanceRequest): Promise<lnrpc.ChannelBalanceResponse>;

        /**
         * Calls GetTransactions.
         * @param request GetTransactionsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and TransactionDetails
         */
        public getTransactions(request: lnrpc.IGetTransactionsRequest, callback: lnrpc.Lightning.GetTransactionsCallback): void;

        /**
         * Calls GetTransactions.
         * @param request GetTransactionsRequest message or plain object
         * @returns Promise
         */
        public getTransactions(request: lnrpc.IGetTransactionsRequest): Promise<lnrpc.TransactionDetails>;

        /**
         * Calls EstimateFee.
         * @param request EstimateFeeRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and EstimateFeeResponse
         */
        public estimateFee(request: lnrpc.IEstimateFeeRequest, callback: lnrpc.Lightning.EstimateFeeCallback): void;

        /**
         * Calls EstimateFee.
         * @param request EstimateFeeRequest message or plain object
         * @returns Promise
         */
        public estimateFee(request: lnrpc.IEstimateFeeRequest): Promise<lnrpc.EstimateFeeResponse>;

        /**
         * Calls SendCoins.
         * @param request SendCoinsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and SendCoinsResponse
         */
        public sendCoins(request: lnrpc.ISendCoinsRequest, callback: lnrpc.Lightning.SendCoinsCallback): void;

        /**
         * Calls SendCoins.
         * @param request SendCoinsRequest message or plain object
         * @returns Promise
         */
        public sendCoins(request: lnrpc.ISendCoinsRequest): Promise<lnrpc.SendCoinsResponse>;

        /**
         * Calls ListUnspent.
         * @param request ListUnspentRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListUnspentResponse
         */
        public listUnspent(request: lnrpc.IListUnspentRequest, callback: lnrpc.Lightning.ListUnspentCallback): void;

        /**
         * Calls ListUnspent.
         * @param request ListUnspentRequest message or plain object
         * @returns Promise
         */
        public listUnspent(request: lnrpc.IListUnspentRequest): Promise<lnrpc.ListUnspentResponse>;

        /**
         * Calls SubscribeTransactions.
         * @param request GetTransactionsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and Transaction
         */
        public subscribeTransactions(request: lnrpc.IGetTransactionsRequest, callback: lnrpc.Lightning.SubscribeTransactionsCallback): void;

        /**
         * Calls SubscribeTransactions.
         * @param request GetTransactionsRequest message or plain object
         * @returns Promise
         */
        public subscribeTransactions(request: lnrpc.IGetTransactionsRequest): Promise<lnrpc.Transaction>;

        /**
         * Calls SendMany.
         * @param request SendManyRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and SendManyResponse
         */
        public sendMany(request: lnrpc.ISendManyRequest, callback: lnrpc.Lightning.SendManyCallback): void;

        /**
         * Calls SendMany.
         * @param request SendManyRequest message or plain object
         * @returns Promise
         */
        public sendMany(request: lnrpc.ISendManyRequest): Promise<lnrpc.SendManyResponse>;

        /**
         * Calls NewAddress.
         * @param request NewAddressRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and NewAddressResponse
         */
        public newAddress(request: lnrpc.INewAddressRequest, callback: lnrpc.Lightning.NewAddressCallback): void;

        /**
         * Calls NewAddress.
         * @param request NewAddressRequest message or plain object
         * @returns Promise
         */
        public newAddress(request: lnrpc.INewAddressRequest): Promise<lnrpc.NewAddressResponse>;

        /**
         * Calls SignMessage.
         * @param request SignMessageRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and SignMessageResponse
         */
        public signMessage(request: lnrpc.ISignMessageRequest, callback: lnrpc.Lightning.SignMessageCallback): void;

        /**
         * Calls SignMessage.
         * @param request SignMessageRequest message or plain object
         * @returns Promise
         */
        public signMessage(request: lnrpc.ISignMessageRequest): Promise<lnrpc.SignMessageResponse>;

        /**
         * Calls VerifyMessage.
         * @param request VerifyMessageRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and VerifyMessageResponse
         */
        public verifyMessage(request: lnrpc.IVerifyMessageRequest, callback: lnrpc.Lightning.VerifyMessageCallback): void;

        /**
         * Calls VerifyMessage.
         * @param request VerifyMessageRequest message or plain object
         * @returns Promise
         */
        public verifyMessage(request: lnrpc.IVerifyMessageRequest): Promise<lnrpc.VerifyMessageResponse>;

        /**
         * Calls ConnectPeer.
         * @param request ConnectPeerRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ConnectPeerResponse
         */
        public connectPeer(request: lnrpc.IConnectPeerRequest, callback: lnrpc.Lightning.ConnectPeerCallback): void;

        /**
         * Calls ConnectPeer.
         * @param request ConnectPeerRequest message or plain object
         * @returns Promise
         */
        public connectPeer(request: lnrpc.IConnectPeerRequest): Promise<lnrpc.ConnectPeerResponse>;

        /**
         * Calls DisconnectPeer.
         * @param request DisconnectPeerRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and DisconnectPeerResponse
         */
        public disconnectPeer(request: lnrpc.IDisconnectPeerRequest, callback: lnrpc.Lightning.DisconnectPeerCallback): void;

        /**
         * Calls DisconnectPeer.
         * @param request DisconnectPeerRequest message or plain object
         * @returns Promise
         */
        public disconnectPeer(request: lnrpc.IDisconnectPeerRequest): Promise<lnrpc.DisconnectPeerResponse>;

        /**
         * Calls ListPeers.
         * @param request ListPeersRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListPeersResponse
         */
        public listPeers(request: lnrpc.IListPeersRequest, callback: lnrpc.Lightning.ListPeersCallback): void;

        /**
         * Calls ListPeers.
         * @param request ListPeersRequest message or plain object
         * @returns Promise
         */
        public listPeers(request: lnrpc.IListPeersRequest): Promise<lnrpc.ListPeersResponse>;

        /**
         * Calls SubscribePeerEvents.
         * @param request PeerEventSubscription message or plain object
         * @param callback Node-style callback called with the error, if any, and PeerEvent
         */
        public subscribePeerEvents(request: lnrpc.IPeerEventSubscription, callback: lnrpc.Lightning.SubscribePeerEventsCallback): void;

        /**
         * Calls SubscribePeerEvents.
         * @param request PeerEventSubscription message or plain object
         * @returns Promise
         */
        public subscribePeerEvents(request: lnrpc.IPeerEventSubscription): Promise<lnrpc.PeerEvent>;

        /**
         * Calls GetInfo.
         * @param request GetInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetInfoResponse
         */
        public getInfo(request: lnrpc.IGetInfoRequest, callback: lnrpc.Lightning.GetInfoCallback): void;

        /**
         * Calls GetInfo.
         * @param request GetInfoRequest message or plain object
         * @returns Promise
         */
        public getInfo(request: lnrpc.IGetInfoRequest): Promise<lnrpc.GetInfoResponse>;

        /**
         * lncli: `getrecoveryinfo`
         * GetRecoveryInfo returns information concerning the recovery mode including
         * whether it's in a recovery mode, whether the recovery is finished, and the
         * progress made so far.
         * @param request GetRecoveryInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetRecoveryInfoResponse
         */
        public getRecoveryInfo(request: lnrpc.IGetRecoveryInfoRequest, callback: lnrpc.Lightning.GetRecoveryInfoCallback): void;

        /**
         * lncli: `getrecoveryinfo`
         * GetRecoveryInfo returns information concerning the recovery mode including
         * whether it's in a recovery mode, whether the recovery is finished, and the
         * progress made so far.
         * @param request GetRecoveryInfoRequest message or plain object
         * @returns Promise
         */
        public getRecoveryInfo(request: lnrpc.IGetRecoveryInfoRequest): Promise<lnrpc.GetRecoveryInfoResponse>;

        /**
         * Calls PendingChannels.
         * @param request PendingChannelsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and PendingChannelsResponse
         */
        public pendingChannels(request: lnrpc.IPendingChannelsRequest, callback: lnrpc.Lightning.PendingChannelsCallback): void;

        /**
         * Calls PendingChannels.
         * @param request PendingChannelsRequest message or plain object
         * @returns Promise
         */
        public pendingChannels(request: lnrpc.IPendingChannelsRequest): Promise<lnrpc.PendingChannelsResponse>;

        /**
         * Calls ListChannels.
         * @param request ListChannelsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListChannelsResponse
         */
        public listChannels(request: lnrpc.IListChannelsRequest, callback: lnrpc.Lightning.ListChannelsCallback): void;

        /**
         * Calls ListChannels.
         * @param request ListChannelsRequest message or plain object
         * @returns Promise
         */
        public listChannels(request: lnrpc.IListChannelsRequest): Promise<lnrpc.ListChannelsResponse>;

        /**
         * Calls SubscribeChannelEvents.
         * @param request ChannelEventSubscription message or plain object
         * @param callback Node-style callback called with the error, if any, and ChannelEventUpdate
         */
        public subscribeChannelEvents(request: lnrpc.IChannelEventSubscription, callback: lnrpc.Lightning.SubscribeChannelEventsCallback): void;

        /**
         * Calls SubscribeChannelEvents.
         * @param request ChannelEventSubscription message or plain object
         * @returns Promise
         */
        public subscribeChannelEvents(request: lnrpc.IChannelEventSubscription): Promise<lnrpc.ChannelEventUpdate>;

        /**
         * Calls ClosedChannels.
         * @param request ClosedChannelsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ClosedChannelsResponse
         */
        public closedChannels(request: lnrpc.IClosedChannelsRequest, callback: lnrpc.Lightning.ClosedChannelsCallback): void;

        /**
         * Calls ClosedChannels.
         * @param request ClosedChannelsRequest message or plain object
         * @returns Promise
         */
        public closedChannels(request: lnrpc.IClosedChannelsRequest): Promise<lnrpc.ClosedChannelsResponse>;

        /**
         * Calls OpenChannelSync.
         * @param request OpenChannelRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ChannelPoint
         */
        public openChannelSync(request: lnrpc.IOpenChannelRequest, callback: lnrpc.Lightning.OpenChannelSyncCallback): void;

        /**
         * Calls OpenChannelSync.
         * @param request OpenChannelRequest message or plain object
         * @returns Promise
         */
        public openChannelSync(request: lnrpc.IOpenChannelRequest): Promise<lnrpc.ChannelPoint>;

        /**
         * Calls OpenChannel.
         * @param request OpenChannelRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and OpenStatusUpdate
         */
        public openChannel(request: lnrpc.IOpenChannelRequest, callback: lnrpc.Lightning.OpenChannelCallback): void;

        /**
         * Calls OpenChannel.
         * @param request OpenChannelRequest message or plain object
         * @returns Promise
         */
        public openChannel(request: lnrpc.IOpenChannelRequest): Promise<lnrpc.OpenStatusUpdate>;

        /**
         * Calls FundingStateStep.
         * @param request FundingTransitionMsg message or plain object
         * @param callback Node-style callback called with the error, if any, and FundingStateStepResp
         */
        public fundingStateStep(request: lnrpc.IFundingTransitionMsg, callback: lnrpc.Lightning.FundingStateStepCallback): void;

        /**
         * Calls FundingStateStep.
         * @param request FundingTransitionMsg message or plain object
         * @returns Promise
         */
        public fundingStateStep(request: lnrpc.IFundingTransitionMsg): Promise<lnrpc.FundingStateStepResp>;

        /**
         * Calls ChannelAcceptor.
         * @param request ChannelAcceptResponse message or plain object
         * @param callback Node-style callback called with the error, if any, and ChannelAcceptRequest
         */
        public channelAcceptor(request: lnrpc.IChannelAcceptResponse, callback: lnrpc.Lightning.ChannelAcceptorCallback): void;

        /**
         * Calls ChannelAcceptor.
         * @param request ChannelAcceptResponse message or plain object
         * @returns Promise
         */
        public channelAcceptor(request: lnrpc.IChannelAcceptResponse): Promise<lnrpc.ChannelAcceptRequest>;

        /**
         * Calls CloseChannel.
         * @param request CloseChannelRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and CloseStatusUpdate
         */
        public closeChannel(request: lnrpc.ICloseChannelRequest, callback: lnrpc.Lightning.CloseChannelCallback): void;

        /**
         * Calls CloseChannel.
         * @param request CloseChannelRequest message or plain object
         * @returns Promise
         */
        public closeChannel(request: lnrpc.ICloseChannelRequest): Promise<lnrpc.CloseStatusUpdate>;

        /**
         * Calls AbandonChannel.
         * @param request AbandonChannelRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AbandonChannelResponse
         */
        public abandonChannel(request: lnrpc.IAbandonChannelRequest, callback: lnrpc.Lightning.AbandonChannelCallback): void;

        /**
         * Calls AbandonChannel.
         * @param request AbandonChannelRequest message or plain object
         * @returns Promise
         */
        public abandonChannel(request: lnrpc.IAbandonChannelRequest): Promise<lnrpc.AbandonChannelResponse>;

        /**
         * Calls SendPayment.
         * @param request SendRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and SendResponse
         */
        public sendPayment(request: lnrpc.ISendRequest, callback: lnrpc.Lightning.SendPaymentCallback): void;

        /**
         * Calls SendPayment.
         * @param request SendRequest message or plain object
         * @returns Promise
         */
        public sendPayment(request: lnrpc.ISendRequest): Promise<lnrpc.SendResponse>;

        /**
         * Calls SendPaymentSync.
         * @param request SendRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and SendResponse
         */
        public sendPaymentSync(request: lnrpc.ISendRequest, callback: lnrpc.Lightning.SendPaymentSyncCallback): void;

        /**
         * Calls SendPaymentSync.
         * @param request SendRequest message or plain object
         * @returns Promise
         */
        public sendPaymentSync(request: lnrpc.ISendRequest): Promise<lnrpc.SendResponse>;

        /**
         * Calls SendToRoute.
         * @param request SendToRouteRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and SendResponse
         */
        public sendToRoute(request: lnrpc.ISendToRouteRequest, callback: lnrpc.Lightning.SendToRouteCallback): void;

        /**
         * Calls SendToRoute.
         * @param request SendToRouteRequest message or plain object
         * @returns Promise
         */
        public sendToRoute(request: lnrpc.ISendToRouteRequest): Promise<lnrpc.SendResponse>;

        /**
         * Calls SendToRouteSync.
         * @param request SendToRouteRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and SendResponse
         */
        public sendToRouteSync(request: lnrpc.ISendToRouteRequest, callback: lnrpc.Lightning.SendToRouteSyncCallback): void;

        /**
         * Calls SendToRouteSync.
         * @param request SendToRouteRequest message or plain object
         * @returns Promise
         */
        public sendToRouteSync(request: lnrpc.ISendToRouteRequest): Promise<lnrpc.SendResponse>;

        /**
         * Calls AddInvoice.
         * @param request Invoice message or plain object
         * @param callback Node-style callback called with the error, if any, and AddInvoiceResponse
         */
        public addInvoice(request: lnrpc.IInvoice, callback: lnrpc.Lightning.AddInvoiceCallback): void;

        /**
         * Calls AddInvoice.
         * @param request Invoice message or plain object
         * @returns Promise
         */
        public addInvoice(request: lnrpc.IInvoice): Promise<lnrpc.AddInvoiceResponse>;

        /**
         * Calls ListInvoices.
         * @param request ListInvoiceRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListInvoiceResponse
         */
        public listInvoices(request: lnrpc.IListInvoiceRequest, callback: lnrpc.Lightning.ListInvoicesCallback): void;

        /**
         * Calls ListInvoices.
         * @param request ListInvoiceRequest message or plain object
         * @returns Promise
         */
        public listInvoices(request: lnrpc.IListInvoiceRequest): Promise<lnrpc.ListInvoiceResponse>;

        /**
         * Calls LookupInvoice.
         * @param request PaymentHash message or plain object
         * @param callback Node-style callback called with the error, if any, and Invoice
         */
        public lookupInvoice(request: lnrpc.IPaymentHash, callback: lnrpc.Lightning.LookupInvoiceCallback): void;

        /**
         * Calls LookupInvoice.
         * @param request PaymentHash message or plain object
         * @returns Promise
         */
        public lookupInvoice(request: lnrpc.IPaymentHash): Promise<lnrpc.Invoice>;

        /**
         * Calls SubscribeInvoices.
         * @param request InvoiceSubscription message or plain object
         * @param callback Node-style callback called with the error, if any, and Invoice
         */
        public subscribeInvoices(request: lnrpc.IInvoiceSubscription, callback: lnrpc.Lightning.SubscribeInvoicesCallback): void;

        /**
         * Calls SubscribeInvoices.
         * @param request InvoiceSubscription message or plain object
         * @returns Promise
         */
        public subscribeInvoices(request: lnrpc.IInvoiceSubscription): Promise<lnrpc.Invoice>;

        /**
         * Calls DecodePayReq.
         * @param request PayReqString message or plain object
         * @param callback Node-style callback called with the error, if any, and PayReq
         */
        public decodePayReq(request: lnrpc.IPayReqString, callback: lnrpc.Lightning.DecodePayReqCallback): void;

        /**
         * Calls DecodePayReq.
         * @param request PayReqString message or plain object
         * @returns Promise
         */
        public decodePayReq(request: lnrpc.IPayReqString): Promise<lnrpc.PayReq>;

        /**
         * Calls ListPayments.
         * @param request ListPaymentsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListPaymentsResponse
         */
        public listPayments(request: lnrpc.IListPaymentsRequest, callback: lnrpc.Lightning.ListPaymentsCallback): void;

        /**
         * Calls ListPayments.
         * @param request ListPaymentsRequest message or plain object
         * @returns Promise
         */
        public listPayments(request: lnrpc.IListPaymentsRequest): Promise<lnrpc.ListPaymentsResponse>;

        /**
         * Calls DeleteAllPayments.
         * @param request DeleteAllPaymentsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and DeleteAllPaymentsResponse
         */
        public deleteAllPayments(request: lnrpc.IDeleteAllPaymentsRequest, callback: lnrpc.Lightning.DeleteAllPaymentsCallback): void;

        /**
         * Calls DeleteAllPayments.
         * @param request DeleteAllPaymentsRequest message or plain object
         * @returns Promise
         */
        public deleteAllPayments(request: lnrpc.IDeleteAllPaymentsRequest): Promise<lnrpc.DeleteAllPaymentsResponse>;

        /**
         * Calls DescribeGraph.
         * @param request ChannelGraphRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ChannelGraph
         */
        public describeGraph(request: lnrpc.IChannelGraphRequest, callback: lnrpc.Lightning.DescribeGraphCallback): void;

        /**
         * Calls DescribeGraph.
         * @param request ChannelGraphRequest message or plain object
         * @returns Promise
         */
        public describeGraph(request: lnrpc.IChannelGraphRequest): Promise<lnrpc.ChannelGraph>;

        /**
         * Calls GetNodeMetrics.
         * @param request NodeMetricsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and NodeMetricsResponse
         */
        public getNodeMetrics(request: lnrpc.INodeMetricsRequest, callback: lnrpc.Lightning.GetNodeMetricsCallback): void;

        /**
         * Calls GetNodeMetrics.
         * @param request NodeMetricsRequest message or plain object
         * @returns Promise
         */
        public getNodeMetrics(request: lnrpc.INodeMetricsRequest): Promise<lnrpc.NodeMetricsResponse>;

        /**
         * Calls GetChanInfo.
         * @param request ChanInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ChannelEdge
         */
        public getChanInfo(request: lnrpc.IChanInfoRequest, callback: lnrpc.Lightning.GetChanInfoCallback): void;

        /**
         * Calls GetChanInfo.
         * @param request ChanInfoRequest message or plain object
         * @returns Promise
         */
        public getChanInfo(request: lnrpc.IChanInfoRequest): Promise<lnrpc.ChannelEdge>;

        /**
         * Calls GetNodeInfo.
         * @param request NodeInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and NodeInfo
         */
        public getNodeInfo(request: lnrpc.INodeInfoRequest, callback: lnrpc.Lightning.GetNodeInfoCallback): void;

        /**
         * Calls GetNodeInfo.
         * @param request NodeInfoRequest message or plain object
         * @returns Promise
         */
        public getNodeInfo(request: lnrpc.INodeInfoRequest): Promise<lnrpc.NodeInfo>;

        /**
         * Calls QueryRoutes.
         * @param request QueryRoutesRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and QueryRoutesResponse
         */
        public queryRoutes(request: lnrpc.IQueryRoutesRequest, callback: lnrpc.Lightning.QueryRoutesCallback): void;

        /**
         * Calls QueryRoutes.
         * @param request QueryRoutesRequest message or plain object
         * @returns Promise
         */
        public queryRoutes(request: lnrpc.IQueryRoutesRequest): Promise<lnrpc.QueryRoutesResponse>;

        /**
         * Calls GetNetworkInfo.
         * @param request NetworkInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and NetworkInfo
         */
        public getNetworkInfo(request: lnrpc.INetworkInfoRequest, callback: lnrpc.Lightning.GetNetworkInfoCallback): void;

        /**
         * Calls GetNetworkInfo.
         * @param request NetworkInfoRequest message or plain object
         * @returns Promise
         */
        public getNetworkInfo(request: lnrpc.INetworkInfoRequest): Promise<lnrpc.NetworkInfo>;

        /**
         * Calls StopDaemon.
         * @param request StopRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and StopResponse
         */
        public stopDaemon(request: lnrpc.IStopRequest, callback: lnrpc.Lightning.StopDaemonCallback): void;

        /**
         * Calls StopDaemon.
         * @param request StopRequest message or plain object
         * @returns Promise
         */
        public stopDaemon(request: lnrpc.IStopRequest): Promise<lnrpc.StopResponse>;

        /**
         * Calls SubscribeChannelGraph.
         * @param request GraphTopologySubscription message or plain object
         * @param callback Node-style callback called with the error, if any, and GraphTopologyUpdate
         */
        public subscribeChannelGraph(request: lnrpc.IGraphTopologySubscription, callback: lnrpc.Lightning.SubscribeChannelGraphCallback): void;

        /**
         * Calls SubscribeChannelGraph.
         * @param request GraphTopologySubscription message or plain object
         * @returns Promise
         */
        public subscribeChannelGraph(request: lnrpc.IGraphTopologySubscription): Promise<lnrpc.GraphTopologyUpdate>;

        /**
         * Calls DebugLevel.
         * @param request DebugLevelRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and DebugLevelResponse
         */
        public debugLevel(request: lnrpc.IDebugLevelRequest, callback: lnrpc.Lightning.DebugLevelCallback): void;

        /**
         * Calls DebugLevel.
         * @param request DebugLevelRequest message or plain object
         * @returns Promise
         */
        public debugLevel(request: lnrpc.IDebugLevelRequest): Promise<lnrpc.DebugLevelResponse>;

        /**
         * Calls FeeReport.
         * @param request FeeReportRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and FeeReportResponse
         */
        public feeReport(request: lnrpc.IFeeReportRequest, callback: lnrpc.Lightning.FeeReportCallback): void;

        /**
         * Calls FeeReport.
         * @param request FeeReportRequest message or plain object
         * @returns Promise
         */
        public feeReport(request: lnrpc.IFeeReportRequest): Promise<lnrpc.FeeReportResponse>;

        /**
         * Calls UpdateChannelPolicy.
         * @param request PolicyUpdateRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and PolicyUpdateResponse
         */
        public updateChannelPolicy(request: lnrpc.IPolicyUpdateRequest, callback: lnrpc.Lightning.UpdateChannelPolicyCallback): void;

        /**
         * Calls UpdateChannelPolicy.
         * @param request PolicyUpdateRequest message or plain object
         * @returns Promise
         */
        public updateChannelPolicy(request: lnrpc.IPolicyUpdateRequest): Promise<lnrpc.PolicyUpdateResponse>;

        /**
         * Calls ForwardingHistory.
         * @param request ForwardingHistoryRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ForwardingHistoryResponse
         */
        public forwardingHistory(request: lnrpc.IForwardingHistoryRequest, callback: lnrpc.Lightning.ForwardingHistoryCallback): void;

        /**
         * Calls ForwardingHistory.
         * @param request ForwardingHistoryRequest message or plain object
         * @returns Promise
         */
        public forwardingHistory(request: lnrpc.IForwardingHistoryRequest): Promise<lnrpc.ForwardingHistoryResponse>;

        /**
         * Calls ExportChannelBackup.
         * @param request ExportChannelBackupRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ChannelBackup
         */
        public exportChannelBackup(request: lnrpc.IExportChannelBackupRequest, callback: lnrpc.Lightning.ExportChannelBackupCallback): void;

        /**
         * Calls ExportChannelBackup.
         * @param request ExportChannelBackupRequest message or plain object
         * @returns Promise
         */
        public exportChannelBackup(request: lnrpc.IExportChannelBackupRequest): Promise<lnrpc.ChannelBackup>;

        /**
         * Calls ExportAllChannelBackups.
         * @param request ChanBackupExportRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ChanBackupSnapshot
         */
        public exportAllChannelBackups(request: lnrpc.IChanBackupExportRequest, callback: lnrpc.Lightning.ExportAllChannelBackupsCallback): void;

        /**
         * Calls ExportAllChannelBackups.
         * @param request ChanBackupExportRequest message or plain object
         * @returns Promise
         */
        public exportAllChannelBackups(request: lnrpc.IChanBackupExportRequest): Promise<lnrpc.ChanBackupSnapshot>;

        /**
         * Calls VerifyChanBackup.
         * @param request ChanBackupSnapshot message or plain object
         * @param callback Node-style callback called with the error, if any, and VerifyChanBackupResponse
         */
        public verifyChanBackup(request: lnrpc.IChanBackupSnapshot, callback: lnrpc.Lightning.VerifyChanBackupCallback): void;

        /**
         * Calls VerifyChanBackup.
         * @param request ChanBackupSnapshot message or plain object
         * @returns Promise
         */
        public verifyChanBackup(request: lnrpc.IChanBackupSnapshot): Promise<lnrpc.VerifyChanBackupResponse>;

        /**
         * Calls RestoreChannelBackups.
         * @param request RestoreChanBackupRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and RestoreBackupResponse
         */
        public restoreChannelBackups(request: lnrpc.IRestoreChanBackupRequest, callback: lnrpc.Lightning.RestoreChannelBackupsCallback): void;

        /**
         * Calls RestoreChannelBackups.
         * @param request RestoreChanBackupRequest message or plain object
         * @returns Promise
         */
        public restoreChannelBackups(request: lnrpc.IRestoreChanBackupRequest): Promise<lnrpc.RestoreBackupResponse>;

        /**
         * Calls SubscribeChannelBackups.
         * @param request ChannelBackupSubscription message or plain object
         * @param callback Node-style callback called with the error, if any, and ChanBackupSnapshot
         */
        public subscribeChannelBackups(request: lnrpc.IChannelBackupSubscription, callback: lnrpc.Lightning.SubscribeChannelBackupsCallback): void;

        /**
         * Calls SubscribeChannelBackups.
         * @param request ChannelBackupSubscription message or plain object
         * @returns Promise
         */
        public subscribeChannelBackups(request: lnrpc.IChannelBackupSubscription): Promise<lnrpc.ChanBackupSnapshot>;

        /**
         * Calls BakeMacaroon.
         * @param request BakeMacaroonRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and BakeMacaroonResponse
         */
        public bakeMacaroon(request: lnrpc.IBakeMacaroonRequest, callback: lnrpc.Lightning.BakeMacaroonCallback): void;

        /**
         * Calls BakeMacaroon.
         * @param request BakeMacaroonRequest message or plain object
         * @returns Promise
         */
        public bakeMacaroon(request: lnrpc.IBakeMacaroonRequest): Promise<lnrpc.BakeMacaroonResponse>;

        /**
         * Calls ListMacaroonIDs.
         * @param request ListMacaroonIDsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListMacaroonIDsResponse
         */
        public listMacaroonIDs(request: lnrpc.IListMacaroonIDsRequest, callback: lnrpc.Lightning.ListMacaroonIDsCallback): void;

        /**
         * Calls ListMacaroonIDs.
         * @param request ListMacaroonIDsRequest message or plain object
         * @returns Promise
         */
        public listMacaroonIDs(request: lnrpc.IListMacaroonIDsRequest): Promise<lnrpc.ListMacaroonIDsResponse>;

        /**
         * Calls DeleteMacaroonID.
         * @param request DeleteMacaroonIDRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and DeleteMacaroonIDResponse
         */
        public deleteMacaroonID(request: lnrpc.IDeleteMacaroonIDRequest, callback: lnrpc.Lightning.DeleteMacaroonIDCallback): void;

        /**
         * Calls DeleteMacaroonID.
         * @param request DeleteMacaroonIDRequest message or plain object
         * @returns Promise
         */
        public deleteMacaroonID(request: lnrpc.IDeleteMacaroonIDRequest): Promise<lnrpc.DeleteMacaroonIDResponse>;

        /**
         * Calls ListPermissions.
         * @param request ListPermissionsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListPermissionsResponse
         */
        public listPermissions(request: lnrpc.IListPermissionsRequest, callback: lnrpc.Lightning.ListPermissionsCallback): void;

        /**
         * Calls ListPermissions.
         * @param request ListPermissionsRequest message or plain object
         * @returns Promise
         */
        public listPermissions(request: lnrpc.IListPermissionsRequest): Promise<lnrpc.ListPermissionsResponse>;
    }

    namespace Lightning {

        /**
         * Callback as used by {@link lnrpc.Lightning#walletBalance}.
         * @param error Error, if any
         * @param [response] WalletBalanceResponse
         */
        type WalletBalanceCallback = (error: (Error|null), response?: lnrpc.WalletBalanceResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#channelBalance}.
         * @param error Error, if any
         * @param [response] ChannelBalanceResponse
         */
        type ChannelBalanceCallback = (error: (Error|null), response?: lnrpc.ChannelBalanceResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#getTransactions}.
         * @param error Error, if any
         * @param [response] TransactionDetails
         */
        type GetTransactionsCallback = (error: (Error|null), response?: lnrpc.TransactionDetails) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#estimateFee}.
         * @param error Error, if any
         * @param [response] EstimateFeeResponse
         */
        type EstimateFeeCallback = (error: (Error|null), response?: lnrpc.EstimateFeeResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#sendCoins}.
         * @param error Error, if any
         * @param [response] SendCoinsResponse
         */
        type SendCoinsCallback = (error: (Error|null), response?: lnrpc.SendCoinsResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#listUnspent}.
         * @param error Error, if any
         * @param [response] ListUnspentResponse
         */
        type ListUnspentCallback = (error: (Error|null), response?: lnrpc.ListUnspentResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#subscribeTransactions}.
         * @param error Error, if any
         * @param [response] Transaction
         */
        type SubscribeTransactionsCallback = (error: (Error|null), response?: lnrpc.Transaction) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#sendMany}.
         * @param error Error, if any
         * @param [response] SendManyResponse
         */
        type SendManyCallback = (error: (Error|null), response?: lnrpc.SendManyResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#newAddress}.
         * @param error Error, if any
         * @param [response] NewAddressResponse
         */
        type NewAddressCallback = (error: (Error|null), response?: lnrpc.NewAddressResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#signMessage}.
         * @param error Error, if any
         * @param [response] SignMessageResponse
         */
        type SignMessageCallback = (error: (Error|null), response?: lnrpc.SignMessageResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#verifyMessage}.
         * @param error Error, if any
         * @param [response] VerifyMessageResponse
         */
        type VerifyMessageCallback = (error: (Error|null), response?: lnrpc.VerifyMessageResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#connectPeer}.
         * @param error Error, if any
         * @param [response] ConnectPeerResponse
         */
        type ConnectPeerCallback = (error: (Error|null), response?: lnrpc.ConnectPeerResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#disconnectPeer}.
         * @param error Error, if any
         * @param [response] DisconnectPeerResponse
         */
        type DisconnectPeerCallback = (error: (Error|null), response?: lnrpc.DisconnectPeerResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#listPeers}.
         * @param error Error, if any
         * @param [response] ListPeersResponse
         */
        type ListPeersCallback = (error: (Error|null), response?: lnrpc.ListPeersResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#subscribePeerEvents}.
         * @param error Error, if any
         * @param [response] PeerEvent
         */
        type SubscribePeerEventsCallback = (error: (Error|null), response?: lnrpc.PeerEvent) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#getInfo}.
         * @param error Error, if any
         * @param [response] GetInfoResponse
         */
        type GetInfoCallback = (error: (Error|null), response?: lnrpc.GetInfoResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#getRecoveryInfo}.
         * @param error Error, if any
         * @param [response] GetRecoveryInfoResponse
         */
        type GetRecoveryInfoCallback = (error: (Error|null), response?: lnrpc.GetRecoveryInfoResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#pendingChannels}.
         * @param error Error, if any
         * @param [response] PendingChannelsResponse
         */
        type PendingChannelsCallback = (error: (Error|null), response?: lnrpc.PendingChannelsResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#listChannels}.
         * @param error Error, if any
         * @param [response] ListChannelsResponse
         */
        type ListChannelsCallback = (error: (Error|null), response?: lnrpc.ListChannelsResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#subscribeChannelEvents}.
         * @param error Error, if any
         * @param [response] ChannelEventUpdate
         */
        type SubscribeChannelEventsCallback = (error: (Error|null), response?: lnrpc.ChannelEventUpdate) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#closedChannels}.
         * @param error Error, if any
         * @param [response] ClosedChannelsResponse
         */
        type ClosedChannelsCallback = (error: (Error|null), response?: lnrpc.ClosedChannelsResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#openChannelSync}.
         * @param error Error, if any
         * @param [response] ChannelPoint
         */
        type OpenChannelSyncCallback = (error: (Error|null), response?: lnrpc.ChannelPoint) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#openChannel}.
         * @param error Error, if any
         * @param [response] OpenStatusUpdate
         */
        type OpenChannelCallback = (error: (Error|null), response?: lnrpc.OpenStatusUpdate) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#fundingStateStep}.
         * @param error Error, if any
         * @param [response] FundingStateStepResp
         */
        type FundingStateStepCallback = (error: (Error|null), response?: lnrpc.FundingStateStepResp) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#channelAcceptor}.
         * @param error Error, if any
         * @param [response] ChannelAcceptRequest
         */
        type ChannelAcceptorCallback = (error: (Error|null), response?: lnrpc.ChannelAcceptRequest) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#closeChannel}.
         * @param error Error, if any
         * @param [response] CloseStatusUpdate
         */
        type CloseChannelCallback = (error: (Error|null), response?: lnrpc.CloseStatusUpdate) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#abandonChannel}.
         * @param error Error, if any
         * @param [response] AbandonChannelResponse
         */
        type AbandonChannelCallback = (error: (Error|null), response?: lnrpc.AbandonChannelResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#sendPayment}.
         * @param error Error, if any
         * @param [response] SendResponse
         */
        type SendPaymentCallback = (error: (Error|null), response?: lnrpc.SendResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#sendPaymentSync}.
         * @param error Error, if any
         * @param [response] SendResponse
         */
        type SendPaymentSyncCallback = (error: (Error|null), response?: lnrpc.SendResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#sendToRoute}.
         * @param error Error, if any
         * @param [response] SendResponse
         */
        type SendToRouteCallback = (error: (Error|null), response?: lnrpc.SendResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#sendToRouteSync}.
         * @param error Error, if any
         * @param [response] SendResponse
         */
        type SendToRouteSyncCallback = (error: (Error|null), response?: lnrpc.SendResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#addInvoice}.
         * @param error Error, if any
         * @param [response] AddInvoiceResponse
         */
        type AddInvoiceCallback = (error: (Error|null), response?: lnrpc.AddInvoiceResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#listInvoices}.
         * @param error Error, if any
         * @param [response] ListInvoiceResponse
         */
        type ListInvoicesCallback = (error: (Error|null), response?: lnrpc.ListInvoiceResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#lookupInvoice}.
         * @param error Error, if any
         * @param [response] Invoice
         */
        type LookupInvoiceCallback = (error: (Error|null), response?: lnrpc.Invoice) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#subscribeInvoices}.
         * @param error Error, if any
         * @param [response] Invoice
         */
        type SubscribeInvoicesCallback = (error: (Error|null), response?: lnrpc.Invoice) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#decodePayReq}.
         * @param error Error, if any
         * @param [response] PayReq
         */
        type DecodePayReqCallback = (error: (Error|null), response?: lnrpc.PayReq) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#listPayments}.
         * @param error Error, if any
         * @param [response] ListPaymentsResponse
         */
        type ListPaymentsCallback = (error: (Error|null), response?: lnrpc.ListPaymentsResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#deleteAllPayments}.
         * @param error Error, if any
         * @param [response] DeleteAllPaymentsResponse
         */
        type DeleteAllPaymentsCallback = (error: (Error|null), response?: lnrpc.DeleteAllPaymentsResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#describeGraph}.
         * @param error Error, if any
         * @param [response] ChannelGraph
         */
        type DescribeGraphCallback = (error: (Error|null), response?: lnrpc.ChannelGraph) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#getNodeMetrics}.
         * @param error Error, if any
         * @param [response] NodeMetricsResponse
         */
        type GetNodeMetricsCallback = (error: (Error|null), response?: lnrpc.NodeMetricsResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#getChanInfo}.
         * @param error Error, if any
         * @param [response] ChannelEdge
         */
        type GetChanInfoCallback = (error: (Error|null), response?: lnrpc.ChannelEdge) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#getNodeInfo}.
         * @param error Error, if any
         * @param [response] NodeInfo
         */
        type GetNodeInfoCallback = (error: (Error|null), response?: lnrpc.NodeInfo) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#queryRoutes}.
         * @param error Error, if any
         * @param [response] QueryRoutesResponse
         */
        type QueryRoutesCallback = (error: (Error|null), response?: lnrpc.QueryRoutesResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#getNetworkInfo}.
         * @param error Error, if any
         * @param [response] NetworkInfo
         */
        type GetNetworkInfoCallback = (error: (Error|null), response?: lnrpc.NetworkInfo) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#stopDaemon}.
         * @param error Error, if any
         * @param [response] StopResponse
         */
        type StopDaemonCallback = (error: (Error|null), response?: lnrpc.StopResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#subscribeChannelGraph}.
         * @param error Error, if any
         * @param [response] GraphTopologyUpdate
         */
        type SubscribeChannelGraphCallback = (error: (Error|null), response?: lnrpc.GraphTopologyUpdate) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#debugLevel}.
         * @param error Error, if any
         * @param [response] DebugLevelResponse
         */
        type DebugLevelCallback = (error: (Error|null), response?: lnrpc.DebugLevelResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#feeReport}.
         * @param error Error, if any
         * @param [response] FeeReportResponse
         */
        type FeeReportCallback = (error: (Error|null), response?: lnrpc.FeeReportResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#updateChannelPolicy}.
         * @param error Error, if any
         * @param [response] PolicyUpdateResponse
         */
        type UpdateChannelPolicyCallback = (error: (Error|null), response?: lnrpc.PolicyUpdateResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#forwardingHistory}.
         * @param error Error, if any
         * @param [response] ForwardingHistoryResponse
         */
        type ForwardingHistoryCallback = (error: (Error|null), response?: lnrpc.ForwardingHistoryResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#exportChannelBackup}.
         * @param error Error, if any
         * @param [response] ChannelBackup
         */
        type ExportChannelBackupCallback = (error: (Error|null), response?: lnrpc.ChannelBackup) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#exportAllChannelBackups}.
         * @param error Error, if any
         * @param [response] ChanBackupSnapshot
         */
        type ExportAllChannelBackupsCallback = (error: (Error|null), response?: lnrpc.ChanBackupSnapshot) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#verifyChanBackup}.
         * @param error Error, if any
         * @param [response] VerifyChanBackupResponse
         */
        type VerifyChanBackupCallback = (error: (Error|null), response?: lnrpc.VerifyChanBackupResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#restoreChannelBackups}.
         * @param error Error, if any
         * @param [response] RestoreBackupResponse
         */
        type RestoreChannelBackupsCallback = (error: (Error|null), response?: lnrpc.RestoreBackupResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#subscribeChannelBackups}.
         * @param error Error, if any
         * @param [response] ChanBackupSnapshot
         */
        type SubscribeChannelBackupsCallback = (error: (Error|null), response?: lnrpc.ChanBackupSnapshot) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#bakeMacaroon}.
         * @param error Error, if any
         * @param [response] BakeMacaroonResponse
         */
        type BakeMacaroonCallback = (error: (Error|null), response?: lnrpc.BakeMacaroonResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#listMacaroonIDs}.
         * @param error Error, if any
         * @param [response] ListMacaroonIDsResponse
         */
        type ListMacaroonIDsCallback = (error: (Error|null), response?: lnrpc.ListMacaroonIDsResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#deleteMacaroonID}.
         * @param error Error, if any
         * @param [response] DeleteMacaroonIDResponse
         */
        type DeleteMacaroonIDCallback = (error: (Error|null), response?: lnrpc.DeleteMacaroonIDResponse) => void;

        /**
         * Callback as used by {@link lnrpc.Lightning#listPermissions}.
         * @param error Error, if any
         * @param [response] ListPermissionsResponse
         */
        type ListPermissionsCallback = (error: (Error|null), response?: lnrpc.ListPermissionsResponse) => void;
    }

    /** Properties of an Utxo. */
    interface IUtxo {

        /** Utxo addressType */
        addressType?: (lnrpc.AddressType|null);

        /** Utxo address */
        address?: (string|null);

        /** Utxo amountSat */
        amountSat?: (number|Long|null);

        /** Utxo pkScript */
        pkScript?: (string|null);

        /** Utxo outpoint */
        outpoint?: (lnrpc.IOutPoint|null);

        /** Utxo confirmations */
        confirmations?: (number|Long|null);
    }

    /** Represents an Utxo. */
    class Utxo implements IUtxo {

        /**
         * Constructs a new Utxo.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IUtxo);

        /** Utxo addressType. */
        public addressType: lnrpc.AddressType;

        /** Utxo address. */
        public address: string;

        /** Utxo amountSat. */
        public amountSat: (number|Long);

        /** Utxo pkScript. */
        public pkScript: string;

        /** Utxo outpoint. */
        public outpoint?: (lnrpc.IOutPoint|null);

        /** Utxo confirmations. */
        public confirmations: (number|Long);

        /**
         * Creates a new Utxo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Utxo instance
         */
        public static create(properties?: lnrpc.IUtxo): lnrpc.Utxo;

        /**
         * Encodes the specified Utxo message. Does not implicitly {@link lnrpc.Utxo.verify|verify} messages.
         * @param message Utxo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IUtxo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Utxo message, length delimited. Does not implicitly {@link lnrpc.Utxo.verify|verify} messages.
         * @param message Utxo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IUtxo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Utxo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Utxo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Utxo;

        /**
         * Decodes an Utxo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Utxo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Utxo;

        /**
         * Verifies an Utxo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Utxo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Utxo
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Utxo;

        /**
         * Creates a plain object from an Utxo message. Also converts values to other types if specified.
         * @param message Utxo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Utxo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Utxo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Transaction. */
    interface ITransaction {

        /** Transaction txHash */
        txHash?: (string|null);

        /** Transaction amount */
        amount?: (number|Long|null);

        /** Transaction numConfirmations */
        numConfirmations?: (number|null);

        /** Transaction blockHash */
        blockHash?: (string|null);

        /** Transaction blockHeight */
        blockHeight?: (number|null);

        /** Transaction timeStamp */
        timeStamp?: (number|Long|null);

        /** Transaction totalFees */
        totalFees?: (number|Long|null);

        /** Transaction destAddresses */
        destAddresses?: (string[]|null);

        /** Transaction rawTxHex */
        rawTxHex?: (string|null);

        /** Transaction label */
        label?: (string|null);
    }

    /** Represents a Transaction. */
    class Transaction implements ITransaction {

        /**
         * Constructs a new Transaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ITransaction);

        /** Transaction txHash. */
        public txHash: string;

        /** Transaction amount. */
        public amount: (number|Long);

        /** Transaction numConfirmations. */
        public numConfirmations: number;

        /** Transaction blockHash. */
        public blockHash: string;

        /** Transaction blockHeight. */
        public blockHeight: number;

        /** Transaction timeStamp. */
        public timeStamp: (number|Long);

        /** Transaction totalFees. */
        public totalFees: (number|Long);

        /** Transaction destAddresses. */
        public destAddresses: string[];

        /** Transaction rawTxHex. */
        public rawTxHex: string;

        /** Transaction label. */
        public label: string;

        /**
         * Creates a new Transaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transaction instance
         */
        public static create(properties?: lnrpc.ITransaction): lnrpc.Transaction;

        /**
         * Encodes the specified Transaction message. Does not implicitly {@link lnrpc.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transaction message, length delimited. Does not implicitly {@link lnrpc.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Transaction;

        /**
         * Decodes a Transaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Transaction;

        /**
         * Verifies a Transaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transaction
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Transaction;

        /**
         * Creates a plain object from a Transaction message. Also converts values to other types if specified.
         * @param message Transaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetTransactionsRequest. */
    interface IGetTransactionsRequest {

        /** GetTransactionsRequest startHeight */
        startHeight?: (number|null);

        /** GetTransactionsRequest endHeight */
        endHeight?: (number|null);
    }

    /** Represents a GetTransactionsRequest. */
    class GetTransactionsRequest implements IGetTransactionsRequest {

        /**
         * Constructs a new GetTransactionsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IGetTransactionsRequest);

        /** GetTransactionsRequest startHeight. */
        public startHeight: number;

        /** GetTransactionsRequest endHeight. */
        public endHeight: number;

        /**
         * Creates a new GetTransactionsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetTransactionsRequest instance
         */
        public static create(properties?: lnrpc.IGetTransactionsRequest): lnrpc.GetTransactionsRequest;

        /**
         * Encodes the specified GetTransactionsRequest message. Does not implicitly {@link lnrpc.GetTransactionsRequest.verify|verify} messages.
         * @param message GetTransactionsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IGetTransactionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetTransactionsRequest message, length delimited. Does not implicitly {@link lnrpc.GetTransactionsRequest.verify|verify} messages.
         * @param message GetTransactionsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IGetTransactionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetTransactionsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetTransactionsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.GetTransactionsRequest;

        /**
         * Decodes a GetTransactionsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetTransactionsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.GetTransactionsRequest;

        /**
         * Verifies a GetTransactionsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetTransactionsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetTransactionsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.GetTransactionsRequest;

        /**
         * Creates a plain object from a GetTransactionsRequest message. Also converts values to other types if specified.
         * @param message GetTransactionsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.GetTransactionsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetTransactionsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TransactionDetails. */
    interface ITransactionDetails {

        /** TransactionDetails transactions */
        transactions?: (lnrpc.ITransaction[]|null);
    }

    /** Represents a TransactionDetails. */
    class TransactionDetails implements ITransactionDetails {

        /**
         * Constructs a new TransactionDetails.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ITransactionDetails);

        /** TransactionDetails transactions. */
        public transactions: lnrpc.ITransaction[];

        /**
         * Creates a new TransactionDetails instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransactionDetails instance
         */
        public static create(properties?: lnrpc.ITransactionDetails): lnrpc.TransactionDetails;

        /**
         * Encodes the specified TransactionDetails message. Does not implicitly {@link lnrpc.TransactionDetails.verify|verify} messages.
         * @param message TransactionDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ITransactionDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransactionDetails message, length delimited. Does not implicitly {@link lnrpc.TransactionDetails.verify|verify} messages.
         * @param message TransactionDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ITransactionDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransactionDetails message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransactionDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.TransactionDetails;

        /**
         * Decodes a TransactionDetails message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransactionDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.TransactionDetails;

        /**
         * Verifies a TransactionDetails message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransactionDetails message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransactionDetails
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.TransactionDetails;

        /**
         * Creates a plain object from a TransactionDetails message. Also converts values to other types if specified.
         * @param message TransactionDetails
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.TransactionDetails, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransactionDetails to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FeeLimit. */
    interface IFeeLimit {

        /** FeeLimit fixed */
        fixed?: (number|Long|null);

        /** FeeLimit fixedMsat */
        fixedMsat?: (number|Long|null);

        /** FeeLimit percent */
        percent?: (number|Long|null);
    }

    /** Represents a FeeLimit. */
    class FeeLimit implements IFeeLimit {

        /**
         * Constructs a new FeeLimit.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFeeLimit);

        /** FeeLimit fixed. */
        public fixed: (number|Long);

        /** FeeLimit fixedMsat. */
        public fixedMsat: (number|Long);

        /** FeeLimit percent. */
        public percent: (number|Long);

        /** FeeLimit limit. */
        public limit?: ("fixed"|"fixedMsat"|"percent");

        /**
         * Creates a new FeeLimit instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FeeLimit instance
         */
        public static create(properties?: lnrpc.IFeeLimit): lnrpc.FeeLimit;

        /**
         * Encodes the specified FeeLimit message. Does not implicitly {@link lnrpc.FeeLimit.verify|verify} messages.
         * @param message FeeLimit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFeeLimit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FeeLimit message, length delimited. Does not implicitly {@link lnrpc.FeeLimit.verify|verify} messages.
         * @param message FeeLimit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFeeLimit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FeeLimit message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FeeLimit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FeeLimit;

        /**
         * Decodes a FeeLimit message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FeeLimit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FeeLimit;

        /**
         * Verifies a FeeLimit message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FeeLimit message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FeeLimit
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FeeLimit;

        /**
         * Creates a plain object from a FeeLimit message. Also converts values to other types if specified.
         * @param message FeeLimit
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FeeLimit, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FeeLimit to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendRequest. */
    interface ISendRequest {

        /** SendRequest dest */
        dest?: (Uint8Array|null);

        /** SendRequest destString */
        destString?: (string|null);

        /** SendRequest amt */
        amt?: (number|Long|null);

        /** SendRequest amtMsat */
        amtMsat?: (number|Long|null);

        /** SendRequest paymentHash */
        paymentHash?: (Uint8Array|null);

        /** SendRequest paymentHashString */
        paymentHashString?: (string|null);

        /** SendRequest paymentRequest */
        paymentRequest?: (string|null);

        /** SendRequest finalCltvDelta */
        finalCltvDelta?: (number|null);

        /** SendRequest feeLimit */
        feeLimit?: (lnrpc.IFeeLimit|null);

        /** SendRequest outgoingChanId */
        outgoingChanId?: (number|Long|null);

        /** SendRequest lastHopPubkey */
        lastHopPubkey?: (Uint8Array|null);

        /** SendRequest cltvLimit */
        cltvLimit?: (number|null);

        /** SendRequest destCustomRecords */
        destCustomRecords?: ({ [k: string]: Uint8Array }|null);

        /** SendRequest allowSelfPayment */
        allowSelfPayment?: (boolean|null);

        /** SendRequest destFeatures */
        destFeatures?: (lnrpc.FeatureBit[]|null);
    }

    /** Represents a SendRequest. */
    class SendRequest implements ISendRequest {

        /**
         * Constructs a new SendRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISendRequest);

        /** SendRequest dest. */
        public dest: Uint8Array;

        /** SendRequest destString. */
        public destString: string;

        /** SendRequest amt. */
        public amt: (number|Long);

        /** SendRequest amtMsat. */
        public amtMsat: (number|Long);

        /** SendRequest paymentHash. */
        public paymentHash: Uint8Array;

        /** SendRequest paymentHashString. */
        public paymentHashString: string;

        /** SendRequest paymentRequest. */
        public paymentRequest: string;

        /** SendRequest finalCltvDelta. */
        public finalCltvDelta: number;

        /** SendRequest feeLimit. */
        public feeLimit?: (lnrpc.IFeeLimit|null);

        /** SendRequest outgoingChanId. */
        public outgoingChanId: (number|Long);

        /** SendRequest lastHopPubkey. */
        public lastHopPubkey: Uint8Array;

        /** SendRequest cltvLimit. */
        public cltvLimit: number;

        /** SendRequest destCustomRecords. */
        public destCustomRecords: { [k: string]: Uint8Array };

        /** SendRequest allowSelfPayment. */
        public allowSelfPayment: boolean;

        /** SendRequest destFeatures. */
        public destFeatures: lnrpc.FeatureBit[];

        /**
         * Creates a new SendRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendRequest instance
         */
        public static create(properties?: lnrpc.ISendRequest): lnrpc.SendRequest;

        /**
         * Encodes the specified SendRequest message. Does not implicitly {@link lnrpc.SendRequest.verify|verify} messages.
         * @param message SendRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISendRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendRequest message, length delimited. Does not implicitly {@link lnrpc.SendRequest.verify|verify} messages.
         * @param message SendRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISendRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SendRequest;

        /**
         * Decodes a SendRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SendRequest;

        /**
         * Verifies a SendRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SendRequest;

        /**
         * Creates a plain object from a SendRequest message. Also converts values to other types if specified.
         * @param message SendRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SendRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendResponse. */
    interface ISendResponse {

        /** SendResponse paymentError */
        paymentError?: (string|null);

        /** SendResponse paymentPreimage */
        paymentPreimage?: (Uint8Array|null);

        /** SendResponse paymentRoute */
        paymentRoute?: (lnrpc.IRoute|null);

        /** SendResponse paymentHash */
        paymentHash?: (Uint8Array|null);
    }

    /** Represents a SendResponse. */
    class SendResponse implements ISendResponse {

        /**
         * Constructs a new SendResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISendResponse);

        /** SendResponse paymentError. */
        public paymentError: string;

        /** SendResponse paymentPreimage. */
        public paymentPreimage: Uint8Array;

        /** SendResponse paymentRoute. */
        public paymentRoute?: (lnrpc.IRoute|null);

        /** SendResponse paymentHash. */
        public paymentHash: Uint8Array;

        /**
         * Creates a new SendResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendResponse instance
         */
        public static create(properties?: lnrpc.ISendResponse): lnrpc.SendResponse;

        /**
         * Encodes the specified SendResponse message. Does not implicitly {@link lnrpc.SendResponse.verify|verify} messages.
         * @param message SendResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISendResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendResponse message, length delimited. Does not implicitly {@link lnrpc.SendResponse.verify|verify} messages.
         * @param message SendResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISendResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SendResponse;

        /**
         * Decodes a SendResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SendResponse;

        /**
         * Verifies a SendResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SendResponse;

        /**
         * Creates a plain object from a SendResponse message. Also converts values to other types if specified.
         * @param message SendResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SendResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendToRouteRequest. */
    interface ISendToRouteRequest {

        /** SendToRouteRequest paymentHash */
        paymentHash?: (Uint8Array|null);

        /** SendToRouteRequest paymentHashString */
        paymentHashString?: (string|null);

        /** SendToRouteRequest route */
        route?: (lnrpc.IRoute|null);
    }

    /** Represents a SendToRouteRequest. */
    class SendToRouteRequest implements ISendToRouteRequest {

        /**
         * Constructs a new SendToRouteRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISendToRouteRequest);

        /** SendToRouteRequest paymentHash. */
        public paymentHash: Uint8Array;

        /** SendToRouteRequest paymentHashString. */
        public paymentHashString: string;

        /** SendToRouteRequest route. */
        public route?: (lnrpc.IRoute|null);

        /**
         * Creates a new SendToRouteRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendToRouteRequest instance
         */
        public static create(properties?: lnrpc.ISendToRouteRequest): lnrpc.SendToRouteRequest;

        /**
         * Encodes the specified SendToRouteRequest message. Does not implicitly {@link lnrpc.SendToRouteRequest.verify|verify} messages.
         * @param message SendToRouteRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISendToRouteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendToRouteRequest message, length delimited. Does not implicitly {@link lnrpc.SendToRouteRequest.verify|verify} messages.
         * @param message SendToRouteRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISendToRouteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendToRouteRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendToRouteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SendToRouteRequest;

        /**
         * Decodes a SendToRouteRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendToRouteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SendToRouteRequest;

        /**
         * Verifies a SendToRouteRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendToRouteRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendToRouteRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SendToRouteRequest;

        /**
         * Creates a plain object from a SendToRouteRequest message. Also converts values to other types if specified.
         * @param message SendToRouteRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SendToRouteRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendToRouteRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelAcceptRequest. */
    interface IChannelAcceptRequest {

        /** ChannelAcceptRequest nodePubkey */
        nodePubkey?: (Uint8Array|null);

        /** ChannelAcceptRequest chainHash */
        chainHash?: (Uint8Array|null);

        /** ChannelAcceptRequest pendingChanId */
        pendingChanId?: (Uint8Array|null);

        /** ChannelAcceptRequest fundingAmt */
        fundingAmt?: (number|Long|null);

        /** ChannelAcceptRequest pushAmt */
        pushAmt?: (number|Long|null);

        /** ChannelAcceptRequest dustLimit */
        dustLimit?: (number|Long|null);

        /** ChannelAcceptRequest maxValueInFlight */
        maxValueInFlight?: (number|Long|null);

        /** ChannelAcceptRequest channelReserve */
        channelReserve?: (number|Long|null);

        /** ChannelAcceptRequest minHtlc */
        minHtlc?: (number|Long|null);

        /** ChannelAcceptRequest feePerKw */
        feePerKw?: (number|Long|null);

        /** ChannelAcceptRequest csvDelay */
        csvDelay?: (number|null);

        /** ChannelAcceptRequest maxAcceptedHtlcs */
        maxAcceptedHtlcs?: (number|null);

        /** ChannelAcceptRequest channelFlags */
        channelFlags?: (number|null);
    }

    /** Represents a ChannelAcceptRequest. */
    class ChannelAcceptRequest implements IChannelAcceptRequest {

        /**
         * Constructs a new ChannelAcceptRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelAcceptRequest);

        /** ChannelAcceptRequest nodePubkey. */
        public nodePubkey: Uint8Array;

        /** ChannelAcceptRequest chainHash. */
        public chainHash: Uint8Array;

        /** ChannelAcceptRequest pendingChanId. */
        public pendingChanId: Uint8Array;

        /** ChannelAcceptRequest fundingAmt. */
        public fundingAmt: (number|Long);

        /** ChannelAcceptRequest pushAmt. */
        public pushAmt: (number|Long);

        /** ChannelAcceptRequest dustLimit. */
        public dustLimit: (number|Long);

        /** ChannelAcceptRequest maxValueInFlight. */
        public maxValueInFlight: (number|Long);

        /** ChannelAcceptRequest channelReserve. */
        public channelReserve: (number|Long);

        /** ChannelAcceptRequest minHtlc. */
        public minHtlc: (number|Long);

        /** ChannelAcceptRequest feePerKw. */
        public feePerKw: (number|Long);

        /** ChannelAcceptRequest csvDelay. */
        public csvDelay: number;

        /** ChannelAcceptRequest maxAcceptedHtlcs. */
        public maxAcceptedHtlcs: number;

        /** ChannelAcceptRequest channelFlags. */
        public channelFlags: number;

        /**
         * Creates a new ChannelAcceptRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelAcceptRequest instance
         */
        public static create(properties?: lnrpc.IChannelAcceptRequest): lnrpc.ChannelAcceptRequest;

        /**
         * Encodes the specified ChannelAcceptRequest message. Does not implicitly {@link lnrpc.ChannelAcceptRequest.verify|verify} messages.
         * @param message ChannelAcceptRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelAcceptRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelAcceptRequest message, length delimited. Does not implicitly {@link lnrpc.ChannelAcceptRequest.verify|verify} messages.
         * @param message ChannelAcceptRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelAcceptRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelAcceptRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelAcceptRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelAcceptRequest;

        /**
         * Decodes a ChannelAcceptRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelAcceptRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelAcceptRequest;

        /**
         * Verifies a ChannelAcceptRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelAcceptRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelAcceptRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelAcceptRequest;

        /**
         * Creates a plain object from a ChannelAcceptRequest message. Also converts values to other types if specified.
         * @param message ChannelAcceptRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelAcceptRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelAcceptRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelAcceptResponse. */
    interface IChannelAcceptResponse {

        /** ChannelAcceptResponse accept */
        accept?: (boolean|null);

        /** ChannelAcceptResponse pendingChanId */
        pendingChanId?: (Uint8Array|null);
    }

    /** Represents a ChannelAcceptResponse. */
    class ChannelAcceptResponse implements IChannelAcceptResponse {

        /**
         * Constructs a new ChannelAcceptResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelAcceptResponse);

        /** ChannelAcceptResponse accept. */
        public accept: boolean;

        /** ChannelAcceptResponse pendingChanId. */
        public pendingChanId: Uint8Array;

        /**
         * Creates a new ChannelAcceptResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelAcceptResponse instance
         */
        public static create(properties?: lnrpc.IChannelAcceptResponse): lnrpc.ChannelAcceptResponse;

        /**
         * Encodes the specified ChannelAcceptResponse message. Does not implicitly {@link lnrpc.ChannelAcceptResponse.verify|verify} messages.
         * @param message ChannelAcceptResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelAcceptResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelAcceptResponse message, length delimited. Does not implicitly {@link lnrpc.ChannelAcceptResponse.verify|verify} messages.
         * @param message ChannelAcceptResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelAcceptResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelAcceptResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelAcceptResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelAcceptResponse;

        /**
         * Decodes a ChannelAcceptResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelAcceptResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelAcceptResponse;

        /**
         * Verifies a ChannelAcceptResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelAcceptResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelAcceptResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelAcceptResponse;

        /**
         * Creates a plain object from a ChannelAcceptResponse message. Also converts values to other types if specified.
         * @param message ChannelAcceptResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelAcceptResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelAcceptResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelPoint. */
    interface IChannelPoint {

        /** ChannelPoint fundingTxidBytes */
        fundingTxidBytes?: (Uint8Array|null);

        /** ChannelPoint fundingTxidStr */
        fundingTxidStr?: (string|null);

        /** ChannelPoint outputIndex */
        outputIndex?: (number|null);
    }

    /** Represents a ChannelPoint. */
    class ChannelPoint implements IChannelPoint {

        /**
         * Constructs a new ChannelPoint.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelPoint);

        /** ChannelPoint fundingTxidBytes. */
        public fundingTxidBytes: Uint8Array;

        /** ChannelPoint fundingTxidStr. */
        public fundingTxidStr: string;

        /** ChannelPoint outputIndex. */
        public outputIndex: number;

        /** ChannelPoint fundingTxid. */
        public fundingTxid?: ("fundingTxidBytes"|"fundingTxidStr");

        /**
         * Creates a new ChannelPoint instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelPoint instance
         */
        public static create(properties?: lnrpc.IChannelPoint): lnrpc.ChannelPoint;

        /**
         * Encodes the specified ChannelPoint message. Does not implicitly {@link lnrpc.ChannelPoint.verify|verify} messages.
         * @param message ChannelPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelPoint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelPoint message, length delimited. Does not implicitly {@link lnrpc.ChannelPoint.verify|verify} messages.
         * @param message ChannelPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelPoint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelPoint message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelPoint;

        /**
         * Decodes a ChannelPoint message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelPoint;

        /**
         * Verifies a ChannelPoint message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelPoint message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelPoint
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelPoint;

        /**
         * Creates a plain object from a ChannelPoint message. Also converts values to other types if specified.
         * @param message ChannelPoint
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelPoint to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an OutPoint. */
    interface IOutPoint {

        /** OutPoint txidBytes */
        txidBytes?: (Uint8Array|null);

        /** OutPoint txidStr */
        txidStr?: (string|null);

        /** OutPoint outputIndex */
        outputIndex?: (number|null);
    }

    /** Represents an OutPoint. */
    class OutPoint implements IOutPoint {

        /**
         * Constructs a new OutPoint.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IOutPoint);

        /** OutPoint txidBytes. */
        public txidBytes: Uint8Array;

        /** OutPoint txidStr. */
        public txidStr: string;

        /** OutPoint outputIndex. */
        public outputIndex: number;

        /**
         * Creates a new OutPoint instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OutPoint instance
         */
        public static create(properties?: lnrpc.IOutPoint): lnrpc.OutPoint;

        /**
         * Encodes the specified OutPoint message. Does not implicitly {@link lnrpc.OutPoint.verify|verify} messages.
         * @param message OutPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IOutPoint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OutPoint message, length delimited. Does not implicitly {@link lnrpc.OutPoint.verify|verify} messages.
         * @param message OutPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IOutPoint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OutPoint message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OutPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.OutPoint;

        /**
         * Decodes an OutPoint message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OutPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.OutPoint;

        /**
         * Verifies an OutPoint message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OutPoint message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OutPoint
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.OutPoint;

        /**
         * Creates a plain object from an OutPoint message. Also converts values to other types if specified.
         * @param message OutPoint
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.OutPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OutPoint to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LightningAddress. */
    interface ILightningAddress {

        /** LightningAddress pubkey */
        pubkey?: (string|null);

        /** LightningAddress host */
        host?: (string|null);
    }

    /** Represents a LightningAddress. */
    class LightningAddress implements ILightningAddress {

        /**
         * Constructs a new LightningAddress.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ILightningAddress);

        /** LightningAddress pubkey. */
        public pubkey: string;

        /** LightningAddress host. */
        public host: string;

        /**
         * Creates a new LightningAddress instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LightningAddress instance
         */
        public static create(properties?: lnrpc.ILightningAddress): lnrpc.LightningAddress;

        /**
         * Encodes the specified LightningAddress message. Does not implicitly {@link lnrpc.LightningAddress.verify|verify} messages.
         * @param message LightningAddress message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ILightningAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LightningAddress message, length delimited. Does not implicitly {@link lnrpc.LightningAddress.verify|verify} messages.
         * @param message LightningAddress message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ILightningAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LightningAddress message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LightningAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.LightningAddress;

        /**
         * Decodes a LightningAddress message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LightningAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.LightningAddress;

        /**
         * Verifies a LightningAddress message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LightningAddress message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LightningAddress
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.LightningAddress;

        /**
         * Creates a plain object from a LightningAddress message. Also converts values to other types if specified.
         * @param message LightningAddress
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.LightningAddress, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LightningAddress to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EstimateFeeRequest. */
    interface IEstimateFeeRequest {

        /** EstimateFeeRequest AddrToAmount */
        AddrToAmount?: ({ [k: string]: (number|Long) }|null);

        /** EstimateFeeRequest targetConf */
        targetConf?: (number|null);
    }

    /** Represents an EstimateFeeRequest. */
    class EstimateFeeRequest implements IEstimateFeeRequest {

        /**
         * Constructs a new EstimateFeeRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IEstimateFeeRequest);

        /** EstimateFeeRequest AddrToAmount. */
        public AddrToAmount: { [k: string]: (number|Long) };

        /** EstimateFeeRequest targetConf. */
        public targetConf: number;

        /**
         * Creates a new EstimateFeeRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EstimateFeeRequest instance
         */
        public static create(properties?: lnrpc.IEstimateFeeRequest): lnrpc.EstimateFeeRequest;

        /**
         * Encodes the specified EstimateFeeRequest message. Does not implicitly {@link lnrpc.EstimateFeeRequest.verify|verify} messages.
         * @param message EstimateFeeRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IEstimateFeeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EstimateFeeRequest message, length delimited. Does not implicitly {@link lnrpc.EstimateFeeRequest.verify|verify} messages.
         * @param message EstimateFeeRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IEstimateFeeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EstimateFeeRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EstimateFeeRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.EstimateFeeRequest;

        /**
         * Decodes an EstimateFeeRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EstimateFeeRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.EstimateFeeRequest;

        /**
         * Verifies an EstimateFeeRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EstimateFeeRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EstimateFeeRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.EstimateFeeRequest;

        /**
         * Creates a plain object from an EstimateFeeRequest message. Also converts values to other types if specified.
         * @param message EstimateFeeRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.EstimateFeeRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EstimateFeeRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EstimateFeeResponse. */
    interface IEstimateFeeResponse {

        /** EstimateFeeResponse feeSat */
        feeSat?: (number|Long|null);

        /** EstimateFeeResponse feerateSatPerByte */
        feerateSatPerByte?: (number|Long|null);
    }

    /** Represents an EstimateFeeResponse. */
    class EstimateFeeResponse implements IEstimateFeeResponse {

        /**
         * Constructs a new EstimateFeeResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IEstimateFeeResponse);

        /** EstimateFeeResponse feeSat. */
        public feeSat: (number|Long);

        /** EstimateFeeResponse feerateSatPerByte. */
        public feerateSatPerByte: (number|Long);

        /**
         * Creates a new EstimateFeeResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EstimateFeeResponse instance
         */
        public static create(properties?: lnrpc.IEstimateFeeResponse): lnrpc.EstimateFeeResponse;

        /**
         * Encodes the specified EstimateFeeResponse message. Does not implicitly {@link lnrpc.EstimateFeeResponse.verify|verify} messages.
         * @param message EstimateFeeResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IEstimateFeeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EstimateFeeResponse message, length delimited. Does not implicitly {@link lnrpc.EstimateFeeResponse.verify|verify} messages.
         * @param message EstimateFeeResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IEstimateFeeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EstimateFeeResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EstimateFeeResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.EstimateFeeResponse;

        /**
         * Decodes an EstimateFeeResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EstimateFeeResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.EstimateFeeResponse;

        /**
         * Verifies an EstimateFeeResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EstimateFeeResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EstimateFeeResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.EstimateFeeResponse;

        /**
         * Creates a plain object from an EstimateFeeResponse message. Also converts values to other types if specified.
         * @param message EstimateFeeResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.EstimateFeeResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EstimateFeeResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendManyRequest. */
    interface ISendManyRequest {

        /** SendManyRequest AddrToAmount */
        AddrToAmount?: ({ [k: string]: (number|Long) }|null);

        /** SendManyRequest targetConf */
        targetConf?: (number|null);

        /** SendManyRequest satPerByte */
        satPerByte?: (number|Long|null);

        /** SendManyRequest label */
        label?: (string|null);

        /** SendManyRequest minConfs */
        minConfs?: (number|null);

        /** SendManyRequest spendUnconfirmed */
        spendUnconfirmed?: (boolean|null);
    }

    /** Represents a SendManyRequest. */
    class SendManyRequest implements ISendManyRequest {

        /**
         * Constructs a new SendManyRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISendManyRequest);

        /** SendManyRequest AddrToAmount. */
        public AddrToAmount: { [k: string]: (number|Long) };

        /** SendManyRequest targetConf. */
        public targetConf: number;

        /** SendManyRequest satPerByte. */
        public satPerByte: (number|Long);

        /** SendManyRequest label. */
        public label: string;

        /** SendManyRequest minConfs. */
        public minConfs: number;

        /** SendManyRequest spendUnconfirmed. */
        public spendUnconfirmed: boolean;

        /**
         * Creates a new SendManyRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendManyRequest instance
         */
        public static create(properties?: lnrpc.ISendManyRequest): lnrpc.SendManyRequest;

        /**
         * Encodes the specified SendManyRequest message. Does not implicitly {@link lnrpc.SendManyRequest.verify|verify} messages.
         * @param message SendManyRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISendManyRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendManyRequest message, length delimited. Does not implicitly {@link lnrpc.SendManyRequest.verify|verify} messages.
         * @param message SendManyRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISendManyRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendManyRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendManyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SendManyRequest;

        /**
         * Decodes a SendManyRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendManyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SendManyRequest;

        /**
         * Verifies a SendManyRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendManyRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendManyRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SendManyRequest;

        /**
         * Creates a plain object from a SendManyRequest message. Also converts values to other types if specified.
         * @param message SendManyRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SendManyRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendManyRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendManyResponse. */
    interface ISendManyResponse {

        /** SendManyResponse txid */
        txid?: (string|null);
    }

    /** Represents a SendManyResponse. */
    class SendManyResponse implements ISendManyResponse {

        /**
         * Constructs a new SendManyResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISendManyResponse);

        /** SendManyResponse txid. */
        public txid: string;

        /**
         * Creates a new SendManyResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendManyResponse instance
         */
        public static create(properties?: lnrpc.ISendManyResponse): lnrpc.SendManyResponse;

        /**
         * Encodes the specified SendManyResponse message. Does not implicitly {@link lnrpc.SendManyResponse.verify|verify} messages.
         * @param message SendManyResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISendManyResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendManyResponse message, length delimited. Does not implicitly {@link lnrpc.SendManyResponse.verify|verify} messages.
         * @param message SendManyResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISendManyResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendManyResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendManyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SendManyResponse;

        /**
         * Decodes a SendManyResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendManyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SendManyResponse;

        /**
         * Verifies a SendManyResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendManyResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendManyResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SendManyResponse;

        /**
         * Creates a plain object from a SendManyResponse message. Also converts values to other types if specified.
         * @param message SendManyResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SendManyResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendManyResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendCoinsRequest. */
    interface ISendCoinsRequest {

        /** SendCoinsRequest addr */
        addr?: (string|null);

        /** SendCoinsRequest amount */
        amount?: (number|Long|null);

        /** SendCoinsRequest targetConf */
        targetConf?: (number|null);

        /** SendCoinsRequest satPerByte */
        satPerByte?: (number|Long|null);

        /** SendCoinsRequest sendAll */
        sendAll?: (boolean|null);

        /** SendCoinsRequest label */
        label?: (string|null);

        /** SendCoinsRequest minConfs */
        minConfs?: (number|null);

        /** SendCoinsRequest spendUnconfirmed */
        spendUnconfirmed?: (boolean|null);
    }

    /** Represents a SendCoinsRequest. */
    class SendCoinsRequest implements ISendCoinsRequest {

        /**
         * Constructs a new SendCoinsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISendCoinsRequest);

        /** SendCoinsRequest addr. */
        public addr: string;

        /** SendCoinsRequest amount. */
        public amount: (number|Long);

        /** SendCoinsRequest targetConf. */
        public targetConf: number;

        /** SendCoinsRequest satPerByte. */
        public satPerByte: (number|Long);

        /** SendCoinsRequest sendAll. */
        public sendAll: boolean;

        /** SendCoinsRequest label. */
        public label: string;

        /** SendCoinsRequest minConfs. */
        public minConfs: number;

        /** SendCoinsRequest spendUnconfirmed. */
        public spendUnconfirmed: boolean;

        /**
         * Creates a new SendCoinsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendCoinsRequest instance
         */
        public static create(properties?: lnrpc.ISendCoinsRequest): lnrpc.SendCoinsRequest;

        /**
         * Encodes the specified SendCoinsRequest message. Does not implicitly {@link lnrpc.SendCoinsRequest.verify|verify} messages.
         * @param message SendCoinsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISendCoinsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendCoinsRequest message, length delimited. Does not implicitly {@link lnrpc.SendCoinsRequest.verify|verify} messages.
         * @param message SendCoinsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISendCoinsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendCoinsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendCoinsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SendCoinsRequest;

        /**
         * Decodes a SendCoinsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendCoinsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SendCoinsRequest;

        /**
         * Verifies a SendCoinsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendCoinsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendCoinsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SendCoinsRequest;

        /**
         * Creates a plain object from a SendCoinsRequest message. Also converts values to other types if specified.
         * @param message SendCoinsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SendCoinsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendCoinsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendCoinsResponse. */
    interface ISendCoinsResponse {

        /** SendCoinsResponse txid */
        txid?: (string|null);
    }

    /** Represents a SendCoinsResponse. */
    class SendCoinsResponse implements ISendCoinsResponse {

        /**
         * Constructs a new SendCoinsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISendCoinsResponse);

        /** SendCoinsResponse txid. */
        public txid: string;

        /**
         * Creates a new SendCoinsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendCoinsResponse instance
         */
        public static create(properties?: lnrpc.ISendCoinsResponse): lnrpc.SendCoinsResponse;

        /**
         * Encodes the specified SendCoinsResponse message. Does not implicitly {@link lnrpc.SendCoinsResponse.verify|verify} messages.
         * @param message SendCoinsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISendCoinsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendCoinsResponse message, length delimited. Does not implicitly {@link lnrpc.SendCoinsResponse.verify|verify} messages.
         * @param message SendCoinsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISendCoinsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendCoinsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendCoinsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SendCoinsResponse;

        /**
         * Decodes a SendCoinsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendCoinsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SendCoinsResponse;

        /**
         * Verifies a SendCoinsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendCoinsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendCoinsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SendCoinsResponse;

        /**
         * Creates a plain object from a SendCoinsResponse message. Also converts values to other types if specified.
         * @param message SendCoinsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SendCoinsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendCoinsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListUnspentRequest. */
    interface IListUnspentRequest {

        /** ListUnspentRequest minConfs */
        minConfs?: (number|null);

        /** ListUnspentRequest maxConfs */
        maxConfs?: (number|null);
    }

    /** Represents a ListUnspentRequest. */
    class ListUnspentRequest implements IListUnspentRequest {

        /**
         * Constructs a new ListUnspentRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListUnspentRequest);

        /** ListUnspentRequest minConfs. */
        public minConfs: number;

        /** ListUnspentRequest maxConfs. */
        public maxConfs: number;

        /**
         * Creates a new ListUnspentRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListUnspentRequest instance
         */
        public static create(properties?: lnrpc.IListUnspentRequest): lnrpc.ListUnspentRequest;

        /**
         * Encodes the specified ListUnspentRequest message. Does not implicitly {@link lnrpc.ListUnspentRequest.verify|verify} messages.
         * @param message ListUnspentRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListUnspentRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListUnspentRequest message, length delimited. Does not implicitly {@link lnrpc.ListUnspentRequest.verify|verify} messages.
         * @param message ListUnspentRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListUnspentRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListUnspentRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListUnspentRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListUnspentRequest;

        /**
         * Decodes a ListUnspentRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListUnspentRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListUnspentRequest;

        /**
         * Verifies a ListUnspentRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListUnspentRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListUnspentRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListUnspentRequest;

        /**
         * Creates a plain object from a ListUnspentRequest message. Also converts values to other types if specified.
         * @param message ListUnspentRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListUnspentRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListUnspentRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListUnspentResponse. */
    interface IListUnspentResponse {

        /** ListUnspentResponse utxos */
        utxos?: (lnrpc.IUtxo[]|null);
    }

    /** Represents a ListUnspentResponse. */
    class ListUnspentResponse implements IListUnspentResponse {

        /**
         * Constructs a new ListUnspentResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListUnspentResponse);

        /** ListUnspentResponse utxos. */
        public utxos: lnrpc.IUtxo[];

        /**
         * Creates a new ListUnspentResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListUnspentResponse instance
         */
        public static create(properties?: lnrpc.IListUnspentResponse): lnrpc.ListUnspentResponse;

        /**
         * Encodes the specified ListUnspentResponse message. Does not implicitly {@link lnrpc.ListUnspentResponse.verify|verify} messages.
         * @param message ListUnspentResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListUnspentResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListUnspentResponse message, length delimited. Does not implicitly {@link lnrpc.ListUnspentResponse.verify|verify} messages.
         * @param message ListUnspentResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListUnspentResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListUnspentResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListUnspentResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListUnspentResponse;

        /**
         * Decodes a ListUnspentResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListUnspentResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListUnspentResponse;

        /**
         * Verifies a ListUnspentResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListUnspentResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListUnspentResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListUnspentResponse;

        /**
         * Creates a plain object from a ListUnspentResponse message. Also converts values to other types if specified.
         * @param message ListUnspentResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListUnspentResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListUnspentResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** AddressType enum. */
    enum AddressType {
        WITNESS_PUBKEY_HASH = 0,
        NESTED_PUBKEY_HASH = 1,
        UNUSED_WITNESS_PUBKEY_HASH = 2,
        UNUSED_NESTED_PUBKEY_HASH = 3
    }

    /** Properties of a NewAddressRequest. */
    interface INewAddressRequest {

        /** NewAddressRequest type */
        type?: (lnrpc.AddressType|null);
    }

    /** Represents a NewAddressRequest. */
    class NewAddressRequest implements INewAddressRequest {

        /**
         * Constructs a new NewAddressRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INewAddressRequest);

        /** NewAddressRequest type. */
        public type: lnrpc.AddressType;

        /**
         * Creates a new NewAddressRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NewAddressRequest instance
         */
        public static create(properties?: lnrpc.INewAddressRequest): lnrpc.NewAddressRequest;

        /**
         * Encodes the specified NewAddressRequest message. Does not implicitly {@link lnrpc.NewAddressRequest.verify|verify} messages.
         * @param message NewAddressRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INewAddressRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NewAddressRequest message, length delimited. Does not implicitly {@link lnrpc.NewAddressRequest.verify|verify} messages.
         * @param message NewAddressRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INewAddressRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NewAddressRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NewAddressRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NewAddressRequest;

        /**
         * Decodes a NewAddressRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NewAddressRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NewAddressRequest;

        /**
         * Verifies a NewAddressRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NewAddressRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NewAddressRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NewAddressRequest;

        /**
         * Creates a plain object from a NewAddressRequest message. Also converts values to other types if specified.
         * @param message NewAddressRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NewAddressRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NewAddressRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NewAddressResponse. */
    interface INewAddressResponse {

        /** NewAddressResponse address */
        address?: (string|null);
    }

    /** Represents a NewAddressResponse. */
    class NewAddressResponse implements INewAddressResponse {

        /**
         * Constructs a new NewAddressResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INewAddressResponse);

        /** NewAddressResponse address. */
        public address: string;

        /**
         * Creates a new NewAddressResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NewAddressResponse instance
         */
        public static create(properties?: lnrpc.INewAddressResponse): lnrpc.NewAddressResponse;

        /**
         * Encodes the specified NewAddressResponse message. Does not implicitly {@link lnrpc.NewAddressResponse.verify|verify} messages.
         * @param message NewAddressResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INewAddressResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NewAddressResponse message, length delimited. Does not implicitly {@link lnrpc.NewAddressResponse.verify|verify} messages.
         * @param message NewAddressResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INewAddressResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NewAddressResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NewAddressResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NewAddressResponse;

        /**
         * Decodes a NewAddressResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NewAddressResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NewAddressResponse;

        /**
         * Verifies a NewAddressResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NewAddressResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NewAddressResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NewAddressResponse;

        /**
         * Creates a plain object from a NewAddressResponse message. Also converts values to other types if specified.
         * @param message NewAddressResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NewAddressResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NewAddressResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SignMessageRequest. */
    interface ISignMessageRequest {

        /** SignMessageRequest msg */
        msg?: (Uint8Array|null);
    }

    /** Represents a SignMessageRequest. */
    class SignMessageRequest implements ISignMessageRequest {

        /**
         * Constructs a new SignMessageRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISignMessageRequest);

        /** SignMessageRequest msg. */
        public msg: Uint8Array;

        /**
         * Creates a new SignMessageRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SignMessageRequest instance
         */
        public static create(properties?: lnrpc.ISignMessageRequest): lnrpc.SignMessageRequest;

        /**
         * Encodes the specified SignMessageRequest message. Does not implicitly {@link lnrpc.SignMessageRequest.verify|verify} messages.
         * @param message SignMessageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISignMessageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SignMessageRequest message, length delimited. Does not implicitly {@link lnrpc.SignMessageRequest.verify|verify} messages.
         * @param message SignMessageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISignMessageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SignMessageRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SignMessageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SignMessageRequest;

        /**
         * Decodes a SignMessageRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SignMessageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SignMessageRequest;

        /**
         * Verifies a SignMessageRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SignMessageRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SignMessageRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SignMessageRequest;

        /**
         * Creates a plain object from a SignMessageRequest message. Also converts values to other types if specified.
         * @param message SignMessageRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SignMessageRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SignMessageRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SignMessageResponse. */
    interface ISignMessageResponse {

        /** SignMessageResponse signature */
        signature?: (string|null);
    }

    /** Represents a SignMessageResponse. */
    class SignMessageResponse implements ISignMessageResponse {

        /**
         * Constructs a new SignMessageResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ISignMessageResponse);

        /** SignMessageResponse signature. */
        public signature: string;

        /**
         * Creates a new SignMessageResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SignMessageResponse instance
         */
        public static create(properties?: lnrpc.ISignMessageResponse): lnrpc.SignMessageResponse;

        /**
         * Encodes the specified SignMessageResponse message. Does not implicitly {@link lnrpc.SignMessageResponse.verify|verify} messages.
         * @param message SignMessageResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ISignMessageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SignMessageResponse message, length delimited. Does not implicitly {@link lnrpc.SignMessageResponse.verify|verify} messages.
         * @param message SignMessageResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ISignMessageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SignMessageResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SignMessageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.SignMessageResponse;

        /**
         * Decodes a SignMessageResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SignMessageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.SignMessageResponse;

        /**
         * Verifies a SignMessageResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SignMessageResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SignMessageResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.SignMessageResponse;

        /**
         * Creates a plain object from a SignMessageResponse message. Also converts values to other types if specified.
         * @param message SignMessageResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.SignMessageResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SignMessageResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a VerifyMessageRequest. */
    interface IVerifyMessageRequest {

        /** VerifyMessageRequest msg */
        msg?: (Uint8Array|null);

        /** VerifyMessageRequest signature */
        signature?: (string|null);
    }

    /** Represents a VerifyMessageRequest. */
    class VerifyMessageRequest implements IVerifyMessageRequest {

        /**
         * Constructs a new VerifyMessageRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IVerifyMessageRequest);

        /** VerifyMessageRequest msg. */
        public msg: Uint8Array;

        /** VerifyMessageRequest signature. */
        public signature: string;

        /**
         * Creates a new VerifyMessageRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VerifyMessageRequest instance
         */
        public static create(properties?: lnrpc.IVerifyMessageRequest): lnrpc.VerifyMessageRequest;

        /**
         * Encodes the specified VerifyMessageRequest message. Does not implicitly {@link lnrpc.VerifyMessageRequest.verify|verify} messages.
         * @param message VerifyMessageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IVerifyMessageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VerifyMessageRequest message, length delimited. Does not implicitly {@link lnrpc.VerifyMessageRequest.verify|verify} messages.
         * @param message VerifyMessageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IVerifyMessageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VerifyMessageRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VerifyMessageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.VerifyMessageRequest;

        /**
         * Decodes a VerifyMessageRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VerifyMessageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.VerifyMessageRequest;

        /**
         * Verifies a VerifyMessageRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VerifyMessageRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VerifyMessageRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.VerifyMessageRequest;

        /**
         * Creates a plain object from a VerifyMessageRequest message. Also converts values to other types if specified.
         * @param message VerifyMessageRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.VerifyMessageRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VerifyMessageRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a VerifyMessageResponse. */
    interface IVerifyMessageResponse {

        /** VerifyMessageResponse valid */
        valid?: (boolean|null);

        /** VerifyMessageResponse pubkey */
        pubkey?: (string|null);
    }

    /** Represents a VerifyMessageResponse. */
    class VerifyMessageResponse implements IVerifyMessageResponse {

        /**
         * Constructs a new VerifyMessageResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IVerifyMessageResponse);

        /** VerifyMessageResponse valid. */
        public valid: boolean;

        /** VerifyMessageResponse pubkey. */
        public pubkey: string;

        /**
         * Creates a new VerifyMessageResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VerifyMessageResponse instance
         */
        public static create(properties?: lnrpc.IVerifyMessageResponse): lnrpc.VerifyMessageResponse;

        /**
         * Encodes the specified VerifyMessageResponse message. Does not implicitly {@link lnrpc.VerifyMessageResponse.verify|verify} messages.
         * @param message VerifyMessageResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IVerifyMessageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VerifyMessageResponse message, length delimited. Does not implicitly {@link lnrpc.VerifyMessageResponse.verify|verify} messages.
         * @param message VerifyMessageResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IVerifyMessageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VerifyMessageResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VerifyMessageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.VerifyMessageResponse;

        /**
         * Decodes a VerifyMessageResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VerifyMessageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.VerifyMessageResponse;

        /**
         * Verifies a VerifyMessageResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VerifyMessageResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VerifyMessageResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.VerifyMessageResponse;

        /**
         * Creates a plain object from a VerifyMessageResponse message. Also converts values to other types if specified.
         * @param message VerifyMessageResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.VerifyMessageResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VerifyMessageResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ConnectPeerRequest. */
    interface IConnectPeerRequest {

        /** ConnectPeerRequest addr */
        addr?: (lnrpc.ILightningAddress|null);

        /** ConnectPeerRequest perm */
        perm?: (boolean|null);

        /** ConnectPeerRequest timeout */
        timeout?: (number|Long|null);
    }

    /** Represents a ConnectPeerRequest. */
    class ConnectPeerRequest implements IConnectPeerRequest {

        /**
         * Constructs a new ConnectPeerRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IConnectPeerRequest);

        /** ConnectPeerRequest addr. */
        public addr?: (lnrpc.ILightningAddress|null);

        /** ConnectPeerRequest perm. */
        public perm: boolean;

        /** ConnectPeerRequest timeout. */
        public timeout: (number|Long);

        /**
         * Creates a new ConnectPeerRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConnectPeerRequest instance
         */
        public static create(properties?: lnrpc.IConnectPeerRequest): lnrpc.ConnectPeerRequest;

        /**
         * Encodes the specified ConnectPeerRequest message. Does not implicitly {@link lnrpc.ConnectPeerRequest.verify|verify} messages.
         * @param message ConnectPeerRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IConnectPeerRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ConnectPeerRequest message, length delimited. Does not implicitly {@link lnrpc.ConnectPeerRequest.verify|verify} messages.
         * @param message ConnectPeerRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IConnectPeerRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConnectPeerRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConnectPeerRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ConnectPeerRequest;

        /**
         * Decodes a ConnectPeerRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ConnectPeerRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ConnectPeerRequest;

        /**
         * Verifies a ConnectPeerRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ConnectPeerRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ConnectPeerRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ConnectPeerRequest;

        /**
         * Creates a plain object from a ConnectPeerRequest message. Also converts values to other types if specified.
         * @param message ConnectPeerRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ConnectPeerRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ConnectPeerRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ConnectPeerResponse. */
    interface IConnectPeerResponse {
    }

    /** Represents a ConnectPeerResponse. */
    class ConnectPeerResponse implements IConnectPeerResponse {

        /**
         * Constructs a new ConnectPeerResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IConnectPeerResponse);

        /**
         * Creates a new ConnectPeerResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConnectPeerResponse instance
         */
        public static create(properties?: lnrpc.IConnectPeerResponse): lnrpc.ConnectPeerResponse;

        /**
         * Encodes the specified ConnectPeerResponse message. Does not implicitly {@link lnrpc.ConnectPeerResponse.verify|verify} messages.
         * @param message ConnectPeerResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IConnectPeerResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ConnectPeerResponse message, length delimited. Does not implicitly {@link lnrpc.ConnectPeerResponse.verify|verify} messages.
         * @param message ConnectPeerResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IConnectPeerResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConnectPeerResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConnectPeerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ConnectPeerResponse;

        /**
         * Decodes a ConnectPeerResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ConnectPeerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ConnectPeerResponse;

        /**
         * Verifies a ConnectPeerResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ConnectPeerResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ConnectPeerResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ConnectPeerResponse;

        /**
         * Creates a plain object from a ConnectPeerResponse message. Also converts values to other types if specified.
         * @param message ConnectPeerResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ConnectPeerResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ConnectPeerResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DisconnectPeerRequest. */
    interface IDisconnectPeerRequest {

        /** DisconnectPeerRequest pubKey */
        pubKey?: (string|null);
    }

    /** Represents a DisconnectPeerRequest. */
    class DisconnectPeerRequest implements IDisconnectPeerRequest {

        /**
         * Constructs a new DisconnectPeerRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IDisconnectPeerRequest);

        /** DisconnectPeerRequest pubKey. */
        public pubKey: string;

        /**
         * Creates a new DisconnectPeerRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DisconnectPeerRequest instance
         */
        public static create(properties?: lnrpc.IDisconnectPeerRequest): lnrpc.DisconnectPeerRequest;

        /**
         * Encodes the specified DisconnectPeerRequest message. Does not implicitly {@link lnrpc.DisconnectPeerRequest.verify|verify} messages.
         * @param message DisconnectPeerRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IDisconnectPeerRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DisconnectPeerRequest message, length delimited. Does not implicitly {@link lnrpc.DisconnectPeerRequest.verify|verify} messages.
         * @param message DisconnectPeerRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IDisconnectPeerRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DisconnectPeerRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DisconnectPeerRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.DisconnectPeerRequest;

        /**
         * Decodes a DisconnectPeerRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DisconnectPeerRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.DisconnectPeerRequest;

        /**
         * Verifies a DisconnectPeerRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DisconnectPeerRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DisconnectPeerRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.DisconnectPeerRequest;

        /**
         * Creates a plain object from a DisconnectPeerRequest message. Also converts values to other types if specified.
         * @param message DisconnectPeerRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.DisconnectPeerRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DisconnectPeerRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DisconnectPeerResponse. */
    interface IDisconnectPeerResponse {
    }

    /** Represents a DisconnectPeerResponse. */
    class DisconnectPeerResponse implements IDisconnectPeerResponse {

        /**
         * Constructs a new DisconnectPeerResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IDisconnectPeerResponse);

        /**
         * Creates a new DisconnectPeerResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DisconnectPeerResponse instance
         */
        public static create(properties?: lnrpc.IDisconnectPeerResponse): lnrpc.DisconnectPeerResponse;

        /**
         * Encodes the specified DisconnectPeerResponse message. Does not implicitly {@link lnrpc.DisconnectPeerResponse.verify|verify} messages.
         * @param message DisconnectPeerResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IDisconnectPeerResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DisconnectPeerResponse message, length delimited. Does not implicitly {@link lnrpc.DisconnectPeerResponse.verify|verify} messages.
         * @param message DisconnectPeerResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IDisconnectPeerResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DisconnectPeerResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DisconnectPeerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.DisconnectPeerResponse;

        /**
         * Decodes a DisconnectPeerResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DisconnectPeerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.DisconnectPeerResponse;

        /**
         * Verifies a DisconnectPeerResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DisconnectPeerResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DisconnectPeerResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.DisconnectPeerResponse;

        /**
         * Creates a plain object from a DisconnectPeerResponse message. Also converts values to other types if specified.
         * @param message DisconnectPeerResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.DisconnectPeerResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DisconnectPeerResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HTLC. */
    interface IHTLC {

        /** HTLC incoming */
        incoming?: (boolean|null);

        /** HTLC amount */
        amount?: (number|Long|null);

        /** HTLC hashLock */
        hashLock?: (Uint8Array|null);

        /** HTLC expirationHeight */
        expirationHeight?: (number|null);

        /** HTLC htlcIndex */
        htlcIndex?: (number|Long|null);

        /** HTLC forwardingChannel */
        forwardingChannel?: (number|Long|null);

        /** HTLC forwardingHtlcIndex */
        forwardingHtlcIndex?: (number|Long|null);
    }

    /** Represents a HTLC. */
    class HTLC implements IHTLC {

        /**
         * Constructs a new HTLC.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IHTLC);

        /** HTLC incoming. */
        public incoming: boolean;

        /** HTLC amount. */
        public amount: (number|Long);

        /** HTLC hashLock. */
        public hashLock: Uint8Array;

        /** HTLC expirationHeight. */
        public expirationHeight: number;

        /** HTLC htlcIndex. */
        public htlcIndex: (number|Long);

        /** HTLC forwardingChannel. */
        public forwardingChannel: (number|Long);

        /** HTLC forwardingHtlcIndex. */
        public forwardingHtlcIndex: (number|Long);

        /**
         * Creates a new HTLC instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HTLC instance
         */
        public static create(properties?: lnrpc.IHTLC): lnrpc.HTLC;

        /**
         * Encodes the specified HTLC message. Does not implicitly {@link lnrpc.HTLC.verify|verify} messages.
         * @param message HTLC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IHTLC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HTLC message, length delimited. Does not implicitly {@link lnrpc.HTLC.verify|verify} messages.
         * @param message HTLC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IHTLC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HTLC message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HTLC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.HTLC;

        /**
         * Decodes a HTLC message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HTLC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.HTLC;

        /**
         * Verifies a HTLC message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HTLC message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HTLC
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.HTLC;

        /**
         * Creates a plain object from a HTLC message. Also converts values to other types if specified.
         * @param message HTLC
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.HTLC, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HTLC to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** CommitmentType enum. */
    enum CommitmentType {
        LEGACY = 0,
        STATIC_REMOTE_KEY = 1,
        ANCHORS = 2,
        UNKNOWN_COMMITMENT_TYPE = 999
    }

    /** Properties of a ChannelConstraints. */
    interface IChannelConstraints {

        /** ChannelConstraints csvDelay */
        csvDelay?: (number|null);

        /** ChannelConstraints chanReserveSat */
        chanReserveSat?: (number|Long|null);

        /** ChannelConstraints dustLimitSat */
        dustLimitSat?: (number|Long|null);

        /** ChannelConstraints maxPendingAmtMsat */
        maxPendingAmtMsat?: (number|Long|null);

        /** ChannelConstraints minHtlcMsat */
        minHtlcMsat?: (number|Long|null);

        /** ChannelConstraints maxAcceptedHtlcs */
        maxAcceptedHtlcs?: (number|null);
    }

    /** Represents a ChannelConstraints. */
    class ChannelConstraints implements IChannelConstraints {

        /**
         * Constructs a new ChannelConstraints.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelConstraints);

        /** ChannelConstraints csvDelay. */
        public csvDelay: number;

        /** ChannelConstraints chanReserveSat. */
        public chanReserveSat: (number|Long);

        /** ChannelConstraints dustLimitSat. */
        public dustLimitSat: (number|Long);

        /** ChannelConstraints maxPendingAmtMsat. */
        public maxPendingAmtMsat: (number|Long);

        /** ChannelConstraints minHtlcMsat. */
        public minHtlcMsat: (number|Long);

        /** ChannelConstraints maxAcceptedHtlcs. */
        public maxAcceptedHtlcs: number;

        /**
         * Creates a new ChannelConstraints instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelConstraints instance
         */
        public static create(properties?: lnrpc.IChannelConstraints): lnrpc.ChannelConstraints;

        /**
         * Encodes the specified ChannelConstraints message. Does not implicitly {@link lnrpc.ChannelConstraints.verify|verify} messages.
         * @param message ChannelConstraints message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelConstraints, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelConstraints message, length delimited. Does not implicitly {@link lnrpc.ChannelConstraints.verify|verify} messages.
         * @param message ChannelConstraints message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelConstraints, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelConstraints message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelConstraints
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelConstraints;

        /**
         * Decodes a ChannelConstraints message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelConstraints
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelConstraints;

        /**
         * Verifies a ChannelConstraints message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelConstraints message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelConstraints
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelConstraints;

        /**
         * Creates a plain object from a ChannelConstraints message. Also converts values to other types if specified.
         * @param message ChannelConstraints
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelConstraints, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelConstraints to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Channel. */
    interface IChannel {

        /** Channel active */
        active?: (boolean|null);

        /** Channel remotePubkey */
        remotePubkey?: (string|null);

        /** Channel channelPoint */
        channelPoint?: (string|null);

        /** Channel chanId */
        chanId?: (number|Long|null);

        /** Channel capacity */
        capacity?: (number|Long|null);

        /** Channel localBalance */
        localBalance?: (number|Long|null);

        /** Channel remoteBalance */
        remoteBalance?: (number|Long|null);

        /** Channel commitFee */
        commitFee?: (number|Long|null);

        /** Channel commitWeight */
        commitWeight?: (number|Long|null);

        /** Channel feePerKw */
        feePerKw?: (number|Long|null);

        /** Channel unsettledBalance */
        unsettledBalance?: (number|Long|null);

        /** Channel totalSatoshisSent */
        totalSatoshisSent?: (number|Long|null);

        /** Channel totalSatoshisReceived */
        totalSatoshisReceived?: (number|Long|null);

        /** Channel numUpdates */
        numUpdates?: (number|Long|null);

        /** Channel pendingHtlcs */
        pendingHtlcs?: (lnrpc.IHTLC[]|null);

        /** Channel csvDelay */
        csvDelay?: (number|null);

        /** Channel private */
        "private"?: (boolean|null);

        /** Channel initiator */
        initiator?: (boolean|null);

        /** Channel chanStatusFlags */
        chanStatusFlags?: (string|null);

        /** Channel localChanReserveSat */
        localChanReserveSat?: (number|Long|null);

        /** Channel remoteChanReserveSat */
        remoteChanReserveSat?: (number|Long|null);

        /** Channel staticRemoteKey */
        staticRemoteKey?: (boolean|null);

        /** Channel commitmentType */
        commitmentType?: (lnrpc.CommitmentType|null);

        /** Channel lifetime */
        lifetime?: (number|Long|null);

        /** Channel uptime */
        uptime?: (number|Long|null);

        /** Channel closeAddress */
        closeAddress?: (string|null);

        /** Channel pushAmountSat */
        pushAmountSat?: (number|Long|null);

        /** Channel thawHeight */
        thawHeight?: (number|null);

        /** Channel localConstraints */
        localConstraints?: (lnrpc.IChannelConstraints|null);

        /** Channel remoteConstraints */
        remoteConstraints?: (lnrpc.IChannelConstraints|null);
    }

    /** Represents a Channel. */
    class Channel implements IChannel {

        /**
         * Constructs a new Channel.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannel);

        /** Channel active. */
        public active: boolean;

        /** Channel remotePubkey. */
        public remotePubkey: string;

        /** Channel channelPoint. */
        public channelPoint: string;

        /** Channel chanId. */
        public chanId: (number|Long);

        /** Channel capacity. */
        public capacity: (number|Long);

        /** Channel localBalance. */
        public localBalance: (number|Long);

        /** Channel remoteBalance. */
        public remoteBalance: (number|Long);

        /** Channel commitFee. */
        public commitFee: (number|Long);

        /** Channel commitWeight. */
        public commitWeight: (number|Long);

        /** Channel feePerKw. */
        public feePerKw: (number|Long);

        /** Channel unsettledBalance. */
        public unsettledBalance: (number|Long);

        /** Channel totalSatoshisSent. */
        public totalSatoshisSent: (number|Long);

        /** Channel totalSatoshisReceived. */
        public totalSatoshisReceived: (number|Long);

        /** Channel numUpdates. */
        public numUpdates: (number|Long);

        /** Channel pendingHtlcs. */
        public pendingHtlcs: lnrpc.IHTLC[];

        /** Channel csvDelay. */
        public csvDelay: number;

        /** Channel private. */
        public private: boolean;

        /** Channel initiator. */
        public initiator: boolean;

        /** Channel chanStatusFlags. */
        public chanStatusFlags: string;

        /** Channel localChanReserveSat. */
        public localChanReserveSat: (number|Long);

        /** Channel remoteChanReserveSat. */
        public remoteChanReserveSat: (number|Long);

        /** Channel staticRemoteKey. */
        public staticRemoteKey: boolean;

        /** Channel commitmentType. */
        public commitmentType: lnrpc.CommitmentType;

        /** Channel lifetime. */
        public lifetime: (number|Long);

        /** Channel uptime. */
        public uptime: (number|Long);

        /** Channel closeAddress. */
        public closeAddress: string;

        /** Channel pushAmountSat. */
        public pushAmountSat: (number|Long);

        /** Channel thawHeight. */
        public thawHeight: number;

        /** Channel localConstraints. */
        public localConstraints?: (lnrpc.IChannelConstraints|null);

        /** Channel remoteConstraints. */
        public remoteConstraints?: (lnrpc.IChannelConstraints|null);

        /**
         * Creates a new Channel instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Channel instance
         */
        public static create(properties?: lnrpc.IChannel): lnrpc.Channel;

        /**
         * Encodes the specified Channel message. Does not implicitly {@link lnrpc.Channel.verify|verify} messages.
         * @param message Channel message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannel, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Channel message, length delimited. Does not implicitly {@link lnrpc.Channel.verify|verify} messages.
         * @param message Channel message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannel, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Channel message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Channel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Channel;

        /**
         * Decodes a Channel message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Channel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Channel;

        /**
         * Verifies a Channel message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Channel message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Channel
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Channel;

        /**
         * Creates a plain object from a Channel message. Also converts values to other types if specified.
         * @param message Channel
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Channel, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Channel to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListChannelsRequest. */
    interface IListChannelsRequest {

        /** ListChannelsRequest activeOnly */
        activeOnly?: (boolean|null);

        /** ListChannelsRequest inactiveOnly */
        inactiveOnly?: (boolean|null);

        /** ListChannelsRequest publicOnly */
        publicOnly?: (boolean|null);

        /** ListChannelsRequest privateOnly */
        privateOnly?: (boolean|null);

        /** ListChannelsRequest peer */
        peer?: (Uint8Array|null);
    }

    /** Represents a ListChannelsRequest. */
    class ListChannelsRequest implements IListChannelsRequest {

        /**
         * Constructs a new ListChannelsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListChannelsRequest);

        /** ListChannelsRequest activeOnly. */
        public activeOnly: boolean;

        /** ListChannelsRequest inactiveOnly. */
        public inactiveOnly: boolean;

        /** ListChannelsRequest publicOnly. */
        public publicOnly: boolean;

        /** ListChannelsRequest privateOnly. */
        public privateOnly: boolean;

        /** ListChannelsRequest peer. */
        public peer: Uint8Array;

        /**
         * Creates a new ListChannelsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListChannelsRequest instance
         */
        public static create(properties?: lnrpc.IListChannelsRequest): lnrpc.ListChannelsRequest;

        /**
         * Encodes the specified ListChannelsRequest message. Does not implicitly {@link lnrpc.ListChannelsRequest.verify|verify} messages.
         * @param message ListChannelsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListChannelsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListChannelsRequest message, length delimited. Does not implicitly {@link lnrpc.ListChannelsRequest.verify|verify} messages.
         * @param message ListChannelsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListChannelsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListChannelsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListChannelsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListChannelsRequest;

        /**
         * Decodes a ListChannelsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListChannelsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListChannelsRequest;

        /**
         * Verifies a ListChannelsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListChannelsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListChannelsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListChannelsRequest;

        /**
         * Creates a plain object from a ListChannelsRequest message. Also converts values to other types if specified.
         * @param message ListChannelsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListChannelsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListChannelsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListChannelsResponse. */
    interface IListChannelsResponse {

        /** ListChannelsResponse channels */
        channels?: (lnrpc.IChannel[]|null);
    }

    /** Represents a ListChannelsResponse. */
    class ListChannelsResponse implements IListChannelsResponse {

        /**
         * Constructs a new ListChannelsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListChannelsResponse);

        /** ListChannelsResponse channels. */
        public channels: lnrpc.IChannel[];

        /**
         * Creates a new ListChannelsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListChannelsResponse instance
         */
        public static create(properties?: lnrpc.IListChannelsResponse): lnrpc.ListChannelsResponse;

        /**
         * Encodes the specified ListChannelsResponse message. Does not implicitly {@link lnrpc.ListChannelsResponse.verify|verify} messages.
         * @param message ListChannelsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListChannelsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListChannelsResponse message, length delimited. Does not implicitly {@link lnrpc.ListChannelsResponse.verify|verify} messages.
         * @param message ListChannelsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListChannelsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListChannelsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListChannelsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListChannelsResponse;

        /**
         * Decodes a ListChannelsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListChannelsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListChannelsResponse;

        /**
         * Verifies a ListChannelsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListChannelsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListChannelsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListChannelsResponse;

        /**
         * Creates a plain object from a ListChannelsResponse message. Also converts values to other types if specified.
         * @param message ListChannelsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListChannelsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListChannelsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Initiator enum. */
    enum Initiator {
        INITIATOR_UNKNOWN = 0,
        INITIATOR_LOCAL = 1,
        INITIATOR_REMOTE = 2,
        INITIATOR_BOTH = 3
    }

    /** Properties of a ChannelCloseSummary. */
    interface IChannelCloseSummary {

        /** ChannelCloseSummary channelPoint */
        channelPoint?: (string|null);

        /** ChannelCloseSummary chanId */
        chanId?: (number|Long|null);

        /** ChannelCloseSummary chainHash */
        chainHash?: (string|null);

        /** ChannelCloseSummary closingTxHash */
        closingTxHash?: (string|null);

        /** ChannelCloseSummary remotePubkey */
        remotePubkey?: (string|null);

        /** ChannelCloseSummary capacity */
        capacity?: (number|Long|null);

        /** ChannelCloseSummary closeHeight */
        closeHeight?: (number|null);

        /** ChannelCloseSummary settledBalance */
        settledBalance?: (number|Long|null);

        /** ChannelCloseSummary timeLockedBalance */
        timeLockedBalance?: (number|Long|null);

        /** ChannelCloseSummary closeType */
        closeType?: (lnrpc.ChannelCloseSummary.ClosureType|null);

        /** ChannelCloseSummary openInitiator */
        openInitiator?: (lnrpc.Initiator|null);

        /** ChannelCloseSummary closeInitiator */
        closeInitiator?: (lnrpc.Initiator|null);

        /** ChannelCloseSummary resolutions */
        resolutions?: (lnrpc.IResolution[]|null);
    }

    /** Represents a ChannelCloseSummary. */
    class ChannelCloseSummary implements IChannelCloseSummary {

        /**
         * Constructs a new ChannelCloseSummary.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelCloseSummary);

        /** ChannelCloseSummary channelPoint. */
        public channelPoint: string;

        /** ChannelCloseSummary chanId. */
        public chanId: (number|Long);

        /** ChannelCloseSummary chainHash. */
        public chainHash: string;

        /** ChannelCloseSummary closingTxHash. */
        public closingTxHash: string;

        /** ChannelCloseSummary remotePubkey. */
        public remotePubkey: string;

        /** ChannelCloseSummary capacity. */
        public capacity: (number|Long);

        /** ChannelCloseSummary closeHeight. */
        public closeHeight: number;

        /** ChannelCloseSummary settledBalance. */
        public settledBalance: (number|Long);

        /** ChannelCloseSummary timeLockedBalance. */
        public timeLockedBalance: (number|Long);

        /** ChannelCloseSummary closeType. */
        public closeType: lnrpc.ChannelCloseSummary.ClosureType;

        /** ChannelCloseSummary openInitiator. */
        public openInitiator: lnrpc.Initiator;

        /** ChannelCloseSummary closeInitiator. */
        public closeInitiator: lnrpc.Initiator;

        /** ChannelCloseSummary resolutions. */
        public resolutions: lnrpc.IResolution[];

        /**
         * Creates a new ChannelCloseSummary instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelCloseSummary instance
         */
        public static create(properties?: lnrpc.IChannelCloseSummary): lnrpc.ChannelCloseSummary;

        /**
         * Encodes the specified ChannelCloseSummary message. Does not implicitly {@link lnrpc.ChannelCloseSummary.verify|verify} messages.
         * @param message ChannelCloseSummary message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelCloseSummary, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelCloseSummary message, length delimited. Does not implicitly {@link lnrpc.ChannelCloseSummary.verify|verify} messages.
         * @param message ChannelCloseSummary message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelCloseSummary, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelCloseSummary message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelCloseSummary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelCloseSummary;

        /**
         * Decodes a ChannelCloseSummary message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelCloseSummary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelCloseSummary;

        /**
         * Verifies a ChannelCloseSummary message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelCloseSummary message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelCloseSummary
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelCloseSummary;

        /**
         * Creates a plain object from a ChannelCloseSummary message. Also converts values to other types if specified.
         * @param message ChannelCloseSummary
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelCloseSummary, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelCloseSummary to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ChannelCloseSummary {

        /** ClosureType enum. */
        enum ClosureType {
            COOPERATIVE_CLOSE = 0,
            LOCAL_FORCE_CLOSE = 1,
            REMOTE_FORCE_CLOSE = 2,
            BREACH_CLOSE = 3,
            FUNDING_CANCELED = 4,
            ABANDONED = 5
        }
    }

    /** ResolutionType enum. */
    enum ResolutionType {
        TYPE_UNKNOWN = 0,
        ANCHOR = 1,
        INCOMING_HTLC = 2,
        OUTGOING_HTLC = 3,
        COMMIT = 4
    }

    /** ResolutionOutcome enum. */
    enum ResolutionOutcome {
        OUTCOME_UNKNOWN = 0,
        CLAIMED = 1,
        UNCLAIMED = 2,
        ABANDONED = 3,
        FIRST_STAGE = 4,
        TIMEOUT = 5
    }

    /** Properties of a Resolution. */
    interface IResolution {

        /** Resolution resolutionType */
        resolutionType?: (lnrpc.ResolutionType|null);

        /** Resolution outcome */
        outcome?: (lnrpc.ResolutionOutcome|null);

        /** Resolution outpoint */
        outpoint?: (lnrpc.IOutPoint|null);

        /** Resolution amountSat */
        amountSat?: (number|Long|null);

        /** Resolution sweepTxid */
        sweepTxid?: (string|null);
    }

    /** Represents a Resolution. */
    class Resolution implements IResolution {

        /**
         * Constructs a new Resolution.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IResolution);

        /** Resolution resolutionType. */
        public resolutionType: lnrpc.ResolutionType;

        /** Resolution outcome. */
        public outcome: lnrpc.ResolutionOutcome;

        /** Resolution outpoint. */
        public outpoint?: (lnrpc.IOutPoint|null);

        /** Resolution amountSat. */
        public amountSat: (number|Long);

        /** Resolution sweepTxid. */
        public sweepTxid: string;

        /**
         * Creates a new Resolution instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Resolution instance
         */
        public static create(properties?: lnrpc.IResolution): lnrpc.Resolution;

        /**
         * Encodes the specified Resolution message. Does not implicitly {@link lnrpc.Resolution.verify|verify} messages.
         * @param message Resolution message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IResolution, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Resolution message, length delimited. Does not implicitly {@link lnrpc.Resolution.verify|verify} messages.
         * @param message Resolution message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IResolution, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Resolution message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Resolution
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Resolution;

        /**
         * Decodes a Resolution message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Resolution
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Resolution;

        /**
         * Verifies a Resolution message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Resolution message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Resolution
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Resolution;

        /**
         * Creates a plain object from a Resolution message. Also converts values to other types if specified.
         * @param message Resolution
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Resolution, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Resolution to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ClosedChannelsRequest. */
    interface IClosedChannelsRequest {

        /** ClosedChannelsRequest cooperative */
        cooperative?: (boolean|null);

        /** ClosedChannelsRequest localForce */
        localForce?: (boolean|null);

        /** ClosedChannelsRequest remoteForce */
        remoteForce?: (boolean|null);

        /** ClosedChannelsRequest breach */
        breach?: (boolean|null);

        /** ClosedChannelsRequest fundingCanceled */
        fundingCanceled?: (boolean|null);

        /** ClosedChannelsRequest abandoned */
        abandoned?: (boolean|null);
    }

    /** Represents a ClosedChannelsRequest. */
    class ClosedChannelsRequest implements IClosedChannelsRequest {

        /**
         * Constructs a new ClosedChannelsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IClosedChannelsRequest);

        /** ClosedChannelsRequest cooperative. */
        public cooperative: boolean;

        /** ClosedChannelsRequest localForce. */
        public localForce: boolean;

        /** ClosedChannelsRequest remoteForce. */
        public remoteForce: boolean;

        /** ClosedChannelsRequest breach. */
        public breach: boolean;

        /** ClosedChannelsRequest fundingCanceled. */
        public fundingCanceled: boolean;

        /** ClosedChannelsRequest abandoned. */
        public abandoned: boolean;

        /**
         * Creates a new ClosedChannelsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClosedChannelsRequest instance
         */
        public static create(properties?: lnrpc.IClosedChannelsRequest): lnrpc.ClosedChannelsRequest;

        /**
         * Encodes the specified ClosedChannelsRequest message. Does not implicitly {@link lnrpc.ClosedChannelsRequest.verify|verify} messages.
         * @param message ClosedChannelsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IClosedChannelsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClosedChannelsRequest message, length delimited. Does not implicitly {@link lnrpc.ClosedChannelsRequest.verify|verify} messages.
         * @param message ClosedChannelsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IClosedChannelsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClosedChannelsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClosedChannelsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ClosedChannelsRequest;

        /**
         * Decodes a ClosedChannelsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClosedChannelsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ClosedChannelsRequest;

        /**
         * Verifies a ClosedChannelsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClosedChannelsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClosedChannelsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ClosedChannelsRequest;

        /**
         * Creates a plain object from a ClosedChannelsRequest message. Also converts values to other types if specified.
         * @param message ClosedChannelsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ClosedChannelsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClosedChannelsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ClosedChannelsResponse. */
    interface IClosedChannelsResponse {

        /** ClosedChannelsResponse channels */
        channels?: (lnrpc.IChannelCloseSummary[]|null);
    }

    /** Represents a ClosedChannelsResponse. */
    class ClosedChannelsResponse implements IClosedChannelsResponse {

        /**
         * Constructs a new ClosedChannelsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IClosedChannelsResponse);

        /** ClosedChannelsResponse channels. */
        public channels: lnrpc.IChannelCloseSummary[];

        /**
         * Creates a new ClosedChannelsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClosedChannelsResponse instance
         */
        public static create(properties?: lnrpc.IClosedChannelsResponse): lnrpc.ClosedChannelsResponse;

        /**
         * Encodes the specified ClosedChannelsResponse message. Does not implicitly {@link lnrpc.ClosedChannelsResponse.verify|verify} messages.
         * @param message ClosedChannelsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IClosedChannelsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClosedChannelsResponse message, length delimited. Does not implicitly {@link lnrpc.ClosedChannelsResponse.verify|verify} messages.
         * @param message ClosedChannelsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IClosedChannelsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClosedChannelsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClosedChannelsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ClosedChannelsResponse;

        /**
         * Decodes a ClosedChannelsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClosedChannelsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ClosedChannelsResponse;

        /**
         * Verifies a ClosedChannelsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClosedChannelsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClosedChannelsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ClosedChannelsResponse;

        /**
         * Creates a plain object from a ClosedChannelsResponse message. Also converts values to other types if specified.
         * @param message ClosedChannelsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ClosedChannelsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClosedChannelsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Peer. */
    interface IPeer {

        /** Peer pubKey */
        pubKey?: (string|null);

        /** Peer address */
        address?: (string|null);

        /** Peer bytesSent */
        bytesSent?: (number|Long|null);

        /** Peer bytesRecv */
        bytesRecv?: (number|Long|null);

        /** Peer satSent */
        satSent?: (number|Long|null);

        /** Peer satRecv */
        satRecv?: (number|Long|null);

        /** Peer inbound */
        inbound?: (boolean|null);

        /** Peer pingTime */
        pingTime?: (number|Long|null);

        /** Peer syncType */
        syncType?: (lnrpc.Peer.SyncType|null);

        /** Peer features */
        features?: ({ [k: string]: lnrpc.IFeature }|null);

        /** Peer errors */
        errors?: (lnrpc.ITimestampedError[]|null);

        /** Peer flapCount */
        flapCount?: (number|null);

        /** Peer lastFlapNs */
        lastFlapNs?: (number|Long|null);
    }

    /** Represents a Peer. */
    class Peer implements IPeer {

        /**
         * Constructs a new Peer.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPeer);

        /** Peer pubKey. */
        public pubKey: string;

        /** Peer address. */
        public address: string;

        /** Peer bytesSent. */
        public bytesSent: (number|Long);

        /** Peer bytesRecv. */
        public bytesRecv: (number|Long);

        /** Peer satSent. */
        public satSent: (number|Long);

        /** Peer satRecv. */
        public satRecv: (number|Long);

        /** Peer inbound. */
        public inbound: boolean;

        /** Peer pingTime. */
        public pingTime: (number|Long);

        /** Peer syncType. */
        public syncType: lnrpc.Peer.SyncType;

        /** Peer features. */
        public features: { [k: string]: lnrpc.IFeature };

        /** Peer errors. */
        public errors: lnrpc.ITimestampedError[];

        /** Peer flapCount. */
        public flapCount: number;

        /** Peer lastFlapNs. */
        public lastFlapNs: (number|Long);

        /**
         * Creates a new Peer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Peer instance
         */
        public static create(properties?: lnrpc.IPeer): lnrpc.Peer;

        /**
         * Encodes the specified Peer message. Does not implicitly {@link lnrpc.Peer.verify|verify} messages.
         * @param message Peer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPeer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Peer message, length delimited. Does not implicitly {@link lnrpc.Peer.verify|verify} messages.
         * @param message Peer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPeer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Peer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Peer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Peer;

        /**
         * Decodes a Peer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Peer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Peer;

        /**
         * Verifies a Peer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Peer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Peer
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Peer;

        /**
         * Creates a plain object from a Peer message. Also converts values to other types if specified.
         * @param message Peer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Peer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Peer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Peer {

        /** SyncType enum. */
        enum SyncType {
            UNKNOWN_SYNC = 0,
            ACTIVE_SYNC = 1,
            PASSIVE_SYNC = 2
        }
    }

    /** Properties of a TimestampedError. */
    interface ITimestampedError {

        /** TimestampedError timestamp */
        timestamp?: (number|Long|null);

        /** TimestampedError error */
        error?: (string|null);
    }

    /** Represents a TimestampedError. */
    class TimestampedError implements ITimestampedError {

        /**
         * Constructs a new TimestampedError.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ITimestampedError);

        /** TimestampedError timestamp. */
        public timestamp: (number|Long);

        /** TimestampedError error. */
        public error: string;

        /**
         * Creates a new TimestampedError instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TimestampedError instance
         */
        public static create(properties?: lnrpc.ITimestampedError): lnrpc.TimestampedError;

        /**
         * Encodes the specified TimestampedError message. Does not implicitly {@link lnrpc.TimestampedError.verify|verify} messages.
         * @param message TimestampedError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ITimestampedError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TimestampedError message, length delimited. Does not implicitly {@link lnrpc.TimestampedError.verify|verify} messages.
         * @param message TimestampedError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ITimestampedError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TimestampedError message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TimestampedError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.TimestampedError;

        /**
         * Decodes a TimestampedError message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TimestampedError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.TimestampedError;

        /**
         * Verifies a TimestampedError message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TimestampedError message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TimestampedError
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.TimestampedError;

        /**
         * Creates a plain object from a TimestampedError message. Also converts values to other types if specified.
         * @param message TimestampedError
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.TimestampedError, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TimestampedError to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListPeersRequest. */
    interface IListPeersRequest {

        /** ListPeersRequest latestError */
        latestError?: (boolean|null);
    }

    /** Represents a ListPeersRequest. */
    class ListPeersRequest implements IListPeersRequest {

        /**
         * Constructs a new ListPeersRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListPeersRequest);

        /** ListPeersRequest latestError. */
        public latestError: boolean;

        /**
         * Creates a new ListPeersRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPeersRequest instance
         */
        public static create(properties?: lnrpc.IListPeersRequest): lnrpc.ListPeersRequest;

        /**
         * Encodes the specified ListPeersRequest message. Does not implicitly {@link lnrpc.ListPeersRequest.verify|verify} messages.
         * @param message ListPeersRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListPeersRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPeersRequest message, length delimited. Does not implicitly {@link lnrpc.ListPeersRequest.verify|verify} messages.
         * @param message ListPeersRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListPeersRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPeersRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPeersRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListPeersRequest;

        /**
         * Decodes a ListPeersRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPeersRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListPeersRequest;

        /**
         * Verifies a ListPeersRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPeersRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPeersRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListPeersRequest;

        /**
         * Creates a plain object from a ListPeersRequest message. Also converts values to other types if specified.
         * @param message ListPeersRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListPeersRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPeersRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListPeersResponse. */
    interface IListPeersResponse {

        /** ListPeersResponse peers */
        peers?: (lnrpc.IPeer[]|null);
    }

    /** Represents a ListPeersResponse. */
    class ListPeersResponse implements IListPeersResponse {

        /**
         * Constructs a new ListPeersResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListPeersResponse);

        /** ListPeersResponse peers. */
        public peers: lnrpc.IPeer[];

        /**
         * Creates a new ListPeersResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPeersResponse instance
         */
        public static create(properties?: lnrpc.IListPeersResponse): lnrpc.ListPeersResponse;

        /**
         * Encodes the specified ListPeersResponse message. Does not implicitly {@link lnrpc.ListPeersResponse.verify|verify} messages.
         * @param message ListPeersResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListPeersResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPeersResponse message, length delimited. Does not implicitly {@link lnrpc.ListPeersResponse.verify|verify} messages.
         * @param message ListPeersResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListPeersResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPeersResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPeersResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListPeersResponse;

        /**
         * Decodes a ListPeersResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPeersResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListPeersResponse;

        /**
         * Verifies a ListPeersResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPeersResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPeersResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListPeersResponse;

        /**
         * Creates a plain object from a ListPeersResponse message. Also converts values to other types if specified.
         * @param message ListPeersResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListPeersResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPeersResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PeerEventSubscription. */
    interface IPeerEventSubscription {
    }

    /** Represents a PeerEventSubscription. */
    class PeerEventSubscription implements IPeerEventSubscription {

        /**
         * Constructs a new PeerEventSubscription.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPeerEventSubscription);

        /**
         * Creates a new PeerEventSubscription instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PeerEventSubscription instance
         */
        public static create(properties?: lnrpc.IPeerEventSubscription): lnrpc.PeerEventSubscription;

        /**
         * Encodes the specified PeerEventSubscription message. Does not implicitly {@link lnrpc.PeerEventSubscription.verify|verify} messages.
         * @param message PeerEventSubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPeerEventSubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PeerEventSubscription message, length delimited. Does not implicitly {@link lnrpc.PeerEventSubscription.verify|verify} messages.
         * @param message PeerEventSubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPeerEventSubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PeerEventSubscription message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PeerEventSubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PeerEventSubscription;

        /**
         * Decodes a PeerEventSubscription message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PeerEventSubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PeerEventSubscription;

        /**
         * Verifies a PeerEventSubscription message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PeerEventSubscription message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PeerEventSubscription
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PeerEventSubscription;

        /**
         * Creates a plain object from a PeerEventSubscription message. Also converts values to other types if specified.
         * @param message PeerEventSubscription
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PeerEventSubscription, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PeerEventSubscription to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PeerEvent. */
    interface IPeerEvent {

        /** PeerEvent pubKey */
        pubKey?: (string|null);

        /** PeerEvent type */
        type?: (lnrpc.PeerEvent.EventType|null);
    }

    /** Represents a PeerEvent. */
    class PeerEvent implements IPeerEvent {

        /**
         * Constructs a new PeerEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPeerEvent);

        /** PeerEvent pubKey. */
        public pubKey: string;

        /** PeerEvent type. */
        public type: lnrpc.PeerEvent.EventType;

        /**
         * Creates a new PeerEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PeerEvent instance
         */
        public static create(properties?: lnrpc.IPeerEvent): lnrpc.PeerEvent;

        /**
         * Encodes the specified PeerEvent message. Does not implicitly {@link lnrpc.PeerEvent.verify|verify} messages.
         * @param message PeerEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPeerEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PeerEvent message, length delimited. Does not implicitly {@link lnrpc.PeerEvent.verify|verify} messages.
         * @param message PeerEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPeerEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PeerEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PeerEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PeerEvent;

        /**
         * Decodes a PeerEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PeerEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PeerEvent;

        /**
         * Verifies a PeerEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PeerEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PeerEvent
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PeerEvent;

        /**
         * Creates a plain object from a PeerEvent message. Also converts values to other types if specified.
         * @param message PeerEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PeerEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PeerEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace PeerEvent {

        /** EventType enum. */
        enum EventType {
            PEER_ONLINE = 0,
            PEER_OFFLINE = 1
        }
    }

    /** Properties of a GetInfoRequest. */
    interface IGetInfoRequest {
    }

    /** Represents a GetInfoRequest. */
    class GetInfoRequest implements IGetInfoRequest {

        /**
         * Constructs a new GetInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IGetInfoRequest);

        /**
         * Creates a new GetInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetInfoRequest instance
         */
        public static create(properties?: lnrpc.IGetInfoRequest): lnrpc.GetInfoRequest;

        /**
         * Encodes the specified GetInfoRequest message. Does not implicitly {@link lnrpc.GetInfoRequest.verify|verify} messages.
         * @param message GetInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IGetInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetInfoRequest message, length delimited. Does not implicitly {@link lnrpc.GetInfoRequest.verify|verify} messages.
         * @param message GetInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IGetInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.GetInfoRequest;

        /**
         * Decodes a GetInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.GetInfoRequest;

        /**
         * Verifies a GetInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.GetInfoRequest;

        /**
         * Creates a plain object from a GetInfoRequest message. Also converts values to other types if specified.
         * @param message GetInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.GetInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetInfoResponse. */
    interface IGetInfoResponse {

        /** GetInfoResponse version */
        version?: (string|null);

        /** GetInfoResponse commitHash */
        commitHash?: (string|null);

        /** GetInfoResponse identityPubkey */
        identityPubkey?: (string|null);

        /** GetInfoResponse alias */
        alias?: (string|null);

        /** GetInfoResponse color */
        color?: (string|null);

        /** GetInfoResponse numPendingChannels */
        numPendingChannels?: (number|null);

        /** GetInfoResponse numActiveChannels */
        numActiveChannels?: (number|null);

        /** GetInfoResponse numInactiveChannels */
        numInactiveChannels?: (number|null);

        /** GetInfoResponse numPeers */
        numPeers?: (number|null);

        /** GetInfoResponse blockHeight */
        blockHeight?: (number|null);

        /** GetInfoResponse blockHash */
        blockHash?: (string|null);

        /** GetInfoResponse bestHeaderTimestamp */
        bestHeaderTimestamp?: (number|Long|null);

        /** GetInfoResponse syncedToChain */
        syncedToChain?: (boolean|null);

        /** GetInfoResponse syncedToGraph */
        syncedToGraph?: (boolean|null);

        /** GetInfoResponse testnet */
        testnet?: (boolean|null);

        /** GetInfoResponse chains */
        chains?: (lnrpc.IChain[]|null);

        /** GetInfoResponse uris */
        uris?: (string[]|null);

        /** GetInfoResponse features */
        features?: ({ [k: string]: lnrpc.IFeature }|null);
    }

    /** Represents a GetInfoResponse. */
    class GetInfoResponse implements IGetInfoResponse {

        /**
         * Constructs a new GetInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IGetInfoResponse);

        /** GetInfoResponse version. */
        public version: string;

        /** GetInfoResponse commitHash. */
        public commitHash: string;

        /** GetInfoResponse identityPubkey. */
        public identityPubkey: string;

        /** GetInfoResponse alias. */
        public alias: string;

        /** GetInfoResponse color. */
        public color: string;

        /** GetInfoResponse numPendingChannels. */
        public numPendingChannels: number;

        /** GetInfoResponse numActiveChannels. */
        public numActiveChannels: number;

        /** GetInfoResponse numInactiveChannels. */
        public numInactiveChannels: number;

        /** GetInfoResponse numPeers. */
        public numPeers: number;

        /** GetInfoResponse blockHeight. */
        public blockHeight: number;

        /** GetInfoResponse blockHash. */
        public blockHash: string;

        /** GetInfoResponse bestHeaderTimestamp. */
        public bestHeaderTimestamp: (number|Long);

        /** GetInfoResponse syncedToChain. */
        public syncedToChain: boolean;

        /** GetInfoResponse syncedToGraph. */
        public syncedToGraph: boolean;

        /** GetInfoResponse testnet. */
        public testnet: boolean;

        /** GetInfoResponse chains. */
        public chains: lnrpc.IChain[];

        /** GetInfoResponse uris. */
        public uris: string[];

        /** GetInfoResponse features. */
        public features: { [k: string]: lnrpc.IFeature };

        /**
         * Creates a new GetInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetInfoResponse instance
         */
        public static create(properties?: lnrpc.IGetInfoResponse): lnrpc.GetInfoResponse;

        /**
         * Encodes the specified GetInfoResponse message. Does not implicitly {@link lnrpc.GetInfoResponse.verify|verify} messages.
         * @param message GetInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IGetInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetInfoResponse message, length delimited. Does not implicitly {@link lnrpc.GetInfoResponse.verify|verify} messages.
         * @param message GetInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IGetInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.GetInfoResponse;

        /**
         * Decodes a GetInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.GetInfoResponse;

        /**
         * Verifies a GetInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.GetInfoResponse;

        /**
         * Creates a plain object from a GetInfoResponse message. Also converts values to other types if specified.
         * @param message GetInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.GetInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetRecoveryInfoRequest. */
    interface IGetRecoveryInfoRequest {
    }

    /** Represents a GetRecoveryInfoRequest. */
    class GetRecoveryInfoRequest implements IGetRecoveryInfoRequest {

        /**
         * Constructs a new GetRecoveryInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IGetRecoveryInfoRequest);

        /**
         * Creates a new GetRecoveryInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetRecoveryInfoRequest instance
         */
        public static create(properties?: lnrpc.IGetRecoveryInfoRequest): lnrpc.GetRecoveryInfoRequest;

        /**
         * Encodes the specified GetRecoveryInfoRequest message. Does not implicitly {@link lnrpc.GetRecoveryInfoRequest.verify|verify} messages.
         * @param message GetRecoveryInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IGetRecoveryInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetRecoveryInfoRequest message, length delimited. Does not implicitly {@link lnrpc.GetRecoveryInfoRequest.verify|verify} messages.
         * @param message GetRecoveryInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IGetRecoveryInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetRecoveryInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetRecoveryInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.GetRecoveryInfoRequest;

        /**
         * Decodes a GetRecoveryInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetRecoveryInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.GetRecoveryInfoRequest;

        /**
         * Verifies a GetRecoveryInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetRecoveryInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetRecoveryInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.GetRecoveryInfoRequest;

        /**
         * Creates a plain object from a GetRecoveryInfoRequest message. Also converts values to other types if specified.
         * @param message GetRecoveryInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.GetRecoveryInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetRecoveryInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetRecoveryInfoResponse. */
    interface IGetRecoveryInfoResponse {

        /** GetRecoveryInfoResponse recoveryMode */
        recoveryMode?: (boolean|null);

        /** GetRecoveryInfoResponse recoveryFinished */
        recoveryFinished?: (boolean|null);

        /** GetRecoveryInfoResponse progress */
        progress?: (number|null);
    }

    /** Represents a GetRecoveryInfoResponse. */
    class GetRecoveryInfoResponse implements IGetRecoveryInfoResponse {

        /**
         * Constructs a new GetRecoveryInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IGetRecoveryInfoResponse);

        /** GetRecoveryInfoResponse recoveryMode. */
        public recoveryMode: boolean;

        /** GetRecoveryInfoResponse recoveryFinished. */
        public recoveryFinished: boolean;

        /** GetRecoveryInfoResponse progress. */
        public progress: number;

        /**
         * Creates a new GetRecoveryInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetRecoveryInfoResponse instance
         */
        public static create(properties?: lnrpc.IGetRecoveryInfoResponse): lnrpc.GetRecoveryInfoResponse;

        /**
         * Encodes the specified GetRecoveryInfoResponse message. Does not implicitly {@link lnrpc.GetRecoveryInfoResponse.verify|verify} messages.
         * @param message GetRecoveryInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IGetRecoveryInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetRecoveryInfoResponse message, length delimited. Does not implicitly {@link lnrpc.GetRecoveryInfoResponse.verify|verify} messages.
         * @param message GetRecoveryInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IGetRecoveryInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetRecoveryInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetRecoveryInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.GetRecoveryInfoResponse;

        /**
         * Decodes a GetRecoveryInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetRecoveryInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.GetRecoveryInfoResponse;

        /**
         * Verifies a GetRecoveryInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetRecoveryInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetRecoveryInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.GetRecoveryInfoResponse;

        /**
         * Creates a plain object from a GetRecoveryInfoResponse message. Also converts values to other types if specified.
         * @param message GetRecoveryInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.GetRecoveryInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetRecoveryInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Chain. */
    interface IChain {

        /** Chain chain */
        chain?: (string|null);

        /** Chain network */
        network?: (string|null);
    }

    /** Represents a Chain. */
    class Chain implements IChain {

        /**
         * Constructs a new Chain.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChain);

        /** Chain chain. */
        public chain: string;

        /** Chain network. */
        public network: string;

        /**
         * Creates a new Chain instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Chain instance
         */
        public static create(properties?: lnrpc.IChain): lnrpc.Chain;

        /**
         * Encodes the specified Chain message. Does not implicitly {@link lnrpc.Chain.verify|verify} messages.
         * @param message Chain message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChain, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Chain message, length delimited. Does not implicitly {@link lnrpc.Chain.verify|verify} messages.
         * @param message Chain message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChain, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Chain message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Chain
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Chain;

        /**
         * Decodes a Chain message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Chain
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Chain;

        /**
         * Verifies a Chain message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Chain message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Chain
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Chain;

        /**
         * Creates a plain object from a Chain message. Also converts values to other types if specified.
         * @param message Chain
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Chain, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Chain to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ConfirmationUpdate. */
    interface IConfirmationUpdate {

        /** ConfirmationUpdate blockSha */
        blockSha?: (Uint8Array|null);

        /** ConfirmationUpdate blockHeight */
        blockHeight?: (number|null);

        /** ConfirmationUpdate numConfsLeft */
        numConfsLeft?: (number|null);
    }

    /** Represents a ConfirmationUpdate. */
    class ConfirmationUpdate implements IConfirmationUpdate {

        /**
         * Constructs a new ConfirmationUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IConfirmationUpdate);

        /** ConfirmationUpdate blockSha. */
        public blockSha: Uint8Array;

        /** ConfirmationUpdate blockHeight. */
        public blockHeight: number;

        /** ConfirmationUpdate numConfsLeft. */
        public numConfsLeft: number;

        /**
         * Creates a new ConfirmationUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConfirmationUpdate instance
         */
        public static create(properties?: lnrpc.IConfirmationUpdate): lnrpc.ConfirmationUpdate;

        /**
         * Encodes the specified ConfirmationUpdate message. Does not implicitly {@link lnrpc.ConfirmationUpdate.verify|verify} messages.
         * @param message ConfirmationUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IConfirmationUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ConfirmationUpdate message, length delimited. Does not implicitly {@link lnrpc.ConfirmationUpdate.verify|verify} messages.
         * @param message ConfirmationUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IConfirmationUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConfirmationUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConfirmationUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ConfirmationUpdate;

        /**
         * Decodes a ConfirmationUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ConfirmationUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ConfirmationUpdate;

        /**
         * Verifies a ConfirmationUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ConfirmationUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ConfirmationUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ConfirmationUpdate;

        /**
         * Creates a plain object from a ConfirmationUpdate message. Also converts values to other types if specified.
         * @param message ConfirmationUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ConfirmationUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ConfirmationUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelOpenUpdate. */
    interface IChannelOpenUpdate {

        /** ChannelOpenUpdate channelPoint */
        channelPoint?: (lnrpc.IChannelPoint|null);
    }

    /** Represents a ChannelOpenUpdate. */
    class ChannelOpenUpdate implements IChannelOpenUpdate {

        /**
         * Constructs a new ChannelOpenUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelOpenUpdate);

        /** ChannelOpenUpdate channelPoint. */
        public channelPoint?: (lnrpc.IChannelPoint|null);

        /**
         * Creates a new ChannelOpenUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelOpenUpdate instance
         */
        public static create(properties?: lnrpc.IChannelOpenUpdate): lnrpc.ChannelOpenUpdate;

        /**
         * Encodes the specified ChannelOpenUpdate message. Does not implicitly {@link lnrpc.ChannelOpenUpdate.verify|verify} messages.
         * @param message ChannelOpenUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelOpenUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelOpenUpdate message, length delimited. Does not implicitly {@link lnrpc.ChannelOpenUpdate.verify|verify} messages.
         * @param message ChannelOpenUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelOpenUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelOpenUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelOpenUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelOpenUpdate;

        /**
         * Decodes a ChannelOpenUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelOpenUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelOpenUpdate;

        /**
         * Verifies a ChannelOpenUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelOpenUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelOpenUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelOpenUpdate;

        /**
         * Creates a plain object from a ChannelOpenUpdate message. Also converts values to other types if specified.
         * @param message ChannelOpenUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelOpenUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelOpenUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelCloseUpdate. */
    interface IChannelCloseUpdate {

        /** ChannelCloseUpdate closingTxid */
        closingTxid?: (Uint8Array|null);

        /** ChannelCloseUpdate success */
        success?: (boolean|null);
    }

    /** Represents a ChannelCloseUpdate. */
    class ChannelCloseUpdate implements IChannelCloseUpdate {

        /**
         * Constructs a new ChannelCloseUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelCloseUpdate);

        /** ChannelCloseUpdate closingTxid. */
        public closingTxid: Uint8Array;

        /** ChannelCloseUpdate success. */
        public success: boolean;

        /**
         * Creates a new ChannelCloseUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelCloseUpdate instance
         */
        public static create(properties?: lnrpc.IChannelCloseUpdate): lnrpc.ChannelCloseUpdate;

        /**
         * Encodes the specified ChannelCloseUpdate message. Does not implicitly {@link lnrpc.ChannelCloseUpdate.verify|verify} messages.
         * @param message ChannelCloseUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelCloseUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelCloseUpdate message, length delimited. Does not implicitly {@link lnrpc.ChannelCloseUpdate.verify|verify} messages.
         * @param message ChannelCloseUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelCloseUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelCloseUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelCloseUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelCloseUpdate;

        /**
         * Decodes a ChannelCloseUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelCloseUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelCloseUpdate;

        /**
         * Verifies a ChannelCloseUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelCloseUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelCloseUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelCloseUpdate;

        /**
         * Creates a plain object from a ChannelCloseUpdate message. Also converts values to other types if specified.
         * @param message ChannelCloseUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelCloseUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelCloseUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CloseChannelRequest. */
    interface ICloseChannelRequest {

        /** CloseChannelRequest channelPoint */
        channelPoint?: (lnrpc.IChannelPoint|null);

        /** CloseChannelRequest force */
        force?: (boolean|null);

        /** CloseChannelRequest targetConf */
        targetConf?: (number|null);

        /** CloseChannelRequest satPerByte */
        satPerByte?: (number|Long|null);

        /** CloseChannelRequest deliveryAddress */
        deliveryAddress?: (string|null);
    }

    /** Represents a CloseChannelRequest. */
    class CloseChannelRequest implements ICloseChannelRequest {

        /**
         * Constructs a new CloseChannelRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ICloseChannelRequest);

        /** CloseChannelRequest channelPoint. */
        public channelPoint?: (lnrpc.IChannelPoint|null);

        /** CloseChannelRequest force. */
        public force: boolean;

        /** CloseChannelRequest targetConf. */
        public targetConf: number;

        /** CloseChannelRequest satPerByte. */
        public satPerByte: (number|Long);

        /** CloseChannelRequest deliveryAddress. */
        public deliveryAddress: string;

        /**
         * Creates a new CloseChannelRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CloseChannelRequest instance
         */
        public static create(properties?: lnrpc.ICloseChannelRequest): lnrpc.CloseChannelRequest;

        /**
         * Encodes the specified CloseChannelRequest message. Does not implicitly {@link lnrpc.CloseChannelRequest.verify|verify} messages.
         * @param message CloseChannelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ICloseChannelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CloseChannelRequest message, length delimited. Does not implicitly {@link lnrpc.CloseChannelRequest.verify|verify} messages.
         * @param message CloseChannelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ICloseChannelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CloseChannelRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CloseChannelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.CloseChannelRequest;

        /**
         * Decodes a CloseChannelRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CloseChannelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.CloseChannelRequest;

        /**
         * Verifies a CloseChannelRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CloseChannelRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CloseChannelRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.CloseChannelRequest;

        /**
         * Creates a plain object from a CloseChannelRequest message. Also converts values to other types if specified.
         * @param message CloseChannelRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.CloseChannelRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CloseChannelRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CloseStatusUpdate. */
    interface ICloseStatusUpdate {

        /** CloseStatusUpdate closePending */
        closePending?: (lnrpc.IPendingUpdate|null);

        /** CloseStatusUpdate chanClose */
        chanClose?: (lnrpc.IChannelCloseUpdate|null);
    }

    /** Represents a CloseStatusUpdate. */
    class CloseStatusUpdate implements ICloseStatusUpdate {

        /**
         * Constructs a new CloseStatusUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ICloseStatusUpdate);

        /** CloseStatusUpdate closePending. */
        public closePending?: (lnrpc.IPendingUpdate|null);

        /** CloseStatusUpdate chanClose. */
        public chanClose?: (lnrpc.IChannelCloseUpdate|null);

        /** CloseStatusUpdate update. */
        public update?: ("closePending"|"chanClose");

        /**
         * Creates a new CloseStatusUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CloseStatusUpdate instance
         */
        public static create(properties?: lnrpc.ICloseStatusUpdate): lnrpc.CloseStatusUpdate;

        /**
         * Encodes the specified CloseStatusUpdate message. Does not implicitly {@link lnrpc.CloseStatusUpdate.verify|verify} messages.
         * @param message CloseStatusUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ICloseStatusUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CloseStatusUpdate message, length delimited. Does not implicitly {@link lnrpc.CloseStatusUpdate.verify|verify} messages.
         * @param message CloseStatusUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ICloseStatusUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CloseStatusUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CloseStatusUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.CloseStatusUpdate;

        /**
         * Decodes a CloseStatusUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CloseStatusUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.CloseStatusUpdate;

        /**
         * Verifies a CloseStatusUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CloseStatusUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CloseStatusUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.CloseStatusUpdate;

        /**
         * Creates a plain object from a CloseStatusUpdate message. Also converts values to other types if specified.
         * @param message CloseStatusUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.CloseStatusUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CloseStatusUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PendingUpdate. */
    interface IPendingUpdate {

        /** PendingUpdate txid */
        txid?: (Uint8Array|null);

        /** PendingUpdate outputIndex */
        outputIndex?: (number|null);
    }

    /** Represents a PendingUpdate. */
    class PendingUpdate implements IPendingUpdate {

        /**
         * Constructs a new PendingUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPendingUpdate);

        /** PendingUpdate txid. */
        public txid: Uint8Array;

        /** PendingUpdate outputIndex. */
        public outputIndex: number;

        /**
         * Creates a new PendingUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PendingUpdate instance
         */
        public static create(properties?: lnrpc.IPendingUpdate): lnrpc.PendingUpdate;

        /**
         * Encodes the specified PendingUpdate message. Does not implicitly {@link lnrpc.PendingUpdate.verify|verify} messages.
         * @param message PendingUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPendingUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PendingUpdate message, length delimited. Does not implicitly {@link lnrpc.PendingUpdate.verify|verify} messages.
         * @param message PendingUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPendingUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PendingUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PendingUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingUpdate;

        /**
         * Decodes a PendingUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PendingUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingUpdate;

        /**
         * Verifies a PendingUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PendingUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PendingUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PendingUpdate;

        /**
         * Creates a plain object from a PendingUpdate message. Also converts values to other types if specified.
         * @param message PendingUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PendingUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PendingUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ReadyForPsbtFunding. */
    interface IReadyForPsbtFunding {

        /** ReadyForPsbtFunding fundingAddress */
        fundingAddress?: (string|null);

        /** ReadyForPsbtFunding fundingAmount */
        fundingAmount?: (number|Long|null);

        /** ReadyForPsbtFunding psbt */
        psbt?: (Uint8Array|null);
    }

    /** Represents a ReadyForPsbtFunding. */
    class ReadyForPsbtFunding implements IReadyForPsbtFunding {

        /**
         * Constructs a new ReadyForPsbtFunding.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IReadyForPsbtFunding);

        /** ReadyForPsbtFunding fundingAddress. */
        public fundingAddress: string;

        /** ReadyForPsbtFunding fundingAmount. */
        public fundingAmount: (number|Long);

        /** ReadyForPsbtFunding psbt. */
        public psbt: Uint8Array;

        /**
         * Creates a new ReadyForPsbtFunding instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReadyForPsbtFunding instance
         */
        public static create(properties?: lnrpc.IReadyForPsbtFunding): lnrpc.ReadyForPsbtFunding;

        /**
         * Encodes the specified ReadyForPsbtFunding message. Does not implicitly {@link lnrpc.ReadyForPsbtFunding.verify|verify} messages.
         * @param message ReadyForPsbtFunding message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IReadyForPsbtFunding, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReadyForPsbtFunding message, length delimited. Does not implicitly {@link lnrpc.ReadyForPsbtFunding.verify|verify} messages.
         * @param message ReadyForPsbtFunding message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IReadyForPsbtFunding, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReadyForPsbtFunding message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReadyForPsbtFunding
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ReadyForPsbtFunding;

        /**
         * Decodes a ReadyForPsbtFunding message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReadyForPsbtFunding
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ReadyForPsbtFunding;

        /**
         * Verifies a ReadyForPsbtFunding message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReadyForPsbtFunding message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReadyForPsbtFunding
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ReadyForPsbtFunding;

        /**
         * Creates a plain object from a ReadyForPsbtFunding message. Also converts values to other types if specified.
         * @param message ReadyForPsbtFunding
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ReadyForPsbtFunding, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReadyForPsbtFunding to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an OpenChannelRequest. */
    interface IOpenChannelRequest {

        /** OpenChannelRequest nodePubkey */
        nodePubkey?: (Uint8Array|null);

        /** OpenChannelRequest nodePubkeyString */
        nodePubkeyString?: (string|null);

        /** OpenChannelRequest localFundingAmount */
        localFundingAmount?: (number|Long|null);

        /** OpenChannelRequest pushSat */
        pushSat?: (number|Long|null);

        /** OpenChannelRequest targetConf */
        targetConf?: (number|null);

        /** OpenChannelRequest satPerByte */
        satPerByte?: (number|Long|null);

        /** OpenChannelRequest private */
        "private"?: (boolean|null);

        /** OpenChannelRequest minHtlcMsat */
        minHtlcMsat?: (number|Long|null);

        /** OpenChannelRequest remoteCsvDelay */
        remoteCsvDelay?: (number|null);

        /** OpenChannelRequest minConfs */
        minConfs?: (number|null);

        /** OpenChannelRequest spendUnconfirmed */
        spendUnconfirmed?: (boolean|null);

        /** OpenChannelRequest closeAddress */
        closeAddress?: (string|null);

        /** OpenChannelRequest fundingShim */
        fundingShim?: (lnrpc.IFundingShim|null);

        /** OpenChannelRequest remoteMaxValueInFlightMsat */
        remoteMaxValueInFlightMsat?: (number|Long|null);

        /** OpenChannelRequest remoteMaxHtlcs */
        remoteMaxHtlcs?: (number|null);
    }

    /** Represents an OpenChannelRequest. */
    class OpenChannelRequest implements IOpenChannelRequest {

        /**
         * Constructs a new OpenChannelRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IOpenChannelRequest);

        /** OpenChannelRequest nodePubkey. */
        public nodePubkey: Uint8Array;

        /** OpenChannelRequest nodePubkeyString. */
        public nodePubkeyString: string;

        /** OpenChannelRequest localFundingAmount. */
        public localFundingAmount: (number|Long);

        /** OpenChannelRequest pushSat. */
        public pushSat: (number|Long);

        /** OpenChannelRequest targetConf. */
        public targetConf: number;

        /** OpenChannelRequest satPerByte. */
        public satPerByte: (number|Long);

        /** OpenChannelRequest private. */
        public private: boolean;

        /** OpenChannelRequest minHtlcMsat. */
        public minHtlcMsat: (number|Long);

        /** OpenChannelRequest remoteCsvDelay. */
        public remoteCsvDelay: number;

        /** OpenChannelRequest minConfs. */
        public minConfs: number;

        /** OpenChannelRequest spendUnconfirmed. */
        public spendUnconfirmed: boolean;

        /** OpenChannelRequest closeAddress. */
        public closeAddress: string;

        /** OpenChannelRequest fundingShim. */
        public fundingShim?: (lnrpc.IFundingShim|null);

        /** OpenChannelRequest remoteMaxValueInFlightMsat. */
        public remoteMaxValueInFlightMsat: (number|Long);

        /** OpenChannelRequest remoteMaxHtlcs. */
        public remoteMaxHtlcs: number;

        /**
         * Creates a new OpenChannelRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OpenChannelRequest instance
         */
        public static create(properties?: lnrpc.IOpenChannelRequest): lnrpc.OpenChannelRequest;

        /**
         * Encodes the specified OpenChannelRequest message. Does not implicitly {@link lnrpc.OpenChannelRequest.verify|verify} messages.
         * @param message OpenChannelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IOpenChannelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OpenChannelRequest message, length delimited. Does not implicitly {@link lnrpc.OpenChannelRequest.verify|verify} messages.
         * @param message OpenChannelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IOpenChannelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OpenChannelRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OpenChannelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.OpenChannelRequest;

        /**
         * Decodes an OpenChannelRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OpenChannelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.OpenChannelRequest;

        /**
         * Verifies an OpenChannelRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OpenChannelRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OpenChannelRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.OpenChannelRequest;

        /**
         * Creates a plain object from an OpenChannelRequest message. Also converts values to other types if specified.
         * @param message OpenChannelRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.OpenChannelRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OpenChannelRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an OpenStatusUpdate. */
    interface IOpenStatusUpdate {

        /** OpenStatusUpdate chanPending */
        chanPending?: (lnrpc.IPendingUpdate|null);

        /** OpenStatusUpdate chanOpen */
        chanOpen?: (lnrpc.IChannelOpenUpdate|null);

        /** OpenStatusUpdate psbtFund */
        psbtFund?: (lnrpc.IReadyForPsbtFunding|null);

        /** OpenStatusUpdate pendingChanId */
        pendingChanId?: (Uint8Array|null);
    }

    /** Represents an OpenStatusUpdate. */
    class OpenStatusUpdate implements IOpenStatusUpdate {

        /**
         * Constructs a new OpenStatusUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IOpenStatusUpdate);

        /** OpenStatusUpdate chanPending. */
        public chanPending?: (lnrpc.IPendingUpdate|null);

        /** OpenStatusUpdate chanOpen. */
        public chanOpen?: (lnrpc.IChannelOpenUpdate|null);

        /** OpenStatusUpdate psbtFund. */
        public psbtFund?: (lnrpc.IReadyForPsbtFunding|null);

        /** OpenStatusUpdate pendingChanId. */
        public pendingChanId: Uint8Array;

        /** OpenStatusUpdate update. */
        public update?: ("chanPending"|"chanOpen"|"psbtFund");

        /**
         * Creates a new OpenStatusUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OpenStatusUpdate instance
         */
        public static create(properties?: lnrpc.IOpenStatusUpdate): lnrpc.OpenStatusUpdate;

        /**
         * Encodes the specified OpenStatusUpdate message. Does not implicitly {@link lnrpc.OpenStatusUpdate.verify|verify} messages.
         * @param message OpenStatusUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IOpenStatusUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OpenStatusUpdate message, length delimited. Does not implicitly {@link lnrpc.OpenStatusUpdate.verify|verify} messages.
         * @param message OpenStatusUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IOpenStatusUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OpenStatusUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OpenStatusUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.OpenStatusUpdate;

        /**
         * Decodes an OpenStatusUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OpenStatusUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.OpenStatusUpdate;

        /**
         * Verifies an OpenStatusUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OpenStatusUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OpenStatusUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.OpenStatusUpdate;

        /**
         * Creates a plain object from an OpenStatusUpdate message. Also converts values to other types if specified.
         * @param message OpenStatusUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.OpenStatusUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OpenStatusUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a KeyLocator. */
    interface IKeyLocator {

        /** KeyLocator keyFamily */
        keyFamily?: (number|null);

        /** KeyLocator keyIndex */
        keyIndex?: (number|null);
    }

    /** Represents a KeyLocator. */
    class KeyLocator implements IKeyLocator {

        /**
         * Constructs a new KeyLocator.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IKeyLocator);

        /** KeyLocator keyFamily. */
        public keyFamily: number;

        /** KeyLocator keyIndex. */
        public keyIndex: number;

        /**
         * Creates a new KeyLocator instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyLocator instance
         */
        public static create(properties?: lnrpc.IKeyLocator): lnrpc.KeyLocator;

        /**
         * Encodes the specified KeyLocator message. Does not implicitly {@link lnrpc.KeyLocator.verify|verify} messages.
         * @param message KeyLocator message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IKeyLocator, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KeyLocator message, length delimited. Does not implicitly {@link lnrpc.KeyLocator.verify|verify} messages.
         * @param message KeyLocator message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IKeyLocator, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KeyLocator message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyLocator
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.KeyLocator;

        /**
         * Decodes a KeyLocator message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyLocator
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.KeyLocator;

        /**
         * Verifies a KeyLocator message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KeyLocator message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyLocator
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.KeyLocator;

        /**
         * Creates a plain object from a KeyLocator message. Also converts values to other types if specified.
         * @param message KeyLocator
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.KeyLocator, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KeyLocator to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a KeyDescriptor. */
    interface IKeyDescriptor {

        /** KeyDescriptor rawKeyBytes */
        rawKeyBytes?: (Uint8Array|null);

        /** KeyDescriptor keyLoc */
        keyLoc?: (lnrpc.IKeyLocator|null);
    }

    /** Represents a KeyDescriptor. */
    class KeyDescriptor implements IKeyDescriptor {

        /**
         * Constructs a new KeyDescriptor.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IKeyDescriptor);

        /** KeyDescriptor rawKeyBytes. */
        public rawKeyBytes: Uint8Array;

        /** KeyDescriptor keyLoc. */
        public keyLoc?: (lnrpc.IKeyLocator|null);

        /**
         * Creates a new KeyDescriptor instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyDescriptor instance
         */
        public static create(properties?: lnrpc.IKeyDescriptor): lnrpc.KeyDescriptor;

        /**
         * Encodes the specified KeyDescriptor message. Does not implicitly {@link lnrpc.KeyDescriptor.verify|verify} messages.
         * @param message KeyDescriptor message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IKeyDescriptor, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KeyDescriptor message, length delimited. Does not implicitly {@link lnrpc.KeyDescriptor.verify|verify} messages.
         * @param message KeyDescriptor message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IKeyDescriptor, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KeyDescriptor message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.KeyDescriptor;

        /**
         * Decodes a KeyDescriptor message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.KeyDescriptor;

        /**
         * Verifies a KeyDescriptor message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KeyDescriptor message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyDescriptor
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.KeyDescriptor;

        /**
         * Creates a plain object from a KeyDescriptor message. Also converts values to other types if specified.
         * @param message KeyDescriptor
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.KeyDescriptor, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KeyDescriptor to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChanPointShim. */
    interface IChanPointShim {

        /** ChanPointShim amt */
        amt?: (number|Long|null);

        /** ChanPointShim chanPoint */
        chanPoint?: (lnrpc.IChannelPoint|null);

        /** ChanPointShim localKey */
        localKey?: (lnrpc.IKeyDescriptor|null);

        /** ChanPointShim remoteKey */
        remoteKey?: (Uint8Array|null);

        /** ChanPointShim pendingChanId */
        pendingChanId?: (Uint8Array|null);

        /** ChanPointShim thawHeight */
        thawHeight?: (number|null);
    }

    /** Represents a ChanPointShim. */
    class ChanPointShim implements IChanPointShim {

        /**
         * Constructs a new ChanPointShim.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChanPointShim);

        /** ChanPointShim amt. */
        public amt: (number|Long);

        /** ChanPointShim chanPoint. */
        public chanPoint?: (lnrpc.IChannelPoint|null);

        /** ChanPointShim localKey. */
        public localKey?: (lnrpc.IKeyDescriptor|null);

        /** ChanPointShim remoteKey. */
        public remoteKey: Uint8Array;

        /** ChanPointShim pendingChanId. */
        public pendingChanId: Uint8Array;

        /** ChanPointShim thawHeight. */
        public thawHeight: number;

        /**
         * Creates a new ChanPointShim instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChanPointShim instance
         */
        public static create(properties?: lnrpc.IChanPointShim): lnrpc.ChanPointShim;

        /**
         * Encodes the specified ChanPointShim message. Does not implicitly {@link lnrpc.ChanPointShim.verify|verify} messages.
         * @param message ChanPointShim message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChanPointShim, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChanPointShim message, length delimited. Does not implicitly {@link lnrpc.ChanPointShim.verify|verify} messages.
         * @param message ChanPointShim message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChanPointShim, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChanPointShim message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChanPointShim
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChanPointShim;

        /**
         * Decodes a ChanPointShim message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChanPointShim
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChanPointShim;

        /**
         * Verifies a ChanPointShim message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChanPointShim message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChanPointShim
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChanPointShim;

        /**
         * Creates a plain object from a ChanPointShim message. Also converts values to other types if specified.
         * @param message ChanPointShim
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChanPointShim, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChanPointShim to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PsbtShim. */
    interface IPsbtShim {

        /** PsbtShim pendingChanId */
        pendingChanId?: (Uint8Array|null);

        /** PsbtShim basePsbt */
        basePsbt?: (Uint8Array|null);

        /** PsbtShim noPublish */
        noPublish?: (boolean|null);
    }

    /** Represents a PsbtShim. */
    class PsbtShim implements IPsbtShim {

        /**
         * Constructs a new PsbtShim.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPsbtShim);

        /** PsbtShim pendingChanId. */
        public pendingChanId: Uint8Array;

        /** PsbtShim basePsbt. */
        public basePsbt: Uint8Array;

        /** PsbtShim noPublish. */
        public noPublish: boolean;

        /**
         * Creates a new PsbtShim instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PsbtShim instance
         */
        public static create(properties?: lnrpc.IPsbtShim): lnrpc.PsbtShim;

        /**
         * Encodes the specified PsbtShim message. Does not implicitly {@link lnrpc.PsbtShim.verify|verify} messages.
         * @param message PsbtShim message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPsbtShim, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PsbtShim message, length delimited. Does not implicitly {@link lnrpc.PsbtShim.verify|verify} messages.
         * @param message PsbtShim message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPsbtShim, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PsbtShim message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PsbtShim
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PsbtShim;

        /**
         * Decodes a PsbtShim message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PsbtShim
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PsbtShim;

        /**
         * Verifies a PsbtShim message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PsbtShim message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PsbtShim
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PsbtShim;

        /**
         * Creates a plain object from a PsbtShim message. Also converts values to other types if specified.
         * @param message PsbtShim
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PsbtShim, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PsbtShim to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FundingShim. */
    interface IFundingShim {

        /** FundingShim chanPointShim */
        chanPointShim?: (lnrpc.IChanPointShim|null);

        /** FundingShim psbtShim */
        psbtShim?: (lnrpc.IPsbtShim|null);
    }

    /** Represents a FundingShim. */
    class FundingShim implements IFundingShim {

        /**
         * Constructs a new FundingShim.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFundingShim);

        /** FundingShim chanPointShim. */
        public chanPointShim?: (lnrpc.IChanPointShim|null);

        /** FundingShim psbtShim. */
        public psbtShim?: (lnrpc.IPsbtShim|null);

        /** FundingShim shim. */
        public shim?: ("chanPointShim"|"psbtShim");

        /**
         * Creates a new FundingShim instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FundingShim instance
         */
        public static create(properties?: lnrpc.IFundingShim): lnrpc.FundingShim;

        /**
         * Encodes the specified FundingShim message. Does not implicitly {@link lnrpc.FundingShim.verify|verify} messages.
         * @param message FundingShim message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFundingShim, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FundingShim message, length delimited. Does not implicitly {@link lnrpc.FundingShim.verify|verify} messages.
         * @param message FundingShim message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFundingShim, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FundingShim message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FundingShim
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FundingShim;

        /**
         * Decodes a FundingShim message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FundingShim
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FundingShim;

        /**
         * Verifies a FundingShim message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FundingShim message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FundingShim
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FundingShim;

        /**
         * Creates a plain object from a FundingShim message. Also converts values to other types if specified.
         * @param message FundingShim
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FundingShim, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FundingShim to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FundingShimCancel. */
    interface IFundingShimCancel {

        /** FundingShimCancel pendingChanId */
        pendingChanId?: (Uint8Array|null);
    }

    /** Represents a FundingShimCancel. */
    class FundingShimCancel implements IFundingShimCancel {

        /**
         * Constructs a new FundingShimCancel.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFundingShimCancel);

        /** FundingShimCancel pendingChanId. */
        public pendingChanId: Uint8Array;

        /**
         * Creates a new FundingShimCancel instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FundingShimCancel instance
         */
        public static create(properties?: lnrpc.IFundingShimCancel): lnrpc.FundingShimCancel;

        /**
         * Encodes the specified FundingShimCancel message. Does not implicitly {@link lnrpc.FundingShimCancel.verify|verify} messages.
         * @param message FundingShimCancel message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFundingShimCancel, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FundingShimCancel message, length delimited. Does not implicitly {@link lnrpc.FundingShimCancel.verify|verify} messages.
         * @param message FundingShimCancel message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFundingShimCancel, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FundingShimCancel message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FundingShimCancel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FundingShimCancel;

        /**
         * Decodes a FundingShimCancel message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FundingShimCancel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FundingShimCancel;

        /**
         * Verifies a FundingShimCancel message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FundingShimCancel message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FundingShimCancel
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FundingShimCancel;

        /**
         * Creates a plain object from a FundingShimCancel message. Also converts values to other types if specified.
         * @param message FundingShimCancel
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FundingShimCancel, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FundingShimCancel to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FundingPsbtVerify. */
    interface IFundingPsbtVerify {

        /** FundingPsbtVerify fundedPsbt */
        fundedPsbt?: (Uint8Array|null);

        /** FundingPsbtVerify pendingChanId */
        pendingChanId?: (Uint8Array|null);
    }

    /** Represents a FundingPsbtVerify. */
    class FundingPsbtVerify implements IFundingPsbtVerify {

        /**
         * Constructs a new FundingPsbtVerify.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFundingPsbtVerify);

        /** FundingPsbtVerify fundedPsbt. */
        public fundedPsbt: Uint8Array;

        /** FundingPsbtVerify pendingChanId. */
        public pendingChanId: Uint8Array;

        /**
         * Creates a new FundingPsbtVerify instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FundingPsbtVerify instance
         */
        public static create(properties?: lnrpc.IFundingPsbtVerify): lnrpc.FundingPsbtVerify;

        /**
         * Encodes the specified FundingPsbtVerify message. Does not implicitly {@link lnrpc.FundingPsbtVerify.verify|verify} messages.
         * @param message FundingPsbtVerify message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFundingPsbtVerify, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FundingPsbtVerify message, length delimited. Does not implicitly {@link lnrpc.FundingPsbtVerify.verify|verify} messages.
         * @param message FundingPsbtVerify message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFundingPsbtVerify, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FundingPsbtVerify message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FundingPsbtVerify
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FundingPsbtVerify;

        /**
         * Decodes a FundingPsbtVerify message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FundingPsbtVerify
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FundingPsbtVerify;

        /**
         * Verifies a FundingPsbtVerify message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FundingPsbtVerify message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FundingPsbtVerify
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FundingPsbtVerify;

        /**
         * Creates a plain object from a FundingPsbtVerify message. Also converts values to other types if specified.
         * @param message FundingPsbtVerify
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FundingPsbtVerify, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FundingPsbtVerify to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FundingPsbtFinalize. */
    interface IFundingPsbtFinalize {

        /** FundingPsbtFinalize signedPsbt */
        signedPsbt?: (Uint8Array|null);

        /** FundingPsbtFinalize pendingChanId */
        pendingChanId?: (Uint8Array|null);

        /** FundingPsbtFinalize finalRawTx */
        finalRawTx?: (Uint8Array|null);
    }

    /** Represents a FundingPsbtFinalize. */
    class FundingPsbtFinalize implements IFundingPsbtFinalize {

        /**
         * Constructs a new FundingPsbtFinalize.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFundingPsbtFinalize);

        /** FundingPsbtFinalize signedPsbt. */
        public signedPsbt: Uint8Array;

        /** FundingPsbtFinalize pendingChanId. */
        public pendingChanId: Uint8Array;

        /** FundingPsbtFinalize finalRawTx. */
        public finalRawTx: Uint8Array;

        /**
         * Creates a new FundingPsbtFinalize instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FundingPsbtFinalize instance
         */
        public static create(properties?: lnrpc.IFundingPsbtFinalize): lnrpc.FundingPsbtFinalize;

        /**
         * Encodes the specified FundingPsbtFinalize message. Does not implicitly {@link lnrpc.FundingPsbtFinalize.verify|verify} messages.
         * @param message FundingPsbtFinalize message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFundingPsbtFinalize, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FundingPsbtFinalize message, length delimited. Does not implicitly {@link lnrpc.FundingPsbtFinalize.verify|verify} messages.
         * @param message FundingPsbtFinalize message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFundingPsbtFinalize, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FundingPsbtFinalize message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FundingPsbtFinalize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FundingPsbtFinalize;

        /**
         * Decodes a FundingPsbtFinalize message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FundingPsbtFinalize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FundingPsbtFinalize;

        /**
         * Verifies a FundingPsbtFinalize message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FundingPsbtFinalize message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FundingPsbtFinalize
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FundingPsbtFinalize;

        /**
         * Creates a plain object from a FundingPsbtFinalize message. Also converts values to other types if specified.
         * @param message FundingPsbtFinalize
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FundingPsbtFinalize, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FundingPsbtFinalize to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FundingTransitionMsg. */
    interface IFundingTransitionMsg {

        /** FundingTransitionMsg shimRegister */
        shimRegister?: (lnrpc.IFundingShim|null);

        /** FundingTransitionMsg shimCancel */
        shimCancel?: (lnrpc.IFundingShimCancel|null);

        /** FundingTransitionMsg psbtVerify */
        psbtVerify?: (lnrpc.IFundingPsbtVerify|null);

        /** FundingTransitionMsg psbtFinalize */
        psbtFinalize?: (lnrpc.IFundingPsbtFinalize|null);
    }

    /** Represents a FundingTransitionMsg. */
    class FundingTransitionMsg implements IFundingTransitionMsg {

        /**
         * Constructs a new FundingTransitionMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFundingTransitionMsg);

        /** FundingTransitionMsg shimRegister. */
        public shimRegister?: (lnrpc.IFundingShim|null);

        /** FundingTransitionMsg shimCancel. */
        public shimCancel?: (lnrpc.IFundingShimCancel|null);

        /** FundingTransitionMsg psbtVerify. */
        public psbtVerify?: (lnrpc.IFundingPsbtVerify|null);

        /** FundingTransitionMsg psbtFinalize. */
        public psbtFinalize?: (lnrpc.IFundingPsbtFinalize|null);

        /** FundingTransitionMsg trigger. */
        public trigger?: ("shimRegister"|"shimCancel"|"psbtVerify"|"psbtFinalize");

        /**
         * Creates a new FundingTransitionMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FundingTransitionMsg instance
         */
        public static create(properties?: lnrpc.IFundingTransitionMsg): lnrpc.FundingTransitionMsg;

        /**
         * Encodes the specified FundingTransitionMsg message. Does not implicitly {@link lnrpc.FundingTransitionMsg.verify|verify} messages.
         * @param message FundingTransitionMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFundingTransitionMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FundingTransitionMsg message, length delimited. Does not implicitly {@link lnrpc.FundingTransitionMsg.verify|verify} messages.
         * @param message FundingTransitionMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFundingTransitionMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FundingTransitionMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FundingTransitionMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FundingTransitionMsg;

        /**
         * Decodes a FundingTransitionMsg message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FundingTransitionMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FundingTransitionMsg;

        /**
         * Verifies a FundingTransitionMsg message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FundingTransitionMsg message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FundingTransitionMsg
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FundingTransitionMsg;

        /**
         * Creates a plain object from a FundingTransitionMsg message. Also converts values to other types if specified.
         * @param message FundingTransitionMsg
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FundingTransitionMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FundingTransitionMsg to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FundingStateStepResp. */
    interface IFundingStateStepResp {
    }

    /** Represents a FundingStateStepResp. */
    class FundingStateStepResp implements IFundingStateStepResp {

        /**
         * Constructs a new FundingStateStepResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFundingStateStepResp);

        /**
         * Creates a new FundingStateStepResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FundingStateStepResp instance
         */
        public static create(properties?: lnrpc.IFundingStateStepResp): lnrpc.FundingStateStepResp;

        /**
         * Encodes the specified FundingStateStepResp message. Does not implicitly {@link lnrpc.FundingStateStepResp.verify|verify} messages.
         * @param message FundingStateStepResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFundingStateStepResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FundingStateStepResp message, length delimited. Does not implicitly {@link lnrpc.FundingStateStepResp.verify|verify} messages.
         * @param message FundingStateStepResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFundingStateStepResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FundingStateStepResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FundingStateStepResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FundingStateStepResp;

        /**
         * Decodes a FundingStateStepResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FundingStateStepResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FundingStateStepResp;

        /**
         * Verifies a FundingStateStepResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FundingStateStepResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FundingStateStepResp
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FundingStateStepResp;

        /**
         * Creates a plain object from a FundingStateStepResp message. Also converts values to other types if specified.
         * @param message FundingStateStepResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FundingStateStepResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FundingStateStepResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PendingHTLC. */
    interface IPendingHTLC {

        /** PendingHTLC incoming */
        incoming?: (boolean|null);

        /** PendingHTLC amount */
        amount?: (number|Long|null);

        /** PendingHTLC outpoint */
        outpoint?: (string|null);

        /** PendingHTLC maturityHeight */
        maturityHeight?: (number|null);

        /** PendingHTLC blocksTilMaturity */
        blocksTilMaturity?: (number|null);

        /** PendingHTLC stage */
        stage?: (number|null);
    }

    /** Represents a PendingHTLC. */
    class PendingHTLC implements IPendingHTLC {

        /**
         * Constructs a new PendingHTLC.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPendingHTLC);

        /** PendingHTLC incoming. */
        public incoming: boolean;

        /** PendingHTLC amount. */
        public amount: (number|Long);

        /** PendingHTLC outpoint. */
        public outpoint: string;

        /** PendingHTLC maturityHeight. */
        public maturityHeight: number;

        /** PendingHTLC blocksTilMaturity. */
        public blocksTilMaturity: number;

        /** PendingHTLC stage. */
        public stage: number;

        /**
         * Creates a new PendingHTLC instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PendingHTLC instance
         */
        public static create(properties?: lnrpc.IPendingHTLC): lnrpc.PendingHTLC;

        /**
         * Encodes the specified PendingHTLC message. Does not implicitly {@link lnrpc.PendingHTLC.verify|verify} messages.
         * @param message PendingHTLC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPendingHTLC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PendingHTLC message, length delimited. Does not implicitly {@link lnrpc.PendingHTLC.verify|verify} messages.
         * @param message PendingHTLC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPendingHTLC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PendingHTLC message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PendingHTLC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingHTLC;

        /**
         * Decodes a PendingHTLC message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PendingHTLC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingHTLC;

        /**
         * Verifies a PendingHTLC message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PendingHTLC message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PendingHTLC
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PendingHTLC;

        /**
         * Creates a plain object from a PendingHTLC message. Also converts values to other types if specified.
         * @param message PendingHTLC
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PendingHTLC, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PendingHTLC to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PendingChannelsRequest. */
    interface IPendingChannelsRequest {
    }

    /** Represents a PendingChannelsRequest. */
    class PendingChannelsRequest implements IPendingChannelsRequest {

        /**
         * Constructs a new PendingChannelsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPendingChannelsRequest);

        /**
         * Creates a new PendingChannelsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PendingChannelsRequest instance
         */
        public static create(properties?: lnrpc.IPendingChannelsRequest): lnrpc.PendingChannelsRequest;

        /**
         * Encodes the specified PendingChannelsRequest message. Does not implicitly {@link lnrpc.PendingChannelsRequest.verify|verify} messages.
         * @param message PendingChannelsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPendingChannelsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PendingChannelsRequest message, length delimited. Does not implicitly {@link lnrpc.PendingChannelsRequest.verify|verify} messages.
         * @param message PendingChannelsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPendingChannelsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PendingChannelsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PendingChannelsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingChannelsRequest;

        /**
         * Decodes a PendingChannelsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PendingChannelsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingChannelsRequest;

        /**
         * Verifies a PendingChannelsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PendingChannelsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PendingChannelsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PendingChannelsRequest;

        /**
         * Creates a plain object from a PendingChannelsRequest message. Also converts values to other types if specified.
         * @param message PendingChannelsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PendingChannelsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PendingChannelsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PendingChannelsResponse. */
    interface IPendingChannelsResponse {

        /** PendingChannelsResponse totalLimboBalance */
        totalLimboBalance?: (number|Long|null);

        /** PendingChannelsResponse pendingOpenChannels */
        pendingOpenChannels?: (lnrpc.PendingChannelsResponse.IPendingOpenChannel[]|null);

        /** PendingChannelsResponse pendingClosingChannels */
        pendingClosingChannels?: (lnrpc.PendingChannelsResponse.IClosedChannel[]|null);

        /** PendingChannelsResponse pendingForceClosingChannels */
        pendingForceClosingChannels?: (lnrpc.PendingChannelsResponse.IForceClosedChannel[]|null);

        /** PendingChannelsResponse waitingCloseChannels */
        waitingCloseChannels?: (lnrpc.PendingChannelsResponse.IWaitingCloseChannel[]|null);
    }

    /** Represents a PendingChannelsResponse. */
    class PendingChannelsResponse implements IPendingChannelsResponse {

        /**
         * Constructs a new PendingChannelsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPendingChannelsResponse);

        /** PendingChannelsResponse totalLimboBalance. */
        public totalLimboBalance: (number|Long);

        /** PendingChannelsResponse pendingOpenChannels. */
        public pendingOpenChannels: lnrpc.PendingChannelsResponse.IPendingOpenChannel[];

        /** PendingChannelsResponse pendingClosingChannels. */
        public pendingClosingChannels: lnrpc.PendingChannelsResponse.IClosedChannel[];

        /** PendingChannelsResponse pendingForceClosingChannels. */
        public pendingForceClosingChannels: lnrpc.PendingChannelsResponse.IForceClosedChannel[];

        /** PendingChannelsResponse waitingCloseChannels. */
        public waitingCloseChannels: lnrpc.PendingChannelsResponse.IWaitingCloseChannel[];

        /**
         * Creates a new PendingChannelsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PendingChannelsResponse instance
         */
        public static create(properties?: lnrpc.IPendingChannelsResponse): lnrpc.PendingChannelsResponse;

        /**
         * Encodes the specified PendingChannelsResponse message. Does not implicitly {@link lnrpc.PendingChannelsResponse.verify|verify} messages.
         * @param message PendingChannelsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPendingChannelsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PendingChannelsResponse message, length delimited. Does not implicitly {@link lnrpc.PendingChannelsResponse.verify|verify} messages.
         * @param message PendingChannelsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPendingChannelsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PendingChannelsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PendingChannelsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingChannelsResponse;

        /**
         * Decodes a PendingChannelsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PendingChannelsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingChannelsResponse;

        /**
         * Verifies a PendingChannelsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PendingChannelsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PendingChannelsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PendingChannelsResponse;

        /**
         * Creates a plain object from a PendingChannelsResponse message. Also converts values to other types if specified.
         * @param message PendingChannelsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PendingChannelsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PendingChannelsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace PendingChannelsResponse {

        /** Properties of a PendingChannel. */
        interface IPendingChannel {

            /** PendingChannel remoteNodePub */
            remoteNodePub?: (string|null);

            /** PendingChannel channelPoint */
            channelPoint?: (string|null);

            /** PendingChannel capacity */
            capacity?: (number|Long|null);

            /** PendingChannel localBalance */
            localBalance?: (number|Long|null);

            /** PendingChannel remoteBalance */
            remoteBalance?: (number|Long|null);

            /** PendingChannel localChanReserveSat */
            localChanReserveSat?: (number|Long|null);

            /** PendingChannel remoteChanReserveSat */
            remoteChanReserveSat?: (number|Long|null);

            /** PendingChannel initiator */
            initiator?: (lnrpc.Initiator|null);

            /** PendingChannel commitmentType */
            commitmentType?: (lnrpc.CommitmentType|null);
        }

        /** Represents a PendingChannel. */
        class PendingChannel implements IPendingChannel {

            /**
             * Constructs a new PendingChannel.
             * @param [properties] Properties to set
             */
            constructor(properties?: lnrpc.PendingChannelsResponse.IPendingChannel);

            /** PendingChannel remoteNodePub. */
            public remoteNodePub: string;

            /** PendingChannel channelPoint. */
            public channelPoint: string;

            /** PendingChannel capacity. */
            public capacity: (number|Long);

            /** PendingChannel localBalance. */
            public localBalance: (number|Long);

            /** PendingChannel remoteBalance. */
            public remoteBalance: (number|Long);

            /** PendingChannel localChanReserveSat. */
            public localChanReserveSat: (number|Long);

            /** PendingChannel remoteChanReserveSat. */
            public remoteChanReserveSat: (number|Long);

            /** PendingChannel initiator. */
            public initiator: lnrpc.Initiator;

            /** PendingChannel commitmentType. */
            public commitmentType: lnrpc.CommitmentType;

            /**
             * Creates a new PendingChannel instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PendingChannel instance
             */
            public static create(properties?: lnrpc.PendingChannelsResponse.IPendingChannel): lnrpc.PendingChannelsResponse.PendingChannel;

            /**
             * Encodes the specified PendingChannel message. Does not implicitly {@link lnrpc.PendingChannelsResponse.PendingChannel.verify|verify} messages.
             * @param message PendingChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: lnrpc.PendingChannelsResponse.IPendingChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PendingChannel message, length delimited. Does not implicitly {@link lnrpc.PendingChannelsResponse.PendingChannel.verify|verify} messages.
             * @param message PendingChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: lnrpc.PendingChannelsResponse.IPendingChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PendingChannel message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PendingChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingChannelsResponse.PendingChannel;

            /**
             * Decodes a PendingChannel message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PendingChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingChannelsResponse.PendingChannel;

            /**
             * Verifies a PendingChannel message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PendingChannel message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PendingChannel
             */
            public static fromObject(object: { [k: string]: any }): lnrpc.PendingChannelsResponse.PendingChannel;

            /**
             * Creates a plain object from a PendingChannel message. Also converts values to other types if specified.
             * @param message PendingChannel
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: lnrpc.PendingChannelsResponse.PendingChannel, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PendingChannel to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a PendingOpenChannel. */
        interface IPendingOpenChannel {

            /** PendingOpenChannel channel */
            channel?: (lnrpc.PendingChannelsResponse.IPendingChannel|null);

            /** PendingOpenChannel confirmationHeight */
            confirmationHeight?: (number|null);

            /** PendingOpenChannel commitFee */
            commitFee?: (number|Long|null);

            /** PendingOpenChannel commitWeight */
            commitWeight?: (number|Long|null);

            /** PendingOpenChannel feePerKw */
            feePerKw?: (number|Long|null);
        }

        /** Represents a PendingOpenChannel. */
        class PendingOpenChannel implements IPendingOpenChannel {

            /**
             * Constructs a new PendingOpenChannel.
             * @param [properties] Properties to set
             */
            constructor(properties?: lnrpc.PendingChannelsResponse.IPendingOpenChannel);

            /** PendingOpenChannel channel. */
            public channel?: (lnrpc.PendingChannelsResponse.IPendingChannel|null);

            /** PendingOpenChannel confirmationHeight. */
            public confirmationHeight: number;

            /** PendingOpenChannel commitFee. */
            public commitFee: (number|Long);

            /** PendingOpenChannel commitWeight. */
            public commitWeight: (number|Long);

            /** PendingOpenChannel feePerKw. */
            public feePerKw: (number|Long);

            /**
             * Creates a new PendingOpenChannel instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PendingOpenChannel instance
             */
            public static create(properties?: lnrpc.PendingChannelsResponse.IPendingOpenChannel): lnrpc.PendingChannelsResponse.PendingOpenChannel;

            /**
             * Encodes the specified PendingOpenChannel message. Does not implicitly {@link lnrpc.PendingChannelsResponse.PendingOpenChannel.verify|verify} messages.
             * @param message PendingOpenChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: lnrpc.PendingChannelsResponse.IPendingOpenChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PendingOpenChannel message, length delimited. Does not implicitly {@link lnrpc.PendingChannelsResponse.PendingOpenChannel.verify|verify} messages.
             * @param message PendingOpenChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: lnrpc.PendingChannelsResponse.IPendingOpenChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PendingOpenChannel message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PendingOpenChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingChannelsResponse.PendingOpenChannel;

            /**
             * Decodes a PendingOpenChannel message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PendingOpenChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingChannelsResponse.PendingOpenChannel;

            /**
             * Verifies a PendingOpenChannel message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PendingOpenChannel message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PendingOpenChannel
             */
            public static fromObject(object: { [k: string]: any }): lnrpc.PendingChannelsResponse.PendingOpenChannel;

            /**
             * Creates a plain object from a PendingOpenChannel message. Also converts values to other types if specified.
             * @param message PendingOpenChannel
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: lnrpc.PendingChannelsResponse.PendingOpenChannel, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PendingOpenChannel to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a WaitingCloseChannel. */
        interface IWaitingCloseChannel {

            /** WaitingCloseChannel channel */
            channel?: (lnrpc.PendingChannelsResponse.IPendingChannel|null);

            /** WaitingCloseChannel limboBalance */
            limboBalance?: (number|Long|null);

            /** WaitingCloseChannel commitments */
            commitments?: (lnrpc.PendingChannelsResponse.ICommitments|null);
        }

        /** Represents a WaitingCloseChannel. */
        class WaitingCloseChannel implements IWaitingCloseChannel {

            /**
             * Constructs a new WaitingCloseChannel.
             * @param [properties] Properties to set
             */
            constructor(properties?: lnrpc.PendingChannelsResponse.IWaitingCloseChannel);

            /** WaitingCloseChannel channel. */
            public channel?: (lnrpc.PendingChannelsResponse.IPendingChannel|null);

            /** WaitingCloseChannel limboBalance. */
            public limboBalance: (number|Long);

            /** WaitingCloseChannel commitments. */
            public commitments?: (lnrpc.PendingChannelsResponse.ICommitments|null);

            /**
             * Creates a new WaitingCloseChannel instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WaitingCloseChannel instance
             */
            public static create(properties?: lnrpc.PendingChannelsResponse.IWaitingCloseChannel): lnrpc.PendingChannelsResponse.WaitingCloseChannel;

            /**
             * Encodes the specified WaitingCloseChannel message. Does not implicitly {@link lnrpc.PendingChannelsResponse.WaitingCloseChannel.verify|verify} messages.
             * @param message WaitingCloseChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: lnrpc.PendingChannelsResponse.IWaitingCloseChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WaitingCloseChannel message, length delimited. Does not implicitly {@link lnrpc.PendingChannelsResponse.WaitingCloseChannel.verify|verify} messages.
             * @param message WaitingCloseChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: lnrpc.PendingChannelsResponse.IWaitingCloseChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WaitingCloseChannel message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WaitingCloseChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingChannelsResponse.WaitingCloseChannel;

            /**
             * Decodes a WaitingCloseChannel message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WaitingCloseChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingChannelsResponse.WaitingCloseChannel;

            /**
             * Verifies a WaitingCloseChannel message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WaitingCloseChannel message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WaitingCloseChannel
             */
            public static fromObject(object: { [k: string]: any }): lnrpc.PendingChannelsResponse.WaitingCloseChannel;

            /**
             * Creates a plain object from a WaitingCloseChannel message. Also converts values to other types if specified.
             * @param message WaitingCloseChannel
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: lnrpc.PendingChannelsResponse.WaitingCloseChannel, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WaitingCloseChannel to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Commitments. */
        interface ICommitments {

            /** Commitments localTxid */
            localTxid?: (string|null);

            /** Commitments remoteTxid */
            remoteTxid?: (string|null);

            /** Commitments remotePendingTxid */
            remotePendingTxid?: (string|null);

            /** Commitments localCommitFeeSat */
            localCommitFeeSat?: (number|Long|null);

            /** Commitments remoteCommitFeeSat */
            remoteCommitFeeSat?: (number|Long|null);

            /** Commitments remotePendingCommitFeeSat */
            remotePendingCommitFeeSat?: (number|Long|null);
        }

        /** Represents a Commitments. */
        class Commitments implements ICommitments {

            /**
             * Constructs a new Commitments.
             * @param [properties] Properties to set
             */
            constructor(properties?: lnrpc.PendingChannelsResponse.ICommitments);

            /** Commitments localTxid. */
            public localTxid: string;

            /** Commitments remoteTxid. */
            public remoteTxid: string;

            /** Commitments remotePendingTxid. */
            public remotePendingTxid: string;

            /** Commitments localCommitFeeSat. */
            public localCommitFeeSat: (number|Long);

            /** Commitments remoteCommitFeeSat. */
            public remoteCommitFeeSat: (number|Long);

            /** Commitments remotePendingCommitFeeSat. */
            public remotePendingCommitFeeSat: (number|Long);

            /**
             * Creates a new Commitments instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Commitments instance
             */
            public static create(properties?: lnrpc.PendingChannelsResponse.ICommitments): lnrpc.PendingChannelsResponse.Commitments;

            /**
             * Encodes the specified Commitments message. Does not implicitly {@link lnrpc.PendingChannelsResponse.Commitments.verify|verify} messages.
             * @param message Commitments message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: lnrpc.PendingChannelsResponse.ICommitments, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Commitments message, length delimited. Does not implicitly {@link lnrpc.PendingChannelsResponse.Commitments.verify|verify} messages.
             * @param message Commitments message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: lnrpc.PendingChannelsResponse.ICommitments, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Commitments message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Commitments
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingChannelsResponse.Commitments;

            /**
             * Decodes a Commitments message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Commitments
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingChannelsResponse.Commitments;

            /**
             * Verifies a Commitments message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Commitments message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Commitments
             */
            public static fromObject(object: { [k: string]: any }): lnrpc.PendingChannelsResponse.Commitments;

            /**
             * Creates a plain object from a Commitments message. Also converts values to other types if specified.
             * @param message Commitments
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: lnrpc.PendingChannelsResponse.Commitments, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Commitments to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ClosedChannel. */
        interface IClosedChannel {

            /** ClosedChannel channel */
            channel?: (lnrpc.PendingChannelsResponse.IPendingChannel|null);

            /** ClosedChannel closingTxid */
            closingTxid?: (string|null);
        }

        /** Represents a ClosedChannel. */
        class ClosedChannel implements IClosedChannel {

            /**
             * Constructs a new ClosedChannel.
             * @param [properties] Properties to set
             */
            constructor(properties?: lnrpc.PendingChannelsResponse.IClosedChannel);

            /** ClosedChannel channel. */
            public channel?: (lnrpc.PendingChannelsResponse.IPendingChannel|null);

            /** ClosedChannel closingTxid. */
            public closingTxid: string;

            /**
             * Creates a new ClosedChannel instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ClosedChannel instance
             */
            public static create(properties?: lnrpc.PendingChannelsResponse.IClosedChannel): lnrpc.PendingChannelsResponse.ClosedChannel;

            /**
             * Encodes the specified ClosedChannel message. Does not implicitly {@link lnrpc.PendingChannelsResponse.ClosedChannel.verify|verify} messages.
             * @param message ClosedChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: lnrpc.PendingChannelsResponse.IClosedChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ClosedChannel message, length delimited. Does not implicitly {@link lnrpc.PendingChannelsResponse.ClosedChannel.verify|verify} messages.
             * @param message ClosedChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: lnrpc.PendingChannelsResponse.IClosedChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ClosedChannel message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ClosedChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingChannelsResponse.ClosedChannel;

            /**
             * Decodes a ClosedChannel message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ClosedChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingChannelsResponse.ClosedChannel;

            /**
             * Verifies a ClosedChannel message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ClosedChannel message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ClosedChannel
             */
            public static fromObject(object: { [k: string]: any }): lnrpc.PendingChannelsResponse.ClosedChannel;

            /**
             * Creates a plain object from a ClosedChannel message. Also converts values to other types if specified.
             * @param message ClosedChannel
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: lnrpc.PendingChannelsResponse.ClosedChannel, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ClosedChannel to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ForceClosedChannel. */
        interface IForceClosedChannel {

            /** ForceClosedChannel channel */
            channel?: (lnrpc.PendingChannelsResponse.IPendingChannel|null);

            /** ForceClosedChannel closingTxid */
            closingTxid?: (string|null);

            /** ForceClosedChannel limboBalance */
            limboBalance?: (number|Long|null);

            /** ForceClosedChannel maturityHeight */
            maturityHeight?: (number|null);

            /** ForceClosedChannel blocksTilMaturity */
            blocksTilMaturity?: (number|null);

            /** ForceClosedChannel recoveredBalance */
            recoveredBalance?: (number|Long|null);

            /** ForceClosedChannel pendingHtlcs */
            pendingHtlcs?: (lnrpc.IPendingHTLC[]|null);

            /** ForceClosedChannel anchor */
            anchor?: (lnrpc.PendingChannelsResponse.ForceClosedChannel.AnchorState|null);
        }

        /** Represents a ForceClosedChannel. */
        class ForceClosedChannel implements IForceClosedChannel {

            /**
             * Constructs a new ForceClosedChannel.
             * @param [properties] Properties to set
             */
            constructor(properties?: lnrpc.PendingChannelsResponse.IForceClosedChannel);

            /** ForceClosedChannel channel. */
            public channel?: (lnrpc.PendingChannelsResponse.IPendingChannel|null);

            /** ForceClosedChannel closingTxid. */
            public closingTxid: string;

            /** ForceClosedChannel limboBalance. */
            public limboBalance: (number|Long);

            /** ForceClosedChannel maturityHeight. */
            public maturityHeight: number;

            /** ForceClosedChannel blocksTilMaturity. */
            public blocksTilMaturity: number;

            /** ForceClosedChannel recoveredBalance. */
            public recoveredBalance: (number|Long);

            /** ForceClosedChannel pendingHtlcs. */
            public pendingHtlcs: lnrpc.IPendingHTLC[];

            /** ForceClosedChannel anchor. */
            public anchor: lnrpc.PendingChannelsResponse.ForceClosedChannel.AnchorState;

            /**
             * Creates a new ForceClosedChannel instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ForceClosedChannel instance
             */
            public static create(properties?: lnrpc.PendingChannelsResponse.IForceClosedChannel): lnrpc.PendingChannelsResponse.ForceClosedChannel;

            /**
             * Encodes the specified ForceClosedChannel message. Does not implicitly {@link lnrpc.PendingChannelsResponse.ForceClosedChannel.verify|verify} messages.
             * @param message ForceClosedChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: lnrpc.PendingChannelsResponse.IForceClosedChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ForceClosedChannel message, length delimited. Does not implicitly {@link lnrpc.PendingChannelsResponse.ForceClosedChannel.verify|verify} messages.
             * @param message ForceClosedChannel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: lnrpc.PendingChannelsResponse.IForceClosedChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ForceClosedChannel message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ForceClosedChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PendingChannelsResponse.ForceClosedChannel;

            /**
             * Decodes a ForceClosedChannel message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ForceClosedChannel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PendingChannelsResponse.ForceClosedChannel;

            /**
             * Verifies a ForceClosedChannel message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ForceClosedChannel message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ForceClosedChannel
             */
            public static fromObject(object: { [k: string]: any }): lnrpc.PendingChannelsResponse.ForceClosedChannel;

            /**
             * Creates a plain object from a ForceClosedChannel message. Also converts values to other types if specified.
             * @param message ForceClosedChannel
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: lnrpc.PendingChannelsResponse.ForceClosedChannel, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ForceClosedChannel to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace ForceClosedChannel {

            /** AnchorState enum. */
            enum AnchorState {
                LIMBO = 0,
                RECOVERED = 1,
                LOST = 2
            }
        }
    }

    /** Properties of a ChannelEventSubscription. */
    interface IChannelEventSubscription {
    }

    /** Represents a ChannelEventSubscription. */
    class ChannelEventSubscription implements IChannelEventSubscription {

        /**
         * Constructs a new ChannelEventSubscription.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelEventSubscription);

        /**
         * Creates a new ChannelEventSubscription instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelEventSubscription instance
         */
        public static create(properties?: lnrpc.IChannelEventSubscription): lnrpc.ChannelEventSubscription;

        /**
         * Encodes the specified ChannelEventSubscription message. Does not implicitly {@link lnrpc.ChannelEventSubscription.verify|verify} messages.
         * @param message ChannelEventSubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelEventSubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelEventSubscription message, length delimited. Does not implicitly {@link lnrpc.ChannelEventSubscription.verify|verify} messages.
         * @param message ChannelEventSubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelEventSubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelEventSubscription message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelEventSubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelEventSubscription;

        /**
         * Decodes a ChannelEventSubscription message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelEventSubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelEventSubscription;

        /**
         * Verifies a ChannelEventSubscription message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelEventSubscription message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelEventSubscription
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelEventSubscription;

        /**
         * Creates a plain object from a ChannelEventSubscription message. Also converts values to other types if specified.
         * @param message ChannelEventSubscription
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelEventSubscription, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelEventSubscription to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelEventUpdate. */
    interface IChannelEventUpdate {

        /** ChannelEventUpdate openChannel */
        openChannel?: (lnrpc.IChannel|null);

        /** ChannelEventUpdate closedChannel */
        closedChannel?: (lnrpc.IChannelCloseSummary|null);

        /** ChannelEventUpdate activeChannel */
        activeChannel?: (lnrpc.IChannelPoint|null);

        /** ChannelEventUpdate inactiveChannel */
        inactiveChannel?: (lnrpc.IChannelPoint|null);

        /** ChannelEventUpdate pendingOpenChannel */
        pendingOpenChannel?: (lnrpc.IPendingUpdate|null);

        /** ChannelEventUpdate type */
        type?: (lnrpc.ChannelEventUpdate.UpdateType|null);
    }

    /** Represents a ChannelEventUpdate. */
    class ChannelEventUpdate implements IChannelEventUpdate {

        /**
         * Constructs a new ChannelEventUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelEventUpdate);

        /** ChannelEventUpdate openChannel. */
        public openChannel?: (lnrpc.IChannel|null);

        /** ChannelEventUpdate closedChannel. */
        public closedChannel?: (lnrpc.IChannelCloseSummary|null);

        /** ChannelEventUpdate activeChannel. */
        public activeChannel?: (lnrpc.IChannelPoint|null);

        /** ChannelEventUpdate inactiveChannel. */
        public inactiveChannel?: (lnrpc.IChannelPoint|null);

        /** ChannelEventUpdate pendingOpenChannel. */
        public pendingOpenChannel?: (lnrpc.IPendingUpdate|null);

        /** ChannelEventUpdate type. */
        public type: lnrpc.ChannelEventUpdate.UpdateType;

        /** ChannelEventUpdate channel. */
        public channel?: ("openChannel"|"closedChannel"|"activeChannel"|"inactiveChannel"|"pendingOpenChannel");

        /**
         * Creates a new ChannelEventUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelEventUpdate instance
         */
        public static create(properties?: lnrpc.IChannelEventUpdate): lnrpc.ChannelEventUpdate;

        /**
         * Encodes the specified ChannelEventUpdate message. Does not implicitly {@link lnrpc.ChannelEventUpdate.verify|verify} messages.
         * @param message ChannelEventUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelEventUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelEventUpdate message, length delimited. Does not implicitly {@link lnrpc.ChannelEventUpdate.verify|verify} messages.
         * @param message ChannelEventUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelEventUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelEventUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelEventUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelEventUpdate;

        /**
         * Decodes a ChannelEventUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelEventUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelEventUpdate;

        /**
         * Verifies a ChannelEventUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelEventUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelEventUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelEventUpdate;

        /**
         * Creates a plain object from a ChannelEventUpdate message. Also converts values to other types if specified.
         * @param message ChannelEventUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelEventUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelEventUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ChannelEventUpdate {

        /** UpdateType enum. */
        enum UpdateType {
            OPEN_CHANNEL = 0,
            CLOSED_CHANNEL = 1,
            ACTIVE_CHANNEL = 2,
            INACTIVE_CHANNEL = 3,
            PENDING_OPEN_CHANNEL = 4
        }
    }

    /** Properties of a WalletBalanceRequest. */
    interface IWalletBalanceRequest {
    }

    /** Represents a WalletBalanceRequest. */
    class WalletBalanceRequest implements IWalletBalanceRequest {

        /**
         * Constructs a new WalletBalanceRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IWalletBalanceRequest);

        /**
         * Creates a new WalletBalanceRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WalletBalanceRequest instance
         */
        public static create(properties?: lnrpc.IWalletBalanceRequest): lnrpc.WalletBalanceRequest;

        /**
         * Encodes the specified WalletBalanceRequest message. Does not implicitly {@link lnrpc.WalletBalanceRequest.verify|verify} messages.
         * @param message WalletBalanceRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IWalletBalanceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WalletBalanceRequest message, length delimited. Does not implicitly {@link lnrpc.WalletBalanceRequest.verify|verify} messages.
         * @param message WalletBalanceRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IWalletBalanceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WalletBalanceRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WalletBalanceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.WalletBalanceRequest;

        /**
         * Decodes a WalletBalanceRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WalletBalanceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.WalletBalanceRequest;

        /**
         * Verifies a WalletBalanceRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WalletBalanceRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WalletBalanceRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.WalletBalanceRequest;

        /**
         * Creates a plain object from a WalletBalanceRequest message. Also converts values to other types if specified.
         * @param message WalletBalanceRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.WalletBalanceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WalletBalanceRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a WalletBalanceResponse. */
    interface IWalletBalanceResponse {

        /** WalletBalanceResponse totalBalance */
        totalBalance?: (number|Long|null);

        /** WalletBalanceResponse confirmedBalance */
        confirmedBalance?: (number|Long|null);

        /** WalletBalanceResponse unconfirmedBalance */
        unconfirmedBalance?: (number|Long|null);
    }

    /** Represents a WalletBalanceResponse. */
    class WalletBalanceResponse implements IWalletBalanceResponse {

        /**
         * Constructs a new WalletBalanceResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IWalletBalanceResponse);

        /** WalletBalanceResponse totalBalance. */
        public totalBalance: (number|Long);

        /** WalletBalanceResponse confirmedBalance. */
        public confirmedBalance: (number|Long);

        /** WalletBalanceResponse unconfirmedBalance. */
        public unconfirmedBalance: (number|Long);

        /**
         * Creates a new WalletBalanceResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WalletBalanceResponse instance
         */
        public static create(properties?: lnrpc.IWalletBalanceResponse): lnrpc.WalletBalanceResponse;

        /**
         * Encodes the specified WalletBalanceResponse message. Does not implicitly {@link lnrpc.WalletBalanceResponse.verify|verify} messages.
         * @param message WalletBalanceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IWalletBalanceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WalletBalanceResponse message, length delimited. Does not implicitly {@link lnrpc.WalletBalanceResponse.verify|verify} messages.
         * @param message WalletBalanceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IWalletBalanceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WalletBalanceResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WalletBalanceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.WalletBalanceResponse;

        /**
         * Decodes a WalletBalanceResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WalletBalanceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.WalletBalanceResponse;

        /**
         * Verifies a WalletBalanceResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WalletBalanceResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WalletBalanceResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.WalletBalanceResponse;

        /**
         * Creates a plain object from a WalletBalanceResponse message. Also converts values to other types if specified.
         * @param message WalletBalanceResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.WalletBalanceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WalletBalanceResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Amount. */
    interface IAmount {

        /** Amount sat */
        sat?: (number|Long|null);

        /** Amount msat */
        msat?: (number|Long|null);
    }

    /** Represents an Amount. */
    class Amount implements IAmount {

        /**
         * Constructs a new Amount.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IAmount);

        /** Amount sat. */
        public sat: (number|Long);

        /** Amount msat. */
        public msat: (number|Long);

        /**
         * Creates a new Amount instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Amount instance
         */
        public static create(properties?: lnrpc.IAmount): lnrpc.Amount;

        /**
         * Encodes the specified Amount message. Does not implicitly {@link lnrpc.Amount.verify|verify} messages.
         * @param message Amount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IAmount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Amount message, length delimited. Does not implicitly {@link lnrpc.Amount.verify|verify} messages.
         * @param message Amount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IAmount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Amount message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Amount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Amount;

        /**
         * Decodes an Amount message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Amount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Amount;

        /**
         * Verifies an Amount message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Amount message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Amount
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Amount;

        /**
         * Creates a plain object from an Amount message. Also converts values to other types if specified.
         * @param message Amount
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Amount, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Amount to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelBalanceRequest. */
    interface IChannelBalanceRequest {
    }

    /** Represents a ChannelBalanceRequest. */
    class ChannelBalanceRequest implements IChannelBalanceRequest {

        /**
         * Constructs a new ChannelBalanceRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelBalanceRequest);

        /**
         * Creates a new ChannelBalanceRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelBalanceRequest instance
         */
        public static create(properties?: lnrpc.IChannelBalanceRequest): lnrpc.ChannelBalanceRequest;

        /**
         * Encodes the specified ChannelBalanceRequest message. Does not implicitly {@link lnrpc.ChannelBalanceRequest.verify|verify} messages.
         * @param message ChannelBalanceRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelBalanceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelBalanceRequest message, length delimited. Does not implicitly {@link lnrpc.ChannelBalanceRequest.verify|verify} messages.
         * @param message ChannelBalanceRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelBalanceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelBalanceRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelBalanceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelBalanceRequest;

        /**
         * Decodes a ChannelBalanceRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelBalanceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelBalanceRequest;

        /**
         * Verifies a ChannelBalanceRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelBalanceRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelBalanceRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelBalanceRequest;

        /**
         * Creates a plain object from a ChannelBalanceRequest message. Also converts values to other types if specified.
         * @param message ChannelBalanceRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelBalanceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelBalanceRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelBalanceResponse. */
    interface IChannelBalanceResponse {

        /** ChannelBalanceResponse balance */
        balance?: (number|Long|null);

        /** ChannelBalanceResponse pendingOpenBalance */
        pendingOpenBalance?: (number|Long|null);

        /** ChannelBalanceResponse localBalance */
        localBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse remoteBalance */
        remoteBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse unsettledLocalBalance */
        unsettledLocalBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse unsettledRemoteBalance */
        unsettledRemoteBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse pendingOpenLocalBalance */
        pendingOpenLocalBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse pendingOpenRemoteBalance */
        pendingOpenRemoteBalance?: (lnrpc.IAmount|null);
    }

    /** Represents a ChannelBalanceResponse. */
    class ChannelBalanceResponse implements IChannelBalanceResponse {

        /**
         * Constructs a new ChannelBalanceResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelBalanceResponse);

        /** ChannelBalanceResponse balance. */
        public balance: (number|Long);

        /** ChannelBalanceResponse pendingOpenBalance. */
        public pendingOpenBalance: (number|Long);

        /** ChannelBalanceResponse localBalance. */
        public localBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse remoteBalance. */
        public remoteBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse unsettledLocalBalance. */
        public unsettledLocalBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse unsettledRemoteBalance. */
        public unsettledRemoteBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse pendingOpenLocalBalance. */
        public pendingOpenLocalBalance?: (lnrpc.IAmount|null);

        /** ChannelBalanceResponse pendingOpenRemoteBalance. */
        public pendingOpenRemoteBalance?: (lnrpc.IAmount|null);

        /**
         * Creates a new ChannelBalanceResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelBalanceResponse instance
         */
        public static create(properties?: lnrpc.IChannelBalanceResponse): lnrpc.ChannelBalanceResponse;

        /**
         * Encodes the specified ChannelBalanceResponse message. Does not implicitly {@link lnrpc.ChannelBalanceResponse.verify|verify} messages.
         * @param message ChannelBalanceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelBalanceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelBalanceResponse message, length delimited. Does not implicitly {@link lnrpc.ChannelBalanceResponse.verify|verify} messages.
         * @param message ChannelBalanceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelBalanceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelBalanceResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelBalanceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelBalanceResponse;

        /**
         * Decodes a ChannelBalanceResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelBalanceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelBalanceResponse;

        /**
         * Verifies a ChannelBalanceResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelBalanceResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelBalanceResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelBalanceResponse;

        /**
         * Creates a plain object from a ChannelBalanceResponse message. Also converts values to other types if specified.
         * @param message ChannelBalanceResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelBalanceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelBalanceResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a QueryRoutesRequest. */
    interface IQueryRoutesRequest {

        /** QueryRoutesRequest pubKey */
        pubKey?: (string|null);

        /** QueryRoutesRequest amt */
        amt?: (number|Long|null);

        /** QueryRoutesRequest amtMsat */
        amtMsat?: (number|Long|null);

        /** QueryRoutesRequest finalCltvDelta */
        finalCltvDelta?: (number|null);

        /** QueryRoutesRequest feeLimit */
        feeLimit?: (lnrpc.IFeeLimit|null);

        /** QueryRoutesRequest ignoredNodes */
        ignoredNodes?: (Uint8Array[]|null);

        /** QueryRoutesRequest ignoredEdges */
        ignoredEdges?: (lnrpc.IEdgeLocator[]|null);

        /** QueryRoutesRequest sourcePubKey */
        sourcePubKey?: (string|null);

        /** QueryRoutesRequest useMissionControl */
        useMissionControl?: (boolean|null);

        /** QueryRoutesRequest ignoredPairs */
        ignoredPairs?: (lnrpc.INodePair[]|null);

        /** QueryRoutesRequest cltvLimit */
        cltvLimit?: (number|null);

        /** QueryRoutesRequest destCustomRecords */
        destCustomRecords?: ({ [k: string]: Uint8Array }|null);

        /** QueryRoutesRequest outgoingChanId */
        outgoingChanId?: (number|Long|null);

        /** QueryRoutesRequest lastHopPubkey */
        lastHopPubkey?: (Uint8Array|null);

        /** QueryRoutesRequest routeHints */
        routeHints?: (lnrpc.IRouteHint[]|null);

        /** QueryRoutesRequest destFeatures */
        destFeatures?: (lnrpc.FeatureBit[]|null);
    }

    /** Represents a QueryRoutesRequest. */
    class QueryRoutesRequest implements IQueryRoutesRequest {

        /**
         * Constructs a new QueryRoutesRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IQueryRoutesRequest);

        /** QueryRoutesRequest pubKey. */
        public pubKey: string;

        /** QueryRoutesRequest amt. */
        public amt: (number|Long);

        /** QueryRoutesRequest amtMsat. */
        public amtMsat: (number|Long);

        /** QueryRoutesRequest finalCltvDelta. */
        public finalCltvDelta: number;

        /** QueryRoutesRequest feeLimit. */
        public feeLimit?: (lnrpc.IFeeLimit|null);

        /** QueryRoutesRequest ignoredNodes. */
        public ignoredNodes: Uint8Array[];

        /** QueryRoutesRequest ignoredEdges. */
        public ignoredEdges: lnrpc.IEdgeLocator[];

        /** QueryRoutesRequest sourcePubKey. */
        public sourcePubKey: string;

        /** QueryRoutesRequest useMissionControl. */
        public useMissionControl: boolean;

        /** QueryRoutesRequest ignoredPairs. */
        public ignoredPairs: lnrpc.INodePair[];

        /** QueryRoutesRequest cltvLimit. */
        public cltvLimit: number;

        /** QueryRoutesRequest destCustomRecords. */
        public destCustomRecords: { [k: string]: Uint8Array };

        /** QueryRoutesRequest outgoingChanId. */
        public outgoingChanId: (number|Long);

        /** QueryRoutesRequest lastHopPubkey. */
        public lastHopPubkey: Uint8Array;

        /** QueryRoutesRequest routeHints. */
        public routeHints: lnrpc.IRouteHint[];

        /** QueryRoutesRequest destFeatures. */
        public destFeatures: lnrpc.FeatureBit[];

        /**
         * Creates a new QueryRoutesRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryRoutesRequest instance
         */
        public static create(properties?: lnrpc.IQueryRoutesRequest): lnrpc.QueryRoutesRequest;

        /**
         * Encodes the specified QueryRoutesRequest message. Does not implicitly {@link lnrpc.QueryRoutesRequest.verify|verify} messages.
         * @param message QueryRoutesRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IQueryRoutesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryRoutesRequest message, length delimited. Does not implicitly {@link lnrpc.QueryRoutesRequest.verify|verify} messages.
         * @param message QueryRoutesRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IQueryRoutesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryRoutesRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryRoutesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.QueryRoutesRequest;

        /**
         * Decodes a QueryRoutesRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryRoutesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.QueryRoutesRequest;

        /**
         * Verifies a QueryRoutesRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryRoutesRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryRoutesRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.QueryRoutesRequest;

        /**
         * Creates a plain object from a QueryRoutesRequest message. Also converts values to other types if specified.
         * @param message QueryRoutesRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.QueryRoutesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryRoutesRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NodePair. */
    interface INodePair {

        /** NodePair from */
        from?: (Uint8Array|null);

        /** NodePair to */
        to?: (Uint8Array|null);
    }

    /** Represents a NodePair. */
    class NodePair implements INodePair {

        /**
         * Constructs a new NodePair.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INodePair);

        /** NodePair from. */
        public from: Uint8Array;

        /** NodePair to. */
        public to: Uint8Array;

        /**
         * Creates a new NodePair instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NodePair instance
         */
        public static create(properties?: lnrpc.INodePair): lnrpc.NodePair;

        /**
         * Encodes the specified NodePair message. Does not implicitly {@link lnrpc.NodePair.verify|verify} messages.
         * @param message NodePair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INodePair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NodePair message, length delimited. Does not implicitly {@link lnrpc.NodePair.verify|verify} messages.
         * @param message NodePair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INodePair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NodePair message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NodePair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NodePair;

        /**
         * Decodes a NodePair message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NodePair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NodePair;

        /**
         * Verifies a NodePair message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NodePair message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NodePair
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NodePair;

        /**
         * Creates a plain object from a NodePair message. Also converts values to other types if specified.
         * @param message NodePair
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NodePair, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NodePair to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EdgeLocator. */
    interface IEdgeLocator {

        /** EdgeLocator channelId */
        channelId?: (number|Long|null);

        /** EdgeLocator directionReverse */
        directionReverse?: (boolean|null);
    }

    /** Represents an EdgeLocator. */
    class EdgeLocator implements IEdgeLocator {

        /**
         * Constructs a new EdgeLocator.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IEdgeLocator);

        /** EdgeLocator channelId. */
        public channelId: (number|Long);

        /** EdgeLocator directionReverse. */
        public directionReverse: boolean;

        /**
         * Creates a new EdgeLocator instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EdgeLocator instance
         */
        public static create(properties?: lnrpc.IEdgeLocator): lnrpc.EdgeLocator;

        /**
         * Encodes the specified EdgeLocator message. Does not implicitly {@link lnrpc.EdgeLocator.verify|verify} messages.
         * @param message EdgeLocator message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IEdgeLocator, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EdgeLocator message, length delimited. Does not implicitly {@link lnrpc.EdgeLocator.verify|verify} messages.
         * @param message EdgeLocator message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IEdgeLocator, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EdgeLocator message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EdgeLocator
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.EdgeLocator;

        /**
         * Decodes an EdgeLocator message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EdgeLocator
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.EdgeLocator;

        /**
         * Verifies an EdgeLocator message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EdgeLocator message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EdgeLocator
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.EdgeLocator;

        /**
         * Creates a plain object from an EdgeLocator message. Also converts values to other types if specified.
         * @param message EdgeLocator
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.EdgeLocator, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EdgeLocator to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a QueryRoutesResponse. */
    interface IQueryRoutesResponse {

        /** QueryRoutesResponse routes */
        routes?: (lnrpc.IRoute[]|null);

        /** QueryRoutesResponse successProb */
        successProb?: (number|null);
    }

    /** Represents a QueryRoutesResponse. */
    class QueryRoutesResponse implements IQueryRoutesResponse {

        /**
         * Constructs a new QueryRoutesResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IQueryRoutesResponse);

        /** QueryRoutesResponse routes. */
        public routes: lnrpc.IRoute[];

        /** QueryRoutesResponse successProb. */
        public successProb: number;

        /**
         * Creates a new QueryRoutesResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryRoutesResponse instance
         */
        public static create(properties?: lnrpc.IQueryRoutesResponse): lnrpc.QueryRoutesResponse;

        /**
         * Encodes the specified QueryRoutesResponse message. Does not implicitly {@link lnrpc.QueryRoutesResponse.verify|verify} messages.
         * @param message QueryRoutesResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IQueryRoutesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryRoutesResponse message, length delimited. Does not implicitly {@link lnrpc.QueryRoutesResponse.verify|verify} messages.
         * @param message QueryRoutesResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IQueryRoutesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryRoutesResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryRoutesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.QueryRoutesResponse;

        /**
         * Decodes a QueryRoutesResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryRoutesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.QueryRoutesResponse;

        /**
         * Verifies a QueryRoutesResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryRoutesResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryRoutesResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.QueryRoutesResponse;

        /**
         * Creates a plain object from a QueryRoutesResponse message. Also converts values to other types if specified.
         * @param message QueryRoutesResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.QueryRoutesResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryRoutesResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Hop. */
    interface IHop {

        /** Hop chanId */
        chanId?: (number|Long|null);

        /** Hop chanCapacity */
        chanCapacity?: (number|Long|null);

        /** Hop amtToForward */
        amtToForward?: (number|Long|null);

        /** Hop fee */
        fee?: (number|Long|null);

        /** Hop expiry */
        expiry?: (number|null);

        /** Hop amtToForwardMsat */
        amtToForwardMsat?: (number|Long|null);

        /** Hop feeMsat */
        feeMsat?: (number|Long|null);

        /** Hop pubKey */
        pubKey?: (string|null);

        /** Hop tlvPayload */
        tlvPayload?: (boolean|null);

        /** Hop mppRecord */
        mppRecord?: (lnrpc.IMPPRecord|null);

        /** Hop customRecords */
        customRecords?: ({ [k: string]: Uint8Array }|null);
    }

    /** Represents a Hop. */
    class Hop implements IHop {

        /**
         * Constructs a new Hop.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IHop);

        /** Hop chanId. */
        public chanId: (number|Long);

        /** Hop chanCapacity. */
        public chanCapacity: (number|Long);

        /** Hop amtToForward. */
        public amtToForward: (number|Long);

        /** Hop fee. */
        public fee: (number|Long);

        /** Hop expiry. */
        public expiry: number;

        /** Hop amtToForwardMsat. */
        public amtToForwardMsat: (number|Long);

        /** Hop feeMsat. */
        public feeMsat: (number|Long);

        /** Hop pubKey. */
        public pubKey: string;

        /** Hop tlvPayload. */
        public tlvPayload: boolean;

        /** Hop mppRecord. */
        public mppRecord?: (lnrpc.IMPPRecord|null);

        /** Hop customRecords. */
        public customRecords: { [k: string]: Uint8Array };

        /**
         * Creates a new Hop instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Hop instance
         */
        public static create(properties?: lnrpc.IHop): lnrpc.Hop;

        /**
         * Encodes the specified Hop message. Does not implicitly {@link lnrpc.Hop.verify|verify} messages.
         * @param message Hop message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IHop, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Hop message, length delimited. Does not implicitly {@link lnrpc.Hop.verify|verify} messages.
         * @param message Hop message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IHop, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Hop message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Hop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Hop;

        /**
         * Decodes a Hop message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Hop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Hop;

        /**
         * Verifies a Hop message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Hop message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Hop
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Hop;

        /**
         * Creates a plain object from a Hop message. Also converts values to other types if specified.
         * @param message Hop
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Hop, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Hop to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MPPRecord. */
    interface IMPPRecord {

        /** MPPRecord paymentAddr */
        paymentAddr?: (Uint8Array|null);

        /** MPPRecord totalAmtMsat */
        totalAmtMsat?: (number|Long|null);
    }

    /** Represents a MPPRecord. */
    class MPPRecord implements IMPPRecord {

        /**
         * Constructs a new MPPRecord.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IMPPRecord);

        /** MPPRecord paymentAddr. */
        public paymentAddr: Uint8Array;

        /** MPPRecord totalAmtMsat. */
        public totalAmtMsat: (number|Long);

        /**
         * Creates a new MPPRecord instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MPPRecord instance
         */
        public static create(properties?: lnrpc.IMPPRecord): lnrpc.MPPRecord;

        /**
         * Encodes the specified MPPRecord message. Does not implicitly {@link lnrpc.MPPRecord.verify|verify} messages.
         * @param message MPPRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IMPPRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MPPRecord message, length delimited. Does not implicitly {@link lnrpc.MPPRecord.verify|verify} messages.
         * @param message MPPRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IMPPRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MPPRecord message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MPPRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.MPPRecord;

        /**
         * Decodes a MPPRecord message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MPPRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.MPPRecord;

        /**
         * Verifies a MPPRecord message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MPPRecord message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MPPRecord
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.MPPRecord;

        /**
         * Creates a plain object from a MPPRecord message. Also converts values to other types if specified.
         * @param message MPPRecord
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.MPPRecord, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MPPRecord to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Route. */
    interface IRoute {

        /** Route totalTimeLock */
        totalTimeLock?: (number|null);

        /** Route totalFees */
        totalFees?: (number|Long|null);

        /** Route totalAmt */
        totalAmt?: (number|Long|null);

        /** Route hops */
        hops?: (lnrpc.IHop[]|null);

        /** Route totalFeesMsat */
        totalFeesMsat?: (number|Long|null);

        /** Route totalAmtMsat */
        totalAmtMsat?: (number|Long|null);
    }

    /** Represents a Route. */
    class Route implements IRoute {

        /**
         * Constructs a new Route.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IRoute);

        /** Route totalTimeLock. */
        public totalTimeLock: number;

        /** Route totalFees. */
        public totalFees: (number|Long);

        /** Route totalAmt. */
        public totalAmt: (number|Long);

        /** Route hops. */
        public hops: lnrpc.IHop[];

        /** Route totalFeesMsat. */
        public totalFeesMsat: (number|Long);

        /** Route totalAmtMsat. */
        public totalAmtMsat: (number|Long);

        /**
         * Creates a new Route instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Route instance
         */
        public static create(properties?: lnrpc.IRoute): lnrpc.Route;

        /**
         * Encodes the specified Route message. Does not implicitly {@link lnrpc.Route.verify|verify} messages.
         * @param message Route message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IRoute, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Route message, length delimited. Does not implicitly {@link lnrpc.Route.verify|verify} messages.
         * @param message Route message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IRoute, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Route message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Route
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Route;

        /**
         * Decodes a Route message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Route
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Route;

        /**
         * Verifies a Route message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Route message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Route
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Route;

        /**
         * Creates a plain object from a Route message. Also converts values to other types if specified.
         * @param message Route
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Route, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Route to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NodeInfoRequest. */
    interface INodeInfoRequest {

        /** NodeInfoRequest pubKey */
        pubKey?: (string|null);

        /** NodeInfoRequest includeChannels */
        includeChannels?: (boolean|null);
    }

    /** Represents a NodeInfoRequest. */
    class NodeInfoRequest implements INodeInfoRequest {

        /**
         * Constructs a new NodeInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INodeInfoRequest);

        /** NodeInfoRequest pubKey. */
        public pubKey: string;

        /** NodeInfoRequest includeChannels. */
        public includeChannels: boolean;

        /**
         * Creates a new NodeInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NodeInfoRequest instance
         */
        public static create(properties?: lnrpc.INodeInfoRequest): lnrpc.NodeInfoRequest;

        /**
         * Encodes the specified NodeInfoRequest message. Does not implicitly {@link lnrpc.NodeInfoRequest.verify|verify} messages.
         * @param message NodeInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INodeInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NodeInfoRequest message, length delimited. Does not implicitly {@link lnrpc.NodeInfoRequest.verify|verify} messages.
         * @param message NodeInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INodeInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NodeInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NodeInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NodeInfoRequest;

        /**
         * Decodes a NodeInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NodeInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NodeInfoRequest;

        /**
         * Verifies a NodeInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NodeInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NodeInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NodeInfoRequest;

        /**
         * Creates a plain object from a NodeInfoRequest message. Also converts values to other types if specified.
         * @param message NodeInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NodeInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NodeInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NodeInfo. */
    interface INodeInfo {

        /** NodeInfo node */
        node?: (lnrpc.ILightningNode|null);

        /** NodeInfo numChannels */
        numChannels?: (number|null);

        /** NodeInfo totalCapacity */
        totalCapacity?: (number|Long|null);

        /** NodeInfo channels */
        channels?: (lnrpc.IChannelEdge[]|null);
    }

    /** Represents a NodeInfo. */
    class NodeInfo implements INodeInfo {

        /**
         * Constructs a new NodeInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INodeInfo);

        /** NodeInfo node. */
        public node?: (lnrpc.ILightningNode|null);

        /** NodeInfo numChannels. */
        public numChannels: number;

        /** NodeInfo totalCapacity. */
        public totalCapacity: (number|Long);

        /** NodeInfo channels. */
        public channels: lnrpc.IChannelEdge[];

        /**
         * Creates a new NodeInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NodeInfo instance
         */
        public static create(properties?: lnrpc.INodeInfo): lnrpc.NodeInfo;

        /**
         * Encodes the specified NodeInfo message. Does not implicitly {@link lnrpc.NodeInfo.verify|verify} messages.
         * @param message NodeInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NodeInfo message, length delimited. Does not implicitly {@link lnrpc.NodeInfo.verify|verify} messages.
         * @param message NodeInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NodeInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NodeInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NodeInfo;

        /**
         * Decodes a NodeInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NodeInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NodeInfo;

        /**
         * Verifies a NodeInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NodeInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NodeInfo
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NodeInfo;

        /**
         * Creates a plain object from a NodeInfo message. Also converts values to other types if specified.
         * @param message NodeInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NodeInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LightningNode. */
    interface ILightningNode {

        /** LightningNode lastUpdate */
        lastUpdate?: (number|null);

        /** LightningNode pubKey */
        pubKey?: (string|null);

        /** LightningNode alias */
        alias?: (string|null);

        /** LightningNode addresses */
        addresses?: (lnrpc.INodeAddress[]|null);

        /** LightningNode color */
        color?: (string|null);

        /** LightningNode features */
        features?: ({ [k: string]: lnrpc.IFeature }|null);
    }

    /** Represents a LightningNode. */
    class LightningNode implements ILightningNode {

        /**
         * Constructs a new LightningNode.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.ILightningNode);

        /** LightningNode lastUpdate. */
        public lastUpdate: number;

        /** LightningNode pubKey. */
        public pubKey: string;

        /** LightningNode alias. */
        public alias: string;

        /** LightningNode addresses. */
        public addresses: lnrpc.INodeAddress[];

        /** LightningNode color. */
        public color: string;

        /** LightningNode features. */
        public features: { [k: string]: lnrpc.IFeature };

        /**
         * Creates a new LightningNode instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LightningNode instance
         */
        public static create(properties?: lnrpc.ILightningNode): lnrpc.LightningNode;

        /**
         * Encodes the specified LightningNode message. Does not implicitly {@link lnrpc.LightningNode.verify|verify} messages.
         * @param message LightningNode message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.ILightningNode, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LightningNode message, length delimited. Does not implicitly {@link lnrpc.LightningNode.verify|verify} messages.
         * @param message LightningNode message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.ILightningNode, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LightningNode message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LightningNode
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.LightningNode;

        /**
         * Decodes a LightningNode message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LightningNode
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.LightningNode;

        /**
         * Verifies a LightningNode message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LightningNode message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LightningNode
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.LightningNode;

        /**
         * Creates a plain object from a LightningNode message. Also converts values to other types if specified.
         * @param message LightningNode
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.LightningNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LightningNode to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NodeAddress. */
    interface INodeAddress {

        /** NodeAddress network */
        network?: (string|null);

        /** NodeAddress addr */
        addr?: (string|null);
    }

    /** Represents a NodeAddress. */
    class NodeAddress implements INodeAddress {

        /**
         * Constructs a new NodeAddress.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INodeAddress);

        /** NodeAddress network. */
        public network: string;

        /** NodeAddress addr. */
        public addr: string;

        /**
         * Creates a new NodeAddress instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NodeAddress instance
         */
        public static create(properties?: lnrpc.INodeAddress): lnrpc.NodeAddress;

        /**
         * Encodes the specified NodeAddress message. Does not implicitly {@link lnrpc.NodeAddress.verify|verify} messages.
         * @param message NodeAddress message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INodeAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NodeAddress message, length delimited. Does not implicitly {@link lnrpc.NodeAddress.verify|verify} messages.
         * @param message NodeAddress message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INodeAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NodeAddress message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NodeAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NodeAddress;

        /**
         * Decodes a NodeAddress message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NodeAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NodeAddress;

        /**
         * Verifies a NodeAddress message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NodeAddress message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NodeAddress
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NodeAddress;

        /**
         * Creates a plain object from a NodeAddress message. Also converts values to other types if specified.
         * @param message NodeAddress
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NodeAddress, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NodeAddress to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoutingPolicy. */
    interface IRoutingPolicy {

        /** RoutingPolicy timeLockDelta */
        timeLockDelta?: (number|null);

        /** RoutingPolicy minHtlc */
        minHtlc?: (number|Long|null);

        /** RoutingPolicy feeBaseMsat */
        feeBaseMsat?: (number|Long|null);

        /** RoutingPolicy feeRateMilliMsat */
        feeRateMilliMsat?: (number|Long|null);

        /** RoutingPolicy disabled */
        disabled?: (boolean|null);

        /** RoutingPolicy maxHtlcMsat */
        maxHtlcMsat?: (number|Long|null);

        /** RoutingPolicy lastUpdate */
        lastUpdate?: (number|null);
    }

    /** Represents a RoutingPolicy. */
    class RoutingPolicy implements IRoutingPolicy {

        /**
         * Constructs a new RoutingPolicy.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IRoutingPolicy);

        /** RoutingPolicy timeLockDelta. */
        public timeLockDelta: number;

        /** RoutingPolicy minHtlc. */
        public minHtlc: (number|Long);

        /** RoutingPolicy feeBaseMsat. */
        public feeBaseMsat: (number|Long);

        /** RoutingPolicy feeRateMilliMsat. */
        public feeRateMilliMsat: (number|Long);

        /** RoutingPolicy disabled. */
        public disabled: boolean;

        /** RoutingPolicy maxHtlcMsat. */
        public maxHtlcMsat: (number|Long);

        /** RoutingPolicy lastUpdate. */
        public lastUpdate: number;

        /**
         * Creates a new RoutingPolicy instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoutingPolicy instance
         */
        public static create(properties?: lnrpc.IRoutingPolicy): lnrpc.RoutingPolicy;

        /**
         * Encodes the specified RoutingPolicy message. Does not implicitly {@link lnrpc.RoutingPolicy.verify|verify} messages.
         * @param message RoutingPolicy message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IRoutingPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoutingPolicy message, length delimited. Does not implicitly {@link lnrpc.RoutingPolicy.verify|verify} messages.
         * @param message RoutingPolicy message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IRoutingPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoutingPolicy message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoutingPolicy
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.RoutingPolicy;

        /**
         * Decodes a RoutingPolicy message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoutingPolicy
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.RoutingPolicy;

        /**
         * Verifies a RoutingPolicy message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoutingPolicy message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoutingPolicy
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.RoutingPolicy;

        /**
         * Creates a plain object from a RoutingPolicy message. Also converts values to other types if specified.
         * @param message RoutingPolicy
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.RoutingPolicy, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoutingPolicy to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelEdge. */
    interface IChannelEdge {

        /** ChannelEdge channelId */
        channelId?: (number|Long|null);

        /** ChannelEdge chanPoint */
        chanPoint?: (string|null);

        /** ChannelEdge lastUpdate */
        lastUpdate?: (number|null);

        /** ChannelEdge node1Pub */
        node1Pub?: (string|null);

        /** ChannelEdge node2Pub */
        node2Pub?: (string|null);

        /** ChannelEdge capacity */
        capacity?: (number|Long|null);

        /** ChannelEdge node1Policy */
        node1Policy?: (lnrpc.IRoutingPolicy|null);

        /** ChannelEdge node2Policy */
        node2Policy?: (lnrpc.IRoutingPolicy|null);
    }

    /** Represents a ChannelEdge. */
    class ChannelEdge implements IChannelEdge {

        /**
         * Constructs a new ChannelEdge.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelEdge);

        /** ChannelEdge channelId. */
        public channelId: (number|Long);

        /** ChannelEdge chanPoint. */
        public chanPoint: string;

        /** ChannelEdge lastUpdate. */
        public lastUpdate: number;

        /** ChannelEdge node1Pub. */
        public node1Pub: string;

        /** ChannelEdge node2Pub. */
        public node2Pub: string;

        /** ChannelEdge capacity. */
        public capacity: (number|Long);

        /** ChannelEdge node1Policy. */
        public node1Policy?: (lnrpc.IRoutingPolicy|null);

        /** ChannelEdge node2Policy. */
        public node2Policy?: (lnrpc.IRoutingPolicy|null);

        /**
         * Creates a new ChannelEdge instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelEdge instance
         */
        public static create(properties?: lnrpc.IChannelEdge): lnrpc.ChannelEdge;

        /**
         * Encodes the specified ChannelEdge message. Does not implicitly {@link lnrpc.ChannelEdge.verify|verify} messages.
         * @param message ChannelEdge message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelEdge, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelEdge message, length delimited. Does not implicitly {@link lnrpc.ChannelEdge.verify|verify} messages.
         * @param message ChannelEdge message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelEdge, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelEdge message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelEdge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelEdge;

        /**
         * Decodes a ChannelEdge message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelEdge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelEdge;

        /**
         * Verifies a ChannelEdge message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelEdge message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelEdge
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelEdge;

        /**
         * Creates a plain object from a ChannelEdge message. Also converts values to other types if specified.
         * @param message ChannelEdge
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelEdge, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelEdge to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelGraphRequest. */
    interface IChannelGraphRequest {

        /** ChannelGraphRequest includeUnannounced */
        includeUnannounced?: (boolean|null);
    }

    /** Represents a ChannelGraphRequest. */
    class ChannelGraphRequest implements IChannelGraphRequest {

        /**
         * Constructs a new ChannelGraphRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelGraphRequest);

        /** ChannelGraphRequest includeUnannounced. */
        public includeUnannounced: boolean;

        /**
         * Creates a new ChannelGraphRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelGraphRequest instance
         */
        public static create(properties?: lnrpc.IChannelGraphRequest): lnrpc.ChannelGraphRequest;

        /**
         * Encodes the specified ChannelGraphRequest message. Does not implicitly {@link lnrpc.ChannelGraphRequest.verify|verify} messages.
         * @param message ChannelGraphRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelGraphRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelGraphRequest message, length delimited. Does not implicitly {@link lnrpc.ChannelGraphRequest.verify|verify} messages.
         * @param message ChannelGraphRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelGraphRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelGraphRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelGraphRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelGraphRequest;

        /**
         * Decodes a ChannelGraphRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelGraphRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelGraphRequest;

        /**
         * Verifies a ChannelGraphRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelGraphRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelGraphRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelGraphRequest;

        /**
         * Creates a plain object from a ChannelGraphRequest message. Also converts values to other types if specified.
         * @param message ChannelGraphRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelGraphRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelGraphRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelGraph. */
    interface IChannelGraph {

        /** ChannelGraph nodes */
        nodes?: (lnrpc.ILightningNode[]|null);

        /** ChannelGraph edges */
        edges?: (lnrpc.IChannelEdge[]|null);
    }

    /** Represents a ChannelGraph. */
    class ChannelGraph implements IChannelGraph {

        /**
         * Constructs a new ChannelGraph.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelGraph);

        /** ChannelGraph nodes. */
        public nodes: lnrpc.ILightningNode[];

        /** ChannelGraph edges. */
        public edges: lnrpc.IChannelEdge[];

        /**
         * Creates a new ChannelGraph instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelGraph instance
         */
        public static create(properties?: lnrpc.IChannelGraph): lnrpc.ChannelGraph;

        /**
         * Encodes the specified ChannelGraph message. Does not implicitly {@link lnrpc.ChannelGraph.verify|verify} messages.
         * @param message ChannelGraph message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelGraph, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelGraph message, length delimited. Does not implicitly {@link lnrpc.ChannelGraph.verify|verify} messages.
         * @param message ChannelGraph message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelGraph, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelGraph message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelGraph
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelGraph;

        /**
         * Decodes a ChannelGraph message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelGraph
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelGraph;

        /**
         * Verifies a ChannelGraph message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelGraph message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelGraph
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelGraph;

        /**
         * Creates a plain object from a ChannelGraph message. Also converts values to other types if specified.
         * @param message ChannelGraph
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelGraph, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelGraph to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** NodeMetricType enum. */
    enum NodeMetricType {
        UNKNOWN = 0,
        BETWEENNESS_CENTRALITY = 1
    }

    /** Properties of a NodeMetricsRequest. */
    interface INodeMetricsRequest {

        /** NodeMetricsRequest types */
        types?: (lnrpc.NodeMetricType[]|null);
    }

    /** Represents a NodeMetricsRequest. */
    class NodeMetricsRequest implements INodeMetricsRequest {

        /**
         * Constructs a new NodeMetricsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INodeMetricsRequest);

        /** NodeMetricsRequest types. */
        public types: lnrpc.NodeMetricType[];

        /**
         * Creates a new NodeMetricsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NodeMetricsRequest instance
         */
        public static create(properties?: lnrpc.INodeMetricsRequest): lnrpc.NodeMetricsRequest;

        /**
         * Encodes the specified NodeMetricsRequest message. Does not implicitly {@link lnrpc.NodeMetricsRequest.verify|verify} messages.
         * @param message NodeMetricsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INodeMetricsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NodeMetricsRequest message, length delimited. Does not implicitly {@link lnrpc.NodeMetricsRequest.verify|verify} messages.
         * @param message NodeMetricsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INodeMetricsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NodeMetricsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NodeMetricsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NodeMetricsRequest;

        /**
         * Decodes a NodeMetricsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NodeMetricsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NodeMetricsRequest;

        /**
         * Verifies a NodeMetricsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NodeMetricsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NodeMetricsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NodeMetricsRequest;

        /**
         * Creates a plain object from a NodeMetricsRequest message. Also converts values to other types if specified.
         * @param message NodeMetricsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NodeMetricsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NodeMetricsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NodeMetricsResponse. */
    interface INodeMetricsResponse {

        /** NodeMetricsResponse betweennessCentrality */
        betweennessCentrality?: ({ [k: string]: lnrpc.IFloatMetric }|null);
    }

    /** Represents a NodeMetricsResponse. */
    class NodeMetricsResponse implements INodeMetricsResponse {

        /**
         * Constructs a new NodeMetricsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INodeMetricsResponse);

        /** NodeMetricsResponse betweennessCentrality. */
        public betweennessCentrality: { [k: string]: lnrpc.IFloatMetric };

        /**
         * Creates a new NodeMetricsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NodeMetricsResponse instance
         */
        public static create(properties?: lnrpc.INodeMetricsResponse): lnrpc.NodeMetricsResponse;

        /**
         * Encodes the specified NodeMetricsResponse message. Does not implicitly {@link lnrpc.NodeMetricsResponse.verify|verify} messages.
         * @param message NodeMetricsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INodeMetricsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NodeMetricsResponse message, length delimited. Does not implicitly {@link lnrpc.NodeMetricsResponse.verify|verify} messages.
         * @param message NodeMetricsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INodeMetricsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NodeMetricsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NodeMetricsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NodeMetricsResponse;

        /**
         * Decodes a NodeMetricsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NodeMetricsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NodeMetricsResponse;

        /**
         * Verifies a NodeMetricsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NodeMetricsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NodeMetricsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NodeMetricsResponse;

        /**
         * Creates a plain object from a NodeMetricsResponse message. Also converts values to other types if specified.
         * @param message NodeMetricsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NodeMetricsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NodeMetricsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FloatMetric. */
    interface IFloatMetric {

        /** FloatMetric value */
        value?: (number|null);

        /** FloatMetric normalizedValue */
        normalizedValue?: (number|null);
    }

    /** Represents a FloatMetric. */
    class FloatMetric implements IFloatMetric {

        /**
         * Constructs a new FloatMetric.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFloatMetric);

        /** FloatMetric value. */
        public value: number;

        /** FloatMetric normalizedValue. */
        public normalizedValue: number;

        /**
         * Creates a new FloatMetric instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FloatMetric instance
         */
        public static create(properties?: lnrpc.IFloatMetric): lnrpc.FloatMetric;

        /**
         * Encodes the specified FloatMetric message. Does not implicitly {@link lnrpc.FloatMetric.verify|verify} messages.
         * @param message FloatMetric message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFloatMetric, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FloatMetric message, length delimited. Does not implicitly {@link lnrpc.FloatMetric.verify|verify} messages.
         * @param message FloatMetric message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFloatMetric, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FloatMetric message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FloatMetric
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FloatMetric;

        /**
         * Decodes a FloatMetric message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FloatMetric
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FloatMetric;

        /**
         * Verifies a FloatMetric message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FloatMetric message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FloatMetric
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FloatMetric;

        /**
         * Creates a plain object from a FloatMetric message. Also converts values to other types if specified.
         * @param message FloatMetric
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FloatMetric, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FloatMetric to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChanInfoRequest. */
    interface IChanInfoRequest {

        /** ChanInfoRequest chanId */
        chanId?: (number|Long|null);
    }

    /** Represents a ChanInfoRequest. */
    class ChanInfoRequest implements IChanInfoRequest {

        /**
         * Constructs a new ChanInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChanInfoRequest);

        /** ChanInfoRequest chanId. */
        public chanId: (number|Long);

        /**
         * Creates a new ChanInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChanInfoRequest instance
         */
        public static create(properties?: lnrpc.IChanInfoRequest): lnrpc.ChanInfoRequest;

        /**
         * Encodes the specified ChanInfoRequest message. Does not implicitly {@link lnrpc.ChanInfoRequest.verify|verify} messages.
         * @param message ChanInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChanInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChanInfoRequest message, length delimited. Does not implicitly {@link lnrpc.ChanInfoRequest.verify|verify} messages.
         * @param message ChanInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChanInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChanInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChanInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChanInfoRequest;

        /**
         * Decodes a ChanInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChanInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChanInfoRequest;

        /**
         * Verifies a ChanInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChanInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChanInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChanInfoRequest;

        /**
         * Creates a plain object from a ChanInfoRequest message. Also converts values to other types if specified.
         * @param message ChanInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChanInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChanInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NetworkInfoRequest. */
    interface INetworkInfoRequest {
    }

    /** Represents a NetworkInfoRequest. */
    class NetworkInfoRequest implements INetworkInfoRequest {

        /**
         * Constructs a new NetworkInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INetworkInfoRequest);

        /**
         * Creates a new NetworkInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NetworkInfoRequest instance
         */
        public static create(properties?: lnrpc.INetworkInfoRequest): lnrpc.NetworkInfoRequest;

        /**
         * Encodes the specified NetworkInfoRequest message. Does not implicitly {@link lnrpc.NetworkInfoRequest.verify|verify} messages.
         * @param message NetworkInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INetworkInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NetworkInfoRequest message, length delimited. Does not implicitly {@link lnrpc.NetworkInfoRequest.verify|verify} messages.
         * @param message NetworkInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INetworkInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NetworkInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NetworkInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NetworkInfoRequest;

        /**
         * Decodes a NetworkInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NetworkInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NetworkInfoRequest;

        /**
         * Verifies a NetworkInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NetworkInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NetworkInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NetworkInfoRequest;

        /**
         * Creates a plain object from a NetworkInfoRequest message. Also converts values to other types if specified.
         * @param message NetworkInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NetworkInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NetworkInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NetworkInfo. */
    interface INetworkInfo {

        /** NetworkInfo graphDiameter */
        graphDiameter?: (number|null);

        /** NetworkInfo avgOutDegree */
        avgOutDegree?: (number|null);

        /** NetworkInfo maxOutDegree */
        maxOutDegree?: (number|null);

        /** NetworkInfo numNodes */
        numNodes?: (number|null);

        /** NetworkInfo numChannels */
        numChannels?: (number|null);

        /** NetworkInfo totalNetworkCapacity */
        totalNetworkCapacity?: (number|Long|null);

        /** NetworkInfo avgChannelSize */
        avgChannelSize?: (number|null);

        /** NetworkInfo minChannelSize */
        minChannelSize?: (number|Long|null);

        /** NetworkInfo maxChannelSize */
        maxChannelSize?: (number|Long|null);

        /** NetworkInfo medianChannelSizeSat */
        medianChannelSizeSat?: (number|Long|null);

        /** NetworkInfo numZombieChans */
        numZombieChans?: (number|Long|null);
    }

    /** Represents a NetworkInfo. */
    class NetworkInfo implements INetworkInfo {

        /**
         * Constructs a new NetworkInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INetworkInfo);

        /** NetworkInfo graphDiameter. */
        public graphDiameter: number;

        /** NetworkInfo avgOutDegree. */
        public avgOutDegree: number;

        /** NetworkInfo maxOutDegree. */
        public maxOutDegree: number;

        /** NetworkInfo numNodes. */
        public numNodes: number;

        /** NetworkInfo numChannels. */
        public numChannels: number;

        /** NetworkInfo totalNetworkCapacity. */
        public totalNetworkCapacity: (number|Long);

        /** NetworkInfo avgChannelSize. */
        public avgChannelSize: number;

        /** NetworkInfo minChannelSize. */
        public minChannelSize: (number|Long);

        /** NetworkInfo maxChannelSize. */
        public maxChannelSize: (number|Long);

        /** NetworkInfo medianChannelSizeSat. */
        public medianChannelSizeSat: (number|Long);

        /** NetworkInfo numZombieChans. */
        public numZombieChans: (number|Long);

        /**
         * Creates a new NetworkInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NetworkInfo instance
         */
        public static create(properties?: lnrpc.INetworkInfo): lnrpc.NetworkInfo;

        /**
         * Encodes the specified NetworkInfo message. Does not implicitly {@link lnrpc.NetworkInfo.verify|verify} messages.
         * @param message NetworkInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INetworkInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NetworkInfo message, length delimited. Does not implicitly {@link lnrpc.NetworkInfo.verify|verify} messages.
         * @param message NetworkInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INetworkInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NetworkInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NetworkInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NetworkInfo;

        /**
         * Decodes a NetworkInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NetworkInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NetworkInfo;

        /**
         * Verifies a NetworkInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NetworkInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NetworkInfo
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NetworkInfo;

        /**
         * Creates a plain object from a NetworkInfo message. Also converts values to other types if specified.
         * @param message NetworkInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NetworkInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NetworkInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StopRequest. */
    interface IStopRequest {
    }

    /** Represents a StopRequest. */
    class StopRequest implements IStopRequest {

        /**
         * Constructs a new StopRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IStopRequest);

        /**
         * Creates a new StopRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StopRequest instance
         */
        public static create(properties?: lnrpc.IStopRequest): lnrpc.StopRequest;

        /**
         * Encodes the specified StopRequest message. Does not implicitly {@link lnrpc.StopRequest.verify|verify} messages.
         * @param message StopRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IStopRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StopRequest message, length delimited. Does not implicitly {@link lnrpc.StopRequest.verify|verify} messages.
         * @param message StopRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IStopRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StopRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StopRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.StopRequest;

        /**
         * Decodes a StopRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StopRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.StopRequest;

        /**
         * Verifies a StopRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StopRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StopRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.StopRequest;

        /**
         * Creates a plain object from a StopRequest message. Also converts values to other types if specified.
         * @param message StopRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.StopRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StopRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StopResponse. */
    interface IStopResponse {
    }

    /** Represents a StopResponse. */
    class StopResponse implements IStopResponse {

        /**
         * Constructs a new StopResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IStopResponse);

        /**
         * Creates a new StopResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StopResponse instance
         */
        public static create(properties?: lnrpc.IStopResponse): lnrpc.StopResponse;

        /**
         * Encodes the specified StopResponse message. Does not implicitly {@link lnrpc.StopResponse.verify|verify} messages.
         * @param message StopResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IStopResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StopResponse message, length delimited. Does not implicitly {@link lnrpc.StopResponse.verify|verify} messages.
         * @param message StopResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IStopResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StopResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StopResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.StopResponse;

        /**
         * Decodes a StopResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StopResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.StopResponse;

        /**
         * Verifies a StopResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StopResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StopResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.StopResponse;

        /**
         * Creates a plain object from a StopResponse message. Also converts values to other types if specified.
         * @param message StopResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.StopResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StopResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GraphTopologySubscription. */
    interface IGraphTopologySubscription {
    }

    /** Represents a GraphTopologySubscription. */
    class GraphTopologySubscription implements IGraphTopologySubscription {

        /**
         * Constructs a new GraphTopologySubscription.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IGraphTopologySubscription);

        /**
         * Creates a new GraphTopologySubscription instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GraphTopologySubscription instance
         */
        public static create(properties?: lnrpc.IGraphTopologySubscription): lnrpc.GraphTopologySubscription;

        /**
         * Encodes the specified GraphTopologySubscription message. Does not implicitly {@link lnrpc.GraphTopologySubscription.verify|verify} messages.
         * @param message GraphTopologySubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IGraphTopologySubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GraphTopologySubscription message, length delimited. Does not implicitly {@link lnrpc.GraphTopologySubscription.verify|verify} messages.
         * @param message GraphTopologySubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IGraphTopologySubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GraphTopologySubscription message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GraphTopologySubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.GraphTopologySubscription;

        /**
         * Decodes a GraphTopologySubscription message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GraphTopologySubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.GraphTopologySubscription;

        /**
         * Verifies a GraphTopologySubscription message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GraphTopologySubscription message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GraphTopologySubscription
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.GraphTopologySubscription;

        /**
         * Creates a plain object from a GraphTopologySubscription message. Also converts values to other types if specified.
         * @param message GraphTopologySubscription
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.GraphTopologySubscription, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GraphTopologySubscription to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GraphTopologyUpdate. */
    interface IGraphTopologyUpdate {

        /** GraphTopologyUpdate nodeUpdates */
        nodeUpdates?: (lnrpc.INodeUpdate[]|null);

        /** GraphTopologyUpdate channelUpdates */
        channelUpdates?: (lnrpc.IChannelEdgeUpdate[]|null);

        /** GraphTopologyUpdate closedChans */
        closedChans?: (lnrpc.IClosedChannelUpdate[]|null);
    }

    /** Represents a GraphTopologyUpdate. */
    class GraphTopologyUpdate implements IGraphTopologyUpdate {

        /**
         * Constructs a new GraphTopologyUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IGraphTopologyUpdate);

        /** GraphTopologyUpdate nodeUpdates. */
        public nodeUpdates: lnrpc.INodeUpdate[];

        /** GraphTopologyUpdate channelUpdates. */
        public channelUpdates: lnrpc.IChannelEdgeUpdate[];

        /** GraphTopologyUpdate closedChans. */
        public closedChans: lnrpc.IClosedChannelUpdate[];

        /**
         * Creates a new GraphTopologyUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GraphTopologyUpdate instance
         */
        public static create(properties?: lnrpc.IGraphTopologyUpdate): lnrpc.GraphTopologyUpdate;

        /**
         * Encodes the specified GraphTopologyUpdate message. Does not implicitly {@link lnrpc.GraphTopologyUpdate.verify|verify} messages.
         * @param message GraphTopologyUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IGraphTopologyUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GraphTopologyUpdate message, length delimited. Does not implicitly {@link lnrpc.GraphTopologyUpdate.verify|verify} messages.
         * @param message GraphTopologyUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IGraphTopologyUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GraphTopologyUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GraphTopologyUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.GraphTopologyUpdate;

        /**
         * Decodes a GraphTopologyUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GraphTopologyUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.GraphTopologyUpdate;

        /**
         * Verifies a GraphTopologyUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GraphTopologyUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GraphTopologyUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.GraphTopologyUpdate;

        /**
         * Creates a plain object from a GraphTopologyUpdate message. Also converts values to other types if specified.
         * @param message GraphTopologyUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.GraphTopologyUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GraphTopologyUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NodeUpdate. */
    interface INodeUpdate {

        /** NodeUpdate addresses */
        addresses?: (string[]|null);

        /** NodeUpdate identityKey */
        identityKey?: (string|null);

        /** NodeUpdate globalFeatures */
        globalFeatures?: (Uint8Array|null);

        /** NodeUpdate alias */
        alias?: (string|null);

        /** NodeUpdate color */
        color?: (string|null);
    }

    /** Represents a NodeUpdate. */
    class NodeUpdate implements INodeUpdate {

        /**
         * Constructs a new NodeUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.INodeUpdate);

        /** NodeUpdate addresses. */
        public addresses: string[];

        /** NodeUpdate identityKey. */
        public identityKey: string;

        /** NodeUpdate globalFeatures. */
        public globalFeatures: Uint8Array;

        /** NodeUpdate alias. */
        public alias: string;

        /** NodeUpdate color. */
        public color: string;

        /**
         * Creates a new NodeUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NodeUpdate instance
         */
        public static create(properties?: lnrpc.INodeUpdate): lnrpc.NodeUpdate;

        /**
         * Encodes the specified NodeUpdate message. Does not implicitly {@link lnrpc.NodeUpdate.verify|verify} messages.
         * @param message NodeUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.INodeUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NodeUpdate message, length delimited. Does not implicitly {@link lnrpc.NodeUpdate.verify|verify} messages.
         * @param message NodeUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.INodeUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NodeUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NodeUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.NodeUpdate;

        /**
         * Decodes a NodeUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NodeUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.NodeUpdate;

        /**
         * Verifies a NodeUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NodeUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NodeUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.NodeUpdate;

        /**
         * Creates a plain object from a NodeUpdate message. Also converts values to other types if specified.
         * @param message NodeUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.NodeUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NodeUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelEdgeUpdate. */
    interface IChannelEdgeUpdate {

        /** ChannelEdgeUpdate chanId */
        chanId?: (number|Long|null);

        /** ChannelEdgeUpdate chanPoint */
        chanPoint?: (lnrpc.IChannelPoint|null);

        /** ChannelEdgeUpdate capacity */
        capacity?: (number|Long|null);

        /** ChannelEdgeUpdate routingPolicy */
        routingPolicy?: (lnrpc.IRoutingPolicy|null);

        /** ChannelEdgeUpdate advertisingNode */
        advertisingNode?: (string|null);

        /** ChannelEdgeUpdate connectingNode */
        connectingNode?: (string|null);
    }

    /** Represents a ChannelEdgeUpdate. */
    class ChannelEdgeUpdate implements IChannelEdgeUpdate {

        /**
         * Constructs a new ChannelEdgeUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelEdgeUpdate);

        /** ChannelEdgeUpdate chanId. */
        public chanId: (number|Long);

        /** ChannelEdgeUpdate chanPoint. */
        public chanPoint?: (lnrpc.IChannelPoint|null);

        /** ChannelEdgeUpdate capacity. */
        public capacity: (number|Long);

        /** ChannelEdgeUpdate routingPolicy. */
        public routingPolicy?: (lnrpc.IRoutingPolicy|null);

        /** ChannelEdgeUpdate advertisingNode. */
        public advertisingNode: string;

        /** ChannelEdgeUpdate connectingNode. */
        public connectingNode: string;

        /**
         * Creates a new ChannelEdgeUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelEdgeUpdate instance
         */
        public static create(properties?: lnrpc.IChannelEdgeUpdate): lnrpc.ChannelEdgeUpdate;

        /**
         * Encodes the specified ChannelEdgeUpdate message. Does not implicitly {@link lnrpc.ChannelEdgeUpdate.verify|verify} messages.
         * @param message ChannelEdgeUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelEdgeUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelEdgeUpdate message, length delimited. Does not implicitly {@link lnrpc.ChannelEdgeUpdate.verify|verify} messages.
         * @param message ChannelEdgeUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelEdgeUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelEdgeUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelEdgeUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelEdgeUpdate;

        /**
         * Decodes a ChannelEdgeUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelEdgeUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelEdgeUpdate;

        /**
         * Verifies a ChannelEdgeUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelEdgeUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelEdgeUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelEdgeUpdate;

        /**
         * Creates a plain object from a ChannelEdgeUpdate message. Also converts values to other types if specified.
         * @param message ChannelEdgeUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelEdgeUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelEdgeUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ClosedChannelUpdate. */
    interface IClosedChannelUpdate {

        /** ClosedChannelUpdate chanId */
        chanId?: (number|Long|null);

        /** ClosedChannelUpdate capacity */
        capacity?: (number|Long|null);

        /** ClosedChannelUpdate closedHeight */
        closedHeight?: (number|null);

        /** ClosedChannelUpdate chanPoint */
        chanPoint?: (lnrpc.IChannelPoint|null);
    }

    /** Represents a ClosedChannelUpdate. */
    class ClosedChannelUpdate implements IClosedChannelUpdate {

        /**
         * Constructs a new ClosedChannelUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IClosedChannelUpdate);

        /** ClosedChannelUpdate chanId. */
        public chanId: (number|Long);

        /** ClosedChannelUpdate capacity. */
        public capacity: (number|Long);

        /** ClosedChannelUpdate closedHeight. */
        public closedHeight: number;

        /** ClosedChannelUpdate chanPoint. */
        public chanPoint?: (lnrpc.IChannelPoint|null);

        /**
         * Creates a new ClosedChannelUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClosedChannelUpdate instance
         */
        public static create(properties?: lnrpc.IClosedChannelUpdate): lnrpc.ClosedChannelUpdate;

        /**
         * Encodes the specified ClosedChannelUpdate message. Does not implicitly {@link lnrpc.ClosedChannelUpdate.verify|verify} messages.
         * @param message ClosedChannelUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IClosedChannelUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClosedChannelUpdate message, length delimited. Does not implicitly {@link lnrpc.ClosedChannelUpdate.verify|verify} messages.
         * @param message ClosedChannelUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IClosedChannelUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClosedChannelUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClosedChannelUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ClosedChannelUpdate;

        /**
         * Decodes a ClosedChannelUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClosedChannelUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ClosedChannelUpdate;

        /**
         * Verifies a ClosedChannelUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClosedChannelUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClosedChannelUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ClosedChannelUpdate;

        /**
         * Creates a plain object from a ClosedChannelUpdate message. Also converts values to other types if specified.
         * @param message ClosedChannelUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ClosedChannelUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClosedChannelUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HopHint. */
    interface IHopHint {

        /** HopHint nodeId */
        nodeId?: (string|null);

        /** HopHint chanId */
        chanId?: (number|Long|null);

        /** HopHint feeBaseMsat */
        feeBaseMsat?: (number|null);

        /** HopHint feeProportionalMillionths */
        feeProportionalMillionths?: (number|null);

        /** HopHint cltvExpiryDelta */
        cltvExpiryDelta?: (number|null);
    }

    /** Represents a HopHint. */
    class HopHint implements IHopHint {

        /**
         * Constructs a new HopHint.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IHopHint);

        /** HopHint nodeId. */
        public nodeId: string;

        /** HopHint chanId. */
        public chanId: (number|Long);

        /** HopHint feeBaseMsat. */
        public feeBaseMsat: number;

        /** HopHint feeProportionalMillionths. */
        public feeProportionalMillionths: number;

        /** HopHint cltvExpiryDelta. */
        public cltvExpiryDelta: number;

        /**
         * Creates a new HopHint instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HopHint instance
         */
        public static create(properties?: lnrpc.IHopHint): lnrpc.HopHint;

        /**
         * Encodes the specified HopHint message. Does not implicitly {@link lnrpc.HopHint.verify|verify} messages.
         * @param message HopHint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IHopHint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HopHint message, length delimited. Does not implicitly {@link lnrpc.HopHint.verify|verify} messages.
         * @param message HopHint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IHopHint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HopHint message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HopHint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.HopHint;

        /**
         * Decodes a HopHint message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HopHint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.HopHint;

        /**
         * Verifies a HopHint message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HopHint message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HopHint
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.HopHint;

        /**
         * Creates a plain object from a HopHint message. Also converts values to other types if specified.
         * @param message HopHint
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.HopHint, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HopHint to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RouteHint. */
    interface IRouteHint {

        /** RouteHint hopHints */
        hopHints?: (lnrpc.IHopHint[]|null);
    }

    /** Represents a RouteHint. */
    class RouteHint implements IRouteHint {

        /**
         * Constructs a new RouteHint.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IRouteHint);

        /** RouteHint hopHints. */
        public hopHints: lnrpc.IHopHint[];

        /**
         * Creates a new RouteHint instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RouteHint instance
         */
        public static create(properties?: lnrpc.IRouteHint): lnrpc.RouteHint;

        /**
         * Encodes the specified RouteHint message. Does not implicitly {@link lnrpc.RouteHint.verify|verify} messages.
         * @param message RouteHint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IRouteHint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RouteHint message, length delimited. Does not implicitly {@link lnrpc.RouteHint.verify|verify} messages.
         * @param message RouteHint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IRouteHint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RouteHint message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RouteHint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.RouteHint;

        /**
         * Decodes a RouteHint message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RouteHint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.RouteHint;

        /**
         * Verifies a RouteHint message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RouteHint message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RouteHint
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.RouteHint;

        /**
         * Creates a plain object from a RouteHint message. Also converts values to other types if specified.
         * @param message RouteHint
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.RouteHint, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RouteHint to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Invoice. */
    interface IInvoice {

        /** Invoice memo */
        memo?: (string|null);

        /** Invoice rPreimage */
        rPreimage?: (Uint8Array|null);

        /** Invoice rHash */
        rHash?: (Uint8Array|null);

        /** Invoice value */
        value?: (number|Long|null);

        /** Invoice valueMsat */
        valueMsat?: (number|Long|null);

        /** Invoice settled */
        settled?: (boolean|null);

        /** Invoice creationDate */
        creationDate?: (number|Long|null);

        /** Invoice settleDate */
        settleDate?: (number|Long|null);

        /** Invoice paymentRequest */
        paymentRequest?: (string|null);

        /** Invoice descriptionHash */
        descriptionHash?: (Uint8Array|null);

        /** Invoice expiry */
        expiry?: (number|Long|null);

        /** Invoice fallbackAddr */
        fallbackAddr?: (string|null);

        /** Invoice cltvExpiry */
        cltvExpiry?: (number|Long|null);

        /** Invoice routeHints */
        routeHints?: (lnrpc.IRouteHint[]|null);

        /** Invoice private */
        "private"?: (boolean|null);

        /** Invoice addIndex */
        addIndex?: (number|Long|null);

        /** Invoice settleIndex */
        settleIndex?: (number|Long|null);

        /** Invoice amtPaid */
        amtPaid?: (number|Long|null);

        /** Invoice amtPaidSat */
        amtPaidSat?: (number|Long|null);

        /** Invoice amtPaidMsat */
        amtPaidMsat?: (number|Long|null);

        /** Invoice state */
        state?: (lnrpc.Invoice.InvoiceState|null);

        /** Invoice htlcs */
        htlcs?: (lnrpc.IInvoiceHTLC[]|null);

        /** Invoice features */
        features?: ({ [k: string]: lnrpc.IFeature }|null);

        /** Invoice isKeysend */
        isKeysend?: (boolean|null);
    }

    /** Represents an Invoice. */
    class Invoice implements IInvoice {

        /**
         * Constructs a new Invoice.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IInvoice);

        /** Invoice memo. */
        public memo: string;

        /** Invoice rPreimage. */
        public rPreimage: Uint8Array;

        /** Invoice rHash. */
        public rHash: Uint8Array;

        /** Invoice value. */
        public value: (number|Long);

        /** Invoice valueMsat. */
        public valueMsat: (number|Long);

        /** Invoice settled. */
        public settled: boolean;

        /** Invoice creationDate. */
        public creationDate: (number|Long);

        /** Invoice settleDate. */
        public settleDate: (number|Long);

        /** Invoice paymentRequest. */
        public paymentRequest: string;

        /** Invoice descriptionHash. */
        public descriptionHash: Uint8Array;

        /** Invoice expiry. */
        public expiry: (number|Long);

        /** Invoice fallbackAddr. */
        public fallbackAddr: string;

        /** Invoice cltvExpiry. */
        public cltvExpiry: (number|Long);

        /** Invoice routeHints. */
        public routeHints: lnrpc.IRouteHint[];

        /** Invoice private. */
        public private: boolean;

        /** Invoice addIndex. */
        public addIndex: (number|Long);

        /** Invoice settleIndex. */
        public settleIndex: (number|Long);

        /** Invoice amtPaid. */
        public amtPaid: (number|Long);

        /** Invoice amtPaidSat. */
        public amtPaidSat: (number|Long);

        /** Invoice amtPaidMsat. */
        public amtPaidMsat: (number|Long);

        /** Invoice state. */
        public state: lnrpc.Invoice.InvoiceState;

        /** Invoice htlcs. */
        public htlcs: lnrpc.IInvoiceHTLC[];

        /** Invoice features. */
        public features: { [k: string]: lnrpc.IFeature };

        /** Invoice isKeysend. */
        public isKeysend: boolean;

        /**
         * Creates a new Invoice instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Invoice instance
         */
        public static create(properties?: lnrpc.IInvoice): lnrpc.Invoice;

        /**
         * Encodes the specified Invoice message. Does not implicitly {@link lnrpc.Invoice.verify|verify} messages.
         * @param message Invoice message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IInvoice, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Invoice message, length delimited. Does not implicitly {@link lnrpc.Invoice.verify|verify} messages.
         * @param message Invoice message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IInvoice, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Invoice message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Invoice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Invoice;

        /**
         * Decodes an Invoice message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Invoice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Invoice;

        /**
         * Verifies an Invoice message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Invoice message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Invoice
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Invoice;

        /**
         * Creates a plain object from an Invoice message. Also converts values to other types if specified.
         * @param message Invoice
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Invoice, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Invoice to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Invoice {

        /** InvoiceState enum. */
        enum InvoiceState {
            OPEN = 0,
            SETTLED = 1,
            CANCELED = 2,
            ACCEPTED = 3
        }
    }

    /** InvoiceHTLCState enum. */
    enum InvoiceHTLCState {
        ACCEPTED = 0,
        SETTLED = 1,
        CANCELED = 2
    }

    /** Properties of an InvoiceHTLC. */
    interface IInvoiceHTLC {

        /** InvoiceHTLC chanId */
        chanId?: (number|Long|null);

        /** InvoiceHTLC htlcIndex */
        htlcIndex?: (number|Long|null);

        /** InvoiceHTLC amtMsat */
        amtMsat?: (number|Long|null);

        /** InvoiceHTLC acceptHeight */
        acceptHeight?: (number|null);

        /** InvoiceHTLC acceptTime */
        acceptTime?: (number|Long|null);

        /** InvoiceHTLC resolveTime */
        resolveTime?: (number|Long|null);

        /** InvoiceHTLC expiryHeight */
        expiryHeight?: (number|null);

        /** InvoiceHTLC state */
        state?: (lnrpc.InvoiceHTLCState|null);

        /** InvoiceHTLC customRecords */
        customRecords?: ({ [k: string]: Uint8Array }|null);

        /** InvoiceHTLC mppTotalAmtMsat */
        mppTotalAmtMsat?: (number|Long|null);
    }

    /** Represents an InvoiceHTLC. */
    class InvoiceHTLC implements IInvoiceHTLC {

        /**
         * Constructs a new InvoiceHTLC.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IInvoiceHTLC);

        /** InvoiceHTLC chanId. */
        public chanId: (number|Long);

        /** InvoiceHTLC htlcIndex. */
        public htlcIndex: (number|Long);

        /** InvoiceHTLC amtMsat. */
        public amtMsat: (number|Long);

        /** InvoiceHTLC acceptHeight. */
        public acceptHeight: number;

        /** InvoiceHTLC acceptTime. */
        public acceptTime: (number|Long);

        /** InvoiceHTLC resolveTime. */
        public resolveTime: (number|Long);

        /** InvoiceHTLC expiryHeight. */
        public expiryHeight: number;

        /** InvoiceHTLC state. */
        public state: lnrpc.InvoiceHTLCState;

        /** InvoiceHTLC customRecords. */
        public customRecords: { [k: string]: Uint8Array };

        /** InvoiceHTLC mppTotalAmtMsat. */
        public mppTotalAmtMsat: (number|Long);

        /**
         * Creates a new InvoiceHTLC instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InvoiceHTLC instance
         */
        public static create(properties?: lnrpc.IInvoiceHTLC): lnrpc.InvoiceHTLC;

        /**
         * Encodes the specified InvoiceHTLC message. Does not implicitly {@link lnrpc.InvoiceHTLC.verify|verify} messages.
         * @param message InvoiceHTLC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IInvoiceHTLC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InvoiceHTLC message, length delimited. Does not implicitly {@link lnrpc.InvoiceHTLC.verify|verify} messages.
         * @param message InvoiceHTLC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IInvoiceHTLC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InvoiceHTLC message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InvoiceHTLC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.InvoiceHTLC;

        /**
         * Decodes an InvoiceHTLC message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InvoiceHTLC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.InvoiceHTLC;

        /**
         * Verifies an InvoiceHTLC message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InvoiceHTLC message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InvoiceHTLC
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.InvoiceHTLC;

        /**
         * Creates a plain object from an InvoiceHTLC message. Also converts values to other types if specified.
         * @param message InvoiceHTLC
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.InvoiceHTLC, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InvoiceHTLC to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddInvoiceResponse. */
    interface IAddInvoiceResponse {

        /** AddInvoiceResponse rHash */
        rHash?: (Uint8Array|null);

        /** AddInvoiceResponse paymentRequest */
        paymentRequest?: (string|null);

        /** AddInvoiceResponse addIndex */
        addIndex?: (number|Long|null);
    }

    /** Represents an AddInvoiceResponse. */
    class AddInvoiceResponse implements IAddInvoiceResponse {

        /**
         * Constructs a new AddInvoiceResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IAddInvoiceResponse);

        /** AddInvoiceResponse rHash. */
        public rHash: Uint8Array;

        /** AddInvoiceResponse paymentRequest. */
        public paymentRequest: string;

        /** AddInvoiceResponse addIndex. */
        public addIndex: (number|Long);

        /**
         * Creates a new AddInvoiceResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddInvoiceResponse instance
         */
        public static create(properties?: lnrpc.IAddInvoiceResponse): lnrpc.AddInvoiceResponse;

        /**
         * Encodes the specified AddInvoiceResponse message. Does not implicitly {@link lnrpc.AddInvoiceResponse.verify|verify} messages.
         * @param message AddInvoiceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IAddInvoiceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddInvoiceResponse message, length delimited. Does not implicitly {@link lnrpc.AddInvoiceResponse.verify|verify} messages.
         * @param message AddInvoiceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IAddInvoiceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddInvoiceResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddInvoiceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.AddInvoiceResponse;

        /**
         * Decodes an AddInvoiceResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddInvoiceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.AddInvoiceResponse;

        /**
         * Verifies an AddInvoiceResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddInvoiceResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddInvoiceResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.AddInvoiceResponse;

        /**
         * Creates a plain object from an AddInvoiceResponse message. Also converts values to other types if specified.
         * @param message AddInvoiceResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.AddInvoiceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddInvoiceResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PaymentHash. */
    interface IPaymentHash {

        /** PaymentHash rHashStr */
        rHashStr?: (string|null);

        /** PaymentHash rHash */
        rHash?: (Uint8Array|null);
    }

    /** Represents a PaymentHash. */
    class PaymentHash implements IPaymentHash {

        /**
         * Constructs a new PaymentHash.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPaymentHash);

        /** PaymentHash rHashStr. */
        public rHashStr: string;

        /** PaymentHash rHash. */
        public rHash: Uint8Array;

        /**
         * Creates a new PaymentHash instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PaymentHash instance
         */
        public static create(properties?: lnrpc.IPaymentHash): lnrpc.PaymentHash;

        /**
         * Encodes the specified PaymentHash message. Does not implicitly {@link lnrpc.PaymentHash.verify|verify} messages.
         * @param message PaymentHash message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPaymentHash, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PaymentHash message, length delimited. Does not implicitly {@link lnrpc.PaymentHash.verify|verify} messages.
         * @param message PaymentHash message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPaymentHash, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PaymentHash message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PaymentHash
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PaymentHash;

        /**
         * Decodes a PaymentHash message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PaymentHash
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PaymentHash;

        /**
         * Verifies a PaymentHash message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PaymentHash message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PaymentHash
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PaymentHash;

        /**
         * Creates a plain object from a PaymentHash message. Also converts values to other types if specified.
         * @param message PaymentHash
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PaymentHash, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PaymentHash to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListInvoiceRequest. */
    interface IListInvoiceRequest {

        /** ListInvoiceRequest pendingOnly */
        pendingOnly?: (boolean|null);

        /** ListInvoiceRequest indexOffset */
        indexOffset?: (number|Long|null);

        /** ListInvoiceRequest numMaxInvoices */
        numMaxInvoices?: (number|Long|null);

        /** ListInvoiceRequest reversed */
        reversed?: (boolean|null);
    }

    /** Represents a ListInvoiceRequest. */
    class ListInvoiceRequest implements IListInvoiceRequest {

        /**
         * Constructs a new ListInvoiceRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListInvoiceRequest);

        /** ListInvoiceRequest pendingOnly. */
        public pendingOnly: boolean;

        /** ListInvoiceRequest indexOffset. */
        public indexOffset: (number|Long);

        /** ListInvoiceRequest numMaxInvoices. */
        public numMaxInvoices: (number|Long);

        /** ListInvoiceRequest reversed. */
        public reversed: boolean;

        /**
         * Creates a new ListInvoiceRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListInvoiceRequest instance
         */
        public static create(properties?: lnrpc.IListInvoiceRequest): lnrpc.ListInvoiceRequest;

        /**
         * Encodes the specified ListInvoiceRequest message. Does not implicitly {@link lnrpc.ListInvoiceRequest.verify|verify} messages.
         * @param message ListInvoiceRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListInvoiceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListInvoiceRequest message, length delimited. Does not implicitly {@link lnrpc.ListInvoiceRequest.verify|verify} messages.
         * @param message ListInvoiceRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListInvoiceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListInvoiceRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListInvoiceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListInvoiceRequest;

        /**
         * Decodes a ListInvoiceRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListInvoiceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListInvoiceRequest;

        /**
         * Verifies a ListInvoiceRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListInvoiceRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListInvoiceRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListInvoiceRequest;

        /**
         * Creates a plain object from a ListInvoiceRequest message. Also converts values to other types if specified.
         * @param message ListInvoiceRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListInvoiceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListInvoiceRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListInvoiceResponse. */
    interface IListInvoiceResponse {

        /** ListInvoiceResponse invoices */
        invoices?: (lnrpc.IInvoice[]|null);

        /** ListInvoiceResponse lastIndexOffset */
        lastIndexOffset?: (number|Long|null);

        /** ListInvoiceResponse firstIndexOffset */
        firstIndexOffset?: (number|Long|null);
    }

    /** Represents a ListInvoiceResponse. */
    class ListInvoiceResponse implements IListInvoiceResponse {

        /**
         * Constructs a new ListInvoiceResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListInvoiceResponse);

        /** ListInvoiceResponse invoices. */
        public invoices: lnrpc.IInvoice[];

        /** ListInvoiceResponse lastIndexOffset. */
        public lastIndexOffset: (number|Long);

        /** ListInvoiceResponse firstIndexOffset. */
        public firstIndexOffset: (number|Long);

        /**
         * Creates a new ListInvoiceResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListInvoiceResponse instance
         */
        public static create(properties?: lnrpc.IListInvoiceResponse): lnrpc.ListInvoiceResponse;

        /**
         * Encodes the specified ListInvoiceResponse message. Does not implicitly {@link lnrpc.ListInvoiceResponse.verify|verify} messages.
         * @param message ListInvoiceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListInvoiceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListInvoiceResponse message, length delimited. Does not implicitly {@link lnrpc.ListInvoiceResponse.verify|verify} messages.
         * @param message ListInvoiceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListInvoiceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListInvoiceResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListInvoiceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListInvoiceResponse;

        /**
         * Decodes a ListInvoiceResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListInvoiceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListInvoiceResponse;

        /**
         * Verifies a ListInvoiceResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListInvoiceResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListInvoiceResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListInvoiceResponse;

        /**
         * Creates a plain object from a ListInvoiceResponse message. Also converts values to other types if specified.
         * @param message ListInvoiceResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListInvoiceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListInvoiceResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InvoiceSubscription. */
    interface IInvoiceSubscription {

        /** InvoiceSubscription addIndex */
        addIndex?: (number|Long|null);

        /** InvoiceSubscription settleIndex */
        settleIndex?: (number|Long|null);
    }

    /** Represents an InvoiceSubscription. */
    class InvoiceSubscription implements IInvoiceSubscription {

        /**
         * Constructs a new InvoiceSubscription.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IInvoiceSubscription);

        /** InvoiceSubscription addIndex. */
        public addIndex: (number|Long);

        /** InvoiceSubscription settleIndex. */
        public settleIndex: (number|Long);

        /**
         * Creates a new InvoiceSubscription instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InvoiceSubscription instance
         */
        public static create(properties?: lnrpc.IInvoiceSubscription): lnrpc.InvoiceSubscription;

        /**
         * Encodes the specified InvoiceSubscription message. Does not implicitly {@link lnrpc.InvoiceSubscription.verify|verify} messages.
         * @param message InvoiceSubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IInvoiceSubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InvoiceSubscription message, length delimited. Does not implicitly {@link lnrpc.InvoiceSubscription.verify|verify} messages.
         * @param message InvoiceSubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IInvoiceSubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InvoiceSubscription message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InvoiceSubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.InvoiceSubscription;

        /**
         * Decodes an InvoiceSubscription message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InvoiceSubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.InvoiceSubscription;

        /**
         * Verifies an InvoiceSubscription message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InvoiceSubscription message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InvoiceSubscription
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.InvoiceSubscription;

        /**
         * Creates a plain object from an InvoiceSubscription message. Also converts values to other types if specified.
         * @param message InvoiceSubscription
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.InvoiceSubscription, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InvoiceSubscription to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** PaymentFailureReason enum. */
    enum PaymentFailureReason {
        FAILURE_REASON_NONE = 0,
        FAILURE_REASON_TIMEOUT = 1,
        FAILURE_REASON_NO_ROUTE = 2,
        FAILURE_REASON_ERROR = 3,
        FAILURE_REASON_INCORRECT_PAYMENT_DETAILS = 4,
        FAILURE_REASON_INSUFFICIENT_BALANCE = 5
    }

    /** Properties of a Payment. */
    interface IPayment {

        /** Payment paymentHash */
        paymentHash?: (string|null);

        /** Payment value */
        value?: (number|Long|null);

        /** Payment creationDate */
        creationDate?: (number|Long|null);

        /** Payment fee */
        fee?: (number|Long|null);

        /** Payment paymentPreimage */
        paymentPreimage?: (string|null);

        /** Payment valueSat */
        valueSat?: (number|Long|null);

        /** Payment valueMsat */
        valueMsat?: (number|Long|null);

        /** Payment paymentRequest */
        paymentRequest?: (string|null);

        /** Payment status */
        status?: (lnrpc.Payment.PaymentStatus|null);

        /** Payment feeSat */
        feeSat?: (number|Long|null);

        /** Payment feeMsat */
        feeMsat?: (number|Long|null);

        /** Payment creationTimeNs */
        creationTimeNs?: (number|Long|null);

        /** Payment htlcs */
        htlcs?: (lnrpc.IHTLCAttempt[]|null);

        /** Payment paymentIndex */
        paymentIndex?: (number|Long|null);

        /** Payment failureReason */
        failureReason?: (lnrpc.PaymentFailureReason|null);
    }

    /** Represents a Payment. */
    class Payment implements IPayment {

        /**
         * Constructs a new Payment.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPayment);

        /** Payment paymentHash. */
        public paymentHash: string;

        /** Payment value. */
        public value: (number|Long);

        /** Payment creationDate. */
        public creationDate: (number|Long);

        /** Payment fee. */
        public fee: (number|Long);

        /** Payment paymentPreimage. */
        public paymentPreimage: string;

        /** Payment valueSat. */
        public valueSat: (number|Long);

        /** Payment valueMsat. */
        public valueMsat: (number|Long);

        /** Payment paymentRequest. */
        public paymentRequest: string;

        /** Payment status. */
        public status: lnrpc.Payment.PaymentStatus;

        /** Payment feeSat. */
        public feeSat: (number|Long);

        /** Payment feeMsat. */
        public feeMsat: (number|Long);

        /** Payment creationTimeNs. */
        public creationTimeNs: (number|Long);

        /** Payment htlcs. */
        public htlcs: lnrpc.IHTLCAttempt[];

        /** Payment paymentIndex. */
        public paymentIndex: (number|Long);

        /** Payment failureReason. */
        public failureReason: lnrpc.PaymentFailureReason;

        /**
         * Creates a new Payment instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Payment instance
         */
        public static create(properties?: lnrpc.IPayment): lnrpc.Payment;

        /**
         * Encodes the specified Payment message. Does not implicitly {@link lnrpc.Payment.verify|verify} messages.
         * @param message Payment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPayment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Payment message, length delimited. Does not implicitly {@link lnrpc.Payment.verify|verify} messages.
         * @param message Payment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPayment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Payment message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Payment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Payment;

        /**
         * Decodes a Payment message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Payment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Payment;

        /**
         * Verifies a Payment message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Payment message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Payment
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Payment;

        /**
         * Creates a plain object from a Payment message. Also converts values to other types if specified.
         * @param message Payment
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Payment, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Payment to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Payment {

        /** PaymentStatus enum. */
        enum PaymentStatus {
            UNKNOWN = 0,
            IN_FLIGHT = 1,
            SUCCEEDED = 2,
            FAILED = 3
        }
    }

    /** Properties of a HTLCAttempt. */
    interface IHTLCAttempt {

        /** HTLCAttempt status */
        status?: (lnrpc.HTLCAttempt.HTLCStatus|null);

        /** HTLCAttempt route */
        route?: (lnrpc.IRoute|null);

        /** HTLCAttempt attemptTimeNs */
        attemptTimeNs?: (number|Long|null);

        /** HTLCAttempt resolveTimeNs */
        resolveTimeNs?: (number|Long|null);

        /** HTLCAttempt failure */
        failure?: (lnrpc.IFailure|null);

        /** HTLCAttempt preimage */
        preimage?: (Uint8Array|null);
    }

    /** Represents a HTLCAttempt. */
    class HTLCAttempt implements IHTLCAttempt {

        /**
         * Constructs a new HTLCAttempt.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IHTLCAttempt);

        /** HTLCAttempt status. */
        public status: lnrpc.HTLCAttempt.HTLCStatus;

        /** HTLCAttempt route. */
        public route?: (lnrpc.IRoute|null);

        /** HTLCAttempt attemptTimeNs. */
        public attemptTimeNs: (number|Long);

        /** HTLCAttempt resolveTimeNs. */
        public resolveTimeNs: (number|Long);

        /** HTLCAttempt failure. */
        public failure?: (lnrpc.IFailure|null);

        /** HTLCAttempt preimage. */
        public preimage: Uint8Array;

        /**
         * Creates a new HTLCAttempt instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HTLCAttempt instance
         */
        public static create(properties?: lnrpc.IHTLCAttempt): lnrpc.HTLCAttempt;

        /**
         * Encodes the specified HTLCAttempt message. Does not implicitly {@link lnrpc.HTLCAttempt.verify|verify} messages.
         * @param message HTLCAttempt message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IHTLCAttempt, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HTLCAttempt message, length delimited. Does not implicitly {@link lnrpc.HTLCAttempt.verify|verify} messages.
         * @param message HTLCAttempt message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IHTLCAttempt, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HTLCAttempt message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HTLCAttempt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.HTLCAttempt;

        /**
         * Decodes a HTLCAttempt message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HTLCAttempt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.HTLCAttempt;

        /**
         * Verifies a HTLCAttempt message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HTLCAttempt message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HTLCAttempt
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.HTLCAttempt;

        /**
         * Creates a plain object from a HTLCAttempt message. Also converts values to other types if specified.
         * @param message HTLCAttempt
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.HTLCAttempt, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HTLCAttempt to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace HTLCAttempt {

        /** HTLCStatus enum. */
        enum HTLCStatus {
            IN_FLIGHT = 0,
            SUCCEEDED = 1,
            FAILED = 2
        }
    }

    /** Properties of a ListPaymentsRequest. */
    interface IListPaymentsRequest {

        /** ListPaymentsRequest includeIncomplete */
        includeIncomplete?: (boolean|null);

        /** ListPaymentsRequest indexOffset */
        indexOffset?: (number|Long|null);

        /** ListPaymentsRequest maxPayments */
        maxPayments?: (number|Long|null);

        /** ListPaymentsRequest reversed */
        reversed?: (boolean|null);
    }

    /** Represents a ListPaymentsRequest. */
    class ListPaymentsRequest implements IListPaymentsRequest {

        /**
         * Constructs a new ListPaymentsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListPaymentsRequest);

        /** ListPaymentsRequest includeIncomplete. */
        public includeIncomplete: boolean;

        /** ListPaymentsRequest indexOffset. */
        public indexOffset: (number|Long);

        /** ListPaymentsRequest maxPayments. */
        public maxPayments: (number|Long);

        /** ListPaymentsRequest reversed. */
        public reversed: boolean;

        /**
         * Creates a new ListPaymentsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPaymentsRequest instance
         */
        public static create(properties?: lnrpc.IListPaymentsRequest): lnrpc.ListPaymentsRequest;

        /**
         * Encodes the specified ListPaymentsRequest message. Does not implicitly {@link lnrpc.ListPaymentsRequest.verify|verify} messages.
         * @param message ListPaymentsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListPaymentsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPaymentsRequest message, length delimited. Does not implicitly {@link lnrpc.ListPaymentsRequest.verify|verify} messages.
         * @param message ListPaymentsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListPaymentsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPaymentsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPaymentsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListPaymentsRequest;

        /**
         * Decodes a ListPaymentsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPaymentsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListPaymentsRequest;

        /**
         * Verifies a ListPaymentsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPaymentsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPaymentsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListPaymentsRequest;

        /**
         * Creates a plain object from a ListPaymentsRequest message. Also converts values to other types if specified.
         * @param message ListPaymentsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListPaymentsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPaymentsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListPaymentsResponse. */
    interface IListPaymentsResponse {

        /** ListPaymentsResponse payments */
        payments?: (lnrpc.IPayment[]|null);

        /** ListPaymentsResponse firstIndexOffset */
        firstIndexOffset?: (number|Long|null);

        /** ListPaymentsResponse lastIndexOffset */
        lastIndexOffset?: (number|Long|null);
    }

    /** Represents a ListPaymentsResponse. */
    class ListPaymentsResponse implements IListPaymentsResponse {

        /**
         * Constructs a new ListPaymentsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListPaymentsResponse);

        /** ListPaymentsResponse payments. */
        public payments: lnrpc.IPayment[];

        /** ListPaymentsResponse firstIndexOffset. */
        public firstIndexOffset: (number|Long);

        /** ListPaymentsResponse lastIndexOffset. */
        public lastIndexOffset: (number|Long);

        /**
         * Creates a new ListPaymentsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPaymentsResponse instance
         */
        public static create(properties?: lnrpc.IListPaymentsResponse): lnrpc.ListPaymentsResponse;

        /**
         * Encodes the specified ListPaymentsResponse message. Does not implicitly {@link lnrpc.ListPaymentsResponse.verify|verify} messages.
         * @param message ListPaymentsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListPaymentsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPaymentsResponse message, length delimited. Does not implicitly {@link lnrpc.ListPaymentsResponse.verify|verify} messages.
         * @param message ListPaymentsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListPaymentsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPaymentsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPaymentsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListPaymentsResponse;

        /**
         * Decodes a ListPaymentsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPaymentsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListPaymentsResponse;

        /**
         * Verifies a ListPaymentsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPaymentsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPaymentsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListPaymentsResponse;

        /**
         * Creates a plain object from a ListPaymentsResponse message. Also converts values to other types if specified.
         * @param message ListPaymentsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListPaymentsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPaymentsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeleteAllPaymentsRequest. */
    interface IDeleteAllPaymentsRequest {
    }

    /** Represents a DeleteAllPaymentsRequest. */
    class DeleteAllPaymentsRequest implements IDeleteAllPaymentsRequest {

        /**
         * Constructs a new DeleteAllPaymentsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IDeleteAllPaymentsRequest);

        /**
         * Creates a new DeleteAllPaymentsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteAllPaymentsRequest instance
         */
        public static create(properties?: lnrpc.IDeleteAllPaymentsRequest): lnrpc.DeleteAllPaymentsRequest;

        /**
         * Encodes the specified DeleteAllPaymentsRequest message. Does not implicitly {@link lnrpc.DeleteAllPaymentsRequest.verify|verify} messages.
         * @param message DeleteAllPaymentsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IDeleteAllPaymentsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteAllPaymentsRequest message, length delimited. Does not implicitly {@link lnrpc.DeleteAllPaymentsRequest.verify|verify} messages.
         * @param message DeleteAllPaymentsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IDeleteAllPaymentsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteAllPaymentsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteAllPaymentsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.DeleteAllPaymentsRequest;

        /**
         * Decodes a DeleteAllPaymentsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteAllPaymentsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.DeleteAllPaymentsRequest;

        /**
         * Verifies a DeleteAllPaymentsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteAllPaymentsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteAllPaymentsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.DeleteAllPaymentsRequest;

        /**
         * Creates a plain object from a DeleteAllPaymentsRequest message. Also converts values to other types if specified.
         * @param message DeleteAllPaymentsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.DeleteAllPaymentsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteAllPaymentsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeleteAllPaymentsResponse. */
    interface IDeleteAllPaymentsResponse {
    }

    /** Represents a DeleteAllPaymentsResponse. */
    class DeleteAllPaymentsResponse implements IDeleteAllPaymentsResponse {

        /**
         * Constructs a new DeleteAllPaymentsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IDeleteAllPaymentsResponse);

        /**
         * Creates a new DeleteAllPaymentsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteAllPaymentsResponse instance
         */
        public static create(properties?: lnrpc.IDeleteAllPaymentsResponse): lnrpc.DeleteAllPaymentsResponse;

        /**
         * Encodes the specified DeleteAllPaymentsResponse message. Does not implicitly {@link lnrpc.DeleteAllPaymentsResponse.verify|verify} messages.
         * @param message DeleteAllPaymentsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IDeleteAllPaymentsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteAllPaymentsResponse message, length delimited. Does not implicitly {@link lnrpc.DeleteAllPaymentsResponse.verify|verify} messages.
         * @param message DeleteAllPaymentsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IDeleteAllPaymentsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteAllPaymentsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteAllPaymentsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.DeleteAllPaymentsResponse;

        /**
         * Decodes a DeleteAllPaymentsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteAllPaymentsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.DeleteAllPaymentsResponse;

        /**
         * Verifies a DeleteAllPaymentsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteAllPaymentsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteAllPaymentsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.DeleteAllPaymentsResponse;

        /**
         * Creates a plain object from a DeleteAllPaymentsResponse message. Also converts values to other types if specified.
         * @param message DeleteAllPaymentsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.DeleteAllPaymentsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteAllPaymentsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AbandonChannelRequest. */
    interface IAbandonChannelRequest {

        /** AbandonChannelRequest channelPoint */
        channelPoint?: (lnrpc.IChannelPoint|null);

        /** AbandonChannelRequest pendingFundingShimOnly */
        pendingFundingShimOnly?: (boolean|null);
    }

    /** Represents an AbandonChannelRequest. */
    class AbandonChannelRequest implements IAbandonChannelRequest {

        /**
         * Constructs a new AbandonChannelRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IAbandonChannelRequest);

        /** AbandonChannelRequest channelPoint. */
        public channelPoint?: (lnrpc.IChannelPoint|null);

        /** AbandonChannelRequest pendingFundingShimOnly. */
        public pendingFundingShimOnly: boolean;

        /**
         * Creates a new AbandonChannelRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AbandonChannelRequest instance
         */
        public static create(properties?: lnrpc.IAbandonChannelRequest): lnrpc.AbandonChannelRequest;

        /**
         * Encodes the specified AbandonChannelRequest message. Does not implicitly {@link lnrpc.AbandonChannelRequest.verify|verify} messages.
         * @param message AbandonChannelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IAbandonChannelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AbandonChannelRequest message, length delimited. Does not implicitly {@link lnrpc.AbandonChannelRequest.verify|verify} messages.
         * @param message AbandonChannelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IAbandonChannelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AbandonChannelRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AbandonChannelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.AbandonChannelRequest;

        /**
         * Decodes an AbandonChannelRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AbandonChannelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.AbandonChannelRequest;

        /**
         * Verifies an AbandonChannelRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AbandonChannelRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AbandonChannelRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.AbandonChannelRequest;

        /**
         * Creates a plain object from an AbandonChannelRequest message. Also converts values to other types if specified.
         * @param message AbandonChannelRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.AbandonChannelRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AbandonChannelRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AbandonChannelResponse. */
    interface IAbandonChannelResponse {
    }

    /** Represents an AbandonChannelResponse. */
    class AbandonChannelResponse implements IAbandonChannelResponse {

        /**
         * Constructs a new AbandonChannelResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IAbandonChannelResponse);

        /**
         * Creates a new AbandonChannelResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AbandonChannelResponse instance
         */
        public static create(properties?: lnrpc.IAbandonChannelResponse): lnrpc.AbandonChannelResponse;

        /**
         * Encodes the specified AbandonChannelResponse message. Does not implicitly {@link lnrpc.AbandonChannelResponse.verify|verify} messages.
         * @param message AbandonChannelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IAbandonChannelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AbandonChannelResponse message, length delimited. Does not implicitly {@link lnrpc.AbandonChannelResponse.verify|verify} messages.
         * @param message AbandonChannelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IAbandonChannelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AbandonChannelResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AbandonChannelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.AbandonChannelResponse;

        /**
         * Decodes an AbandonChannelResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AbandonChannelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.AbandonChannelResponse;

        /**
         * Verifies an AbandonChannelResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AbandonChannelResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AbandonChannelResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.AbandonChannelResponse;

        /**
         * Creates a plain object from an AbandonChannelResponse message. Also converts values to other types if specified.
         * @param message AbandonChannelResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.AbandonChannelResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AbandonChannelResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DebugLevelRequest. */
    interface IDebugLevelRequest {

        /** DebugLevelRequest show */
        show?: (boolean|null);

        /** DebugLevelRequest levelSpec */
        levelSpec?: (string|null);
    }

    /** Represents a DebugLevelRequest. */
    class DebugLevelRequest implements IDebugLevelRequest {

        /**
         * Constructs a new DebugLevelRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IDebugLevelRequest);

        /** DebugLevelRequest show. */
        public show: boolean;

        /** DebugLevelRequest levelSpec. */
        public levelSpec: string;

        /**
         * Creates a new DebugLevelRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DebugLevelRequest instance
         */
        public static create(properties?: lnrpc.IDebugLevelRequest): lnrpc.DebugLevelRequest;

        /**
         * Encodes the specified DebugLevelRequest message. Does not implicitly {@link lnrpc.DebugLevelRequest.verify|verify} messages.
         * @param message DebugLevelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IDebugLevelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DebugLevelRequest message, length delimited. Does not implicitly {@link lnrpc.DebugLevelRequest.verify|verify} messages.
         * @param message DebugLevelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IDebugLevelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DebugLevelRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DebugLevelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.DebugLevelRequest;

        /**
         * Decodes a DebugLevelRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DebugLevelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.DebugLevelRequest;

        /**
         * Verifies a DebugLevelRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DebugLevelRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DebugLevelRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.DebugLevelRequest;

        /**
         * Creates a plain object from a DebugLevelRequest message. Also converts values to other types if specified.
         * @param message DebugLevelRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.DebugLevelRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DebugLevelRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DebugLevelResponse. */
    interface IDebugLevelResponse {

        /** DebugLevelResponse subSystems */
        subSystems?: (string|null);
    }

    /** Represents a DebugLevelResponse. */
    class DebugLevelResponse implements IDebugLevelResponse {

        /**
         * Constructs a new DebugLevelResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IDebugLevelResponse);

        /** DebugLevelResponse subSystems. */
        public subSystems: string;

        /**
         * Creates a new DebugLevelResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DebugLevelResponse instance
         */
        public static create(properties?: lnrpc.IDebugLevelResponse): lnrpc.DebugLevelResponse;

        /**
         * Encodes the specified DebugLevelResponse message. Does not implicitly {@link lnrpc.DebugLevelResponse.verify|verify} messages.
         * @param message DebugLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IDebugLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DebugLevelResponse message, length delimited. Does not implicitly {@link lnrpc.DebugLevelResponse.verify|verify} messages.
         * @param message DebugLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IDebugLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DebugLevelResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DebugLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.DebugLevelResponse;

        /**
         * Decodes a DebugLevelResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DebugLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.DebugLevelResponse;

        /**
         * Verifies a DebugLevelResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DebugLevelResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DebugLevelResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.DebugLevelResponse;

        /**
         * Creates a plain object from a DebugLevelResponse message. Also converts values to other types if specified.
         * @param message DebugLevelResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.DebugLevelResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DebugLevelResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PayReqString. */
    interface IPayReqString {

        /** PayReqString payReq */
        payReq?: (string|null);
    }

    /** Represents a PayReqString. */
    class PayReqString implements IPayReqString {

        /**
         * Constructs a new PayReqString.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPayReqString);

        /** PayReqString payReq. */
        public payReq: string;

        /**
         * Creates a new PayReqString instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PayReqString instance
         */
        public static create(properties?: lnrpc.IPayReqString): lnrpc.PayReqString;

        /**
         * Encodes the specified PayReqString message. Does not implicitly {@link lnrpc.PayReqString.verify|verify} messages.
         * @param message PayReqString message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPayReqString, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PayReqString message, length delimited. Does not implicitly {@link lnrpc.PayReqString.verify|verify} messages.
         * @param message PayReqString message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPayReqString, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PayReqString message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PayReqString
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PayReqString;

        /**
         * Decodes a PayReqString message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PayReqString
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PayReqString;

        /**
         * Verifies a PayReqString message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PayReqString message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PayReqString
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PayReqString;

        /**
         * Creates a plain object from a PayReqString message. Also converts values to other types if specified.
         * @param message PayReqString
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PayReqString, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PayReqString to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PayReq. */
    interface IPayReq {

        /** PayReq destination */
        destination?: (string|null);

        /** PayReq paymentHash */
        paymentHash?: (string|null);

        /** PayReq numSatoshis */
        numSatoshis?: (number|Long|null);

        /** PayReq timestamp */
        timestamp?: (number|Long|null);

        /** PayReq expiry */
        expiry?: (number|Long|null);

        /** PayReq description */
        description?: (string|null);

        /** PayReq descriptionHash */
        descriptionHash?: (string|null);

        /** PayReq fallbackAddr */
        fallbackAddr?: (string|null);

        /** PayReq cltvExpiry */
        cltvExpiry?: (number|Long|null);

        /** PayReq routeHints */
        routeHints?: (lnrpc.IRouteHint[]|null);

        /** PayReq paymentAddr */
        paymentAddr?: (Uint8Array|null);

        /** PayReq numMsat */
        numMsat?: (number|Long|null);

        /** PayReq features */
        features?: ({ [k: string]: lnrpc.IFeature }|null);
    }

    /** Represents a PayReq. */
    class PayReq implements IPayReq {

        /**
         * Constructs a new PayReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPayReq);

        /** PayReq destination. */
        public destination: string;

        /** PayReq paymentHash. */
        public paymentHash: string;

        /** PayReq numSatoshis. */
        public numSatoshis: (number|Long);

        /** PayReq timestamp. */
        public timestamp: (number|Long);

        /** PayReq expiry. */
        public expiry: (number|Long);

        /** PayReq description. */
        public description: string;

        /** PayReq descriptionHash. */
        public descriptionHash: string;

        /** PayReq fallbackAddr. */
        public fallbackAddr: string;

        /** PayReq cltvExpiry. */
        public cltvExpiry: (number|Long);

        /** PayReq routeHints. */
        public routeHints: lnrpc.IRouteHint[];

        /** PayReq paymentAddr. */
        public paymentAddr: Uint8Array;

        /** PayReq numMsat. */
        public numMsat: (number|Long);

        /** PayReq features. */
        public features: { [k: string]: lnrpc.IFeature };

        /**
         * Creates a new PayReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PayReq instance
         */
        public static create(properties?: lnrpc.IPayReq): lnrpc.PayReq;

        /**
         * Encodes the specified PayReq message. Does not implicitly {@link lnrpc.PayReq.verify|verify} messages.
         * @param message PayReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPayReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PayReq message, length delimited. Does not implicitly {@link lnrpc.PayReq.verify|verify} messages.
         * @param message PayReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPayReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PayReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PayReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PayReq;

        /**
         * Decodes a PayReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PayReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PayReq;

        /**
         * Verifies a PayReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PayReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PayReq
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PayReq;

        /**
         * Creates a plain object from a PayReq message. Also converts values to other types if specified.
         * @param message PayReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PayReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PayReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** FeatureBit enum. */
    enum FeatureBit {
        DATALOSS_PROTECT_REQ = 0,
        DATALOSS_PROTECT_OPT = 1,
        INITIAL_ROUING_SYNC = 3,
        UPFRONT_SHUTDOWN_SCRIPT_REQ = 4,
        UPFRONT_SHUTDOWN_SCRIPT_OPT = 5,
        GOSSIP_QUERIES_REQ = 6,
        GOSSIP_QUERIES_OPT = 7,
        TLV_ONION_REQ = 8,
        TLV_ONION_OPT = 9,
        EXT_GOSSIP_QUERIES_REQ = 10,
        EXT_GOSSIP_QUERIES_OPT = 11,
        STATIC_REMOTE_KEY_REQ = 12,
        STATIC_REMOTE_KEY_OPT = 13,
        PAYMENT_ADDR_REQ = 14,
        PAYMENT_ADDR_OPT = 15,
        MPP_REQ = 16,
        MPP_OPT = 17
    }

    /** Properties of a Feature. */
    interface IFeature {

        /** Feature name */
        name?: (string|null);

        /** Feature isRequired */
        isRequired?: (boolean|null);

        /** Feature isKnown */
        isKnown?: (boolean|null);
    }

    /** Represents a Feature. */
    class Feature implements IFeature {

        /**
         * Constructs a new Feature.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFeature);

        /** Feature name. */
        public name: string;

        /** Feature isRequired. */
        public isRequired: boolean;

        /** Feature isKnown. */
        public isKnown: boolean;

        /**
         * Creates a new Feature instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Feature instance
         */
        public static create(properties?: lnrpc.IFeature): lnrpc.Feature;

        /**
         * Encodes the specified Feature message. Does not implicitly {@link lnrpc.Feature.verify|verify} messages.
         * @param message Feature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFeature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Feature message, length delimited. Does not implicitly {@link lnrpc.Feature.verify|verify} messages.
         * @param message Feature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFeature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Feature message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Feature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Feature;

        /**
         * Decodes a Feature message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Feature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Feature;

        /**
         * Verifies a Feature message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Feature message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Feature
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Feature;

        /**
         * Creates a plain object from a Feature message. Also converts values to other types if specified.
         * @param message Feature
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Feature, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Feature to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FeeReportRequest. */
    interface IFeeReportRequest {
    }

    /** Represents a FeeReportRequest. */
    class FeeReportRequest implements IFeeReportRequest {

        /**
         * Constructs a new FeeReportRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFeeReportRequest);

        /**
         * Creates a new FeeReportRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FeeReportRequest instance
         */
        public static create(properties?: lnrpc.IFeeReportRequest): lnrpc.FeeReportRequest;

        /**
         * Encodes the specified FeeReportRequest message. Does not implicitly {@link lnrpc.FeeReportRequest.verify|verify} messages.
         * @param message FeeReportRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFeeReportRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FeeReportRequest message, length delimited. Does not implicitly {@link lnrpc.FeeReportRequest.verify|verify} messages.
         * @param message FeeReportRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFeeReportRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FeeReportRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FeeReportRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FeeReportRequest;

        /**
         * Decodes a FeeReportRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FeeReportRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FeeReportRequest;

        /**
         * Verifies a FeeReportRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FeeReportRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FeeReportRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FeeReportRequest;

        /**
         * Creates a plain object from a FeeReportRequest message. Also converts values to other types if specified.
         * @param message FeeReportRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FeeReportRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FeeReportRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelFeeReport. */
    interface IChannelFeeReport {

        /** ChannelFeeReport chanId */
        chanId?: (number|Long|null);

        /** ChannelFeeReport channelPoint */
        channelPoint?: (string|null);

        /** ChannelFeeReport baseFeeMsat */
        baseFeeMsat?: (number|Long|null);

        /** ChannelFeeReport feePerMil */
        feePerMil?: (number|Long|null);

        /** ChannelFeeReport feeRate */
        feeRate?: (number|null);
    }

    /** Represents a ChannelFeeReport. */
    class ChannelFeeReport implements IChannelFeeReport {

        /**
         * Constructs a new ChannelFeeReport.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelFeeReport);

        /** ChannelFeeReport chanId. */
        public chanId: (number|Long);

        /** ChannelFeeReport channelPoint. */
        public channelPoint: string;

        /** ChannelFeeReport baseFeeMsat. */
        public baseFeeMsat: (number|Long);

        /** ChannelFeeReport feePerMil. */
        public feePerMil: (number|Long);

        /** ChannelFeeReport feeRate. */
        public feeRate: number;

        /**
         * Creates a new ChannelFeeReport instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelFeeReport instance
         */
        public static create(properties?: lnrpc.IChannelFeeReport): lnrpc.ChannelFeeReport;

        /**
         * Encodes the specified ChannelFeeReport message. Does not implicitly {@link lnrpc.ChannelFeeReport.verify|verify} messages.
         * @param message ChannelFeeReport message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelFeeReport, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelFeeReport message, length delimited. Does not implicitly {@link lnrpc.ChannelFeeReport.verify|verify} messages.
         * @param message ChannelFeeReport message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelFeeReport, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelFeeReport message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelFeeReport
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelFeeReport;

        /**
         * Decodes a ChannelFeeReport message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelFeeReport
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelFeeReport;

        /**
         * Verifies a ChannelFeeReport message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelFeeReport message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelFeeReport
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelFeeReport;

        /**
         * Creates a plain object from a ChannelFeeReport message. Also converts values to other types if specified.
         * @param message ChannelFeeReport
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelFeeReport, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelFeeReport to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FeeReportResponse. */
    interface IFeeReportResponse {

        /** FeeReportResponse channelFees */
        channelFees?: (lnrpc.IChannelFeeReport[]|null);

        /** FeeReportResponse dayFeeSum */
        dayFeeSum?: (number|Long|null);

        /** FeeReportResponse weekFeeSum */
        weekFeeSum?: (number|Long|null);

        /** FeeReportResponse monthFeeSum */
        monthFeeSum?: (number|Long|null);
    }

    /** Represents a FeeReportResponse. */
    class FeeReportResponse implements IFeeReportResponse {

        /**
         * Constructs a new FeeReportResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFeeReportResponse);

        /** FeeReportResponse channelFees. */
        public channelFees: lnrpc.IChannelFeeReport[];

        /** FeeReportResponse dayFeeSum. */
        public dayFeeSum: (number|Long);

        /** FeeReportResponse weekFeeSum. */
        public weekFeeSum: (number|Long);

        /** FeeReportResponse monthFeeSum. */
        public monthFeeSum: (number|Long);

        /**
         * Creates a new FeeReportResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FeeReportResponse instance
         */
        public static create(properties?: lnrpc.IFeeReportResponse): lnrpc.FeeReportResponse;

        /**
         * Encodes the specified FeeReportResponse message. Does not implicitly {@link lnrpc.FeeReportResponse.verify|verify} messages.
         * @param message FeeReportResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFeeReportResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FeeReportResponse message, length delimited. Does not implicitly {@link lnrpc.FeeReportResponse.verify|verify} messages.
         * @param message FeeReportResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFeeReportResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FeeReportResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FeeReportResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.FeeReportResponse;

        /**
         * Decodes a FeeReportResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FeeReportResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.FeeReportResponse;

        /**
         * Verifies a FeeReportResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FeeReportResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FeeReportResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.FeeReportResponse;

        /**
         * Creates a plain object from a FeeReportResponse message. Also converts values to other types if specified.
         * @param message FeeReportResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.FeeReportResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FeeReportResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PolicyUpdateRequest. */
    interface IPolicyUpdateRequest {

        /** PolicyUpdateRequest global */
        global?: (boolean|null);

        /** PolicyUpdateRequest chanPoint */
        chanPoint?: (lnrpc.IChannelPoint|null);

        /** PolicyUpdateRequest baseFeeMsat */
        baseFeeMsat?: (number|Long|null);

        /** PolicyUpdateRequest feeRate */
        feeRate?: (number|null);

        /** PolicyUpdateRequest timeLockDelta */
        timeLockDelta?: (number|null);

        /** PolicyUpdateRequest maxHtlcMsat */
        maxHtlcMsat?: (number|Long|null);

        /** PolicyUpdateRequest minHtlcMsat */
        minHtlcMsat?: (number|Long|null);

        /** PolicyUpdateRequest minHtlcMsatSpecified */
        minHtlcMsatSpecified?: (boolean|null);
    }

    /** Represents a PolicyUpdateRequest. */
    class PolicyUpdateRequest implements IPolicyUpdateRequest {

        /**
         * Constructs a new PolicyUpdateRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPolicyUpdateRequest);

        /** PolicyUpdateRequest global. */
        public global: boolean;

        /** PolicyUpdateRequest chanPoint. */
        public chanPoint?: (lnrpc.IChannelPoint|null);

        /** PolicyUpdateRequest baseFeeMsat. */
        public baseFeeMsat: (number|Long);

        /** PolicyUpdateRequest feeRate. */
        public feeRate: number;

        /** PolicyUpdateRequest timeLockDelta. */
        public timeLockDelta: number;

        /** PolicyUpdateRequest maxHtlcMsat. */
        public maxHtlcMsat: (number|Long);

        /** PolicyUpdateRequest minHtlcMsat. */
        public minHtlcMsat: (number|Long);

        /** PolicyUpdateRequest minHtlcMsatSpecified. */
        public minHtlcMsatSpecified: boolean;

        /** PolicyUpdateRequest scope. */
        public scope?: ("global"|"chanPoint");

        /**
         * Creates a new PolicyUpdateRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PolicyUpdateRequest instance
         */
        public static create(properties?: lnrpc.IPolicyUpdateRequest): lnrpc.PolicyUpdateRequest;

        /**
         * Encodes the specified PolicyUpdateRequest message. Does not implicitly {@link lnrpc.PolicyUpdateRequest.verify|verify} messages.
         * @param message PolicyUpdateRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPolicyUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PolicyUpdateRequest message, length delimited. Does not implicitly {@link lnrpc.PolicyUpdateRequest.verify|verify} messages.
         * @param message PolicyUpdateRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPolicyUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PolicyUpdateRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PolicyUpdateRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PolicyUpdateRequest;

        /**
         * Decodes a PolicyUpdateRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PolicyUpdateRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PolicyUpdateRequest;

        /**
         * Verifies a PolicyUpdateRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PolicyUpdateRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PolicyUpdateRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PolicyUpdateRequest;

        /**
         * Creates a plain object from a PolicyUpdateRequest message. Also converts values to other types if specified.
         * @param message PolicyUpdateRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PolicyUpdateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PolicyUpdateRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PolicyUpdateResponse. */
    interface IPolicyUpdateResponse {
    }

    /** Represents a PolicyUpdateResponse. */
    class PolicyUpdateResponse implements IPolicyUpdateResponse {

        /**
         * Constructs a new PolicyUpdateResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IPolicyUpdateResponse);

        /**
         * Creates a new PolicyUpdateResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PolicyUpdateResponse instance
         */
        public static create(properties?: lnrpc.IPolicyUpdateResponse): lnrpc.PolicyUpdateResponse;

        /**
         * Encodes the specified PolicyUpdateResponse message. Does not implicitly {@link lnrpc.PolicyUpdateResponse.verify|verify} messages.
         * @param message PolicyUpdateResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IPolicyUpdateResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PolicyUpdateResponse message, length delimited. Does not implicitly {@link lnrpc.PolicyUpdateResponse.verify|verify} messages.
         * @param message PolicyUpdateResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IPolicyUpdateResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PolicyUpdateResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PolicyUpdateResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.PolicyUpdateResponse;

        /**
         * Decodes a PolicyUpdateResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PolicyUpdateResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.PolicyUpdateResponse;

        /**
         * Verifies a PolicyUpdateResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PolicyUpdateResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PolicyUpdateResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.PolicyUpdateResponse;

        /**
         * Creates a plain object from a PolicyUpdateResponse message. Also converts values to other types if specified.
         * @param message PolicyUpdateResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.PolicyUpdateResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PolicyUpdateResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ForwardingHistoryRequest. */
    interface IForwardingHistoryRequest {

        /** ForwardingHistoryRequest startTime */
        startTime?: (number|Long|null);

        /** ForwardingHistoryRequest endTime */
        endTime?: (number|Long|null);

        /** ForwardingHistoryRequest indexOffset */
        indexOffset?: (number|null);

        /** ForwardingHistoryRequest numMaxEvents */
        numMaxEvents?: (number|null);
    }

    /** Represents a ForwardingHistoryRequest. */
    class ForwardingHistoryRequest implements IForwardingHistoryRequest {

        /**
         * Constructs a new ForwardingHistoryRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IForwardingHistoryRequest);

        /** ForwardingHistoryRequest startTime. */
        public startTime: (number|Long);

        /** ForwardingHistoryRequest endTime. */
        public endTime: (number|Long);

        /** ForwardingHistoryRequest indexOffset. */
        public indexOffset: number;

        /** ForwardingHistoryRequest numMaxEvents. */
        public numMaxEvents: number;

        /**
         * Creates a new ForwardingHistoryRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ForwardingHistoryRequest instance
         */
        public static create(properties?: lnrpc.IForwardingHistoryRequest): lnrpc.ForwardingHistoryRequest;

        /**
         * Encodes the specified ForwardingHistoryRequest message. Does not implicitly {@link lnrpc.ForwardingHistoryRequest.verify|verify} messages.
         * @param message ForwardingHistoryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IForwardingHistoryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ForwardingHistoryRequest message, length delimited. Does not implicitly {@link lnrpc.ForwardingHistoryRequest.verify|verify} messages.
         * @param message ForwardingHistoryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IForwardingHistoryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ForwardingHistoryRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ForwardingHistoryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ForwardingHistoryRequest;

        /**
         * Decodes a ForwardingHistoryRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ForwardingHistoryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ForwardingHistoryRequest;

        /**
         * Verifies a ForwardingHistoryRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ForwardingHistoryRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ForwardingHistoryRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ForwardingHistoryRequest;

        /**
         * Creates a plain object from a ForwardingHistoryRequest message. Also converts values to other types if specified.
         * @param message ForwardingHistoryRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ForwardingHistoryRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ForwardingHistoryRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ForwardingEvent. */
    interface IForwardingEvent {

        /** ForwardingEvent timestamp */
        timestamp?: (number|Long|null);

        /** ForwardingEvent chanIdIn */
        chanIdIn?: (number|Long|null);

        /** ForwardingEvent chanIdOut */
        chanIdOut?: (number|Long|null);

        /** ForwardingEvent amtIn */
        amtIn?: (number|Long|null);

        /** ForwardingEvent amtOut */
        amtOut?: (number|Long|null);

        /** ForwardingEvent fee */
        fee?: (number|Long|null);

        /** ForwardingEvent feeMsat */
        feeMsat?: (number|Long|null);

        /** ForwardingEvent amtInMsat */
        amtInMsat?: (number|Long|null);

        /** ForwardingEvent amtOutMsat */
        amtOutMsat?: (number|Long|null);
    }

    /** Represents a ForwardingEvent. */
    class ForwardingEvent implements IForwardingEvent {

        /**
         * Constructs a new ForwardingEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IForwardingEvent);

        /** ForwardingEvent timestamp. */
        public timestamp: (number|Long);

        /** ForwardingEvent chanIdIn. */
        public chanIdIn: (number|Long);

        /** ForwardingEvent chanIdOut. */
        public chanIdOut: (number|Long);

        /** ForwardingEvent amtIn. */
        public amtIn: (number|Long);

        /** ForwardingEvent amtOut. */
        public amtOut: (number|Long);

        /** ForwardingEvent fee. */
        public fee: (number|Long);

        /** ForwardingEvent feeMsat. */
        public feeMsat: (number|Long);

        /** ForwardingEvent amtInMsat. */
        public amtInMsat: (number|Long);

        /** ForwardingEvent amtOutMsat. */
        public amtOutMsat: (number|Long);

        /**
         * Creates a new ForwardingEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ForwardingEvent instance
         */
        public static create(properties?: lnrpc.IForwardingEvent): lnrpc.ForwardingEvent;

        /**
         * Encodes the specified ForwardingEvent message. Does not implicitly {@link lnrpc.ForwardingEvent.verify|verify} messages.
         * @param message ForwardingEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IForwardingEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ForwardingEvent message, length delimited. Does not implicitly {@link lnrpc.ForwardingEvent.verify|verify} messages.
         * @param message ForwardingEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IForwardingEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ForwardingEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ForwardingEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ForwardingEvent;

        /**
         * Decodes a ForwardingEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ForwardingEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ForwardingEvent;

        /**
         * Verifies a ForwardingEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ForwardingEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ForwardingEvent
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ForwardingEvent;

        /**
         * Creates a plain object from a ForwardingEvent message. Also converts values to other types if specified.
         * @param message ForwardingEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ForwardingEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ForwardingEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ForwardingHistoryResponse. */
    interface IForwardingHistoryResponse {

        /** ForwardingHistoryResponse forwardingEvents */
        forwardingEvents?: (lnrpc.IForwardingEvent[]|null);

        /** ForwardingHistoryResponse lastOffsetIndex */
        lastOffsetIndex?: (number|null);
    }

    /** Represents a ForwardingHistoryResponse. */
    class ForwardingHistoryResponse implements IForwardingHistoryResponse {

        /**
         * Constructs a new ForwardingHistoryResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IForwardingHistoryResponse);

        /** ForwardingHistoryResponse forwardingEvents. */
        public forwardingEvents: lnrpc.IForwardingEvent[];

        /** ForwardingHistoryResponse lastOffsetIndex. */
        public lastOffsetIndex: number;

        /**
         * Creates a new ForwardingHistoryResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ForwardingHistoryResponse instance
         */
        public static create(properties?: lnrpc.IForwardingHistoryResponse): lnrpc.ForwardingHistoryResponse;

        /**
         * Encodes the specified ForwardingHistoryResponse message. Does not implicitly {@link lnrpc.ForwardingHistoryResponse.verify|verify} messages.
         * @param message ForwardingHistoryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IForwardingHistoryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ForwardingHistoryResponse message, length delimited. Does not implicitly {@link lnrpc.ForwardingHistoryResponse.verify|verify} messages.
         * @param message ForwardingHistoryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IForwardingHistoryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ForwardingHistoryResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ForwardingHistoryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ForwardingHistoryResponse;

        /**
         * Decodes a ForwardingHistoryResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ForwardingHistoryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ForwardingHistoryResponse;

        /**
         * Verifies a ForwardingHistoryResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ForwardingHistoryResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ForwardingHistoryResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ForwardingHistoryResponse;

        /**
         * Creates a plain object from a ForwardingHistoryResponse message. Also converts values to other types if specified.
         * @param message ForwardingHistoryResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ForwardingHistoryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ForwardingHistoryResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ExportChannelBackupRequest. */
    interface IExportChannelBackupRequest {

        /** ExportChannelBackupRequest chanPoint */
        chanPoint?: (lnrpc.IChannelPoint|null);
    }

    /** Represents an ExportChannelBackupRequest. */
    class ExportChannelBackupRequest implements IExportChannelBackupRequest {

        /**
         * Constructs a new ExportChannelBackupRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IExportChannelBackupRequest);

        /** ExportChannelBackupRequest chanPoint. */
        public chanPoint?: (lnrpc.IChannelPoint|null);

        /**
         * Creates a new ExportChannelBackupRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExportChannelBackupRequest instance
         */
        public static create(properties?: lnrpc.IExportChannelBackupRequest): lnrpc.ExportChannelBackupRequest;

        /**
         * Encodes the specified ExportChannelBackupRequest message. Does not implicitly {@link lnrpc.ExportChannelBackupRequest.verify|verify} messages.
         * @param message ExportChannelBackupRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IExportChannelBackupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExportChannelBackupRequest message, length delimited. Does not implicitly {@link lnrpc.ExportChannelBackupRequest.verify|verify} messages.
         * @param message ExportChannelBackupRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IExportChannelBackupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExportChannelBackupRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExportChannelBackupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ExportChannelBackupRequest;

        /**
         * Decodes an ExportChannelBackupRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExportChannelBackupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ExportChannelBackupRequest;

        /**
         * Verifies an ExportChannelBackupRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExportChannelBackupRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExportChannelBackupRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ExportChannelBackupRequest;

        /**
         * Creates a plain object from an ExportChannelBackupRequest message. Also converts values to other types if specified.
         * @param message ExportChannelBackupRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ExportChannelBackupRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExportChannelBackupRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelBackup. */
    interface IChannelBackup {

        /** ChannelBackup chanPoint */
        chanPoint?: (lnrpc.IChannelPoint|null);

        /** ChannelBackup chanBackup */
        chanBackup?: (Uint8Array|null);
    }

    /** Represents a ChannelBackup. */
    class ChannelBackup implements IChannelBackup {

        /**
         * Constructs a new ChannelBackup.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelBackup);

        /** ChannelBackup chanPoint. */
        public chanPoint?: (lnrpc.IChannelPoint|null);

        /** ChannelBackup chanBackup. */
        public chanBackup: Uint8Array;

        /**
         * Creates a new ChannelBackup instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelBackup instance
         */
        public static create(properties?: lnrpc.IChannelBackup): lnrpc.ChannelBackup;

        /**
         * Encodes the specified ChannelBackup message. Does not implicitly {@link lnrpc.ChannelBackup.verify|verify} messages.
         * @param message ChannelBackup message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelBackup, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelBackup message, length delimited. Does not implicitly {@link lnrpc.ChannelBackup.verify|verify} messages.
         * @param message ChannelBackup message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelBackup, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelBackup message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelBackup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelBackup;

        /**
         * Decodes a ChannelBackup message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelBackup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelBackup;

        /**
         * Verifies a ChannelBackup message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelBackup message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelBackup
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelBackup;

        /**
         * Creates a plain object from a ChannelBackup message. Also converts values to other types if specified.
         * @param message ChannelBackup
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelBackup, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelBackup to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MultiChanBackup. */
    interface IMultiChanBackup {

        /** MultiChanBackup chanPoints */
        chanPoints?: (lnrpc.IChannelPoint[]|null);

        /** MultiChanBackup multiChanBackup */
        multiChanBackup?: (Uint8Array|null);
    }

    /** Represents a MultiChanBackup. */
    class MultiChanBackup implements IMultiChanBackup {

        /**
         * Constructs a new MultiChanBackup.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IMultiChanBackup);

        /** MultiChanBackup chanPoints. */
        public chanPoints: lnrpc.IChannelPoint[];

        /** MultiChanBackup multiChanBackup. */
        public multiChanBackup: Uint8Array;

        /**
         * Creates a new MultiChanBackup instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MultiChanBackup instance
         */
        public static create(properties?: lnrpc.IMultiChanBackup): lnrpc.MultiChanBackup;

        /**
         * Encodes the specified MultiChanBackup message. Does not implicitly {@link lnrpc.MultiChanBackup.verify|verify} messages.
         * @param message MultiChanBackup message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IMultiChanBackup, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MultiChanBackup message, length delimited. Does not implicitly {@link lnrpc.MultiChanBackup.verify|verify} messages.
         * @param message MultiChanBackup message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IMultiChanBackup, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MultiChanBackup message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MultiChanBackup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.MultiChanBackup;

        /**
         * Decodes a MultiChanBackup message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MultiChanBackup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.MultiChanBackup;

        /**
         * Verifies a MultiChanBackup message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MultiChanBackup message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MultiChanBackup
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.MultiChanBackup;

        /**
         * Creates a plain object from a MultiChanBackup message. Also converts values to other types if specified.
         * @param message MultiChanBackup
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.MultiChanBackup, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MultiChanBackup to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChanBackupExportRequest. */
    interface IChanBackupExportRequest {
    }

    /** Represents a ChanBackupExportRequest. */
    class ChanBackupExportRequest implements IChanBackupExportRequest {

        /**
         * Constructs a new ChanBackupExportRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChanBackupExportRequest);

        /**
         * Creates a new ChanBackupExportRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChanBackupExportRequest instance
         */
        public static create(properties?: lnrpc.IChanBackupExportRequest): lnrpc.ChanBackupExportRequest;

        /**
         * Encodes the specified ChanBackupExportRequest message. Does not implicitly {@link lnrpc.ChanBackupExportRequest.verify|verify} messages.
         * @param message ChanBackupExportRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChanBackupExportRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChanBackupExportRequest message, length delimited. Does not implicitly {@link lnrpc.ChanBackupExportRequest.verify|verify} messages.
         * @param message ChanBackupExportRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChanBackupExportRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChanBackupExportRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChanBackupExportRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChanBackupExportRequest;

        /**
         * Decodes a ChanBackupExportRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChanBackupExportRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChanBackupExportRequest;

        /**
         * Verifies a ChanBackupExportRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChanBackupExportRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChanBackupExportRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChanBackupExportRequest;

        /**
         * Creates a plain object from a ChanBackupExportRequest message. Also converts values to other types if specified.
         * @param message ChanBackupExportRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChanBackupExportRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChanBackupExportRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChanBackupSnapshot. */
    interface IChanBackupSnapshot {

        /** ChanBackupSnapshot singleChanBackups */
        singleChanBackups?: (lnrpc.IChannelBackups|null);

        /** ChanBackupSnapshot multiChanBackup */
        multiChanBackup?: (lnrpc.IMultiChanBackup|null);
    }

    /** Represents a ChanBackupSnapshot. */
    class ChanBackupSnapshot implements IChanBackupSnapshot {

        /**
         * Constructs a new ChanBackupSnapshot.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChanBackupSnapshot);

        /** ChanBackupSnapshot singleChanBackups. */
        public singleChanBackups?: (lnrpc.IChannelBackups|null);

        /** ChanBackupSnapshot multiChanBackup. */
        public multiChanBackup?: (lnrpc.IMultiChanBackup|null);

        /**
         * Creates a new ChanBackupSnapshot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChanBackupSnapshot instance
         */
        public static create(properties?: lnrpc.IChanBackupSnapshot): lnrpc.ChanBackupSnapshot;

        /**
         * Encodes the specified ChanBackupSnapshot message. Does not implicitly {@link lnrpc.ChanBackupSnapshot.verify|verify} messages.
         * @param message ChanBackupSnapshot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChanBackupSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChanBackupSnapshot message, length delimited. Does not implicitly {@link lnrpc.ChanBackupSnapshot.verify|verify} messages.
         * @param message ChanBackupSnapshot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChanBackupSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChanBackupSnapshot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChanBackupSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChanBackupSnapshot;

        /**
         * Decodes a ChanBackupSnapshot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChanBackupSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChanBackupSnapshot;

        /**
         * Verifies a ChanBackupSnapshot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChanBackupSnapshot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChanBackupSnapshot
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChanBackupSnapshot;

        /**
         * Creates a plain object from a ChanBackupSnapshot message. Also converts values to other types if specified.
         * @param message ChanBackupSnapshot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChanBackupSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChanBackupSnapshot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelBackups. */
    interface IChannelBackups {

        /** ChannelBackups chanBackups */
        chanBackups?: (lnrpc.IChannelBackup[]|null);
    }

    /** Represents a ChannelBackups. */
    class ChannelBackups implements IChannelBackups {

        /**
         * Constructs a new ChannelBackups.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelBackups);

        /** ChannelBackups chanBackups. */
        public chanBackups: lnrpc.IChannelBackup[];

        /**
         * Creates a new ChannelBackups instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelBackups instance
         */
        public static create(properties?: lnrpc.IChannelBackups): lnrpc.ChannelBackups;

        /**
         * Encodes the specified ChannelBackups message. Does not implicitly {@link lnrpc.ChannelBackups.verify|verify} messages.
         * @param message ChannelBackups message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelBackups, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelBackups message, length delimited. Does not implicitly {@link lnrpc.ChannelBackups.verify|verify} messages.
         * @param message ChannelBackups message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelBackups, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelBackups message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelBackups
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelBackups;

        /**
         * Decodes a ChannelBackups message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelBackups
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelBackups;

        /**
         * Verifies a ChannelBackups message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelBackups message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelBackups
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelBackups;

        /**
         * Creates a plain object from a ChannelBackups message. Also converts values to other types if specified.
         * @param message ChannelBackups
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelBackups, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelBackups to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RestoreChanBackupRequest. */
    interface IRestoreChanBackupRequest {

        /** RestoreChanBackupRequest chanBackups */
        chanBackups?: (lnrpc.IChannelBackups|null);

        /** RestoreChanBackupRequest multiChanBackup */
        multiChanBackup?: (Uint8Array|null);
    }

    /** Represents a RestoreChanBackupRequest. */
    class RestoreChanBackupRequest implements IRestoreChanBackupRequest {

        /**
         * Constructs a new RestoreChanBackupRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IRestoreChanBackupRequest);

        /** RestoreChanBackupRequest chanBackups. */
        public chanBackups?: (lnrpc.IChannelBackups|null);

        /** RestoreChanBackupRequest multiChanBackup. */
        public multiChanBackup: Uint8Array;

        /** RestoreChanBackupRequest backup. */
        public backup?: ("chanBackups"|"multiChanBackup");

        /**
         * Creates a new RestoreChanBackupRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RestoreChanBackupRequest instance
         */
        public static create(properties?: lnrpc.IRestoreChanBackupRequest): lnrpc.RestoreChanBackupRequest;

        /**
         * Encodes the specified RestoreChanBackupRequest message. Does not implicitly {@link lnrpc.RestoreChanBackupRequest.verify|verify} messages.
         * @param message RestoreChanBackupRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IRestoreChanBackupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RestoreChanBackupRequest message, length delimited. Does not implicitly {@link lnrpc.RestoreChanBackupRequest.verify|verify} messages.
         * @param message RestoreChanBackupRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IRestoreChanBackupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RestoreChanBackupRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RestoreChanBackupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.RestoreChanBackupRequest;

        /**
         * Decodes a RestoreChanBackupRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RestoreChanBackupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.RestoreChanBackupRequest;

        /**
         * Verifies a RestoreChanBackupRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RestoreChanBackupRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RestoreChanBackupRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.RestoreChanBackupRequest;

        /**
         * Creates a plain object from a RestoreChanBackupRequest message. Also converts values to other types if specified.
         * @param message RestoreChanBackupRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.RestoreChanBackupRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RestoreChanBackupRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RestoreBackupResponse. */
    interface IRestoreBackupResponse {
    }

    /** Represents a RestoreBackupResponse. */
    class RestoreBackupResponse implements IRestoreBackupResponse {

        /**
         * Constructs a new RestoreBackupResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IRestoreBackupResponse);

        /**
         * Creates a new RestoreBackupResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RestoreBackupResponse instance
         */
        public static create(properties?: lnrpc.IRestoreBackupResponse): lnrpc.RestoreBackupResponse;

        /**
         * Encodes the specified RestoreBackupResponse message. Does not implicitly {@link lnrpc.RestoreBackupResponse.verify|verify} messages.
         * @param message RestoreBackupResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IRestoreBackupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RestoreBackupResponse message, length delimited. Does not implicitly {@link lnrpc.RestoreBackupResponse.verify|verify} messages.
         * @param message RestoreBackupResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IRestoreBackupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RestoreBackupResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RestoreBackupResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.RestoreBackupResponse;

        /**
         * Decodes a RestoreBackupResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RestoreBackupResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.RestoreBackupResponse;

        /**
         * Verifies a RestoreBackupResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RestoreBackupResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RestoreBackupResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.RestoreBackupResponse;

        /**
         * Creates a plain object from a RestoreBackupResponse message. Also converts values to other types if specified.
         * @param message RestoreBackupResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.RestoreBackupResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RestoreBackupResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChannelBackupSubscription. */
    interface IChannelBackupSubscription {
    }

    /** Represents a ChannelBackupSubscription. */
    class ChannelBackupSubscription implements IChannelBackupSubscription {

        /**
         * Constructs a new ChannelBackupSubscription.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelBackupSubscription);

        /**
         * Creates a new ChannelBackupSubscription instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelBackupSubscription instance
         */
        public static create(properties?: lnrpc.IChannelBackupSubscription): lnrpc.ChannelBackupSubscription;

        /**
         * Encodes the specified ChannelBackupSubscription message. Does not implicitly {@link lnrpc.ChannelBackupSubscription.verify|verify} messages.
         * @param message ChannelBackupSubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelBackupSubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelBackupSubscription message, length delimited. Does not implicitly {@link lnrpc.ChannelBackupSubscription.verify|verify} messages.
         * @param message ChannelBackupSubscription message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelBackupSubscription, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelBackupSubscription message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelBackupSubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelBackupSubscription;

        /**
         * Decodes a ChannelBackupSubscription message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelBackupSubscription
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelBackupSubscription;

        /**
         * Verifies a ChannelBackupSubscription message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelBackupSubscription message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelBackupSubscription
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelBackupSubscription;

        /**
         * Creates a plain object from a ChannelBackupSubscription message. Also converts values to other types if specified.
         * @param message ChannelBackupSubscription
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelBackupSubscription, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelBackupSubscription to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a VerifyChanBackupResponse. */
    interface IVerifyChanBackupResponse {
    }

    /** Represents a VerifyChanBackupResponse. */
    class VerifyChanBackupResponse implements IVerifyChanBackupResponse {

        /**
         * Constructs a new VerifyChanBackupResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IVerifyChanBackupResponse);

        /**
         * Creates a new VerifyChanBackupResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VerifyChanBackupResponse instance
         */
        public static create(properties?: lnrpc.IVerifyChanBackupResponse): lnrpc.VerifyChanBackupResponse;

        /**
         * Encodes the specified VerifyChanBackupResponse message. Does not implicitly {@link lnrpc.VerifyChanBackupResponse.verify|verify} messages.
         * @param message VerifyChanBackupResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IVerifyChanBackupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VerifyChanBackupResponse message, length delimited. Does not implicitly {@link lnrpc.VerifyChanBackupResponse.verify|verify} messages.
         * @param message VerifyChanBackupResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IVerifyChanBackupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VerifyChanBackupResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VerifyChanBackupResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.VerifyChanBackupResponse;

        /**
         * Decodes a VerifyChanBackupResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VerifyChanBackupResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.VerifyChanBackupResponse;

        /**
         * Verifies a VerifyChanBackupResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VerifyChanBackupResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VerifyChanBackupResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.VerifyChanBackupResponse;

        /**
         * Creates a plain object from a VerifyChanBackupResponse message. Also converts values to other types if specified.
         * @param message VerifyChanBackupResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.VerifyChanBackupResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VerifyChanBackupResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MacaroonPermission. */
    interface IMacaroonPermission {

        /** MacaroonPermission entity */
        entity?: (string|null);

        /** MacaroonPermission action */
        action?: (string|null);
    }

    /** Represents a MacaroonPermission. */
    class MacaroonPermission implements IMacaroonPermission {

        /**
         * Constructs a new MacaroonPermission.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IMacaroonPermission);

        /** MacaroonPermission entity. */
        public entity: string;

        /** MacaroonPermission action. */
        public action: string;

        /**
         * Creates a new MacaroonPermission instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MacaroonPermission instance
         */
        public static create(properties?: lnrpc.IMacaroonPermission): lnrpc.MacaroonPermission;

        /**
         * Encodes the specified MacaroonPermission message. Does not implicitly {@link lnrpc.MacaroonPermission.verify|verify} messages.
         * @param message MacaroonPermission message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IMacaroonPermission, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MacaroonPermission message, length delimited. Does not implicitly {@link lnrpc.MacaroonPermission.verify|verify} messages.
         * @param message MacaroonPermission message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IMacaroonPermission, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MacaroonPermission message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MacaroonPermission
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.MacaroonPermission;

        /**
         * Decodes a MacaroonPermission message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MacaroonPermission
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.MacaroonPermission;

        /**
         * Verifies a MacaroonPermission message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MacaroonPermission message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MacaroonPermission
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.MacaroonPermission;

        /**
         * Creates a plain object from a MacaroonPermission message. Also converts values to other types if specified.
         * @param message MacaroonPermission
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.MacaroonPermission, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MacaroonPermission to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BakeMacaroonRequest. */
    interface IBakeMacaroonRequest {

        /** BakeMacaroonRequest permissions */
        permissions?: (lnrpc.IMacaroonPermission[]|null);

        /** BakeMacaroonRequest rootKeyId */
        rootKeyId?: (number|Long|null);
    }

    /** Represents a BakeMacaroonRequest. */
    class BakeMacaroonRequest implements IBakeMacaroonRequest {

        /**
         * Constructs a new BakeMacaroonRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IBakeMacaroonRequest);

        /** BakeMacaroonRequest permissions. */
        public permissions: lnrpc.IMacaroonPermission[];

        /** BakeMacaroonRequest rootKeyId. */
        public rootKeyId: (number|Long);

        /**
         * Creates a new BakeMacaroonRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BakeMacaroonRequest instance
         */
        public static create(properties?: lnrpc.IBakeMacaroonRequest): lnrpc.BakeMacaroonRequest;

        /**
         * Encodes the specified BakeMacaroonRequest message. Does not implicitly {@link lnrpc.BakeMacaroonRequest.verify|verify} messages.
         * @param message BakeMacaroonRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IBakeMacaroonRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BakeMacaroonRequest message, length delimited. Does not implicitly {@link lnrpc.BakeMacaroonRequest.verify|verify} messages.
         * @param message BakeMacaroonRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IBakeMacaroonRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BakeMacaroonRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BakeMacaroonRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.BakeMacaroonRequest;

        /**
         * Decodes a BakeMacaroonRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BakeMacaroonRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.BakeMacaroonRequest;

        /**
         * Verifies a BakeMacaroonRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BakeMacaroonRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BakeMacaroonRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.BakeMacaroonRequest;

        /**
         * Creates a plain object from a BakeMacaroonRequest message. Also converts values to other types if specified.
         * @param message BakeMacaroonRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.BakeMacaroonRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BakeMacaroonRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BakeMacaroonResponse. */
    interface IBakeMacaroonResponse {

        /** BakeMacaroonResponse macaroon */
        macaroon?: (string|null);
    }

    /** Represents a BakeMacaroonResponse. */
    class BakeMacaroonResponse implements IBakeMacaroonResponse {

        /**
         * Constructs a new BakeMacaroonResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IBakeMacaroonResponse);

        /** BakeMacaroonResponse macaroon. */
        public macaroon: string;

        /**
         * Creates a new BakeMacaroonResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BakeMacaroonResponse instance
         */
        public static create(properties?: lnrpc.IBakeMacaroonResponse): lnrpc.BakeMacaroonResponse;

        /**
         * Encodes the specified BakeMacaroonResponse message. Does not implicitly {@link lnrpc.BakeMacaroonResponse.verify|verify} messages.
         * @param message BakeMacaroonResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IBakeMacaroonResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BakeMacaroonResponse message, length delimited. Does not implicitly {@link lnrpc.BakeMacaroonResponse.verify|verify} messages.
         * @param message BakeMacaroonResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IBakeMacaroonResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BakeMacaroonResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BakeMacaroonResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.BakeMacaroonResponse;

        /**
         * Decodes a BakeMacaroonResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BakeMacaroonResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.BakeMacaroonResponse;

        /**
         * Verifies a BakeMacaroonResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BakeMacaroonResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BakeMacaroonResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.BakeMacaroonResponse;

        /**
         * Creates a plain object from a BakeMacaroonResponse message. Also converts values to other types if specified.
         * @param message BakeMacaroonResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.BakeMacaroonResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BakeMacaroonResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListMacaroonIDsRequest. */
    interface IListMacaroonIDsRequest {
    }

    /** Represents a ListMacaroonIDsRequest. */
    class ListMacaroonIDsRequest implements IListMacaroonIDsRequest {

        /**
         * Constructs a new ListMacaroonIDsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListMacaroonIDsRequest);

        /**
         * Creates a new ListMacaroonIDsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListMacaroonIDsRequest instance
         */
        public static create(properties?: lnrpc.IListMacaroonIDsRequest): lnrpc.ListMacaroonIDsRequest;

        /**
         * Encodes the specified ListMacaroonIDsRequest message. Does not implicitly {@link lnrpc.ListMacaroonIDsRequest.verify|verify} messages.
         * @param message ListMacaroonIDsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListMacaroonIDsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListMacaroonIDsRequest message, length delimited. Does not implicitly {@link lnrpc.ListMacaroonIDsRequest.verify|verify} messages.
         * @param message ListMacaroonIDsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListMacaroonIDsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListMacaroonIDsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListMacaroonIDsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListMacaroonIDsRequest;

        /**
         * Decodes a ListMacaroonIDsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListMacaroonIDsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListMacaroonIDsRequest;

        /**
         * Verifies a ListMacaroonIDsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListMacaroonIDsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListMacaroonIDsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListMacaroonIDsRequest;

        /**
         * Creates a plain object from a ListMacaroonIDsRequest message. Also converts values to other types if specified.
         * @param message ListMacaroonIDsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListMacaroonIDsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListMacaroonIDsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListMacaroonIDsResponse. */
    interface IListMacaroonIDsResponse {

        /** ListMacaroonIDsResponse rootKeyIds */
        rootKeyIds?: ((number|Long)[]|null);
    }

    /** Represents a ListMacaroonIDsResponse. */
    class ListMacaroonIDsResponse implements IListMacaroonIDsResponse {

        /**
         * Constructs a new ListMacaroonIDsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListMacaroonIDsResponse);

        /** ListMacaroonIDsResponse rootKeyIds. */
        public rootKeyIds: (number|Long)[];

        /**
         * Creates a new ListMacaroonIDsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListMacaroonIDsResponse instance
         */
        public static create(properties?: lnrpc.IListMacaroonIDsResponse): lnrpc.ListMacaroonIDsResponse;

        /**
         * Encodes the specified ListMacaroonIDsResponse message. Does not implicitly {@link lnrpc.ListMacaroonIDsResponse.verify|verify} messages.
         * @param message ListMacaroonIDsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListMacaroonIDsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListMacaroonIDsResponse message, length delimited. Does not implicitly {@link lnrpc.ListMacaroonIDsResponse.verify|verify} messages.
         * @param message ListMacaroonIDsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListMacaroonIDsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListMacaroonIDsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListMacaroonIDsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListMacaroonIDsResponse;

        /**
         * Decodes a ListMacaroonIDsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListMacaroonIDsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListMacaroonIDsResponse;

        /**
         * Verifies a ListMacaroonIDsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListMacaroonIDsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListMacaroonIDsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListMacaroonIDsResponse;

        /**
         * Creates a plain object from a ListMacaroonIDsResponse message. Also converts values to other types if specified.
         * @param message ListMacaroonIDsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListMacaroonIDsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListMacaroonIDsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeleteMacaroonIDRequest. */
    interface IDeleteMacaroonIDRequest {

        /** DeleteMacaroonIDRequest rootKeyId */
        rootKeyId?: (number|Long|null);
    }

    /** Represents a DeleteMacaroonIDRequest. */
    class DeleteMacaroonIDRequest implements IDeleteMacaroonIDRequest {

        /**
         * Constructs a new DeleteMacaroonIDRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IDeleteMacaroonIDRequest);

        /** DeleteMacaroonIDRequest rootKeyId. */
        public rootKeyId: (number|Long);

        /**
         * Creates a new DeleteMacaroonIDRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteMacaroonIDRequest instance
         */
        public static create(properties?: lnrpc.IDeleteMacaroonIDRequest): lnrpc.DeleteMacaroonIDRequest;

        /**
         * Encodes the specified DeleteMacaroonIDRequest message. Does not implicitly {@link lnrpc.DeleteMacaroonIDRequest.verify|verify} messages.
         * @param message DeleteMacaroonIDRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IDeleteMacaroonIDRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteMacaroonIDRequest message, length delimited. Does not implicitly {@link lnrpc.DeleteMacaroonIDRequest.verify|verify} messages.
         * @param message DeleteMacaroonIDRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IDeleteMacaroonIDRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteMacaroonIDRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteMacaroonIDRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.DeleteMacaroonIDRequest;

        /**
         * Decodes a DeleteMacaroonIDRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteMacaroonIDRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.DeleteMacaroonIDRequest;

        /**
         * Verifies a DeleteMacaroonIDRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteMacaroonIDRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteMacaroonIDRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.DeleteMacaroonIDRequest;

        /**
         * Creates a plain object from a DeleteMacaroonIDRequest message. Also converts values to other types if specified.
         * @param message DeleteMacaroonIDRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.DeleteMacaroonIDRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteMacaroonIDRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeleteMacaroonIDResponse. */
    interface IDeleteMacaroonIDResponse {

        /** DeleteMacaroonIDResponse deleted */
        deleted?: (boolean|null);
    }

    /** Represents a DeleteMacaroonIDResponse. */
    class DeleteMacaroonIDResponse implements IDeleteMacaroonIDResponse {

        /**
         * Constructs a new DeleteMacaroonIDResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IDeleteMacaroonIDResponse);

        /** DeleteMacaroonIDResponse deleted. */
        public deleted: boolean;

        /**
         * Creates a new DeleteMacaroonIDResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteMacaroonIDResponse instance
         */
        public static create(properties?: lnrpc.IDeleteMacaroonIDResponse): lnrpc.DeleteMacaroonIDResponse;

        /**
         * Encodes the specified DeleteMacaroonIDResponse message. Does not implicitly {@link lnrpc.DeleteMacaroonIDResponse.verify|verify} messages.
         * @param message DeleteMacaroonIDResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IDeleteMacaroonIDResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteMacaroonIDResponse message, length delimited. Does not implicitly {@link lnrpc.DeleteMacaroonIDResponse.verify|verify} messages.
         * @param message DeleteMacaroonIDResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IDeleteMacaroonIDResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteMacaroonIDResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteMacaroonIDResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.DeleteMacaroonIDResponse;

        /**
         * Decodes a DeleteMacaroonIDResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteMacaroonIDResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.DeleteMacaroonIDResponse;

        /**
         * Verifies a DeleteMacaroonIDResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteMacaroonIDResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteMacaroonIDResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.DeleteMacaroonIDResponse;

        /**
         * Creates a plain object from a DeleteMacaroonIDResponse message. Also converts values to other types if specified.
         * @param message DeleteMacaroonIDResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.DeleteMacaroonIDResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteMacaroonIDResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MacaroonPermissionList. */
    interface IMacaroonPermissionList {

        /** MacaroonPermissionList permissions */
        permissions?: (lnrpc.IMacaroonPermission[]|null);
    }

    /** Represents a MacaroonPermissionList. */
    class MacaroonPermissionList implements IMacaroonPermissionList {

        /**
         * Constructs a new MacaroonPermissionList.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IMacaroonPermissionList);

        /** MacaroonPermissionList permissions. */
        public permissions: lnrpc.IMacaroonPermission[];

        /**
         * Creates a new MacaroonPermissionList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MacaroonPermissionList instance
         */
        public static create(properties?: lnrpc.IMacaroonPermissionList): lnrpc.MacaroonPermissionList;

        /**
         * Encodes the specified MacaroonPermissionList message. Does not implicitly {@link lnrpc.MacaroonPermissionList.verify|verify} messages.
         * @param message MacaroonPermissionList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IMacaroonPermissionList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MacaroonPermissionList message, length delimited. Does not implicitly {@link lnrpc.MacaroonPermissionList.verify|verify} messages.
         * @param message MacaroonPermissionList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IMacaroonPermissionList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MacaroonPermissionList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MacaroonPermissionList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.MacaroonPermissionList;

        /**
         * Decodes a MacaroonPermissionList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MacaroonPermissionList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.MacaroonPermissionList;

        /**
         * Verifies a MacaroonPermissionList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MacaroonPermissionList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MacaroonPermissionList
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.MacaroonPermissionList;

        /**
         * Creates a plain object from a MacaroonPermissionList message. Also converts values to other types if specified.
         * @param message MacaroonPermissionList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.MacaroonPermissionList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MacaroonPermissionList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListPermissionsRequest. */
    interface IListPermissionsRequest {
    }

    /** Represents a ListPermissionsRequest. */
    class ListPermissionsRequest implements IListPermissionsRequest {

        /**
         * Constructs a new ListPermissionsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListPermissionsRequest);

        /**
         * Creates a new ListPermissionsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPermissionsRequest instance
         */
        public static create(properties?: lnrpc.IListPermissionsRequest): lnrpc.ListPermissionsRequest;

        /**
         * Encodes the specified ListPermissionsRequest message. Does not implicitly {@link lnrpc.ListPermissionsRequest.verify|verify} messages.
         * @param message ListPermissionsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListPermissionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPermissionsRequest message, length delimited. Does not implicitly {@link lnrpc.ListPermissionsRequest.verify|verify} messages.
         * @param message ListPermissionsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListPermissionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPermissionsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPermissionsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListPermissionsRequest;

        /**
         * Decodes a ListPermissionsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPermissionsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListPermissionsRequest;

        /**
         * Verifies a ListPermissionsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPermissionsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPermissionsRequest
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListPermissionsRequest;

        /**
         * Creates a plain object from a ListPermissionsRequest message. Also converts values to other types if specified.
         * @param message ListPermissionsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListPermissionsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPermissionsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ListPermissionsResponse. */
    interface IListPermissionsResponse {

        /** ListPermissionsResponse methodPermissions */
        methodPermissions?: ({ [k: string]: lnrpc.IMacaroonPermissionList }|null);
    }

    /** Represents a ListPermissionsResponse. */
    class ListPermissionsResponse implements IListPermissionsResponse {

        /**
         * Constructs a new ListPermissionsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IListPermissionsResponse);

        /** ListPermissionsResponse methodPermissions. */
        public methodPermissions: { [k: string]: lnrpc.IMacaroonPermissionList };

        /**
         * Creates a new ListPermissionsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPermissionsResponse instance
         */
        public static create(properties?: lnrpc.IListPermissionsResponse): lnrpc.ListPermissionsResponse;

        /**
         * Encodes the specified ListPermissionsResponse message. Does not implicitly {@link lnrpc.ListPermissionsResponse.verify|verify} messages.
         * @param message ListPermissionsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IListPermissionsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPermissionsResponse message, length delimited. Does not implicitly {@link lnrpc.ListPermissionsResponse.verify|verify} messages.
         * @param message ListPermissionsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IListPermissionsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPermissionsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPermissionsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ListPermissionsResponse;

        /**
         * Decodes a ListPermissionsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPermissionsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ListPermissionsResponse;

        /**
         * Verifies a ListPermissionsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPermissionsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPermissionsResponse
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ListPermissionsResponse;

        /**
         * Creates a plain object from a ListPermissionsResponse message. Also converts values to other types if specified.
         * @param message ListPermissionsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ListPermissionsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPermissionsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Failure. */
    interface IFailure {

        /** Failure code */
        code?: (lnrpc.Failure.FailureCode|null);

        /** Failure channelUpdate */
        channelUpdate?: (lnrpc.IChannelUpdate|null);

        /** Failure htlcMsat */
        htlcMsat?: (number|Long|null);

        /** Failure onionSha_256 */
        onionSha_256?: (Uint8Array|null);

        /** Failure cltvExpiry */
        cltvExpiry?: (number|null);

        /** Failure flags */
        flags?: (number|null);

        /** Failure failureSourceIndex */
        failureSourceIndex?: (number|null);

        /** Failure height */
        height?: (number|null);
    }

    /** Represents a Failure. */
    class Failure implements IFailure {

        /**
         * Constructs a new Failure.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IFailure);

        /** Failure code. */
        public code: lnrpc.Failure.FailureCode;

        /** Failure channelUpdate. */
        public channelUpdate?: (lnrpc.IChannelUpdate|null);

        /** Failure htlcMsat. */
        public htlcMsat: (number|Long);

        /** Failure onionSha_256. */
        public onionSha_256: Uint8Array;

        /** Failure cltvExpiry. */
        public cltvExpiry: number;

        /** Failure flags. */
        public flags: number;

        /** Failure failureSourceIndex. */
        public failureSourceIndex: number;

        /** Failure height. */
        public height: number;

        /**
         * Creates a new Failure instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Failure instance
         */
        public static create(properties?: lnrpc.IFailure): lnrpc.Failure;

        /**
         * Encodes the specified Failure message. Does not implicitly {@link lnrpc.Failure.verify|verify} messages.
         * @param message Failure message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IFailure, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Failure message, length delimited. Does not implicitly {@link lnrpc.Failure.verify|verify} messages.
         * @param message Failure message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IFailure, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Failure message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Failure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Failure;

        /**
         * Decodes a Failure message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Failure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Failure;

        /**
         * Verifies a Failure message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Failure message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Failure
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Failure;

        /**
         * Creates a plain object from a Failure message. Also converts values to other types if specified.
         * @param message Failure
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Failure, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Failure to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Failure {

        /** FailureCode enum. */
        enum FailureCode {
            RESERVED = 0,
            INCORRECT_OR_UNKNOWN_PAYMENT_DETAILS = 1,
            INCORRECT_PAYMENT_AMOUNT = 2,
            FINAL_INCORRECT_CLTV_EXPIRY = 3,
            FINAL_INCORRECT_HTLC_AMOUNT = 4,
            FINAL_EXPIRY_TOO_SOON = 5,
            INVALID_REALM = 6,
            EXPIRY_TOO_SOON = 7,
            INVALID_ONION_VERSION = 8,
            INVALID_ONION_HMAC = 9,
            INVALID_ONION_KEY = 10,
            AMOUNT_BELOW_MINIMUM = 11,
            FEE_INSUFFICIENT = 12,
            INCORRECT_CLTV_EXPIRY = 13,
            CHANNEL_DISABLED = 14,
            TEMPORARY_CHANNEL_FAILURE = 15,
            REQUIRED_NODE_FEATURE_MISSING = 16,
            REQUIRED_CHANNEL_FEATURE_MISSING = 17,
            UNKNOWN_NEXT_PEER = 18,
            TEMPORARY_NODE_FAILURE = 19,
            PERMANENT_NODE_FAILURE = 20,
            PERMANENT_CHANNEL_FAILURE = 21,
            EXPIRY_TOO_FAR = 22,
            MPP_TIMEOUT = 23,
            INTERNAL_FAILURE = 997,
            UNKNOWN_FAILURE = 998,
            UNREADABLE_FAILURE = 999
        }
    }

    /** Properties of a ChannelUpdate. */
    interface IChannelUpdate {

        /** ChannelUpdate signature */
        signature?: (Uint8Array|null);

        /** ChannelUpdate chainHash */
        chainHash?: (Uint8Array|null);

        /** ChannelUpdate chanId */
        chanId?: (number|Long|null);

        /** ChannelUpdate timestamp */
        timestamp?: (number|null);

        /** ChannelUpdate messageFlags */
        messageFlags?: (number|null);

        /** ChannelUpdate channelFlags */
        channelFlags?: (number|null);

        /** ChannelUpdate timeLockDelta */
        timeLockDelta?: (number|null);

        /** ChannelUpdate htlcMinimumMsat */
        htlcMinimumMsat?: (number|Long|null);

        /** ChannelUpdate baseFee */
        baseFee?: (number|null);

        /** ChannelUpdate feeRate */
        feeRate?: (number|null);

        /** ChannelUpdate htlcMaximumMsat */
        htlcMaximumMsat?: (number|Long|null);

        /** ChannelUpdate extraOpaqueData */
        extraOpaqueData?: (Uint8Array|null);
    }

    /** Represents a ChannelUpdate. */
    class ChannelUpdate implements IChannelUpdate {

        /**
         * Constructs a new ChannelUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IChannelUpdate);

        /** ChannelUpdate signature. */
        public signature: Uint8Array;

        /** ChannelUpdate chainHash. */
        public chainHash: Uint8Array;

        /** ChannelUpdate chanId. */
        public chanId: (number|Long);

        /** ChannelUpdate timestamp. */
        public timestamp: number;

        /** ChannelUpdate messageFlags. */
        public messageFlags: number;

        /** ChannelUpdate channelFlags. */
        public channelFlags: number;

        /** ChannelUpdate timeLockDelta. */
        public timeLockDelta: number;

        /** ChannelUpdate htlcMinimumMsat. */
        public htlcMinimumMsat: (number|Long);

        /** ChannelUpdate baseFee. */
        public baseFee: number;

        /** ChannelUpdate feeRate. */
        public feeRate: number;

        /** ChannelUpdate htlcMaximumMsat. */
        public htlcMaximumMsat: (number|Long);

        /** ChannelUpdate extraOpaqueData. */
        public extraOpaqueData: Uint8Array;

        /**
         * Creates a new ChannelUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChannelUpdate instance
         */
        public static create(properties?: lnrpc.IChannelUpdate): lnrpc.ChannelUpdate;

        /**
         * Encodes the specified ChannelUpdate message. Does not implicitly {@link lnrpc.ChannelUpdate.verify|verify} messages.
         * @param message ChannelUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IChannelUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChannelUpdate message, length delimited. Does not implicitly {@link lnrpc.ChannelUpdate.verify|verify} messages.
         * @param message ChannelUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IChannelUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChannelUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChannelUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.ChannelUpdate;

        /**
         * Decodes a ChannelUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChannelUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.ChannelUpdate;

        /**
         * Verifies a ChannelUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChannelUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChannelUpdate
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.ChannelUpdate;

        /**
         * Creates a plain object from a ChannelUpdate message. Also converts values to other types if specified.
         * @param message ChannelUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.ChannelUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChannelUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MacaroonId. */
    interface IMacaroonId {

        /** MacaroonId nonce */
        nonce?: (Uint8Array|null);

        /** MacaroonId storageId */
        storageId?: (Uint8Array|null);

        /** MacaroonId ops */
        ops?: (lnrpc.IOp[]|null);
    }

    /** Represents a MacaroonId. */
    class MacaroonId implements IMacaroonId {

        /**
         * Constructs a new MacaroonId.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IMacaroonId);

        /** MacaroonId nonce. */
        public nonce: Uint8Array;

        /** MacaroonId storageId. */
        public storageId: Uint8Array;

        /** MacaroonId ops. */
        public ops: lnrpc.IOp[];

        /**
         * Creates a new MacaroonId instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MacaroonId instance
         */
        public static create(properties?: lnrpc.IMacaroonId): lnrpc.MacaroonId;

        /**
         * Encodes the specified MacaroonId message. Does not implicitly {@link lnrpc.MacaroonId.verify|verify} messages.
         * @param message MacaroonId message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IMacaroonId, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MacaroonId message, length delimited. Does not implicitly {@link lnrpc.MacaroonId.verify|verify} messages.
         * @param message MacaroonId message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IMacaroonId, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MacaroonId message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MacaroonId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.MacaroonId;

        /**
         * Decodes a MacaroonId message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MacaroonId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.MacaroonId;

        /**
         * Verifies a MacaroonId message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MacaroonId message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MacaroonId
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.MacaroonId;

        /**
         * Creates a plain object from a MacaroonId message. Also converts values to other types if specified.
         * @param message MacaroonId
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.MacaroonId, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MacaroonId to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Op. */
    interface IOp {

        /** Op entity */
        entity?: (string|null);

        /** Op actions */
        actions?: (string[]|null);
    }

    /** Represents an Op. */
    class Op implements IOp {

        /**
         * Constructs a new Op.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.IOp);

        /** Op entity. */
        public entity: string;

        /** Op actions. */
        public actions: string[];

        /**
         * Creates a new Op instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Op instance
         */
        public static create(properties?: lnrpc.IOp): lnrpc.Op;

        /**
         * Encodes the specified Op message. Does not implicitly {@link lnrpc.Op.verify|verify} messages.
         * @param message Op message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: lnrpc.IOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Op message, length delimited. Does not implicitly {@link lnrpc.Op.verify|verify} messages.
         * @param message Op message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: lnrpc.IOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Op message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Op
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): lnrpc.Op;

        /**
         * Decodes an Op message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Op
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): lnrpc.Op;

        /**
         * Verifies an Op message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Op message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Op
         */
        public static fromObject(object: { [k: string]: any }): lnrpc.Op;

        /**
         * Creates a plain object from an Op message. Also converts values to other types if specified.
         * @param message Op
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: lnrpc.Op, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Op to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
