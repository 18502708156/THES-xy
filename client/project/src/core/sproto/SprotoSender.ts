namespace Sproto {
	export class SprotoSender {
		private static MAX_PACK_LEN = (1 << 16) - 1;

		private static m_SendPack: SprotoPack;
		private static m_SendStream: SprotoStream;

		private static m_Protocol: ProtocolFunctionDictionary;

		private static m_Session: number;
		private static m_RpcRspHandlerDict: {[key: number]: Function};
		private static m_SessionDict: {[key: number]: string};

		public static Init(protocol: ProtocolFunctionDictionary): void {
			SprotoSender.m_Session = 0;
			SprotoSender.m_RpcRspHandlerDict = {}
			SprotoSender.m_SessionDict = {}
			SprotoSender.m_SendPack = new SprotoPack();
			SprotoSender.m_SendStream = new SprotoStream();
			SprotoSender.m_Protocol = protocol;
		}

		public static Pack(tag: number, rpcReq: SprotoTypeBase = null, rpcRspHandler: Function = null, thisObj: any = null): egret.ByteArray {
			if (rpcRspHandler != null) {
				let session = ++SprotoSender.m_Session;
				SprotoSender.m_RpcRspHandlerDict[session] = thisObj && rpcRspHandler.bind(thisObj) || rpcRspHandler;
				SprotoSender.m_SessionDict[session] = SprotoSender.m_Protocol.Get(tag).ResponseType;
				return SprotoSender.SendData(rpcReq, session, tag)
			} else {
				return SprotoSender.SendData(rpcReq, null, tag)
			}
		}

		public static SendData(rpc: SprotoTypeBase, session, tag: number): egret.ByteArray {
			let pkg: Spackage = new Spackage();
			pkg.type = tag;
			if (session != null) {
				pkg.session = session;
			}
			let stream = SprotoSender.m_SendStream;
			stream.Seek(0, SeekOrigin.Begin);
			let len = _encode_Spackage(pkg, 2, stream)
			if (rpc != null) {
				len += Sproto.ALL_DICT[SprotoSender.m_Protocol.Get(tag).RequestType].en(rpc, stream)
			}

			let data: Uint8Array = SprotoSender.m_SendPack.Pack(stream.Buffer, len);
			if (data.length > SprotoSender.MAX_PACK_LEN) {
				console.log("data.Length > " + SprotoSender.MAX_PACK_LEN + " => " + data.length);
				return null;
			}

			return new egret.ByteArray(data.buffer);
		}

		public static HandlerSession(session: number, data: Uint8Array, offset: number): void {
			let responseType =  SprotoSender.m_SessionDict[session];
			let responseFunc = SprotoSender.m_RpcRspHandlerDict[session];
			if (responseType && responseFunc) {
				let de = SprotoCore.GetDeserialize(data, offset, data.length)
				let obj = Sproto.ALL_DICT[responseType].de(de)
				SprotoCore.CloseDeserialize(de)
				responseFunc(obj);
			} else {
				console.warn("SprotoSender.Handler not found => " + session);
			}
			SprotoSender.m_SessionDict[session] = null;
			SprotoSender.m_RpcRspHandlerDict[session] = null;

			delete SprotoSender.m_SessionDict[session];
			delete SprotoSender.m_RpcRspHandlerDict[session];
		}
	}
}