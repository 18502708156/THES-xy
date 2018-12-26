namespace Sproto {
	export class SprotoReceiver {
		private static mProtocol: ProtocolFunctionDictionary;
		private static m_RpcReqHandlerDict: { [key: number]: any};

		public static Init(protocol: ProtocolFunctionDictionary): void {
			SprotoReceiver.m_RpcReqHandlerDict = {};
			SprotoReceiver.mProtocol = protocol;
		}

		public static AddHandler(tag: number, rpc: Function, thisObj: any): void {
            if (!rpc) {
				return;
			}
			if (DEBUG) {
				if (SprotoReceiver.m_RpcReqHandlerDict[tag]) {
					console.error("重复注册协议 => " + tag)
				}
			}
			SprotoReceiver.m_RpcReqHandlerDict[tag] = {HandlerFunc: rpc, thisObject: thisObj}
		}

		public static AddHandlers(tag: number, rpc: Function, thisObj: any): void {
            if (!rpc) {
				return;
			}
			let data = SprotoReceiver.m_RpcReqHandlerDict[tag]
			if (data == null) {
				data = {}
				data.HandlerFunc = function(rsp) {
					for (let listData of this.list) {
						listData.func.call(listData.obj, rsp)
					}
				}
				data.thisObject = data
				data.list = []
				SprotoReceiver.m_RpcReqHandlerDict[tag] = data
			}
			data.list.push({func: rpc, obj: thisObj})
		}

		public static HandlerType(tag: number, session: number, data: Uint8Array, offset: number): SprotoTypeBase {
			let funcObj = SprotoReceiver.m_RpcReqHandlerDict[tag];
			if (funcObj == null) {
				console.log("无法处理消息", tag);
				return null;
			}

			let rsp = SprotoReceiver.mProtocol.GenRequest(tag, data, offset)
			// console.log("HandlerType => " + tag)
            // console.log(rsp)
            // console.log("")
			let rpcRsp = funcObj.HandlerFunc.call(funcObj.thisObject, rsp)

			if (session != null) {
				return rpcRsp;
			}

			return null;
		}
	}

	// class ReceiverData {

	// 	thisObject: any

	// 	HandlerFunc(rsp) {
	// 		for (let listData of this.m_list) {
	// 			listData.func.call(listData.obj, rsp)
	// 		}
	// 	}

	// 	constructor() {
	// 		this.thisObject = this
	// 	}

	// 	private m_list: {func: Function, obj: any}[] = []
	// }
}