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
var PlayerChatpanel = (function (_super) {
    __extends(PlayerChatpanel, _super);
    function PlayerChatpanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PlayerChatSkin";
        _this.input.SetCallback(function (msg) {
            _this.sendChat(msg);
        });
        return _this;
    }
    PlayerChatpanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.commonWindowBg.SetTitle("私聊");
        // this.touchEnabled = false;
    };
    PlayerChatpanel.prototype.initData = function () {
        this.chatList.layout = new ceui.CVerticalLayout;
        this.chatList.itemRenderer = DetailsChatItem;
        this.chatUserList.itemRenderer = DetailsUserItem;
        this.chatUserList.dataProvider = GameGlobal.PlayerInfoModel.getchatUserListData();
        this.chatUserList.validateNow();
    };
    PlayerChatpanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.PLAYER_PREVITE_CHAT, this.updateContent);
        this.observe(MessageDef.PLAYER_PREVITE_CLOSE, this.updateContent);
        this.observe(MessageDef.SEND_MSG_INFO_SUCCESS, this.textInOn);
        this.observe(MessageDef.PLAYER_PREVITE_CHAT, this.UpdateList);
        this.observe(MessageDef.PLAYER_CHECK_ONLINE, this.UpdateList);
        this.AddClick(this.commonWindowBg.closeBtn, this.onClick);
        this.AddItemClick(this.chatUserList, this.onItemClick);
        this.AddTimer(3000, 0, this.checkOnline);
        this.palyerId = param[0].id;
        GameGlobal.PlayerInfoModel.setUserDate(param[0]);
        this.chatUserList.selectedIndex = 0;
        if (param[0].id != null)
            GameGlobal.PlayerInfoModel.sendInitChat(param[0].id);
        if (param[1]) {
            var chatUsersData = GameGlobal.PlayerInfoModel.getchatUserListData();
            for (var i = 0; i < chatUsersData.length; i++) {
                if (chatUsersData.getItemAt(i).newMsg) {
                    this.chatUserList.selectedIndex = i;
                    this.palyerId = chatUsersData.getItemAt(i).info.id;
                    break;
                }
            }
        }
    };
    PlayerChatpanel.prototype.OnClose = function () {
        this.chatUserList.dataProvider = null;
        this.checkMsg();
    };
    PlayerChatpanel.prototype.checkOnline = function () {
        GameGlobal.PlayerInfoModel.sendonLine();
    };
    PlayerChatpanel.prototype.onItemClick = function (e) {
        this.session = this.chatUserList.selectedItem.session;
        this.touchTo();
    };
    PlayerChatpanel.prototype.checkMsg = function () {
        var chatUsersData = GameGlobal.PlayerInfoModel.getchatUserListData();
        for (var i = 0; i < chatUsersData.length; i++) {
            if (chatUsersData.getItemAt(i).newMsg) {
                break;
            }
            if (chatUsersData.length - 1 == i)
                GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, false, true);
        }
        if (chatUsersData.length == 0)
            GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, false, false);
    };
    PlayerChatpanel.prototype.onClick = function () {
        var chatUsersData = GameGlobal.PlayerInfoModel.getchatUserListData();
        chatUsersData.removeAll();
        var chatDatas = GameGlobal.PlayerInfoModel.getChatListData();
        chatDatas = {};
        GameGlobal.PlayerInfoModel.setUserDate(new Sproto.chat_data);
        this.checkMsg();
    };
    PlayerChatpanel.prototype.touchTo = function () {
        if (this.session) {
            this.session = this.session;
            var n = this.session.indexOf(":");
            var id1 = this.session.slice(0, n);
            var id2 = this.session.slice(n + 1, this.session.length);
            if (parseInt(id1) == GameGlobal.GameLogic.actorModel.actorID)
                this.palyerId = parseInt(id2);
            else
                this.palyerId = parseInt(id1);
        }
        else
            this.palyerId = null;
        this.chatUserList.validateNow();
        if (this.chatUserList.selectedItem)
            this.chatList.dataProvider = GameGlobal.PlayerInfoModel.getChatListData()[this.chatUserList.selectedItem.session];
        else
            this.chatList.dataProvider = new eui.ArrayCollection([]);
        this.chatList.validateNow();
        // if (this.chatList.contentHeight >= this.chatScroller.height)
        // 	this.chatScroller.viewport.scrollV = this.chatScroller.viewport.contentHeight - this.chatScroller.height
    };
    PlayerChatpanel.prototype.updateContent = function (req) {
        var chatUsersData = GameGlobal.PlayerInfoModel.getchatUserListData();
        var chatDatas = GameGlobal.PlayerInfoModel.getChatListData();
        if (chatUsersData.length == 0)
            ViewManager.ins().close(PlayerChatpanel);
        this.chatUserList.dataProvider = chatUsersData;
        if (this.chatUserList.selectedIndex == -1)
            this.chatUserList.selectedIndex = 0;
        // for (let i = 0; i < chatUsersData.length; i++) {
        // 	if (chatUsersData.getItemAt(i).session == req.session) {
        // 		this.chatUserList.selectedIndex = i;
        // 	}
        // }
        this.session = req.session;
        this.touchTo();
    };
    PlayerChatpanel.prototype.sendChat = function (msg) {
        if (msg == "") {
            UserTips.ins().showTips("内容不可为空");
        }
        else {
            var role = SubRoles.ins().GetRoleData();
            var selfChatData = new Sproto.chat_data;
            this.touchTo();
            if (this.palyerId != null)
                GameGlobal.PlayerInfoModel.sendChat(this.palyerId, msg);
            else
                UserTips.ins().showTips("没有私聊对象");
        }
    };
    PlayerChatpanel.prototype.textInOn = function () {
        this.input.SetText("");
    };
    PlayerChatpanel.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.chatUserList);
    };
    PlayerChatpanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PlayerChatpanel;
}(BaseEuiView));
__reflect(PlayerChatpanel.prototype, "PlayerChatpanel");
var DetailsChatItem = (function (_super) {
    __extends(DetailsChatItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DetailsChatItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "DetailsChatSkin";
        return _this;
    }
    DetailsChatItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    DetailsChatItem.prototype.dataChanged = function () {
        if (this.data.id == GameGlobal.GameLogic.actorModel.actorID)
            this.currentState = "self";
        else
            this.currentState = "other";
        _super.prototype.dataChanged.call(this);
        this.contentTxt.text = this.data.str;
        this.roleNameTxt.text = this.data.name;
        this.playerAvatar.setItemImg(ResDataPath.GetHeadImgName(this.data.job, this.data.sex));
    };
    return DetailsChatItem;
}(eui.ItemRenderer));
__reflect(DetailsChatItem.prototype, "DetailsChatItem");
var DetailsUserItem = (function (_super) {
    __extends(DetailsUserItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DetailsUserItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "ChatUeseItem";
        return _this;
    }
    DetailsUserItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    };
    DetailsUserItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.nameTxt.text = this.data.info.name;
        this.playerAvatar.setItemImg(ResDataPath.GetHeadImgName(this.data.info.job, this.data.info.sex));
        if (this.selected)
            this.data.newMsg = false;
        this.redPointImg.visible = this.data.newMsg;
        this.setOnLine();
    };
    DetailsUserItem.prototype.setOnLine = function () {
        var req;
        if (GameGlobal.PlayerInfoModel.detailsData.onlineReq)
            req = GameGlobal.PlayerInfoModel.detailsData.onlineReq;
        else
            return;
        if (req.onlineStatus[this.itemIndex]) {
            this.onLineTxt.textColor = 0x019704;
            this.onLineTxt.text = "在线";
        }
        else {
            this.onLineTxt.textColor = 0x7C7C7C;
            this.onLineTxt.text = "离线";
        }
    };
    DetailsUserItem.prototype.onTouch = function () {
        this.redPointImg.visible = false;
        this.data.newMsg = false;
    };
    DetailsUserItem.prototype.close = function () {
        var user = GameGlobal.PlayerInfoModel.getchatUserListData();
        for (var i = 0; i < user.length; i++) {
            if (user.getItemAt(i).session == this.data.session) {
                user.removeItemAt(i);
                delete GameGlobal.PlayerInfoModel.getChatListData()[this.data.session];
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_PREVITE_CLOSE, new Sproto.sc_chat_private_init_msg_request, DetailsType.normal);
    };
    return DetailsUserItem;
}(eui.ItemRenderer));
__reflect(DetailsUserItem.prototype, "DetailsUserItem");
//# sourceMappingURL=PlayerChatpanel.js.map