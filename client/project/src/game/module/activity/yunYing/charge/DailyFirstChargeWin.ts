class DailyFirstChargeWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// DailyFirstChargeSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected dialogMask: eui.Component;
	protected dialogCloseBtn: eui.Button;
	protected itemList: eui.List;
	protected chargeBtn: eui.Button;
	protected chargeTxt: eui.Label;
	protected tabBar: eui.TabBar;
	/////////////////////////////////////////////////////////////////////////////

	public static list: any[] = [];

	public constructor() {
		super()
		this.skinName = 'DailyFirstChargeSkin';
	}

	public childrenCreated() {
		this.itemList.itemRenderer = ItemBaseNotName;
		this.itemList.dataProvider = null;

		// let openDay = GameServer.serverOpenDay;
		// let len = CommonUtils.getObjectLength(GameGlobal.Config.DailyrechargeConfig);
		// let index = 0 == openDay % len ? len : openDay % len;
		let index = GameGlobal.RechargeModel.dailyId;
		let config = GameGlobal.Config.DailyrechargeConfig[index];
		let labels = [];
		DailyFirstChargeWin.list = [];
		if (config) {
			for (let id in config) {
				labels.push(1 == config[id].recharge ? '充任意金额' : '充' + config[id].recharge + '元');
				DailyFirstChargeWin.list.push(config[id]);
			}
			this.tabBar.dataProvider = new eui.ArrayCollection(labels);
			this.tabBar.itemRenderer = BtnTab4Item;
			this.tabBar.selectedIndex = 0;
		}
	}

	private onClick(e: egret.TouchEvent) {
		if (this.chargeBtn.label == '充点小钱') {
			this.CloseSelf();
			RechargeWin.Open();
		}
		else {
			GameGlobal.RechargeModel.sendRechargeDailyReward(this.tabBar.selectedIndex + 1);
		}
	}

	private onItemClick(e: egret.TouchEvent) {
		this.updateContent();
	}

	public OnOpen(...param: any[]) {
		this.AddClick(this.dialogMask, this.CloseSelf);
		this.AddClick(this.dialogCloseBtn, this.CloseSelf);
		this.AddClick(this.chargeBtn, this.onClick);
		this.AddItemClick(this.tabBar, this.onItemClick);
		this.observe(MessageDef.RECHARGE_DAILY_UPDATE, this.updateContent);
		this.updateContent();
	}

	private updateContent() {
		UIHelper.ListRefresh(this.tabBar);
		this.itemList.dataProvider = new eui.ArrayCollection(DailyFirstChargeWin.list[this.tabBar.selectedIndex].reward);
		let rechargenum = GameGlobal.RechargeModel.dailyRechare;
		this.chargeTxt.text = '今日已充值' + rechargenum + '元';
		let isReward = GameGlobal.RechargeModel.dailyReward;
		UIHelper.ShowRedPoint(this.chargeBtn, false);
		if (BitUtil.Has(isReward, this.tabBar.selectedIndex)) {
			this.chargeBtn.label = '已领取';
			this.chargeBtn.enabled = false;
		}
		else {
			this.chargeBtn.enabled = true;
			if (rechargenum >= DailyFirstChargeWin.list[this.tabBar.selectedIndex].recharge) {
				this.chargeBtn.label = '领 取';
				UIHelper.ShowRedPoint(this.chargeBtn, true);
			}
			else {
				this.chargeBtn.label = '充点小钱';
			}
		}
	}
}
class BtnTab4Item extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// BtnTab4Skin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected redPoint: eui.Image;
	protected labelDisplay: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		super.dataChanged();
		let isReward = GameGlobal.RechargeModel.dailyReward;
		let rechargenum = GameGlobal.RechargeModel.dailyRechare;
		if (rechargenum >= DailyFirstChargeWin.list[this.itemIndex].recharge) {
			this.redPoint.visible = !BitUtil.Has(isReward, this.itemIndex);
		}
	}

}