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
var AuctionRecordPanel = (function (_super) {
    __extends(AuctionRecordPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function AuctionRecordPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = 'AuctionRecordPanelSkin';
        return _this;
    }
    AuctionRecordPanel.prototype.childrenCreated = function () {
        this.recordList.itemRenderer = AuctionRecordItem;
        this.recordList.dataProvider = null;
    };
    AuctionRecordPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.AUCTION_RECORD_UPDATE, this.UpdateContent);
        this.commonWindowBg.SetTitle(0 == param[0] ? '全服成交记录' : '帮会成交记录');
        GameGlobal.AuctionModel.sendAuctionRecord(param[0]);
    };
    AuctionRecordPanel.prototype.UpdateContent = function () {
        var infos = GameGlobal.AuctionModel.recordInfos;
        var weight = function (info) {
            return info.dealtime;
        };
        infos.sort(function (lhs, rhs) {
            return weight(rhs) - weight(lhs);
        });
        var len = infos.length;
        this.tipTxt.visible = len == 0;
        this.conGroup.visible = len > 0;
        this.recordList.dataProvider = new eui.ArrayCollection(infos);
    };
    AuctionRecordPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return AuctionRecordPanel;
}(BaseEuiView));
__reflect(AuctionRecordPanel.prototype, "AuctionRecordPanel");
var AuctionRecordItem = (function (_super) {
    __extends(AuctionRecordItem, _super);
    function AuctionRecordItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    AuctionRecordItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    AuctionRecordItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data)
            return;
        var info = this.data;
        this.itemIcon.num = info.count;
        this.itemIcon.data = info.itemid;
        this.playNameTxt.text = info.offername;
        this.priceicon.type = MoneyConst.yuanbao;
        this.priceicon.price = info.price * info.count;
        this.descTxt.text = 1 == info.isbuy ? '一口价成交' : '竞拍价成交';
        var milliSeconds = info.dealtime * 1000;
        var date = new Date(milliSeconds);
        var hstr = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var mstr = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        this.dealTimeTxt.text = (date.getMonth() + 1) + '月' + date.getDate() + '日' + hstr + ':' + mstr;
    };
    return AuctionRecordItem;
}(eui.ItemRenderer));
__reflect(AuctionRecordItem.prototype, "AuctionRecordItem");
//# sourceMappingURL=AuctionRecordPanel.js.map