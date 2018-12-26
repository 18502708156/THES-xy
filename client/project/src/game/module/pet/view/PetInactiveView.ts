class PetInactiveView extends BaseView {

    /////////////////////////////////////////////////////////////////////////////
    // PetInactiveSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected lbName: eui.Component;
    protected lbPower: eui.Label;
    protected lbActive: eui.Label;
    protected btnSC: eui.Button;
    protected btnYuanfen: eui.Button;
    protected wuxingImg: eui.Image;
    protected powerLabel: PowerLabel;
    protected getwayLabel: GainLabel;
    protected startGroup: eui.Group;
    protected startLabel: eui.Label;
    protected actBtn: eui.Button;
    protected skillList: eui.List;
    protected petShowPanel: PetShowPanel;
    protected needItemView: NeedItemView;
	protected imgShen: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	private m_PetId: number

	public constructor() {
		super()
		this.skinName = "PetInactiveSkin"
		this._AddClick(this.getwayLabel, this._OnClick)
		this._AddClick(this.btnSC, this._OnClick)
		this._AddClick(this.btnYuanfen, this._OnClick)
		this._AddClick(this.actBtn, this._OnClick)
		this.skillList.itemRenderer = PetSkillIconItem
		this._AddItemClick(this.skillList, this._OnItemClick)
	}

	OnOpen() {
		this.btnSC.visible = GameGlobal.actorModel.level > GameGlobal.Config.petbaseConfig.openlv;
		this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true)
		UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.IsRedPoint())
	}

	OnClose() {

	}

	public UpdateContent(id: number) {
		this.m_PetId = id
		let model = GameGlobal.PetModel
		let config = GameGlobal.Config.petBiographyConfig[id]
		PetConst.SetNameById(this.lbName as PetNameComp, id)
		this.imgShen.visible = config.type == 2
		this.wuxingImg.source = PetConst.XUXING_IMG[config.fiveele]
		UIHelper.SetLabelText(this.lbPower, "宠物总战力：", model.GetAllPower() + "")
		UIHelper.SetLabelText(this.lbActive, "已激活：", model.GetActiveCount() + "")
		let material = config.material
		// let itemConfig = GameGlobal.Config.ItemConfig[material.id]
		// this.item.setData(itemConfig)
		// UIHelper.SetLabelText(this.matLabel, itemConfig.name, "*" + material.count)
		// this.useCountLabel.text = "拥有：" + GameGlobal.UserBag.GetCount(material.id)
		this.needItemView.SetItemId(material.id, material.count)
		this.startGroup.visible = config.star > 1
		this.startLabel.text = "洗练初始星级   " + config.star
		let canActive = GameGlobal.UserBag.GetCount(material.id) >= material.count
		this.actBtn.visible = canActive
		if (this.getwayLabel.visible = !canActive) {
			// this.getwayLabel.textFlow = (new egret.HtmlTextParser).parser("<font>获取：</font><a href=\"event:\"><font color='#019704'><u>" + "宠物商店" + "</u></font></a>");
			this.getwayLabel.SetId(material.id)
		}
		this.skillList.dataProvider = new eui.ArrayCollection(config.skill.concat(config.buffskill))

		this.petShowPanel.SetBody(PetConst.GetSkin(id))
		this.powerLabel.text = PetConst.GetPower(id)
	}

	private _OnItemClick(e: eui.ItemTapEvent) {
		let index = e.itemIndex
		if (index == 0) {
			ViewManager.ins().open(PetSkillTipPanel, 0, e.itemRenderer.data)
		} else {
			ViewManager.ins().open(PetSkillTipPanel, 2, e.itemRenderer.data.id)
		}
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.getwayLabel:
				// let config = GameGlobal.Config.petBiographyConfig[this.m_PetId]
				// UserWarn.ins().setBuyGoodsWarn(config.material.id)
				break
			case this.actBtn:
				GameGlobal.PetModel.SendActive(this.m_PetId)
				break
			case this.btnSC:
				ViewManager.ins().open(PetTuJianMainPanel);
				break
			case this.btnYuanfen:
				ViewManager.ins().open(YuanfenMainWin)
				break
		}
	}
}

class PetSkillIconItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// PetSkillIconSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected iconImg: eui.Image;
	protected iconBg: eui.Image;
	protected iconType: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	dataChanged() {
		if (this.itemIndex == 0) {
			PetSkillIconItem.SetContent(this, this.data, 0)
		} else {
			PetSkillIconItem.SetContent(this, this.data.id, 2)
		}
	}

	public static SetContent(comp: PetSkillIconItem, skillId: number, state: number, isSpecial: boolean = false) {

		let strLv = ""
		// if(GameGlobal.LingtongAttrModel&&GameGlobal.LingtongAttrModel.giftlv)
		// {
		// 	strLv = " Lv." + GameGlobal.LingtongAttrModel.giftlv 
		// }

		if (2 == state) {
			if (comp["iconType"]) comp.iconType.source = 'ui_tn_bm_bei';
			if (isSpecial) {
				let path = PetConst.GetSkillIcon(skillId)
				comp.iconImg.source = PetConst.GetSkillIcon(skillId)
				let quality = PetConst.GetSkillQuality(skillId)
				comp.iconBg.source = PetConst.QUALITY_SKILL_BG[quality]

				if (comp["skillName"]) {
					comp["skillName"].text = PetConst.GetSkillName(skillId) + strLv
					comp["skillName"].textColor = ItemBase.GetColorByQuality(quality)
				}
			}
			else {
				comp.iconImg.source = PetConst.GetPassSkillIcon(skillId)
				let quality = PetConst.GetPassSkillQuality(skillId)
				comp.iconBg.source = PetConst.QUALITY_SKILL_BG[quality]
				if (comp["skillName"]) {
					comp["skillName"].text = PetConst.GetPassSkillName(skillId)  + strLv
					comp["skillName"].textColor = ItemBase.GetColorByQuality(quality)
				}
			}

		} else {
			// if (comp["iconType"]) comp.iconType.source = 0 == state ? 'ui_bm_zhu' : 'ui_tn_bm_he';
			if (comp["iconType"]) comp.iconType.source = 'ui_bm_zhu';
			let path = PetConst.GetSkillIcon(skillId)
			comp.iconImg.source = PetConst.GetSkillIcon(skillId)
			let quality = PetConst.GetSkillQuality(skillId)
			comp.iconBg.source = PetConst.QUALITY_SKILL_BG[quality]
			if (comp["skillName"]) {
				comp["skillName"].text = PetConst.GetSkillName(skillId) + strLv
				comp["skillName"].textColor = ItemBase.GetColorByQuality(quality)
			}
		}
	}
}