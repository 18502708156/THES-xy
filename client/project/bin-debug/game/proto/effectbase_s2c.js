// Generated by sprotodump. DO NOT EDIT!
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var effect_item = (function () {
        function effect_item() {
        }
        return effect_item;
    }());
    Sproto.effect_item = effect_item;
    __reflect(effect_item.prototype, "Sproto.effect_item");
    function _decode_effect_item(d) {
        var o = new effect_item;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.id = d.ri();
                    break;
                case 1:
                    o.term = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_effect_item(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.id != undefined) {
            se.wi(self.id, 0);
        }
        if (self.term != undefined) {
            se.wi(self.term, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["effect_item"] = { en: _encode_effect_item, de: _decode_effect_item };
    var sc_effect_skin_update_request = (function () {
        function sc_effect_skin_update_request() {
        }
        return sc_effect_skin_update_request;
    }());
    Sproto.sc_effect_skin_update_request = sc_effect_skin_update_request;
    __reflect(sc_effect_skin_update_request.prototype, "Sproto.sc_effect_skin_update_request");
    function _decode_sc_effect_skin_update_request(d) {
        var o = new sc_effect_skin_update_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.wearid = d.ri();
                    break;
                case 1:
                    o.ownlist = d.roa("effect_item");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_effect_skin_update_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.wearid != undefined) {
            se.wi(self.wearid, 0);
        }
        if (self.ownlist != undefined) {
            se.woa("effect_item", self.ownlist, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_effect_skin_update_request"] = { en: _encode_sc_effect_skin_update_request, de: _decode_sc_effect_skin_update_request };
    var sc_effect_title_update_request = (function () {
        function sc_effect_title_update_request() {
        }
        return sc_effect_title_update_request;
    }());
    Sproto.sc_effect_title_update_request = sc_effect_title_update_request;
    __reflect(sc_effect_title_update_request.prototype, "Sproto.sc_effect_title_update_request");
    function _decode_sc_effect_title_update_request(d) {
        var o = new sc_effect_title_update_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.wearid = d.ri();
                    break;
                case 1:
                    o.ownlist = d.roa("effect_item");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_effect_title_update_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.wearid != undefined) {
            se.wi(self.wearid, 0);
        }
        if (self.ownlist != undefined) {
            se.woa("effect_item", self.ownlist, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_effect_title_update_request"] = { en: _encode_sc_effect_title_update_request, de: _decode_sc_effect_title_update_request };
})(Sproto || (Sproto = {}));
//# sourceMappingURL=effectbase_s2c.js.map