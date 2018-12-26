var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameServer = (function () {
    function GameServer() {
        Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_base_open_day, this.doGetOpenServer, this);
        Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_base_game_time, this.doServerTime, this);
        Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_base_replace_account, this._DoBaseReplaceAccount, this);
    }
    Object.defineProperty(GameServer, "serverTime", {
        /** 获取服务器当前时间从1970年开始的(即时)(秒) */
        get: function () {
            return GameServer._serverTime + Math.floor(egret.getTimer() * 0.001);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameServer, "serverTimeMilli", {
        /** 服务器毫秒数 */
        get: function () {
            return GameServer._serverTime * 1000 + egret.getTimer();
        },
        enumerable: true,
        configurable: true
    });
    GameServer.setServerTime = function (t) {
        GameServer._serverTime = t - Math.floor(egret.getTimer() * 0.001);
        if (!GameServer.ETNER_GAME_TIME) {
            GameServer.ETNER_GAME_TIME = GameServer._serverTime;
        }
        this.updateTheDayEndTime();
    };
    /**当天结束时刻的毫秒数 */
    GameServer.updateTheDayEndTime = function () {
        var date = new Date(GameServer.serverTimeMilli);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        this._dayEndTime = date.getTime();
        var date2 = new Date(GameServer.serverTimeMilli);
        date2.setDate(date2.getDate() + 1);
        date2.setHours(23);
        date2.setMinutes(59);
        date2.setSeconds(59);
        this._dayEnd2Time = date2.getTime();
        var date3 = new Date(GameServer.serverTimeMilli);
        date3.setDate(date3.getDate() + 2);
        date3.setHours(23);
        date3.setMinutes(59);
        date3.setSeconds(59);
        this._dayEnd3Time = date3.getTime();
    };
    Object.defineProperty(GameServer, "dayEndTime", {
        get: function () {
            return this._dayEndTime;
        },
        enumerable: true,
        configurable: true
    });
    GameServer.prototype.doGetOpenServer = function (bytes) {
        var oldDay = GameServer.serverOpenDay;
        GameServer.serverOpenDay = bytes.day;
        GameServer.loginDay = bytes.loginDay;
        GameServer.updateTheDayEndTime();
        GameGlobal.MessageCenter.dispatch(MessageDef.GAME_SERVER_UPDATE_DAY);
        Deblocking.Update(Deblocking.CHECK_TYPE_04);
        if (oldDay && oldDay != GameServer.serverOpenDay) {
            GameGlobal.OnDayTimer();
        }
    };
    GameServer.prototype.doServerTime = function (bytes) {
        GameServer.setServerTime(bytes.time);
    };
    GameServer.GetSurplusTime = function (timestamp, format, showLength) {
        if (format === void 0) { format = DateUtils.TIME_FORMAT_5; }
        if (showLength === void 0) { showLength = 2; }
        var t = Math.max(0, (timestamp || 0) - this.serverTime);
        return DateUtils.getFormatBySecond(t, format, showLength);
    };
    GameServer.GetPkTime = function (timestamp, format, showLength) {
        if (format === void 0) { format = DateUtils.TIME_FORMAT_11; }
        if (showLength === void 0) { showLength = 2; }
        var t = Math.max(0, (timestamp || 0) - this.serverTime);
        return DateUtils.getFormatBySecond(t, format, showLength);
    };
    GameServer.GettreeTime = function (timestamp, format, showLength) {
        if (format === void 0) { format = DateUtils.TIME_FORMAT_11; }
        if (showLength === void 0) { showLength = 3; }
        var t = Math.max(0, (timestamp || 0) - this.serverTime);
        return DateUtils.getFormatBySecond(t, format, showLength);
    };
    GameServer.Redbag = function (timestamp, format, showLength) {
        if (format === void 0) { format = DateUtils.TIME_FORMAT_15; }
        if (showLength === void 0) { showLength = 3; }
        var t = Math.max(0, (timestamp || 0));
        return DateUtils.getFormatBySecond(t, format, showLength);
    };
    GameServer.JfShow = function (timestamp, format, showLength) {
        if (format === void 0) { format = DateUtils.TIME_FORMAT_9; }
        if (showLength === void 0) { showLength = 3; }
        var t = Math.max(0, (timestamp || 0));
        return DateUtils.getFormatBySecond(t, format, showLength);
    };
    GameServer.PanTaoHui = function (timestamp, format, showLength) {
        if (format === void 0) { format = DateUtils.TIME_FORMAT_2; }
        if (showLength === void 0) { showLength = 3; }
        var t = Math.max(0, (timestamp || 0));
        return DateUtils.getFormatBySecond(t, format, showLength);
    };
    GameServer.JieHun = function (timestamp, format, showLength) {
        if (format === void 0) { format = DateUtils.TIME_FORMAT_14; }
        if (showLength === void 0) { showLength = 3; }
        var t = Math.max(0, (timestamp || 0));
        return DateUtils.getFormatBySecond(t, format, showLength);
    };
    GameServer.IsMerge = function () {
        return this.mergeDay > 0;
    };
    GameServer.prototype._DoBaseReplaceAccount = function () {
        GameServer.mOtherLogin = true;
        alert("你的账号在其它地方登陆");
        LocationProperty.Reload();
    };
    GameServer._serverTime = 0;
    GameServer.loginDay = 1;
    GameServer.mergeDay = 0;
    GameServer.mOtherLogin = false;
    return GameServer;
}());
__reflect(GameServer.prototype, "GameServer");
//# sourceMappingURL=GameServer.js.map