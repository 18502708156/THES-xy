// Generated by sprotodump. DO NOT EDIT!
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var marry_friend = (function () {
        function marry_friend() {
        }
        return marry_friend;
    }());
    Sproto.marry_friend = marry_friend;
    __reflect(marry_friend.prototype, "Sproto.marry_friend");
    function _decode_marry_friend(d) {
        var o = new marry_friend;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.dbid = d.ri();
                    break;
                case 1:
                    o.ispropose = d.rb();
                    break;
                case 2:
                    o.ismarry = d.rb();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_marry_friend(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 3);
        if (self.dbid != undefined) {
            se.wi(self.dbid, 0);
        }
        if (self.ispropose != undefined) {
            se.wb(self.ispropose, 1);
        }
        if (self.ismarry != undefined) {
            se.wb(self.ismarry, 2);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["marry_friend"] = { en: _encode_marry_friend, de: _decode_marry_friend };
    var marry_love = (function () {
        function marry_love() {
        }
        return marry_love;
    }());
    Sproto.marry_love = marry_love;
    __reflect(marry_love.prototype, "Sproto.marry_love");
    function _decode_marry_love(d) {
        var o = new marry_love;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.lovetype = d.ri();
                    break;
                case 1:
                    o.daycount = d.ri();
                    break;
                case 2:
                    o.count = d.ri();
                    break;
                case 3:
                    o.time = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_marry_love(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 4);
        if (self.lovetype != undefined) {
            se.wi(self.lovetype, 0);
        }
        if (self.daycount != undefined) {
            se.wi(self.daycount, 1);
        }
        if (self.count != undefined) {
            se.wi(self.count, 2);
        }
        if (self.time != undefined) {
            se.wi(self.time, 3);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["marry_love"] = { en: _encode_marry_love, de: _decode_marry_love };
    var marry_object = (function () {
        function marry_object() {
        }
        return marry_object;
    }());
    Sproto.marry_object = marry_object;
    __reflect(marry_object.prototype, "Sproto.marry_object");
    function _decode_marry_object(d) {
        var o = new marry_object;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.dbid = d.ri();
                    break;
                case 1:
                    o.name = d.rs();
                    break;
                case 2:
                    o.level = d.ri();
                    break;
                case 3:
                    o.job = d.ri();
                    break;
                case 4:
                    o.sex = d.ri();
                    break;
                case 5:
                    o.power = d.ri();
                    break;
                case 6:
                    o.shows = d.ria();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_marry_object(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 7);
        if (self.dbid != undefined) {
            se.wi(self.dbid, 0);
        }
        if (self.name != undefined) {
            se.ws(self.name, 1);
        }
        if (self.level != undefined) {
            se.wi(self.level, 2);
        }
        if (self.job != undefined) {
            se.wi(self.job, 3);
        }
        if (self.sex != undefined) {
            se.wi(self.sex, 4);
        }
        if (self.power != undefined) {
            se.wi(self.power, 5);
        }
        if (self.shows != undefined) {
            se.wia(self.shows, 6);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["marry_object"] = { en: _encode_marry_object, de: _decode_marry_object };
    var sc_marry_answer_request = (function () {
        function sc_marry_answer_request() {
        }
        return sc_marry_answer_request;
    }());
    Sproto.sc_marry_answer_request = sc_marry_answer_request;
    __reflect(sc_marry_answer_request.prototype, "Sproto.sc_marry_answer_request");
    function _decode_sc_marry_answer_request(d) {
        var o = new sc_marry_answer_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.dbid = d.ri();
                    break;
                case 1:
                    o.name = d.rs();
                    break;
                case 2:
                    o.grade = d.ri();
                    break;
                case 3:
                    o.agree = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_answer_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 4);
        if (self.dbid != undefined) {
            se.wi(self.dbid, 0);
        }
        if (self.name != undefined) {
            se.ws(self.name, 1);
        }
        if (self.grade != undefined) {
            se.wi(self.grade, 2);
        }
        if (self.agree != undefined) {
            se.wi(self.agree, 3);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_answer_request"] = { en: _encode_sc_marry_answer_request, de: _decode_sc_marry_answer_request };
    var sc_marry_asked_request = (function () {
        function sc_marry_asked_request() {
        }
        return sc_marry_asked_request;
    }());
    Sproto.sc_marry_asked_request = sc_marry_asked_request;
    __reflect(sc_marry_asked_request.prototype, "Sproto.sc_marry_asked_request");
    function _decode_sc_marry_asked_request(d) {
        var o = new sc_marry_asked_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.fromid = d.ri();
                    break;
                case 1:
                    o.name = d.rs();
                    break;
                case 2:
                    o.grade = d.ri();
                    break;
                case 3:
                    o.spouse = d.ri();
                    break;
                case 4:
                    o.power = d.ri();
                    break;
                case 5:
                    o.level = d.ri();
                    break;
                case 6:
                    o.job = d.ri();
                    break;
                case 7:
                    o.sex = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_asked_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 8);
        if (self.fromid != undefined) {
            se.wi(self.fromid, 0);
        }
        if (self.name != undefined) {
            se.ws(self.name, 1);
        }
        if (self.grade != undefined) {
            se.wi(self.grade, 2);
        }
        if (self.spouse != undefined) {
            se.wi(self.spouse, 3);
        }
        if (self.power != undefined) {
            se.wi(self.power, 4);
        }
        if (self.level != undefined) {
            se.wi(self.level, 5);
        }
        if (self.job != undefined) {
            se.wi(self.job, 6);
        }
        if (self.sex != undefined) {
            se.wi(self.sex, 7);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_asked_request"] = { en: _encode_sc_marry_asked_request, de: _decode_sc_marry_asked_request };
    var sc_marry_divorce_bro_request = (function () {
        function sc_marry_divorce_bro_request() {
        }
        return sc_marry_divorce_bro_request;
    }());
    Sproto.sc_marry_divorce_bro_request = sc_marry_divorce_bro_request;
    __reflect(sc_marry_divorce_bro_request.prototype, "Sproto.sc_marry_divorce_bro_request");
    function _decode_sc_marry_divorce_bro_request(d) {
        var o = new sc_marry_divorce_bro_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.ids = d.ria();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_divorce_bro_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.ids != undefined) {
            se.wia(self.ids, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_divorce_bro_request"] = { en: _encode_sc_marry_divorce_bro_request, de: _decode_sc_marry_divorce_bro_request };
    var sc_marry_flower_bro_request = (function () {
        function sc_marry_flower_bro_request() {
        }
        return sc_marry_flower_bro_request;
    }());
    Sproto.sc_marry_flower_bro_request = sc_marry_flower_bro_request;
    __reflect(sc_marry_flower_bro_request.prototype, "Sproto.sc_marry_flower_bro_request");
    function _decode_sc_marry_flower_bro_request(d) {
        var o = new sc_marry_flower_bro_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.quantity = d.ri();
                    break;
                case 1:
                    o.effect = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_flower_bro_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.quantity != undefined) {
            se.wi(self.quantity, 0);
        }
        if (self.effect != undefined) {
            se.wi(self.effect, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_flower_bro_request"] = { en: _encode_sc_marry_flower_bro_request, de: _decode_sc_marry_flower_bro_request };
    var sc_marry_friends_request = (function () {
        function sc_marry_friends_request() {
        }
        return sc_marry_friends_request;
    }());
    Sproto.sc_marry_friends_request = sc_marry_friends_request;
    __reflect(sc_marry_friends_request.prototype, "Sproto.sc_marry_friends_request");
    function _decode_sc_marry_friends_request(d) {
        var o = new sc_marry_friends_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.friends = d.roa("marry_friend");
                    break;
                case 1:
                    o.today = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_friends_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.friends != undefined) {
            se.woa("marry_friend", self.friends, 0);
        }
        if (self.today != undefined) {
            se.wi(self.today, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_friends_request"] = { en: _encode_sc_marry_friends_request, de: _decode_sc_marry_friends_request };
    var sc_marry_house_partner_up_request = (function () {
        function sc_marry_house_partner_up_request() {
        }
        return sc_marry_house_partner_up_request;
    }());
    Sproto.sc_marry_house_partner_up_request = sc_marry_house_partner_up_request;
    __reflect(sc_marry_house_partner_up_request.prototype, "Sproto.sc_marry_house_partner_up_request");
    function _decode_sc_marry_house_partner_up_request(d) {
        var o = new sc_marry_house_partner_up_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.upnum = d.ri();
                    break;
                case 1:
                    o.times = d.ria();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_house_partner_up_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.upnum != undefined) {
            se.wi(self.upnum, 0);
        }
        if (self.times != undefined) {
            se.wia(self.times, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_house_partner_up_request"] = { en: _encode_sc_marry_house_partner_up_request, de: _decode_sc_marry_house_partner_up_request };
    var sc_marry_info_request = (function () {
        function sc_marry_info_request() {
        }
        return sc_marry_info_request;
    }());
    Sproto.sc_marry_info_request = sc_marry_info_request;
    __reflect(sc_marry_info_request.prototype, "Sproto.sc_marry_info_request");
    function _decode_sc_marry_info_request(d) {
        var o = new sc_marry_info_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.marry = d.rb();
                    break;
                case 1:
                    o.husband = d.ro("marry_object");
                    break;
                case 2:
                    o.wife = d.ro("marry_object");
                    break;
                case 3:
                    o.level = d.ri();
                    break;
                case 4:
                    o.intimate = d.ri();
                    break;
                case 5:
                    o.intimacy = d.ri();
                    break;
                case 6:
                    o.grade = d.ri();
                    break;
                case 7:
                    o.houselv = d.ri();
                    break;
                case 8:
                    o.houseup = d.ri();
                    break;
                case 9:
                    o.time = d.ri();
                    break;
                case 10:
                    o.today = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_info_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 11);
        if (self.marry != undefined) {
            se.wb(self.marry, 0);
        }
        if (self.husband != undefined) {
            se.wo("marry_object", self.husband, 1);
        }
        if (self.wife != undefined) {
            se.wo("marry_object", self.wife, 2);
        }
        if (self.level != undefined) {
            se.wi(self.level, 3);
        }
        if (self.intimate != undefined) {
            se.wi(self.intimate, 4);
        }
        if (self.intimacy != undefined) {
            se.wi(self.intimacy, 5);
        }
        if (self.grade != undefined) {
            se.wi(self.grade, 6);
        }
        if (self.houselv != undefined) {
            se.wi(self.houselv, 7);
        }
        if (self.houseup != undefined) {
            se.wi(self.houseup, 8);
        }
        if (self.time != undefined) {
            se.wi(self.time, 9);
        }
        if (self.today != undefined) {
            se.wi(self.today, 10);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_info_request"] = { en: _encode_sc_marry_info_request, de: _decode_sc_marry_info_request };
    var sc_marry_invitation_request = (function () {
        function sc_marry_invitation_request() {
        }
        return sc_marry_invitation_request;
    }());
    Sproto.sc_marry_invitation_request = sc_marry_invitation_request;
    __reflect(sc_marry_invitation_request.prototype, "Sproto.sc_marry_invitation_request");
    function _decode_sc_marry_invitation_request(d) {
        var o = new sc_marry_invitation_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.husband = d.ro("marry_object");
                    break;
                case 1:
                    o.wife = d.ro("marry_object");
                    break;
                case 2:
                    o.dbid = d.ri();
                    break;
                case 3:
                    o.effect = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_invitation_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 4);
        if (self.husband != undefined) {
            se.wo("marry_object", self.husband, 0);
        }
        if (self.wife != undefined) {
            se.wo("marry_object", self.wife, 1);
        }
        if (self.dbid != undefined) {
            se.wi(self.dbid, 2);
        }
        if (self.effect != undefined) {
            se.wi(self.effect, 3);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_invitation_request"] = { en: _encode_sc_marry_invitation_request, de: _decode_sc_marry_invitation_request };
    var sc_marry_login_tip_request = (function () {
        function sc_marry_login_tip_request() {
        }
        return sc_marry_login_tip_request;
    }());
    Sproto.sc_marry_login_tip_request = sc_marry_login_tip_request;
    __reflect(sc_marry_login_tip_request.prototype, "Sproto.sc_marry_login_tip_request");
    function _decode_sc_marry_login_tip_request(d) {
        var o = new sc_marry_login_tip_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.partner = d.ro("marry_object");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_login_tip_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.partner != undefined) {
            se.wo("marry_object", self.partner, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_login_tip_request"] = { en: _encode_sc_marry_login_tip_request, de: _decode_sc_marry_login_tip_request };
    var sc_marry_love_info_request = (function () {
        function sc_marry_love_info_request() {
        }
        return sc_marry_love_info_request;
    }());
    Sproto.sc_marry_love_info_request = sc_marry_love_info_request;
    __reflect(sc_marry_love_info_request.prototype, "Sproto.sc_marry_love_info_request");
    function _decode_sc_marry_love_info_request(d) {
        var o = new sc_marry_love_info_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.loves = d.roa("marry_love");
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_love_info_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.loves != undefined) {
            se.woa("marry_love", self.loves, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_love_info_request"] = { en: _encode_sc_marry_love_info_request, de: _decode_sc_marry_love_info_request };
    var sc_marry_new_request = (function () {
        function sc_marry_new_request() {
        }
        return sc_marry_new_request;
    }());
    Sproto.sc_marry_new_request = sc_marry_new_request;
    __reflect(sc_marry_new_request.prototype, "Sproto.sc_marry_new_request");
    function _decode_sc_marry_new_request(d) {
        var o = new sc_marry_new_request;
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
    function _encode_sc_marry_new_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_new_request"] = { en: _encode_sc_marry_new_request, de: _decode_sc_marry_new_request };
    var sc_marry_recv_flower_request = (function () {
        function sc_marry_recv_flower_request() {
        }
        return sc_marry_recv_flower_request;
    }());
    Sproto.sc_marry_recv_flower_request = sc_marry_recv_flower_request;
    __reflect(sc_marry_recv_flower_request.prototype, "Sproto.sc_marry_recv_flower_request");
    function _decode_sc_marry_recv_flower_request(d) {
        var o = new sc_marry_recv_flower_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.name = d.rs();
                    break;
                case 1:
                    o.intimacy = d.ri();
                    break;
                case 2:
                    o.flower = d.rs();
                    break;
                case 3:
                    o.count = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_recv_flower_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 4);
        if (self.name != undefined) {
            se.ws(self.name, 0);
        }
        if (self.intimacy != undefined) {
            se.wi(self.intimacy, 1);
        }
        if (self.flower != undefined) {
            se.ws(self.flower, 2);
        }
        if (self.count != undefined) {
            se.wi(self.count, 3);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_recv_flower_request"] = { en: _encode_sc_marry_recv_flower_request, de: _decode_sc_marry_recv_flower_request };
    var sc_marry_remove_asked_request = (function () {
        function sc_marry_remove_asked_request() {
        }
        return sc_marry_remove_asked_request;
    }());
    Sproto.sc_marry_remove_asked_request = sc_marry_remove_asked_request;
    __reflect(sc_marry_remove_asked_request.prototype, "Sproto.sc_marry_remove_asked_request");
    function _decode_sc_marry_remove_asked_request(d) {
        var o = new sc_marry_remove_asked_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.fromid = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_remove_asked_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.fromid != undefined) {
            se.wi(self.fromid, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_remove_asked_request"] = { en: _encode_sc_marry_remove_asked_request, de: _decode_sc_marry_remove_asked_request };
    var sc_marry_token_status_request = (function () {
        function sc_marry_token_status_request() {
        }
        return sc_marry_token_status_request;
    }());
    Sproto.sc_marry_token_status_request = sc_marry_token_status_request;
    __reflect(sc_marry_token_status_request.prototype, "Sproto.sc_marry_token_status_request");
    function _decode_sc_marry_token_status_request(d) {
        var o = new sc_marry_token_status_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.grade = d.ri();
                    break;
                case 1:
                    o.isopen = d.rb();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_sc_marry_token_status_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.grade != undefined) {
            se.wi(self.grade, 0);
        }
        if (self.isopen != undefined) {
            se.wb(self.isopen, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["sc_marry_token_status_request"] = { en: _encode_sc_marry_token_status_request, de: _decode_sc_marry_token_status_request };
})(Sproto || (Sproto = {}));
//# sourceMappingURL=marry_s2c.js.map