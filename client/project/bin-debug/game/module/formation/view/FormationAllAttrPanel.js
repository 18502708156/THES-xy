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
var FormationAllAttrPanel = (function (_super) {
    __extends(FormationAllAttrPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FormationAllAttrPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FormationAllAttrSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    FormationAllAttrPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.labLevelAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.FormationModel.GetAllAttr());
        this.labSoulAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.FormationModel.GetAllSoulAttr());
        this.labDrugAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.FormationModel.GetCurDrugAttr());
        this.powerLabel.text = GameGlobal.FormationModel.GetAllPower();
        this.showPanel.SetBody(FormationConst.GetSkin(GameGlobal.FormationModel.usedFomationId));
    };
    FormationAllAttrPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    FormationAllAttrPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FormationAllAttrPanel;
}(BaseEuiView));
__reflect(FormationAllAttrPanel.prototype, "FormationAllAttrPanel");
//# sourceMappingURL=FormationAllAttrPanel.js.map