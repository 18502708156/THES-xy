class FormationDetailPanel  extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	
	/////////////////////////////////////////////////////////////////////////////
    // FormationDetailSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
	protected powerLabel: PowerLabel;
    protected levelAttr: eui.Label;
    protected soulAttr: eui.Label;
    protected medicineAttr: eui.Label;
    protected showPanel: PetShowPanel;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "FormationDetailSkin"
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "阵型详情"

		let formationId = param[0]
		let model = GameGlobal.FormationModel

		this.powerLabel.text = model.GetPower(formationId)
		this.showPanel.SetBody(FormationConst.GetSkin(formationId))
		this.levelAttr.textFlow = AttributeData.GetAttrTabString(model.GetCurAttr(formationId))
		this.medicineAttr.textFlow = AttributeData.GetAttrTabString(model.GetCurDrugAttr())
		this.soulAttr.textFlow = AttributeData.GetAttrTabString(model.GetCurSoulAttr(formationId))
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}