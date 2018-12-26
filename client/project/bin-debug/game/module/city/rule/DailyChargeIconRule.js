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
var DailyChargeIconRule = (function (_super) {
    __extends(DailyChargeIconRule, _super);
    function DailyChargeIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.RECHARGE_DAILY_UPDATE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE, MessageDef.RECHARGE_UPDATE];
        _this.firstTap = true;
        return _this;
    }
    DailyChargeIconRule.prototype.checkShowIcon = function () {
        var b = Deblocking.Check(DeblockingType.TYPE_126, true) && DailyChargeIconRule.showIcon();
        if (!b) {
            if (ViewManager.ins().isShow(DailyFirstChargeWin)) {
                ViewManager.ins().close(DailyFirstChargeWin);
            }
        }
        return b;
    };
    DailyChargeIconRule.showIcon = function () {
        if (GameGlobal.RechargeModel.choicerechare >= 0)
            return false;
        var day = GameGlobal.RechargeModel.dailyId;
        var config = GameGlobal.Config.DailyrechargeConfig[day];
        if (config) {
            var index = 0;
            var reward = GameGlobal.RechargeModel.dailyReward;
            for (var id in config) {
                if (!BitUtil.Has(reward, index)) {
                    return true;
                }
                index++;
            }
        }
        return false;
    };
    DailyChargeIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(e);
    };
    DailyChargeIconRule.prototype.checkShowRedPoint = function () {
        var day = GameGlobal.RechargeModel.dailyId;
        var config = GameGlobal.Config.DailyrechargeConfig[day];
        if (config) {
            var index = 0;
            var recharge = GameGlobal.RechargeModel.dailyRechare;
            var reward = GameGlobal.RechargeModel.dailyReward;
            for (var id in config) {
                if (recharge >= config[id].recharge && !BitUtil.Has(reward, index)) {
                    return true;
                }
                index++;
            }
        }
        return false;
    };
    DailyChargeIconRule.prototype.tapExecute = function () {
        this.firstTap = false;
        ViewManager.ins().open(DailyFirstChargeWin);
    };
    return DailyChargeIconRule;
}(RuleIconBase));
__reflect(DailyChargeIconRule.prototype, "DailyChargeIconRule");
//# sourceMappingURL=DailyChargeIconRule.js.map