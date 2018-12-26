class LingtongXilianPanel extends PetXilianPanel {

	public constructor() {
		super()
		this.commonWindowBg.SetTitle("灵童")
	}

	protected GetMsgDef() {
		this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent)
	}

	protected GetBuffSkill() {
		return GameGlobal.LingtongAttrModel.mBuffSkill
	}

	protected GetXilianSkill(i: number) {
		return GameGlobal.LingtongAttrModel.mXilianSkill[i]
	}

	protected SendSkillXilian() {
		GameGlobal.LingtongAttrModel.SendSetSkill()
	}

	protected SendSendXilian(list, type) {
		GameGlobal.LingtongAttrModel.SendRefreshSkill(list, type, this.checkBox.selected)
	}

	protected GetBaseConfig() {
		return GameGlobal.Config.BabyBasisConfig
	}
}