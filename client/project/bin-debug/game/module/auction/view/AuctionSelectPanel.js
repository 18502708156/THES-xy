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
var AuctionSelectPanel = (function (_super) {
    __extends(AuctionSelectPanel, _super);
    function AuctionSelectPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = 'AuctionSelectSkin';
        return _this;
    }
    AuctionSelectPanel.prototype.childrenCreated = function () {
        this.itemIcon.isShowName(false);
    };
    AuctionSelectPanel.prototype.onClick = function (e) {
        this.CloseSelf();
        GameGlobal.AuctionModel.sendAuctionSelect(e.target == this.useBtn ? 1 : 2);
        var tips = '';
        if (e.target == this.useBtn) {
            tips = '已放入背包';
        }
        else {
            tips = '已放入拍卖行';
        }
        GameGlobal.UserTips.showTips(tips);
    };
    AuctionSelectPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.useBtn, this.onClick);
        this.AddClick(this.auctionBtn, this.onClick);
        this.observe(MessageDef.AUCTION_ITEM_PRICE_UPDATE, this.UpdateContent);
        this.rewardData = param[0];
        if (this.rewardData) {
            GameGlobal.AuctionModel.SendGetItemPrice(this.rewardData.id);
        }
        this.UpdateContent();
    };
    AuctionSelectPanel.prototype.UpdateContent = function () {
        if (this.rewardData) {
            this.itemIcon.data = this.rewardData;
            var data = GameGlobal.AuctionModel.mAuctionItemPrice;
            var obj = data[this.rewardData.id];
            if (obj) {
                this.priceicon0.type = obj.numerictype;
                this.priceicon0.price = obj.dealprice * this.rewardData.count;
                this.priceicon1.type = obj.numerictype;
                this.priceicon1.price = obj.price * this.rewardData.count;
                this.priceicon0.visible = true;
                this.priceicon1.visible = true;
            }
            else {
                this.priceicon0.visible = false;
                this.priceicon1.visible = false;
            }
        }
    };
    AuctionSelectPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return AuctionSelectPanel;
}(BaseEuiView));
__reflect(AuctionSelectPanel.prototype, "AuctionSelectPanel");
//# sourceMappingURL=AuctionSelectPanel.js.map