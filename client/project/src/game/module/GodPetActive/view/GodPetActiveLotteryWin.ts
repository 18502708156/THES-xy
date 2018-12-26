class GodPetActiveLotteryWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GodPetActiveLotterySkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected item0: GodPetActiveLotteryIcon;
	protected item1: GodPetActiveLotteryIcon;
	protected item2: GodPetActiveLotteryIcon;
	protected item3: GodPetActiveLotteryIcon;
	protected item4: GodPetActiveLotteryIcon;
	protected item5: GodPetActiveLotteryIcon;
	protected item6: GodPetActiveLotteryIcon;
	protected item7: GodPetActiveLotteryIcon;
	protected item8: GodPetActiveLotteryIcon;
	protected item9: GodPetActiveLotteryIcon;
	protected labGain: eui.Label;
	protected consumeLabel: ConsumeLabel;
	protected btnLottery: eui.Button;
	protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	private mCurIdx: number
	private mMaxCount: number

	public constructor() {
		super()
		this.skinName = "GodPetActiveLotterySkin"
		this.commonWindowBg.SetTitle("降服神兽")
	}

	public childrenCreated() {
		this.list.itemRenderer = GodPetLotteryItem
		this.list.dataProvider = new eui.ArrayCollection([])
		this._AddClick(this.btnLottery, this._OnClicked)
		this._AddClick(this.labGain, this._OnClicked)
	}

	public OnOpen(...args) {
		this.commonWindowBg.OnAdded(this)
		this.observe(MessageDef.GODPETACTIVE_UPDATE_LOTTERY, this.ShowLotteryAni)
		this.observe(MessageDef.GODPETACTIVE_UPDATE_AWARDINFO, this.UpdateAwardList)
		this.observe(MessageDef.GODPETACTIVE_UPDATE_AWARDINFO, this.SetItemList)

		GameGlobal.GodPetActiveModel.SendGetAwardInfo()
		this.consumeLabel.mIsImg = true
		UIHelper.SetLinkStyleLabel(this.labGain)
		this.UpdateContent()
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClicked(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnLottery:
				let cost = GameGlobal.Config.BeastLotteryConfig.deplete[0]
				if (Checker.Data(cost))
					GameGlobal.GodPetActiveModel.SendLottery()
			break
			case this.labGain:
				ViewManager.ins().open(GodPetActiveTipWin)
			break
		}
		
	}

	public UpdateAwardList() {
		let datas = GameGlobal.GodPetActiveModel.GetAwardList()
		this.list.dataProvider = new eui.ArrayCollection(datas)
		this.list.validateNow()
	}

	private UpdateContent() {
		this.SetItemList()
		let cost = GameGlobal.Config.BeastLotteryConfig.deplete[0]
		this.consumeLabel.SetItem(cost.id, cost.count, GameGlobal.UserBag.GetCount(cost.id))
	}

	private SetItemList() {
		let configList = GameGlobal.Config.BeastLotteryConfig.showitem
		let idx = 0
		for (let itemData of configList)
		{
			if (this[`item${idx}`])
			{
				this[`item${idx}`].setItemAward(itemData)
			}
			idx++
		}
	}

	private ShowLotteryAni() {
		let cost = GameGlobal.Config.BeastLotteryConfig.deplete[0]
		this.consumeLabel.SetItem(cost.id, cost.count, GameGlobal.UserBag.GetCount(cost.id))

		this.mCurIdx = 1
		this.mMaxCount = GameGlobal.GodPetActiveModel.GetAwardIdx() + 10
		this.btnLottery.enabled = false
		this.AddTimer(200, this.mMaxCount+5, this._DoTimer)
	}

	private _DoTimer() {
		if (this.mCurIdx <= this.mMaxCount)
		{
			for (let idx=0; idx<10; idx++)
				this[`item${idx}`].showChoose(idx == (this.mCurIdx-1)%10)
		}

		this.mCurIdx ++
		if (this.mCurIdx > this.mMaxCount+5)
		{
			this.btnLottery.enabled = true
			ViewManager.ins().open(GodPetActiveResultPanel)
		}
	}
}

class GodPetLotteryItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // GodPetActiveLotteryItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected labText: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		let data: Sproto.holy_pet_msg = this.data
		let itemConfig = GlobalConfig.ins().ItemConfig[data.id]
		let color = ItemBase.QUALITY_COLOR[itemConfig.quality]
		let text = `|C:0xffe87c&T:${data.name} |C:0xffffff&T:获得 |C:${color}&T:${itemConfig.name}*1|`
		this.labText.textFlow = TextFlowMaker.generateTextFlow(text)
	}
}