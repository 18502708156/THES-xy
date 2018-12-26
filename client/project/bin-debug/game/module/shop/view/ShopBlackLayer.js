/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/10 15:51
 * @meaning: 黑市商店详情
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
var ShopBlackLayer = (function (_super) {
    __extends(ShopBlackLayer, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopBlackLayer() {
        var _this = _super.call(this) || this;
        _this.remaintime = 0; //剩余时间 
        _this.skinName = "ShopTitle";
        _this.listView.itemRenderer = ShopRectItem;
        _this.goPrice.visible = false; //不需要使用
        return _this;
    }
    ShopBlackLayer.prototype.OnOpen = function () {
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setMoney); //
        this.observe(MessageDef.POWER_CHANGE, this.setMoney); //
        this.observe(MessageDef.GUILD_CONTRIB_UPDATE, this.setMoney); //
        this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent); //商店购买变化
        // this._AddItemClick(this.listView, this.onListViewClick)
        TimerManager.ins().doTimer(1000, 0, this.updateTimes, this);
        this.account.text = "";
        this.getLeftTime();
        this.updateTimes();
        this.setMoney();
        this.UpdateContent();
    };
    ShopBlackLayer.prototype.getLeftTime = function () {
        var myDate = new Date();
        var nHour = myDate.getHours(); //获取当前小时数(0-23)
        var nMinutes = myDate.getMinutes(); //获取当前分钟数(0-59)
        var nSeconds = myDate.getSeconds(); //获取当前秒数(0-59)
        this.remaintime = (23 - nHour) * 60 * 60 + (59 - nMinutes * 60) + (59 - nSeconds);
    };
    ShopBlackLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_BLACK);
    };
    ShopBlackLayer.prototype.UpdateContent = function () {
        this.setData();
        this.listView.dataProvider.replaceAll(this.tShopData.shop);
        Util.GetClass(this).NAME = this.tShopData.storename;
    };
    ShopBlackLayer.prototype.updateTimes = function () {
        this.remaintime--;
        if (this.remaintime <= 0) {
            this.account.visible = false;
            TimerManager.ins().remove(this.updateTimes, this);
        }
        this.account.text = DateUtils.getFormatBySecond(this.remaintime) + " 后重置商店";
    };
    ShopBlackLayer.prototype.onListViewClick = function (e) {
        var pItem = e.item;
        if (pItem && ShopController.ins().enoughBuy(pItem)) {
            ViewManager.ins().open(BuyWin, pItem);
        }
    };
    ShopBlackLayer.prototype.setMoney = function () {
        this.setData();
        if (this.tShopData.moneytype) {
            this.priceIcon.setType(this.tShopData.moneytype);
            this.priceIcon.price = CommonUtils.overLength(GameGlobal.actorModel.contrib);
        }
    };
    ShopBlackLayer.NAME = "帮会商店";
    return ShopBlackLayer;
}(BaseView));
__reflect(ShopBlackLayer.prototype, "ShopBlackLayer", ["ICommonWindowTitle"]);
//# sourceMappingURL=ShopBlackLayer.js.map