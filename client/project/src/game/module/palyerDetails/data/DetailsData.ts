class DetailsData {
    protected chatListData;
    protected chatUserListData: eui.ArrayCollection;
    protected userData: Sproto.chat_data;
    protected detailsUserIdArr = [];
    public renameCount = 0;
    onlineReq: Sproto.cs_chat_check_online_response;

    public constructor() {
        GameGlobal.MessageCenter.addListener(MessageDef.PLAYER_PREVITE_CHAT, this.updateData, this)
        GameGlobal.MessageCenter.addListener(MessageDef.PLAYER_PREVITE_CLOSE, this.updateData, this)
        this.chatUserListData = new eui.ArrayCollection();
        this.chatListData = {};
        this.userData = new Sproto.chat_data;
    }

    public getChatListData() {
        return this.chatListData;
    }

    public getchatUserListData() {
        return this.chatUserListData;
    }

    public setUserData(userData) {
        this.userData = userData;
    }

    public getUserData() {
        return this.userData;
    }

    public getUserIdArr() {
        return this.detailsUserIdArr;
    }
    public updateData(req, type: DetailsType) {
        if (type == DetailsType.initData) {
            let uesrData = {};
            uesrData["newMsg"] = true;
            uesrData["session"] = req.session;
            uesrData["info"] = this.userData;
            if (this.chatUserListData.length > 0) {
                let existChatUser = false;
                for (let i = 0; i < this.chatUserListData.length; i++) {
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
            let existChatUser = false;
            for (let i = 0; i < this.chatUserListData.length; i++) {
                if (this.chatUserListData.getItemAt(i).session == req.session) {
                    if (req.chatData.id != GameGlobal.actorModel.actorID)
                        this.chatUserListData.getItemAt(i).newMsg = true;
                    this.chatListData[req.session].addItemAt(req.chatData, 0);
                    existChatUser = true;//列表上有聊天的用户
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
        for (let i = 0; i < this.chatUserListData.length; i++)
            this.detailsUserIdArr[i] = this.chatUserListData.getItemAt(i).info.id;
        if (this.chatUserListData.length == 0)
            this.detailsUserIdArr = [];


        // for (let i = 0; i < this.chatUserListData.length; i++) {
        //     if (this.chatUserListData.getItemAt(i).newMsg) {
        //         GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, true, true);
        //         break
        //     }
        // }
        for (let key in this.chatListData) {
            if (this.chatListData[key].length > 50)
                this.chatListData[key].removeItemAt(this.chatListData[key].length - 1);
        }

    }
}

enum DetailsType {
    normal,
    initData,
    newMsg,
}