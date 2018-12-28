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
var LingTongRoleTemplateAttrPanel = (function (_super) {
    __extends(LingTongRoleTemplateAttrPanel, _super);
    function LingTongRoleTemplateAttrPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LingTongRoleTemplateAttrPanel.prototype.ShowModel = function (pid) {
        LingtongViewHelper.SetRole(this.roleShowPanel);
    };
    LingTongRoleTemplateAttrPanel.prototype.UpdateSkinLabel = function () {
        this.skinLabel.text = "天赋属性加成";
        var model = GameGlobal.LingtongAttrModel;
        if (!model.mSex) {
            UIHelper.SetVisible(this.skinAttr.parent, false);
            return;
        }
        var config = GameGlobal.Config.BabyTalentConfig[model.mSex][model.giftlv - 1];
        if (!config) {
            UIHelper.SetVisible(this.skinAttr.parent, false);
            return;
        }
        var attr3 = model.getTianFuAllAttr();
        if (attr3 && attr3.length) {
            this.skinAttr.textFlow = AttributeData.GetAttrTabString(attr3);
        }
        else {
            UIHelper.SetVisible(this.skinAttr.parent, false);
        }
        return attr3;
    };
    return LingTongRoleTemplateAttrPanel;
}(RoleTemplateAttrPanel));
__reflect(LingTongRoleTemplateAttrPanel.prototype, "LingTongRoleTemplateAttrPanel");
//# sourceMappingURL=LingTongRoleTemplateAttrPanel.js.map