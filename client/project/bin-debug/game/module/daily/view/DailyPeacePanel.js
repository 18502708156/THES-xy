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
var DailyPeacePanel = (function (_super) {
    __extends(DailyPeacePanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DailyPeacePanel() {
        return _super.call(this) || this;
    }
    DailyPeacePanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnOneKey, this._OnClick);
        this.list.itemRenderer = DailyPeaceItem;
        var peaceList = DailyConst.GetPeaceList();
        this.list.dataProvider = new eui.ArrayCollection(peaceList);
        this.SetWaveInfo();
    };
    DailyPeacePanel.prototype.SetWaveInfo = function () {
        var peaceInfo = GameGlobal.DailyModel.peaceInfo;
        var maxCount = GameGlobal.Config.DailyBaseConfig.chapterWar;
        this.labWaveCount.textFlow = TextFlowMaker.generateTextFlow("|C:0x019704&T:" + peaceInfo.mCurValue + "||C:0x6e330b&T:/" + maxCount + "|");
        this.btnOneKey.enabled = !GameGlobal.DailyModel.IsPeaceTargetDone(maxCount);
    };
    DailyPeacePanel.prototype.UpdateContent = function () {
        this.SetWaveInfo();
        UIHelper.ListRefresh(this.list);
    };
    DailyPeacePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.DAILY_PEACE_UPDATE, this.UpdateContent);
    };
    DailyPeacePanel.prototype.OnClose = function () {
    };
    DailyPeacePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnOneKey:
                var peaceInfo = GameGlobal.DailyModel.peaceInfo;
                var maxCount = GameGlobal.Config.DailyBaseConfig.chapterWar;
                var count_1 = maxCount - peaceInfo.mCurValue;
                var cost_1 = GameGlobal.Config.DailyBaseConfig.chapterWarcost[0];
                WarnWin.show("\u662F\u5426\u82B1\u8D39" + cost_1.count * count_1 + "\u5143\u5B9D\u5FEB\u901F\u5B8C\u6210\uFF1F", function () {
                    if (Checker.Money(cost_1.id, cost_1.count * count_1)) {
                        GameGlobal.DailyModel.SendQuilkDone(DailyConst.TYPE_PEACE);
                    }
                }, this);
                break;
        }
    };
    DailyPeacePanel.NAME = "平定安邦"; //"每日300"
    return DailyPeacePanel;
}(BaseView));
__reflect(DailyPeacePanel.prototype, "DailyPeacePanel", ["ICommonWindowTitle"]);
var DailyPeaceItem = (function (_super) {
    __extends(DailyPeaceItem, _super);
    function DailyPeaceItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    DailyPeaceItem.prototype.childrenCreated = function () {
        this.btnGain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGainBtnClick, this);
    };
    DailyPeaceItem.prototype.dataChanged = function () {
        var config = this.data;
        this.btnGain.name = config.reward;
        //this.labText.text = `消灭${config.target}波奖励`
        this.labText.text = "\u91CE\u5916\u9047\u602A" + config.target + "\u6CE2\u5956\u52B1";
        this.imgGained.visible = GameGlobal.DailyModel.HasGainedPeaceReward(config.reward);
        this.btnGain.visible = !GameGlobal.DailyModel.HasGainedPeaceReward(config.reward);
        var redPointFlag = GameGlobal.DailyModel.IsPeaceTargetDone(config.target) && !GameGlobal.DailyModel.HasGainedPeaceReward(config.reward);
        UIHelper.ShowRedPoint(this.btnGain, redPointFlag);
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
    DailyPeaceItem.prototype._OnGainBtnClick = function (e) {
        var rewardNum = parseInt(e.currentTarget.name);
        if (!GameGlobal.DailyModel.IsPeaceTargetDone(this.data.target)) {
            UserTips.ins().showTips("目标未达成，不可领取！");
            return;
        }
        GameGlobal.DailyModel.SendGainAward(DailyConst.TYPE_PEACE, rewardNum);
    };
    return DailyPeaceItem;
}(eui.ItemRenderer));
__reflect(DailyPeaceItem.prototype, "DailyPeaceItem");
//# sourceMappingURL=DailyPeacePanel.js.map