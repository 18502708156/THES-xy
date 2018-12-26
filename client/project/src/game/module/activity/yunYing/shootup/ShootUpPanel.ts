class ShootUpPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// ShootUpPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected dialogMask: eui.Component;
	protected imgIcon: eui.Image;
	protected titleImg: eui.Image;
	protected dialogCloseBtn: eui.Button;
	protected nameTxt: eui.Label;
	protected timeTxt: eui.Label;
	protected itemList: eui.List;
	protected chargeBtn: eui.Button;
	protected chargeTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	private _activityId: number = 10;

	private _index: number = 0;

	public constructor() {
		super()
		this.skinName = 'ShootUpPanelSkin';
	}

	public childrenCreated() {
		this.itemList.itemRenderer = ItemBaseNotName;
		this.itemList.dataProvider = null;
	}

	private onClick(e: egret.TouchEvent) {
		this.CloseSelf();
		if (this.chargeBtn.label == '充点小钱') {
			RechargeWin.Open();
		}
		else {
			GameGlobal.ActivityKaiFuModel.sendReward(this._activityId, this._index);
		}
	}


	public OnOpen(...param: any[]) {
		this.AddClick(this.dialogMask, this.CloseSelf);
		this.AddClick(this.dialogCloseBtn, this.CloseSelf);
		this.AddClick(this.chargeBtn, this.onClick);
		this.updateContent();
	}

	private updateContent() {
		let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType23Data;
		if (activityData) {
			UIHelper.ShowRedPoint(this.chargeBtn, activityData.hasReward());
			let config = activityData.GetConfig()[activityData.runday - 1];
			if (config) {
				this.itemList.dataProvider = new eui.ArrayCollection(config.item);
				this.titleImg.source = config.title;
				this.imgIcon.source = config.showitem;
				this.nameTxt.text = config.itemname + '';
				this._index = config.index;
				let rechargenum = GameGlobal.RechargeModel.dailyRechare;
				this.chargeTxt.text = '今日已充值：' + rechargenum + '元';
				this.chargeBtn.enabled = true;
				
				if (rechargenum >= config.cost) {
					
					if (activityData.record == 4) {
						this.chargeBtn.label = '已领取';
						this.chargeBtn.enabled = false;
					}
					else if (activityData.record == 3) {
						this.chargeBtn.label = '点击领取';
					}
				}
				else {
					this.chargeBtn.label = '充点小钱';
				}
			}
			TimerManager.ins().remove(this.updateTime, this);
			this.AddTimer(1000, 0, this.updateTime);
			this.updateTime();
		}
	}

	private updateTime(...param) {
		let date = new Date(GameServer.serverTimeMilli);
		let restTime = DateUtils.MS_PER_DAY - (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
		this.timeTxt.text = DateUtils.format_1(restTime);
	}
}