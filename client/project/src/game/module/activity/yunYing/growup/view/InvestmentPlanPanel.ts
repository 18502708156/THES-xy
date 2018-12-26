class InvestmentPlanPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = '投资计划';

	/////////////////////////////////////////////////////////////////////////////
	// InvestmentPlanPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected touziBtn: eui.Button;
	protected timeTxt: eui.Label;
	protected flagImg: eui.Image;
	protected itemList: eui.List;
	/////////////////////////////////////////////////////////////////////////////

	private _activityId = 12;
	private _activityData: ActivityType8Data;

	public constructor() {
		super()
		this.skinName = 'InvestmentPlanPanelSkin';
	}

	public childrenCreated() {
		this.itemList.itemRenderer = InvestmentItem;
		this.itemList.dataProvider = null;

		let lists = GameGlobal.Config.ActivityType8Config[this._activityId];
		this.itemList.dataProvider = new eui.ArrayCollection(lists);
	}

	private onClick(e: egret.TouchEvent) {
		if (Checker.Money(MoneyConst.yuanbao, 8888, MoneyConst.yuanbao)) {
			GameGlobal.ActivityKaiFuModel.sendInvestment(this._activityId);
		}
	}

	public OnOpen(...param: any[]) {
		this.AddClick(this.touziBtn, this.onClick);
		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
		this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
	}

	public UpdateContent() {
		UIHelper.ListRefresh(this.itemList);
		TimerManager.ins().remove(this.updateTime, this);
		this._activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType8Data;
		if (this._activityData) {
			if (this._activityData.status == 0) {
				this.touziBtn.visible = this.timeTxt.visible = true;
				this.flagImg.visible = false;
				this.AddTimer(1000, 0, this.updateTime);
				this.updateTime();
			}
			else {
				this.touziBtn.visible = this.timeTxt.visible = false;
				this.flagImg.visible = true;
			}
		}
	}

	private updateTime(...param) {
		if (this._activityData) {
			this.timeTxt.textFlow = TextFlowMaker.generateTextFlow(this._activityData.getRemindTimeString());
		} else {
			this.timeTxt.text = "活动未开启"
		}
	}

	public static RedPointCheck(): boolean {
		return GameGlobal.GrowUpModel.checkInvestmentRedPoint()
	}
}

class InvestmentItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// InvestmentPlanItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected descTxt: eui.Label;
	protected rewardList: eui.List;
	protected rewardBtn: eui.Button;
	protected levelTxt: eui.Label;
	protected rewardImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.rewardList.itemRenderer = ItemBaseNotName;
		this.rewardList.dataProvider = null;
		this.rewardBtn.visible = false;
		// this.rewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCkick, this);
	}

	private onCkick(e: egret.TouchEvent) {

	}

	public dataChanged() {
		super.dataChanged();
		if (!this.data) return;
		let config = this.data;
		this.descTxt.text = '第' + StringUtils.numTenToChinese(config.index) + '天返利';
		this.rewardList.dataProvider = new eui.ArrayCollection(config.item);

		let _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(12) as ActivityType8Data;
		if (_activityData) {
			if (_activityData.day < config.index) {
				this.levelTxt.text = _activityData.day + '天/' + config.index + '天';
				this.levelTxt.visible = true;
				this.rewardImg.visible = false;
			}
			else {
				//按钮状态处理
				this.rewardImg.visible = true;
				this.levelTxt.visible = false;
			}
		}
	}
}