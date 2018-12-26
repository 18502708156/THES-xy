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
var DailyTeamPanel = (function (_super) {
    __extends(DailyTeamPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DailyTeamPanel() {
        return _super.call(this) || this;
    }
    DailyTeamPanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnGoTo, this._OnClick);
        this._AddClick(this.btnOneKey, this._OnClick);
        this.UpdateContent();
    };
    DailyTeamPanel.prototype.UpdateContent = function () {
        var teamInfo = GameGlobal.DailyModel.teamInfo;
        var maxCount = GameGlobal.Config.CrossTeamConfig.rewardCount;
        this.labCount.text = GameGlobal.CrossTeamModel.GetCount() + "/" + maxCount;
        this.labTip.text = GameGlobal.CrossTeamModel.GetDescForDaily();
        var ambitionCount = GameGlobal.Config.DailyBaseConfig.teamFB;
        this.labAmbitionTip.text = "\u5B8C\u6210" + ambitionCount + "\u6B21\u4EFB\u610F\u7EC4\u961F\u526F\u672C\u53EF\u83B7\u5F97\u4EE5\u4E0B\u989D\u5916\u5956\u52B1";
        this.imgDouble.visible = GameGlobal.CrossTeamModel.IsDoubleReward();
        this.prog.maximum = ambitionCount;
        this.prog.value = teamInfo.mCurValue;
        this.btnOneKey.label = GameGlobal.DailyModel.IsTeamTargetDone() ? "领取奖励" : "一键完成";
        this.btnOneKey.enabled = !GameGlobal.DailyModel.HasGainedTeamReward();
        var redPointFlag = GameGlobal.DailyModel.IsTeamTargetDone() && !GameGlobal.DailyModel.HasGainedTeamReward();
        UIHelper.ShowRedPoint(this.btnOneKey, redPointFlag);
        if (GameGlobal.DailyModel.HasGainedTeamReward())
            this.btnOneKey.label = "已领取";
        var config = DailyConst.GetTeamConfig();
        var idx = 1;
        for (var _i = 0, _a = config.itemid; _i < _a.length; _i++) {
            var reward = _a[_i];
            var itemName = "item" + idx;
            if (this[itemName]) {
                this[itemName].visible = true;
                this[itemName].setItemAward(reward.type, reward.id, reward.count);
            }
            idx++;
        }
    };
    DailyTeamPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.DAILY_TEAM_UPDATE, this.UpdateContent);
    };
    DailyTeamPanel.prototype.OnClose = function () {
    };
    DailyTeamPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnGoTo:
                ViewManager.ins().open(CrossMainPanel);
                ViewManager.ins().close(DailyMainWin);
                break;
            case this.btnOneKey:
                if (GameGlobal.DailyModel.IsTeamTargetDone()) {
                    var config = DailyConst.GetTeamConfig();
                    GameGlobal.DailyModel.SendGainAward(DailyConst.TYPE_TEAM, config.reward);
                }
                else {
                    var cost_1 = GameGlobal.Config.DailyBaseConfig.teamFBcost[0];
                    WarnWin.show("\u662F\u5426\u82B1\u8D39" + cost_1.count + "\u5143\u5B9D\u5FEB\u901F\u5B8C\u6210\uFF1F", function () {
                        if (Checker.Money(cost_1.id, cost_1.count)) {
                            GameGlobal.DailyModel.SendQuilkDone(DailyConst.TYPE_TEAM);
                        }
                    }, this);
                }
                break;
        }
    };
    DailyTeamPanel.NAME = "组队历练";
    return DailyTeamPanel;
}(BaseView));
__reflect(DailyTeamPanel.prototype, "DailyTeamPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=DailyTeamPanel.js.map