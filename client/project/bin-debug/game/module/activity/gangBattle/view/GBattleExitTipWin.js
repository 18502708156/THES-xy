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
var GBattleExitTipWin = (function (_super) {
    __extends(GBattleExitTipWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleExitTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleExitTipSkin";
        _this._AddClick(_this.btnPrev, _this._OnClick);
        _this._AddClick(_this.btnExit, _this._OnClick);
        return _this;
    }
    GBattleExitTipWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(true);
        this.commonDialog.title = "提示";
    };
    GBattleExitTipWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GBattleExitTipWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnExit:
                GameGlobal.CommonRaidModel.MapLeave();
                GameGlobal.GangBattleModel.SendExitGBattle();
                break;
            case this.btnPrev:
                GameGlobal.GangBattleModel.SendReturnPrev();
                break;
        }
        this.CloseSelf();
    };
    GBattleExitTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return GBattleExitTipWin;
}(BaseEuiView));
__reflect(GBattleExitTipWin.prototype, "GBattleExitTipWin");
//# sourceMappingURL=GBattleExitTipWin.js.map