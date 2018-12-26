class MiniChatItemRender extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	/////////////////////////////////////////////////////////////////////////////
	// MiniChatItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected flagImg: eui.Image;
	protected roleNameTxt: ChatLabel;
	/////////////////////////////////////////////////////////////////////////////

	private m_IsClickLink = false
	private m_Context: MiniChatPanel

	childrenCreated() {
		this.roleNameTxt.addEventListener(egret.TextEvent.LINK, this.onLinkText, this)
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnTouchBegin, this)
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnTouchDown, this)
	}

	private _OnTouchBegin() {
		this.m_IsClickLink = false
	}

	private _OnTouchDown(e: egret.TouchEvent) {
		if (this.m_IsClickLink) {
			return
		}
		if (e.target == this.flagImg) {
			return
		}
		if (!this.m_Context) {
			this.m_Context = Util.GetParentByType(this, MiniChatPanel) as MiniChatPanel
		}
		this.m_Context.OpenChatPanel()
	}


	dataChanged() {
		super.dataChanged()
		this.width = MiniChatPanel.CANVAS_WIDTH
		this.roleNameTxt.width = this.width - this.roleNameTxt.x

		let data: ChatInfoData = this.data
		let type = data.type
		if (type != null) {
			this.flagImg.source = ChatPanel.GetFlagImg(data.type)
			let shardStr = GameGlobal.Chat.analyzeCn(this.data) //添加分享内容

			if (data.IsTipType()) {
				this.roleNameTxt.textFlow = TextFlowMaker.generateTextFlow(data.str + shardStr)
			} else if (type == ChatType.Normal || type == ChatType.NormalPublic || type == ChatType.Guild) {
				// var n = MiniChatItemRender.filterContentStr(this.data.str+shardStr);
				var n = MiniChatItemRender.filterContentStr(this.data.str);
				let name
				if (data.id == GameGlobal.GameLogic.actorModel.actorID) {
					name = "<font color = '0x83dafe'><u>" + MiniChatItemRender.getNameStr(this.data.name) + "</u></font>";
				} else {
					name = "<font color = '0x83dafe'><a href='event:" + data.id + "'><u>" + MiniChatItemRender.getNameStr(this.data.name) + "</u></a></font>";
				}
				if (shardStr || type == ChatType.NormalPublic) {
					this.roleNameTxt.textFlow = TextFlowMaker.generateTextFlow(name + n + shardStr);
				} else {
					this.roleNameTxt.SetText(TextFlowMaker.generateTextFlow(name), n)
				}
			}
			this.validateNow()
		}
	}



	private onLinkText(e: egret.TextEvent) {
		this.m_IsClickLink = true
		GameGlobal.Chat.HandleChatShare(e, this.data)
	}

	static filterContentStr(str) {
		var t = "";
		if (str) {
			t = str;
			for (var e = "<",
				i = "&lt;",
				s = t.indexOf(e, 0); s >= 0;) t = t.replace(e, i),
					s = t.indexOf(e, s + i.length)
		}
		return t
	}
	static getImageSpaceStr(actorName, lab) {
		let nameWidth = actorName.width
		lab.text = " "
		let str = ""
		for (let s = lab.textWidth, n = Math.ceil(actorName.width / s), a = 0; n > a; a++) {
			str += " "
		}
		return str
	}

	static getNameStr(name) {
		return name ? "[" + name + "]" : ""
	}

	static IMAGE_POS_X = -1
}