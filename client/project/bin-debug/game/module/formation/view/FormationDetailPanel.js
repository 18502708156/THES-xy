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
var FormationDetailPanel = (function (_super) {
    __extends(FormationDetailPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FormationDetailPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FormationDetailSkin";
        return _this;
    }
    FormationDetailPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "阵型详情";
        var formationId = param[0];
        var model = GameGlobal.FormationModel;
        this.powerLabel.text = model.GetPower(formationId);
        this.showPanel.SetBody(FormationConst.GetSkin(formationId));
        this.levelAttr.textFlow = AttributeData.GetAttrTabString(model.GetCurAttr(formationId));
        this.medicineAttr.textFlow = AttributeData.GetAttrTabString(model.GetCurDrugAttr());
        this.soulAttr.textFlow = AttributeData.GetAttrTabString(model.GetCurSoulAttr(formationId));
    };
    FormationDetailPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    FormationDetailPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FormationDetailPanel;
}(BaseEuiView));
__reflect(FormationDetailPanel.prototype, "FormationDetailPanel");
//# sourceMappingURL=FormationDetailPanel.js.map