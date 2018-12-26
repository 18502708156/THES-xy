class LingtongSkillPanel extends BaseView implements ICommonWindowTitle {
	public static NAME = "技能"
    /////////////////////////////////////////////////////////////////////////////
    // LingtongSkillSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected skillIcon: eui.Component;
    protected skillDesc: eui.Label;
    protected starGroup: eui.Group;
    protected goBtn: eui.Button;
    protected btnInfo: eui.Button;
    protected skillGroup: eui.List;
    protected petShowPanel: RoleShowPanel;
    protected nameBg: eui.Image;
    protected lbName: eui.Label;

    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "LingtongSkillSkin"
	}

	public childrenCreated() {
		this._AddClick(this.goBtn, this._OnClick)
		this._AddClick(this.btnInfo, this._OnClick)
		this._AddClick(this.skillIcon, this._OnClick)
		this._AddClick(this.starGroup, this._OnClick)
		this.skillGroup.itemRenderer = LinglongSkillItem
		this._AddItemClick(this.skillGroup, this._OnItemClick)
	}

	public OnOpen() {
		this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent)
		this.lbName.text = GameGlobal.LingtongAttrModel.mName

		this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint)
		this.UpdateRedPoint()
	}

	private UpdateRedPoint() {
		UIHelper.ShowRedPoint(this.goBtn, GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_SKILL))
	}

	public UpdateContent() {
		if (!GameGlobal.LingtongAttrModel.IsActive()) {
			return
		}
		let model = GameGlobal.LingtongAttrModel
		this.group.visible = true

		let list = []
		for (let id of GameGlobal.LingtongAttrModel.mBuffSkill) {
			list.push(id)
		}
		for (let i = list.length; i < PetModel.SKILL_COUNT; i++) {
			list.push(null)
		}
		this.skillGroup.dataProvider = new eui.ArrayCollection(list)

		let xilianStar = this.GetXilianStar()
		for (let i = 0; i < this.starGroup.numChildren; i++) {
			let item = this.starGroup.getChildAt(i) as eui.Image
			item.source = xilianStar > i ? "ui_bm_star022" : "ui_bm_star021"
		}
		LingtongViewHelper.SetRole(this.petShowPanel)
		let skillId = GameGlobal.LingtongAttrModel.GetSkillId()
		let skillConfig = GameGlobal.Config.EffectsConfig[skillId]
		// this.skillDesc.text = PetConst.GetSkillDesc(skillId)
		this.skillDesc.text = "提升灵童的天赋可提升主动技能等级"
		PetSkillIconItem.SetContent(this.skillIcon as any, GameGlobal.LingtongAttrModel.GetSkillId(), 0)
	}

	public GetXilianStar(): number {
		let config = GameGlobal.Config.BabyBasisConfig.polishStar
		let star = config.length
		let xilian = GameGlobal.LingtongAttrModel.mXilian
		for (let i = 0; i < config.length; i++) {
			let val = config[i]
			if (xilian <= val) {
				star = i + 1
				break
			}
		}
		return star
	}

	private _OnItemClick(e: eui.ItemTapEvent) {
		let index = e.itemIndex
		let skillId = GameGlobal.LingtongAttrModel.mBuffSkill[index]
		if (!skillId) {
			return
		}
		ViewManager.ins().open(PetSkillTipPanel, 2, skillId)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.goBtn:
				ViewManager.ins().open(LingtongXilianPanel)
				break
			case this.btnInfo:
				this.pressInfo();
				break
			case this.skillIcon:
				ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.LingtongAttrModel.GetSkillId())
				break
			case this.starGroup:
				this.pressInfo();
				break
		}
	}

	private pressInfo() {
			let desc = '灵童技能已累计刷新：';
			let count = GameGlobal.LingtongAttrModel.mXilian + "次"
			let c = 0xffffff;
				c = ItemBase.GetColorByQuality(1)
			ViewManager.ins().open(PetXilianTipPanel, GameGlobal.LingtongAttrModel.mName, desc, count, c, GameGlobal.Config.BabyBasisConfig.freshitemid);
	}

    public static RedPointCheck(): boolean {
        return GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_SKILL)
    }
}
