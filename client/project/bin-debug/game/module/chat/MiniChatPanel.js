var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MiniChatPanel = (function (_super) {
    __extends(MiniChatPanel, _super);
    function MiniChatPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectedIndex = 0;
        return _this;
    }
    MiniChatPanel.prototype.childrenCreated = function () {
        var _this = this;
        GameGlobal.Chat.sendInitChat();
        GameGlobal.MessageCenter.addListener(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, this.newMsg, this);
        GameGlobal.MessageCenter.addListener(MessageDef.PLAYER_COPY_NAME, this.setInputTxt, this);
        this.input.SetCallback(function (msg) {
            _this.OnSend(msg);
        });
        this.list.layout = new ceui.CVerticalLayout;
        this.list.itemRenderer = MiniChatItemRender;
        this.list.dataProvider = null;
        this.btnGp.selectedIndex = 0;
        this.selectedIndex = 0;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.btnClip.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.msgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.btnGp.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTabTap, this);
        GameGlobal.MessageCenter.addListener(MessageDef.MINICHATSCAL, this.onlyMini, this);
        GameGlobal.MessageCenter.addListener(MessageDef.MINICHATSCAL_ALL, this.onlyAll, this);
        if (MiniChatPanel.IS_ZOOM) {
            this.currentState = 'all';
            this.scrollHeight = 210;
        }
        else {
            this.currentState = 'simple';
            this.scrollHeight = 104;
        }
        this.validateNow();
        MiniChatPanel.CANVAS_WIDTH = this.GetCanvasWidth();
        egret.setTimeout(function () {
            _this.UpdatePos();
            GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_CHAT_ZOOM);
        }, this, 200);
    };
    MiniChatPanel.prototype.GetCanvasWidth = function () {
        var canvas = this.canvas;
        if (canvas.left && canvas.right) {
            return GameGlobal.StageUtils.GetWidth() - canvas.left - canvas.right;
        }
        return canvas.width;
    };
    MiniChatPanel.prototype.openPanel = function () {
        this._DoRefresh();
        // this.canvas.addEventListener(egret.Event.RESIZE, this.onResize, this);
        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
    };
    MiniChatPanel.prototype.closePanel = function () {
        // this.canvas.removeEventListener(egret.Event.RESIZE, this.onResize, this);
        egret.MainContext.instance.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
    };
    MiniChatPanel.prototype.onResize = function () {
        var _this = this;
        MiniChatPanel.CANVAS_WIDTH = this.GetCanvasWidth();
        UIHelper.ListRefresh(this.list);
        egret.setTimeout(function () {
            _this.UpdatePos();
            GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_CHAT_ZOOM);
        }, this, 200);
    };
    MiniChatPanel.prototype._OnTabTap = function () {
        switch (this.btnGp.selectedIndex) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                if (!Chat.CanGuildChat()) {
                    this.btnGp.selectedIndex = this.selectedIndex;
                    return;
                }
                break;
        }
        this.selectedIndex = this.btnGp.selectedIndex;
        this.UpdateChatList();
    };
    MiniChatPanel.prototype._OnClick = function (e) {
        switch (e.target) {
            case this.btnClip:
                if (ViewManager.ins().isShow(GameCityPanel)) {
                    MiniChatPanel.GAME_CITY_CLICK = true;
                }
                else {
                    MiniChatPanel.PLAY_FUNC_CLICK = true;
                }
                this.onScalingChat();
                break;
            case this.msgBtn:
                ViewManager.ins().open(PlayerChatpanel, GameGlobal.PlayerInfoModel.getUserDate(), "MiniChatPanel");
                this.redPoint.visible = false;
                break;
            case this.bg:
                this.OpenChatPanel();
                break;
        }
    };
    MiniChatPanel.prototype.SetAll = function () {
        this.currentState = 'all';
        this.validateNow();
        this.scrollHeight = 210;
        this.upDateChat(true);
    };
    MiniChatPanel.prototype.SetSimple = function () {
        this.currentState = 'simple';
        this.validateNow();
        this.scrollHeight = 104;
        this.upDateChat(false);
    };
    MiniChatPanel.prototype.onScalingChat = function () {
        if (this.currentState == 'all') {
            this.SetSimple();
        }
        else {
            this.SetAll();
        }
    };
    MiniChatPanel.prototype.onlyMini = function () {
        if (this.currentState == 'simple') {
            return;
        }
        this.SetSimple();
    };
    MiniChatPanel.prototype.onlyAll = function () {
        if (this.currentState == 'all') {
            return;
        }
        this.SetAll();
    };
    MiniChatPanel.prototype.upDateChat = function (bZoom) {
        MiniChatPanel.IS_ZOOM = bZoom;
        this.UpdatePos();
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_CHAT_ZOOM, bZoom);
        this._DoRefresh();
    };
    MiniChatPanel.prototype.OpenChatPanel = function () {
        ViewManager.ins().open(ChatPanel);
    };
    MiniChatPanel.prototype.UpdatePos = function () {
        var y = 0;
        if (!MiniChatPanel.IS_ZOOM) {
            y = 158;
        }
        this.localToGlobal(0, y, egret.$TempPoint);
        MiniChatPanel.POS = egret.$TempPoint.y;
    };
    MiniChatPanel.prototype.UpdateChatList = function () {
        var dataProvider;
        if (this.btnGp.selectedIndex == 1) {
            dataProvider = GameGlobal.Chat.worldchatList;
        }
        else if (this.btnGp.selectedIndex == 2) {
            dataProvider = GameGlobal.Chat.guildchatList;
        }
        else if (this.btnGp.selectedIndex == 3) {
            dataProvider = GameGlobal.Chat.crosschatList;
        }
        else {
            dataProvider = GameGlobal.Chat.minichatList;
        }
        if (this.list.dataProvider != dataProvider) {
            // if (this.list.dataProvider) {
            //     this.list.dataProvider.removeEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this)
            // }
            this.list.dataProvider = dataProvider;
            // this.list.dataProvider.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this)
            // this.onCollectionChange()
        }
    };
    // private onCollectionChange() {
    // this.canvas.viewport.contentHeight > this.canvas.height && (this.canvas.viewport.scrollV = this.canvas.viewport.contentHeight - this.canvas.height)
    // egret.setTimeout(this.CollectionChange, this, 1000)
    // }
    // private CollectionChange() {
    // this.canvas.viewport.contentHeight > this.canvas.height && (this.canvas.viewport.scrollV = this.canvas.viewport.contentHeight - this.canvas.height)
    // }
    MiniChatPanel.prototype._DoRefresh = function () {
        this.UpdateChatList();
        // this.list.validateNow();
        // let pos = this.GetListItemHeight() - this.scrollHeight;
        // this.canvas.stopAnimation();
        // let touch = this.canvas.$Scroller[9];
        // touch.maxScrollPos = this.list.contentHeight;
        // touch.throwTo(pos > 0 ? pos : 0);
    };
    // private GetListItemHeight(): number {
    //     let h = 0
    //     let len = this.list.numElements;
    // for (let i = 0; i < len; ++i) {
    //     h += (this.list.getChildAt(i) as MiniChatItemRender).height;
    // }
    //     return len * 30 + (len - 1) * 5;
    // }
    MiniChatPanel.Refresh = function () {
        if (!ViewManager.ins().isShow(GameSceneView)) {
            return;
        }
        var view = ViewManager.ins().getView(GameSceneView);
        view.miniChat._DoRefresh();
    };
    MiniChatPanel.prototype.newMsg = function (newMsgVisible, msgBtnVisible) {
        this.redPoint.visible = newMsgVisible;
        this.msgBtn.visible = msgBtnVisible;
    };
    MiniChatPanel.prototype.setInputTxt = function (txt, notTip) {
        if (notTip === void 0) { notTip = false; }
        this.input.SetText(txt);
        if (notTip) {
            return;
        }
        GameGlobal.UserTips.showTips("已复制名称至聊天内容");
    };
    MiniChatPanel.prototype.OnSend = function (msg) {
        if (Chat.Send(this.btnGp.selectedIndex, msg)) {
            this.input.SetText("");
        }
    };
    // 更新聊天框对应组件坐标
    MiniChatPanel.UpdateViewPos = function (target, parent) {
        if (parent === void 0) { parent = null; }
        if (!parent) {
            parent = target.parent;
        }
        if (parent) {
            parent.globalToLocal(0, MiniChatPanel.POS, egret.$TempPoint);
            target.y = egret.$TempPoint.y;
        }
        else {
            target.y = MiniChatPanel.POS;
        }
    };
    /////////////////////////////////////////////////////////////////////////////
    MiniChatPanel.GAME_CITY_CLICK = false;
    MiniChatPanel.PLAY_FUNC_CLICK = false;
    MiniChatPanel.IS_ZOOM = true;
    MiniChatPanel.POS = 860;
    MiniChatPanel.CANVAS_WIDTH = 644;
    return MiniChatPanel;
}(eui.Component));
__reflect(MiniChatPanel.prototype, "MiniChatPanel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=MiniChatPanel.js.map