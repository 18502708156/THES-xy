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
var YingYuanHeLiPanel = (function (_super) {
    __extends(YingYuanHeLiPanel, _super);
    function YingYuanHeLiPanel() {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.select = 0;
        return _this;
    }
    YingYuanHeLiPanel.prototype.childrenCreated = function () {
        this.skinName = "YingYuanHeliSkin";
        this.list.itemRenderer = YingYuanHeadItem;
        this.list1.itemRenderer = YingYuanHuLiItem;
        this.list2.itemRenderer = ItemBaseNotName;
    };
    YingYuanHeLiPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "喜结连理";
        this._AddClick(this.bnt, this.click);
        this._AddClick(this.bnt0, this.Close);
        this.list1.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnClick, this);
        this.list1.selectedIndex = this.select;
        this.updateContent();
    };
    YingYuanHeLiPanel.prototype.updateContent = function () {
        var Config = GameGlobal.Config.GiftsConfig;
        var gifdata = [];
        var roledata = [];
        roledata.push(GameGlobal.YingYuanModel.marryInvita[0].husband);
        roledata.push(GameGlobal.YingYuanModel.marryInvita[0].wife);
        this.list.dataProvider = new eui.ArrayCollection(roledata);
        this.list2.dataProvider = new eui.ArrayCollection(Config[this.select + 1].showreward);
        for (var data in Config) {
            gifdata.push(data);
        }
        this.list1.dataProvider = new eui.ArrayCollection(gifdata);
    };
    YingYuanHeLiPanel.prototype.click = function () {
        GameGlobal.YingYuanModel.marryGreeting(GameGlobal.YingYuanModel.marryInvita[0].dbid, this.select + 1);
    };
    YingYuanHeLiPanel.prototype._OnClick = function (e) {
        this.select = this.list1.selectedIndex;
        this.updateContent();
    };
    YingYuanHeLiPanel.prototype.Close = function () {
        GameGlobal.YingYuanModel.marryInvita.splice(0, 1);
        GameGlobal.MessageCenter.dispatch(MessageDef.INVITATION_INFO);
        ViewManager.ins().close(this);
    };
    YingYuanHeLiPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    YingYuanHeLiPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return YingYuanHeLiPanel;
}(BaseEuiView));
__reflect(YingYuanHeLiPanel.prototype, "YingYuanHeLiPanel", ["ICommonWindow"]);
var YingYuanHuLiItem = (function (_super) {
    __extends(YingYuanHuLiItem, _super);
    function YingYuanHuLiItem() {
        var _this = _super.call(this) || this;
        _this.type = [
            '普通贺礼',
            '热闹贺礼',
            '豪华贺礼'
        ];
        _this.skinName = "YingYuanHeLiItemSkin";
        _this.list2.itemRenderer = ItemBase;
        return _this;
    }
    YingYuanHuLiItem.prototype.childrenCreated = function () {
    };
    YingYuanHuLiItem.prototype.dataChanged = function () {
        var data = Number(this.data);
        if (!data) {
            return;
        }
        var Config = GameGlobal.Config.GiftsConfig;
        this.list2.dataProvider = new eui.ArrayCollection([Config[data].reward]);
        this.typeName.text = this.type[data - 1];
        this.priceicon.setType(Config[data].price.id);
        this.priceicon.setPrice(Config[data].price.count);
        this.list2.touchEnabled = false;
        this.list2.touchChildren = false;
    };
    return YingYuanHuLiItem;
}(eui.ItemRenderer));
__reflect(YingYuanHuLiItem.prototype, "YingYuanHuLiItem");
//# sourceMappingURL=YingYuanHeLiPanel.js.map