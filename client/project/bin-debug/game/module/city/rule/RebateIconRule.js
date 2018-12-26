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
var RebateIconRule = (function (_super) {
    __extends(RebateIconRule, _super);
    function RebateIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    RebateIconRule.prototype.checkShowIcon = function () {
        var dataList = [];
        var ActivitySumBtnConfig = GameGlobal.Config.ActivitySumBtnConfig;
        for (var Config in ActivitySumBtnConfig) {
            if (ActivitySumBtnConfig[Number(Config)].openId == 5) {
                dataList.push(Number(Config));
                var BaseModel = GameGlobal.ActivityKaiFuModel.GetActivityDataById(Number(Config));
                if (BaseModel) {
                    if (BaseModel.openState) {
                        this.id = Number(Config);
                    }
                }
            }
        }
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.id);
        var b = Deblocking.Check(DeblockingType.TYPE_132, true) && activityData && activityData.isOpenActivity();
        if (b) {
            this.setTime(activityData.endTime * 1000);
        }
        else {
            this.setTime(0);
        }
        return b;
    };
    RebateIconRule.prototype.checkShowRedPoint = function () {
        return RechargeRebatePanel.CheckRedPoint(this.id);
    };
    RebateIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(RechargeRebateMainPanel);
    };
    return RebateIconRule;
}(RuleIconBase));
__reflect(RebateIconRule.prototype, "RebateIconRule");
//# sourceMappingURL=RebateIconRule.js.map