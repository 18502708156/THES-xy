class XianlvInactiveView  extends XianlvBaseInfoPanel {

    /////////////////////////////////////////////////////////////////////////////
    // XianlvInactiveSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected getwayLabel: GainLabel;
    protected needItemView: NeedItemView;
    protected actBtn: eui.Button;
	protected btnYuanfen: eui.Button;
    /////////////////////////////////////////////////////////////////////////////




	private m_XianlvId: number

	public constructor() {
		super()
		this.skinName = "XianlvInactiveSkin"
		this.baseView.currentState = "inactive"
		if (this.baseView.powerLabel["checkAttr"]) {
			this.baseView.powerLabel["checkAttr"].visible = false
		}
		this._AddClick(this.getwayLabel, this._OnClick)
		this._AddClick(this.actBtn, this._OnClick)
		this._AddClick(this.btnYuanfen, this._OnClick)
	}

	OnOpen() {
		this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true)
		UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.IsRedPoint())
	}

	OnClose() {

	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.getwayLabel: {
				// let config = GameGlobal.Config.partnerBiographyConfig[this.m_XianlvId]
				// UserWarn.ins().setBuyGoodsWarn(config.material.id) 
			} break
			case this.actBtn:
				let config = GameGlobal.Config.partnerBiographyConfig[this.m_XianlvId]
				if (config) {
					if (Checker.Data(config.material)) {
						GameGlobal.XianlvModel.SendActive(this.m_XianlvId)
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
		this.m_XianlvId = id
		let config = GameGlobal.Config.partnerBiographyConfig[id]
		this.needItemView.SetItemId(config.material.id, config.material.count)
		this.actBtn.visible = GameGlobal.UserBag.GetCount(config.material.id) >= config.material.count
		if (this.getwayLabel.visible = !this.actBtn.visible) {
			this.getwayLabel.SetId(config.material.id)
		}
	}

	public SetContext(context: XianlvMainPanel)	{
		this.mContext = context
	}
}

class XianlvinactiveSkillItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
    // XianlvSkillIconSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected iconBg: eui.Image;
    protected useTypeImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	dataChanged() {
		if (this.itemIndex == 0) {
			this.useTypeImg.visible = true 
		} else {
			this.useTypeImg.visible = false
		}
	}
}