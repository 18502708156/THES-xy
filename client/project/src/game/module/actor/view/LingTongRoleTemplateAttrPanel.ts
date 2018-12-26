class LingTongRoleTemplateAttrPanel extends RoleTemplateAttrPanel {

	protected ShowModel(pid) {
		LingtongViewHelper.SetRole(this.roleShowPanel)
	}


	protected UpdateSkinLabel() {
		this.skinLabel.text = "天赋属性加成"

		let model = GameGlobal.LingtongAttrModel
		if (!model.mSex) {
			UIHelper.SetVisible(this.skinAttr.parent, false)
			return
		}
		let config = GameGlobal.Config.BabyTalentConfig[model.mSex][model.giftlv - 1]
		if (!config) {
			UIHelper.SetVisible(this.skinAttr.parent, false)
			return
		}

		let attr3 = model.getTianFuAllAttr()
		if (attr3 && attr3.length) {
			this.skinAttr.textFlow = AttributeData.GetAttrTabString(attr3)
		} else {
			UIHelper.SetVisible(this.skinAttr.parent, false)
		}
		return attr3
	}
}