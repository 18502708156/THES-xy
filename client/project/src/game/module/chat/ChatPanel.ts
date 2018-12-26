class ChatPanel extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Main
    /////////////////////////////////////////////////////////////////////////////
    // ChatSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    protected bar: eui.TabBar;
    protected input: ChatInputView;
	protected scroller: ceui.CScroller
    /////////////////////////////////////////////////////////////////////////////
	
	private selectedIndex: number = 0

	public constructor() {
		super()
		this.skinName = "ChatSkin"
		let layout = new ceui.CVerticalLayout
		layout.paddingLeft = 3
		layout.paddingTop = 6
		layout.gap = 7
		this.list.layout = layout
		this.list.itemRenderer = ChatItem
		this.bar.dataProvider = new eui.ArrayCollection(["全 部", "世 界", "帮 会"])
		
		this.input.SetCallback((msg: string) => {
			this.OnSend(msg)
		})
		this._AddItemClick(this.bar, this._OnItemClick)
	}

	public OnOpen() {

		this.observe(MessageDef.PLAYER_COPY_NAME, this.setInputTxt)

		this.mCommonWindowBg.OnAdded(this)
		this.bar.selectedIndex = 0
		this._UpdateContent()
	}

	public OnClose() {
		this.list.dataProvider = null
		this.mCommonWindowBg.OnRemoved()
	}

	private setInputTxt(txt: string) {
		this.input.SetText(txt)
	}

	private _OnItemClick() {

		switch (this.bar.selectedIndex) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                if (!Chat.CanGuildChat()) {
                    this.bar.selectedIndex = this.selectedIndex
                    return
                }
                break;
        }
        this.selectedIndex = this.bar.selectedIndex

		this._UpdateContent()
	}

	private _UpdateContent() {
		let index = this.bar.selectedIndex
		let source
		if (index == 1) {
			source = GameGlobal.Chat.worldchatList
		} else if (index == 2) {
			source = GameGlobal.Chat.guildchatList
		} else {
			source = GameGlobal.Chat.minichatList	
		}
		this.list.dataProvider = source
	}

	private OnSend(msg: string) {
		Chat.Send(this.bar.selectedIndex, msg, () => {
			this.input.SetText("")
		})
	}

	public static GetFlagImg(type: number) {
		if (type == ChatType.Guild) {
			return "ui_lt_bm_jiazu"
		} else if (type == ChatType.Normal || type == ChatType.NormalPublic) {
			return "ui_lt_bm_shijie"
		} else {
			return "ui_lt_bm_xitong"
		}
	}
}

class ChatItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // ChatItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected content3: eui.Component;
    protected content2: eui.Component;
    protected content1: eui.Component;
    /////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		let data: ChatInfoData = this.data
		if (data.type) {
			
			switch (data.type) {
				case ChatType.Public:
				case ChatType.System:
					this.SetContent(3)
					break
				case ChatType.Normal:
				case ChatType.Guild:
				case ChatType.NormalPublic:
					if (data.type2 == 0) {
						this.SetContent(3)
					} else {
						if (data.id == GameGlobal.actorModel.actorID) {
							this.SetContent(2)
						} else {
							this.SetContent(1)
						}
					}
					break;
			}
		}
	}

	private SetContent(type: number) {
		let comp = this["content" + type] as eui.Component
		if (!comp.parent) {
			this.addChild(comp)
		}
		if (!comp.skinName) {
			comp.skinName = "ChatItem" + type +"Skin";
			(comp as any).roleNameTxt.addEventListener(egret.TextEvent.LINK, this.onLinkText, this);
			if((comp as any).contentTxt)
			{
				(comp as any).contentTxt.addEventListener(egret.TextEvent.LINK, this.onLinkText, this);
			}
		}
		this["SetData" + type](comp, this.data)
		for (let i = 1; i <= 3; i++) {
			let comp = this["content" + i] as eui.Component
			if (i != type) {
				DisplayUtils.removeFromParent(comp)
			}
		}
	}

	private onLinkText(e: egret.TextEvent) {
		GameGlobal.Chat.HandleChatShare(e, this.data)
	}


	private SetData1(comp: any, data: ChatInfoData) {
		this.SetChatData(comp, data)
	}

	private SetData2(comp: any, data: ChatInfoData) {
		this.SetChatData(comp, data)
	}

    /////////////////////////////////////////////////////////////////////////////
    // ChatItem1Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    // protected head: eui.Component;
    // protected flagImg: eui.Image;
    // protected roleNameTxt: eui.Label;
    // protected contentImg: eui.Image;
    // protected contentTxt: ChatLabel;
    /////////////////////////////////////////////////////////////////////////////

	private SetChatData(comp: any, data: ChatInfoData) {
		if (data.id == GameGlobal.actorModel.actorID) {
			comp.roleNameTxt.text = data.name
		} else {
			comp.roleNameTxt.textFlow = TextFlowMaker.generateTextFlow("<u><a href='event:" + data.id + "'>" +data.name + "</a></u>")
		}
        if(data.headframe)
			comp.head["imgFrame"].source = ResDataPath.GetHeadFrameImgName(data.headframe)
		UIHelper.SetHead(comp.head, data.job,data.sex)
		// ChatPanel.ReplaceFace(comp.contentTxt, data.str)
		// comp.contentTxt.text = data.str
		let shardStr =GameGlobal.Chat.analyzeCn(data) //添加分享内容
         

		if (shardStr || data.type == ChatType.NormalPublic) {
			comp.contentTxt.textFlow =  TextFlowMaker.generateTextFlow( data.str + shardStr); 
		} else {
			comp.contentTxt.text = data.str
		}

		// if (data.type == ChatType.Guild) {
		// 	comp.flagImg.source = "ui_lt_bm_jiazu"
		// } else {
		// 	comp.flagImg.source = "ui_lt_bm_shijie"
		// }
		comp.flagImg.source = ChatPanel.GetFlagImg(data.type)
	}

    /////////////////////////////////////////////////////////////////////////////
    // ChatItem3Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    // protected roleNameTxt: eui.Label;
    // protected flagImg: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private SetData3(comp: any, data: ChatSystemData) {
		comp.flagImg.source = ChatPanel.GetFlagImg(data.type)
		let shardStr =GameGlobal.Chat.analyzeCn(data) //添加分享内容
		
		comp.roleNameTxt.textFlow = TextFlowMaker.generateTextFlow(data.str+shardStr)
	}
}