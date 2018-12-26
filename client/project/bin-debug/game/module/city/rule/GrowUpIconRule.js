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
var GrowUpIconRule = (function (_super) {
    __extends(GrowUpIconRule, _super);
    function GrowUpIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.isFirstCharge = false;
        _this.firstTap = true;
        _this.updateMessage = [MessageDef.RECHARGE_FIRST_UPDATE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE];
        return _this;
    }
    GrowUpIconRule.prototype.checkShowIcon = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_106, true))
            return false;
        this.isFirstCharge = false;
        var config = GameGlobal.Config.FirstRechargeConfig;
        for (var key in config) {
            if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
                this.isFirstCharge = true;
                break;
            }
        }
        /*成长基金 */
        var growupData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11);
        if (growupData && growupData.isOpenActivity()) {
            if (0 == growupData.status) {
                this.setTime(growupData.endTime * 1000);
            }
            else {
                this.setTime(0);
            }
            return true;
        }
        if (growupData && growupData.canReward()) {
            return true;
        }
        return false;
    };
    GrowUpIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(e);
    };
    GrowUpIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.GrowUpModel.checkGrowUpRedPoint();
    };
    GrowUpIconRule.prototype.tapExecute = function () {
        this.firstTap = false;
        ViewManager.ins().open(GrowUpWin, this.isFirstCharge ? 1 : 0);
    };
    return GrowUpIconRule;
}(RuleIconBase));
__reflect(GrowUpIconRule.prototype, "GrowUpIconRule");
//# sourceMappingURL=GrowUpIconRule.js.map