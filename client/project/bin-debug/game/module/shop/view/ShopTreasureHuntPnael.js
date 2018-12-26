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
var ShopTreasureHuntPnael = (function (_super) {
    __extends(ShopTreasureHuntPnael, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopTreasureHuntPnael() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShopTitle";
        _this.listView.itemRenderer = ShopRectItem;
        _this.account.visible = false;
        return _this;
    }
    ShopTreasureHuntPnael.prototype.OnOpen = function () {
        this.goPrice.visible = false; //不需要使用
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setMoney);
        this.observe(MessageDef.POWER_CHANGE, this.setMoney); //
        this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent); //商店购买变化
        // this._AddItemClick(this.listView, this.onListViewClick)
        this.setMoney();
        this.UpdateContent();
        this.AddLoopTimer(1000, this.Update);
    };
    ShopTreasureHuntPnael.prototype.Update = function () {
        for (var _i = 0, _a = this.listView.$children; _i < _a.length; _i++) {
            var item = _a[_i];
            var child = item;
            if (child.UpdateTime) {
                child.UpdateTime();
            }
        }
    };
    ShopTreasureHuntPnael.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_TREASURE_HUNT);
    };
    ShopTreasureHuntPnael.prototype.UpdateContent = function () {
        this.setData();
        var list = [];
        var serTime = GameServer.serverTime;
        for (var _i = 0, _a = this.tShopData.shop; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.limittime && serTime >= data.limittime) {
                continue;
            }
            list.push(data);
        }
        this.listView.dataProvider.replaceAll(list);
    };
    ShopTreasureHuntPnael.prototype.onListViewClick = function (e) {
        var pItem = e.item;
        if (pItem && ShopController.ins().enoughBuy(pItem)) {
            ViewManager.ins().open(BuyWin, pItem);
        }
    };
    ShopTreasureHuntPnael.prototype.setMoney = function () {
        this.setData();
        if (this.tShopData.moneytype) {
            this.priceIcon.setType(this.tShopData.moneytype);
            this.priceIcon.price = CommonUtils.overLength(ShopController.ins().getBuyItemNums(this.tShopData.moneytype));
        }
    };
    ShopTreasureHuntPnael.NAME = "寻宝商店";
    return ShopTreasureHuntPnael;
}(BaseView));
__reflect(ShopTreasureHuntPnael.prototype, "ShopTreasureHuntPnael", ["ICommonWindowTitle"]);
//# sourceMappingURL=ShopTreasureHuntPnael.js.map