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
var CrossBattleChargeWarn = (function (_super) {
    __extends(CrossBattleChargeWarn, _super);
    function CrossBattleChargeWarn() {
        var _this = _super.call(this) || this;
        _this.onTap = function (e) {
            GameGlobal.CrossBattleModel.getBs();
        };
        return _this;
    }
    CrossBattleChargeWarn.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "CrossBattleChargeSkin";
    };
    CrossBattleChargeWarn.prototype.OnOpen = function () {
        this.AddClick(this.sureBtn, this.onTap);
        this.commonDialog.OnAdded(this);
        this.commonDialog.setBgVisible(true);
        this.updataView();
    };
    CrossBattleChargeWarn.prototype.updataView = function () {
        this.petShowPanel.SetBodyId(300004);
    };
    CrossBattleChargeWarn.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeEvents();
    };
    return CrossBattleChargeWarn;
}(BaseEuiView));
__reflect(CrossBattleChargeWarn.prototype, "CrossBattleChargeWarn");
CrossBattleChargeWarn.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=CrossBattleChargeWarn.js.map