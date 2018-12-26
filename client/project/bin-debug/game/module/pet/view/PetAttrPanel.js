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
var PetAttrPanel = (function (_super) {
    __extends(PetAttrPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PetAttrPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetAttrSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    PetAttrPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        var petId = param[0];
        var petInfo = GameGlobal.PetModel.GetPetInfo(petId);
        this.levelAttr.textFlow = AttributeData.GetAttrTabString(petInfo.GetShowAttrs());
        this.zizhiAttr.textFlow = AttributeData.GetAttrTabString(petInfo.GetShowZizhiAttrs());
        this.feisAttr.textFlow = AttributeData.GetAttrTabString(petInfo.GetShowFeisAttrs());
        this.powerLabel.text = petInfo.GetPower();
        this.lbLev.text = petInfo.mLevel + "\n级";
        PetConst.SetName(this.lbName, petInfo);
        var config = GameGlobal.Config.petBiographyConfig[petId];
        this.wuxingImg.source = PetConst.XUXING_IMG[config.fiveele];
        this.showPanel.SetBody(PetConst.GetSkin(petId));
    };
    PetAttrPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    PetAttrPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetAttrPanel;
}(BaseEuiView));
__reflect(PetAttrPanel.prototype, "PetAttrPanel");
//# sourceMappingURL=PetAttrPanel.js.map