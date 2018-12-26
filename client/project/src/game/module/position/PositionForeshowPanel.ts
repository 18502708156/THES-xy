class PositionForeshowPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup
	/////////////////////////////////////////////////////////////////////////////
	// PositionForeshowSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDlg: CommonDialog;
	protected nameTxt: eui.Label;
	protected awardList: eui.List;
	protected skillList: eui.List;
	protected roleShowpanel: RoleShowPanel;
	protected gotoBtn: eui.Button;
	protected boyCheckBox: eui.CheckBox;
	protected girlCheckBox: eui.CheckBox;
	protected btnList: eui.List;
	protected tipsImg: eui.Image;
	protected counterLabel: DurationLabel;
	protected titleLabel: eui.BitmapLabel;
	protected counterGroup: eui.Group
	/////////////////////////////////////////////////////////////////////////////

	private m_nSex = 1;
	private m_gBtnTitel = [];
	private m_gSkill = [];

	public constructor() {
		super();
		this.skinName = "PositionForeshowSkin"
	}

	public childrenCreated() {
		this.btnList.itemRenderer = PositionItem;
		this.awardList.itemRenderer = ItemBase
	}

	public OnOpen(...param: any[]) {
		this.boyCheckBox.selected = true;
		this.girlCheckBox.selected = false;
		this.commonDlg.OnAdded(this);
		this.commonDlg.dialogCloseBtn.visible = false;

		this._AddClick(this.gotoBtn, this.tap);
		this._AddItemClick(this.skillList, this.skiilIconClick);
		this._AddItemClick(this.btnList, this.itemClick);
		this.AddChange(this.boyCheckBox, this.checkBox)
		this.AddChange(this.girlCheckBox, this.checkBox)
		this.observe(MessageDef.POSITION_STATE_CHANGE, this.itemClick)
		this.observe(MessageDef.POSITION_AWARD_CHANGE, this.getAward)

		this.btnList.dataProvider = new eui.ArrayCollection(this.m_gBtnTitel);
		this.btnList.selectedIndex = 0;
		let config = GameGlobal.Config.StationConfig
		let position_info = GameGlobal.PositionForeshowModel.position_info;
		for (let key in config) {
			if (GameGlobal.actorModel.level >= config[key].showlv && position_info.data[config[key].skinid - 1].typ != 3)
				this.m_gBtnTitel.push({ name: config[key].statname, id: config[key].skinid - 1 })
		}
		this.updateCentent();
		this.itemClick();
	}

	private updateCentent() {
		let config = GameGlobal.Config.StationConfig[this.btnList.selectedItem.id + 1];
		this.awardList.dataProvider = new eui.ArrayCollection(config.rewards);
		this.nameTxt.text = config.name;
		this.girlCheckBox.visible = this.btnList.selectedIndex == 3
		this.boyCheckBox.visible = this.btnList.selectedIndex == 3
		if (this.btnList.selectedItem.id != 3) {
			let roledate = new RoleShowData();
			roledate.clothID = config.pid;
			this.roleShowpanel.SetAll(roledate);
		}
		else {
			LingtongViewHelper.SetRole(this.roleShowpanel, this.m_nSex)
		}
		this.tipsImg.source = config.itemid
		this.skillList.dataProvider = new eui.ArrayCollection(this.m_gSkill);

		if (config.attrpower) {
			this.counterGroup.visible = true;
			this.counterLabel.SetColor(Color.Red)
			this.counterLabel.SetEndTime(GameGlobal.PositionForeshowModel.position_info.creatTime + config.attrpower, DurationLabel.TIMETEXT_TYPE_HHMMSS);
		}
		else
			this.counterGroup.visible = false;

		this.getAward();
	}
	private checkBox(e: egret.TouchEvent) {
		if (e.currentTarget == this.boyCheckBox) {
			this.girlCheckBox.selected = false
		} else {
			this.boyCheckBox.selected = false
		}
		switch (e.currentTarget) {
			case this.boyCheckBox:
				this.m_nSex = 1;
				break;
			case this.girlCheckBox:
				this.m_nSex = 2;
				break;
			default:
				break;
		}
		this.updateCentent()
	}
	private tap(e: egret.TouchEvent) {
		let id = this.btnList.selectedItem.id;
		let state = GameGlobal.PositionForeshowModel.position_info.data[id].typ;
		if (state == 1) {
			GameGlobal.PositionForeshowModel.sendGetAward(id + 1)
		} else if (state == 0) {
			switch (id) {
				case 0:
					break;
				case 1:
					ViewManager.ins().open(GrowUpWin, 1)
					this.CloseSelf();
					break;
				case 2:
					GameGlobal.RechargeModel.sendRecharge(6);
					break;
				case 3:
					if (Deblocking.Check(DeblockingType.TYPE_116)) {
						ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_YUANBAO])
						this.CloseSelf();
					}
					break;
				case 4:
					if (Deblocking.Check(DeblockingType.TYPE_28)) {
						ViewManager.ins().open(GodLotteryWin)
						this.CloseSelf();
					}
					else
						GameGlobal.UserTips.showTips("敬请期待")
					break;
				default:
					break;
			}
		}
	}

	private itemClick() {
		let config = GameGlobal.Config.StationConfig[this.btnList.selectedIndex + 1];
		this.gotoBtn.label = config.btn;
		if (GameGlobal.PositionForeshowModel.position_info.data[this.btnList.selectedItem.id].typ == 1)
			this.gotoBtn.label = "领取"
		if (GameGlobal.PositionForeshowModel.position_info.data[this.btnList.selectedItem.id].typ == 3)
			this.gotoBtn.label = "已领取"
		this.titleLabel.text = this.btnList.selectedItem.name;

		this.skillsDispose();
		this.updateCentent()
	}

	private skillsDispose() {
		let config = GameGlobal.Config.StationConfig[this.btnList.selectedIndex + 1];
		this.m_gSkill = [];

		this.skillList.itemRenderer = PetSkillIconItem;
		switch (this.btnList.selectedIndex) {
			case 0:
				let xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(config.pid)
				this.m_gSkill.push(xianlvInfo.GetSkillId())
				break;
			case 1:
				xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(config.pid)
				this.m_gSkill.push(xianlvInfo.GetSkillId())
				break;
			case 2:
				this.skillList.itemRenderer = HavingSkillIcon;
				let baseConfig = GameGlobal.HavingModel.getBaseConfig();
				this.m_gSkill.length = 6;
				this.m_gSkill[0] = baseConfig.skill;
				this.m_gSkill[1] = baseConfig.hskill;
				for (let i = 0; i < GameGlobal.HavingMagicModel.skillData.length; i++) {
					let data = GameGlobal.HavingMagicModel.skillData[i];
					if (data && data.attrData && data.attrData.length == 4) {
						this.m_gSkill[i + 2] = data.attrData[3].skillNo;
					}
				}
				break;
			case 3:
				this.m_gSkill.push(GameGlobal.Config.BabyActivationConfig[this.m_nSex].skill[0])
				break;
			case 4:
				this.skillList.itemRenderer = HavingSkillIcon;
				baseConfig = GameGlobal.Config.AirMarshalBaseConfig;
				this.m_gSkill.length = 6;
				this.m_gSkill[0] = baseConfig.skill;
				this.m_gSkill[1] = baseConfig.hskill;
				let ids = GameGlobal.TianShenModel.mTianShenList[config.pid].GetSkillIds();
				for (let i = 0; i < ids.length; i++) {
					this.m_gSkill[i + 2] = ids[i];
				}
				break;
		}

	}

	private skiilIconClick() {
		let index = this.skillList.selectedIndex;
		let skillId = this.skillList.selectedItem
		if (!skillId) {
			ViewManager.ins().open(HavingSkillTipPanel, 1)
			return
		}
		ViewManager.ins().open(PetSkillTipPanel, index > 2 ? 2 : index, skillId, false)
	}

	private getAward() {
		let touchEnabled = true;
		let state = GameGlobal.PositionForeshowModel.position_info.data[this.btnList.selectedItem.id].typ;
		if (state == 3) {
			touchEnabled = false
			this.gotoBtn.label = "已领取"
		}
		if (state == 2) touchEnabled = false

		this.gotoBtn.touchEnabled = touchEnabled;
		this.gotoBtn.filters = touchEnabled ? null : Color.GetFilter();
	}
}

class PositionItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// BtnTab0Skin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected redPoint: eui.Image;
	protected labelDisplay: eui.Label;
	protected jjkh_img: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	constructor() {
		super()
		this.skinName = "BtnTab0Skin"
	}

	dataChanged() {
		this.labelDisplay.text = this.data.name;
	}
}