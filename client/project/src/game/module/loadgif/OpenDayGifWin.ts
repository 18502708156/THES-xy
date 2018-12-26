class OpenDayGifWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// OpenDayGifSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	public tipImg: eui.Image;
	public list: eui.List;

	public constructor() {
		super()
		this.skinName = "OpenDayGifSkin"
		this.commonWindowBg.SetTitle("登陆送元宝")
	}

	public childrenCreated() {
		this.list.itemRenderer = OpenDayGifItem
		this.list.dataProvider = new eui.ArrayCollection([])
	}

	public OnOpen(...args) {
		this.commonWindowBg.OnAdded(this)
		this.observe(MessageDef.LOGINDAYGIF, this.UpdateContent)
		this.UpdateContent()
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClicked(e: egret.TouchEvent) {

	}

	private UpdateContent() {
		let Config = GameGlobal.Config.LoginRewardConfig
		let ConfigData = []
		let openDay = GameServer.serverOpenDay < 7
		for (let data in Config) {
			if (openDay && Config[data].day >= 8) {
				continue
			}
			ConfigData.push(Number(data))
		}

		let model = OpenDayGifModel.ins()
		let weight = (num) => {
			let skinid = Number(num)
			if (skinid <= model.tolDay && !BitUtil.Has(model.receivemark, skinid - 1)) {
				return -100000 + skinid
			}
			if (skinid > model.tolDay) {
				return -10000 + skinid
			}
			if (BitUtil.Has(model.receivemark, skinid - 1)) {
				return -1000 + skinid
			}
		}

		ConfigData.sort((lhs, rhs) => {
			return weight(lhs) - weight(rhs)
		})


		this.list.dataProvider = new eui.ArrayCollection(ConfigData)
		if (model.tolDay > ConfigData.length) {
			this.tipImg.source = Config[ConfigData.length].item
		} else {
			this.tipImg.source = Config[model.tolDay || 1].item
		}

	}

}

class OpenDayGifItem extends eui.ItemRenderer {

	public tipsTxt: eui.BitmapLabel;
	public tip2: eui.Label;
	public list: eui.List;
	public btn: eui.Button;
	public getted_img: eui.Image;
	public item: ItemBase
	public mtzl: eui.Image

	public childrenCreated() {
		this.list.itemRenderer = ItemBaseNotName
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	public _OnClick() {
		OpenDayGifModel.ins().getLoginReward(this.data)
	}

	public dataChanged() {
		let Config = GameGlobal.Config.LoginRewardConfig[this.data]
		this.tipsTxt.text = "第" + this.data + "天"
		if (this.data - OpenDayGifModel.ins().tolDay > 0) {
			if (this.data - OpenDayGifModel.ins().tolDay == 1) {
				this.mtzl.visible = true
				this.tip2.text = ""
			} else {
				this.mtzl.visible = false
				this.tip2.text = "还差" + (this.data - OpenDayGifModel.ins().tolDay) + "天"
			}
		}else{
			this.tip2.text = ""
			this.mtzl.visible = false
		}

		this.list.dataProvider = new eui.ArrayCollection(Config.showitem2)
		this.getted_img.visible = BitUtil.Has(OpenDayGifModel.ins().receivemark, this.data - 1);
		this.btn.visible = this.data <= OpenDayGifModel.ins().tolDay && !this.getted_img.visible
		this.tip2.visible = !(this.getted_img.visible || this.getted_img.visible)
		UIHelper.ShowRedPoint(this.btn, this.btn.visible)
		this.item.data = Config.showitem
	}

}