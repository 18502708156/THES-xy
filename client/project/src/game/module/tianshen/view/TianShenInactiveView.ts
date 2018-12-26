class TianShenInactiveView extends TianShenBaseInfoPanel {

    /////////////////////////////////////////////////////////////////////////////
    // TianShenInactiveSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected getwayLabel: eui.Label;
    protected needItemView: NeedItemView;
    protected actBtn: eui.Button;
	protected btnYuanfen: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private m_TianShenId: number

	public constructor() {
		super()
		this.skinName = "TianShenInactiveSkin"
		this.baseView.currentState = "inactive"

		this._AddClick(this.getwayLabel, this._OnClick)
		this._AddClick(this.actBtn, this._OnClick)
		this._AddClick(this.btnYuanfen, this._OnClick)

		UIHelper.SetLinkStyleLabel(this.getwayLabel)
	}

	OnOpen() {
		this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true)
		UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.IsRedPoint())
	}

	OnClose() {

	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.getwayLabel:
				UserWarn.ins().setBuyGoodsWarn(this.needItemView.mItemId)
			break
			case this.actBtn:
				let config = GameGlobal.Config.AirMarshalListConfig[this.m_TianShenId]
				if (config) {
					if (Checker.Data(config.material)) {
						GameGlobal.TianShenModel.SendActive(this.m_TianShenId)
					}
				}
			break
			case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin)
                break
		}
	}

	public UpdateInfo(id: number) {
		super.UpdateInfo(id)
		this.m_TianShenId = id
		let config = GameGlobal.Config.AirMarshalListConfig[id]
		this.needItemView.SetItemId(config.material.id, config.material.count)
		this.actBtn.visible = GameGlobal.UserBag.GetCount(config.material.id) >= config.material.count
		this.getwayLabel.visible = !this.actBtn.visible
	}

	public SetContext(context: TianShenMainPanel)	{
		this.mContext = context;
	}
}