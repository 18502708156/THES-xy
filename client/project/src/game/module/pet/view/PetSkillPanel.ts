class PetSkillPanel extends BaseView implements ICommonWindowTitle {
	public static NAME = "技能"
	/////////////////////////////////////////////////////////////////////////////
	// PetSkillSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected group: eui.Group;
	protected skillIcon: eui.Component;
	protected img01: eui.Image;
	protected label01: eui.Label;
	protected skillDesc: eui.Label;
	protected powerLabel: PowerLabel;
	protected starGroup: eui.Group;
	protected btnInfo: eui.Button;
	protected goBtn: eui.Button;
	protected skillGroup: eui.DataGroup;
	protected lbName: eui.Component;
	protected petShowPanel: PetShowPanel

	/////////////////////////////////////////////////////////////////////////////

	public mContext: PetMainPanel
	private mPetId: number

	public constructor() {
		super()
	}

	public childrenCreated() {
		this._AddClick(this.goBtn, this._OnClick)	
		this._AddClick(this.skillIcon, this._OnClick)
		this._AddClick(this.starGroup, this._OnClick)
		this._AddClick(this.btnInfo, this._OnClick)
		
		this.skillGroup.itemRenderer = PetSkillItem
		this._AddItemClick(this.skillGroup, this._OnItemClick)
	}

	public OnOpen() {
		this.observe(MessageDef.PET_UPATE_INFO, this.UpdateContent)
	}

	public UpdateContent() {
		let model = GameGlobal.PetModel
		let selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex]
		if (!model.HasPet(selectConfig.id)) {
			this.group.visible = false
			return
		}
		this.group.visible = true
		this.mPetId = selectConfig.id

		this.img01.source = PetConst.XUXING_IMG[selectConfig.fiveele]
		let petInfo = model.GetPetInfo(selectConfig.id)
		let list = []
		// for (let id of selectConfig.buffskill) {
		for (let id of petInfo.mBuffSkill) {
			list.push(id)
		}
		for (let i = list.length - 1; i < PetModel.SKILL_COUNT; i++) {
			list.push(null)
		}
		this.skillGroup.dataProvider = new eui.ArrayCollection(list)

		let xilianStar = petInfo.GetXilianStar()
		for (let i = 0; i < this.starGroup.numChildren; i++) {
			let item = this.starGroup.getChildAt(i) as eui.Image
			item.source = xilianStar > i ? "ui_bm_star022" : "ui_bm_star021"
		}
		PetConst.SetName(this.lbName as PetNameComp, petInfo)
		this.powerLabel.text = petInfo.GetPower()

		this.petShowPanel.SetBody(PetConst.GetSkin(this.mPetId))
		let skillId = petInfo.GetSkillId()
		let skillConfig = GameGlobal.Config.EffectsConfig[skillId]
		this.skillDesc.text = PetConst.GetSkillDesc(skillId)
		PetSkillIconItem.SetContent(this.skillIcon as any, petInfo.GetSkillId(), 0)
	}

	private _OnItemClick(e: eui.ItemTapEvent) {
		let petInfo = GameGlobal.PetModel.GetPetInfo(this.mPetId)
		let index = e.itemIndex
		let skillId = petInfo.mBuffSkill[index]
		if (!skillId) {
			return
		}
		ViewManager.ins().open(PetSkillTipPanel, 2, skillId)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.goBtn:
				ViewManager.ins().open(PetXilianPanel, this.mPetId)
				break			
				case this.skillIcon:
				ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.PetModel.GetPetInfo(this.mPetId).GetSkillId())
				break
			case this.btnInfo:
				this.startInfo()
				break
			case this.starGroup:
				this.startInfo()
				break
		}
	}

	public startInfo()
	{
		let petInfo = GameGlobal.PetModel.GetPetInfo(this.mPetId);
		let desc = '宠物技能已累计刷新：';
		let count = petInfo.mXilian + "次"
		let c = 0xffffff;
		let config = GameGlobal.Config.petBiographyConfig[petInfo.mPetId]
		if (config) {
			c = ItemBase.GetColorByQuality(config.quality)
		}
		ViewManager.ins().open(PetXilianTipPanel, petInfo.mName, desc, count, c, GameGlobal.Config.petbaseConfig.freshitemid);
	}

    public static RedPointCheck(): boolean {
        return GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_SKILL)
    }
}

class PetSkillItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// PetSkillIcon2Skin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected iconImg: eui.Image;
	protected iconBg: eui.Image;
	protected skillName: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	dataChanged() {
		let data = this.data
		
		if (!data) {
			this.iconBg.source = "ui_bm_weikaifang"
			this.skillName.text = "" //显示解锁状态			
		} else {
			let skillId = data
			let quality = PetConst.GetPassSkillQuality(skillId)
			this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality]
			this.skillName.textColor = ItemBase.GetColorByQuality(quality)

			let skillName = PetConst.GetPassSkillName(skillId)
			this.iconImg.source = PetConst.GetPassSkillIcon(skillId)

			if (quality == 6) {
				this.skillName.textFlow = PetXilianPanel.GetSkillNameColor(skillName)
			} else {
				this.skillName.text = skillName
				this.skillName.textColor = ItemBase.GetColorByQuality(quality)
			}
		}
	}
}

class LinglongSkillItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// PetSkillIcon2Skin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected iconImg: eui.Image;
	protected iconBg: eui.Image;
	public skillName: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public mIsLock = false

	dataChanged() {
		let data = this.data
		
		if (!data) {
			this.iconBg.source = "ui_bm_weikaifang"
			let str = ""
			let config = GameGlobal.Config.BabyBasisConfig.openSkill
			if(config[this.itemIndex])
			{
				str = config[this.itemIndex]+ "阶解锁"
			}
			this.skillName.text = str //显示解锁状态
			this.mIsLock = true
		} else {
			
			let skillId = data
			if (GameGlobal.Config.EffectsConfig[skillId]) {
				let quality = PetConst.GetPassSkillQuality(skillId)
				this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality]
				this.skillName.textColor = ItemBase.GetColorByQuality(quality)
				this.skillName.text = PetConst.GetPassSkillName(skillId)
				this.iconImg.source = PetConst.GetPassSkillIcon(skillId)

				if (this["iconType"]) {
					this["iconType"].visible = false
				}
			} else {
				if (this["iconType"]) {
					this["iconType"].visible = true
				}
				let path = PetConst.GetSkillIcon(skillId)
				this.iconImg.source = PetConst.GetSkillIcon(skillId)
				let quality = PetConst.GetSkillQuality(skillId)
				this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality]
				this.skillName.text = PetConst.GetSkillName(skillId)
				this.skillName.textColor = ItemBase.GetColorByQuality(quality)
			}


			this.mIsLock = false
		}
	}
}