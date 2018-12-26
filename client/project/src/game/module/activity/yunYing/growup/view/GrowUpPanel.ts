class GrowUpPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = '成长基金';

	/////////////////////////////////////////////////////////////////////////////
	// GrowUpPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected touziBtn: eui.Button;
	protected timeTxt: eui.Label;
	protected flagImg: eui.Image;
	protected itemList: eui.List;
	/////////////////////////////////////////////////////////////////////////////

	private lists = [];
	private _activityId = 11;
	private _activityData: ActivityType24Data;

	public constructor() {
		super()
		this.skinName = 'GrowUpPanelSkin';
	}

	public childrenCreated() {
		this.itemList.itemRenderer = GrowUpItem;
		this.itemList.dataProvider = null;

		this.lists = GameGlobal.Config.ActivityType24Config[this._activityId];
		this.itemList.dataProvider = new eui.ArrayCollection(this.lists);
	}

	private onClick(e: egret.TouchEvent) {
		if (Checker.Money(MoneyConst.yuanbao, 20000, MoneyConst.yuanbao)) {
			GameGlobal.ActivityKaiFuModel.sendInvestment(this._activityId);
		}
	}

	public OnOpen(...param: any[]) {
		this.AddClick(this.touziBtn, this.onClick);
		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
		this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
	}


	public UpdateContent() {
		TimerManager.ins().remove(this.updateTime, this);
		this._activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType24Data;
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

			let weight = (config) => {
				let isReward = this._activityData.reward.indexOf(config.index) != -1;
				if (isReward) {
					return config.index + 10000;
				}
				return config.index;
			}
			this.lists.sort((lhs, rhs) => {
				return weight(lhs) - weight(rhs)
			})

			UIHelper.ListRefresh(this.itemList);
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
		return GameGlobal.GrowUpModel.checkGrowUpRedPoint()
	}
}

class GrowUpItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// GrowUpItemSkin.exml
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
		this.rewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCkick, this);
	}

	private onCkick(e: egret.TouchEvent) {
		let _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11) as ActivityType24Data;
		if (_activityData) {
			if (_activityData.status == 0) {
				UserTips.ins().showTips('您还没有投资，不能领取')
				return;
			}
			GameGlobal.ActivityKaiFuModel.sendReward(11, this.data.index);
		}
	}

	public dataChanged() {
		super.dataChanged();
		if (!this.data) return;
		let config = this.data;
		this.descTxt.text = '达到' + config.level + '级，返还';
		this.rewardList.dataProvider = new eui.ArrayCollection(config.reward);

		let _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11) as ActivityType24Data;
		if (_activityData) {
			let lv = GameGlobal.actorModel.level;
			if (lv < config.level) {
				this.levelTxt.text = lv + '级/' + config.level + '级';
				this.levelTxt.visible = true;
				this.rewardBtn.visible = this.rewardImg.visible = false;
			}
			else {
				//按钮状态处理
				let isReward = _activityData.reward.indexOf(config.index) != -1;
				UIHelper.ShowRedPoint(this.rewardBtn, _activityData.status == 1 && !isReward);
				this.rewardImg.visible = isReward;
				this.rewardBtn.visible = !isReward;
				this.levelTxt.visible = false;
			}
		}
	}
}