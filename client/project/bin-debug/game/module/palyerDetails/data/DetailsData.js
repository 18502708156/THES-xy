var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DetailsData = (function () {
    function DetailsData() {
        this.detailsUserIdArr = [];
        this.renameCount = 0;
        GameGlobal.MessageCenter.addListener(MessageDef.PLAYER_PREVITE_CHAT, this.updateData, this);
        GameGlobal.MessageCenter.addListener(MessageDef.PLAYER_PREVITE_CLOSE, this.updateData, this);
        this.chatUserListData = new eui.ArrayCollection();
        this.chatListData = {};
        this.userData = new Sproto.chat_data;
    }
    DetailsData.prototype.getChatListData = function () {
        return this.chatListData;
    };
    DetailsData.prototype.getchatUserListData = function () {
        return this.chatUserListData;
    };
    DetailsData.prototype.setUserData = function (userData) {
        this.userData = userData;
    };
    DetailsData.prototype.getUserData = function () {
        return this.userData;
    };
    DetailsData.prototype.getUserIdArr = function () {
        return this.detailsUserIdArr;
    };
    DetailsData.prototype.updateData = function (req, type) {
        if (type == DetailsType.initData) {
            var uesrData = {};
            uesrData["newMsg"] = true;
            uesrData["session"] = req.session;
            uesrData["info"] = this.userData;
            if (this.chatUserListData.length > 0) {
                var existChatUser = false;
                for (var i = 0; i < this.chatUserListData.length; i++) {
                    if (this.chatUserListData.getItemAt(i).session == req.session) {
                        this.chatListData[req.session] = new eui.ArrayCollection(req.chatData.reverse());
                        existChatUser = true;
                    }
                }
                if (!existChatUser) {
                    this.chatUserListData.addItemAt(uesrData, 0);
                    this.chatUserListData.refresh();
                    this.chatListData[req.session] = new eui.ArrayCollection(req.chatData.reverse());
                }
            }
            else {
                this.chatUserListData.addItemAt(uesrData, 0);
                this.chatUserListData.refresh();
                this.chatListData[req.session] = new eui.ArrayCollection(req.chatData.reverse());
            }
            GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, true, true);
        }
        else if (type == DetailsType.newMsg) {
            GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, true, true);
            var existChatUser = false;
            for (var i = 0; i < this.chatUserListData.length; i++) {
                if (this.chatUserListData.getItemAt(i).session == req.session) {
                    if (req.chatData.id != GameGlobal.actorModel.actorID)
                        this.chatUserListData.getItemAt(i).newMsg = true;
                    this.chatListData[req.session].addItemAt(req.chatData, 0);
                    existChatUser = true; //列表上有聊天的用户
                }
            }
            if (!existChatUser) {
                GameGlobal.PlayerInfoModel.sendInitChat(req.chatData.id);
            }
        }
        else if (type == DetailsType.normal) {
            if (this.chatUserListData.length > 0) {
                req.session = this.chatUserListData.getItemAt(0).session;
                this.userData = this.chatUserListData.getItemAt(0).info;
            }
            else
                this.userData = new Sproto.chat_data;
        }
        for (var i = 0; i < this.chatUserListData.length; i++)
            this.detailsUserIdArr[i] = this.chatUserListData.getItemAt(i).info.id;
        if (this.chatUserListData.length == 0)
            this.detailsUserIdArr = [];
        // for (let i = 0; i < this.chatUserListData.length; i++) {
        //     if (this.chatUserListData.getItemAt(i).newMsg) {
        //         GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, true, true);
        //         break
        //     }
        // }
        for (var key in this.chatListData) {
            if (this.chatListData[key].length > 50)
                this.chatListData[key].removeItemAt(this.chatListData[key].length - 1);
        }
    };
    return DetailsData;
}());
__reflect(DetailsData.prototype, "DetailsData");
var DetailsType;
(function (DetailsType) {
    DetailsType[DetailsType["normal"] = 0] = "normal";
    DetailsType[DetailsType["initData"] = 1] = "initData";
    DetailsType[DetailsType["newMsg"] = 2] = "newMsg";
})(DetailsType || (DetailsType = {}));
//# sourceMappingURL=DetailsData.js.map