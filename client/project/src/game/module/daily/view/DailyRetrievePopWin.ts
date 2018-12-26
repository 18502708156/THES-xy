class DailyRetrievePopWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GangChangeNameSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected btnRetrieve: eui.Button;
	protected btnMinues: eui.Button;
	protected btnAdd: eui.Button;
	protected labNameTip: eui.Label;
	protected labCostTip: eui.Label;
	protected sliderRetrieve: eui.HSlider;
    /////////////////////////////////////////////////////////////////////////////

	private mTaskInfo: DailyTaskInfo
	private mCostType: number
	private mRetrieveType: number

	public constructor() {
		super()
		this.skinName = "DailyRetrieveCountSkin"
		this._AddClick(this.btnRetrieve, this._OnClick)
		this._AddClick(this.btnMinues, this._OnClick)
		this._AddClick(this.btnAdd, this._OnClick)

		this.sliderRetrieve.addEventListener(egret.Event.CHANGE, this._OnSliderChange, this)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.mTaskInfo = param[0]
		this.mCostType = param[1]
		this.mRetrieveType = param[2]

		this.commonDialog.title = this.mRetrieveType == DailyConst.TASK_RETRIEVE_TYPE_RES ? "找回资源" : "找回历练"
		let config = GameGlobal.Config.DailyProgressConfig[this.mTaskInfo.mTaskId]
		this.labNameTip.textFlow = TextFlowMaker.generateTextFlow(`|C:0x6e330b&T:${config.name} （可找回|C:0x019704&T:${this.mTaskInfo.mCount}|C:0x6e330b&T:次）|`)

		this.sliderRetrieve.maximum = this.mTaskInfo.mCount
		let retrieveConfig = DailyConst.GetRetrieveConfig(this.mTaskInfo.mTaskId, this.mCostType, this.mRetrieveType)
		let curNum = GameGlobal.actorModel.GetNum(retrieveConfig.cost[0].id)
		let canBuyNum = Math.floor(curNum / retrieveConfig.cost[0].count)
		this.sliderRetrieve.value = Math.min(this.mTaskInfo.mCount, canBuyNum)

		this.SetCostInfo()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _OnSliderChange() {
		this.SetCostInfo()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnRetrieve:
				let count = this.sliderRetrieve.value
				if (count > 0)
				{
					let retrieveConfig = DailyConst.GetRetrieveConfig(this.mTaskInfo.mTaskId, this.mCostType, this.mRetrieveType)
					if (Checker.Money(retrieveConfig.cost[0].id, retrieveConfig.cost[0].count * count))
						GameGlobal.DailyModel.SendRetrieve(this.mTaskInfo.mTaskId, this.mCostType, this.mRetrieveType, count)
				}
				ViewManager.ins().close(DailyRetrievePopWin)
			break
			case this.btnMinues:
				this.changeSlider(-1)
			break
			case this.btnAdd:
				this.changeSlider(1)
			break
		}
		
	}

	private SetCostInfo() {
		let count = this.sliderRetrieve.value
		let retrieveConfig = DailyConst.GetRetrieveConfig(this.mTaskInfo.mTaskId, this.mCostType, this.mRetrieveType)
		let costName = this.mCostType == DailyConst.TASK_RETRIEVE_COST_BINDGOD ? "绑定元宝" : "元宝"
		let text = `|C:0x6e330b&T:总价：|C:0x019704&T:${count * retrieveConfig.cost[0].count}|C:0x6e330b&T:${costName}（找回|C:0x019704&T:${count}|C:0x6e330b&T:次）|`
		this.labCostTip.textFlow = TextFlowMaker.generateTextFlow(text)
	}

	private changeSlider(delta) {
		let curCount = this.sliderRetrieve.value
		let count = Math.min(Math.max(curCount + delta, 0), this.mTaskInfo.mCount)
		this.sliderRetrieve.value = count
		this.SetCostInfo()
	}

}