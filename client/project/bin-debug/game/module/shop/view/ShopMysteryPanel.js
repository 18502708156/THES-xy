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
var ShopMysteryPanel = (function (_super) {
    __extends(ShopMysteryPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopMysteryPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShopMysterySkin";
        return _this;
    }
    ShopMysteryPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.SHOP_MYSTERY_REFRESH, this.UpdateContent);
        this._AddClick(this.allBuyBtn, this.tap);
        this._AddClick(this.refreshBtn, this.tap);
        this.listView.itemRenderer = ShopMysteryItem;
        this.counterLabel.SetColor(Color.l_green_1);
        if (GameGlobal.ShopController.mysteryData) {
            this.counterLabel.SetEndTime(GameGlobal.ShopController.mysteryData.refreshtime, DurationLabel.TIMETEXT_TYPE_HHMMSS);
        }
    };
    ShopMysteryPanel.prototype.UpdateContent = function () {
        if (!GameGlobal.ShopController.mysteryData) {
            return;
        }
        var refreshcount = GameGlobal.ShopController.mysteryData.refreshcount;
        var config = GameGlobal.Config.MysticalShopBaseConfig;
        this.integralTxt.text = "" + GameGlobal.ShopController.getBuyItemNums(config.scorecosttype.id);
        this.limitText.text = "(" + refreshcount + "/" + config.refreshmax + ")";
        var price = config.costtype[0];
        this.priceIcon0.setType(price.id);
        this.priceIcon0.setPrice(ShopController.ins().getBuyItemNums(MoneyConst.yuanbao));
        var count = 0;
        if (refreshcount >= 1 && refreshcount < 10)
            count = refreshcount + 1;
        else if (refreshcount < 1)
            count = 1;
        else
            count = 10;
        price = GameGlobal.Config.RefreshPrice[count].refreshprice[0];
        this.priceIcon1.setType(price.id);
        this.priceIcon1.setPrice(price.count);
        this.listView.dataProvider = new eui.ArrayCollection(ShopController.ins().getMysteryShopData());
    };
    ShopMysteryPanel.prototype.tap = function (e) {
        switch (e.currentTarget) {
            case this.allBuyBtn:
                GameGlobal.ShopManage.sendAllMysteryBuy();
                break;
            case this.refreshBtn:
                var config = GameGlobal.Config.MysticalShopBaseConfig;
                var mysteryData = GameGlobal.ShopController.mysteryData;
                if (mysteryData.refreshcount >= config.refreshmax) {
                    GameGlobal.UserTips.showTips("刷新次数不足");
                    return;
                }
                var refreshcount = 0;
                if (mysteryData.refreshcount >= 1 && mysteryData.refreshcount <= 10)
                    refreshcount = mysteryData.refreshcount + 1;
                else if (mysteryData.refreshcount < 1)
                    refreshcount = 1;
                else
                    refreshcount = 10;
                var price = GameGlobal.Config.RefreshPrice[refreshcount].refreshprice[0];
                if (Checker.Money(price.id, price.count))
                    GameGlobal.ShopManage.sendRefreshMysteryShopData();
                break;
        }
    };
    ShopMysteryPanel.NAME = "神秘商店";
    return ShopMysteryPanel;
}(BaseView));
__reflect(ShopMysteryPanel.prototype, "ShopMysteryPanel");
var ShopMysteryItem = (function (_super) {
    __extends(ShopMysteryItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopMysteryItem() {
        return _super.call(this) || this;
    }
    ShopMysteryItem.prototype.childrenCreated = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    ShopMysteryItem.prototype.onClick = function (e) {
        if (egret.is(e.target.parent, 'ItemIcon') || this.data.buyCount >= this.data.item.daycount)
            return;
        this.data.item["buyTime"] = this.data.buyCount,
            ViewManager.ins().open(BuyWin, this.data.item, ShopType.mystery);
    };
    ShopMysteryItem.prototype.dataChanged = function () {
        var shopConfig = this.data.item;
        var goodsCfg = GameGlobal.Config.ItemConfig[shopConfig.id];
        if (shopConfig.discount) {
            this.discountImg.source = shopConfig.discount;
        }
        else {
            this.discountImg.source = "";
        }
        this.priceIcon0.setType(shopConfig.oriprice.id);
        this.priceIcon0.setPrice(shopConfig.oriprice.count);
        this.priceIcon1.setType(shopConfig.currency.id);
        this.priceIcon1.setPrice(shopConfig.currency.count);
        this.itemIcon.data = shopConfig.id;
        this.itemIcon.isShowName(false);
        this.itemIcon.setCount(this.data.item.count);
        this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        this.name_txt.text = goodsCfg.name;
        this.limit_txt.text = "\u9650\u8D2D\uFF1A" + this.data.buyCount + "/" + shopConfig.daycount;
        this.imgSellOut.visible = this.data.buyCount >= shopConfig.daycount;
    };
    return ShopMysteryItem;
}(eui.ItemRenderer));
__reflect(ShopMysteryItem.prototype, "ShopMysteryItem");
//# sourceMappingURL=ShopMysteryPanel.js.map