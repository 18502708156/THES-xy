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
var InvestmentIconRule = (function (_super) {
    __extends(InvestmentIconRule, _super);
    function InvestmentIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.isFirstCharge = false;
        _this.firstTap = true;
        _this.updateMessage = [MessageDef.RECHARGE_FIRST_UPDATE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE];
        return _this;
    }
    InvestmentIconRule.prototype.checkShowIcon = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_107, true))
            return false;
        this.isFirstCharge = false;
        var config = GameGlobal.Config.FirstRechargeConfig;
        for (var key in config) {
            if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
                this.isFirstCharge = true;
                break;
            }
        }
        /*投资计划 */
        var investData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(12);
        if (investData && investData.isOpenActivity()) {
            if (0 == investData.status) {
                this.setTime(investData.endTime * 1000);
            }
            else {
                this.setTime(0);
            }
            return true;
        }
        if (investData && investData.canReward()) {
            return true;
        }
        return false;
    };
    InvestmentIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(e);
    };
    InvestmentIconRule.prototype.checkShowRedPoint = function () {
        return false;
    };
    InvestmentIconRule.prototype.tapExecute = function () {
        this.firstTap = false;
        ViewManager.ins().open(GrowUpWin, this.isFirstCharge ? 2 : 1);
    };
    return InvestmentIconRule;
}(RuleIconBase));
__reflect(InvestmentIconRule.prototype, "InvestmentIconRule");
//# sourceMappingURL=InvestmentIconRule.js.map