class PlayerInfoModel extends BaseSystem {
	public detailsData: DetailsData;
	public constructor() {
		super()
		this.detailsData = new DetailsData();
		this.regNetMsg(S2cProtocol.sc_show_other_player, this.getInfo);
		this.regNetMsg(S2cProtocol.sc_rename_result, this.getChangeName);
		this.regNetMsg(S2cProtocol.sc_chat_private_init_msg, this.getInitChat);
		this.regNetMsg(S2cProtocol.sc_chat_private_new_msg, this.getNewMsg);
		this.RegNetMsgs(S2cProtocol.sc_rename_count, this.getRenameCount);

	}

	public getChatListData() {
		return this.detailsData.getChatListData();
	}

	public getchatUserListData() {
		return this.detailsData.getchatUserListData();
	}

	public getUserDate() {
		return this.detailsData.getUserData();
	}
	public setUserDate(newMsgUser) {
		this.detailsData.setUserData(newMsgUser);
	}
	// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//--------发送请求和接收结果----------------------------------------------------------------------
	// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	public getInfo(rsp: Sproto.sc_show_other_player_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.PALYER_INFO, rsp);
	}


	public sendOtherId(id): void {
		let req = new Sproto.cs_get_other_actor_info_request;
		req.otherid = id;
		this.Rpc(C2sProtocol.cs_get_other_actor_info, req);
	}


	public sendChangeName(sName: string) {//改名
		let req = new Sproto.cs_change_player_name_request;
		req.name = sName;
		this.Rpc(C2sProtocol.cs_change_player_name, req);
	}

	public getChangeName(req: Sproto.sc_rename_result_request) {//改名
		if (req.result == 0) {
			GameGlobal.actorModel.name = req.name
		} else {
			RoleMgr.ins().showErrorTips(req.result);
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_CHANGE_NAME, req)
	}

	public getRenameCount(req: Sproto.sc_rename_count_request) {
		this.detailsData.renameCount = req.count || 0;
	}



	public sendChat(nPlayId: number, sContent: string, nType: number = 2) {//发送聊天信息
		let req = new Sproto.cs_chat_send_info_request;
		req.type = nType;
		req.recId = nPlayId;
		req.str = sContent;
		this.Rpc(C2sProtocol.cs_chat_send_info, req);
	}

	// public getSendChatSuccess(req: Sproto.sc_chat_is_send_success_request) {//发送是否成功
	// 	if (req.success) {
	// 		GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_PREVITE_CHAT_SUCCESS);
	// 	}
	// 	else
	// 		UserTips.ins().showTips("发送失败");
	// }

	public getNewMsg(req: Sproto.sc_chat_private_new_msg_request) {//新消息
		if (req) {
			GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_PREVITE_CHAT, req, DetailsType.newMsg);
			if (req.chatData.id != GameGlobal.GameLogic.actorModel.actorID)
				this.setUserDate(req.chatData);
		}
	}
	public sendInitChat(targetId: number) {//初始化聊天记录
		let req = new Sproto.cs_chat_private_send_init_request;
		req.targetId = targetId;
		this.Rpc(C2sProtocol.cs_chat_private_send_init, req);
	}
	public getInitChat(req: Sproto.sc_chat_private_init_msg_request) {//初始化聊天记录
		for (let i = 0; i < req.chatData.length; i++) {
			if (req.chatData[i].id != GameGlobal.GameLogic.actorModel.actorID) {
				this.setUserDate(req.chatData[i]);
				break;
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_PREVITE_CHAT, req, DetailsType.initData);
	}

	public sendonLine() {
		let req = new Sproto.cs_chat_check_online_request;
		req.playerIdArray = this.detailsData.getUserIdArr();
		if (req.playerIdArray.length != 0)
			this.Rpc(C2sProtocol.cs_chat_check_online, req, this.getOnline, this)
	}

	private getOnline(req: Sproto.cs_chat_check_online_response) {
		this.detailsData.onlineReq = req;
		GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_CHECK_ONLINE);
	}
}