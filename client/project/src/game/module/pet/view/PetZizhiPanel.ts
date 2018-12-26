class PetZizhiPanel extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Main
    /////////////////////////////////////////////////////////////////////////////
    // PetZizhiSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected powerLabel: PowerLabel;
    protected lbName: eui.Label;
    protected title1Label: eui.Label;
    protected attrLabel: eui.Label;
    protected btnAdd: eui.Button;
    protected btnCulture: eui.Button;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected needItemView: NeedItemView;
    protected wuxingImg: eui.Image;
	protected starGroup: eui.Group;
	showPanel: PetShowPanel
    /////////////////////////////////////////////////////////////////////////////

	private m_PetId: number
	private m_PetInfo: PetInfo
	private mRoleAutoSendData: RoleAutoSendData

	public static TYPE = [
		"初级",
		"初级",
		"中级",
		"高级",
		"特级",
		"顶级"
	]

	public constructor() {
		super()
		this.skinName = "PetZizhiSkin"

		this._AddClick(this.btnAdd, this._OnClick)
		this._AddClick(this.btnCulture, this._OnClick)

		 this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this.SendUp()) {
                this.mRoleAutoSendData.Stop()
            }
        }, () => {
            if (this.mRoleAutoSendData.mIsAuto) {
                this.btnCulture.label = "停止"
            } else {
                this.btnCulture.label = "自动提升"
            }
        })
	}

	OnOpen(...param: any[]) {
		this.m_PetId = param[0]
		this.UpdateContent()
		this.observe(MessageDef.PET_UPATE_ZIZHI, this.UpdateZizhi)
		this.observe(MessageDef.PET_UPATE_INFO, this.UpdateContent)
		this.commonWindowBg.OnAdded(this)
	}
	

	OnClose() {
		this.mRoleAutoSendData.Stop()
	}

	private UpdateZizhi() {
		this.mRoleAutoSendData.Continue()
	}

	public UpdateContent() {
		let model = GameGlobal.PetModel
		let petInfo = this.m_PetInfo = model.GetPetInfo(this.m_PetId)
		this.powerLabel.text = petInfo.GetZizhiPower()
		// this.lbName.text = petInfo.mName
		PetConst.SetName(this.lbName as any, petInfo)
		let level = petInfo.mZizhiLevel
		let config = GameGlobal.Config.petGiftproConfig[this.m_PetId][level - 1]
		this.wuxingImg.source = PetConst.XUXING_IMG[GameGlobal.Config.petBiographyConfig[this.m_PetId].fiveele]	
		for (let i = 0; i < this.starGroup.numChildren; i++) {
			let item = this.starGroup.getChildAt(i) as eui.Image
			item.source = level > i ? "ui_bm_jsstar04" : "ui_bm_jsstar03"
		}
		// let attrs = model.GetAllZizhiAttrs()
		let attrs = petInfo.GetShowZizhiAttrs()
		this.attrLabel.textFlow = AttributeData.GetAttrTabString(attrs)
		if (level >= model.MAX_ZIZHI_LEVEL) {
			this.currentState = "full"
		} else {
			this.currentState = "normal"
			this.bar.maximum = config.proexp
			this.bar.value = petInfo.mZizhiExp * config.exp
			this.needItemView.SetItemId(config.cost[0].id, config.cost[0].count)
		}

		this.showPanel.SetBody(petInfo.GetSkin())
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnAdd:
				this.SendUp()
			break
			case this.btnCulture:
				this.mRoleAutoSendData.Toggle()
			break
		}
	}

	private SendUp() {
        let model = GameGlobal.PetModel
		let config = GameGlobal.Config.petGiftproConfig[this.m_PetId][this.m_PetInfo.mZizhiLevel]
		if (!config) {
			return false
		}
		if (Checker.Datas(config.cost,false)) {
			model.SendUpZizhi(this.m_PetId)
			return true
		}
		else{
			UserWarn.ins().BuyGoodsWarn(config.cost[0].id)
		}
		return false
    }
}