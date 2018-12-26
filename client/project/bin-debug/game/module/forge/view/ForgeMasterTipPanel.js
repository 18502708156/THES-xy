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
var ForgeMasterTipPanel = (function (_super) {
    __extends(ForgeMasterTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ForgeMasterTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "ForgeMasterTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    ForgeMasterTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var forgeType = param[0];
        var addPower = null;
        var curLevel = ForgeViewHelper.UpdateMasterBtn(forgeType, this.masterBtn);
        var config = GameGlobal.ForgeModel.GetMasterConfig(forgeType);
        if (curLevel) {
            var role = GameGlobal.SubRoles.GetRoleData();
            var _a = role.GetMinEquipIndexAndLevel(forgeType), index = _a[0], min = _a[1];
            this.effName.text = "全身" + GameGlobal.ForgeModel.TYPE_TO_NAME[forgeType] + "+" + min.toString();
            this.curLabel.text = AttributeData.getAttStr(config[curLevel].attrs, 0);
            if (config[curLevel + 1]) {
                this.currentState = "active";
                this.nextLabel.text = AttributeData.getAttStr(config[curLevel + 1].attrs, 0);
                addPower = ItemConfig.CalcAttrScoreValue(config[curLevel + 1].attrs) - ItemConfig.CalcAttrScoreValue(config[curLevel].attrs);
            }
            else {
                this.currentState = "full";
            }
        }
        else {
            this.currentState = "none";
            this.nextLabel.text = AttributeData.getAttStr(config[1].attrs, 0);
            addPower = ItemConfig.CalcAttrScoreValue(config[1].attrs);
        }
        if (addPower != null) {
            this.effLabel.text = "可提升" + addPower + "战力";
        }
        else {
            this.effLabel.text = "";
        }
    };
    ForgeMasterTipPanel.prototype.OnClose = function () {
    };
    ForgeMasterTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ForgeMasterTipPanel;
}(BaseEuiView));
__reflect(ForgeMasterTipPanel.prototype, "ForgeMasterTipPanel");
//# sourceMappingURL=ForgeMasterTipPanel.js.map