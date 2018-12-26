// Generated by sprotodump. DO NOT EDIT!
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var battle_event = (function () {
        function battle_event() {
        }
        return battle_event;
    }());
    Sproto.battle_event = battle_event;
    __reflect(battle_event.prototype, "Sproto.battle_event");
    function _decode_battle_event(d) {
        var o = new battle_event;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.type = d.ri();
                    break;
                case 1:
                    o.id = d.ri();
                    break;
                case 2:
                    o.src = d.ri();
                    break;
                case 3:
                    o.targets = d.ria();
                    break;
                case 4:
                    o.target = d.ri();
                    break;
                case 5:
                    o.args = d.ria();
                    break;
                case 6:
                    o.arg = d.ri();
                    break;
                case 7:
                    o.actions = d.roa("battle_event");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_battle_event(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 8);
        if (self.type != undefined) {
            se.wi(self.type, 0);
        }
        if (self.id != undefined) {
            se.wi(self.id, 1);
        }
        if (self.src != undefined) {
            se.wi(self.src, 2);
        }
        if (self.targets != undefined) {
            se.wia(self.targets, 3);
        }
        if (self.target != undefined) {
            se.wi(self.target, 4);
        }
        if (self.args != undefined) {
            se.wia(self.args, 5);
        }
        if (self.arg != undefined) {
            se.wi(self.arg, 6);
        }
        if (self.actions != undefined) {
            se.woa("battle_event", self.actions, 7);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["battle_event"] = { en: _encode_battle_event, de: _decode_battle_event };
    var entity_data = (function () {
        function entity_data() {
        }
        return entity_data;
    }());
    Sproto.entity_data = entity_data;
    __reflect(entity_data.prototype, "Sproto.entity_data");
    function _decode_entity_data(d) {
        var o = new entity_data;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.ownerid = d.ri();
                    break;
                case 1:
                    o.handler = d.ri();
                    break;
                case 2:
                    o.type = d.ri();
                    break;
                case 3:
                    o.side = d.ri();
                    break;
                case 4:
                    o.pos = d.ri();
                    break;
                case 5:
                    o.attrs = d.ria();
                    break;
                case 6:
                    o.sattrs = d.roa("spec_attr");
                    break;
                case 7:
                    o.shows = d.ro("entity_shows");
                    break;
                case 8:
                    o.monid = d.ri();
                    break;
                case 9:
                    o.skills = d.ria();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_entity_data(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 10);
        if (self.ownerid != undefined) {
            se.wi(self.ownerid, 0);
        }
        if (self.handler != undefined) {
            se.wi(self.handler, 1);
        }
        if (self.type != undefined) {
            se.wi(self.type, 2);
        }
        if (self.side != undefined) {
            se.wi(self.side, 3);
        }
        if (self.pos != undefined) {
            se.wi(self.pos, 4);
        }
        if (self.attrs != undefined) {
            se.wia(self.attrs, 5);
        }
        if (self.sattrs != undefined) {
            se.woa("spec_attr", self.sattrs, 6);
        }
        if (self.shows != undefined) {
            se.wo("entity_shows", self.shows, 7);
        }
        if (self.monid != undefined) {
            se.wi(self.monid, 8);
        }
        if (self.skills != undefined) {
            se.wia(self.skills, 9);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["entity_data"] = { en: _encode_entity_data, de: _decode_entity_data };
    var entity_shows = (function () {
        function entity_shows() {
        }
        return entity_shows;
    }());
    Sproto.entity_shows = entity_shows;
    __reflect(entity_shows.prototype, "Sproto.entity_shows");
    function _decode_entity_shows(d) {
        var o = new entity_shows;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.shows = d.ria();
                    break;
                case 1:
                    o.job = d.ri();
                    break;
                case 2:
                    o.sex = d.ri();
                    break;
                case 3:
                    o.id = d.ri();
                    break;
                case 4:
                    o.name = d.rs();
                    break;
                case 5:
                    o.serverid = d.ri();
                    break;
                case 6:
                    o.guildid = d.ri();
                    break;
                case 7:
                    o.guildname = d.rs();
                    break;
                case 8:
                    o.level = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_entity_shows(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 9);
        if (self.shows != undefined) {
            se.wia(self.shows, 0);
        }
        if (self.job != undefined) {
            se.wi(self.job, 1);
        }
        if (self.sex != undefined) {
            se.wi(self.sex, 2);
        }
        if (self.id != undefined) {
            se.wi(self.id, 3);
        }
        if (self.name != undefined) {
            se.ws(self.name, 4);
        }
        if (self.serverid != undefined) {
            se.wi(self.serverid, 5);
        }
        if (self.guildid != undefined) {
            se.wi(self.guildid, 6);
        }
        if (self.guildname != undefined) {
            se.ws(self.guildname, 7);
        }
        if (self.level != undefined) {
            se.wi(self.level, 8);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["entity_shows"] = { en: _encode_entity_shows, de: _decode_entity_shows };
    var entity_skill = (function () {
        function entity_skill() {
        }
        return entity_skill;
    }());
    Sproto.entity_skill = entity_skill;
    __reflect(entity_skill.prototype, "Sproto.entity_skill");
    function _decode_entity_skill(d) {
        var o = new entity_skill;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.handler = d.ri();
                    break;
                case 1:
                    o.skills = d.ria();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_entity_skill(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.handler != undefined) {
            se.wi(self.handler, 0);
        }
        if (self.skills != undefined) {
            se.wia(self.skills, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["entity_skill"] = { en: _encode_entity_skill, de: _decode_entity_skill };
    var sc_battle_action_request = (function () {
        function sc_battle_action_request() {
        }
        return sc_battle_action_request;
    }());
    Sproto.sc_battle_action_request = sc_battle_action_request;
    __reflect(sc_battle_action_request.prototype, "Sproto.sc_battle_action_request");
    function _decode_sc_battle_action_request(d) {
        var o = new sc_battle_action_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.events = d.roa("battle_event");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_battle_action_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.events != undefined) {
            se.woa("battle_event", self.events, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_battle_action_request"] = { en: _encode_sc_battle_action_request, de: _decode_sc_battle_action_request };
    var sc_battle_entitys_request = (function () {
        function sc_battle_entitys_request() {
        }
        return sc_battle_entitys_request;
    }());
    Sproto.sc_battle_entitys_request = sc_battle_entitys_request;
    __reflect(sc_battle_entitys_request.prototype, "Sproto.sc_battle_entitys_request");
    function _decode_sc_battle_entitys_request(d) {
        var o = new sc_battle_entitys_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.raidType = d.ri();
                    break;
                case 1:
                    o.fbid = d.ri();
                    break;
                case 2:
                    o.manual = d.ri();
                    break;
                case 3:
                    o.entitydatas = d.roa("entity_data");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_battle_entitys_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 4);
        if (self.raidType != undefined) {
            se.wi(self.raidType, 0);
        }
        if (self.fbid != undefined) {
            se.wi(self.fbid, 1);
        }
        if (self.manual != undefined) {
            se.wi(self.manual, 2);
        }
        if (self.entitydatas != undefined) {
            se.woa("entity_data", self.entitydatas, 3);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_battle_entitys_request"] = { en: _encode_sc_battle_entitys_request, de: _decode_sc_battle_entitys_request };
    var sc_battle_manual_request = (function () {
        function sc_battle_manual_request() {
        }
        return sc_battle_manual_request;
    }());
    Sproto.sc_battle_manual_request = sc_battle_manual_request;
    __reflect(sc_battle_manual_request.prototype, "Sproto.sc_battle_manual_request");
    function _decode_sc_battle_manual_request(d) {
        var o = new sc_battle_manual_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.time = d.ri();
                    break;
                case 1:
                    o.useskills = d.roa("entity_skill");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_battle_manual_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.time != undefined) {
            se.wi(self.time, 0);
        }
        if (self.useskills != undefined) {
            se.woa("entity_skill", self.useskills, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_battle_manual_request"] = { en: _encode_sc_battle_manual_request, de: _decode_sc_battle_manual_request };
    var sc_battle_record_request = (function () {
        function sc_battle_record_request() {
        }
        return sc_battle_record_request;
    }());
    Sproto.sc_battle_record_request = sc_battle_record_request;
    __reflect(sc_battle_record_request.prototype, "Sproto.sc_battle_record_request");
    function _decode_sc_battle_record_request(d) {
        var o = new sc_battle_record_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.raidType = d.ri();
                    break;
                case 1:
                    o.fbid = d.ri();
                    break;
                case 2:
                    o.manual = d.ri();
                    break;
                case 3:
                    o.entitydatas = d.roa("entity_data");
                    break;
                case 4:
                    o.events = d.roa("battle_event");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_battle_record_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 5);
        if (self.raidType != undefined) {
            se.wi(self.raidType, 0);
        }
        if (self.fbid != undefined) {
            se.wi(self.fbid, 1);
        }
        if (self.manual != undefined) {
            se.wi(self.manual, 2);
        }
        if (self.entitydatas != undefined) {
            se.woa("entity_data", self.entitydatas, 3);
        }
        if (self.events != undefined) {
            se.woa("battle_event", self.events, 4);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_battle_record_request"] = { en: _encode_sc_battle_record_request, de: _decode_sc_battle_record_request };
    var sc_battle_set_auto_request = (function () {
        function sc_battle_set_auto_request() {
        }
        return sc_battle_set_auto_request;
    }());
    Sproto.sc_battle_set_auto_request = sc_battle_set_auto_request;
    __reflect(sc_battle_set_auto_request.prototype, "Sproto.sc_battle_set_auto_request");
    function _decode_sc_battle_set_auto_request(d) {
        var o = new sc_battle_set_auto_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.isauto = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_battle_set_auto_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.isauto != undefined) {
            se.wi(self.isauto, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_battle_set_auto_request"] = { en: _encode_sc_battle_set_auto_request, de: _decode_sc_battle_set_auto_request };
    var spec_attr = (function () {
        function spec_attr() {
        }
        return spec_attr;
    }());
    Sproto.spec_attr = spec_attr;
    __reflect(spec_attr.prototype, "Sproto.spec_attr");
    function _decode_spec_attr(d) {
        var o = new spec_attr;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.atttype = d.ri();
                    break;
                case 1:
                    o.value = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_spec_attr(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.atttype != undefined) {
            se.wi(self.atttype, 0);
        }
        if (self.value != undefined) {
            se.wi(self.value, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["spec_attr"] = { en: _encode_spec_attr, de: _decode_spec_attr };
})(Sproto || (Sproto = {}));
//# sourceMappingURL=battle_s2c.js.map