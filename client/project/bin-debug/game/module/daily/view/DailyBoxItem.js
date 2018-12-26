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
var DailyBoxItem = (function (_super) {
    __extends(DailyBoxItem, _super);
    function DailyBoxItem() {
        return _super.call(this) || this;
    }
    DailyBoxItem.prototype.childrenCreated = function () {
        this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBoxClick, this);
    };
    DailyBoxItem.prototype.setBoxInfo = function (boxConfig) {
        this.imgBox.name = boxConfig.id;
        this.imgBox.source = "ui_xyll_bm_xiangzi0" + boxConfig.quality;
        this.labActiveNum.text = boxConfig.target;
        this.imgGained.visible = GameGlobal.DailyModel.HasGainedActiveReward(boxConfig.id);
        this.redPoint.visible = GameGlobal.DailyModel.IsActiveTargetDone(boxConfig.target) && !this.imgGained.visible;
    };
    DailyBoxItem.prototype._OnBoxClick = function (e) {
        var rewardNum = parseInt(e.currentTarget.name);
        if (GameGlobal.DailyModel.HasGainedActiveReward(rewardNum)) {
            return;
        }
        var config = GameGlobal.Config.DailyActiveConfig[rewardNum];
        if (GameGlobal.DailyModel.IsActiveTargetDone(config.target)) {
            GameGlobal.DailyModel.SendGainActiveAward(rewardNum);
            return;
        }
        ViewManager.ins().open(DailyAwardView, config.reward, config.target);
    };
    return DailyBoxItem;
}(eui.Component));
__reflect(DailyBoxItem.prototype, "DailyBoxItem", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=DailyBoxItem.js.map