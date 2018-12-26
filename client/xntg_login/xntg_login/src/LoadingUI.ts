class LoadingUI extends egret.DisplayObjectContainer {

	private m_Textures = [
		{ path: "resource/assets/game_start/res/ui_bm_vip5.png", data: null },
	]

	public constructor() {
		super()
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private bg: egret.Bitmap
	private blackBg: egret.Bitmap
	private m_Label: egret.TextField

	private tipx1: number = -300
	private tipx2: number = 35
	private tipImg: egret.Bitmap

	private img01: egret.Bitmap
	private img01Tag: egret.Bitmap
	private img01W: number
	private img02: egret.Bitmap
	private img02Tag: egret.Bitmap
	private img02W: number
	private label03: egret.TextField

	private imgWidth = 486

	private str: string = ""

	private s1: number = 0
	private e1: number = 0

	private s2: number = 0
	private e2: number = 0

	private t: number = 0
	private et: number = 0
	private pt: number = 0
	private preveTime: number = 0

	private mt: number = 0

	// private tipTime: number = 0
	// private tipTimeWay: number = -1
	// private tipTimeY1: number = 1
	// private tipTimeY2: number = 1
	// private tipTimeFunc: Function

	private NewBar(y) {
		let blackBg = new egret.Bitmap();
		blackBg.x = -342
		blackBg.y = y
		blackBg.texture = Main.Instance.GetImg("_ui_bm_cjjindutiao01@63_0_60_0")
		blackBg.width = 685
		blackBg.scale9Grid = new egret.Rectangle(63, 0, 3, 49)
		blackBg.touchEnabled = true
		this.addChild(blackBg)

		let fBg = new egret.Bitmap
		fBg.x = -296
		fBg.y = y + 11
		fBg.texture = Main.Instance.GetImg("_ui_bm_cjjindutiao02@14_0_8_0")
		fBg.width = 593
		fBg.scale9Grid = new egret.Rectangle(15,0,3,27)
		fBg.touchEnabled = true
		this.addChild(fBg)
		return fBg

	}

	private onAddToStage(event: egret.Event) {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

		let bg = this.bg = new egret.Bitmap
		bg.texture = Main.Instance.GetSingleImg("ui_xzfwq_p_show")
		bg.touchEnabled = true
		bg.x = -480
		this.addChild(bg)

		this.onResize()


		this.img01 = this.NewBar(926)
		this.img01Tag = new egret.Bitmap
		this.img01Tag.y = 926 - 45
		this.img01Tag.texture = Main.Instance.GetImg("_ui_bm_yun")
		this.addChild(this.img01Tag)
		this.img01W = this.SetBarValue(this.img01, 0, this.img01Tag)
		this.img02 = this.NewBar(1073)
		this.img02Tag = new egret.Bitmap                                                                                                                                                                   
		this.img02Tag.y = 1073 - 45
		this.img02Tag.texture = Main.Instance.GetImg("_ui_bm_yun")
		this.addChild(this.img02Tag)
		this.img02W = this.SetBarValue(this.img02, 0, this.img02Tag)

		this.tipImg = new egret.Bitmap
		this.tipImg.x = 35
		this.tipImg.y = 720
		this.addChild(this.tipImg)

		if (ServerUI.IsNewServer(Main.Instance.mConnectServerData.id)) {
			this._LoadTexture(0)
		}

		let label01 = new egret.TextField
		label01.text = "首次加载时间稍长，请耐心等待"
		label01.strokeColor = 0x0B0C03
		label01.stroke = 1
		label01.size = 24
		label01.x = -302
		label01.y = 980
		label01.width = 604
		label01.verticalAlign = egret.VerticalAlign.MIDDLE
		label01.textAlign = egret.HorizontalAlign.CENTER
		this.addChild(label01)

		let label02 = new egret.TextField
		label02.touchEnabled = true
		label02.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		label02.text = "若长时间加载不成功，请点击刷新界面"
		label02.strokeColor = 0x0B0C03
		label02.textColor = 0x25d921
		label02.stroke = 1
		label02.size = 24
		label02.x = -302
		label02.y = 1126
		label02.width = 604
		label02.verticalAlign = egret.VerticalAlign.MIDDLE
		label02.textAlign = egret.HorizontalAlign.CENTER
		this.addChild(label02)

		let label03 = this.label03 = new egret.TextField
		label03.text = ""
		label03.strokeColor = 0x0B0C03
		label03.stroke = 1
		label03.size = 24
		label03.x = -302
		label03.y = 1156
		label03.width = 604
		label03.verticalAlign = egret.VerticalAlign.MIDDLE
		label03.textAlign = egret.HorizontalAlign.CENTER
		this.addChild(label03)

		this.preveTime = this.pt = egret.getTimer()
		this.mt = egret.getTimer()
		egret.startTick(this.Update, this)

		WindowData.StartLoading()
	}

	private SetBarValue(bar: egret.Bitmap, value: number, tag: egret.Bitmap): number {
		if (value > 1) {
			value = 0
		} else if (value < 0) {
			value = 0
		}
		let thumbWidth = bar.width;
		let clipWidth = Math.round(value * thumbWidth);
		if (clipWidth < 0 || clipWidth === Infinity) {
			clipWidth = 0;
		}
		let rect = bar.$scrollRect
		if (!rect) {
			rect = egret.$TempRectangle
		}
		rect.setTo(0, 0, bar.width, bar.height)
		rect.width = clipWidth;
		bar.scrollRect = rect;

		tag.x = bar.x + clipWidth - 55
		return value
	}

	private _LoadTexture(index: number): void {
		RES.getResByUrl(this.m_Textures[index].path, this._Loaded, this, RES.ResourceItem.TYPE_IMAGE)
	}

	private _Loaded(obj: egret.Texture, name) {
		if (!obj) {
			return
		}
		for (let i = 0; i < this.m_Textures.length; ++i) {
			if (this.m_Textures[i].path == name) {
				this.tipImg.texture = obj
				break
			}
		}
	}	

	public Close() {
		egret.stopTick(this.Update, this)
		if (this.parent) {
			this.parent.removeChild(this)
			for (let data of this.m_Textures) {
				RES.destroyRes(data.path)
			}
		}
	}

	private Update(time: number): boolean {
		let dt = time - this.pt
		this.pt = time
		this.t += dt
		let value
		if (this.t > this.et) {
			value = 1
		} else {
			value = this.t / this.et
		}
		this.img01W = this.SetBarValue(this.img01, this.s1 + (this.e1 - this.s1) * value, this.img01Tag)
		// this.img02W = this.SetBarValue(this.img02, this.s2 + (this.e2 - this.s2) * value)

		let t = (time - this.mt) % 2500
		this.img02W = this.SetBarValue(this.img02, t / 2500, this.img02Tag)

		this._UpdatePro(value)
		
		// let x = this.img01Tag.x
		// if (x < this.tipx1) {
		// 	this.tipImg.x = this.tipx1
		// } else if (x > this.tipx2) {
		// 	this.tipImg.x = this.tipx2
		// } else {
		// 	this.tipImg.x = x
		// }

		return false
	}

	private _OnClick() {
		window.location.reload()
	}

	private _UpdatePro(value: number) {
		if (this.str) {
			this.label03.text = this.str + " [" + Math.floor(value * 100) + "%]"
		} else {
			this.label03.text = ""
		}
	}

	public UpdateText(str: string, p1: number, p2: number, time: number) {
		this.str = str
		this._UpdatePro(p2)
		this.t = 0
		this.et = time
		this.s1 = this.img01W
		this.e1 = p1
		if (this.e1 < this.s1) {
			this.e1 += 1
		}

		this.s2 = this.img02W
		this.e2 = p2
		if (this.e2 < this.s2) {
			this.e2 += 1
		}
		// console.log("--------------", this.e2, this.s2)
	}


	public SetText(str: string, p1: number, p2: number, time: number) {
		this.img02W = this.SetBarValue(this.img02, 0, this.img02Tag)
		this.UpdateText(str, p1, p2, time)
	}


	private onResize() {
		if (this.blackBg) {
			this.blackBg.x = - 4 - (egret.MainContext.instance.stage.stageWidth >> 1)
			this.blackBg.y = -Main.Instance.mUIGroupYPos
			this.blackBg.width = egret.MainContext.instance.stage.stageWidth * 1.2
			this.blackBg.height = egret.MainContext.instance.stage.stageHeight * 1.2
		}
		if (this.bg) {
			this.bg.y = -Main.Instance.mUIGroupYPos
			this.bg.height = egret.MainContext.instance.stage.stageHeight
			this.bg.width = this.bg.height / 1280 * 960
			this.bg.x = -(this.bg.width) >> 1
		}
	}

	public getElasticOut(t: number) {
		if (t == 0 || t == 1) return t;
		let s = 0.3 / 6.28 * 1.57
		return (Math.pow(2, -10 * t) * Math.sin((t - s) * 6.28 / 0.3) + 1);
	}

	public sineOut(t: number) {
		return Math.sin(t * Math.PI / 2);
	}
}
