class BagAddItemWarn extends BaseEuiView {
	public constructor() {
		super()
	}

	private price: PriceIcon

	private decBtn: eui.Button
	private addBtn: eui.Button
	private sureBtn: eui.Button
	private cancelBtn: eui.Button
	// private closeBtn: eui.Button

	private count: eui.Label

	private commonDialog: CommonDialog

	initUI() {
		super.initUI()
		this.skinName = "OpenCellSkin"
		this.price.setType(MoneyConst.yuanbao)
	}

	OnOpen() {
		this.AddClick(this.decBtn, this.onTap);
		this.AddClick(this.addBtn, this.onTap);
		this.AddClick(this.sureBtn, this.onTap);
		this.AddClick(this.cancelBtn, this.onTap);
		// this.addTouchEvent(this, this.onTap, this.closeBtn);
		this.commonDialog.OnAdded(this)

		this.commonDialog.setBgVisible(true)
		this.setCount(5)
	}

	OnClose() {
		this.commonDialog.OnRemoved()
		this.removeEvents()
	}

	onTap = function (e) {
		switch (e.currentTarget) {
			case this.decBtn:
				this.setCount(Number(this.count.text) - 5);
				break;
			case this.addBtn:
				this.setCount(Number(this.count.text) + 5);
				break;
			case this.sureBtn:
				if (GameLogic.ins().actorModel.yb < this.price.price) {
					UserTips.ins().showTips("|C:0xff0000&T:元宝不足|");
					break
				}
				UserBag.ins().sendAddBagGrid(Number(this.count.text) / 5)
			case this.cancelBtn:
			// case this.closeBtn:
				ViewManager.ins().close(BagAddItemWarn)
		}
	}
	setCount(addNum: number) {
		var bagBaseConfig = GlobalConfig.ins().BagBaseConfig
		var bagExpandConfig = GlobalConfig.ins().BagExpandConfig
		var configLength = CommonUtils.getObjectLength(bagExpandConfig)
		var size = (UserBag.ins().bagNum - bagBaseConfig.baseSize) / bagBaseConfig.rowSize
		var n = (configLength - size) * bagBaseConfig.rowSize
		if (5 > addNum) {
			(addNum = 5, UserTips.ins().showTips("|C:0xff0000&T:已经是最小扩张数|"))
		} else if (addNum > n) {
			addNum = n
			UserTips.ins().showTips("|C:0xff0000&T:已经是最大扩张数|")
		}
		this.count.text = "" + addNum;
		for (var s = 0, a = addNum / bagBaseConfig.rowSize, l = 1; a >= l; l++)
			s += bagExpandConfig[size + l].cost;
		this.price.setPrice(s)
	}
}

BagAddItemWarn.LAYER_LEVEL =  LayerManager.UI_Popup