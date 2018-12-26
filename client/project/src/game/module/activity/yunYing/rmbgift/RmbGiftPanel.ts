class RmbGiftPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// RmbGiftPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected dialogMask: eui.Component;
	protected showImg: eui.Image;
	protected rideShowPanel: RideShowPanel;
	protected roleShowPanel: RoleShowPanel;
	protected power: eui.BitmapLabel;
	protected titleLabel: eui.BitmapLabel;
	protected dialogCloseBtn: eui.Button;
	protected timeTxt: eui.Label;
	protected titleImg: eui.Image;
	protected itemList: eui.List;
	protected chargeBtn: eui.Button;
	protected nameTxt: eui.Label;
	protected valueTxt: eui.Label;
	protected nextGroup: eui.Group;
	protected nextShowImg: eui.Image;
	protected nextRideShowPanel: RideShowPanel;
	protected nextRoleShowPanel: RoleShowPanel;
	protected labNextPower: eui.Label;
	protected labTip: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	private _activityId: number = 9;
	private _rechargeId = 0;

	public constructor() {
		super()
		this.skinName = 'RmbGiftPanelSkin';
	}

	public childrenCreated() {
		this.itemList.itemRenderer = ItemBaseNotName;
		this.itemList.dataProvider = null;
	}

	private onClick(e: egret.TouchEvent) {
		let activityData: ActivityType19Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType19Data;
		if (!activityData)
			return

		if (activityData.canGetRecordByIndex(activityData.reachday+1)) {
			let config = activityData.GetConfig()[activityData.reachday]
			GameGlobal.ActivityKaiFuModel.sendReward(this._activityId, config.index)
			return
		}

		GameGlobal.RechargeModel.sendRecharge(this._rechargeId)
	}

	public OnOpen(...param: any[]) {
		this.AddClick(this.dialogMask, this.CloseSelf);
		this.AddClick(this.dialogCloseBtn, this.CloseSelf);
		this.AddClick(this.chargeBtn, this.onClick);
		this.observe(MessageDef.ACTIVITY_UPDATE, this.updateContent);
		this.updateContent();
	}

	private updateContent() {
		this.setCurContent()
		this.setNextContent()

		let activityData: ActivityType19Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType19Data;
		if (!activityData)
			return

		this.chargeBtn.label = activityData.canGetRecordByIndex(activityData.reachday+1) ? "领取奖励" : "立即购买"
	}

	private setCurContent() {
		let activityData: ActivityType19Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType19Data;
		if (!activityData) {
			return
		}

		if (activityData.AllGotten()) {
			this.CloseSelf()
			return
		}
			
		this.chargeBtn.visible = activityData.runday > activityData.reachday
		this.labTip.visible = !this.chargeBtn.visible

		if (!TimerManager.ins().isExists(this.updateTime, this))
		{
			this.AddTimer(1000, 0, this.updateTime);
		}
		this.updateTime();

		let config = activityData.GetConfig()[activityData.reachday];
		if (!config) {
			return
		}

		this.itemList.dataProvider = new eui.ArrayCollection(config.gift);
		this.titleImg.source = config.title;
		this.titleLabel.text = config.name;
		this._rechargeId = config.rechargeid;
		
		this.nameTxt.text = config.showname;
		this.valueTxt.textFlow = TextFlowMaker.generateTextFlow(config.des);
		this.power.text = config.power

		this.showImg.visible = config.showtype == 0;
		this.rideShowPanel.visible = config.showtype == 1;
		this.roleShowPanel.visible = config.showtype == 2;
		if (config.showtype == 0) {
			this.showImg.source = config.show;
		}
		else if (config.showtype == 2)
		{
			let clothid
			if (config.showg && GameGlobal.actorModel.sex == 1)
			{
				clothid = config.showg;
			} else
			{
				clothid = config.show;
			}	
			let role = SubRoles.ins().GetRoleData();
			var skinConfig = GameGlobal.Config.RideSkinConfig[role.mRideId];
			let showData = new RoleShowData
			showData.job = GameGlobal.actorModel.job
			showData.sex = GameGlobal.actorModel.sex
			showData.clothID = clothid
			showData.rideId = skinConfig ? skinConfig.pid : 0
			this.roleShowPanel.SetAll(showData)
		} else {
			if (config.showg && GameGlobal.actorModel.sex == 1)
			{
				this.rideShowPanel.SetBodyId(config.showg);
			} else
			{
				this.rideShowPanel.SetBodyId(config.show);
			}	
		}

		this.setCurPos(config)
	}

	private updateTime(...param) {
		let date = new Date(GameServer.serverTimeMilli);
		let restTime = DateUtils.MS_PER_DAY - (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
		this.timeTxt.text = DateUtils.format_1(restTime);
	}

	private setNextContent() {
		let activityData: ActivityType19Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType19Data;
		if (!activityData) 
			return

		let config = activityData.GetConfig()[activityData.reachday+1]
		this.nextGroup.visible = config != null && activityData.reachday < activityData.runday
		if (!this.nextGroup.visible)
			return

		this.labNextPower.text = `战力直升 ${config.power}`
		this.nextShowImg.visible = config.showtype == 0
		this.nextRideShowPanel.visible = config.showtype == 1;
		this.nextRoleShowPanel.visible = config.showtype == 2;
		if (config.showtype == 0) {
			this.nextShowImg.source = config.show;
		}
		else if (config.showtype == 2)
		{
			let clothid
			if (config.showg && GameGlobal.actorModel.sex == 1)
			{
				clothid = config.showg;
			} else
			{
				clothid = config.show;
			}	
			let role = SubRoles.ins().GetRoleData();
			var skinConfig = GameGlobal.Config.RideSkinConfig[role.mRideId];
			let showData = new RoleShowData
			showData.job = GameGlobal.actorModel.job
			showData.sex = GameGlobal.actorModel.sex
			showData.clothID = clothid
			showData.rideId = skinConfig ? skinConfig.pid : 0
			this.nextRoleShowPanel.SetAll(showData)
		} else {
			if (config.showg && GameGlobal.actorModel.sex == 1)
				this.nextRideShowPanel.SetBodyId(config.showg);
			else
				this.nextRideShowPanel.SetBodyId(config.show);
		}

		this.setNextPos(config)
	}

	private setCurPos(config) {
		this.rideShowPanel.y = 380

		let aniType = config.itemtype
		if (aniType == 2) { //翅膀
			this.rideShowPanel.y = 490
		}
	}

	private setNextPos(config) {
		this.nextRideShowPanel.y = 120
		this.nextRideShowPanel.x = 94
		this.nextShowImg.y = 21
	
		let aniType = config.itemtype
		if (aniType == 2) { //翅膀
			this.nextRideShowPanel.x = 110
			this.nextRideShowPanel.y = 170
			return
		}

		if (aniType == 3) { //天仙
			this.nextRideShowPanel.y = 95
			return
		}

		if (aniType == 4) { //神兵
			this.nextShowImg.y = 0
			return
		}

		if (aniType == 6) { //称号
			this.nextShowImg.y = 0
		}
	}
}