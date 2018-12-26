class HavingTipsPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// HavingTipsSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commondialog: CommonDialog
	protected btn: eui.Button;
	protected list: eui.List;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "HavingTipsSkin"
		this.commondialog.title = "V9玄女出战"
	}

	public childrenCreated() {
		this.commondialog.OnAdded(this);
		this._AddClick(this.btn, this.tap);
		this.list.itemRenderer = ItemBaseNotName
		let item = CommonUtils.GetArray(GameGlobal.Config.VipConfig[9].treward)
		this.list.dataProvider = new eui.ArrayCollection(item);
	}

	OnOpen(...param: any[]) {
		this.observe(MessageDef.VIP_LEVEL_CHANGE, this.updateContent)
		GameGlobal.RechargeModel.xuanNvCard = false;
		this.updateContent();
	}
	updateContent() {
		this.btn.label = "提升VIP"
		if (UserVip.ins().lv >= 9)
			this.btn.label = "领取奖励"
	}
	private tap() {
		if (this.btn.label == "提升VIP")
			GameGlobal.RechargeModel.sendRecharge(6);
		else {
			UserVip.ins().sendXuanNvAwards(9);
			ViewManager.ins().close(HavingTipsPanel);
		}
	}
}