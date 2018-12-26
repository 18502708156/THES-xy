class MoneyTreeBoxWin extends BaseEuiView {

	static LAYER_LEVEL = LayerManager.UI_Popup

	dataList = []
	list
	sure: eui.Button
	desc
	index

	private commonDialog: CommonDialog

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "MoneyTreeBoxSkin"
		this.list.itemRenderer = ItemBase
	}

	OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.AddClick(this.sure, this.onTap)
		this.index = param[0];
		var data = MoneyTreeModel.ins().getBoxInfoByIndex(this.index);
		this.desc.text = "今日使用聚宝盆" + data.time + "次，可额外获得："
		this.creatRewardList(data.box)
		this.list.dataProvider = new eui.ArrayCollection(this.dataList)
		this.sure.label = "领取"
		this.sure.enabled = false
		if (MoneyTreeModel.ins().playNum >= data.time) {
			if (MoneyTreeModel.ins().getOrderByIndex(this.index - 1) == 0) {
				this.sure.enabled = true
			} else {
				this.sure.label = "已领取"
			}
		}
	}

	OnClose() {
		this.commonDialog.OnRemoved()
	}

	creatRewardList(e) {
		for (var t, i = 0; 3 > i; i++) this.dataList[i] ? t = this.dataList[i] : (t = new RewardData, t.type = 0, t.id = 1, this.dataList.push(t)), t.count = e[i]
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.sure:
				MoneyTreeModel.ins().sendGetCaseReward(this.index)
				ViewManager.ins().close(MoneyTreeBoxWin);
		}
	}
}