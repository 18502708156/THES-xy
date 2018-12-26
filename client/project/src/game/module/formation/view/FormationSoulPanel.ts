class FormationSoulPanel extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main;

	/////////////////////////////////////////////////////////////////////////////
	// FormationSoulSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected powerLabel: PowerLabel;
    protected showPanel: PetShowPanel;
    protected lbLev: eui.Label;
    protected soulName: eui.Label;
    protected groupMaxLv: eui.Group;
    protected groupUpLv: eui.Group;
    protected needItemView: NeedItemView;
    protected btnInjection: eui.Button;
    protected bar: eui.ProgressBar;
    protected upPropGroup: eui.Group;
    protected curProp: eui.Label;
    protected nextProp: eui.Label;
    protected maxProp: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	private mFormationId: number;

	public constructor() {
		super()
		this.skinName = "FormationSoulSkin";
	}

	public childrenCreated() {
        this.commonWindowBg.SetTitle("阵魂")
        
		this._AddClick(this.btnInjection, this._OnCkick)
	}

	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this);
		this.observe(MessageDef.FORMATION_UPDATE_SOUL_EXP, this.UpdateExpInfo)

		this.mFormationId = param[0]
		this.UpdateContent()
	}

	private _OnCkick(e: egret.TouchEvent) {
		this._SendUpgrade()
	}

	private _SendUpgrade() {
		let model = GameGlobal.FormationModel
		let formationInfo = model.GetFormationInfo(this.mFormationId)
		let	soulLevel = formationInfo.mSoulLv
		let soulConfig = FormationConst.GetFormationSoulConfig(this.mFormationId, soulLevel)
		let cost = soulConfig.cost
		if (Checker.CheckItem(cost.id, cost.count, false))
			GameGlobal.FormationModel.SendUpgradeFormationSoul(this.mFormationId, 0)
	}

	private UpdateExpInfo() {
		this.SetUpgradeInfo()
		this.SetPropInfo()
	}


    public UpdateContent() {
		this.showPanel.SetBody(FormationConst.GetSkin(this.mFormationId))
		this.soulName.text = FormationConst.GetFormationName(this.mFormationId) + "阵魂属性"

		this.UpdateExpInfo()
    }

	private SetPropInfo() {
		let model = GameGlobal.FormationModel
		this.upPropGroup.visible = !model.IsMaxSoulLv(this.mFormationId)
		this.maxProp.visible = model.IsMaxSoulLv(this.mFormationId)

		let formationInfo = model.GetFormationInfo(this.mFormationId)
		let curAttr = FormationConst.GetFormationSoulAttr(this.mFormationId, formationInfo.mSoulLv, formationInfo.mSoulUpNum)
		if (model.IsMaxSoulLv(this.mFormationId))
		{
			this.maxProp.textFlow = AttributeData.GetAttrTabString(curAttr, "\n\n")
		}
		else
		{
			this.curProp.textFlow = AttributeData.GetAttrTabString(curAttr, "\n\n")
			let nextAttr = FormationConst.GetFormationSoulAttr(this.mFormationId, formationInfo.mSoulLv+1, 0)
			this.nextProp.textFlow = AttributeData.GetAttrTabString(nextAttr, "\n\n")
		}
	}

	private SetUpgradeInfo() {
		let model = GameGlobal.FormationModel
		this.powerLabel.text = model.GetPower(this.mFormationId)
		this.groupUpLv.visible = !model.IsMaxSoulLv(this.mFormationId)
		this.groupMaxLv.visible = model.IsMaxSoulLv(this.mFormationId)

		if (model.IsMaxSoulLv(this.mFormationId))
			return

		let formationInfo = model.GetFormationInfo(this.mFormationId)
		let	soulLevel = formationInfo.mSoulLv
		let soulConfig = FormationConst.GetFormationSoulConfig(this.mFormationId, soulLevel)
		let cost = soulConfig.cost
		this.needItemView.SetItemId(cost.id, cost.count)

		this.UpdateExp()
	}

	private UpdateExp() {
		let model = GameGlobal.FormationModel
		let formationInfo = model.GetFormationInfo(this.mFormationId)
		let soulLevel = formationInfo.mSoulLv
		let config = FormationConst.GetFormationSoulConfig(this.mFormationId, soulLevel)
		
		this.lbLev.text = soulLevel.toString() + "级"
		this.bar.maximum = config.proexp
        this.bar.value = formationInfo.mSoulUpNum * config.exp
	}


	public OnClose() {

	}
}