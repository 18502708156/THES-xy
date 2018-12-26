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
var ItemAuctionTipsWin = (function (_super) {
    __extends(ItemAuctionTipsWin, _super);
    function ItemAuctionTipsWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.itemid = 0;
        return _this;
    }
    ItemAuctionTipsWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "ItemAuctionTipsSkin";
    };
    ;
    ItemAuctionTipsWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var type = param[0];
        this.itemid = param[1];
        this.AddClick(this.colorCanvas, this.CloseSelf);
        this.AddClick(this.useBtn, this.onTap);
        this.setData(type, this.itemid);
    };
    ;
    ItemAuctionTipsWin.prototype.OnClose = function () {
        this.removeEvents();
    };
    ;
    ItemAuctionTipsWin.prototype.onTap = function (e) {
        if (UserBag.ins().sendUseItem(this.itemid, 1)) {
            this.CloseSelf();
        }
    };
    ;
    ItemAuctionTipsWin.prototype.setData = function (type, id) {
        var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
        var config = GlobalConfig.ins().ItemConfig[id];
        this.nameLabel.text = config.name;
        this.nameLabel.textColor = ItemBase.QUALITY_COLOR[config.quality];
        this.itemIcon.setData(config);
        this.num.text = "数量：" + data.count;
        this.description.textFlow = TextFlowMaker.generateTextFlow(config.desc);
    };
    ItemAuctionTipsWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return ItemAuctionTipsWin;
}(BaseEuiView));
__reflect(ItemAuctionTipsWin.prototype, "ItemAuctionTipsWin");
//# sourceMappingURL=ItemAuctionTipsWin.js.map