class TheFirstPlayerTipWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // TheFirstPlayerTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected itemNormal: ItemBaseNotName;
	protected itemCost: ItemBaseNotName;
	protected price: PriceIcon;
	protected btnNormal: eui.Button;
	protected btnCost: eui.Button;
	protected imgNormal: eui.Image;
	protected imgCost: eui.Image;
	protected powerLabel: PowerLabel;
	protected labName: eui.Label;
	protected labCharm: eui.Label;
	protected roleShowPanel: RoleShowPanel;
	protected btnHelp: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TheFirstPlayerTipSkin"

		this._AddClick(this.btnNormal, this._OnClick)
		this._AddClick(this.btnCost, this._OnClick)
		this._AddClick(this.btnHelp, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "战力第一"

		let cost = GameGlobal.Config.CityBaseConfig.goldworship
		this.price.type = cost.id
		this.price.price = cost.count
		this.btnCost.label = `${GameGlobal.actorModel.GetCurrencyName(cost.id)}膜拜`
		
		this.observe(MessageDef.MAIN_CITY_INFO, this.UpdateContent)
		this.observe(MessageDef.PALYER_INFO, this.UpdatePlayerInfo)

		let info = GameGlobal.CommonRaidModel.mMainCityInfo
        if (!info) 
			return

		GameGlobal.PlayerInfoModel.sendOtherId(info.championid)

		let normalItem = GameGlobal.Config.CityBaseConfig.worshipreward
		this.itemNormal.setItemAward(normalItem.type, normalItem.id, normalItem.count)

		let costItem = GameGlobal.Config.CityBaseConfig.goldworshipreward
		this.itemCost.setItemAward(costItem.type, costItem.id, costItem.count)

		this.UpdateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private UpdateContent() {
		let info = GameGlobal.CommonRaidModel.mMainCityInfo
        if (!info) 
			return

		this.labCharm.text = `${info.charismaNum}`
		this.btnNormal.visible = info.worship == 0
		this.btnCost.visible = info.worship == 0
		this.imgNormal.visible = info.worship == 1
		this.imgCost.visible = info.worship == 2
	}

	private UpdatePlayerInfo(playerInfo: Sproto.sc_show_other_player_request) {
		this.labName.text = `${playerInfo.name}`
		this.powerLabel.text = playerInfo.power
		playerInfo.shows[RoleShowDataType.ROLE_TITLE] = 1902
		this.roleShowPanel.SetShowImage(playerInfo)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnCost:
				let cost = GameGlobal.Config.CityBaseConfig.goldworship
				WarnWin.show(`是否花费${cost.count}${GameGlobal.actorModel.GetCurrencyName(cost.id)}膜拜？`, () => {
					Checker.Money(cost.id, cost.count, true, null, ()=>{
						GameGlobal.CommonRaidModel.SendWorship(2)
					})
				}, this)
			break
			case this.btnNormal:
				GameGlobal.CommonRaidModel.SendWorship(1)
			break
			case this.btnHelp:
				ViewManager.ins().open(ActivityDescPanel, 26, "规则说明")
			break
		}
		
	}
}
