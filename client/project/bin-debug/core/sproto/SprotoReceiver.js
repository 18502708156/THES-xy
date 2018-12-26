var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var SprotoReceiver = (function () {
        function SprotoReceiver() {
        }
        SprotoReceiver.Init = function (protocol) {
            SprotoReceiver.m_RpcReqHandlerDict = {};
            SprotoReceiver.mProtocol = protocol;
        };
        SprotoReceiver.AddHandler = function (tag, rpc, thisObj) {
            if (!rpc) {
                return;
            }
            if (true) {
                if (SprotoReceiver.m_RpcReqHandlerDict[tag]) {
                    console.error("重复注册协议 => " + tag);
                }
            }
            SprotoReceiver.m_RpcReqHandlerDict[tag] = { HandlerFunc: rpc, thisObject: thisObj };
        };
        SprotoReceiver.AddHandlers = function (tag, rpc, thisObj) {
            if (!rpc) {
                return;
            }
            var data = SprotoReceiver.m_RpcReqHandlerDict[tag];
            if (data == null) {
                data = {};
                data.HandlerFunc = function (rsp) {
                    for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
                        var listData = _a[_i];
                        listData.func.call(listData.obj, rsp);
                    }
                };
                data.thisObject = data;
                data.list = [];
                SprotoReceiver.m_RpcReqHandlerDict[tag] = data;
            }
            data.list.push({ func: rpc, obj: thisObj });
        };
        SprotoReceiver.HandlerType = function (tag, session, data, offset) {
            var funcObj = SprotoReceiver.m_RpcReqHandlerDict[tag];
            if (funcObj == null) {
                console.log("无法处理消息", tag);
                return null;
            }
            var rsp = SprotoReceiver.mProtocol.GenRequest(tag, data, offset);
            // console.log("HandlerType => " + tag)
            // console.log(rsp)
            // console.log("")
            var rpcRsp = funcObj.HandlerFunc.call(funcObj.thisObject, rsp);
            if (session != null) {
                return rpcRsp;
            }
            return null;
        };
        return SprotoReceiver;
    }());
    Sproto.SprotoReceiver = SprotoReceiver;
    __reflect(SprotoReceiver.prototype, "Sproto.SprotoReceiver");
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
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SprotoReceiver.js.map