class CreateRoleUI extends egret.DisplayObjectContainer {

	private m_ServerData: GameServerDescData

	private m_Textures = [
		{ path: "resource/assets/game_start/create/ui_cjjs_bm_juese.png", data: null },
		{ path: "resource/assets/game_start/create/ui_cjjs_bm_nvjuese.png", data: null },
		{ path: "resource/assets/game_start/create/ui_cjjs_xianzhu_nan.png", data: null },
		{ path: "resource/assets/game_start/create/ui_cjjs_xianzhu_nv.png", data: null },
		{ path: "resource/assets/game_start/create/ui_cjjs_mozhu_nan.png", data: null },
		{ path: "resource/assets/game_start/create/ui_cjjs_mozhu_nv.png", data: null },
	]

	public constructor(serverData: GameServerDescData) {
		super()

		this.m_ServerData = serverData
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private m_IsRandom = true

	private m_TweenList: any[] = []

	private m_Random: egret.Bitmap
	private m_GoBtn: egret.Bitmap
	private m_TextField: egret.TextField

	private m_CurImgIndex: number = 1

	private m_Index: number = -1
	private m_Job: number = 1
	private m_Sex: number = 0

	private timeLabel: egret.TextField
	private sex1: egret.Bitmap
	private sex2: egret.Bitmap
	private sel1: egret.Bitmap
	private sel2: egret.Bitmap

	private roleGroup0: egret.DisplayObjectContainer
	private roleGroup1: egret.DisplayObjectContainer
	private roleImg0: egret.Bitmap
	private roleImg1: egret.Bitmap

	private mSelImg: egret.Bitmap[] = []

	private time = 60 * 1000

	private m_CreateThm1(): void {
		let img2 = new egret.Bitmap
		img2.texture = Main.Instance.GetImg("_ui_bm_mingzibg@20_19_19_19")
		img2.y = 1021
		img2.x = -146
		img2.width = 292
		img2.height = 74
		img2.scale9Grid = new egret.Rectangle(20, 19, 3, 3)
		this.addChild(img2)


		this.roleGroup0 = new egret.DisplayObjectContainer
		this.roleGroup0.y = 808
		this.roleGroup0.x = 0
		this.roleGroup0.width = 0
		this.roleGroup0.height = 0
		this.addChild(this.roleGroup0)

		this.roleImg0 = new egret.Bitmap
		this.roleGroup0.addChild(this.roleImg0)

		this.roleGroup1 = new egret.DisplayObjectContainer
		this.roleGroup1.y = 808
		this.roleGroup1.x = 0
		this.roleGroup1.width = 0
		this.roleGroup1.height = 0
		this.addChild(this.roleGroup1)

		this.roleImg1 = new egret.Bitmap
		this.roleGroup1.addChild(this.roleImg1)

		let img6 = new egret.Bitmap
		img6.texture = Main.Instance.GetImg("_ui_cjjs_bm_wenbenbg")
		img6.y = 812
		img6.x = -192
		this.addChild(img6)

		let label1 = new egret.TextField
		label1.touchEnabled = false
		label1.size = 26
		label1.textColor = 0x5a2611
		label1.text = "请选择种族"
		label1.bold = true
		label1.width = 229
		label1.x = -114
		label1.y = 830
		label1.textAlign = egret.HorizontalAlign.CENTER
		label1.verticalAlign = egret.VerticalAlign.MIDDLE
		this.addChild(label1)

		let label2 = new egret.TextField
		label2.touchEnabled = false
		label2.size = 26
		label2.textColor = 0xf23737
		this.timeLabel = label2
		label2.text = "60s后自动进入服务器"
		label2.bold = true
		label2.width = 342
		label2.x = -171
		label2.y = 1224
		label2.textAlign = egret.HorizontalAlign.CENTER
		label2.verticalAlign = egret.VerticalAlign.MIDDLE
		this.addChild(label2)

		let img7 = new egret.Bitmap
		img7.touchEnabled = true
		img7.texture = Main.Instance.GetImg("_ui_bt_nan")
		this.sex1 = img7
		img7.x = 174
		img7.y = 1015
		this.addChild(img7)
		img7.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.m_Sex = 0
			this.UpdateSel()
		}, this)
		CreateRoleUI.SetDownState(img7)

