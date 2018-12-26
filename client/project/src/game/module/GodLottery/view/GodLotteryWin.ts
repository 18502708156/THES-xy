class GodLotteryWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GodLotterySkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected btnGoldOne: eui.Button;
	protected btnGoldTen: eui.Button;
	protected btnBindGoldTen: eui.Button;
	protected piGoldOne: PriceIcon;
	protected piBindGoldTen: PriceIcon;
	protected piGoldTen: PriceIcon;
	protected groupFirst: eui.Group;
	protected firstItem: ItemBaseNotName;
	protected labDesc2: eui.Label;
	protected labDesc1: eui.Label;
	protected btnShop: eui.Button;
	protected item0: ItemBaseNotName;
	protected item1: ItemBaseNotName;
	protected item2: ItemBaseNotName;
	protected item3: ItemBaseNotName;
	protected item4: ItemBaseNotName;
	protected item5: ItemBaseNotName;
	protected item6: ItemBaseNotName;
	protected item7: ItemBaseNotName;
	protected item8: ItemBaseNotName;
	protected item9: ItemBaseNotName;
	protected item10: ItemBaseNotName;
	protected item11: ItemBaseNotName;
	protected item12: ItemBaseNotName;
	protected labName0: eui.Label;
	protected labName1: eui.Label;
	protected labName2: eui.Label;
	protected labName3: eui.Label;
	protected labName4: eui.Label;
	protected labName5: eui.Label;
	protected labName6: eui.Label;
	protected labName7: eui.Label;
	protected labName8: eui.Label;
	protected labName9: eui.Label;
	protected labName10: eui.Label;
	protected labName11: eui.Label;
	protected labName12: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private mCurIdx: number
	private mMaxCount: number

	public constructor() {
		super()
		this.skinName = "GodLotterySkin"
		this.commonWindowBg.SetTitle("天神降临")
	}

	public childrenCreated() {
		this._AddClick(this.btnGoldOne, this._OnClicked)
		this._AddClick(this.btnGoldTen, this._OnClicked)
		this._AddClick(this.btnBindGoldTen, this._OnClicked)
		this._AddClick(this.btnShop, this._OnClicked)
	}

	public OnOpen(...args) {
		this.commonWindowBg.OnAdded(this)
		this.observe(MessageDef.GODLOTTERY_UPDATE_LOTTERY, this.ShowLotteryAni)
		this.observe(MessageDef.GODLOTTERY_UPDATE_INFO, this.UpdateContent)

		GameGlobal.TreasureHuntModel.SendGetInfo()
		let bindGoldTenCost = GodLotteryConst.GetCost(GodLotteryConst.TYPE_BINDGOLD_TEN)
		this.piBindGoldTen.type = bindGoldTenCost.id
		this.piBindGoldTen.price = bindGoldTenCost.count

		let goldOneCost = GodLotteryConst.GetCost(GodLotteryConst.TYPE_GOLD_ONE)
		this.piGoldOne.type = goldOneCost.id
		this.piGoldOne.price = goldOneCost.count

		let goldTenCost = GodLotteryConst.GetCost(GodLotteryConst.TYPE_GOLD_TEN)
		this.piGoldTen.type = goldTenCost.id
		this.piGoldTen.price = goldTenCost.count

		this.SetShowList()
		this.UpdateContent()
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClicked(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnGoldOne:
				this.Lottery(GodLotteryConst.TYPE_GOLD_ONE)
			break
			case this.btnGoldTen:
				this.Lottery(GodLotteryConst.TYPE_GOLD_TEN)
			break
			case this.btnBindGoldTen:
				this.Lottery(GodLotteryConst.TYPE_BINDGOLD_TEN)
			break
			case this.btnShop:

			break
		}
		
	}

	private Lottery(type) {
		let cost = GodLotteryConst.GetCost(type)
		Checker.Currency(cost, true, null, () => {
			GameGlobal.GodLotteryModel.SendLottery(type)
		})
	}

	private UpdateContent() {
		let lotteryCount = GameGlobal.GodLotteryModel.lotteryCount
		let [num, nextSpecialAward] = GodLotteryConst.GetNextSpecailAward(lotteryCount)
		this.groupFirst.visible = nextSpecialAward != null
		if (nextSpecialAward)
		{
			this.firstItem.setItemAward(nextSpecialAward.type, nextSpecialAward.id, nextSpecialAward.count)
			this.labDesc1.textFlow = TextFlowMaker.generateTextFlow(`再抽|C:0x019704&T:${num-lotteryCount}|次`)
			let [nameTxt, color] = this.GetItemName(nextSpecialAward.id)
			let text = `|C:0x6e330b&T:必得 |C:${color}&T:${nameTxt}*${nextSpecialAward.count}|`
			this.labDesc2.textFlow = TextFlowMaker.generateTextFlow(text)
		}
	}

	private SetShowList() {
		let configList = GameGlobal.Config.TianShenLuckBaseConfig.showitem
		let idx = 0
		for (let itemData of configList)
		{
			if (this[`item${idx}`])
				this[`item${idx}`].setItemAward(itemData.type, itemData.id, itemData.count)

			if (this[`labName${idx}`])
			{
				let [nameTxt, color] = this.GetItemName(itemData.id)
				this[`labName${idx}`].text = nameTxt
				this[`labName${idx}`].textColor = color
			}
			idx++
		}
	}

	private ShowLotteryAni() {
		this.mCurIdx = 1
		this.mMaxCount = 13
		this.btnGoldOne.enabled = false
		this.btnGoldTen.enabled = false
		this.btnBindGoldTen.enabled = false

		this.shuffleList()
		this.AddTimer(50, this.mMaxCount+1, this._DoTimer)
	}

	private _DoTimer() {
		for (let idx=0; idx<13; idx++)
		{
			let itemIdx = this.mIdxList[this.mCurIdx-1] || 99
			this[`item${idx}`].imgChoose.visible = idx == itemIdx
		}

		this.mCurIdx ++
		if (this.mCurIdx > this.mMaxCount)
		{
			this.btnGoldOne.enabled = true
			this.btnGoldTen.enabled = true
			this.btnBindGoldTen.enabled = true
			ViewManager.ins().open(GodLotteryResultPanel)
		}
	}

	private GetItemName(id) {
		let itemConfig = GlobalConfig.ins().ItemConfig[id]
		if (!itemConfig)
			return ["" , ItemBase.QUALITY_COLOR[0]]

		return [itemConfig.name, ItemBase.QUALITY_COLOR[itemConfig.quality]]
	}

	private mIdxList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

	private shuffleList() {
		for (let idx=0; idx<this.mIdxList.length; ++idx)
		{
			let swapIdx = MathUtils.limitInteger(idx+1, this.mIdxList.length-1)
			let temp = this.mIdxList[swapIdx]
			this.mIdxList[swapIdx] = this.mIdxList[idx]
			this.mIdxList[idx] = temp
		}
	}
}
