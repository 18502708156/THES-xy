class ConsumptionPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = '消费有礼';

	/////////////////////////////////////////////////////////////////////////////
	// ConsumptionPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected timeTxt: eui.Label;
	protected ingotTxt: eui.Label;
	protected itemList: eui.List;
	/////////////////////////////////////////////////////////////////////////////

	private _activityId = 13;
	private _activityData: ActivityType25Data;
	private lists = [];

	public constructor() {
		super()
		this.skinName = 'ConsumptionPanelSkin';
	}

	public childrenCreated() {
		this.itemList.itemRenderer = ConsumptionItem;
		this.itemList.dataProvider = null;

		this.lists = GameGlobal.Config.ActivityType25Config[this._activityId];
		this.itemList.dataProvider = new eui.ArrayCollection(this.lists);
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
		this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
	}

	public UpdateContent() {
		this._activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType25Data;
		if (this._activityData) {
			this.ingotTxt.text = this._activityData.money + '元宝'

			let weight = (config) => {
				let isReward = BitUtil.Has(this._activityData.reward, config.index);
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
		TimerManager.ins().remove(this.updateTime, this);
		this.AddTimer(1000, 0, this.updateTime);
		this.updateTime();
	}

	private updateTime(...param) {
		if (this._activityData) {
			this.timeTxt.textFlow = TextFlowMaker.generateTextFlow(this._activityData.getRemindTimeString());
		} else {
			this.timeTxt.text = "活动未开启"
		}
	}

	public static RedPointCheck(): boolean {
		return GameGlobal.GrowUpModel.checkConsumptionRedPoint()
	}
}

class ConsumptionItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// ConsumptionItemSkin.exml
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
		GameGlobal.ActivityKaiFuModel.sendReward(13, this.data.index);
	}

	public dataChanged() {
		super.dataChanged();
		if (!this.data) return;
		let config = this.data;
		this.descTxt.text = '消费' + config.cost + '元宝';
		this.rewardList.dataProvider = new eui.ArrayCollection(config.item);

		let _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(13) as ActivityType25Data;
		if (_activityData) {
			if (_activityData.money < config.cost) {//需要判断消费数
				this.levelTxt.text = '未达成';
				this.levelTxt.visible = true;
				this.rewardBtn.visible = this.rewardImg.visible = false;
			}
			else {
				//按钮状态处理
				let isReward = BitUtil.Has(_activityData.reward, config.index);
				UIHelper.ShowRedPoint(this.rewardBtn, !isReward);
				this.rewardImg.visible = isReward;
				this.rewardBtn.visible = !isReward;
				this.levelTxt.visible = false;
			}
		}
	}
}