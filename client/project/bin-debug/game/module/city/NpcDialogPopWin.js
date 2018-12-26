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
var NpcDialogPopWin = (function (_super) {
    __extends(NpcDialogPopWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function NpcDialogPopWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "NpcDialogSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    NpcDialogPopWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var npcId = param[0];
        var config = GameGlobal.Config.CityNpcConfig[npcId];
        if (!config)
            return;
        this.imgIcon.source = config.icon;
        this.cmlabName.text = config.npcname;
        this.labDesc.text = this.GetRandomDesc(config.des);
    };
    NpcDialogPopWin.prototype.OnClose = function () {
    };
    NpcDialogPopWin.prototype.GetRandomDesc = function (desList) {
        if (!desList || desList.length == 0)
            return "";
        var len = desList.length;
        var randIdx = Math.floor(Math.random() * (len - 0.1));
        return desList[randIdx];
    };
    NpcDialogPopWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return NpcDialogPopWin;
}(BaseEuiView));
__reflect(NpcDialogPopWin.prototype, "NpcDialogPopWin");
//# sourceMappingURL=NpcDialogPopWin.js.map