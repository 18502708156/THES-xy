class NoticeUI extends egret.DisplayObjectContainer {
	public constructor() {
		super()
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private bg: egret.Bitmap
	private m_Label: egret.TextField

	private onAddToStage(event: egret.Event) {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

		this.bg = new egret.Bitmap();
		this.bg.alpha = 0.5
		this.bg.x = -4
		this.bg.y = -4
		this.bg.texture = Main.Instance.GetImg("_ui_black")
		this.bg.scale9Grid = new egret.Rectangle(4, 4, 46, 46)
		this.bg.touchEnabled = true
		this.addChild(this.bg)

		this.onResize()

		let b1 = new egret.Bitmap
		b1.texture = Main.Instance.GetImg("_ui_sbm_001@120_120_120_120")
		b1.y = 101
		b1.height = 1066
		b1.width = 700
		b1.x = -b1.width >> 1
		b1.scale9Grid = new egret.Rectangle(123, 121, 25, 21)
		this.addChild(b1)

		let b9 = new egret.Bitmap
		b9.texture = Main.Instance.GetImg("_ui_sbm_003@258_0_255_0")
		b9.scale9Grid = new egret.Rectangle(258,0,3,79)
		b9.y = 95
		b9.x = -317
		b9.width = 621
		this.addChild(b9)

		let btitle = new egret.Bitmap
		btitle.texture = Main.Instance.GetImg("_ui_bm_gonggao")
		btitle.x = -50
		btitle.y = 115
		this.addChild(btitle)

let b3 = new egret.Bitmap
		b3.texture = Main.Instance.GetImg("_ui_sbm_002@20_9_20_9")
		b3.x = -323
		b3.y = 189
		b3.height = 842
		b3.width = 640
		b3.scale9Grid = new egret.Rectangle(21, 10, 1, 1)
		this.addChild(b3)

		let b5 = new egret.Bitmap
		b5.touchEnabled = true
		b5.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickClose, this)
		b5.texture = Main.Instance.GetImg("_ui_bt_008_up")
		b5.x = 282
		b5.y = 91
		this.addChild(b5)

		let b4 = new egret.Bitmap
		b4.touchEnabled = true
		b4.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickClose, this)
		b4.texture = Main.Instance.GetImg("_ui_bt_007_up")
		b4.x = 247
		b4.y = 1052
		this.addChild(b4)

		let rightScroll = new egret.ScrollView
		rightScroll.x = b3.x + 20
		rightScroll.y = b3.y + 20
		rightScroll.width = b3.width - 35
		rightScroll.height = b3.height - 40
		this.addChild(rightScroll)

		let group = new egret.DisplayObjectContainer
		this.m_Label = new egret.TextField
		this.m_Label.y = 2
		this.m_Label.width = rightScroll.width
		this.m_Label.size = 30
		this.m_Label.textColor = ServerUI.COLOR
		this.m_Label.text = ""
		group.addChild(this.m_Label)
		rightScroll.setContent(group)

		HttpHelper.GetNotice(this.UpdateNotice, this)
	}

	private UpdateNotice(data) {
		var rspData = JSON.parse(data.currentTarget.response)
		if (rspData.result == 1 && rspData.data != null) {
			this.m_Label.text = rspData.data
		}
	}

	private _OnClickClose() {
		this.Close()
	}

	private Close() {
		if (this.parent) {
			this.parent.removeChild(this)
		}
	}

	private onResize() {
		if (this.bg) {
			this.bg.x = - 4 - (egret.MainContext.instance.stage.stageWidth >> 1)
			this.bg.y = -Main.Instance.mUIGroupYPos
			this.bg.width = egret.MainContext.instance.stage.stageWidth * 1.2
			this.bg.height = egret.MainContext.instance.stage.stageHeight * 1.2
		}
	}
}