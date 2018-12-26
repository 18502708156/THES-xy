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
var GangFuBenPanel = (function (_super) {
    __extends(GangFuBenPanel, _super);
    function GangFuBenPanel() {
        var _this = _super.call(this) || this;
        _this.m_Model = GameGlobal.GuildTeamModel;
        var config = GameGlobal.Config.GuildFubenBaseConfig;
        return _this;
        // this.mTime = new TeamTime(config.aotuteam, config.fubenaotu)
        // this.mTime.Reset()
    }
    GangFuBenPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        var config = GameGlobal.Config.GuildFubenBaseConfig;
        this.teamBaseMemberView.SetTime(config.aotuteam, config.fubenaotu);
    };
    // protected IsNotEnter(id: number): string {
    //     let config = GameGlobal.Config.GuildFubenConfig[id]
    // 	if (!config) {
    // 		return ""
    // 	}
    // 	if (GameGlobal.GangModel.myGangInfo.mLevel < config.needlv) {
    // 		return "帮会等级达到" + config.needlv + "级开启"
    // 	}
    //     return ""
    // }
    GangFuBenPanel.prototype.InitInfo = function () {
        GameGlobal.GuildTeamModel.SendGetInfos();
        this.observe(MessageDef.TEAM_FUBEN_INFO, this.UpdateInfo);
        this.UpdateInfo();
    };
    GangFuBenPanel.prototype.GetFirstShowKey = function () {
        var list = this.m_Model.GetConfig();
        var key = null;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data = list_1[_i];
            if (GameGlobal.GangModel.myGangInfo.mLevel >= data.needlv) {
                key = data.id;
            }
            else {
                break;
            }
        }
        return key;
    };
    GangFuBenPanel.prototype.UpdateInfo = function () {
        var config = GameGlobal.Config.GuildFubenBaseConfig;
        var info = GameGlobal.GuildTeamModel.mDungeonInfo;
        this.infoLabel.text = "\u534F\u52A9\u4ED6\u4EBA\u901A\u5173\u526F\u672C\uFF0C\u53EF\u83B7\u5F97\u534F\u52A9\u5956\u52B1\uFF0C\u6BCF\u5929\u534F\u52A9\u6B21\u6570(" + GameGlobal.GuildTeamModel.GetAssistCount() + "/" + config.assistcount + ")";
        // this.count_label.text = `剩余收益次数\n${GameGlobal.GuildTeamModel.GetProfitCount()}/${config.profitCount}`
        this.teamBaseMemberView.SetCountLabel("\u5269\u4F59\u6536\u76CA\u6B21\u6570\n" + GameGlobal.GuildTeamModel.GetProfitCount() + "/" + config.profitCount);
    };
    GangFuBenPanel.NAME = "帮会副本";
    return GangFuBenPanel;
}(TeamBasePanel));
__reflect(GangFuBenPanel.prototype, "GangFuBenPanel");
//# sourceMappingURL=GangFuBenPanel.js.map