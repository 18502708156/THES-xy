class HavingShow extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // HavingShowSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected closeBtn: eui.Button;
    protected powerLabel: PowerLabel;
    protected xingxiang: PetShowPanel;
    protected skillList: eui.List;
    protected list: eui.List;
    protected btn: eui.Button;
    protected labelDisplay: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private skillIds: number[];
	private needVipLv = 9;

	protected _resources =  ["ui_xn_bm_db", "xuannvxiafan_json"]

	public constructor() {
		super();
		this.skinName = "HavingShowSkin"
	}

	public childrenCreated() {
		this.needVipLv = GameGlobal.Config.GuideBaseConfig.viplv;
		this.skillList.itemRenderer = HavingSkillIcon;
		this.list.itemRenderer = ItemBaseNotName
		this.list.dataProvider = new eui.ArrayCollection(GameGlobal.VipModel.getVipAward(this.needVipLv));
	}

	OnOpen(...param: any[]) {
		FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SHOW_XUANNV, true)
		
		this._AddClick(this.closeBtn, this.CloseSelf);
		this._AddClick(this.btn, this.tap);
		this._AddItemClick(this.skillList, this._OnItemClick);
		this.observe(MessageDef.UPDATA_VIP_AWARDS, this.updateContent)
		this.observe(MessageDef.VIP_LEVEL_CHANGE, this.updateContent)
		GameGlobal.RechargeModel.xuanNvCard = false;
		this.updateContent();
	}

	updateContent() {
		this.xingxiang.SetBody(AppearanceConfig.GetUIPath(GameGlobal.Config.FemaleDevaSkinConfig[1].pid));
		this.updateSkills();
		this.btn.label = "立即提升VIP"
		if (UserVip.ins().lv >= 9)
			this.btn.label = "领取奖励"
		if (BitUtil.Has(UserVip.ins().state, this.needVipLv))
			this.btn.visible = false;
	}

	private _OnItemClick(e: eui.ItemTapEvent) {
		let index = e.itemIndex
		let skillId = this.skillIds[index]
		if (!skillId) {
			ViewManager.ins().open(HavingSkillTipPanel, 1)
			return
		}
		ViewManager.ins().open(PetSkillTipPanel, index > 2 ? 2 : index, skillId, false)
	}
	
	private updateSkills() {
		this.skillIds = [];
		let baseConfig = GameGlobal.HavingModel.getBaseConfig();
		this.skillIds.length = 6;
		this.skillIds[0] = baseConfig.skill;
		this.skillIds[1] = baseConfig.hskill;
		this.skillIds[2] = GameGlobal.Config.FemaleDevaMagicConfig[1].attrs[3]
		this.skillList.dataProvider = new eui.ArrayCollection(this.skillIds);
	}


	private tap() {
		if (this.btn.label == "立即提升VIP") {
			if (GameGlobal.RechargeModel.choicerechare == 0)
				GameGlobal.RechargeModel.sendRecharge(6);
			else {
				RechargeWin.Open()
				this.CloseSelf()
			}
		}
		else {
			UserVip.ins().sendGetAwards(this.needVipLv)
		}
	}
}