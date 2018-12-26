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
var PetAllAttrPanel = (function (_super) {
    __extends(PetAllAttrPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PetAllAttrPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetAllAttrSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    PetAllAttrPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.levelAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.PetModel.GetAllAttrs());
        this.zizhiAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.PetModel.GetAllZizhiAttrs());
        this.feisAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.PetModel.GetAllFeisAttrs());
        this.powerLabel.text = GameGlobal.PetModel.GetAllPower();
        this.showPanel.SetBody(PetConst.GetSkin(GameGlobal.PetModel.GetShowId()));
    };
    PetAllAttrPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    PetAllAttrPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetAllAttrPanel;
}(BaseEuiView));
__reflect(PetAllAttrPanel.prototype, "PetAllAttrPanel");
//# sourceMappingURL=PetAllAttrPanel.js.map