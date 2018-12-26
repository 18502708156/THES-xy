var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var SprotoTypeSize = (function () {
        function SprotoTypeSize() {
        }
        SprotoTypeSize.error = function (info) {
            egret.error(info);
        };
        SprotoTypeSize.SIZEOF_HEADER = 2;
        SprotoTypeSize.SIZEOF_LENGTH = 4;
        SprotoTypeSize.SIZEOF_FIELD = 2;
        SprotoTypeSize.ENCODE_MAX_SIZE = 0x1000000;
        return SprotoTypeSize;
    }());
    Sproto.SprotoTypeSize = SprotoTypeSize;
    __reflect(SprotoTypeSize.prototype, "Sproto.SprotoTypeSize");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SprotoTypeSize.js.map