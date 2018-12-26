class DailyChargeGiftWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // DailyChargeGiftSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected list: eui.List;
	protected btnBuy: eui.Button;
	protected labChargeTip: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private readonly mActivityId: number = 28

	public constructor() {
		super()
		this.skinName = "DailyChargeGiftSkin"
		this._AddClick(this.btnBuy, this._OnClick)
	}

	public childrenCreated() {
		this.list.itemRenderer = ItemBaseNotName
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "每日豪礼"

		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)

		this.UpdateContent()
	}

	public UpdateContent() {
		let activityData: ActivityType28Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId) as ActivityType28Data;
		let index = activityData.runday
		let config = activityData.GetConfig()[index-1]
		this.list.dataProvider = new eui.ArrayCollection(config.gift)

		this.labChargeTip.text = `今日已充值：${activityData.recharge}元`
		if (activityData.record[index-1] == 4) {
			this.btnBuy.label = '已领取'
			this.btnBuy.enabled = false
			return
		}

		this.btnBuy.label = config.recharge > activityData.recharge ? "前往充值" : "领取奖励"
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		let activityData: ActivityType28Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId) as ActivityType28Data;
		let index = activityData.runday
		let config = activityData.GetConfig()[index-1]
		if (config.recharge > activityData.recharge) {
			RechargeWin.Open()
			this.CloseSelf()
			return
		}

		GameGlobal.ActivityKaiFuModel.sendReward(this.mActivityId, index)
	}
}