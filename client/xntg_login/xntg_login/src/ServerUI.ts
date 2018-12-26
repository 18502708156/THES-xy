class ServerUI extends egret.DisplayObjectContainer {
	public constructor() {
		super()
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private bg: egret.Bitmap
	private m_LeftScrollView: ServerScrollView
	private m_RightScrollView: ServerScrollView
	private PlayerInfo: GetPlayerServerInfoData
	
	public static COLOR = 0x6b300a

	private onAddToStage(event: egret.Event) {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		//this.PlayerInfo = 
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

		let b3 = new egret.Bitmap
		b3.texture = Main.Instance.GetImg("_ui_sbm_002@20_9_20_9")
		b3.x = -323
		b3.y = 189
		b3.height = 842
		b3.width = 217
		b3.scale9Grid = new egret.Rectangle(21, 10, 1, 1)
		this.addChild(b3)

		let b2 = new egret.Bitmap
		b2.texture = Main.Instance.GetImg("_ui_sbm_002@20_9_20_9")
		b2.x = -100
		b2.y = 189
		b2.height = 842
		b2.width = 423
		b2.scale9Grid = new egret.Rectangle(21, 10, 1, 1)
		this.addChild(b2)

		// let title = new egret.TextField
		// title.x = -246
		// title.y = 125
		// title.width = 463
		// title.height = 22
		// title.textAlign = egret.HorizontalAlign.CENTER
		// title.size = 22
		// title.textColor = 0xbfedfc
		// title.text = "选择服务器"
		let btitle = new egret.Bitmap
		btitle.texture = Main.Instance.GetImg("_ui_cj_bm_fuwuqixuanzhe")
		btitle.x = -93
		btitle.y = 115
		this.addChild(btitle)

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
		rightScroll.x = b2.x
		rightScroll.y = b2.y + 10
		rightScroll.width = b2.width
		rightScroll.height = b2.height - 20
		this.addChild(rightScroll)
		this.m_RightScrollView = new ServerScrollView(rightScroll, ServerUIItem2, this._RightClick, this)

		let leftScroll = new egret.ScrollView
		leftScroll = new egret.ScrollView
		leftScroll.x = b3.x + 2
		leftScroll.y = b3.y + 10
		leftScroll.width = b3.width
		leftScroll.height = b3.height - 20
		this.addChild(leftScroll)
		this.m_LeftScrollView = new ServerScrollView(leftScroll, ServerUIItem1, this._LeftClick, this)
		this.m_LeftScrollView.SetDatas(GameServerData.PageData)
		this.m_LeftScrollView.SelectIndex(0)

		GameServerData.Callback = this.DoServerData
		GameServerData.ThisObject = this
	}

	private DoServerData(page: number): void {
		let data = GameServerData.PageData[this.m_LeftScrollView.GetSelectIndex()]
		if (data.index == page) {
			this.m_RightScrollView.SetDatas(data.datas)
		}

	}

	private Close() {
		if (this.parent) {
			this.parent.removeChild(this)
		}

		GameServerData.Callback = null
		GameServerData.ThisObject = null
	}

	private _LeftClick(index: number) {
		if (index != 0) {
			GameServerData.GetPageData(GameServerData.PageData[index].index)
		}
		this.m_RightScrollView.SetDatas(GameServerData.PageData[index].datas)
	}

	private _RightClick(index: number) {
		let data = this.m_RightScrollView.GetData(index) as GameServerDescData
		let recent = GameServerData.PageData[0].datas
		for (let i = 0, len = recent.length; i < len; ++i) {
			if (recent[i].id == data.id) {
				Main.Instance.StartLoadGame(data)
				return
			}
		}
		Main.Instance.ShowCreateUI(data)
	}

	public static IsNewServer(serverId: number): boolean {
		let recent = GameServerData.PageData[0].datas
		for (let i = 0, len = recent.length; i < len; ++i) {
			if (recent[i].id == serverId) {
				return false
			}
		}
		return true
	}

	private _OnClickClose() {
		this.Close()
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

class ServerScrollView {

	private m_ScrollView: egret.ScrollView
	private m_Group: ServerGroup
	private m_ItemCls: any

	// private m_List: ServerUIItem1[] = []
	private m_CacheList: ServerUIItem1[] = []

	private m_Datas: any[] = []
	private m_Click: Function
	private m_ThisObject: any

	public constructor(scrollView: egret.ScrollView, itemCls: any, clickFunc: Function, thisObject: any) {
		this.m_ScrollView = scrollView
		this.m_Click = clickFunc
		this.m_ThisObject = thisObject
		this.m_ScrollView.addEventListener(egret.Event.CHANGE, this.OnChange, this)
		this.m_ItemCls = itemCls
		this.m_Group = new ServerGroup
		this.m_Group.width = scrollView.width
		this.m_Group.height = scrollView.height
		scrollView.setContent(this.m_Group)
	}

	private GetItme(): ServerUIItem1 {
		let item = this.m_CacheList.pop() || new this.m_ItemCls
		return item
	}

	private OnChange() {
		let top = this.m_ScrollView.scrollTop
		let bottom = top + this.m_ScrollView.height
		let itemHeight = this.m_ItemCls.Height
		for (let i = 0; i < this.m_Group.numChildren;) {
			let child = this.m_Group.getChildAt(i) as ServerUIItem1
			if (child.y < top - itemHeight || child.itemIndex >= this.m_Datas.length) {
				this.m_Group.removeChildAt(i)
				this.m_CacheList.push(child)
			} else {
				break
			}
		}
		for (let i = this.m_Group.numChildren - 1; i >= 0; --i) {
			let child = this.m_Group.getChildAt(i) as ServerUIItem1
			if (child.y > bottom || child.itemIndex >= this.m_Datas.length) {
				this.m_Group.removeChildAt(i)
				this.m_CacheList.push(child)
			} else {
				break
			}
		}
		while (true) {
			let first = this.m_Group.$children[0] as ServerUIItem1
			if (first == null) {
				if (!this._AddItem(0, -1)) {
					break
				}
			} else if (first.y >= top) {
				if (!this._AddItem(first.itemIndex - 1, -1)) {
					break
				}
			} else {
				break
			}
		}
		while (true) {
			let last = this.m_Group.$children[this.m_Group.numChildren - 1] as ServerUIItem1
			if (last == null) {
				break
			}
			if (last.y <= top + this.m_ScrollView.height - itemHeight) {
				if (!this._AddItem(last.itemIndex + 1, 1)) {
					break
				}
			} else {
				break
			}
		}
	}

	private _ItemClick(e: egret.TouchEvent) {
		let target = e.target as ServerUIItem1
		this.SelectIndex(target.itemIndex)
	}

	private m_Index: number = -1

	public GetSelectIndex(): number {
		return this.m_Index
	}

	public SelectIndex(index: number) {
		// if (index == this.m_Index) {
		// 	return
		// }
		this.m_Index = index
		for (let i = 0; i < this.m_Group.numChildren; ++i) {
			let child = this.m_Group.getChildAt(i) as ServerUIItem1
			if (child.light) {
				child.light.visible = index == child.itemIndex
			}
		}
		if (this.m_Click && this.m_ThisObject) {
			this.m_Click.call(this.m_ThisObject, index)
		}
	}

	private _AddItem(index: number, forward: number): boolean {
		if (this.m_Datas[index] == null) {
			return false
		}
		let item = this.GetItme()
		item.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ItemClick, this)
		item.itemIndex = index
		item.y = this.m_ItemCls.Height * index
		item.SetData(this.m_Datas[index])
		if (forward == -1) {
			this.m_Group.addChildAt(item, 0)
		} else {
			this.m_Group.addChild(item)
		}
		return true
	}

	public GetData(index: number): any {
		return this.m_Datas[index]
	}

	public SetDatas(datas: any[]): void {
		this.m_Datas = datas
		this.m_Group.height = datas.length * this.m_ItemCls.Height
		if (this.m_ScrollView.scrollTop == 0) {
			this.OnChange()
		} else {
			this.m_ScrollView.scrollTop = 0
		}
		for (let i = 0; i < this.m_Group.numChildren; ++i) {
			(this.m_Group.getChildAt(i) as ServerUIItem1).SetData(datas[i])
		}
	}
}

class ServerGroup extends egret.DisplayObjectContainer {

	constructor() {
		super()
		this.touchEnabled = true
	}

	$hitTest(stageX: number, stageY: number): egret.DisplayObject {
		let target = super.$hitTest(stageX, stageY);
		if (target) {
			return target;
		}
		if (!this.$visible || !this.touchEnabled) {
			return null;
		}
		let point = this.globalToLocal(stageX, stageY, egret.$TempPoint);
		let bounds = egret.$TempRectangle.setTo(0, 0, this.width, this.height);
		let scrollRect = this.$scrollRect;
		if (scrollRect) {
			bounds.x = scrollRect.x;
			bounds.y = scrollRect.y;
		}
		if (bounds.contains(point.x, point.y)) {
			return this;
		}
		return null;
	}
}

class ServerUIItem1 extends egret.DisplayObjectContainer {

	public static Width = 215
	public static Height = 70 + 10

	public light: egret.Bitmap
	public itemIndex: number
	private label: egret.TextField

	constructor() {
		super()
		this.touchEnabled = true
		this.touchChildren = false
		this.width = ServerUIItem1.Width
		this.height = ServerUIItem1.Height

		let bitmap = new egret.Bitmap
		bitmap.touchEnabled = false
		bitmap.texture = Main.Instance.GetImg("_ui_bt_fuwuqi02")
		bitmap.x = (this.width - bitmap.width) >> 1
		bitmap.y = (this.height - bitmap.height) >> 1
		this.addChild(bitmap)


		let bitmap2 = this.light = new egret.Bitmap
		bitmap2.touchEnabled = false
		bitmap2.texture = Main.Instance.GetImg("_ui_bt_fuwuqi0")
		bitmap2.x = (this.width - bitmap2.width) >> 1
		bitmap2.y = (this.height - bitmap2.height) >> 1
		this.addChild(bitmap2)

		// let bitmap2 = this.light = new egret.Bitmap
		// this.light.visible = false
		// bitmap2.touchEnabled = false
		// bitmap2.width = 211
		// bitmap2.height = 72
		// bitmap2.scale9Grid = new egret.Rectangle(15, 12, 28, 26)
		// bitmap2.texture = Main.Instance.GetImg("_ui_cjjs_p@22_22_22_22")
		// bitmap2.x = (this.width - bitmap2.width) >> 1
		// bitmap2.y = (this.height - bitmap2.height) >> 1
		// this.addChild(bitmap2)

		this.label = new egret.TextField
		this.label.touchEnabled = false
		this.label.size = 30
		this.label.textColor = ServerUI.COLOR
		this.label.width = bitmap.width
		this.label.height = bitmap.height
		this.label.x = bitmap.x
		this.label.y = bitmap.y
		this.label.textAlign = egret.HorizontalAlign.CENTER
		this.label.verticalAlign = egret.VerticalAlign.MIDDLE
		this.addChild(this.label)
	}

	public SetData(data: GameServerPageData) {
		this.label.text = data.name
	}
}

class ServerUIItem2 extends egret.DisplayObjectContainer {

	public static Width = 423
	public static Height = 121 + 10

	public itemIndex: number
	public flagImg: egret.Bitmap
	public hotImg: egret.Bitmap
	public headImg: egret.Bitmap
	private label: egret.TextField
	public Desc: GameServerDescData
	public playername: egret.TextField
	public kuangImg: egret.Bitmap

	constructor() {
		super()
		this.touchEnabled = true
		this.touchChildren = false
		this.width = ServerUIItem2.Width
		this.height = ServerUIItem2.Height

		let bitmap = new egret.Bitmap
		bitmap.touchEnabled = false
		bitmap.texture = Main.Instance.GetImg("_ui_bm_fuwuqibg@60_54_58_58")
		bitmap.width = ServerUIItem2.Width - 20
		bitmap.height = ServerUIItem2.Height - 10
		bitmap.scale9Grid = new egret.Rectangle(60, 54, 3, 3)
		bitmap.x = (this.width - bitmap.width) >> 1
		bitmap.y = (this.height - bitmap.height) >> 1
		this.addChild(bitmap)

		this.label = new egret.TextField
		this.label.touchEnabled = false
		this.label.size = 30
		this.label.textColor = ServerUI.COLOR
		this.label.height = bitmap.height
		this.label.x = 80
		this.label.y = bitmap.y
		this.label.verticalAlign = egret.VerticalAlign.MIDDLE
		this.addChild(this.label)

		this.flagImg = new egret.Bitmap
		this.flagImg.touchEnabled = false
		this.addChild(this.flagImg)

		this.hotImg = new egret.Bitmap
		this.hotImg.touchEnabled = false
		this.hotImg.x = 30
		this.hotImg.y = 50
		this.addChild(this.hotImg)

		this.headImg = new egret.Bitmap
		this.headImg.touchEnabled = false
		this.headImg.width = 81
		this.headImg.height = 81
		this.headImg.x = 305
		this.headImg.y = 15
		this.headImg.texture = Main.Instance.GetImg("_ui_bm_touxiangkuang02")
		this.headImg.visible = false
		this.addChild(this.headImg)

		this.playername = new egret.TextField
		this.playername.touchEnabled = false
		this.playername.size = 18
		this.playername.textColor = ServerUI.COLOR
		this.playername.height = bitmap.height
		this.playername.x = 300
		this.playername.y = bitmap.y + 100
		this.playername.width = 92
		this.playername.textAlign = egret.HorizontalAlign.CENTER
		this.addChild(this.playername)

		this.kuangImg = new egret.Bitmap
		this.kuangImg.texture = Main.Instance.GetImg("_ui_bm_touxiangkuang")
		this.kuangImg.width = 92
		this.kuangImg.height = 92
		this.kuangImg.x = 300
		this.kuangImg.y = 10
		this.kuangImg.visible = false
		this.addChild(this.kuangImg)
		
	}

	public SetData(data: GameServerDescData) {
		this.Desc = data
		this.label.text = data.name
		let status = data.GetStatus()
		this.flagImg.x = 11
		this.flagImg.y = 6
		this.flagImg.visible = true
		if (status) {
			// this.flagImg.texture = Main.Instance.GetImg(status == 1 ? "_ui_bm_xin" : "_ui_bm_weihuzhong")
			this.flagImg.texture = Main.Instance.GetImg(status == 1 ? "_ui_bm_xin" : "_ui_bm_hot")
			this.hotImg.texture = Main.Instance.GetImg("_ui_icon_tongchang")
			// this.flagImg.x = 11
			// this.flagImg.y = 6
			// this.flagImg.visible = true
		} else {
			this.flagImg.texture = Main.Instance.GetImg("_ui_bm_weihuzhong")
			this.hotImg.texture = Main.Instance.GetImg("_ui_icon_weihu")
			// this.flagImg.visible = false
		}
		this.SetHeadData()
	}

	public SetHeadData() {
		let addr = this.Desc.ip
		let datas = Main.Instance.playerServerData.data.recent
		let hasData = false
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i]
			if (addr == data.addr) {
				let job = data.job || 1
				let sex = data.sex || 0
				this.headImg.texture = Main.Instance.GetImg("head" + job + sex)
				this.playername.text = data.name
				this.kuangImg.visible = true
				this.headImg.visible = true
				hasData = true
				break;
			}
		}
		if (!hasData) {
			this.kuangImg.visible = false
			this.headImg.visible = false
			this.playername.text = ""
		}
	}
}