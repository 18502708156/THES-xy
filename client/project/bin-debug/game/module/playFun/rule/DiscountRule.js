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
var DiscountRule = (function (_super) {
    __extends(DiscountRule, _super);
    function DiscountRule(t) {
        var _this = _super.call(this, t) || this;
        _this.firstTap = true;
        // this.effX = RuleIconBase.POS1_X
        // this.effY = RuleIconBase.POS1_Y
        _this.effX = _this.tar.width >> 1;
        _this.effY = _this.tar.height >> 1;
        _this.updateMessage = [MessageDef.RECHARGE_UPDATE];
        return _this;
    }
    DiscountRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.RechargeModel.choicerechare > 0;
    };
    DiscountRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_129, true) && GameGlobal.RechargeModel.choicerechare >= 0;
        ;
    };
    DiscountRule.CheckShow = function () {
        return GameGlobal.RechargeModel.choicerechare >= 0;
    };
    DiscountRule.prototype.tapExecute = function () {
        ViewManager.ins().open(RechargeAwardPanel);
    };
    DiscountRule.prototype.getEffName = function (redPointNum) {
        return this.DefEffe(redPointNum);
    };
    DiscountRule.Open = function () {
        if (GameGlobal.RechargeModel.choicerechare >= 0) {
            ViewManager.ins().open(RechargeAwardPanel);
        }
        else {
            UserTips.InfoTip("已经购买");
        }
    };
    return DiscountRule;
}(RuleIconBase));
__reflect(DiscountRule.prototype, "DiscountRule");
//# sourceMappingURL=DiscountRule.js.map