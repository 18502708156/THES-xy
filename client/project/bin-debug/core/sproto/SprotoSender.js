var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var SprotoSender = (function () {
        function SprotoSender() {
        }
        SprotoSender.Init = function (protocol) {
            SprotoSender.m_Session = 0;
            SprotoSender.m_RpcRspHandlerDict = {};
            SprotoSender.m_SessionDict = {};
            SprotoSender.m_SendPack = new Sproto.SprotoPack();
            SprotoSender.m_SendStream = new Sproto.SprotoStream();
            SprotoSender.m_Protocol = protocol;
        };
        SprotoSender.Pack = function (tag, rpcReq, rpcRspHandler, thisObj) {
            if (rpcReq === void 0) { rpcReq = null; }
            if (rpcRspHandler === void 0) { rpcRspHandler = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (rpcRspHandler != null) {
                var session = ++SprotoSender.m_Session;
                SprotoSender.m_RpcRspHandlerDict[session] = thisObj && rpcRspHandler.bind(thisObj) || rpcRspHandler;
                SprotoSender.m_SessionDict[session] = SprotoSender.m_Protocol.Get(tag).ResponseType;
                return SprotoSender.SendData(rpcReq, session, tag);
            }
            else {
                return SprotoSender.SendData(rpcReq, null, tag);
            }
        };
        SprotoSender.SendData = function (rpc, session, tag) {
            var pkg = new Sproto.Spackage();
            pkg.type = tag;
            if (session != null) {
                pkg.session = session;
            }
            var stream = SprotoSender.m_SendStream;
            stream.Seek(0, Sproto.SeekOrigin.Begin);
            var len = Sproto._encode_Spackage(pkg, 2, stream);
            if (rpc != null) {
                len += Sproto.ALL_DICT[SprotoSender.m_Protocol.Get(tag).RequestType].en(rpc, stream);
            }
            var data = SprotoSender.m_SendPack.Pack(stream.Buffer, len);
            if (data.length > SprotoSender.MAX_PACK_LEN) {
                console.log("data.Length > " + SprotoSender.MAX_PACK_LEN + " => " + data.length);
                return null;
            }
            return new egret.ByteArray(data.buffer);
        };
        SprotoSender.HandlerSession = function (session, data, offset) {
            var responseType = SprotoSender.m_SessionDict[session];
            var responseFunc = SprotoSender.m_RpcRspHandlerDict[session];
            if (responseType && responseFunc) {
                var de = Sproto.SprotoCore.GetDeserialize(data, offset, data.length);
                var obj = Sproto.ALL_DICT[responseType].de(de);
                Sproto.SprotoCore.CloseDeserialize(de);
                responseFunc(obj);
            }
            else {
                console.warn("SprotoSender.Handler not found => " + session);
            }
            SprotoSender.m_SessionDict[session] = null;
            SprotoSender.m_RpcRspHandlerDict[session] = null;
            delete SprotoSender.m_SessionDict[session];
            delete SprotoSender.m_RpcRspHandlerDict[session];
        };
        SprotoSender.MAX_PACK_LEN = (1 << 16) - 1;
        return SprotoSender;
    }());
    Sproto.SprotoSender = SprotoSender;
    __reflect(SprotoSender.prototype, "Sproto.SprotoSender");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SprotoSender.js.map