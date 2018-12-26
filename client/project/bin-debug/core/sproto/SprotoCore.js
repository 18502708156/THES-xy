var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    // {max: number, en: Function, de: Function}
    Sproto.ALL_DICT = {};
    var SprotoCore = (function () {
        function SprotoCore() {
        }
        SprotoCore.GetSerialize = function (st, max) {
            var ser = SprotoCore.mSerialize.pop();
            if (ser == null) {
                ser = new Sproto.SprotoTypeSerialize;
            }
            ser.Open(st, max);
            return ser;
        };
        SprotoCore.CloseSerialize = function (ser) {
            var n = ser.Close();
            SprotoCore.mSerialize.push(ser);
            return n;
        };
        SprotoCore.GetDeserialize = function (byteArray, offset, size) {
            var ser = SprotoCore.mDeserialize.pop();
            if (ser == null) {
                ser = new Sproto.SprotoTypeDeserialize;
            }
            ser.Init(byteArray, offset, size);
            return ser;
        };
        SprotoCore.CloseDeserialize = function (ser) {
            ser.Clear();
            SprotoCore.mDeserialize.push(ser);
        };
        SprotoCore.Init = function () {
            SprotoCore.m_ParserPack = new Sproto.SprotoPack();
            SprotoCore.m_Pkg = new Sproto.Spackage();
        };
        SprotoCore.Dispatch = function (byteArray) {
            var pack2 = SprotoCore.m_ParserPack;
            var data = pack2.Unpack(byteArray);
            var sp = SprotoCore.GetDeserialize(data, 0, data.length);
            var packet = SprotoCore.m_Pkg;
            packet.type = undefined;
            packet.session = undefined;
            Sproto._decode_Spackage(sp, packet);
            var offset = sp.Size();
            if (packet.type) {
                var rpcRsp = Sproto.SprotoReceiver.HandlerType(packet.type, packet.session, data, offset);
                if (rpcRsp != null) {
                    return Sproto.SprotoSender.SendData(rpcRsp, packet.session, packet.type);
                }
            }
            else {
                Sproto.SprotoSender.HandlerSession(packet.session, data, offset);
            }
            SprotoCore.CloseDeserialize(sp);
            return null;
        };
        SprotoCore.mSerialize = [];
        SprotoCore.mDeserialize = [];
        return SprotoCore;
    }());
    Sproto.SprotoCore = SprotoCore;
    __reflect(SprotoCore.prototype, "Sproto.SprotoCore");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SprotoCore.js.map