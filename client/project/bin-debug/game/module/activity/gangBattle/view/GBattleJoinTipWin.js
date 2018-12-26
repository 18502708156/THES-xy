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
var GBattleJoinTipWin = (function (_super) {
    __extends(GBattleJoinTipWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleJoinTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleJoinTipSkin";
        _this._AddClick(_this.btnConfirm, _this._OnClick);
        return _this;
    }
    GBattleJoinTipWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "参战帮会";
        var joinInfos = GameGlobal.GangBattleModel.mJoinInfos || [];
        for (var idx = 0; idx < 2; idx++) {
            var info = joinInfos[idx];
            this["group" + (idx + 1)].visible = info != null;
            if (info) {
                this["labAbbreviated" + (idx + 1)].text = info.guildName.substr(0, 1);
                this["labGangName" + (idx + 1)].text = info.guildName;
            }
        }
    };
    GBattleJoinTipWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GBattleJoinTipWin.prototype._OnClick = function (e) {
        ViewManager.ins().close(this);
    };
    GBattleJoinTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return GBattleJoinTipWin;
}(BaseEuiView));
__reflect(GBattleJoinTipWin.prototype, "GBattleJoinTipWin");
//# sourceMappingURL=GBattleJoinTipWin.js.map