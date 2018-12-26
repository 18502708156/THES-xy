class HouseBuildTipWin  extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	
	/////////////////////////////////////////////////////////////////////////////
    // HouseBuildTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
	protected consumeLabel: ConsumeTwoLabel;
	protected labPower: eui.Label;
	protected item1: ItemBaseNotName;
	protected item2: ItemBaseNotName;
	protected btnConfirm: eui.Button;
	protected btnCancel: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private mGrade: number

	public constructor() {
		super()
		this.skinName = "HouseBuildTipSkin"
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "房屋装修"

		this.observe(MessageDef.HOUSE_UPDATE_SINGLE, this.CloseSelf)

		this._AddClick(this.btnConfirm, this._OnClick)
		this._AddClick(this.btnCancel, this.CloseSelf)

		this.mGrade = param[0]
		let config = HouseConst.GetHouseShowConfig(this.mGrade)
		this.consumeLabel.Set([GameGlobal.YingYuanModel.GetBuildCost(config.house)])
		
		let [houseLv, houseUpnum] = GameGlobal.YingYuanModel.GetHouseLv()
		let power = HouseConst.GetPower(config.house, houseLv, houseUpnum) - GameGlobal.YingYuanModel.GetPower()
		this.labPower.text = power.toString()

		let itemInfo1 = config.id[0]
		this.item1.visible = itemInfo1 != null
		if (itemInfo1)
		{
			this.item1.setItemAward(itemInfo1.type, itemInfo1.id, itemInfo1.count)
		}
		
		let itemInfo2 = config.id[1]
		this.item2.visible = itemInfo2 != null
		if (itemInfo2)
		{
			this.item2.setItemAward(itemInfo2.type, itemInfo2.id, itemInfo2.count)
		}
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _OnClick() {
		let cost = GameGlobal.YingYuanModel.GetBuildCost(this.mGrade)
		Checker.Money(cost.id, cost.count, true, null, () => {
			GameGlobal.YingYuanModel.SendHouseBuild(this.mGrade)
		})
		this.CloseSelf()
	}
}