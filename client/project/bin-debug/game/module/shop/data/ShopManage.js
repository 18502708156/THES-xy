/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/8 14:15
 * @meaning: 商店管理类
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
var ShopManage = (function (_super) {
    __extends(ShopManage, _super);
    function ShopManage() {
        var _this = _super.call(this) || this;
        _this.pShopController = ShopController.ins(); //初始化商店类
        _this.regNetMsg(S2cProtocol.sc_shop_buy, _this.shopUpdataBuy);
        _this.regNetMsg(S2cProtocol.sc_shop_buy_update, _this.shopInit);
        _this.regNetMsg(S2cProtocol.sc_shop_mystical_update, _this.getMysterShopData);
        _this.regNetMsg(S2cProtocol.sc_shop_buy_unlockdata, _this.shopUnlockData);
        return _this;
    }
    //单例
    ShopManage.ins = function () {
        return _super.ins.call(this);
    };
    ShopManage.prototype.Init = function () {
        this.pShopController.Init(); //初始化商店数据内容
    };
    /**
         * 发送购买物品
         * 16-2
         * @param shopType	商店类型
         * @param index		物品
         * @param buynum	数量
         *
         */
    ShopManage.prototype.sendBuy = function (shopType, arr, nums) {
        var cs_shop_buy = new Sproto.cs_shop_buy_request();
        cs_shop_buy.shopType = shopType;
        cs_shop_buy.index = arr;
        cs_shop_buy.buynum = nums;
        GameSocket.ins().Rpc(C2sProtocol.cs_shop_buy, cs_shop_buy);
    };
    ;
    //商店购买次数更新
    ShopManage.prototype.shopUpdataBuy = function (rsp) {
        // var data = rsp
        this.pShopController.updateByAddShop(rsp);
        //购买物品更新提示
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_CHANGE);
    };
    //初始化商店购买次数
    ShopManage.prototype.shopInit = function (rsp) {
        this.pShopController.updataByServer(rsp);
    };
    //商店解锁条件
    ShopManage.prototype.shopUnlockData = function (rsp) {
        this.pShopController.shopUnlockData(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_CHANGE);
    };
    ShopManage.prototype.sendRefreshMysteryShopData = function () {
        var req = new Sproto.cs_shop_mystical_refresh_request();
        this.Rpc(C2sProtocol.cs_shop_mystical_refresh, req);
    };
    ShopManage.prototype.getMysterShopData = function (req) {
        if (req) {
            this.pShopController.mysteryData = req;
            MessageCenter.ins().dispatch(MessageDef.SHOP_MYSTERY_REFRESH);
        }
    };
    ShopManage.prototype.sendMysteryBuy = function (index, num) {
        var req = new Sproto.cs_shop_mystical_buy_request;
        req.index = index;
        req.buynum = num;
        this.Rpc(C2sProtocol.cs_shop_mystical_buy, req);
    };
    ShopManage.prototype.sendAllMysteryBuy = function () {
        var items = ShopController.ins().getMysteryShopData();
        //  let beBuyItmes = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var val = items_1[_i];
            if (!val.isBuy) {
                var price = val.item.currency;
                if (Checker.Money(price.id, price.count))
                    this.sendMysteryBuy(val.item.index, val.item.daycount);
            }
        }
    };
    return ShopManage;
}(BaseSystem));
__reflect(ShopManage.prototype, "ShopManage");
//# sourceMappingURL=ShopManage.js.map