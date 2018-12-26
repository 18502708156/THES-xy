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
var GBattleBoxItem = (function (_super) {
    __extends(GBattleBoxItem, _super);
    function GBattleBoxItem() {
        return _super.call(this) || this;
    }
    GBattleBoxItem.prototype.childrenCreated = function () {
        this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBoxClick, this);
        this.groupScore.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnScoreClick, this);
    };
    GBattleBoxItem.prototype.SetScoreInfo = function () {
        var gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo;
        var curScore = gbPlayerGlobalInfo.mScore;
        var scoreConfig = GameGlobal.GangBattleModel.GetNextScoreConfig();
        if (scoreConfig) {
            var curScoreText = curScore >= (scoreConfig.needpoints || 0) ? "|C:0x2dff42&T:" + curScore : "|C:0xdb0000&T:" + curScore;
            this.labCurScore.textFlow = TextFlowMaker.generateTextFlow(curScoreText + "/|C:0xffffff&T:" + (scoreConfig.needpoints || 0) + "|");
            var item = scoreConfig.showitem[0];
            this.priceIcon.visible = true;
            this.priceIcon.type = item.id;
            this.priceIcon.setPrice(item.count, 2);
        }
        else {
            this.labCurScore.text = "";
            this.labItem.text = "\u6CA1\u6709\u53EF\u9886\u53D6\u7684\u5956\u52B1";
            this.labItem.textColor = Color.OrangeColor;
            this.priceIcon.visible = false;
        }
    };
    GBattleBoxItem.prototype._OnBoxClick = function (e) {
        ViewManager.ins().open(GBattleScoreWin);
    };
    GBattleBoxItem.prototype._OnScoreClick = function () {
        var gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo;
        var curScore = gbPlayerGlobalInfo.mScore;
        var scoreConfig = GameGlobal.GangBattleModel.GetNextScoreConfig();
        if (!scoreConfig) {
            return;
        }
        if (curScore >= scoreConfig.needpoints) {
            GameGlobal.GangBattleModel.SendGainScoreAward(scoreConfig.id);
        }
        else {
            UserTips.ins().showTips("积分不足");
        }
    };
    return GBattleBoxItem;
}(eui.Component));
__reflect(GBattleBoxItem.prototype, "GBattleBoxItem", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GBattleBoxItem.js.map