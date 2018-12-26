class PetAttrPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // PetAttrSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected levelAttr: eui.Label;
    protected zizhiAttr: eui.Label;
    protected feisAttr: eui.Label;
    protected lbLev: eui.Label;
    protected wuxingImg: eui.Image;
    protected powerLabel: PowerLabel;
    protected lbName: eui.Component;
	protected showPanel: PetShowPanel
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "PetAttrSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)

		let petId = param[0]
		let petInfo = GameGlobal.PetModel.GetPetInfo(petId)
		this.levelAttr.textFlow = AttributeData.GetAttrTabString(petInfo.GetShowAttrs())
		this.zizhiAttr.textFlow = AttributeData.GetAttrTabString(petInfo.GetShowZizhiAttrs())
		this.feisAttr.textFlow = AttributeData.GetAttrTabString(petInfo.GetShowFeisAttrs())
		this.powerLabel.text = petInfo.GetPower()
		this.lbLev.text = petInfo.mLevel + "\n级"
		PetConst.SetName(this.lbName as PetNameComp, petInfo)
		let config = GameGlobal.Config.petBiographyConfig[petId]
		this.wuxingImg.source = PetConst.XUXING_IMG[config.fiveele]

		this.showPanel.SetBody(PetConst.GetSkin(petId))
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}