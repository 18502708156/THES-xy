// Generated by sprotodump. DO NOT EDIT!
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var cs_answer_answer_request = (function () {
        function cs_answer_answer_request() {
        }
        return cs_answer_answer_request;
    }());
    Sproto.cs_answer_answer_request = cs_answer_answer_request;
    __reflect(cs_answer_answer_request.prototype, "Sproto.cs_answer_answer_request");
    function _decode_cs_answer_answer_request(d) {
        var o = new cs_answer_answer_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.no = d.ri();
                    break;
                case 1:
                    o.answer = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_answer_answer_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 2);
        if (self.no != undefined) {
            se.wi(self.no, 0);
        }
        if (self.answer != undefined) {
            se.wi(self.answer, 1);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_answer_answer_request"] = { en: _encode_cs_answer_answer_request, de: _decode_cs_answer_answer_request };
    var cs_answer_answer_rank_request = (function () {
        function cs_answer_answer_rank_request() {
        }
        return cs_answer_answer_rank_request;
    }());
    Sproto.cs_answer_answer_rank_request = cs_answer_answer_rank_request;
    __reflect(cs_answer_answer_rank_request.prototype, "Sproto.cs_answer_answer_rank_request");
    function _decode_cs_answer_answer_rank_request(d) {
        var o = new cs_answer_answer_rank_request;
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
    function _encode_cs_answer_answer_rank_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_answer_answer_rank_request"] = { en: _encode_cs_answer_answer_rank_request, de: _decode_cs_answer_answer_rank_request };
    var cs_answer_answer_ui_request = (function () {
        function cs_answer_answer_ui_request() {
        }
        return cs_answer_answer_ui_request;
    }());
    Sproto.cs_answer_answer_ui_request = cs_answer_answer_ui_request;
    __reflect(cs_answer_answer_ui_request.prototype, "Sproto.cs_answer_answer_ui_request");
    function _decode_cs_answer_answer_ui_request(d) {
        var o = new cs_answer_answer_ui_request;
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
    function _encode_cs_answer_answer_ui_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_answer_answer_ui_request"] = { en: _encode_cs_answer_answer_ui_request, de: _decode_cs_answer_answer_ui_request };
    var cs_answer_answer_ui_response = (function () {
        function cs_answer_answer_ui_response() {
        }
        return cs_answer_answer_ui_response;
    }());
    Sproto.cs_answer_answer_ui_response = cs_answer_answer_ui_response;
    __reflect(cs_answer_answer_ui_response.prototype, "Sproto.cs_answer_answer_ui_response");
    function _decode_cs_answer_answer_ui_response(d) {
        var o = new cs_answer_answer_ui_response;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.ret = d.rb();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_answer_answer_ui_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.ret != undefined) {
            se.wb(self.ret, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_answer_answer_ui_response"] = { en: _encode_cs_answer_answer_ui_response, de: _decode_cs_answer_answer_ui_response };
})(Sproto || (Sproto = {}));
//# sourceMappingURL=answer_c2s.js.map