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
 * 八十一难 宝箱开启界面
 */
var TsumKoBaseBagItemPlanel = (function (_super) {
    __extends(TsumKoBaseBagItemPlanel, _super);
    function TsumKoBaseBagItemPlanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "TsumKoBaseBagItemSkin";
        return _this;
    }
    TsumKoBaseBagItemPlanel.prototype.childrenCreated = function () {
        this.itemGoodsScroller.viewport = this.itemListGoods;
        this.itemListGoods.itemRenderer = ItemBase;
        this.itemListGoods.dataProvider = new eui.ArrayCollection([]);
        // GameGlobal.TsumKoBaseModel.View_Type=2;
        this.observe(MessageDef.ClOSETSUMKOBASEBAGITEMPLANEL, this.CloseView);
    };
    TsumKoBaseBagItemPlanel.prototype.CloseView = function () {
        this.CloseSelf();
    };
    TsumKoBaseBagItemPlanel.prototype.OnOpen = function () {
        var _this = this;
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "开启宝箱";
        this.itemListGoods.dataProvider = new eui.ArrayCollection(this.items());
        this.priceicon.type = 2;
        this.priceicon.price = GameGlobal.Config.DisasterFbBaseConfig.openboxprice;
        this.openBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var tab = GameGlobal.Config.DisasterFbConfig[GameGlobal.TsumKoBaseModel.recordId];
            var tab2 = GameGlobal.Config.DisasterFbBaseConfig;
            WarnWin.show("是否花费" + tab2.openboxprice + "元宝购买宝箱？", function () {
                if (Checker.Money(2, tab2.openboxprice) == true) {
                    GameGlobal.TsumKoBaseModel.SendBuy(tab.id);
                }
            }, _this);
        }, this);
    };
    TsumKoBaseBagItemPlanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    //宝箱表
    TsumKoBaseBagItemPlanel.prototype.items = function () {
        var itemArr = [];
        var config = GameGlobal.Config.DisasterBoxConfig;
        for (var key in config) {
            var data = config[key];
            itemArr.push(data.item);
        }
        return itemArr;
    };
    //skinName
    //TsumKoBaseBagItemSkin.exml
    TsumKoBaseBagItemPlanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return TsumKoBaseBagItemPlanel;
}(BaseEuiView));
__reflect(TsumKoBaseBagItemPlanel.prototype, "TsumKoBaseBagItemPlanel");
//# sourceMappingURL=TsumKoBaseBagItemPlanel.js.map