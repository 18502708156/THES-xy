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
/**
 81难-生死劫(章節选择列表界面)
 */
// TsumKoPanelSkin.exml
var TsumKoPanel = (function (_super) {
    __extends(TsumKoPanel, _super);
    function TsumKoPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "TsumKoPanelSkin";
        return _this;
    }
    TsumKoPanel.prototype.childrenCreated = function () {
        var list = CommonUtils.GetArray(GameGlobal.Config.ClientShowConfig, "chapterid");
        this.list.itemRenderer = TsumKoListItem;
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.observe(MessageDef.TSUMKO_UPDATE_LIST, this.UpdateList);
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, function (e) {
            GameGlobal.TsumKoBaseModel.chapterid = e.itemIndex + 1;
        }, this);
        this._AddClick(this.shopBtn, this._onclick);
    };
    TsumKoPanel.prototype.UpdateContent = function () {
    };
    TsumKoPanel.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.list);
    };
    TsumKoPanel.prototype._onclick = function (e) {
        switch (e.currentTarget) {
            case this.shopBtn:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BASHI]);
                break;
        }
    };
    TsumKoPanel.NAME = "八十一难";
    return TsumKoPanel;
}(BaseView));
__reflect(TsumKoPanel.prototype, "TsumKoPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=TsumKoPanel.js.map