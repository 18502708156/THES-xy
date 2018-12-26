class PetSkillTipPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// PetSkillTipSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected skillIcon: eui.Component;
	protected skillName: eui.Label;
	protected skillType: eui.Label;
	protected skillDesc: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "PetSkillTipSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		/**0 主动， 1 合体， 2 被动 */
		let skillState = param[0]
		let skillId = param[1]
		let isSpecial = param[2];//专门针对，玄女，天神技能处理的
		PetSkillIconItem.SetContent(this.skillIcon as any, skillId, skillState, isSpecial)
		let quality
		let skillName
		if (2 == skillState) {
			this.skillType.text = "类型：被动技能"
			if (isSpecial) {
				quality = PetConst.GetSkillQuality(skillId)
				skillName = PetConst.GetSkillName(skillId)
				this.skillDesc.text = PetConst.GetSkillDesc(skillId)
			} else {
				quality = PetConst.GetPassSkillQuality(skillId)
				skillName = PetConst.GetPassSkillName(skillId)
				this.skillDesc.text = PetConst.GetPassSkillDesc(skillId)
			}
		} else {
			// this.skillType.text = 0 == skillState ? "类型：主动技能" : "类型：合体技能"
			this.skillType.text = "类型：主动技能";
			quality = PetConst.GetSkillQuality(skillId)
			skillName = PetConst.GetSkillName(skillId)
			this.skillDesc.text = PetConst.GetSkillDesc(skillId)
		}
		if (quality == 6) {
			this.skillName.textFlow = PetXilianPanel.GetSkillNameColor(skillName)
		} else {
			this.skillName.textColor = ItemBase.GetColorByQuality(quality)
			this.skillName.text = PetConst.GetSkillName(skillId)
		}
	}

	public OnClose() {

	}
}