		let img8 = new egret.Bitmap
		img8.touchEnabled = true
		this.sex2 = img8
		img8.texture = Main.Instance.GetImg("_ui_bt_nv")
		img8.x = 269
		img8.y = 1015
		this.addChild(img8)
		img8.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.m_Sex = 1
			this.UpdateSel()
		}, this)
		CreateRoleUI.SetDownState(img8)

		let img9 = new egret.Bitmap
		this.sel1 = img9
		img9.texture = Main.Instance.GetImg("_ui_cjjs_bm_gou")
		img9.touchEnabled = false
		img9.x = 207
		img9.y = 1058
		this.addChild(img9)

		let img10 = new egret.Bitmap
		this.sel2 = img10
		img10.texture = Main.Instance.GetImg("_ui_cjjs_bm_gou")
		img9.touchEnabled = false
		img10.x = 304
		img10.y = 1058
		this.addChild(img10)
	}

	private AddSelGroup() {
		let group = new egret.DisplayObjectContainer
		group.x = 0
		group.y = 872
		group.width = 0
		this.addChild(group)

		let img1 = new egret.Bitmap
		img1.touchEnabled = true
		img1.texture = Main.Instance.GetImg("_ui_icon_renzhu")
		img1.x = -202
		img1.y = -4
		img1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.Select(0)
		}, this)
		group.addChild(img1)
		CreateRoleUI.SetDownState(img1)

		let img2 = new egret.Bitmap
		img2.touchEnabled = true
		img2.texture = Main.Instance.GetImg("_ui_icon_xianzhu")
		img2.x = -63
		img2.y = -4
		img2.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.Select(1)
		}, this)
		group.addChild(img2)
		CreateRoleUI.SetDownState(img2)

		let img3 = new egret.Bitmap
		img3.touchEnabled = true
		img3.texture = Main.Instance.GetImg("_ui_icon_mozhu")
		img3.x = 77
		img3.y = -4
		img3.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.Select(2)
		}, this)
		group.addChild(img3)
		CreateRoleUI.SetDownState(img3)


		let img4 = new egret.Bitmap
		img4.texture = Main.Instance.GetImg("_ui_cjjs_bm_renzu")
		img4.x = -169
		img4.y = 982
		this.addChild(img4)

		let img5 = new egret.Bitmap
		img5.texture = Main.Instance.GetImg("_ui_cjjs_bm_xianzu")
		img5.x = -28
		img5.y = 982
		this.addChild(img5)

		let img6 = new egret.Bitmap
		img6.texture = Main.Instance.GetImg("_ui_cjjs_bm_mozu")
		img6.x = 109
		img6.y = 982
		this.addChild(img6)

		let g2 = new egret.DisplayObjectContainer
		g2.x = 0
		g2.y = 882
		g2.width = 0
		this.addChild(g2)

		let img21 = new egret.Bitmap
		img21.texture = Main.Instance.GetImg("_ui_cjjs_bm_xuanzhongxiaoguo")
		img21.x = -243
		img21.y = -48
		g2.addChild(img21)
		this.mSelImg[0] = img21
		
		let img22 = new egret.Bitmap
		img22.texture = Main.Instance.GetImg("_ui_cjjs_bm_xuanzhongxiaoguo")
		img22.x = -105
		img22.y = -48
		g2.addChild(img22)
		this.mSelImg[1] = img22

		let img23 = new egret.Bitmap
		img23.texture = Main.Instance.GetImg("_ui_cjjs_bm_xuanzhongxiaoguo")
		img23.x = 35
		img23.y = -48
		g2.addChild(img23)
		this.mSelImg[2] = img23
	}

	private onAddToStage(event: egret.Event) {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

		let bitmap = new egret.Bitmap
		bitmap.x = -360
		bitmap.texture = Main.Instance.GetSingleImg("_ui_cjjs_bm_ditu")
		this.addChild(bitmap)


		this.m_CreateThm1()

		this.AddSelGroup()

		this.m_TextField = new egret.TextField
		this.m_TextField.touchEnabled = true
		this.m_TextField.name = ""
		this.m_TextField.size = 24
		this.m_TextField.textColor = ServerUI.COLOR
		this.m_TextField.textAlign = egret.HorizontalAlign.CENTER
		this.m_TextField.verticalAlign = egret.VerticalAlign.MIDDLE
		this.m_TextField.x = -96
		this.m_TextField.y = 1032
		this.m_TextField.width = 195
		this.m_TextField.height = 52
		this.m_TextField.type = egret.TextFieldType.INPUT
		this.addChild(this.m_TextField)
		this.m_TextField.addEventListener(egret.TouchEvent.FOCUS_IN, this._DoFocus, this)

		let img3 = this.m_Random = new egret.Bitmap
		img3.touchEnabled = true
		this.m_Random.addEventListener(egret.TouchEvent.TOUCH_TAP, this.DoRandom, this)
		img3.texture = Main.Instance.GetImg("_ui_bm_touzi")
		img3.y = 1025
		img3.x = 78
		this.addChild(img3)
		CreateRoleUI.SetDownState(img3)

		let img4 = this.m_GoBtn = new egret.Bitmap
		img4.touchEnabled = true
		this.m_GoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._DoGo, this)
		img4.texture = Main.Instance.GetImg("_ui_bt_kaishiyouxi")
		img4.y = 1105
		img4.x = -176
		this.addChild(img4)
		CreateRoleUI.SetDownState(img4)
		
		let leftBtn = new egret.Bitmap
		leftBtn.touchEnabled = true
		leftBtn.texture = Main.Instance.GetImg("_ui_bt_jiantou")
		leftBtn.x = -341
		leftBtn.y = 618
		leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.UpdateIndex(this.m_Index - 1)
		}, this)
		this.addChild(leftBtn)
		CreateRoleUI.SetDownState(leftBtn)

		let rightBtn = new egret.Bitmap
		rightBtn.touchEnabled = true
		rightBtn.texture = Main.Instance.GetImg("_ui_bt_jiantou")
		rightBtn.x = 341
		rightBtn.y = 618
		rightBtn.scaleX = -1
		rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.UpdateIndex(this.m_Index + 1)
		}, this)
		this.addChild(rightBtn)
		CreateRoleUI.SetDownState(rightBtn)

		this.Select(1)

		this.m_LastTime = egret.getTimer()
		egret.startTick(this.Update, this)

		let list = ["_ui_xzjs_h1", "_ui_xzjs_h2", "_ui_xzjs_h3", , "_ui_xzjs_h4"]
		let tex = []
		for (let t of list) {
			tex.push(Main.Instance.GetImg(t))
		}
		WeatherFactory.getFlower().playWeather(tex)

		this.SendPoint(1)
	}

	private _DoFocus() {
		this.m_IsRandom = false
	}

	private UpdateIndex(value: number) {
		if (value < 0) {
			value = 5
		}
		if (value > 5) {
			value = 0
		}
		this.m_Sex = value % 2
		this.m_Job = Math.floor(value / 2) + 1
		this.UpdateSel()
	}

	private DoRandom() {
		this.m_IsRandom = false
		this._DoRandom()
	}

	private _DoRandom() {
		HttpHelper.GetRandomName(this.m_ServerData.id, this.m_Sex, this._DoRandomName, this)
	}

	private m_CheckName = null
	private m_CheckIndex = null

	private _DoGo() {
		this.time = 0
		let name = this.m_TextField.text
		if (name == null || name == "") {
			alert("名称不能为空")
			return
		}
		this.SendPoint(2)
		this.m_CheckName = name
		this.m_CheckIndex = this.m_Index
		Main.Instance.ConnectServer(this.m_ServerData, () => {
			this.SendPoint(3)
			HttpHelper.CheckName(this.m_ServerData.id, name, this._Go, this)
			// this._Go({
			// 	currentTarget: {
			// 		response: JSON.stringify({
			// 			status: 200,
			// 			data: {
			// 				result: 0
			// 			}
			// 		})
			// 	}
			// })
		})
	}

	private SendPoint(point: number): void {
		if (GameServerData.HasRecentSvr()) {
			return
		}
		HttpHelper.SendPoint(point)
	}

	private _Go(data) {
		var rspData = JSON.parse(data.currentTarget.response)
		if (rspData.status == 200) {
			if (rspData.data.result == 0) {
				let roleData = Main.Instance.mCreateRoleData = {} as any
				roleData.crn = this.m_CheckName
				let crji = this.m_CheckIndex
				roleData.crji = crji
				Main.Instance.ShowLoadingUI()
			} else {
				var msg = [
					``,
					`角色不存在`,
					`重复创建角色`,
					`创建角色失败`,
					`性别职业错误`,
					`角色名称重复`,
					`角色名含特殊字符`,
					`角色名过长`,
					`角色名含有屏蔽字`,
					`角色名称重复`,
				][rspData.data.result] || `名称错误`
				alert(msg)
			}
		}
	}

	private _DoRandomName(data) {
		var data = JSON.parse(data.currentTarget.response)
		if (data.status == 200 && data.result == 1) {
			this.m_TextField.text = data.data
		}
	}

	private Select(index: number) {
		this.m_Job = index + 1
		this.UpdateSel()
	}

	private UpdateSel() {
		let oldIndex = this.m_Index
		this.m_Index = (this.m_Job - 1) * 2 + this.m_Sex

		let jobIndex = this.m_Job - 1
		for (let i = 0; i < this.mSelImg.length; i++) {
			this.mSelImg[i].visible = i == jobIndex
		}

		this.sel1.visible = this.m_Sex == 0
		this.sel2.visible = this.m_Sex == 1

		let curImg = this["roleImg" + this.m_CurImgIndex]
		let curGroup = this["roleGroup" + this.m_CurImgIndex]

		if (oldIndex != this.m_Index) {
			let isRight = this.m_Index > oldIndex ? -1 : 1
			let pos = 600

			this.AddTween(curGroup, {
				x: isRight * pos,
				alpha: 0
			}, 350)

			this.m_CurImgIndex = (this.m_CurImgIndex + 1) % 2

			let nextGroup = this["roleGroup" + this.m_CurImgIndex]

			this._LoadTexture(this.m_Index)
			nextGroup.x = -1 * isRight * pos
			nextGroup.alpha = 0

			this.AddTween(nextGroup, {
				x: 0,
				alpha: 1,
			}, 350)

			if (this.m_IsRandom) {
				this._DoRandom()
			}
		}
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
				let img = this["roleImg" + this.m_CurImgIndex] as egret.Bitmap
				img.texture = obj
				img.x = -(obj.textureWidth >> 1)
				img.y = - obj.textureHeight
				break
			}
		}
	}

	private Close() {
		egret.stopTick(this.Update, this)
		if (this.parent) {
			this.parent.removeChild(this)
			for (let data of this.m_Textures) {
				RES.destroyRes(data.path)
			}
		}
		WeatherFactory.getFlower().stopWeather()
	}

	private m_LastTime: number = 0

	private AddTween(target: any, prop: any, duration) {
		for (let i = this.m_TweenList.length - 1; i >= 0; i--) {
			let data = this.m_TweenList[i]
			if (data.target == target) {
				this.m_TweenList.splice(i, 1)
			}
		}
		let propVals = {}
		for (let key in prop) {
			propVals[key] = {
				prop: prop[key],
				startProp: target[key],
			}
		}
		this.m_TweenList.push(
			{
				time: 0,
				duration: duration,
				target: target,
				prop: propVals
			}
		)
	}

	private Update(timeStamp): boolean {
		if (!this.parent || !this.$stage) {
			return
		}

		let delta = timeStamp - this.m_LastTime;
		this.m_LastTime = timeStamp;

		if (this.time > 0) {
			if ((this.time -= delta) <= 0) {
				this._DoGo()
				return
			}
		}
		this.timeLabel.text = Math.floor(Math.max(this.time * 0.001, 0)) + "s后自动进入服务器"

		for (let i = this.m_TweenList.length - 1; i >= 0; i--) {
			let data = this.m_TweenList[i]
			data.time += delta
			let t = CreateRoleUI.circOut(data.time / data.duration)
			if (data.time >= data.duration) {
				t = 1
				this.m_TweenList.splice(i, 1)
			}
			for (let key in data.prop) {
				let propVal = data.prop[key]
				let val = propVal.startProp + (propVal.prop - propVal.startProp) * t
				data.target[key] = val
			}

		}
		return false
	}

	public static circOut(t: number) {
		return Math.sqrt(1 - (--t) * t);
	}

	private static SetDownState(obj: egret.DisplayObject) {
		let y = obj.y
		let x = obj.x
		obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
			this.y = y + 4
			this.x = x + 4
		}, obj);
		obj.addEventListener(egret.TouchEvent.TOUCH_CANCEL, function () {
			this.y = y
			this.x = x
		}, obj);
		obj.addEventListener(egret.TouchEvent.TOUCH_END, function () {
			this.y = y
			this.x = x
		}, obj);
		obj.addEventListener(egret.TouchEvent.TOUCH_MOVE, function () {
			this.y = y
			this.x = x
		}, obj);
	}
}