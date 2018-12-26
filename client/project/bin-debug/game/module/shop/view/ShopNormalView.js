/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 常规商店详情
 *
 **/
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
var ShopNormalView = (function (_super) {
    __extends(ShopNormalView, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopNormalView() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShopTitle";
        _this.listView.itemRenderer = ShopRectItem;
        return _this;
    }
    ShopNormalView.prototype.OnOpen = function () {
        this.goPrice.visible = false; //不需要使用
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setMoney);
        this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent); //商店购买变化
        // this._AddItemClick(this.listView, this.onListViewClick)
        this.setMoney();
        this.UpdateContent();
    };
    ShopNormalView.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_DAYAN);
    };
    ShopNormalView.prototype.UpdateContent = function () {
        this.setData();
        this.listView.dataProvider.replaceAll(this.tShopData.shop);
        var strAccount = "";
        var strNums = GameGlobal.UserFb.lltModel.layer + "";
        if (typeof (this.tShopData.instructions) == "string") {
            strAccount = this.tShopData.instructions.replace("%s", strNums); //这里系统并没有参数,所以后期需要补充
        }
        this.account.text = strAccount;
    };
    ShopNormalView.prototype.onListViewClick = function (e) {
        var pItem = e.item;
        if (pItem && ShopController.ins().enoughBuy(pItem)) {
            ViewManager.ins().open(BuyWin, pItem);
        }
    };
    ShopNormalView.prototype.setMoney = function () {
        this.setData();
        if (this.tShopData.moneytype) {
            this.priceIcon.setType(this.tShopData.moneytype);
            this.priceIcon.price = CommonUtils.overLength(ShopController.ins().getBuyItemNums(this.tShopData.moneytype));
        }
    };
    ShopNormalView.NAME = "宝塔商店";
    return ShopNormalView;
}(BaseView));
__reflect(ShopNormalView.prototype, "ShopNormalView", ["ICommonWindowTitle"]);
//# sourceMappingURL=ShopNormalView.js.map