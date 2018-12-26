class MiniChatPanel extends eui.Component implements eui.UIComponent {
    /////////////////////////////////////////////////////////////////////////////
    // MiniChatPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Image;
    protected canvas: eui.Scroller;
    protected list: eui.List;
    protected btnClip: eui.Button;
    protected btnVipUp: eui.Button;
    protected btnGp: eui.TabBar;
    protected msgBtn: eui.Button;
    protected redPoint: eui.Image;
    public input: ChatInputView;
    /////////////////////////////////////////////////////////////////////////////

    public static GAME_CITY_CLICK = false
    public static PLAY_FUNC_CLICK = false


    private m_Context: GameSceneView;
    public static IS_ZOOM: boolean = true;
    public static POS: number = 860
    // public static IS_ZOOM: boolean = false;
    // public static POS: number = 1018
    private scrollHeight: number;
    private selectedIndex: number = 0

    public static CANVAS_WIDTH = 644

    childrenCreated() {
        GameGlobal.MessageCenter.addListener(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, this.newMsg, this)
        GameGlobal.MessageCenter.addListener(MessageDef.PLAYER_COPY_NAME, this.setInputTxt, this)

        this.input.SetCallback((msg: string) => {
            this.OnSend(msg)
        })

        this.list.layout = new ceui.CVerticalLayout
        this.list.itemRenderer = MiniChatItemRender;
        this.list.dataProvider = null;

        this.btnGp.selectedIndex = 0;
        this.selectedIndex = 0
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
        this.btnClip.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
        this.msgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
        this.btnGp.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTabTap, this);

        GameGlobal.MessageCenter.addListener(MessageDef.MINICHATSCAL, this.onlyMini, this);
        GameGlobal.MessageCenter.addListener(MessageDef.MINICHATSCAL_ALL, this.onlyAll, this);

        if (MiniChatPanel.IS_ZOOM) {
            this.currentState = 'all';
            this.scrollHeight = 210;
        } else {
            this.currentState = 'simple';
            this.scrollHeight = 104;
        }
        this.validateNow()

        MiniChatPanel.CANVAS_WIDTH = this.GetCanvasWidth()

        egret.setTimeout(() => {
            this.UpdatePos()
            GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_CHAT_ZOOM)
        }, this, 200)
    }

    private GetCanvasWidth() {
        let canvas = this.canvas
        if (canvas.left && canvas.right) {
            return GameGlobal.StageUtils.GetWidth() - canvas.left - canvas.right
        }
        return canvas.width
    }

    openPanel() {
        this._DoRefresh()
        // this.canvas.addEventListener(egret.Event.RESIZE, this.onResize, this);
        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
    }

    closePanel() {
        // this.canvas.removeEventListener(egret.Event.RESIZE, this.onResize, this);
        egret.MainContext.instance.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
    }

    private onResize(): void {
        MiniChatPanel.CANVAS_WIDTH = this.GetCanvasWidth()
        UIHelper.ListRefresh(this.list)

        egret.setTimeout(() => {
            this.UpdatePos()
            GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_CHAT_ZOOM)
        }, this, 200)
    }

    private _OnTabTap() {
        switch (this.btnGp.selectedIndex) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                if (!Chat.CanGuildChat()) {
                    this.btnGp.selectedIndex = this.selectedIndex
                    return
                }
                break;
        }
        this.selectedIndex = this.btnGp.selectedIndex
        this.UpdateChatList()
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.target) {
            case this.btnClip:
                if (ViewManager.ins().isShow(GameCityPanel)) {
                    MiniChatPanel.GAME_CITY_CLICK = true
                } else {
                    MiniChatPanel.PLAY_FUNC_CLICK = true
                }
                this.onScalingChat()
                break
            case this.msgBtn:
                ViewManager.ins().open(PlayerChatpanel, GameGlobal.PlayerInfoModel.getUserDate(),"MiniChatPanel");
                this.redPoint.visible = false;
                break
            case this.bg:
                this.OpenChatPanel()
                break
        }
    }

    private SetAll() {
        this.currentState = 'all';
        this.validateNow()
        this.scrollHeight = 210;
        this.upDateChat(true)
    }

    private SetSimple() {
        this.currentState = 'simple';
        this.validateNow()
        this.scrollHeight = 104;
        this.upDateChat(false)
    }

    public onScalingChat() {
        if (this.currentState == 'all') {
            this.SetSimple()
        } else {
            this.SetAll()
        }
    }

    private onlyMini() {
        if (this.currentState == 'simple') {
            return
        }
        this.SetSimple()
    }

    private onlyAll() {
        if (this.currentState == 'all') {
            return
        }
        this.SetAll()
    }

    public upDateChat(bZoom: boolean) {
        MiniChatPanel.IS_ZOOM = bZoom
        this.UpdatePos()

        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_CHAT_ZOOM, bZoom)
        this._DoRefresh();
    }

    public OpenChatPanel() {
        ViewManager.ins().open(ChatPanel)
    }

    private UpdatePos() {
        let y = 0
        if (!MiniChatPanel.IS_ZOOM) {
            y = 158
        }
        this.localToGlobal(0, y, egret.$TempPoint)
        MiniChatPanel.POS = egret.$TempPoint.y
    }

    private UpdateChatList() {
        let dataProvider
        if (this.btnGp.selectedIndex == 1) {
            dataProvider = GameGlobal.Chat.worldchatList
        } else if (this.btnGp.selectedIndex == 2) {
            dataProvider = GameGlobal.Chat.guildchatList;
        } else {
            dataProvider = GameGlobal.Chat.minichatList;
        }
        if (this.list.dataProvider != dataProvider) {
            // if (this.list.dataProvider) {
            //     this.list.dataProvider.removeEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this)
            // }
            this.list.dataProvider = dataProvider
            // this.list.dataProvider.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this)
            // this.onCollectionChange()
        }
    }

    // private onCollectionChange() {
        // this.canvas.viewport.contentHeight > this.canvas.height && (this.canvas.viewport.scrollV = this.canvas.viewport.contentHeight - this.canvas.height)
        // egret.setTimeout(this.CollectionChange, this, 1000)
    // }

    // private CollectionChange() {
        // this.canvas.viewport.contentHeight > this.canvas.height && (this.canvas.viewport.scrollV = this.canvas.viewport.contentHeight - this.canvas.height)
    // }

    private _DoRefresh() {
        this.UpdateChatList()
        // this.list.validateNow();
        // let pos = this.GetListItemHeight() - this.scrollHeight;
        // this.canvas.stopAnimation();
        // let touch = this.canvas.$Scroller[9];
        // touch.maxScrollPos = this.list.contentHeight;
        // touch.throwTo(pos > 0 ? pos : 0);
    }

    // private GetListItemHeight(): number {
    //     let h = 0
    //     let len = this.list.numElements;
    // for (let i = 0; i < len; ++i) {
    //     h += (this.list.getChildAt(i) as MiniChatItemRender).height;
    // }
    //     return len * 30 + (len - 1) * 5;
    // }

    public static Refresh() {
        if (!ViewManager.ins().isShow(GameSceneView)) {
            return
        }
        let view = <GameSceneView>ViewManager.ins().getView(GameSceneView)
        view.miniChat._DoRefresh()
    }

    newMsg(newMsgVisible: boolean, msgBtnVisible: boolean) {
        this.redPoint.visible = newMsgVisible;
        this.msgBtn.visible = msgBtnVisible;
    }

    setInputTxt(txt: string, notTip = false) {
        this.input.SetText(txt)
        if (notTip) {
            return
        }
        GameGlobal.UserTips.showTips("已复制名称至聊天内容");
    }

    public OnSend(msg: string) {
        if (Chat.Send(this.btnGp.selectedIndex, msg)) {
            this.input.SetText("")
        }
    }

    // 更新聊天框对应组件坐标
    public static UpdateViewPos(target: egret.DisplayObject, parent: egret.DisplayObject = null) {
        if (!parent) {
            parent = target.parent
        }
        if (parent) {
            parent.globalToLocal(0, MiniChatPanel.POS, egret.$TempPoint)
            target.y = egret.$TempPoint.y
        } else {
            target.y = MiniChatPanel.POS
        }
    }

}