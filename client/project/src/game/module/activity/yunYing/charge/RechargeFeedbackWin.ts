class RechargeFeedbackWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // RechargeFeedbackSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected list: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected itemList: eui.List;
	protected btnBuy: eui.Button;
	protected labCharge: eui.Label;
	protected duration: DurationLabel;
    /////////////////////////////////////////////////////////////////////////////

	private readonly mActivityId: number = 29
	private mCurIdx: number = 0

	private mListLRBtnCtrl: ListLRBtnCtrl

	public constructor() {
		super()
		this.skinName = "RechargeFeedbackSkin"
		this.commonWindowBg.SetTitle("累充回馈")

		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 140)
	}

	public childrenCreated() {
		this.itemList.itemRenderer = ItemBaseNotName
		this.list.itemRenderer = RechargeFeedbackItem
		this.itemList.dataProvider = new eui.ArrayCollection([])
		this.list.dataProvider = new eui.ArrayCollection([])

		this._AddClick(this.btnBuy, this._OnClicked)
		this._AddItemClick(this.list, this._OnItemTap)
	}

	public OnOpen(...args) {
		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
		this.commonWindowBg.OnAdded(this)

		let activityData: ActivityType7Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId) as ActivityType7Data;
		let config = activityData.GetConfig()
		this.list.dataProvider = new eui.ArrayCollection(config)
		this.list.selectedIndex = 0

		this.UpdateContent()
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}


	private UpdateContent() {
		UIHelper.ListRefresh(this.list)
		this.UpdateBtnRedPoint()

		let activityData: ActivityType7Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId) as ActivityType7Data;
		this.labCharge.text = `${activityData.recharge}元`
		this.duration.SetColor(0x019704)
		this.duration.SetEndTime(activityData.endTime, DurationLabel.TIMETEXT_TYPE_DDHH_HHMMSS)
		let config = activityData.GetConfig()[this.mCurIdx]
		this.itemList.dataProvider = new eui.ArrayCollection(config.rewards)
		this.btnBuy.enabled = activityData.record[this.mCurIdx] != 4
		if (activityData.record[this.mCurIdx] == 4) {
			this.btnBuy.label = "已领取"
			return
		}

		this.btnBuy.label = activityData.recharge >= config.value ? "领取奖励" : "前往充值"
	}

	public _OnItemTap(e: eui.ItemTapEvent) {
		this.mCurIdx = e.itemIndex
		this.UpdateContent()
	}

	private _OnClicked() {
		let activityData: ActivityType7Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId) as ActivityType7Data;
		let config = activityData.GetConfig()[this.mCurIdx]
		if (activityData.recharge >= config.value) {
			GameGlobal.ActivityKaiFuModel.sendReward(this.mActivityId, config.index)
			return
		}

		RechargeWin.Open()
	}

	private UpdateBtnRedPoint() {
		let activityData: ActivityType7Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId) as ActivityType7Data;
		let configList = activityData.GetConfig()

		let list = []
		for (let config of configList) {
			list.push(activityData.canGetRecordByIndex(config.index))
		}
		
		this.mListLRBtnCtrl.SetRedPointList(list)
		this.mListLRBtnCtrl.OnRefresh()
	}
}

class RechargeFeedbackItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // RechargeFeedbackItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected redPoint: eui.Image;
	protected labDesc: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		let config = this.data
		this.labDesc.text = config.des.replace("%s", `${config.value}`)
		
		let activityData: ActivityType7Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(29) as ActivityType7Data;
		this.redPoint.visible = activityData.canGetRecordByIndex(config.index)
	}
	
}