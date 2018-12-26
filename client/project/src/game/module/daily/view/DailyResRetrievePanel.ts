class DailyResRetrievePanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "绑元找回"

    /////////////////////////////////////////////////////////////////////////////
    // DailyResRetrieveSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public mType: number

	public constructor() {
		super()
		this.skinName = "DailyResRetrieveSkin"
		this.mType = DailyConst.TASK_RETRIEVE_COST_BINDGOD
	}

	public childrenCreated() {
		this.list.itemRenderer = ResRetrieveItem
	}

	public OnOpen(...args) {
		this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.UpdateContent)
		
	}

	public OnClose() {
		
	}

	public UpdateContent() {
		GameGlobal.DailyModel.RecordResRetrieveFlag(this.mType, true)
		GameGlobal.DailyModel.mResRetrieveType = this.mType
		let resRetrieveList = GameGlobal.DailyModel.GetRetrieveResListByType(GameGlobal.DailyModel.mResRetrieveType)
		this.list.dataProvider = new eui.ArrayCollection(resRetrieveList)
	}
}

class ResRetrieveItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DailyResRetrieveItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected labText: eui.Label;
    protected item1: ItemBaseNotName;
    protected item2: ItemBaseNotName;
    protected item3: ItemBaseNotName;
    protected item4: ItemBaseNotName;
    protected btnRetrieve: eui.Button;
	protected priceIcon: PriceIcon;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.btnRetrieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRetrieveBtnClick, this)
	}

	public dataChanged() {
		let taskInfo = this.data
		let config = GameGlobal.Config.DailyProgressConfig[taskInfo.mTaskId]
		this.labText.text = `${config.name}（可找回${taskInfo.mCount}次）`

		let retrieveConfig = DailyConst.GetRetrieveConfig(taskInfo.mTaskId, GameGlobal.DailyModel.mResRetrieveType, DailyConst.TASK_RETRIEVE_TYPE_RES)
		this.priceIcon.type = retrieveConfig.cost[0].id
		this.priceIcon.price = retrieveConfig.cost[0].count
		let idx = 1
        for (let reward of retrieveConfig.res)
        {
            let itemName = `item${idx}`
			if (this[itemName])
			{
				this[itemName].visible = true
				this[itemName].setItemAward(reward.type, reward.id, reward.count)
			}

			idx++
        }
	}

	private _OnRetrieveBtnClick() {
		ViewManager.ins().open(DailyRetrievePopWin, this.data, GameGlobal.DailyModel.mResRetrieveType, DailyConst.TASK_RETRIEVE_TYPE_RES)
	}
	
}