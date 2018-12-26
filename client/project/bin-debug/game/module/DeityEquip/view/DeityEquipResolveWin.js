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
var DeityEquipResolveWin = (function (_super) {
    __extends(DeityEquipResolveWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DeityEquipResolveWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShopResolveSkin";
        _this.listView.itemRenderer = ShopResolveItem;
        _this.gainWayLabel0.visible = false;
        _this.gainWayLabel1.visible = false;
        _this.gainWayLabel2.visible = false;
        return _this;
    }
    DeityEquipResolveWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "神装分解";
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.updateContent);
        this.labTip.text = "分解神装百分百返还神装碎片";
        this.priceIcon.setType(MoneyConst.DEITYEQUIP_PIECE);
        this.updateContent();
    };
    DeityEquipResolveWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    DeityEquipResolveWin.prototype.updateContent = function () {
        this.priceIcon.setPrice(CommonUtils.overLength(ShopController.ins().getBuyItemNums(MoneyConst.DEITYEQUIP_PIECE)));
        var itemList = UserBag.ins().getBagEquipByLevelSort(ITEM_QUALITY.RED_QUALITY);
        //只分解比自己装备要低的
        this.listView.dataProvider.replaceAll(itemList);
    };
    DeityEquipResolveWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return DeityEquipResolveWin;
}(BaseEuiView));
__reflect(DeityEquipResolveWin.prototype, "DeityEquipResolveWin");
//# sourceMappingURL=DeityEquipResolveWin.js.map