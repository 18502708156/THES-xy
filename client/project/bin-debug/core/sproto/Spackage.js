var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var Spackage = (function () {
        function Spackage() {
        }
        return Spackage;
    }());
    Sproto.Spackage = Spackage;
    __reflect(Spackage.prototype, "Sproto.Spackage", ["Sproto.SprotoTypeBase"]);
    function _decode_Spackage(d, obj) {
        var tag = -1;
        while ((tag = d.rt()) != -1) {
            switch (tag) {
                case 0:
                    obj.type = d.ri();
                    break;
                case 1:
                    obj.session = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return obj;
    }
    Sproto._decode_Spackage = _decode_Spackage;
    function _encode_Spackage(self, n, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, n);
        if (self.type != undefined) {
            se.wi(self.type, 0);
        }
        if (self.session != undefined) {
            se.wi(self.session, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto._encode_Spackage = _encode_Spackage;
})(Sproto || (Sproto = {}));
//# sourceMappingURL=Spackage.js.map