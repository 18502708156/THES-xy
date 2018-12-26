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
var PlayerInfoModel = (function (_super) {
    __extends(PlayerInfoModel, _super);
    function PlayerInfoModel() {
        var _this = _super.call(this) || this;
        _this.detailsData = new DetailsData();
        _this.regNetMsg(S2cProtocol.sc_show_other_player, _this.getInfo);
        _this.regNetMsg(S2cProtocol.sc_rename_result, _this.getChangeName);
        _this.regNetMsg(S2cProtocol.sc_chat_private_init_msg, _this.getInitChat);
        _this.regNetMsg(S2cProtocol.sc_chat_private_new_msg, _this.getNewMsg);
        _this.RegNetMsgs(S2cProtocol.sc_rename_count, _this.getRenameCount);
        return _this;
    }
    PlayerInfoModel.prototype.getChatListData = function () {
        return this.detailsData.getChatListData();
    };
    PlayerInfoModel.prototype.getchatUserListData = function () {
        return this.detailsData.getchatUserListData();
    };
    PlayerInfoModel.prototype.getUserDate = function () {
        return this.detailsData.getUserData();
    };
    PlayerInfoModel.prototype.setUserDate = function (newMsgUser) {
        this.detailsData.setUserData(newMsgUser);
    };
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //--------发送请求和接收结果----------------------------------------------------------------------
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    PlayerInfoModel.prototype.getInfo = function (rsp) {
        GameGlobal.MessageCenter.dispatch(MessageDef.PALYER_INFO, rsp);
    };
    PlayerInfoModel.prototype.sendOtherId = function (id) {
        var req = new Sproto.cs_get_other_actor_info_request;
        req.otherid = id;
        this.Rpc(C2sProtocol.cs_get_other_actor_info, req);
    };
    PlayerInfoModel.prototype.sendChangeName = function (sName) {
        var req = new Sproto.cs_change_player_name_request;
        req.name = sName;
        this.Rpc(C2sProtocol.cs_change_player_name, req);
    };
    PlayerInfoModel.prototype.getChangeName = function (req) {
        if (req.result == 0) {
            GameGlobal.actorModel.name = req.name;
        }
        else {
            RoleMgr.ins().showErrorTips(req.result);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_CHANGE_NAME, req);
    };
    PlayerInfoModel.prototype.getRenameCount = function (req) {
        this.detailsData.renameCount = req.count || 0;
    };
    PlayerInfoModel.prototype.sendChat = function (nPlayId, sContent, nType) {
        if (nType === void 0) { nType = 2; }
        var req = new Sproto.cs_chat_send_info_request;
        req.type = nType;
        req.recId = nPlayId;
        req.str = sContent;
        this.Rpc(C2sProtocol.cs_chat_send_info, req);
    };
    // public getSendChatSuccess(req: Sproto.sc_chat_is_send_success_request) {//发送是否成功
    // 	if (req.success) {
    // 		GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_PREVITE_CHAT_SUCCESS);
    // 	}
    // 	else
    // 		UserTips.ins().showTips("发送失败");
    // }
    PlayerInfoModel.prototype.getNewMsg = function (req) {
        if (req) {
            GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_PREVITE_CHAT, req, DetailsType.newMsg);
            if (req.chatData.id != GameGlobal.GameLogic.actorModel.actorID)
                this.setUserDate(req.chatData);
        }
    };
    PlayerInfoModel.prototype.sendInitChat = function (targetId) {
        var req = new Sproto.cs_chat_private_send_init_request;
        req.targetId = targetId;
        this.Rpc(C2sProtocol.cs_chat_private_send_init, req);
    };
    PlayerInfoModel.prototype.getInitChat = function (req) {
        for (var i = 0; i < req.chatData.length; i++) {
            if (req.chatData[i].id != GameGlobal.GameLogic.actorModel.actorID) {
                this.setUserDate(req.chatData[i]);
                break;
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_PREVITE_CHAT, req, DetailsType.initData);
    };
    PlayerInfoModel.prototype.sendonLine = function () {
        var req = new Sproto.cs_chat_check_online_request;
        req.playerIdArray = this.detailsData.getUserIdArr();
        if (req.playerIdArray.length != 0)
            this.Rpc(C2sProtocol.cs_chat_check_online, req, this.getOnline, this);
    };
    PlayerInfoModel.prototype.getOnline = function (req) {
        this.detailsData.onlineReq = req;
        GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_CHECK_ONLINE);
    };
    return PlayerInfoModel;
}(BaseSystem));
__reflect(PlayerInfoModel.prototype, "PlayerInfoModel");
//# sourceMappingURL=PlayerInfoModel.js.map