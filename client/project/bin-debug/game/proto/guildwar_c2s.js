// Generated by sprotodump. DO NOT EDIT!
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var cs_guildwar_all_guild_rank_info_request = (function () {
        function cs_guildwar_all_guild_rank_info_request() {
        }
        return cs_guildwar_all_guild_rank_info_request;
    }());
    Sproto.cs_guildwar_all_guild_rank_info_request = cs_guildwar_all_guild_rank_info_request;
    __reflect(cs_guildwar_all_guild_rank_info_request.prototype, "Sproto.cs_guildwar_all_guild_rank_info_request");
    function _decode_cs_guildwar_all_guild_rank_info_request(d) {
        var o = new cs_guildwar_all_guild_rank_info_request;
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
    function _encode_cs_guildwar_all_guild_rank_info_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_all_guild_rank_info_request"] = { en: _encode_cs_guildwar_all_guild_rank_info_request, de: _decode_cs_guildwar_all_guild_rank_info_request };
    var cs_guildwar_all_player_rank_info_request = (function () {
        function cs_guildwar_all_player_rank_info_request() {
        }
        return cs_guildwar_all_player_rank_info_request;
    }());
    Sproto.cs_guildwar_all_player_rank_info_request = cs_guildwar_all_player_rank_info_request;
    __reflect(cs_guildwar_all_player_rank_info_request.prototype, "Sproto.cs_guildwar_all_player_rank_info_request");
    function _decode_cs_guildwar_all_player_rank_info_request(d) {
        var o = new cs_guildwar_all_player_rank_info_request;
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
    function _encode_cs_guildwar_all_player_rank_info_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_all_player_rank_info_request"] = { en: _encode_cs_guildwar_all_player_rank_info_request, de: _decode_cs_guildwar_all_player_rank_info_request };
    var cs_guildwar_attack_boss_request = (function () {
        function cs_guildwar_attack_boss_request() {
        }
        return cs_guildwar_attack_boss_request;
    }());
    Sproto.cs_guildwar_attack_boss_request = cs_guildwar_attack_boss_request;
    __reflect(cs_guildwar_attack_boss_request.prototype, "Sproto.cs_guildwar_attack_boss_request");
    function _decode_cs_guildwar_attack_boss_request(d) {
        var o = new cs_guildwar_attack_boss_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.bossid = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_guildwar_attack_boss_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.bossid != undefined) {
            se.wi(self.bossid, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_attack_boss_request"] = { en: _encode_cs_guildwar_attack_boss_request, de: _decode_cs_guildwar_attack_boss_request };
    var cs_guildwar_attack_player_request = (function () {
        function cs_guildwar_attack_player_request() {
        }
        return cs_guildwar_attack_player_request;
    }());
    Sproto.cs_guildwar_attack_player_request = cs_guildwar_attack_player_request;
    __reflect(cs_guildwar_attack_player_request.prototype, "Sproto.cs_guildwar_attack_player_request");
    function _decode_cs_guildwar_attack_player_request(d) {
        var o = new cs_guildwar_attack_player_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.targetid = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_guildwar_attack_player_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.targetid != undefined) {
            se.wi(self.targetid, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_attack_player_request"] = { en: _encode_cs_guildwar_attack_player_request, de: _decode_cs_guildwar_attack_player_request };
    var cs_guildwar_attack_player_response = (function () {
        function cs_guildwar_attack_player_response() {
        }
        return cs_guildwar_attack_player_response;
    }());
    Sproto.cs_guildwar_attack_player_response = cs_guildwar_attack_player_response;
    __reflect(cs_guildwar_attack_player_response.prototype, "Sproto.cs_guildwar_attack_player_response");
    function _decode_cs_guildwar_attack_player_response(d) {
        var o = new cs_guildwar_attack_player_response;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.ret = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_guildwar_attack_player_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.ret != undefined) {
            se.wi(self.ret, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_attack_player_response"] = { en: _encode_cs_guildwar_attack_player_response, de: _decode_cs_guildwar_attack_player_response };
    var cs_guildwar_clear_attackcd_request = (function () {
        function cs_guildwar_clear_attackcd_request() {
        }
        return cs_guildwar_clear_attackcd_request;
    }());
    Sproto.cs_guildwar_clear_attackcd_request = cs_guildwar_clear_attackcd_request;
    __reflect(cs_guildwar_clear_attackcd_request.prototype, "Sproto.cs_guildwar_clear_attackcd_request");
    function _decode_cs_guildwar_clear_attackcd_request(d) {
        var o = new cs_guildwar_clear_attackcd_request;
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
    function _encode_cs_guildwar_clear_attackcd_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_clear_attackcd_request"] = { en: _encode_cs_guildwar_clear_attackcd_request, de: _decode_cs_guildwar_clear_attackcd_request };
    var cs_guildwar_clear_attackcd_response = (function () {
        function cs_guildwar_clear_attackcd_response() {
        }
        return cs_guildwar_clear_attackcd_response;
    }());
    Sproto.cs_guildwar_clear_attackcd_response = cs_guildwar_clear_attackcd_response;
    __reflect(cs_guildwar_clear_attackcd_response.prototype, "Sproto.cs_guildwar_clear_attackcd_response");
    function _decode_cs_guildwar_clear_attackcd_response(d) {
        var o = new cs_guildwar_clear_attackcd_response;
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
    function _encode_cs_guildwar_clear_attackcd_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.ret != undefined) {
            se.wb(self.ret, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_clear_attackcd_response"] = { en: _encode_cs_guildwar_clear_attackcd_response, de: _decode_cs_guildwar_clear_attackcd_response };
    var cs_guildwar_clear_reborncd_request = (function () {
        function cs_guildwar_clear_reborncd_request() {
        }
        return cs_guildwar_clear_reborncd_request;
    }());
    Sproto.cs_guildwar_clear_reborncd_request = cs_guildwar_clear_reborncd_request;
    __reflect(cs_guildwar_clear_reborncd_request.prototype, "Sproto.cs_guildwar_clear_reborncd_request");
    function _decode_cs_guildwar_clear_reborncd_request(d) {
        var o = new cs_guildwar_clear_reborncd_request;
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
    function _encode_cs_guildwar_clear_reborncd_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_clear_reborncd_request"] = { en: _encode_cs_guildwar_clear_reborncd_request, de: _decode_cs_guildwar_clear_reborncd_request };
    var cs_guildwar_clear_reborncd_response = (function () {
        function cs_guildwar_clear_reborncd_response() {
        }
        return cs_guildwar_clear_reborncd_response;
    }());
    Sproto.cs_guildwar_clear_reborncd_response = cs_guildwar_clear_reborncd_response;
    __reflect(cs_guildwar_clear_reborncd_response.prototype, "Sproto.cs_guildwar_clear_reborncd_response");
    function _decode_cs_guildwar_clear_reborncd_response(d) {
        var o = new cs_guildwar_clear_reborncd_response;
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
    function _encode_cs_guildwar_clear_reborncd_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.ret != undefined) {
            se.wb(self.ret, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_clear_reborncd_response"] = { en: _encode_cs_guildwar_clear_reborncd_response, de: _decode_cs_guildwar_clear_reborncd_response };
    var cs_guildwar_enter_request = (function () {
        function cs_guildwar_enter_request() {
        }
        return cs_guildwar_enter_request;
    }());
    Sproto.cs_guildwar_enter_request = cs_guildwar_enter_request;
    __reflect(cs_guildwar_enter_request.prototype, "Sproto.cs_guildwar_enter_request");
    function _decode_cs_guildwar_enter_request(d) {
        var o = new cs_guildwar_enter_request;
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
    function _encode_cs_guildwar_enter_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_enter_request"] = { en: _encode_cs_guildwar_enter_request, de: _decode_cs_guildwar_enter_request };
    var cs_guildwar_enter_response = (function () {
        function cs_guildwar_enter_response() {
        }
        return cs_guildwar_enter_response;
    }());
    Sproto.cs_guildwar_enter_response = cs_guildwar_enter_response;
    __reflect(cs_guildwar_enter_response.prototype, "Sproto.cs_guildwar_enter_response");
    function _decode_cs_guildwar_enter_response(d) {
        var o = new cs_guildwar_enter_response;
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
    function _encode_cs_guildwar_enter_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.ret != undefined) {
            se.wb(self.ret, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_enter_response"] = { en: _encode_cs_guildwar_enter_response, de: _decode_cs_guildwar_enter_response };
    var cs_guildwar_exit_barrier_request = (function () {
        function cs_guildwar_exit_barrier_request() {
        }
        return cs_guildwar_exit_barrier_request;
    }());
    Sproto.cs_guildwar_exit_barrier_request = cs_guildwar_exit_barrier_request;
    __reflect(cs_guildwar_exit_barrier_request.prototype, "Sproto.cs_guildwar_exit_barrier_request");
    function _decode_cs_guildwar_exit_barrier_request(d) {
        var o = new cs_guildwar_exit_barrier_request;
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
    function _encode_cs_guildwar_exit_barrier_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_exit_barrier_request"] = { en: _encode_cs_guildwar_exit_barrier_request, de: _decode_cs_guildwar_exit_barrier_request };
    var cs_guildwar_get_score_reward_request = (function () {
        function cs_guildwar_get_score_reward_request() {
        }
        return cs_guildwar_get_score_reward_request;
    }());
    Sproto.cs_guildwar_get_score_reward_request = cs_guildwar_get_score_reward_request;
    __reflect(cs_guildwar_get_score_reward_request.prototype, "Sproto.cs_guildwar_get_score_reward_request");
    function _decode_cs_guildwar_get_score_reward_request(d) {
        var o = new cs_guildwar_get_score_reward_request;
        var t = -1;
        while (-1 != (t = d.rt())) {
            switch (t) {
                case 0:
                    o.rewardid = d.ri();
                    break;
                default:
                    d.nod();
                    break;
            }
        }
        return o;
    }
    function _encode_cs_guildwar_get_score_reward_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.rewardid != undefined) {
            se.wi(self.rewardid, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_get_score_reward_request"] = { en: _encode_cs_guildwar_get_score_reward_request, de: _decode_cs_guildwar_get_score_reward_request };
    var cs_guildwar_last_barrier_request = (function () {
        function cs_guildwar_last_barrier_request() {
        }
        return cs_guildwar_last_barrier_request;
    }());
    Sproto.cs_guildwar_last_barrier_request = cs_guildwar_last_barrier_request;
    __reflect(cs_guildwar_last_barrier_request.prototype, "Sproto.cs_guildwar_last_barrier_request");
    function _decode_cs_guildwar_last_barrier_request(d) {
        var o = new cs_guildwar_last_barrier_request;
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
    function _encode_cs_guildwar_last_barrier_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_last_barrier_request"] = { en: _encode_cs_guildwar_last_barrier_request, de: _decode_cs_guildwar_last_barrier_request };
    var cs_guildwar_last_barrier_response = (function () {
        function cs_guildwar_last_barrier_response() {
        }
        return cs_guildwar_last_barrier_response;
    }());
    Sproto.cs_guildwar_last_barrier_response = cs_guildwar_last_barrier_response;
    __reflect(cs_guildwar_last_barrier_response.prototype, "Sproto.cs_guildwar_last_barrier_response");
    function _decode_cs_guildwar_last_barrier_response(d) {
        var o = new cs_guildwar_last_barrier_response;
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
    function _encode_cs_guildwar_last_barrier_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.ret != undefined) {
            se.wb(self.ret, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_last_barrier_response"] = { en: _encode_cs_guildwar_last_barrier_response, de: _decode_cs_guildwar_last_barrier_response };
    var cs_guildwar_next_barrier_request = (function () {
        function cs_guildwar_next_barrier_request() {
        }
        return cs_guildwar_next_barrier_request;
    }());
    Sproto.cs_guildwar_next_barrier_request = cs_guildwar_next_barrier_request;
    __reflect(cs_guildwar_next_barrier_request.prototype, "Sproto.cs_guildwar_next_barrier_request");
    function _decode_cs_guildwar_next_barrier_request(d) {
        var o = new cs_guildwar_next_barrier_request;
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
    function _encode_cs_guildwar_next_barrier_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_next_barrier_request"] = { en: _encode_cs_guildwar_next_barrier_request, de: _decode_cs_guildwar_next_barrier_request };
    var cs_guildwar_next_barrier_response = (function () {
        function cs_guildwar_next_barrier_response() {
        }
        return cs_guildwar_next_barrier_response;
    }());
    Sproto.cs_guildwar_next_barrier_response = cs_guildwar_next_barrier_response;
    __reflect(cs_guildwar_next_barrier_response.prototype, "Sproto.cs_guildwar_next_barrier_response");
    function _decode_cs_guildwar_next_barrier_response(d) {
        var o = new cs_guildwar_next_barrier_response;
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
    function _encode_cs_guildwar_next_barrier_response(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 1);
        if (self.ret != undefined) {
            se.wb(self.ret, 0);
        }
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_next_barrier_response"] = { en: _encode_cs_guildwar_next_barrier_response, de: _decode_cs_guildwar_next_barrier_response };
    var cs_guildwar_team_recruit_request = (function () {
        function cs_guildwar_team_recruit_request() {
        }
        return cs_guildwar_team_recruit_request;
    }());
    Sproto.cs_guildwar_team_recruit_request = cs_guildwar_team_recruit_request;
    __reflect(cs_guildwar_team_recruit_request.prototype, "Sproto.cs_guildwar_team_recruit_request");
    function _decode_cs_guildwar_team_recruit_request(d) {
        var o = new cs_guildwar_team_recruit_request;
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
    function _encode_cs_guildwar_team_recruit_request(self, st) {
        var se = Sproto.SprotoCore.GetSerialize(st, 0);
        return Sproto.SprotoCore.CloseSerialize(se);
    }
    Sproto.ALL_DICT["cs_guildwar_team_recruit_request"] = { en: _encode_cs_guildwar_team_recruit_request, de: _decode_cs_guildwar_team_recruit_request };
})(Sproto || (Sproto = {}));
//# sourceMappingURL=guildwar_c2s.js.map