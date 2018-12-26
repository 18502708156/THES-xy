class QujingChooseWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // QujingChooseSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
	protected labTip: eui.Label;
	protected piRefresh: PriceIcon;
	protected btnRefresh: eui.Button;
	protected piOneKey: PriceIcon;
	protected btnOneKey: eui.Button;
	protected labCount: eui.Label;
	protected btnGoto: eui.Button;
	protected chooseItem1: QujingChooseItem;
	protected chooseItem2: QujingChooseItem;
	protected chooseItem3: QujingChooseItem;
	protected chooseItem4: QujingChooseItem;
	protected chooseItem5: QujingChooseItem;
    /////////////////////////////////////////////////////////////////////////////

	private mChooseQuality: number

	private mCurIdx: number
	private mMaxCount: number

	public constructor() {
		super()
		this.skinName = "QujingChooseSkin"
		this.commonWindowBg.SetTitle("取经东归")

		this._AddClick(this.btnRefresh, this._OnClick)
		this._AddClick(this.btnOneKey, this._OnClick)
		this._AddClick(this.btnGoto, this._OnClick)
		
	}

	public childrenCreated() {
		let baseInfo = GameGlobal.QujingModel.baseInfo
		this.mChooseQuality = baseInfo.mQuality

		let escortList = CommonUtils.GetArray(GameGlobal.Config.EscortAwardConfig, "id")
		let idx = 1
		for (let config of escortList)
		{
			let itemName = `chooseItem${idx}`
			if (this[itemName])
			{
				this[itemName].SetItemData(config)
			}

			idx ++
		}
	}

	public OnOpen(...args) {
		this.observe(MessageDef.QUJING_UPDATE_BASEINFO, this.UpdateList)
		this.commonWindowBg.OnAdded(this)

		this.UpdateContent()
	}

	public OnClose() {
		TimerManager.ins().remove(this._DoTimer, this)
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnGoto:
				GameGlobal.QujingModel.SendStartEscort()
				ViewManager.ins().close(this)
			break
			case this.btnOneKey:
				this.HandleOneKeyRefresh()
			break
			case this.btnRefresh:
				this.HandleRefresh()
			break
		}
	}

	private UpdateList() {
		this.RefreshOneKeyCost()
		
		let baseInfo = GameGlobal.QujingModel.baseInfo
		this.mCurIdx = 1
		this.mMaxCount = baseInfo.mQuality + 15 - this.mChooseQuality
		this.SetButtonState(true)
		this.AddTimer(100, this.mMaxCount, this._DoTimer)
	}

	private UpdateContent() {
		let baseInfo = GameGlobal.QujingModel.baseInfo
		let escortMaxCount = GameGlobal.Config.EscortBaseConfig.escortnum
		this.labCount.text = `${escortMaxCount - baseInfo.mEscortCount}/${escortMaxCount}`

		let maxConfig = GameGlobal.Config.EscortAwardConfig[5]
		let text = `|C:0x6e330b&T:护送|C:0xdb0000&T:${maxConfig.name}||C:0x6e330b&T:被拦截无损失(||C:0x019704&T:优先使用绑元||C:0x6e330b&T:)||`
		this.labTip.textFlow = TextFlowMaker.generateTextFlow(text)
		
		let oneKeyCost = GameGlobal.Config.EscortBaseConfig.aotucost
		this.piOneKey.type = oneKeyCost.id
		this.piOneKey.price = oneKeyCost.count

		this.RefreshOneKeyCost()
	}

	private RefreshOneKeyCost() {
		let refreshCost = GameGlobal.Config.EscortBaseConfig.refreshcost
		this.piRefresh.type = refreshCost.id
		this.piRefresh.price = refreshCost.count

		let itemCost = GameGlobal.Config.EscortBaseConfig.aotuitem
		if (GameGlobal.UserBag.GetCount(itemCost.id) >= itemCost.count)
		{
			this.piOneKey.type = itemCost.id
			this.piOneKey.price = itemCost.count
			return
		}
	}

	private _DoTimer() {
		this.mChooseQuality = this.mChooseQuality % 5 + 1
		this.chooseItem1.SetChooseState(this.mChooseQuality)
		this.chooseItem2.SetChooseState(this.mChooseQuality)
		this.chooseItem3.SetChooseState(this.mChooseQuality)
		this.chooseItem4.SetChooseState(this.mChooseQuality)
		this.chooseItem5.SetChooseState(this.mChooseQuality)

		this.mCurIdx ++
		if (this.mCurIdx >= this.mMaxCount)
		{
			this.SetButtonState(false)
		}
	}

	private SetButtonState(isGray)
	{
		this.btnGoto.enabled = !isGray
		this.btnOneKey.enabled = !isGray
		this.btnRefresh.enabled = !isGray

		this.btnGoto.filters = isGray ? Color.GetFilter() : null
		this.btnOneKey.filters = isGray ? Color.GetFilter() : null
		this.btnRefresh.filters = isGray ? Color.GetFilter() : null
	}

	private HandleRefresh() {
		if (GameGlobal.QujingModel.IsMaxQuality())
		{
			UserTips.ins().showTips("当前已是最高品质")
			return
		}

		let refreshCost = GameGlobal.Config.EscortBaseConfig.refreshcost
		if (Checker.Money(refreshCost.id, refreshCost.count))
			GameGlobal.QujingModel.SendRefreshQuality(QujingModel.REFRESH_TYPE_NORMAL)
	}

	private HandleOneKeyRefresh() {
		if (GameGlobal.QujingModel.IsMaxQuality())
		{
			UserTips.ins().showTips("当前已是最高品质")
			return
		}

		let itemCost = GameGlobal.Config.EscortBaseConfig.aotuitem
		if (GameGlobal.UserBag.GetCount(itemCost.id) >= itemCost.count)
		{
			GameGlobal.QujingModel.SendRefreshQuality(QujingModel.REFRESH_TYPE_ITEM)
			return
		}

		let oneKeyCost = GameGlobal.Config.EscortBaseConfig.aotucost
		if (Checker.Money(oneKeyCost.id, oneKeyCost.count))
			GameGlobal.QujingModel.SendRefreshQuality(QujingModel.REFRESH_TYPE_QUILK)
	}

}
