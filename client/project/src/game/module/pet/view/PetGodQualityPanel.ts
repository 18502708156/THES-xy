class PetGodQualityPanel extends BaseView implements ICommonWindowTitle {
	public static NAME = "神宠"
	/////////////////////////////////////////////////////////////////////////////
	// PetGodQualitySkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected group: eui.Group;
	protected skillIcon: eui.Component;
	protected img01: eui.Image;
	protected label01: eui.Label;
	protected skillDesc: eui.Label;
	protected powerLabel: PowerLabel;
	protected skillGroup: eui.List;
	protected lbName: eui.Component;
	protected petShowPanel: PetShowPanel;
	protected showGroup: eui.Group;
	protected petList: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected attr0Txt: eui.Label;
	protected attr1Txt: eui.Label;
	protected attr2Txt: eui.Label;
	protected getwayLabel: GetwayLabel;
	protected mListLRBtnCtrl: ListLRBtnCtrl;
	/////////////////////////////////////////////////////////////////////////////

	private mPetId: number

	public constructor() {
		super()
	}

	public childrenCreated() {
		this._AddClick(this.skillIcon, this._OnClick)
		this._AddClick(this.getwayLabel, this._OnClick)
		this.skillGroup.itemRenderer = PetSkillItem
		this._AddItemClick(this.skillGroup, this._OnItemClick)
		this._AddItemClick(this.petList, this._OnItemClick)

		this.getwayLabel.label.stroke = 0;
		this.getwayLabel.textColor = Color.l_green_1;

		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.petList, this.leftBtn, this.rightBtn, 112)
		let petListData = [];
		let config = CommonUtils.GetArray(GameGlobal.Config.petBiographyConfig, "id")
		for (let key in config)
			if (config[key].picshow == 1) {
				config[key]["gray"] = true;
				petListData.push(config[key]);
			}
		SortTools.sortMap(petListData, "id");
		this.petList.itemRenderer = GodPetHeadItem;
		this.petList.dataProvider = new eui.ArrayCollection(petListData);
		this.petList.selectedIndex = 0;
		this.mListLRBtnCtrl.OnRefresh();
	}

	public UpdateContent() {
		let model = GameGlobal.PetModel
		let selectConfig = this.petList.selectedItem;
		let HandBookConfig = GameGlobal.Config.HandBookConfig;
		for (let key in HandBookConfig) {
			if (HandBookConfig[key].id == this.petList.selectedItem.pictype) {
				this.getwayLabel.text = HandBookConfig[key].name;
			}
		}
		this.mPetId = selectConfig.id

		this.img01.source = PetConst.XUXING_IMG[selectConfig.fiveele]

		let skills = []
		for (let key in selectConfig.buffskill) {
			skills.push(selectConfig.buffskill[key].id)
		}
		this.skillGroup.dataProvider = new eui.ArrayCollection(skills);
		let petInfo = new PetInfo();
		petInfo.mPetId = selectConfig.id;
		petInfo.mName = selectConfig.name;

		PetConst.SetName(this.lbName as PetNameComp, petInfo)
		this.powerLabel.text = ItemConfig.CalcAttrScoreValue(selectConfig.attrs);

		this.petShowPanel.SetBody(PetConst.GetSkin(this.mPetId))

		this.skillDesc.text = PetConst.GetSkillDesc(selectConfig.skill[0])
		PetSkillIconItem.SetContent(this.skillIcon as any, selectConfig.skill[0], 0)//主动技能

		this.attr0Txt.text = AttributeData.getAttStr(selectConfig.attrs, 0, 0, ":", false, "#ffffff", "            ");
	}

	private _OnItemClick(e: eui.ItemTapEvent) {
		if (e.target == this.petList)
			this.UpdateContent();
		else {
			let skillId = this.skillGroup.selectedItem
			if (!skillId) {
				return
			}
			ViewManager.ins().open(PetSkillTipPanel, 2, skillId)
		}

	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.skillIcon:
				ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.PetModel.GetPetInfo(this.mPetId).GetSkillId())
				break
			case this.getwayLabel:
				let config = GameGlobal.Config.HandBookConfig;
				for (let key in config) {
					if (config[key].id == this.petList.selectedItem.pictype) {
						let info;
						if (config[key].hasOwnProperty("gainWay"))
							info = config[key].gainWay[0]
						if (!info) {
							GameGlobal.UserTips.showTips(config[key].name);
							return
						}
						ViewManager.ins().Guide(info[1][0], info[1][1]);
						ViewManager.ins().close(PetInfoPanel);
					}
				}
				break
		}
	}
}

class GodPetHeadItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// PetHeadSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected item: ItemIcon;
	protected imgBattle: eui.Image;
	protected imgNotice: eui.Image;
	protected imgType: eui.Image;
	protected lbName: eui.Label;
	protected lbLev: eui.Label;
	protected starGroup: eui.DataGroup;
	protected redPoint: eui.Image;
	protected imgShen: eui.Image;
	///////////////////////////////////////////////////////////////////////////// 

	public childrenCreated() {
	}

	public dataChanged() {
		this.lbName.text = this.data.name
		this.lbName.textColor = ItemBase.GetColorByQuality(this.data.quality)
		this.item.SetQuality(this.data.quality)
		this.item.setItemImg(PetConst.GetHeadIcon(this.data.id))
		this.lbLev.visible = false;
		this.imgShen.visible = GameGlobal.Config.petBiographyConfig[this.data.id].picshow
	}
}