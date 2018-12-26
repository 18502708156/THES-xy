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
var EquipSpIconRule = (function (_super) {
    __extends(EquipSpIconRule, _super);
    function EquipSpIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ITEM_COUNT_CHANGE];
        return _this;
    }
    EquipSpIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_70, true);
    };
    EquipSpIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.UserBag.HasOrangeEquip();
    };
    EquipSpIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_EQUIP]);
    };
    return EquipSpIconRule;
}(RuleIconBase));
__reflect(EquipSpIconRule.prototype, "EquipSpIconRule");
//# sourceMappingURL=EquipSpIconRule.js.map