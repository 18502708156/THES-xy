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
var ShopMijingPnael = (function (_super) {
    __extends(ShopMijingPnael, _super);
    function ShopMijingPnael() {
        return _super.call(this) || this;
    }
    ShopMijingPnael.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_MIJING);
    };
    ShopMijingPnael.NAME = "秘境商店";
    return ShopMijingPnael;
}(ShopNormalView));
__reflect(ShopMijingPnael.prototype, "ShopMijingPnael");
//# sourceMappingURL=ShopMijingPnael.js.map