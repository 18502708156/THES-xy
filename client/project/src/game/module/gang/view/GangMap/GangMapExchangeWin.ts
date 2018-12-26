class GangMapExchangeWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GangMapExchangeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
	protected labCount: eui.Label;
	protected durationLab: DurationLabel;
	protected btnRefresh: eui.Button;
	protected priceicon: PriceIcon;
	protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GangMapExchangeSkin"

		this._AddClick(this.btnRefresh, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "帮会兑换"

		this.list.itemRenderer = GangMapExchangeItem
		this.list.dataProvider = new eui.ArrayCollection([])
		this.observe(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO, this.UpdateContent)

		GameGlobal.GangMapModel.SendGetExchange()

		let cost = GameGlobal.Config.GuildConfig.buycost
		this.priceicon.type = cost.id
		this.priceicon.price = cost.count
		this.durationLab.SetColor(0x019704)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private UpdateContent() {
		let gmExchange = GameGlobal.GangMapModel.gangMapExchangeInfo
		this.durationLab.SetCallbackFunc(() => {
			GameGlobal.GangMapModel.SendGetExchange()
		})
		
		this.durationLab.SetEndTime(gmExchange.mRefreshTime || 0, DurationLabel.TIMETEXT_TYPE_HHMMSS)
		this.labCount.text = `${GameGlobal.Config.GuildConfig.number - gmExchange.mRefreshCount}`

		let exchangeList = gmExchange.mExchangeList
		this.list.dataProvider = new eui.ArrayCollection(exchangeList)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnRefresh:
				let cost = GameGlobal.Config.GuildConfig.buycost
				WarnWin.show(`是否花费${cost.count}${GameGlobal.actorModel.GetCurrencyName(cost.id)}刷新？`, () => {
					Checker.Money(cost.id, cost.count, true, null, ()=>{
						GameGlobal.GangMapModel.SendRefreshExchange()
					})
				}, this)
			break
		}
		
	}
}


class GangMapExchangeItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// GangMapExchangItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected btnExchange: eui.Button;
	protected itemIcon: ItemBase;
	protected labMaterial1: eui.Label;
	protected labMaterial2: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	private mEnoughFlag: boolean = true

	public childrenCreated() {
		this.labMaterial1.text = ""
		this.labMaterial2.text = ""
		this.btnExchange.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClicked, this)
	}

	public dataChanged() {
		let exchangeItemId = this.data
		let config = GameGlobal.Config.GuildMapBuyConfig[exchangeItemId]
		this.itemIcon.setItemAward(config.icon.type, config.icon.id, config.icon.count)

		let materialInfo1 = config.cost[0]
		if (materialInfo1)
		{
			let name = GangMapConst.GetGangMapItemName(materialInfo1.id)
			let curNum = GameGlobal.GangMapModel.GetGangMapItemNum(materialInfo1.id)
			let color = curNum >= materialInfo1.count ? 0x019704 : 0xdb0000
			let text = `${name} |C:${color}&T:${curNum}/${materialInfo1.count}|`
			this.labMaterial1.textFlow = TextFlowMaker.generateTextFlow(text)

			this.mEnoughFlag = curNum < materialInfo1.count ? false : this.mEnoughFlag
		}

		let materialInfo2 = config.cost[1]
		if (materialInfo2)
		{
			let name = GangMapConst.GetGangMapItemName(materialInfo2.id)
			let curNum = GameGlobal.GangMapModel.GetGangMapItemNum(materialInfo2.id)
			let color = curNum >= materialInfo1.count ? 0x019704 : 0xdb0000
			let text = `${name} |C:${color}&T:${curNum}/${materialInfo2.count}|`
			this.labMaterial2.textFlow = TextFlowMaker.generateTextFlow(text)

			this.mEnoughFlag = curNum < materialInfo2.count ? false : this.mEnoughFlag
		}

		this.btnExchange.filters = GameGlobal.GangMapModel.HasExchangeItem(exchangeItemId) ? Color.GetFilter() : null
	}

	private _OnBtnClicked(e: egret.TouchEvent) {
		if (!this.mEnoughFlag)
		{
			UserTips.ins().showTips("物品不足")
			return
		}
		GameGlobal.GangMapModel.SendExchange(this.data)
	}
}