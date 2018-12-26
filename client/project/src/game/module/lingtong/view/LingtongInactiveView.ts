class LingtongInactiveView extends BaseView {
    /////////////////////////////////////////////////////////////////////////////
    // LingtongInactiveSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected check0: eui.CheckBox;
    protected check1: eui.CheckBox;
    protected infoLabel: eui.Label;
    protected info2Label: eui.Label;
    protected goLabel: eui.Label;
    protected actBtn: eui.Button;
    // protected needItemView: NeedItemView;
    // protected getwayLabel: GainLabel;
    protected skillList: eui.List;
    protected petShowPanel: RoleShowPanel;
    protected powerLabel: PowerLabel;
	protected itemGroup: eui.Group
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "LingtongInactiveSkin"
		this.check0.selected = true
		this.check1.selected = false
		this.powerLabel.visible = false
		this.skillList.itemRenderer = PetSkillIconItem

		UIHelper.SetLinkStyleLabel(this.goLabel)

		this._AddChange(this.check0, this._OnChange)
		this._AddChange(this.check1, this._OnChange)

		this._AddClick(this.actBtn, this._OnActClick)
		this._AddClick(this.goLabel, this._OnClick)
		this._AddItemClick(this.skillList, this._OnItemClick)
	}

	private _OnItemClick(e: eui.ItemTapEvent) {
		let index = e.itemIndex
		if (index == 0) {
			ViewManager.ins().open(PetSkillTipPanel, 0, e.itemRenderer.data)
		} else {
			ViewManager.ins().open(PetSkillTipPanel, 2, e.itemRenderer.data.id)
		}
	}

	public OnOpen() {
		// this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(GameGlobal.LingtongModel.SkinConfig[1].pid))
		this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.LINGTONG_ACT_ITEM, this._OnSelect)
		this.observe(MessageDef.RP_LINGTONG, this.UpdateInfoLabel)
		this.observe(MessageDef.DESTINY_CHANGE, this.UpdateEquip)
		this._OnSelect()

		this.UpdateInfoLabel()
	}

	private _OnClick() {
		// ViewManager.ins().open(DestinyNiWin)
		// ViewManager.ins().openIndex(LingtongMainPanel, 3)
		ViewManager.ins().openIndex(DestinyUpWin, 1)
	}

	private _OnActClick() {
		let index = this.check0.selected ? 1 :2
		let str = index == 1 ? "男童" : "女童"
		WarnWin.show(`是否确定选择|C:${Color.GetStr(Color.l_green_1)}&T:【${str}】|，选择激活后无法变更性别`, () => {
			GameGlobal.LingtongAttrModel.SendActive(index)
		}, this)
	}

	private UpdateInfoLabel() {
		let datas = GameGlobal.DestinyController.getUseDestinyData()
		
		this.info2Label.text = `需要佩戴${GameGlobal.Config.BabyBasisConfig.material.num}个${ItemBase.QUALITY_NAME_STR[GameGlobal.Config.BabyBasisConfig.material.quality]}品质的命格才能激活灵童`

		let act = GameGlobal.LingtongAttrModel.mRedPoint.GetIndexAct()
		if (act) {
			this.actBtn.visible = true
			this.goLabel.visible = false
		} else {
			this.actBtn.visible = false
			this.goLabel.visible = true
		}
		this.UpdateEquip()
	}

	private UpdateEquip() {
		let datas = GameGlobal.DestinyController.getUseDestinyData()
		let i = 0
		for (let i = 0; i < 6; i++) {
			let data = datas[i]
			let item = this.itemGroup.getChildAt(i)	as DestinySItem
			if (item) {
				item.onUpdate(i, data)
			}
		}

		this.infoLabel.textFlow = ConsumeLabel.GetValueColor(GameGlobal.LingtongAttrModel.mRedPoint.GetActCount(), GameGlobal.Config.BabyBasisConfig.material.num)
	}

	public UpdateContent() {
		this.UpdateInfoLabel()
	}

	private _OnChange(e: egret.TouchEvent) {
		if (e.currentTarget == this.check0) {
			this.check1.selected = false	
		} else {
			this.check0.selected = false	
		}
		this._OnSelect()
	}

	private _OnSelect() {
		let index = this.check0.selected ? 1 :2

		LingtongViewHelper.SetRole(this.petShowPanel, index, 1)

		let config = GameGlobal.Config.BabyActivationConfig[index]
		this.skillList.dataProvider = new eui.ArrayCollection(config.skill.concat(config.buffskill))
		// this.needItemView.SetItemId(config.material.id, config.material.count)

		// this.actBtn.visible = GameGlobal.UserBag.GetCount(config.material.id) >= config.material.count

		// this.getwayLabel.SetId(config.material.id)
	}
}