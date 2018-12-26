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
var RechargeFeedbackIconRule = (function (_super) {
    __extends(RechargeFeedbackIconRule, _super);
    function RechargeFeedbackIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ACTIVITY_UPDATE];
        return _this;
    }
    RechargeFeedbackIconRule.prototype.checkShowIcon = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_141, true))
            return false;
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(29);
        if (!activityData || !activityData.isOpenActivity() || activityData.AllGotten())
            return false;
        this.setTime(activityData.endTime * 1000);
        return true;
    };
    RechargeFeedbackIconRule.prototype.checkShowRedPoint = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(29);
        if (activityData && activityData.hasReward())
            return true;
        return false;
    };
    RechargeFeedbackIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(RechargeFeedbackWin);
    };
    return RechargeFeedbackIconRule;
}(RuleIconBase));
__reflect(RechargeFeedbackIconRule.prototype, "RechargeFeedbackIconRule");
//# sourceMappingURL=RechargeFeedbackIconRule.js.map