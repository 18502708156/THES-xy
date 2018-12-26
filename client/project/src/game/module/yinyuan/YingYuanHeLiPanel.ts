class YingYuanHeLiPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup
	protected commonDialog: CommonDialog;
	public bnt: eui.Button;
	public bnt0: eui.Button;
	public list: eui.List;
	public list1: eui.List;
	public list2: eui.List;

	public index: number = 0
	public select: number = 0

	protected childrenCreated(): void {
		this.skinName = "YingYuanHeliSkin";
		this.list.itemRenderer = YingYuanHeadItem
		this.list1.itemRenderer = YingYuanHuLiItem
		this.list2.itemRenderer = ItemBaseNotName
	}

	public constructor() {
		super()

	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "喜结连理"
		this._AddClick(this.bnt, this.click)
		this._AddClick(this.bnt0, this.Close)
		this.list1.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnClick, this);
		this.list1.selectedIndex = this.select
		this.updateContent()
	}

	private updateContent() {
		let Config = GameGlobal.Config.GiftsConfig
		let gifdata = []
		let roledata = []
		roledata.push(GameGlobal.YingYuanModel.marryInvita[0].husband)
		roledata.push(GameGlobal.YingYuanModel.marryInvita[0].wife)
		this.list.dataProvider = new eui.ArrayCollection(roledata)
		this.list2.dataProvider = new eui.ArrayCollection(Config[this.select + 1].showreward)
		for (let data in Config) {
			gifdata.push(data)
		}
		this.list1.dataProvider = new eui.ArrayCollection(gifdata)
	}

	private click() {
		GameGlobal.YingYuanModel.marryGreeting(GameGlobal.YingYuanModel.marryInvita[0].dbid, this.select + 1)
	}

	private _OnClick(e: eui.PropertyEvent) {
		this.select = this.list1.selectedIndex
		this.updateContent();
	}

	private Close() {
		GameGlobal.YingYuanModel.marryInvita.splice(0, 1);
		GameGlobal.MessageCenter.dispatch(MessageDef.INVITATION_INFO)
		ViewManager.ins().close(this)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}

class YingYuanHuLiItem extends eui.ItemRenderer {
	public list2: eui.List;
	public typeName: eui.Label;
	public priceicon: PriceIcon;
	public constructor() {
		super();
		this.skinName = "YingYuanHeLiItemSkin"
		this.list2.itemRenderer = ItemBase
	}

	type = [
		'普通贺礼',
		'热闹贺礼',
		'豪华贺礼'
	]

	public childrenCreated() {

	}

	public dataChanged() {
		let data = Number(this.data)
		if (!data) {
			return
		}
		let Config = GameGlobal.Config.GiftsConfig
		this.list2.dataProvider = new eui.ArrayCollection([Config[data].reward])
		this.typeName.text = this.type[data - 1]
		this.priceicon.setType(Config[data].price.id)
		this.priceicon.setPrice(Config[data].price.count)
		this.list2.touchEnabled = false
		this.list2.touchChildren = false
	}
}