var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CrossTeamModel = (function (_super) {
    __extends(CrossTeamModel, _super);
    function CrossTeamModel() {
        var _this = _super.call(this, UserFb.FB_TYPE_CROSSTEAMFB) || this;
        _this.mCount = 0;
        _this.clear = [];
        _this.mConfigData = new CrossTeamConfigData;
        _this.regNetMsg(S2cProtocol.sc_cross_team_reward_count, _this._DoDungeonData);
        return _this;
    }
    CrossTeamModel.prototype.OnDayTimer = function () {
        this.m_Double = null;
    };
    CrossTeamModel.prototype.SendGetInfos = function () {
        this.Rpc(C2sProtocol.cs_cross_team_reward_count);
    };
    CrossTeamModel.prototype._DoDungeonData = function (rsp) {
        this.mCount = rsp.count;
        this.clear = rsp.clear || [];
        GameGlobal.MessageCenter.dispatch(MessageDef.TEAM_FUBEN_INFO);
    };
    CrossTeamModel.prototype.CheckEnter = function (level) {
        var configData = GameGlobal.Config.CrossTeamFbConfig[level];
        if (!configData) {
            console.error("配置不存在 => " + level);
            return false;
        }
        if (GameGlobal.actorModel.level < configData.level) {
            UserTips.InfoTip("玩家" + configData.level + "级才能进入");
            return false;
        }
        return true;
    };
    CrossTeamModel.prototype.GetConfig = function () {
        if (!this.m_ConfigList) {
            this.m_ConfigList = CommonUtils.GetArray(GameGlobal.Config.CrossTeamFbConfig, "level");
        }
        return this.m_ConfigList;
    };
    // 是否是双倍奖励
    CrossTeamModel.prototype.IsDoubleReward = function () {
        if (GameServer.serverOpenDay == 1) {
            return true;
        }
        if (!this.m_Double) {
            var data = this.m_Double = [];
            var config = GameGlobal.Config.CrossTeamConfig;
            data.push({ start: this.GetTimeNum(config.doubleBeginTimeSecond, -1), end: this.GetTimeNum(config.doubleEndTimeSecond) });
            data.push({ start: this.GetTimeNum(config.doubleBeginTime), end: this.GetTimeNum(config.doubleEndTime) });
            data.push({ start: this.GetTimeNum(config.doubleBeginTimeSecond), end: this.GetTimeNum(config.doubleEndTimeSecond, 1) });
        }
        var t = GameServer.serverTime * 1000;
        for (var _i = 0, _a = this.m_Double; _i < _a.length; _i++) {
            var time = _a[_i];
            if (t >= time.start && t <= time.end) {
                return true;
            }
        }
        return false;
    };
    // 获取剩余收益次数
    CrossTeamModel.prototype.GetCount = function () {
        return this.mCount || 0;
    };
    CrossTeamModel.prototype.GetDesc = function () {
        if (GameServer.serverOpenDay == 1) {
            return "全天银两和经验双倍收益，3人组队再加成30%";
        }
        var config = GameGlobal.Config.CrossTeamConfig;
        return this.GetTimeStr(config.doubleBeginTime) + "-" + this.GetTimeStr(config.doubleEndTime) + "\u548C" + this.GetTimeStr(config.doubleBeginTimeSecond) + "-" + this.GetTimeStr(config.doubleEndTimeSecond) + "\u94F6\u4E24\u548C\u7ECF\u9A8C\u53CC\u500D\u6536\u76CA\uFF0C3\u4EBA\u7EC4\u961F\u518D\u52A0\u621030%";
    };
    CrossTeamModel.prototype.GetDescForDaily = function () {
        if (GameServer.serverOpenDay == 1) {
            return "跨服组队银两和经验双倍收益";
        }
        var config = GameGlobal.Config.CrossTeamConfig;
        return this.GetTimeStr(config.doubleBeginTime) + "-" + this.GetTimeStr(config.doubleEndTime) + "\u548C" + this.GetTimeStr(config.doubleBeginTimeSecond) + "-" + this.GetTimeStr(config.doubleEndTimeSecond) + "\u8DE8\u670D\u7EC4\u961F\u94F6\u4E24\u548C\u7ECF\u9A8C\u53CC\u500D\u6536\u76CA";
    };
    CrossTeamModel.prototype.GetTimeNum = function (data, day) {
        if (day === void 0) { day = 0; }
        var h = data.hour;
        var m = data.minute;
        var date = new Date();
        if (day) {
            date.setDate(date.getDate() + day);
        }
        date.setHours(h, m, 0, 0);
        return date.getTime();
    };
    CrossTeamModel.prototype.GetTimeStr = function (data) {
        return DateUtils.formatTimeNum(data.hour) + ":" + DateUtils.formatTimeNum(data.minute);
    };
    CrossTeamModel.prototype.IsFirst = function (key) {
        for (var _i = 0, _a = this.clear; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.level == key) {
                return data.count < 1;
            }
        }
        return true;
    };
    CrossTeamModel.prototype.IsNotEnter = function (level) {
        var config = GameGlobal.Config.CrossTeamFbConfig[level];
        if (!config) {
            return "";
        }
        if (GameGlobal.actorModel.level < config.level) {
            return config.level + "级开启";
        }
        return "";
    };
    return CrossTeamModel;
}(CrossTeamBaseModel));
__reflect(CrossTeamModel.prototype, "CrossTeamModel");
//# sourceMappingURL=CrossTeamModel.js.map