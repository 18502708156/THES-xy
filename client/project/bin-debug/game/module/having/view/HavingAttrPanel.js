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
var HavingAttrPanel = (function (_super) {
    __extends(HavingAttrPanel, _super);
    function HavingAttrPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "HavingAttrSkin";
        return _this;
    }
    HavingAttrPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mModel = param[0];
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = param[1];
        var showPath = param[2];
        this.levelAttr.textFlow = AttributeData.GetAttrTabString(this.mModel.GetCurAttr());
        this.skinAttr.textFlow = AttributeData.GetAttrTabString(this.mModel.GetCurDressAttr());
        this.drugAttr.textFlow = AttributeData.GetAttrTabString(this.mModel.GetCurDrugAttr());
        this.powerLabel.text = this.mModel.GetPower();
        this.showPanel.SetBody(showPath);
    };
    HavingAttrPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    HavingAttrPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return HavingAttrPanel;
}(BaseEuiView));
__reflect(HavingAttrPanel.prototype, "HavingAttrPanel");
//# sourceMappingURL=HavingAttrPanel.js.map