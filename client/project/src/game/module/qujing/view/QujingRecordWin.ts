class QujingRecordWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // QujingRecordListSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "QujingRecordListSkin"
		this.commonWindowBg.SetTitle("被劫记录")
	}

	public childrenCreated() {
		this.list.itemRenderer = QujingRecordItem
		this.UpdateContent()
	}

	public OnOpen(...args) {
		this.observe(MessageDef.QUJING_UPDATE_RECORD, this.UpdateContent)
		this.commonWindowBg.OnAdded(this)
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}


	private UpdateContent() {
		let recordList = GameGlobal.QujingModel.recordList
		this.list.dataProvider = new eui.ArrayCollection(recordList)
		GameGlobal.QujingModel.RecordRobbedFlag(false)
	}

}

class QujingRecordItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // QujingRecordListItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected labTip: eui.Label;
	protected list: eui.List;
	protected btnRevenge: eui.Button;
	protected labRevenge: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.list.itemRenderer = ItemBaseNotName
		this.btnRevenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
		let record = this.data
		this.btnRevenge.name = record.mRecordId
		let config = this.GetConfigByQuality(record.mQuality)
		let color = ItemBase.GetColorByQuality(record.mQuality-1)
		let text = `|C:0x6e330b&T:当前|C:0x019704&T:战力为${record.mPower}||C:0x6e330b&T:的||C:0x1048ff&T:${record.mPlayerName}||C:0x6e330b&T:抢夺了我的||C:${color}&T:${config.name}||`
		this.labTip.textFlow = TextFlowMaker.generateTextFlow(text)

		this.labRevenge.visible = record.mOperFlag
		this.btnRevenge.visible = !record.mOperFlag
		this.labRevenge.text = record.mWinFlag ? "复仇成功" : "复仇失败"
		this.labRevenge.textColor = record.mWinFlag ? 0x019704 : 0xdb0000

		this.list.dataProvider = new eui.ArrayCollection(config.revengeaward)
	}

	private _OnBtnClick(e: egret.TouchEvent) {
		let recordId = parseInt(e.currentTarget.name)
		
		ViewManager.ins().open(QujingRevengeWin, recordId, QujingModel.ESCORT_FIGHT_TYPE_REVENGE)
	}

	private GetConfigByQuality(quality) {
		for (let key in GameGlobal.Config.EscortAwardConfig)
		{
			let config = GameGlobal.Config.EscortAwardConfig[key]
			if (config.quality == quality)
				return config
		}
	}
	
}