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
var GrowUpModel = (function (_super) {
    __extends(GrowUpModel, _super);
    function GrowUpModel() {
        return _super.call(this) || this;
    }
    GrowUpModel.prototype.IsRedPoint = function () {
        if (this.checkFirstChargeRedPoint()) {
            return true;
        }
        if (this.checkGrowUpRedPoint()) {
            return true;
        }
        if (this.checkInvestmentRedPoint()) {
            return true;
        }
        // if (this.checkConsumptionRedPoint()) {
        // 	return true;
        // }
        return false;
    };
    GrowUpModel.prototype.checkFirstChargeRedPoint = function () {
        var num = GameGlobal.RechargeModel.rechargeNum;
        if (0 == num) {
            return false;
        }
        var config = GameGlobal.Config.FirstRechargeConfig;
        for (var key in config) {
            if (num >= config[key].recharge && !GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
                return true;
            }
        }
        return false;
    };
    GrowUpModel.prototype.checkInvestmentRedPoint = function () {
        return false;
    };
    GrowUpModel.prototype.checkGrowUpRedPoint = function () {
        var _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11);
        if (_activityData) {
            return _activityData.hasReward();
        }
        return false;
    };
    GrowUpModel.prototype.checkConsumptionRedPoint = function () {
        var _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(13);
        if (_activityData) {
            return _activityData.hasReward();
        }
        return false;
    };
    return GrowUpModel;
}(BaseSystem));
__reflect(GrowUpModel.prototype, "GrowUpModel");
//# sourceMappingURL=GrowUpModel.js.map