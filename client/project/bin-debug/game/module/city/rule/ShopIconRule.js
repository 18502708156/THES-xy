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
var ShopIconRule = (function (_super) {
    __extends(ShopIconRule, _super);
    function ShopIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    ShopIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_66, true);
    };
    ShopIconRule.prototype.checkShowRedPoint = function () {
        return false;
    };
    ShopIconRule.prototype.tapExecute = function () {
        // ViewManager.ins().open(ShopLayer, 
        // [ShopController.EN_SHOP_YUANBAO,ShopController.EN_SHOP_BANGYUAN,ShopController.EN_SHOP_CHONGWU,ShopController.EN_SHOP_XIANLV])
        ViewManager.ins().open(ShopCommonPanel);
    };
    return ShopIconRule;
}(RuleIconBase));
__reflect(ShopIconRule.prototype, "ShopIconRule");
//# sourceMappingURL=ShopIconRule.js.map