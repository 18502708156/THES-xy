class RechargeRebatePanel extends BaseView {
	/////////////////////////////////////////////////////////////////////////////
	// RechargeRebateSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected list: eui.List;
	protected countDownTxt: eui.Label;
	protected avtiviteId:number
	/////////////////////////////////////////////////////////////////////////////
	public static CheckRedPoint(id:number): boolean {
		if (!id)
			return false
			
		return (GameGlobal.ActivityKaiFuModel.GetActivityDataById(id) as ActivityType27Data).isRedPoint();
	}

	public constructor() {
		super();
		this.skinName = "RechargeRebateSkin"
	}
 
	childrenCreated() {
		
		this.list.itemRenderer = RebateItem;

	}

	public OnOpen(...param: any[]) {
		this.avtiviteId = param[0]
		let ActivityType27Data = <ActivityType27Data>GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.avtiviteId);
		this.countDownTxt.text = `剩余时间:${ActivityBaseData.GetTimeStr(ActivityType27Data.endTime - GameServer.serverTime)}`
		this.observe(MessageDef.ACTIVITY_UPDATE, this.updateContent);
		(GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.avtiviteId) as ActivityType27Data).redPoint = false;
		this.updateContent();
	}

	updateContent() {
		let ActivityType27Data = <ActivityType27Data>GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.avtiviteId);
		let itemDatas = CommonUtils.GetArray(GameGlobal.Config.ActivityType27Config[this.avtiviteId], "money")
		let sort = (item) => {
			for (let val of ActivityType27Data.cloutArr) {
				if (val.no == item.orderid)
					if (val.num >= item.frequency) {
						return item.money + 100000;
					}
			}
			return item.money;
		}
		itemDatas.sort((a, b) => { return sort(a) - sort(b) })
		this.list.dataProvider = new eui.ArrayCollection(itemDatas);
	}
}

class RebateItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// RechargeRebateItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected percentTxt: eui.Label;
	protected rechargeBtn: eui.Button;
	protected tipsTxt: eui.Label;
	protected countTxt: eui.Label;
	protected item: ItemBaseNotName;
	/////////////////////////////////////////////////////////////////////////////

	constructor() {
		super();
		this.skinName = "RechargeRebateItemSkin";
	}

	childrenCreated() {
		this.rechargeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this)
	}

	dataChanged() {
		this.item.data = this.data.money3[0];
		this.percentTxt.textFlow = TextFlowMaker.generateTextFlow(this.data.percentage);
		this.tipsTxt.text = `单笔充值：${this.data.money}元`;
		this.updateCount()
	}

	updateCount() {
		let curCount = 0;
		let ActivityType27Data = <ActivityType27Data>GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.data.Id);
		let ActivityType27Config = GameGlobal.Config.ActivityType27Config[this.data.Id];

		for (let val of ActivityType27Data.cloutArr) {
			if (val.no == this.data.orderid)
				curCount = val.num
		}

		if (curCount >= this.data.frequency) {
			this.countTxt.textColor = Color.Red;
			this.countTxt.text = "今日限购次数已满";
			this.rechargeBtn.filters = Color.GetFilter();
			this.rechargeBtn.touchEnabled = false;
		}
		else {
			this.countTxt.text = `每天限购${curCount}/${this.data.frequency}次`;
			this.countTxt.textColor = Color.l_green_1;
			this.rechargeBtn.touchEnabled = true;
			this.rechargeBtn.filters = null;
		}
	}
	tap() {
		GameGlobal.RechargeModel.sendRecharge(this.data.orderid);
	}
}