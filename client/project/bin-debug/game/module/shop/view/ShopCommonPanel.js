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
var ShopCommonPanel = (function (_super) {
    __extends(ShopCommonPanel, _super);
    function ShopCommonPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.m_nCurIndex = 0;
        _this.skinName = "ShopCommonSkin";
        _this.listTitle.itemRenderer = ShopCommonTitle;
        var config = GameGlobal.Config.StoreList;
        var titleData = CommonUtils.GetArray(config, "id");
        for (var i = 0; i < titleData.length;) {
            if (!Deblocking.IsDeblocking(titleData[i].openid))
                titleData.splice(i, 1);
            else
                i++;
        }
        _this.listTitle.dataProvider = new eui.ArrayCollection(titleData);
        _this.listTitle.selectedIndex = 0;
        _this.listView.itemRenderer = ShopCommonItem;
        _this.listView.dataProvider = new eui.ArrayCollection(ShopController.ins().getShopDataByIndex(0).shop);
        _this.commonWindowBg.SetTitle("商店");
        return _this;
    }
    ShopCommonPanel.prototype.OnOpen = function () {
        this.counterLabel.SetColor("0x6E330B");
        this.counterLabel.SetTextFormat("{0}后刷新商店");
        this.counterLabel.SetTextSize(26);
        var date = new Date(GameServer.serverTime * 1000);
        date.setHours(24, 0, 0, 0);
        this.counterLabel.SetEndTime(date.getTime() / 1000, DurationLabel.TIMETEXT_TYPE_HHMMSS);
        this.commonWindowBg.OnAdded(this);
        this.AddClick(this.goPrice, this.tap);
        this.AddItemClick(this.listTitle, this.itemClick);
        this.observe(MessageDef.GOLD_CHANGE, this.UpdateContent);
        this.UpdateContent();
    };
    ShopCommonPanel.prototype.UpdateContent = function () {
        var tipsStr = this.listTitle.selectedItem.instructions;
        if (tipsStr)
            tipsStr = tipsStr.replace("%s", ShopController.ins().getCurTipsNum(this.listTitle.selectedItem.kind));
        this.tipsTxt.text = tipsStr;
        this.priceIcon.setType(this.listTitle.selectedItem.moneytype);
        this.priceIcon.setPrice(ShopController.ins().getBuyItemNums(this.listTitle.selectedItem.moneytype));
        this.listView.dataProvider = new eui.ArrayCollection(ShopController.ins().getShopDataByIndex(this.listTitle.selectedItem.kind).shop);
        this.counterLabel.visible = this.listTitle.selectedItem.kind == ShopController.EN_SHOP_BANGPAI;
        this.goPrice.text = this.listTitle.selectedItem.gaindes;
        UIHelper.SetLinkStyleLabel(this.goPrice);
    };
    ShopCommonPanel.prototype.itemClick = function () {
        if (this.m_nCurIndex != this.listTitle.selectedIndex) {
            this.UpdateContent();
            this.listView.parent.stopAnimation();
        }
        this.m_nCurIndex = this.listTitle.selectedIndex;
    };
    ShopCommonPanel.prototype.tap = function () {
        if (this.listTitle.selectedItem.moneytype)
            UserWarn.ins().BuyGoodsWarn(this.listTitle.selectedItem.moneytype);
    };
    ShopCommonPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return ShopCommonPanel;
}(BaseEuiView));
__reflect(ShopCommonPanel.prototype, "ShopCommonPanel");
var ShopCommonItem = (function (_super) {
    __extends(ShopCommonItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopCommonItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "ShopCommonItemSkin";
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
        return _this;
    }
    ShopCommonItem.prototype.onClick = function (e) {
        if (egret.is(e.target.parent, 'ItemIcon'))
            return;
        if (this.data && ShopController.ins().enoughBuy(this.data)) {
            ViewManager.ins().open(BuyWin, this.data);
        }
    };
    ShopCommonItem.prototype.dataChanged = function () {
        //更新内容
        var bBuyAll = false;
        this.lbInfo.text = "";
        //icon
        var itemConfig;
        if (this.data.id) {
            itemConfig = GlobalConfig.ins().ItemConfig[this.data.id];
            this.nameLabel.text = itemConfig.name;
            this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[itemConfig.quality];
            this.itemIcon.setDataByConfig(itemConfig);
            this.itemIcon.isShowName(false);
            if (this.data.count) {
                this.itemIcon.setCount(this.data.count + "");
            }
        }
        //稀有图片
        this.imgXiyou.visible = this.data.make === 1;
        this.priceIcon.setType(this.data.currency.id);
        this.priceIcon.setPrice(this.data.currency.count);
        //限购
        if (this.data.daycount) {
            if (this.data.daycount > 0) {
                if (this.data.buyTime && this.data.buyTime > 0 && this.data.daycount && this.data.buyTime === this.data.daycount) {
                    bBuyAll = true;
                }
                else {
                    this.lbInfo.textColor = Color.l_green_1;
                    this.lbInfo.text = "(限购" + this.data.buyTime + "/" + this.data.daycount + ")";
                }
            }
        }
        //限制条件
        if (!ShopController.ins().enoughBuy(this.data, 3)) {
            this.lbInfo.text = ShopController.ins().enoughBuy(this.data, 2) + "";
            this.lbInfo.textColor = Color.RedColor;
        }
        this.imgSellOut.visible = bBuyAll;
        this.buy.visible = !bBuyAll;
    };
    return ShopCommonItem;
}(eui.ItemRenderer));
__reflect(ShopCommonItem.prototype, "ShopCommonItem");
var ShopCommonTitle = (function (_super) {
    __extends(ShopCommonTitle, _super);
    function ShopCommonTitle() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "ShopEquipTitleSkin";
        return _this;
    }
    ShopCommonTitle.prototype.dataChanged = function () {
        this.lbNe.text = this.data.storename;
    };
    return ShopCommonTitle;
}(eui.ItemRenderer));
__reflect(ShopCommonTitle.prototype, "ShopCommonTitle");
//# sourceMappingURL=ShopCommonPanel.js.map