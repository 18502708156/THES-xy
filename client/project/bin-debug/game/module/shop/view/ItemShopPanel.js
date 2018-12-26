/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 商店商品item1
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
var ItemShopPanel = (function (_super) {
    __extends(ItemShopPanel, _super);
    function ItemShopPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btn_down_name = "ui_cjg_btn_djg";
        _this.btn_up_name = "ui_cjg_btn_djgs";
        return _this;
    }
    ItemShopPanel.prototype.childrenCreated = function () {
        this.name = this;
        this.skinName = "ItemShopSkin";
    };
    ItemShopPanel.prototype.open = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        // MessageCenter.addListener(Shop.postBuyResult, this.buyResultCB, this);
        this.updateData();
    };
    ;
    ItemShopPanel.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        MessageCenter.ins().removeAll(this);
    };
    ;
    ItemShopPanel.prototype.updateData = function () {
        var arr = [];
        var dataProvider = ItemStoreConfig.GetItemBYStoreConfig();
        for (var k in dataProvider) {
            arr.push(dataProvider[k]);
        }
        this.listView.dataProvider = new eui.ArrayCollection(arr);
        this.priceIcon.price = GameGlobal.actorModel.yb;
    };
    ;
    ItemShopPanel.prototype.onTap = function (e) {
        if (e.target.name == "buy") {
            var goodsID = e.target.parent['goodsID'];
            ViewManager.ins().open(BuyWin, goodsID);
        }
    };
    ;
    ItemShopPanel.prototype.buyResultCB = function (result) {
        if (result == 1) {
            UserTips.ins().showTips("购买成功");
        }
        else {
            UserTips.ins().showTips("|C:0xff0000&T:购买失败|");
        }
        this.priceIcon.price = GameGlobal.actorModel.yb;
    };
    ;
    ItemShopPanel.prototype.UpdateContent = function () { };
    return ItemShopPanel;
}(BaseView));
__reflect(ItemShopPanel.prototype, "ItemShopPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=ItemShopPanel.js.map