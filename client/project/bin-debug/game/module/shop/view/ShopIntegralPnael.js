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
var ShopIntegralPnael = (function (_super) {
    __extends(ShopIntegralPnael, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopIntegralPnael() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShopTitle";
        _this.listView.itemRenderer = IntegralItem;
        _this.priceGoup.visible = false; //不需要使用
        return _this;
    }
    ShopIntegralPnael.prototype.OnOpen = function () {
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent);
        this.listView.dataProvider = new eui.ArrayCollection(ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_INTEGRAL).shop);
        this.UpdateContent();
    };
    ShopIntegralPnael.prototype.UpdateContent = function () {
        var config = GameGlobal.Config.MysticalShopBaseConfig;
        this.account.text = "\u6211\u7684\u79EF\u5206\uFF1A" + GameGlobal.ShopController.getBuyItemNums(config.scorecosttype.id);
    };
    ShopIntegralPnael.NAME = "积分商店";
    return ShopIntegralPnael;
}(BaseView));
__reflect(ShopIntegralPnael.prototype, "ShopIntegralPnael", ["ICommonWindowTitle"]);
var IntegralItem = (function (_super) {
    __extends(IntegralItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function IntegralItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "ShopIntegralItemSkin";
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
        return _this;
    }
    IntegralItem.prototype.childrenCreated = function () {
    };
    IntegralItem.prototype.onClick = function (e) {
        if (egret.is(e.target.parent, 'ItemIcon'))
            return;
        if (this.data) {
            ViewManager.ins().open(BuyWin, this.data);
        }
    };
    IntegralItem.prototype.dataChanged = function () {
        var itemConfig = GlobalConfig.ins().ItemConfig[this.data.id];
        this.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
        this.nameLabel.text = itemConfig.name;
        this.needIntegralTxt.text = "\u79EF\u5206\uFF1A" + this.data.currency.count;
        this.itemIcon.data = itemConfig;
        this.itemIcon.setnameTxtVisible(false);
    };
    return IntegralItem;
}(eui.ItemRenderer));
__reflect(IntegralItem.prototype, "IntegralItem");
//# sourceMappingURL=ShopIntegralPnael.js.map