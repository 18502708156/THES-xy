class FormationInfoPanel extends BaseView {

    /////////////////////////////////////////////////////////////////////////////
    // FormationInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected lbPower: eui.Label;
    protected btnSC: eui.Button;
	protected btnFS: eui.Button;
	protected btnUse: eui.Button;
	protected imgUsed: eui.Image;
    protected btnAdd: eui.Button;
    protected btnCulture: eui.Button;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected consumeLabel: ConsumeTwoLabel;
    protected checkBox: eui.CheckBox;
    protected lbLev: eui.Label;
    protected powerLabel: PowerLabel;
    protected showAllAttr: eui.Button;
    public petShowPanel: PetShowPanel;
	protected groupSkill: eui.Group;
    protected skillComp: eui.Component;
	protected groupMaxLv: eui.Group;
	protected groupDuration: eui.Group;
	protected groupUplv: eui.Group;
	protected groupUnGain: eui.Group;
	protected needItemView: NeedItemView;
	protected btnActive: eui.Button;
	protected getwayLabel: eui.Label;
	protected groupLv: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	private mFormationId: number

    private mRoleAutoSendData: RoleAutoSendData
    private mRoleSendCheckData: RoleSendCheckData

	public constructor() {
		super()
		this.skinName = "FormationInfoSkin"



		this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this._SendUp()) {
                this.mRoleAutoSendData.Stop()
            }
        }, () => {
            if (this.mRoleAutoSendData.mIsAuto) {
                this.btnCulture.label = "停止"
            } else {
                this.btnCulture.label = "自动升级"
            }
        })

        this.mRoleSendCheckData = new RoleSendCheckData((type) => {
            GameGlobal.FormationModel.SendUpgradeFormation(this.mFormationId, type)
        }, () => {
			let formationInfo = GameGlobal.FormationModel.GetFormationInfo(this.mFormationId)
			let config = FormationConst.GetFormationLevelConfig(this.mFormationId, formationInfo.mLevel)
            if (config) {
                let cost = config.cost
                return [cost[0].id, cost[0].count, cost[1].id, cost[1].count]
            }
            return [null]
        }, () => {
            return this.checkBox.selected
        }, () => {
			this.mRoleAutoSendData.Toggle()
		})
		
		this._AddClick(this.btnSC, this._OnClick)
		this._AddClick(this.btnFS, this._OnClick)
		this._AddClick(this.btnUse, this._OnClick)
		this._AddClick(this.btnAdd, this._OnClick)
		this._AddClick(this.btnCulture, this._OnClick)
		this._AddClick(this.skillComp, this._OnClick)
		this._AddClick(this.powerLabel, this._OnClick)
		this._AddClick(this.btnActive, this._OnClick)
		this._AddClick(this.showAllAttr, this._OnClick)
	}

	OnOpen() {
		this.observe(MessageDef.FORMATION_UPDATE_INFO, this.UpdateInfo)
        this.observe(MessageDef.FORMATION_UPDATE_EXP, this.UpdateExpInfo)
	}

	OnClose() {
		this.mRoleAutoSendData.Stop()
	}

	public UpdateContent(id: number) {
		this.mFormationId = id
		let model = GameGlobal.FormationModel
		let config = GameGlobal.Config.FormationListConfig[id]
		
		this.SetSkillInfo()
		this.showAllAttr.visible = model.GetAllPower() > 0
		UIHelper.SetLabelText(this.lbPower, "阵型总战力：", model.GetAllPower() + "")

		this.petShowPanel.SetBody(FormationConst.GetSkin(id))

		this.groupUnGain.visible = !model.HasFormation(id)
		this.groupUplv.visible = model.HasFormation(id)
		this.groupLv.visible = model.HasFormation(id)
		this.btnFS.visible = model.HasFormation(id)

		this.imgUsed.source = "ui_zx_bm_shiyongzhong"
		this.imgUsed.visible = model.IsUsed(id)
		this.btnUse.visible = model.HasFormation(id) && !model.IsUsed(id)

		UIHelper.ShowRedPoint(this.btnSC, GameGlobal.FormationModel.mRedPoint.IsRedDrug(this.mFormationId))
		UIHelper.ShowRedPoint(this.btnFS, GameGlobal.FormationModel.mRedPoint.IsRedSoul(this.mFormationId))
		UIHelper.ShowRedPoint(this.btnActive, GameGlobal.FormationModel.mRedPoint.IsRedAct(this.mFormationId))
		UIHelper.ShowRedPoint(this.skillComp, GameGlobal.FormationModel.mRedPoint.IsRedSkill(this.mFormationId))

		if (!model.HasFormation(id))
		{
			this.SetActiveInfo(id)
			return
		}

		this.UpdateExp()
	}

	private UpdateInfo() {
		this.UpdateContent(this.mFormationId)
	}

	private UpdateExpInfo() {
		if (GameGlobal.FormationModel.IsMaxLv(this.mFormationId))
		{
			this.mRoleAutoSendData.Stop()
		}
		else
		{
			this.mRoleAutoSendData.Continue()
		}
		
		this.UpdateExp()
	}

	private UpdateExp() {
		let model = GameGlobal.FormationModel
		let id = this.mFormationId

		this.powerLabel.text = model.GetPower(id)
		let formationInfo = model.GetFormationInfo(id)
		this.lbLev.text = formationInfo.mLevel + "级"
		this.groupDuration.visible = !model.IsMaxLv(id)
		this.groupMaxLv.visible = model.IsMaxLv(id)
		if (model.IsMaxLv(id))
			return

		let config = FormationConst.GetFormationLevelConfig(id, formationInfo.mLevel)
        this.bar.maximum = config.proexp
        this.bar.value = formationInfo.mUpNum * config.exp
        this.consumeLabel.Set(config.cost)
	}

	private SetActiveInfo(id) {
		let material = FormationConst.GetFormationUpgradeMaterial(id)
		if (!material)
			return

		this.needItemView.SetItemId(material.id, material.count)
		let canActive = GameGlobal.UserBag.GetCount(material.id) >= material.count
		this.btnActive.visible = canActive
		if (this.getwayLabel.visible = !canActive) {
			this.getwayLabel.textFlow = (new egret.HtmlTextParser).parser("<font>获取：</font><a href=\"event:\"><font color='#019704'><u>"+ "宠物商店" +"</u></font></a>");
		}
	}

	private SetSkillInfo() {
		this.groupSkill.visible = FormationConst.HasBuffSkill(this.mFormationId)
		if (!FormationConst.HasBuffSkill(this.mFormationId))
			return
		PetSkillIconItem.SetContent(this.skillComp as any, GameGlobal.FormationModel.GetSkillId(this.mFormationId), 2)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnSC:
				ViewManager.ins().open(FormationDrugPanel, GameGlobal.FormationModel)
			break
			case this.btnFS:
				ViewManager.ins().open(FormationSoulPanel, this.mFormationId)
			break
			case this.btnAdd:
				this._SendUp()
			break
			case this.btnCulture:
				this.mRoleAutoSendData.Toggle()
			break
			case this.powerLabel:
				ViewManager.ins().open(FormationDetailPanel, this.mFormationId)
			break
			case this.skillComp:
				ViewManager.ins().open(FormationSkillPanel, this.mFormationId)
			break
			case this.btnActive:
				GameGlobal.FormationModel.SendActiveFormation(this.mFormationId)
			break
			case this.btnUse:
				GameGlobal.FormationModel.SendUseFormation(this.mFormationId)
			break
			case this.showAllAttr:
				ViewManager.ins().open(FormationAllAttrPanel)
			break
		}
	}

	private _SendUp(): boolean {
        return this.mRoleSendCheckData.SendUp()
    }
}
