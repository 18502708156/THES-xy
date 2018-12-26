class YingYuanXianHuaPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup
	public commonDialog: CommonDialog;
	public list1: eui.List;
	public item: ItemBase;
	public goodsGroup0: eui.Group;
	public numLabel: eui.TextInput;
	public sub1Btn: eui.Button;
	public add1Btn: eui.Button;
	public add10Btn: eui.Button;
	public sub10Btn: eui.Button;
	public totalPrice: PriceIcon;
	public buyBtn: eui.Button;
	public freeBuy: eui.CheckBox;
	public otherName: eui.Label

	public index: number = 0
	public num: number = 1 
	public autoBuy: number = 0
	public freeMaxNum: number = 0
	public buyMaxNum: number = 0

	public constructor() {
		super()
		this.skinName = "YingYuanXianHuaSkin";
		this.list1.itemRenderer = YingyuanXianHuaItem
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "赠送鲜花"
		this._AddClick(this.sub1Btn, this.click)
		this._AddClick(this.add1Btn, this.click)
		this._AddClick(this.add10Btn, this.click)
		this._AddClick(this.sub10Btn, this.click)
		this._AddClick(this.buyBtn, this.click)
		this._AddClick(this.freeBuy, this.click)
		this.list1.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnClick, this);
		this.list1.selectedIndex = this.index
		this.updateContent()
	}

	private click(e: egret.TouchEvent) {
		switch (e.target) {
			case this.sub1Btn:
				this.numChange(-1, true)
				break;
			case this.add1Btn:
				this.numChange(1, true)
				break;
			case this.add10Btn:
				let num = this.freeBuy.selected ? this.freeMaxNum + this.buyMaxNum : this.freeMaxNum
				this.numChange(num, false)
				break;
			case this.sub10Btn:
				this.numChange(1, false)
				break;
			case this.buyBtn:
				GameGlobal.YingYuanModel.marryFlower(this.index + 1, this.num, this.autoBuy)
				break;
			case this.freeBuy:
				this.autoBuy = this.freeBuy.selected ? 2 : 0
				let n = Math.min(this.num, this.freeMaxNum)
				this.numChange(n, false)
				break
		}
	}

	private numChange(num, deltaFlag) {
		if (deltaFlag)
			num = this.num + num

		let maxNum = this.freeBuy.selected ? this.freeMaxNum + this.buyMaxNum : this.freeMaxNum
		this.num = Math.min(Math.max(num, 1), maxNum)

		this.upText()
	}

	private upText() {
		this.numLabel.text = this.num + ""
		this.numLabel.touchChildren = false
		this.numLabel.touchEnabled = false
		let Config = GameGlobal.Config.FlowersConfig
		let price = Config[this.index + 1].price
		let priceCout = 0
		if (this.freeBuy.selected) {
			priceCout = price.count * Math.max(this.num - this.freeMaxNum, 0)
		}
		this.totalPrice.setType(price.id)
		this.totalPrice.setPrice(priceCout)

	}

	private updateContent() {
		let Config = GameGlobal.Config.FlowersConfig
		let data = []
		for (let num in Config) {
			data.push(Number(num))
		}
		this.otherName.text = GameGlobal.YingYuanModel.getOtherData().name
		this.list1.dataProvider = new eui.ArrayCollection(data)
		let flowerConfig = Config[this.index + 1]
		this.item.data = flowerConfig.ID
		this.item.setItemCount(false)
		this.item.nameTxt.text = this.item.nameTxt.text + "*" + this.getNum(flowerConfig.ID)

		this.freeMaxNum = GameGlobal.UserBag.GetCount(flowerConfig.ID)
		let curNum = GameGlobal.actorModel.GetNum(flowerConfig.price.id)
		this.buyMaxNum = Math.floor(curNum / flowerConfig.price.count)
		this.num = this.freeMaxNum
		this.upText();
	}

	private getNum(id) {
		let data = GameGlobal.UserBag.getBagItemById(id)
		if (!data) {
			return 0
		}
		return data.count
	}

	private _OnClick(e: eui.PropertyEvent) {
		this.index = this.list1.selectedIndex
		this.updateContent();
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}

class YingyuanXianHuaItem extends eui.ItemRenderer {
	public item1: ItemBase
	public num: eui.Label
	public constructor() {
		super();

	}

	public childrenCreated() {

	}

	public dataChanged() {
		let data = this.data
		let Config = GameGlobal.Config.FlowersConfig
		this.item1.touchEnabled = false
		this.item1.touchChildren = false
		this.item1.setDataByConfig(GlobalConfig.ins().ItemConfig[Config[data].ID])
		this.item1.setItemCount(false)
		this.num.text = "数量：" + this.getNum(Config[data].ID)
		this.num.textColor = this.item1.getTextColor()
	}

	private getNum(id) {
		let data = GameGlobal.UserBag.getBagItemById(id)
		if (!data) {
			return 0
		}
		return data.count
	}
}