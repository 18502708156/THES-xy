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
var ShopWeiWangLayer = (function (_super) {
    __extends(ShopWeiWangLayer, _super);
    function ShopWeiWangLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopWeiWangLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_WEIWANG);
    };
    ShopWeiWangLayer.NAME = "威望商店";
    return ShopWeiWangLayer;
}(ShopXianDaoLayer));
__reflect(ShopWeiWangLayer.prototype, "ShopWeiWangLayer");
var shopBashiLayer = (function (_super) {
    __extends(shopBashiLayer, _super);
    function shopBashiLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    shopBashiLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_BASHI);
    };
    shopBashiLayer.prototype.setValue = function () {
        this.setAccountText(GameGlobal.ShopManage.pShopController.getShopLockByType(9)); //81难
    };
    shopBashiLayer.NAME = "81难商店";
    return shopBashiLayer;
}(ShopXianDaoLayer));
__reflect(shopBashiLayer.prototype, "shopBashiLayer");
var ShopChongWuLayer = (function (_super) {
    __extends(ShopChongWuLayer, _super);
    function ShopChongWuLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopChongWuLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_CHONGWU);
    };
    ShopChongWuLayer.NAME = "宠物商店";
    return ShopChongWuLayer;
}(ShopXianDaoLayer));
__reflect(ShopChongWuLayer.prototype, "ShopChongWuLayer");
var ShopXianlvLayer = (function (_super) {
    __extends(ShopXianlvLayer, _super);
    function ShopXianlvLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopXianlvLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_XIANLV);
    };
    ShopXianlvLayer.NAME = "仙侣商店";
    return ShopXianlvLayer;
}(ShopXianDaoLayer));
__reflect(ShopXianlvLayer.prototype, "ShopXianlvLayer");
var ShopBanghuiLayer = (function (_super) {
    __extends(ShopBanghuiLayer, _super);
    function ShopBanghuiLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopBanghuiLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_BANGPAI);
    };
    ShopBanghuiLayer.NAME = "帮派福利";
    return ShopBanghuiLayer;
}(ShopXianDaoLayer));
__reflect(ShopBanghuiLayer.prototype, "ShopBanghuiLayer");
var ShopZhangBanLayer = (function (_super) {
    __extends(ShopZhangBanLayer, _super);
    function ShopZhangBanLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopZhangBanLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_ZHUANGBAN);
    };
    ShopZhangBanLayer.NAME = "装扮商店";
    return ShopZhangBanLayer;
}(ShopXianDaoLayer));
__reflect(ShopZhangBanLayer.prototype, "ShopZhangBanLayer");
var ShopPiFuLayer = (function (_super) {
    __extends(ShopPiFuLayer, _super);
    function ShopPiFuLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopPiFuLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_PIFU);
    };
    ShopPiFuLayer.NAME = "皮肤商店";
    return ShopPiFuLayer;
}(ShopXianDaoLayer));
__reflect(ShopPiFuLayer.prototype, "ShopPiFuLayer");
var ShopYouQingLayer = (function (_super) {
    __extends(ShopYouQingLayer, _super);
    function ShopYouQingLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopYouQingLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_YOUQING);
    };
    ShopYouQingLayer.NAME = "友情商店";
    return ShopYouQingLayer;
}(ShopXianDaoLayer));
__reflect(ShopYouQingLayer.prototype, "ShopYouQingLayer");
var ShopJingJiLayer = (function (_super) {
    __extends(ShopJingJiLayer, _super);
    function ShopJingJiLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopJingJiLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_JINGJI);
    };
    ShopJingJiLayer.prototype.setValue = function () {
        this.setAccountText(GameGlobal.ShopManage.pShopController.getShopLockByType(4)); //竞技场排名
    };
    ShopJingJiLayer.NAME = "竞技福利";
    return ShopJingJiLayer;
}(ShopXianDaoLayer));
__reflect(ShopJingJiLayer.prototype, "ShopJingJiLayer");
var ShopQuJingLayer = (function (_super) {
    __extends(ShopQuJingLayer, _super);
    function ShopQuJingLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopQuJingLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_QUJING);
    };
    ShopQuJingLayer.prototype.setValue = function () {
        this.setAccountText(GameGlobal.ShopManage.pShopController.getShopLockByType(5)); //取经
    };
    ShopQuJingLayer.NAME = "取经商店";
    return ShopQuJingLayer;
}(ShopXianDaoLayer));
__reflect(ShopQuJingLayer.prototype, "ShopQuJingLayer");
var ShopDaTiLayer = (function (_super) {
    __extends(ShopDaTiLayer, _super);
    function ShopDaTiLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopDaTiLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_DATI);
    };
    ShopDaTiLayer.prototype.setValue = function () {
        this.setAccountText(GameGlobal.ShopManage.pShopController.getShopLockByType(6)); //答题
    };
    ShopDaTiLayer.NAME = "科举商店";
    return ShopDaTiLayer;
}(ShopXianDaoLayer));
__reflect(ShopDaTiLayer.prototype, "ShopDaTiLayer");
//# sourceMappingURL=ShopUnionLayer.js.map