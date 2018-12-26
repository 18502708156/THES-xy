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
var FormationSkillPanel = (function (_super) {
    __extends(FormationSkillPanel, _super);
    function FormationSkillPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FormationSkillSkin";
        return _this;
    }
    FormationSkillPanel.prototype.childrenCreated = function () {
        this._AddClick(this.upBtn, this._OnClick);
    };
    FormationSkillPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.title = "技能";
        this.commonDialog.OnAdded(this);
        this.observe(MessageDef.FORMATION_UPDATE_SKILL_INFO, this.UpdateContent);
        this.mFormationId = param[0];
        this.UpdateContent();
    };
    FormationSkillPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    FormationSkillPanel.prototype._OnClick = function (e) {
        var skillCost = FormationConst.GetSkillUpgradeCost(this.mSkillId);
        if (Checker.CheckItem(skillCost.id, skillCost.count, false))
            GameGlobal.FormationModel.SendUpgradeSkill(this.mFormationId);
    };
    FormationSkillPanel.prototype.UpdateContent = function () {
        this.mSkillId = GameGlobal.FormationModel.GetSkillId(this.mFormationId);
        PetSkillIconItem.SetContent(this.skillComp, this.mSkillId, 2);
        var name = PetConst.GetPassSkillName(this.mSkillId);
        var config = GameGlobal.Config.FormationSkillConfig[this.mSkillId];
        if (!config)
            return;
        this.skillName.textFlow = TextFlowMaker.generateTextFlow(name + ("|C:0x019704&T: Lv." + config.lv + "|"));
        this.curDesc.text = PetConst.GetPassSkillDesc(this.mSkillId);
        this.unActiveImg.visible = false;
        if (FormationConst.IsMaxSkillLv(this.mSkillId)) {
            this.groupNextDesc.visible = false;
            this.groupMaxLv.visible = true;
            this.upGroup.visible = false;
            return;
        }
        var nextSkillId = FormationConst.GetNextSkillId(this.mSkillId);
        this.nextDesc.text = PetConst.GetPassSkillDesc(nextSkillId);
        if (!GameGlobal.FormationModel.HasFormation(this.mFormationId)) {
            this.unActiveImg.visible = true;
            this.groupMaxLv.visible = false;
            this.upGroup.visible = false;
            return;
        }
        var skillCost = FormationConst.GetSkillUpgradeCost(this.mSkillId);
        if (!skillCost)
            return;
        this.needItemView.SetItemId(skillCost.id, skillCost.count);
    };
    FormationSkillPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FormationSkillPanel;
}(BaseEuiView));
__reflect(FormationSkillPanel.prototype, "FormationSkillPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=FormationSkillPanel.js.map