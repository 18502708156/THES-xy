class DailyExpRetrieveWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // DailyExpRetrieveSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected list: eui.List;
	protected btnOneKey: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "DailyExpRetrieveSkin"
		this.commonWindowBg.SetTitle("历练找回")

		this._AddClick(this.btnOneKey, this._OnClick)		
	}

	public childrenCreated() {
		this.list.itemRenderer = ExpRetrieveItem
	}

	public OnOpen(...args) {
		this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.UpdateContent)
		this.commonWindowBg.OnAdded(this)

		this.UpdateContent()
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnOneKey:
				let cost = GameGlobal.DailyModel.GetRetrieveExpCost()
				WarnWin.show(`是否花费${cost.count}元宝找回${cost.exp}点历练经验`, () => {
					if (Checker.Money(cost.id, cost.count))
						GameGlobal.DailyModel.SendRetrieveExp()
				}, this)
				
			break
		}
	}

	private UpdateContent() {
		let expRetrieveList = GameGlobal.DailyModel.GetRetrieveExpList()
		this.list.dataProvider = new eui.ArrayCollection(expRetrieveList)

		this.btnOneKey.visible = expRetrieveList.length > 0
	}

}

class ExpRetrieveItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DailyExpRetrieveItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected imgBg: eui.Image;
	protected labName: eui.Label;
	protected labCount: eui.Label;
	protected labPerTip: eui.Label;
	protected labCost: eui.Label;
	protected btnRetrieve: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.btnRetrieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRetrieveBtnClick, this)
	}

	public dataChanged() {
		let taskInfo = this.data
		this.imgBg.visible = this.itemIndex % 2 == 0

		let config = GameGlobal.Config.DailyProgressConfig[taskInfo.mTaskId]
		this.labName.text = config.name
		this.labCount.text = `可找回${taskInfo.mCount}次`
		this.labPerTip.text = `${config.exp}点`

		let retrieveConfig = DailyConst.GetRetrieveConfig(this.data.mTaskId, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_EXP)
		let costId = retrieveConfig.cost[0].id
		let costName = GameGlobal.actorModel.GetCurrencyName(costId)
		this.labCost.text = `${retrieveConfig.cost[0].count}${costName}`
	}
	
	private _OnRetrieveBtnClick() {
		ViewManager.ins().open(DailyRetrievePopWin, this.data, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_EXP)
	}
}