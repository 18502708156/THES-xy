class ForgeWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Main
    /////////////////////////////////////////////////////////////////////////////
    // ForgeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected viewStack: TabView;
    public equipComp: ForgeEquipList;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ForgeSkin"
	}

	public childrenCreated() {
		ForgeViewHelper.InitItemGroup(this.equipComp)
		let args = {mContext: this, equipComp: this.equipComp}
		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(ForgeqhPanel, args),
			TabView.CreateTabViewData(ForgejlPanel, args),
			TabView.CreateTabViewData(ForgedlPanel, args),
			TabView.CreateTabViewData(ForgeGemPanel, args),
		]
		this.commonWindowBg.SetViewStack(this.viewStack)

		this._AddClick(this.equipComp.getwayLabel, this._OnClick)
		this._AddClick(this.equipComp.onKeyBtn, this._OnClick)
		this._AddClick(this.equipComp.masterBtn, this._OnClick)
	}

	OnOpen(...args: any[]) {
		this.commonWindowBg.OnAdded(this, args.length ? args[0] : 0);
		this.observe(MessageDef.FORGE_UPDATE, this.UpdateForge)
		this.observe(MessageDef.RP_FORGE, this.UpdateRedPoint)
		this.UpdateRedPoint()
	}

	OnClose() {
		MainBottomPanel.CloseNav(this)
	}

	private _OnClick(e: egret.TouchEvent) {
		let forgePanel = this.commonWindowBg.GetCurViewStackElement() as ForgePanel
		switch (e.currentTarget) {
			case this.equipComp.onKeyBtn:
				if (forgePanel.CheckUpgrade()) {
					forgePanel.SendUpgrade()
				}else{
					if(forgePanel.mForgeType===ForgeType.BOOST)
					{
						// UserTips.ins().showTips("调到兑换界面,待完成")
					}
					else
					{
						let data = forgePanel.GetConsumeValue()
						if (data) {
							UserWarn.ins().setBuyGoodsWarn(data.id)
						}
					}

				}
			break
			case this.equipComp.masterBtn:
				ViewManager.ins().open(ForgeMasterTipPanel, forgePanel.mForgeType)
			break
			case this.equipComp.getwayLabel:
				UserWarn.ins().BuyGoodsWarn(this.equipComp.consumeLabel.consumeItemId)
			break
		}
	}

	private UpdateForge(forgeType: ForgeType) {
		let forgePanel = this.commonWindowBg.GetCurViewStackElement() as ForgePanel
		if (forgeType == forgePanel.mForgeType) {
			forgePanel.UpdateForge()
		}
	}

	private UpdateRedPoint() {
		this.mCommonWindowBg.CheckTalRedPoint(0)
		this.mCommonWindowBg.CheckTalRedPoint(1)
		this.mCommonWindowBg.CheckTalRedPoint(2)
		this.mCommonWindowBg.CheckTalRedPoint(3)
	}

	// private _AutoUpgrade() {
	// 	let forgePanel = this.commonWindowBg.GetCurViewStackElement() as ForgePanel
	// 	if (forgePanel.CheckUpgrade()) {
	// 		forgePanel.SendUpgrade()
	// 	} else {
	// 		TimerManager.ins().remove(this._AutoUpgrade, this)
	// 	}
	// }
}