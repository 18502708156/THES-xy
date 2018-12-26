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
var GuildTeamModel = (function (_super) {
    __extends(GuildTeamModel, _super);
    function GuildTeamModel() {
        var _this = _super.call(this, UserFb.FB_TYPE_GUILDFB) || this;
        _this.index = -1;
        _this.mConfigData = new GuildTeamConfigData;
        return _this;
    }
    GuildTeamModel.prototype.SendGetInfos = function () {
        this.Rpc(C2sProtocol.cs_guild_dungeon_info, null, this._DoDungeonData, this);
    };
    GuildTeamModel.prototype._DoDungeonData = function (rsp) {
        this.mDungeonInfo = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.TEAM_FUBEN_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_FBCOUNT);
    };
    GuildTeamModel.prototype.GetConfig = function () {
        if (!this.m_ConfigList) {
            this.m_ConfigList = CommonUtils.GetArray(GameGlobal.Config.GuildFubenConfig, "id");
        }
        return this.m_ConfigList;
    };
    GuildTeamModel.prototype.CheckEnter = function (id) {
        var configData = GameGlobal.Config.GuildFubenConfig[id];
        if (!configData) {
            console.error("配置不存在 => " + id);
            return false;
        }
        if (GameGlobal.GangModel.myGangInfo.mLevel < configData.needlv) {
            UserTips.InfoTip("帮会" + configData.needlv + "级才能进入");
            return false;
        }
        return true;
    };
    GuildTeamModel.prototype.GetCount = function () {
        return this.GetProfitCount();
    };
    GuildTeamModel.prototype.GetAssistCount = function () {
        var config = GameGlobal.Config.GuildFubenBaseConfig;
        var info = this.mDungeonInfo;
        if (info) {
            return Math.max(config.assistcount - info.assistCount, 0);
        }
        return 0;
    };
    GuildTeamModel.prototype.GetProfitCount = function () {
        var config = GameGlobal.Config.GuildFubenBaseConfig;
        var info = this.mDungeonInfo;
        if (info) {
            return Math.max(config.profitCount - info.profitCount, 0);
        }
        return 0;
    };
    GuildTeamModel.prototype.IsFirst = function (key) {
        var info = this.mDungeonInfo;
        if (info) {
            return info.firstReach.indexOf(key) == -1;
        }
        return true;
    };
    GuildTeamModel.prototype.IsNotEnter = function (id) {
        var config = GameGlobal.Config.GuildFubenConfig[id];
        if (!config) {
            return "";
        }
        if (GameGlobal.GangModel.myGangInfo.mLevel < config.needlv) {
            return "帮会" + config.needlv + "级开启";
        }
        return "";
    };
    return GuildTeamModel;
}(CrossTeamBaseModel));
__reflect(GuildTeamModel.prototype, "GuildTeamModel");
//# sourceMappingURL=GuildTeamModel.js.map