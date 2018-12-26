class XianlvAllAttrPanel extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // XianlvAllAttrSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected levelAttr: eui.Label;
    protected zizhiAttr: eui.Label;
    protected powerLabel: PowerLabel;
		showPanel: PetShowPanel
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "XianlvAllAttrSkin"
	}

	public OnOpen() {
		let model = GameGlobal.XianlvModel
		this.powerLabel.text = model.GetAllPower()
		this.levelAttr.textFlow = AttributeData.GetAttrTabString(model.GetAllAttrs())
		this.zizhiAttr.textFlow = AttributeData.GetAttrTabString(model.GetAllQyAttr())
		this.commonDialog.OnAdded(this)
		let showId = 0
		for (let id of model.mBattleList) {
			if (id) {
				showId = id
				break
			}
		}
		for (let id in model.mXianlvList) {
			if (model.HasXianlv(parseInt(id))) {
				showId = parseInt(id)
				break
			}
		}
		if (showId) {
			this.showPanel.SetBody(XianlvConst.GetSkin(showId))
		}
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}