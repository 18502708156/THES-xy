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
var DailyChargeGiftIconRule = (function (_super) {
    __extends(DailyChargeGiftIconRule, _super);
    function DailyChargeGiftIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ACTIVITY_UPDATE];
        return _this;
    }
    DailyChargeGiftIconRule.prototype.checkShowIcon = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_140, true))
            return false;
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(28);
        if (!activityData || !activityData.isOpenActivity() || activityData.AllGotten())
            return false;
        var index = activityData.runday;
        var config = activityData.GetConfig()[index - 1];
        this.tar.icon = config.icon;
        return true;
    };
    DailyChargeGiftIconRule.prototype.checkShowRedPoint = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(28);
        if (activityData && activityData.hasReward())
            return true;
        return false;
    };
    DailyChargeGiftIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(DailyChargeGiftWin);
    };
    return DailyChargeGiftIconRule;
}(RuleIconBase));
__reflect(DailyChargeGiftIconRule.prototype, "DailyChargeGiftIconRule");
//# sourceMappingURL=DailyChargeGiftIconRule.js.map