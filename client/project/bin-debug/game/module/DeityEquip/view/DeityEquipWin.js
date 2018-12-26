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
var DeityEquipWin = (function (_super) {
    __extends(DeityEquipWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DeityEquipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "DeityEquipMainSkin";
        return _this;
    }
    DeityEquipWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(DeityEquipAwakePanel),
            TabView.CreateTabViewData(DeityEquipInjectPanel),
        ]);
    };
    DeityEquipWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = args[0];
        this.mCommonWindowBg.OnAdded(this, index);
        this._AddClick(this.btnDetail, this._OnClicked);
        this.observe(MessageDef.CHANGE_EQUIP, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    DeityEquipWin.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    DeityEquipWin.prototype.UpdateTabBtnRedPoint = function () {
        this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.UserEquip.HasDeityEquipAwake() || GameGlobal.UserEquip.HasDeityEquipResolve());
        this.mCommonWindowBg.ShowTalRedPoint(1, GameGlobal.UserEquip.HasDeityEquipInject());
    };
    DeityEquipWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_32);
    };
    DeityEquipWin.prototype.OnOpenIndex = function (openIndex) {
        if (openIndex == 1) {
            if (GameGlobal.UserEquip.GetDeityEquipPos() == -1) {
                UserTips.ins().showTips("穿戴神装之后才可前往注灵");
                return false;
            }
        }
        return true;
    };
    DeityEquipWin.prototype._OnClicked = function () {
        ViewManager.ins().open(DeityEquipDetailWin);
    };
    DeityEquipWin.LAYER_LEVEL = LayerManager.UI_Main;
    return DeityEquipWin;
}(BaseEuiView));
__reflect(DeityEquipWin.prototype, "DeityEquipWin");
//# sourceMappingURL=DeityEquipWin.js.map