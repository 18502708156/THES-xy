class FriendModel extends BaseSystem {
	/**每页的最大容量*/
	public static MAX_COUNT = 6;

	public FriendData: FriendData;
	protected targetId;
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_friend_follow_data, this.getFriendsData)
		this.regNetMsg(S2cProtocol.sc_friend_funs_data, this.getFansData)
		this.regNetMsg(S2cProtocol.sc_friend_black_list, this.getBlackListData)
		this.regNetMsg(S2cProtocol.sc_friend_follow_nominate_list, this.getReferrerData)
		this.regNetMsg(S2cProtocol.sc_friend_follow_update, this.getFriendUpdate)
		this.regNetMsg(S2cProtocol.sc_friend_funs_update, this.getAddFans)
		this.regNetMsg(S2cProtocol.sc_friend_blacklist_update, this.getBlacklistUpdate)
		this.regNetMsg(S2cProtocol.sc_friend_gift_receive_info, this.getCoinInfo)
		this.regNetMsg(S2cProtocol.sc_friend_funs_remove, this.getDelFans)

		this.FriendData = new FriendData;
	}

	isFriend(id: number) {
		for (let value of this.FriendData.friendsDate) {
			if (value.friendInfo.dbid == id)
				return true;
		}
		return false;
	}
	isBlacklist(id: number) {
		for (let value of this.FriendData.blacklistData) {
			if (value.dbid == id)
				return true;
		}
		return false;
	}
	get friendsNum() {
		return this.FriendData.friendsDate.length;
	}
	get blacklistNum() {
		return this.FriendData.blacklistData.length;
	}
	get fansNum() {
		return this.FriendData.fansData.length;
	}

	checkRedPoint(): boolean {
		if (this.FriendData.takeCoinNum < GameGlobal.Config.FriendBaseConfig.receivecoin)
			for (let value of this.FriendData.fansData) {
				if (value.gift && !value.receive) {
					return true
				}
			}
		return false;
	}

	/**聊天列表排序*/
	arrDispose(arr: Array<any>, ...param: any[]) {
		let onLine = [];
		let offLine = [];
		for (let i = 0; i < arr.length; i++) {
			if (param.length == 1) {
				if (arr[i][param[0]] == 0)//0表示在线
					onLine.push(arr[i]);
				else
					offLine.push(arr[i]);
			}
			else if (param.length == 2) {
				if (arr[i][param[0]][param[1]] == 0)
					onLine.push(arr[i]);
				else
					offLine.push(arr[i]);
			}
		}
		if (param.length == 1)
			SortTools.sortMap1(offLine, false, param[0]);
		else if (param.length == 2)
			SortTools.sortMap1(offLine, false, param[0], param[1]);
		return onLine.concat(offLine);
	}
	/**数据变更处理*/
	arrUpdate(arr: Array<any>, reference, ...param: any[]) {
		let isExist = false;
		for (let i = 0; i < arr.length; i++) {
			if (param.length == 1) {
				if (arr[i][param[0]] == reference[param[0]]) {
					arr[i] = reference;
					isExist = true
					break;
				}
			}
			else if (param.length == 2) {
				if (arr[i][param[0]][param[1]] == reference[param[0]][param[1]]) {
					arr[i] = reference;
					isExist = true
					break;
				}
			}
		}
		if (!isExist)
			arr.push(reference);
	}
	/**删除Itme*/
	delItem(arr: Array<any>, id, ...param: any[]) {
		for (let i = 0; i < arr.length; i++) {
			if (param.length == 1) {
				if (arr[i][param[0]] == id) {
					arr.splice(i, 1);
					break;
				}
			}
			else if (param.length == 2) {
				if (arr[i][param[0]][param[1]] == id) {
					arr.splice(i, 1);
					break;
				}
			}
		}
		MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
	}
	/**更新列表*/
	refreshList(id) {
		for (let i = 0; i < this.FriendData.friendsDate.length; i++)
			if (this.FriendData.friendsDate[i].friendInfo.dbid == id)
				this.FriendData.friendsDate.splice(i, 1);
		for (let i = 0; i < this.FriendData.fansData.length; i++)
			if (this.FriendData.fansData[i].dbid == id)
				this.FriendData.fansData.splice(i, 1);
		for (let i = 0; i < this.FriendData.referrerDate.length; i++)
			if (this.FriendData.referrerDate[i].dbid == id)
				this.FriendData.referrerDate.splice(i, 1);
	}
	/**一键关注*/
	sentAllFollow() {
		let vipConfig = GameGlobal.Config.VipPrivilegeConfig;
		for (let i = 0; i < this.FriendData.referrerDate.length;) {
			if (this.friendsNum < vipConfig[GameGlobal.actorModel.vipLv].friendnum) {
				this.sendAddFriend(this.FriendData.referrerDate[i].dbid)
				this.FriendData.referrerDate.splice(i, 1);
			}
			else
				i++
		}
	}

	/**一键接收友币*/
	sentTakeAllCoin() {
		if (this.FriendData.takeCoinNum < GameGlobal.Config.FriendBaseConfig.receivecoin) {
			let config = GameGlobal.Config.FriendBaseConfig;
			for (let i = 0; i < this.FriendData.fansData.length;) {
				if (this.FriendData.takeCoinNum < config.receivecoin && this.FriendData.fansData[i].gift && !this.FriendData.fansData[i].receive) {
					this.sentTakeGive(this.FriendData.fansData[i].funsInfo.dbid)
					this.FriendData.fansData.splice(i, 1);
				}
				else
					i++
			}
		}
		else
			GameGlobal.UserTips.showTips("今天接收次数已达上限")
	}
	// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//--------发送请求和接收结果----------------------------------------------------------------------
	// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	getFriendsData(req: Sproto.sc_friend_follow_data_request) {//获取关注列表
		this.FriendData.friendsDate = this.arrDispose(req.friendlist, "friendInfo", "offlineTime")
	}

	getFansData(req: Sproto.sc_friend_funs_data_request) {
		SortTools.sortMap1(req.funslist, false, "gifttime");
		this.FriendData.fansData = req.funslist;
	}

	getBlackListData(req: Sproto.sc_friend_black_list_request) {
		SortTools.sortMap1(req.blacklist, false, "power");
		this.FriendData.blacklistData = req.blacklist;
	}
	/**请求推荐列表*/
	sendReferrer() {
		let req = new Sproto.cs_friend_follow_nominate_request;
		this.Rpc(C2sProtocol.cs_friend_follow_nominate, req)
	}

	getReferrerData(req: Sproto.sc_friend_follow_nominate_list_request) {
		this.FriendData.referrerDate = this.arrDispose(req.playerinfos, "offlineTime")
		MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
	}

	getFriendUpdate(req: Sproto.sc_friend_follow_update_request) {//关注列表变更
		this.arrUpdate(this.FriendData.friendsDate, req.friendinfo, "friendInfo", "dbid")
		this.FriendData.friendsDate = this.arrDispose(this.FriendData.friendsDate, "friendInfo", "offlineTime");
		MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
	}

	getAddFans(req: Sproto.sc_friend_funs_update_request) {//粉丝列表变更
		this.arrUpdate(this.FriendData.fansData, req.funsinfo, "funsInfo", "dbid")
		SortTools.sortMap1(this.FriendData.fansData, false, "gifttime");
		MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
		MessageCenter.ins().dispatch(MessageDef.FRIEND_RED_POINT_CHANGE);
	}

	getDelFans(req: Sproto.sc_friend_funs_remove_request) {//粉丝列表变更
		GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.fansData, req.dbid, "funsInfo", "dbid");
		MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
	}

	getBlacklistUpdate(req: Sproto.sc_friend_blacklist_update_request) {//黑名单列表变更
		this.arrUpdate(this.FriendData.blacklistData, req.blackdata, "dbid")
		SortTools.sortMap1(this.FriendData.blacklistData, false, "power");
		this.refreshList(req.blackdata.dbid);
		MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
	}
	/**请求赠送友币*/
	sentGive(id: number) {
		if (GameGlobal.FriendModel.FriendData.curCoinNum < GameGlobal.Config.FriendBaseConfig.givecoin) {
			let req = new Sproto.cs_friend_gift_friendcoin_request;
			req.targetid = id;
			this.Rpc(C2sProtocol.cs_friend_gift_friendcoin, req)
			GameGlobal.UserTips.showTips("赠送成功")
		}
		else
			GameGlobal.UserTips.showTips("今天赠送次数已用完")
	}

	/**请求接收友币*/
	sentTakeGive(id: number) {
		if (this.FriendData.takeCoinNum < GameGlobal.Config.FriendBaseConfig.receivecoin) {
			let req = new Sproto.cs_friend_receive_friendcoin_request;
			req.targetid = id;
			this.Rpc(C2sProtocol.cs_friend_receive_friendcoin, req)
			GameGlobal.UserTips.showTips("接收成功")
			MessageCenter.ins().dispatch(MessageDef.FRIEND_RED_POINT_CHANGE);
		}
		else
			GameGlobal.UserTips.showTips("今天接收次数已达上限")
	}

	getCoinInfo(req: Sproto.sc_friend_gift_receive_info_request) {
		this.FriendData.takeCoinNum = req.receivetime;
		this.FriendData.curCoinNum = req.gifttime;
	}

	/**请求所有赠送*/
	sentAllGive() {
		if (this.FriendData.curCoinNum < GameGlobal.Config.FriendBaseConfig.givecoin) {
			let giveSum = GameGlobal.Config.FriendBaseConfig.givecoin;
			for (let i = 0; i < this.FriendData.friendsDate.length; i++) {
				if ((giveSum - this.FriendData.curCoinNum) > 0)
					if (!this.FriendData.friendsDate[i].gift)
						this.sentGive(this.FriendData.friendsDate[i].friendInfo.dbid)
			}
		}
		else
			GameGlobal.UserTips.showTips("今天赠送次数已用完")
	}
	/**请求移除关注*/
	sendDleFriend(id: number) {
		let req = new Sproto.cs_friend_del_follow_request;
		req.targetid = id;
		this.Rpc(C2sProtocol.cs_friend_del_follow, req)
		GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.friendsDate, id, "friendInfo", "dbid");
	}
	/**请求添加关注*/
	sendAddFriend(id: number) {
		if (GameGlobal.FriendModel.friendsNum < GameGlobal.Config.VipPrivilegeConfig[GameGlobal.actorModel.vipLv].friendnum) {
			let req = new Sproto.cs_friend_add_follow_request;
			req.targetid = id;
			this.targetId = id;
			this.Rpc(C2sProtocol.cs_friend_add_follow, req, this.addSuccess, this)
		}
		else
			GameGlobal.UserTips.showTips("关注列表已满");
	}

	addSuccess(req: Sproto.cs_friend_add_follow_response) {
		if (req.ret) {
			GameGlobal.UserTips.showTips("已关注");
			GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.referrerDate, this.targetId, "dbid");
			GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.blacklistData, this.targetId, "dbid");
			MessageCenter.ins().dispatch(MessageDef.FRIEND_DATA_REFRESH);
		}
		else
			GameGlobal.UserTips.showTips("对方粉丝已满");
	}
	/**请求添加黑名单*/
	sendAddBlacklist(id: number) {
		if (this.blacklistNum < GameGlobal.Config.FriendBaseConfig.blacklist) {
			let req = new Sproto.cs_friend_add_blacklist_request;
			req.targetid = id;
			this.Rpc(C2sProtocol.cs_friend_add_blacklist, req)
		}
		else
			GameGlobal.UserTips.showTips("黑名单已达上限，无法拉黑");
	}
	/**请求移出黑名单*/
	sendRemoveBlacklist(id: number) {
		let req = new Sproto.cs_friend_del_blacklist_request;
		req.targetid = id;
		this.Rpc(C2sProtocol.cs_friend_del_blacklist, req)
		GameGlobal.FriendModel.delItem(GameGlobal.FriendModel.FriendData.blacklistData, id, "dbid");
	}
}

