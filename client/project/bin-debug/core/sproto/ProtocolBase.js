var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var ProtocolBase = (function () {
        function ProtocolBase() {
            this.Protocol = new Sproto.ProtocolFunctionDictionary();
        }
        ProtocolBase.prototype.GetProtocol = function () {
            return this.Protocol;
        };
        return ProtocolBase;
    }());
    Sproto.ProtocolBase = ProtocolBase;
    __reflect(ProtocolBase.prototype, "Sproto.ProtocolBase");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=ProtocolBase.js.map