/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/10 15:51
 * @meaning: 元宝商店详情
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
var ShopYuanBaoLayer = (function (_super) {
    __extends(ShopYuanBaoLayer, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopYuanBaoLayer() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShopTitle";
        _this.listView.itemRenderer = ShopRectItem;
        _this.goPrice.visible = false; //不需要使用
        return _this;
    }
    ShopYuanBaoLayer.prototype.OnOpen = function () {
        this.observe(MessageDef.GOLD_CHANGE, this.setMoney); //目前只对钱变化进行处理,后续需要添加
        this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent); //商店购买变化
        // this._AddItemClick(this.listView, this.onListViewClick)
        this.setMoney();
        this.UpdateContent();
    };
    ShopYuanBaoLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_YUANBAO);
    };
    ShopYuanBaoLayer.prototype.UpdateContent = function () {
        this.setData();
        this.listView.dataProvider.replaceAll(this.tShopData.shop);
        var strAccount = "";
        if (typeof (this.tShopData.instructions) == "string") {
            strAccount = this.tShopData.instructions.replace("%s", "0"); //这里系统并没有参数,所以后期需要补充
        }
        this.account.text = strAccount;
        Util.GetClass(this).NAME = this.tShopData.storename;
    };
    ShopYuanBaoLayer.prototype.onListViewClick = function (e) {
        var pItem = e.item;
        if (pItem && ShopController.ins().enoughBuy(pItem)) {
            ViewManager.ins().open(BuyWin, pItem);
        }
    };
    ShopYuanBaoLayer.prototype.setMoney = function () {
        this.setData();
        if (this.tShopData.moneytype && this.tShopData.moneytype < 10) {
            this.priceIcon.setType(this.tShopData.moneytype);
            switch (this.tShopData.moneytype) {
                case 1:
                    this.priceIcon.price = CommonUtils.overLength(GameGlobal.actorModel.gold);
                    break;
                case 2:
                    this.priceIcon.price = CommonUtils.overLength(GameGlobal.actorModel.yb);
                    break;
                case 3:
                    this.priceIcon.price = CommonUtils.overLength(GameGlobal.actorModel.byb);
                    break;
            }
        }
    };
    ShopYuanBaoLayer.NAME = "元宝商店";
    return ShopYuanBaoLayer;
}(BaseView));
__reflect(ShopYuanBaoLayer.prototype, "ShopYuanBaoLayer", ["ICommonWindowTitle"]);
//# sourceMappingURL=ShopYuanBaoLayer.js.map