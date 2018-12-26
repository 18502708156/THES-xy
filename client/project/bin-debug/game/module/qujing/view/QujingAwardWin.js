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
var QujingAwardWin = (function (_super) {
    __extends(QujingAwardWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function QujingAwardWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "QujingAwardSkin";
        _this._AddClick(_this.btnAward, _this._OnClick);
        return _this;
    }
    QujingAwardWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "取经奖励";
        this.UpdateContent(param[0]);
    };
    QujingAwardWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    QujingAwardWin.prototype.UpdateContent = function (rewardInfo) {
        var baseInfo = GameGlobal.QujingModel.baseInfo;
        var config = GameGlobal.QujingModel.GetConfigByQuality(baseInfo.mQuality);
        this.labName.text = config.name;
        this.labName.textColor = ItemBase.GetColorByQuality(config.quality - 1);
        this.imgIcon.source = config.icon;
        var index = 1;
        for (var _i = 0, _a = rewardInfo.reachReward || []; _i < _a.length; _i++) {
            var reward = _a[_i];
            var cntlName = "labAward" + index;
            if (this[cntlName]) {
                this[cntlName].visible = true;
                var lossCount = this.GetLossCount(reward, rewardInfo.lossReward || []);
                var text = "|C:0x6e330b&T:" + this.GetItemName(reward) + "\uFF1A||C:0x019704&T:" + reward.count + "|";
                if (lossCount) {
                    text += "|C:0xdb0000&T:  " + lossCount + "| ";
                }
                this[cntlName].textFlow = TextFlowMaker.generateTextFlow(text);
            }
            index++;
        }
        index = 1;
        for (var _b = 0, _c = rewardInfo.record; _b < _c.length; _b++) {
            var record = _c[_b];
            var groupName = "groupTip" + index;
            if (this[groupName]) {
                this[groupName].visible = true;
                var text = "|C:0x019704&T:" + record.name + "||C:0x6e330b&T:\u62A2\u593A\u4E86\u6211\u7684||C:0xdb0000&T:" + config.name + "|";
                this["labTip" + index].textFlow = TextFlowMaker.generateTextFlow(text);
                this["labResult" + index].text = record.isWin ? "抵御失败" : "抵御成功";
                this["labResult" + index].textColor = record.isWin ? 0xdb0000 : 0x019704;
            }
            index++;
        }
    };
    QujingAwardWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnAward:
                GameGlobal.QujingModel.SendGainAward();
                ViewManager.ins().close(this);
                break;
        }
    };
    QujingAwardWin.prototype.GetLossCount = function (reward, lossList) {
        for (var _i = 0, lossList_1 = lossList; _i < lossList_1.length; _i++) {
            var lostInfo = lossList_1[_i];
            if (reward.id == lostInfo.id)
                return lostInfo.count;
        }
    };
    QujingAwardWin.prototype.GetItemName = function (reward) {
        if (reward.type == 0)
            return RewardData.getCurrencyName(reward.id);
        var itemConfig = GlobalConfig.ins().ItemConfig[reward.id];
        return itemConfig.name;
    };
    QujingAwardWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return QujingAwardWin;
}(BaseEuiView));
__reflect(QujingAwardWin.prototype, "QujingAwardWin");
//# sourceMappingURL=QujingAwardWin.js.map