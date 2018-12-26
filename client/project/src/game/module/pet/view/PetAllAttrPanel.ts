class PetAllAttrPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // PetAllAttrSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected levelAttr: eui.Label;
    protected zizhiAttr: eui.Label;
    protected feisAttr: eui.Label;
    protected powerLabel: PowerLabel;
	protected showPanel: PetShowPanel
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "PetAllAttrSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)

		this.levelAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.PetModel.GetAllAttrs())
		this.zizhiAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.PetModel.GetAllZizhiAttrs())
		this.feisAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.PetModel.GetAllFeisAttrs())
		this.powerLabel.text = GameGlobal.PetModel.GetAllPower()

		this.showPanel.SetBody(PetConst.GetSkin(GameGlobal.PetModel.GetShowId()))
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}