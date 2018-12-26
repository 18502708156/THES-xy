class ForgeMasterTipPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
    /////////////////////////////////////////////////////////////////////////////
    // ForgeMasterTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected masterBtn: eui.Component;
    protected effName: eui.Label;
    protected activeLabel: eui.Label;
    protected curLabel: eui.Label;
    protected nextLabel: eui.Label;
    protected effLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ForgeMasterTipSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		let forgeType = param[0]

		let addPower = null
		let curLevel = ForgeViewHelper.UpdateMasterBtn(forgeType, this.masterBtn as ForgeMasterBtn)
		let config = GameGlobal.ForgeModel.GetMasterConfig(forgeType)
		if (curLevel) {
			let role = GameGlobal.SubRoles.GetRoleData()
			let [index, min] = role.GetMinEquipIndexAndLevel(forgeType)
			this.effName.text = "全身" + GameGlobal.ForgeModel.TYPE_TO_NAME[forgeType] + "+" + min.toString()
			this.curLabel.text = AttributeData.getAttStr(config[curLevel].attrs, 0)
			if (config[curLevel + 1]) {
				this.currentState = "active"
				this.nextLabel.text = AttributeData.getAttStr(config[curLevel + 1].attrs, 0)
				addPower = ItemConfig.CalcAttrScoreValue(config[curLevel + 1].attrs) - ItemConfig.CalcAttrScoreValue(config[curLevel].attrs)
			} else {
				this.currentState = "full"
			}
		} else {
			this.currentState = "none"
			this.nextLabel.text = AttributeData.getAttStr(config[1].attrs, 0)
			addPower = ItemConfig.CalcAttrScoreValue(config[1].attrs)
		}
		if (addPower != null) {
			this.effLabel.text = "可提升" + addPower + "战力"
		} else {
			this.effLabel.text = ""
		}
	}

	public OnClose() {

	}
}