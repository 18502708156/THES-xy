// Generated by sprotodump. DO NOT EDIT!
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var cs_wing_dress_request = (function () {
        function cs_wing_dress_request() {
        }
        return cs_wing_dress_request;
    }());
    Sproto.cs_wing_dress_request = cs_wing_dress_request;
    __reflect(cs_wing_dress_request.prototype, "Sproto.cs_wing_dress_request");
    function _decode_cs_wing_dress_request(d) {
        var o = new cs_wing_dress_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.dressId = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_wing_dress_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.dressId != undefined) {
            se.wi(self.dressId, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_wing_dress_request"] = { en: _encode_cs_wing_dress_request, de: _decode_cs_wing_dress_request };
    var cs_wing_dress_response = (function () {
        function cs_wing_dress_response() {
        }
        return cs_wing_dress_response;
    }());
    Sproto.cs_wing_dress_response = cs_wing_dress_response;
    __reflect(cs_wing_dress_response.prototype, "Sproto.cs_wing_dress_response");
    function _decode_cs_wing_dress_response(d) {
        var o = new cs_wing_dress_response;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.result = d.ri();
                    break;
                case 1:
                    o.dressId = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_wing_dress_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.result != undefined) {
            se.wi(self.result, 0);
        }
        if (self.dressId != undefined) {
            se.wi(self.dressId, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_wing_dress_response"] = { en: _encode_cs_wing_dress_response, de: _decode_cs_wing_dress_response };
    var cs_wing_drug_request = (function () {
        function cs_wing_drug_request() {
        }
        return cs_wing_drug_request;
    }());
    Sproto.cs_wing_drug_request = cs_wing_drug_request;
    __reflect(cs_wing_drug_request.prototype, "Sproto.cs_wing_drug_request");
    function _decode_cs_wing_drug_request(d) {
        var o = new cs_wing_drug_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.drugNum = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_wing_drug_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.drugNum != undefined) {
            se.wi(self.drugNum, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_wing_drug_request"] = { en: _encode_cs_wing_drug_request, de: _decode_cs_wing_drug_request };
    var cs_wing_drug_response = (function () {
        function cs_wing_drug_response() {
        }
        return cs_wing_drug_response;
    }());
    Sproto.cs_wing_drug_response = cs_wing_drug_response;
    __reflect(cs_wing_drug_response.prototype, "Sproto.cs_wing_drug_response");
    function _decode_cs_wing_drug_response(d) {
        var o = new cs_wing_drug_response;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.result = d.ri();
                    break;
                case 1:
                    o.drugTotal = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_wing_drug_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.result != undefined) {
            se.wi(self.result, 0);
        }
        if (self.drugTotal != undefined) {
            se.wi(self.drugTotal, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_wing_drug_response"] = { en: _encode_cs_wing_drug_response, de: _decode_cs_wing_drug_response };
    var cs_wing_equip_request = (function () {
        function cs_wing_equip_request() {
        }
        return cs_wing_equip_request;
    }());
    Sproto.cs_wing_equip_request = cs_wing_equip_request;
    __reflect(cs_wing_equip_request.prototype, "Sproto.cs_wing_equip_request");
    function _decode_cs_wing_equip_request(d) {
        var o = new cs_wing_equip_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.itemHandle = d.ri();
                    break;
                case 1:
                    o.pos = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_wing_equip_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.itemHandle != undefined) {
            se.wi(self.itemHandle, 0);
        }
        if (self.pos != undefined) {
            se.wi(self.pos, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_wing_equip_request"] = { en: _encode_cs_wing_equip_request, de: _decode_cs_wing_equip_request };
    var cs_wing_upgrade_level_request = (function () {
        function cs_wing_upgrade_level_request() {
        }
        return cs_wing_upgrade_level_request;
    }());
    Sproto.cs_wing_upgrade_level_request = cs_wing_upgrade_level_request;
    __reflect(cs_wing_upgrade_level_request.prototype, "Sproto.cs_wing_upgrade_level_request");
    function _decode_cs_wing_upgrade_level_request(d) {
        var o = new cs_wing_upgrade_level_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_wing_upgrade_level_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_wing_upgrade_level_request"] = { en: _encode_cs_wing_upgrade_level_request, de: _decode_cs_wing_upgrade_level_request };
    var cs_wing_upgrade_skill_request = (function () {
        function cs_wing_upgrade_skill_request() {
        }
        return cs_wing_upgrade_skill_request;
    }());
    Sproto.cs_wing_upgrade_skill_request = cs_wing_upgrade_skill_request;
    __reflect(cs_wing_upgrade_skill_request.prototype, "Sproto.cs_wing_upgrade_skill_request");
    function _decode_cs_wing_upgrade_skill_request(d) {
        var o = new cs_wing_upgrade_skill_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.skillId = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_wing_upgrade_skill_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.skillId != undefined) {
            se.wi(self.skillId, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_wing_upgrade_skill_request"] = { en: _encode_cs_wing_upgrade_skill_request, de: _decode_cs_wing_upgrade_skill_request };
})(Sproto || (Sproto = {}));
//# sourceMappingURL=wing_c2s.js.map