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
var CrossTeamPanel = (function (_super) {
    __extends(CrossTeamPanel, _super);
    function CrossTeamPanel() {
        var _this = _super.call(this) || this;
        _this.m_Model = GameGlobal.CrossTeamModel;
        var config = GameGlobal.Config.CrossTeamConfig;
        return _this;
        // this.mTime = new TeamTime(config.autoQuickTIme, config.autoFightTime)
        // this.mTime.Reset()
    }
    CrossTeamPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        var config = GameGlobal.Config.CrossTeamConfig;
        this.teamBaseMemberView.SetTime(config.autoQuickTIme, config.autoFightTime);
    };
    CrossTeamPanel.prototype.InitInfo = function () {
        GameGlobal.CrossTeamModel.SendGetInfos();
        this.observe(MessageDef.TEAM_FUBEN_INFO, this.UpdateInfo);
        this.UpdateInfo();
    };
    CrossTeamPanel.prototype.UpdateInfo = function () {
        var config = GameGlobal.Config.CrossTeamConfig;
        this.infoLabel.text = GameGlobal.CrossTeamModel.GetDesc();
        // this.count_label.text = `剩余收益次数\n${GameGlobal.CrossTeamModel.mCount}/${config.rewardCount}`
        this.teamBaseMemberView.SetCountLabel("\u5269\u4F59\u6536\u76CA\u6B21\u6570\n" + GameGlobal.CrossTeamModel.mCount + "/" + config.rewardCount);
    };
    CrossTeamPanel.prototype.GetFirstShowKey = function () {
        var list = this.m_Model.GetConfig();
        var key = null;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data = list_1[_i];
            if (GameGlobal.actorModel.level >= data.level) {
                key = data.level;
            }
            else {
                break;
            }
        }
        return key;
    };
    // protected IsNotEnter(level: number): string {
    //     let config = GameGlobal.Config.CrossTeamFbConfig[level]
    // 	if (!config) {
    // 		return ""
    // 	}
    // 	if (GameGlobal.actorModel.level < config.level) {
    // 		return "等级达到" + config.level + "级开启"
    // 	}
    //     return ""
    // }
    CrossTeamPanel.RedPointCheck = function () {
        return GameGlobal.CrossTeamModel.IsDoubleReward();
    };
    CrossTeamPanel.NAME = "跨服组队";
    return CrossTeamPanel;
}(TeamBasePanel));
__reflect(CrossTeamPanel.prototype, "CrossTeamPanel");
//# sourceMappingURL=CrossTeamPanel.js.map