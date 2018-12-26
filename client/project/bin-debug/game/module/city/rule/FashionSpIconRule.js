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
var FashionSpIconRule = (function (_super) {
    __extends(FashionSpIconRule, _super);
    function FashionSpIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    FashionSpIconRule.prototype.checkShowIcon = function () {
        // return Deblocking.Check(DeblockingType.TYPE_74, true)
        return false;
    };
    FashionSpIconRule.prototype.checkShowRedPoint = function () {
        return false;
    };
    FashionSpIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_ZHUANGBAN, ShopController.EN_SHOP_PIFU, ShopController.EN_SHOP_YOUQING, ShopController.EN_SHOP_WEIWANG]);
    };
    return FashionSpIconRule;
}(RuleIconBase));
__reflect(FashionSpIconRule.prototype, "FashionSpIconRule");
//# sourceMappingURL=FashionSpIconRule.js.map