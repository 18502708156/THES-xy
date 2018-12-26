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
var GodPetActiveTipWin = (function (_super) {
    __extends(GodPetActiveTipWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GodPetActiveTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GodPetActiveTipSkin";
        _this._AddClick(_this.btnConfirm, _this.CloseSelf);
        return _this;
    }
    GodPetActiveTipWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "获取途径";
        this.cmlabText.text = "其他获取途径";
        this._AddClick(this.labGoto1, this._OnClicked);
        this._AddClick(this.labGoto2, this._OnClicked);
        this._AddClick(this.labGoto3, this._OnClicked);
        var cost = GameGlobal.Config.BeastLotteryConfig.deplete[0];
        var itemConfig = GlobalConfig.ins().ItemConfig[cost.id];
        var color = ItemBase.QUALITY_COLOR[itemConfig.quality];
        this.labName.text = itemConfig.name;
        this.labName.textColor = color;
        this.item.setItemAward(cost.type, cost.id, cost.count);
        var config = GameGlobal.Config.GainItemConfig[cost.id];
        if (!config)
            return;
        var idx = 1;
        for (var _a = 0, _b = config.gainWay; _a < _b.length; _a++) {
            var getway = _b[_a];
            if (this["labGoto" + idx]) {
                this["labGoto" + idx].visible = true;
                this["labGoto" + idx].text = getway[0];
                UIHelper.SetLinkStyleLabel(this["labGoto" + idx]);
            }
            idx++;
        }
    };
    GodPetActiveTipWin.prototype._OnClicked = function (e) {
        switch (e.currentTarget) {
            case this.labGoto1:
                this.HandleClick(0);
                break;
            case this.labGoto2:
                this.HandleClick(1);
                break;
            case this.labGoto3:
                this.HandleClick(2);
                break;
        }
    };
    GodPetActiveTipWin.prototype.HandleClick = function (idx) {
        var cost = GameGlobal.Config.BeastLotteryConfig.deplete[0];
        var config = GameGlobal.Config.GainItemConfig[cost.id];
        var info = config.gainWay[idx];
        if (!info)
            return;
        ViewManager.ins().Guide(info[1][0], info[1][1]);
        if (info[1][0] == ViewIndexDef.TYPE_2000 || info[1][0] == ViewIndexDef.TYPE_2001)
            return;
        ViewManager.ins().close(this);
    };
    GodPetActiveTipWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GodPetActiveTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return GodPetActiveTipWin;
}(BaseEuiView));
__reflect(GodPetActiveTipWin.prototype, "GodPetActiveTipWin");
//# sourceMappingURL=GodPetActiveTipWin.js.map