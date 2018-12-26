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
var PetSkillTipPanel = (function (_super) {
    __extends(PetSkillTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PetSkillTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetSkillTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    PetSkillTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        /**0 主动， 1 合体， 2 被动 */
        var skillState = param[0];
        var skillId = param[1];
        var isSpecial = param[2]; //专门针对，玄女，天神技能处理的
        PetSkillIconItem.SetContent(this.skillIcon, skillId, skillState, isSpecial);
        var quality;
        var skillName;
        if (2 == skillState) {
            this.skillType.text = "类型：被动技能";
            if (isSpecial) {
                quality = PetConst.GetSkillQuality(skillId);
                skillName = PetConst.GetSkillName(skillId);
                this.skillDesc.text = PetConst.GetSkillDesc(skillId);
            }
            else {
                quality = PetConst.GetPassSkillQuality(skillId);
                skillName = PetConst.GetPassSkillName(skillId);
                this.skillDesc.text = PetConst.GetPassSkillDesc(skillId);
            }
        }
        else {
            // this.skillType.text = 0 == skillState ? "类型：主动技能" : "类型：合体技能"
            this.skillType.text = "类型：主动技能";
            quality = PetConst.GetSkillQuality(skillId);
            skillName = PetConst.GetSkillName(skillId);
            this.skillDesc.text = PetConst.GetSkillDesc(skillId);
        }
        if (quality == 6) {
            this.skillName.textFlow = PetXilianPanel.GetSkillNameColor(skillName);
        }
        else {
            this.skillName.textColor = ItemBase.GetColorByQuality(quality);
            this.skillName.text = PetConst.GetSkillName(skillId);
        }
    };
    PetSkillTipPanel.prototype.OnClose = function () {
    };
    PetSkillTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetSkillTipPanel;
}(BaseEuiView));
__reflect(PetSkillTipPanel.prototype, "PetSkillTipPanel");
//# sourceMappingURL=PetSkillTipPanel.js.map