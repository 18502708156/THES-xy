class ActivityRewardShowWin extends BaseEuiView {
	
	public static NAME = "奖励预览"
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
	public mType: number

	public static Open(type) {
		ViewManager.ins().open(ActivityRewardShowWin, 0, type)
	}

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	public OnOpen(...args) {
		var index = args[0];
		this.mType = args[1]

		let list = [
			TabView.CreateTabViewData(ActivityRewardPanel, {mContext: this}),
			TabView.CreateTabViewData(ActivityRankRewardPanel, {mContext: this}),
		]

		if (this.mType == ActivityModel.TYPE_GANG_BATTLE) {
			list.push(TabView.CreateTabViewData(ActivityDragonRankPanel, {mContext: this}))
		}
		this.mCommonWindowBg.SetTabView(list)
		this.mCommonWindowBg.OnAdded(this, index)	
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}

	public GetAwardList(idx) {
		if (idx == 0)
			return ActivityRewardShowConst.GetAwardListByActivityType(this.mType)

		if (idx == 1)
			return ActivityRewardShowConst.GetRankAwardListByActivityType(this.mType)

		if (idx == 2)
			return ActivityRewardShowConst.GetDragonRankAwardListByActivityType(this.mType)
	}

	public GetImgSource() {
		return ActivityRewardShowConst.GetImageSourceByActivityType(this.mType)
	}
}