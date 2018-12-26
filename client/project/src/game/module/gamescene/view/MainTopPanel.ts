class MainTopPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_USER_INFO;

	/////////////////////////////////////////////////////////////////////////////
    // MainTopPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    public god: eui.Button;
    protected yb: eui.Button;
    public byb: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
	}
	public destoryView() { }


	initUI() {
		super.initUI()
		this.skinName = "MainTopPanelSkin";
		this.touchEnabled = false;

		this._AddClick(this.god, this.onClick)
		this._AddClick(this.yb, this.onClick)
		this._AddClick(this.byb, this.onClick)
	}

	initData() {
		this.updateData()
	}

	OnOpen(...param: any[]) {
		this.observe(MessageDef.GOLD_CHANGE, this.initData)
		this.observe(MessageDef.YB_CHANGE, this.initData)
		this.observe(MessageDef.BYB_CHANGE, this.initData)
		this.observe(MessageDef.postInitActorInfo, this.updateData)

		this.initData()
	}

	updateData() {
		this.god.label = CommonUtils.overLength(GameGlobal.actorModel.gold);
		if (GameGlobal.actorModel.yb >= 100000000) {
			this.yb.label = CommonUtils.overLength(GameGlobal.actorModel.yb);
		} else {
			this.yb.label = GameGlobal.actorModel.yb + "";
		}
		if (GameGlobal.actorModel.byb >= 100000000) {
			this.byb.label = CommonUtils.overLength(GameGlobal.actorModel.byb);
		} else {
			this.byb.label = GameGlobal.actorModel.byb + "";
		}
	}

	onClick(e) {
		switch (e.currentTarget) {
			case this.god:
				ViewManager.ins().open(ExchangeMoneyWin);
				break;
			case this.yb:
			    RechargeWin.Open();
				break;
			case this.byb:
				(<ShopGoodsWarn>ViewManager.ins().open(ShopGoodsWarn)).setData(MoneyConst.byb, 1);
				break;
		}
	};
}
