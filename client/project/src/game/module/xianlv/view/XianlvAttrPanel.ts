class XianlvAttrPanel extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // XianlvAttrSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected levelAttr: eui.Label;
    protected powerLabel: PowerLabel;
    protected starGroup: eui.Group;
    protected lbLev: eui.Label;
	showPanel: PetShowPanel
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "XianlvAttrSkin"
	}

	public OnOpen(...param: any[]) {
		let xianlvId = param[0]
		let info = GameGlobal.XianlvModel.GetXianlvInfo(xianlvId)
		this.powerLabel.text = info.GetPower()
		this.levelAttr.textFlow = AttributeData.GetAttrTabString(info.GetAttrs())
		XianlvBaseInfoPanel.SetStarGroup(this.starGroup, info.mStar)
		this.commonDialog.OnAdded(this)
		this.lbLev.text = info.mLevel + "\n阶"
		this.showPanel.SetBody(XianlvConst.GetSkin(xianlvId))
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}