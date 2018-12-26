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
var RoleTemplateAttrPanel = (function (_super) {
    __extends(RoleTemplateAttrPanel, _super);
    function RoleTemplateAttrPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "RoleRideAttrSkin";
        return _this;
    }
    RoleTemplateAttrPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mModel = param[0];
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = param[1];
        var pid = param[2];
        this.mPid = pid;
        var art = param[3];
        if (!art) {
            var attr1 = this.GetAttr();
            // this.levelAttr.textFlow = AttributeData.GetAttrTabString(attr1)
            this.changeLaber(attr1);
            var attr2 = this.mModel.GetCurEquipAttr();
            if (attr2 && attr2.length) {
                this.equipAttr.textFlow = AttributeData.GetAttrTabString(attr2);
            }
            else {
                UIHelper.SetVisible(this.equipAttr.parent, false);
            }
            this.equipAttr.textFlow = AttributeData.GetAttrTabString(attr2);
            var attr3 = this.UpdateSkinLabel();
            var attr4 = this.UpdateDrugLabel();
            this.drugAttr.textFlow = AttributeData.GetAttrTabString(attr4);
            var attr5 = this.UpdateSkillLabel();
            var power = 0;
            power += ItemConfig.CalcAttrScoreValue(attr1);
            power += ItemConfig.CalcAttrScoreValue(attr2);
            power += ItemConfig.CalcAttrScoreValue(attr3);
            power += ItemConfig.CalcAttrScoreValue(attr4);
            power += ItemConfig.CalcAttrScoreValue(attr5);
            this.powerLabel.text = power;
        }
        else {
            this.currentState = "active";
            this.levelAttr.textFlow = AttributeData.GetAttrTabString(art);
            this.powerLabel.text = ItemConfig.CalcAttrScoreValue(art);
        }
        this.ShowModel(pid);
    };
    RoleTemplateAttrPanel.prototype.GetAttr = function () {
        return this.mModel.GetCurAttr();
    };
    //更改文本描述
    RoleTemplateAttrPanel.prototype.changeLaber = function (attr1) {
        var att = [];
        var num = 0;
        num = GameGlobal.UserTitle.GetAddAttrRate(this.mModel.mTemplateType);
        for (var i = 0; i < attr1.length; i++) {
            var pow = 0;
            if (attr1[i].value != undefined)
                pow = attr1[i].value;
            att.push({ type: attr1[i].type, value: Math.floor(pow + pow * num) });
        }
        this.levelAttr.textFlow = AttributeData.GetAttrTabString(att);
    };
    RoleTemplateAttrPanel.prototype.UpdateSkillLabel = function () {
        var attr5 = this.mModel.GetCurSkillAttr();
        if (attr5 && attr5.length) {
            this.skillAttr.textFlow = AttributeData.GetAttrTabString(attr5);
        }
        else {
            UIHelper.SetVisible(this.skillAttr.parent, false);
        }
        return attr5;
    };
    RoleTemplateAttrPanel.prototype.UpdateDrugLabel = function () {
        var attr4 = this.mModel.GetCurDrugAttr();
        return attr4;
    };
    RoleTemplateAttrPanel.prototype.UpdateSkinLabel = function () {
        var attr3 = this.mModel.GetCurDressAttr();
        if (attr3 && attr3.length) {
            this.skinAttr.textFlow = AttributeData.GetAttrTabString(attr3);
        }
        else {
            UIHelper.SetVisible(this.skinAttr.parent, false);
        }
        return attr3;
    };
    RoleTemplateAttrPanel.prototype.ShowModel = function (pid) {
        if (this.mModel.mTemplateType == UserTemplate.TYPE_RIDE) {
            this.ridePanel.SetBodyId(pid);
        }
        else {
            this.showPanel.SetBody(AppearanceConfig.GetUIPath(pid));
        }
    };
    RoleTemplateAttrPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    RoleTemplateAttrPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return RoleTemplateAttrPanel;
}(BaseEuiView));
__reflect(RoleTemplateAttrPanel.prototype, "RoleTemplateAttrPanel");
//# sourceMappingURL=RoleTemplateAttrPanel.js.map