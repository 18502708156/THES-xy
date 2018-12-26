class FormationAllAttrPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // FormationAllAttrSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected labLevelAttr: eui.Label;
    protected labSoulAttr: eui.Label;
    protected labDrugAttr: eui.Label;
    protected powerLabel: PowerLabel;
	protected showPanel: PetShowPanel
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "FormationAllAttrSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)

		this.labLevelAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.FormationModel.GetAllAttr())
		this.labSoulAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.FormationModel.GetAllSoulAttr())
		this.labDrugAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.FormationModel.GetCurDrugAttr())
		this.powerLabel.text = GameGlobal.FormationModel.GetAllPower()

		this.showPanel.SetBody(FormationConst.GetSkin(GameGlobal.FormationModel.usedFomationId))
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}