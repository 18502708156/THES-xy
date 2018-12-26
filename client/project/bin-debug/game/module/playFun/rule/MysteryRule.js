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
var MysteryRule = (function (_super) {
    __extends(MysteryRule, _super);
    function MysteryRule(t) {
        var _this = _super.call(this, t) || this;
        _this.firstTap = true;
        _this.effX = _this.tar.width >> 1;
        _this.effY = _this.tar.height >> 1;
        _this.updateMessage = [MessageDef.LEVEL_CHANGE];
        return _this;
    }
    MysteryRule.prototype.checkShowRedPoint = function () {
        return false;
    };
    MysteryRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_138, true);
    };
    MysteryRule.prototype.tapExecute = function () {
        ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_MYSTERY, ShopController.EN_SHOP_INTEGRAL]);
    };
    return MysteryRule;
}(RuleIconBase));
__reflect(MysteryRule.prototype, "MysteryRule");
//# sourceMappingURL=MysteryRule.js.map