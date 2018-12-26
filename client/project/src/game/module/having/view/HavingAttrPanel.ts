class HavingAttrPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// HavingAttrSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected powerLabel: PowerLabel;
	protected levelAttr: eui.Label;
	protected skinAttr: eui.Label;
	protected drugAttr: eui.Label;
	protected showPanel: PetShowPanel;
	/////////////////////////////////////////////////////////////////////////////

	private mModel;


	public constructor() {
		super()
		this.skinName = "HavingAttrSkin"
	}

	public OnOpen(...param: any[]) {
		this.mModel = param[0]
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = param[1]
		let showPath = param[2]

		this.levelAttr.textFlow = AttributeData.GetAttrTabString(this.mModel.GetCurAttr())
		this.skinAttr.textFlow = AttributeData.GetAttrTabString(this.mModel.GetCurDressAttr())
		this.drugAttr.textFlow = AttributeData.GetAttrTabString(this.mModel.GetCurDrugAttr())
		this.powerLabel.text = this.mModel.GetPower()

		this.showPanel.SetBody(showPath)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}