// Generated by sprotodump. DO NOT EDIT!
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var sc_panacea_update_request = (function () {
        function sc_panacea_update_request() {
        }
        return sc_panacea_update_request;
    }());
    Sproto.sc_panacea_update_request = sc_panacea_update_request;
    __reflect(sc_panacea_update_request.prototype, "Sproto.sc_panacea_update_request");
    function _decode_sc_panacea_update_request(d) {
        var o = new sc_panacea_update_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.lvlist = d.ria();
                    break;
                case 1:
                    o.attrs = d.roa("attribute_data");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_panacea_update_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.lvlist != undefined) {
            se.wia(self.lvlist, 0);
        }
        if (self.attrs != undefined) {
            se.woa("attribute_data", self.attrs, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_panacea_update_request"] = { en: _encode_sc_panacea_update_request, de: _decode_sc_panacea_update_request };
})(Sproto || (Sproto = {}));
//# sourceMappingURL=panacea_s2c.js.map