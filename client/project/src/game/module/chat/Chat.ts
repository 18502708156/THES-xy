class Chat extends BaseSystem {

	public static ALL_TYPE = 0
	public static WORLD_TYPE = 1
	public static GUILD_TYPE = 2

	//聊天数据
	chatInterval = 5000;
	charMax = 50;
	miniChatMax = 30;
	UpSpeak = "";

	/**迷你聊天数据 */
	minichatList = new eui.ArrayCollection();
	worldchatList = new eui.ArrayCollection
	// syschatList = new eui.ArrayCollection
	guildchatList = new eui.ArrayCollection

	miniChatOpenStatus: boolean = false;

	isNoShowTipsPanel = false;
	publicCD = 0;

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_chat_new_msg, this._DoNewChatMsg);
		this.regNetMsg(S2cProtocol.sc_chat_init_msg, this._DoInitChatMsg);
		this.regNetMsg(S2cProtocol.sc_chat_is_send_success, this.doIsSendSuccess);
		this.regNetMsg(S2cProtocol.sc_chat_filte_list, this._DoChatFilte);
		// this.regNetMsg(S2cProtocol.sc_chat_system_message, this.doSystemMessage);

		this.RegNetMsgs(S2cProtocol.sc_show_other_spellsRes, this.spellsRes);
		this.RegNetMsgs(S2cProtocol.sc_show_other_pet, this.pet);
		this.RegNetMsgs(S2cProtocol.sc_other_equip, this.item);
		this.RegNetMsgs(S2cProtocol.sc_other_xianlv, this.xianlv);

	}

	public speakState(type: number) {
		return 0
	}

	public startupSpeakTime(type: number) {
	}

	public static CanGuildChat(): boolean {
		if (!GameGlobal.actorModel.HasGuild()) {
			UserTips.ins().showTips("请先加入帮会")
			return false
		}
		// if (!Guild.IsConditionChat()) {
		// 	// UserTips.ins().showTips("开服第三天开启帮会聊天")
		// 	return false
		// }
		return true
	}

	public Init(): void {
	}

	static ins(): Chat {
		return super.ins();
	};

	sendChatInfo(type: number, str: string) {
		if (str.length <= 0) {
			UserTips.ins().showTips("|C:0xff0000&T:请输入聊天内容|");
			return;
		}
		let req = new Sproto.cs_chat_send_info_request
		req.str = str;
		req.type = type
		this.Rpc(C2sProtocol.cs_chat_send_info, req)
	}

    /**
     * 发送帮会聊天消息
     */
	public SendGuildMessage(str) {
		let req = new Sproto.cs_guild_sendchat_request
		req.str = str
		this.Rpc(C2sProtocol.cs_guild_sendchat, req)
	}



    /**
     * 发送分享消息
     */
	public chatShareInfo(shareId: number, params: Sproto.client_chat_param[]) {
		let req = new Sproto.cs_chat_share_info_request
		req.shareId = shareId
		req.params = params
		this.Rpc(C2sProtocol.cs_chat_share_info, req)
	}


	//查看他人宠物
	public sendOtherPet(otherid, petid): void {
		let req = new Sproto.cs_get_other_actor_pet_request;
		req.otherid = otherid
		req.petid = petid
		this.Rpc(C2sProtocol.cs_get_other_actor_pet, req);
	}


	//查看他人法宝
	public sendOtherSpells(otherid, pos): void {
		let req = new Sproto.cs_get_other_actor_spellsRes_request;
		req.otherid = otherid
		req.pos = pos
		this.Rpc(C2sProtocol.cs_get_other_actor_spellsRes, req);
	}


	//查看物品
	public sendOtherActorItem(otherid, itemhandle): void {
		let req = new Sproto.cs_get_other_actor_item_request;
		// let req = new Sproto.cs_get_other_actor_item_request;
		req.otherid = otherid
		// req.otherid = otherid
		req.itemhandle = itemhandle
		// req.itemhandle = itemhandle
		this.Rpc(C2sProtocol.cs_get_other_actor_item, req);
		// req.slot = slot
		// this.Rpc(C2sProtocol.cs_get_other_actor_item, req);
	}

	//查看装备
	public sendOtherActorEq(otherid, slot): void {
		let req = new Sproto.cs_get_other_actor_equip_request;
		req.otherid = otherid
		req.slot = slot
		this.Rpc(C2sProtocol.cs_get_other_actor_equip, req);
	}

	//查看仙侣
	public sendOtherXianlv(otherid, id): void {
		let req = new Sproto.cs_get_other_actor_xianlv_request;
		req.otherid = otherid
		req.id = id
		this.Rpc(C2sProtocol.cs_get_other_actor_xianlv, req);
	}




	// client_chat_param

	/**
     * 广播帮会聊天消息
     */
	public DoGuildMessagess(chats: Sproto.guild_chat[]) {
		if (chats && chats.length) {
			chats.sort(Chat.miniChatSortFunction)
		}
		let list = []
		for (let data of chats) {
			var chatInfo = new ChatInfoData(data)
			list.push(chatInfo)
			this.guildchatList.addItemAt(chatInfo, 0)
		}
		this.SetMinichatDatas(list)
	}




	/**
     * 广播帮会聊天消息
     */
	public DoGuildMessages(t: Sproto.guild_chat) {
		var chatInfo = new ChatInfoData(t)
		if (this.guildchatList.length >= this.charMax) {
			this.guildchatList.removeItemAt(this.guildchatList.length - 1)
		}
		this.guildchatList.addItemAt(chatInfo, 0)
		this.SetMinichatData(chatInfo)
	}

	private _DoInitChatMsg(rsp: Sproto.sc_chat_init_msg_request) {
		if (!Chat.DeblockingShow()) {
			return
		}
		let list = []
		for (let data of rsp.chatDatas) {
			let msg = new ChatInfoData(data)
			list.push(msg)
			if (data.type == ChatType.Public || data.type == ChatType.System) {
				continue
			}
			this.worldchatList.addItemAt(msg, 0)
		}
		this.SetMinichatDatas(list)
	}

	/**收到新的新的聊天消息 */
	private _DoNewChatMsg(bytes: Sproto.sc_chat_new_msg_request) {
		if (!Chat.DeblockingShow()) {
			return
		}
		if (!bytes || !bytes.chatData) {
			return
		}
		let type = bytes.chatData.type
		if (type == ChatType.Public || type == ChatType.System) {
			let item = new ChatInfoData(bytes.chatData)
			this.DoSysChatMsg(item)
		} else {
			var message = new ChatInfoData(bytes.chatData);
			if (this.worldchatList.length >= this.charMax) {
				this.worldchatList.removeItemAt(this.worldchatList.length - 1)
			}
			this.worldchatList.addItemAt(message, 0)
			this.SetMinichatData(message);
		}

		if (bytes.chatData && bytes.chatData.share && bytes.chatData.share.shareId) {
			let shareObj = GlobalConfig.ins().ChatTipsConfig[bytes.chatData.share.shareId]
			if (shareObj && shareObj.notice) {
				if (shareObj.type == 4) {
					GameGlobal.Notice.StaticNotice(bytes.chatData.str)
				} else {
					GameGlobal.Notice.Notice(bytes.chatData.str)
				}
			}
		}
	}

	private doIsSendSuccess(bytes: Sproto.sc_chat_is_send_success_request) {
		if (bytes.success) {
			GameGlobal.MessageCenter.dispatch(MessageDef.SEND_MSG_INFO_SUCCESS)
		}
	}

	private _DoChatFilte(rsp: Sproto.sc_chat_filte_list_request) {
		if (!rsp) {
			return
		}
		this.RemoveChatByActors(rsp.filter || 0)
	}

	//打开法宝界面
	public spellsRes(req: Sproto.sc_show_other_spellsRes_request) {
		if (req) {
			let pData = new TreasureData()
			pData.initData(req.spellsNo, req.lv, [])
			ViewManager.ins().open(TreasureArrInfo, pData, null, true)//隐藏按钮
		}
	}

	//打开宠物展示界面
	public pet(req: Sproto.sc_show_other_pet_request) {
		if (req) {
			let petConfig = GameGlobal.Config.petBiographyConfig[req.petid];
			if (petConfig) {
				let config = CommonUtils.copyDataHandler(petConfig)
				config.buffskill = [];
				for (let val of req.pet.buffs) {
					let skill = {};
					skill["id"] = val
					config.buffskill.push(skill)
				}
				ViewManager.ins().open(PetInfoPanel, config, false);
			}
		}
	}

	//打开装备展示界面
	public item(req: Sproto.sc_other_equip_request) {
		if (req.data) {
			let equip = new EquipsData();
			equip.parser(req.data);
			ViewManager.ins().open(EquipDetailedWin, req.data.item.id, equip);
		}
	}

	//查看仙侣
	public xianlv(req: Sproto.sc_other_xianlv_request) {
		if (req) {
			let partnerGiftConfig = CommonUtils.copyDataHandler(GameGlobal.Config.partnerBiographyConfig[req.id]);
			let giftConfig = GameGlobal.Config.partnerGiftConfig[partnerGiftConfig.quality][req.level - 1];
			let attrsConfig = GameGlobal.Config.partnerAttrsConfig[req.id][req.star - 1];
			partnerGiftConfig.attrs = AttributeData.sumArrValueAttr(partnerGiftConfig.attrs, AttributeData.sumArrValueAttr(giftConfig.attrs, attrsConfig.attrs))
			partnerGiftConfig["star"] = req.star;
			ViewManager.ins().open(XianLvInfoPanel, partnerGiftConfig);
		}
	}


	DoSysChatMsg(message: ChatSystemData) {                                   //添加  系统消息
		this.SetMinichatData(message);
	}

	DoInitSysChatMsg(list: ChatSystemData[]): void {
		this.SetMinichatDatas(list)
	}

	checkRepeatString(str) {
		var len = str.length;
		if (len <= 10) {
			return true;
		}
		// var repeatNum = 0;
		// for (var i = 0; i < len; i++) {
		// 	var strIndex = str.charAt(i);
		// 	if (this.UpSpeak.lastIndexOf(strIndex) != -1) {
		// 		++repeatNum;
		// 	}
		// }
		// if (repeatNum >= 10) {
		// 	UserTips.ins().showTips("|C:0xff0000&T:输入的内容重复过多|");
		// 	return false;
		// }
		return true;
	}


	//分析分享内容
	public analyzeCn(_data): string {
		let data = _data
		let s = ""
		if (!data) return "";
		if (!data.share) return "";
		let shareObj = GlobalConfig.ins().ChatTipsConfig[data.share.shareId]
		if (shareObj) {
			if (shareObj.des) {
				let str = "<a href=\"event:" + data.share.shareId + "\"><u>" + shareObj.des + "</u></a>"
				s = "<font color = '" + "0x27a02a" + "'>" + str + "</font>"
			}
			else {
				let itemStr = ""
				let sColor = "0x27a02a"
				if (data.share.shareId) {
					let sId = data.share.shareId;


					if (sId === 1)//宠物
					{
						let shId = data.share.showInfo[0].value || 0
						let petConfig = GameGlobal.Config.petBiographyConfig[shId];
						if (petConfig) {
							itemStr = petConfig.name || ""
							sColor = ItemBase.QUALITY_COLOR[petConfig.quality] + ""
						}
					}
					else if (sId === 2) //装备
					{
						let shId = data.share.showInfo[0].value || 0
						let pConfig = GameGlobal.Config.ItemConfig[shId]
						if (pConfig) {
							itemStr = pConfig.name || ""
							sColor = ItemBase.QUALITY_COLOR[pConfig.quality] + ""
						}
					}
					else if (sId === 3)//法宝
					{
						let shId = data.share.showInfo[0].value || 0
						let shLv = data.share.showInfo[0].valueEx || 0
						let treasure = new TreasureData()
						treasure.initData(shId, shLv, [])
						itemStr = treasure.name || ""
						sColor = ItemBase.QUALITY_COLOR[treasure.quality] + ""
					}
					else if (sId === 12)//仙侣
					{
						let shId = data.share.showInfo[0].value || 0
						let xianlvConfig = GameGlobal.Config.partnerBiographyConfig[shId];
						if (xianlvConfig) {
							itemStr = xianlvConfig.name || ""
							sColor = ItemBase.QUALITY_COLOR[xianlvConfig.quality] + ""
						}
					}
				}
				let str = "<a href=\"event:" + data.share.shareId + "\"><u>" + itemStr + "</u></a>"
				s = "<font color = '" + sColor + "'>" + str + "</font>"
			}

		}
		return s;
	}

	public HandleChatShare(e: egret.TextEvent, data: ChatInfoData) {
		let text = e.text
		if (text) {
			let itemId = null
			let spellsData = null
			if (text.indexOf("itemId:") != -1) {
				itemId = Number(text.replace("itemId:", ""))
				if (isNaN(itemId)) {
					itemId = null
				}
			} else if (text.indexOf("spellsData:") != -1) {
				spellsData = text.replace("spellsData:", "")
				if (!spellsData) {
					spellsData = null
				}
			}
			if (itemId) {
				let itemConfig = GameGlobal.Config.ItemConfig[itemId]
				if (itemConfig) {
					if (ItemConst.OPEN_EQUIPS_TIPS[itemConfig.type]) {
						ViewManager.ins().open(EquipDetailedWin, itemConfig.id);
					} else {
						ViewManager.ins().open(ItemDetailedWin, 0, itemConfig.id, 1)
					}
				}
			} else if (spellsData) {
				let array = spellsData.split(",")
				let id = Number(array[0])
				if (id && !isNaN(id)) {
					let skillIds = []
					for (let i = 1; i < array.length; i++) {
						let skillId = Number(array[i])
						if (isNaN(skillId)) {
							continue
						}
						skillIds.push(skillId)
					}
					let treasure = new TreasureData()
					treasure.initData(id, 1, skillIds)
					ViewManager.ins().open(TreasureArrInfo, treasure, null, true, data.name)//隐藏按钮
				}
			} else {
				//跳转界面
				if (data.share && Number(text) == data.share.shareId) {
					GameGlobal.Chat.shareJump(data)
				} else {
					ViewManager.ins().open(PlayerDetailsPanel, text) //玩家
				}
			}
			
		}
	}

	//分享跳转内容
	public shareJump(_data: ChatInfoData) {
		let chatData = _data

		if (!chatData) return;


		let shareObj = GlobalConfig.ins().ChatTipsConfig[chatData.share.shareId]

		if (!Deblocking.Check(shareObj.openid)) {
			return;
		}



		//玩家数据
		if (chatData.share.player && chatData.share.player.length) {
			let tData = chatData.share.player
			if (chatData.share.shareId === 9 || chatData.share.shareId === 10)//加入帮会
			{
				let bJoin = GameGlobal.actorModel.guildID
				if (!bJoin) {
					GameGlobal.GangModel.SendJoinGang(tData[0].guildid) //只拿第一个玩家的id信息做加入依据
					UserTips.ins().showTips("已申请加入")
				}
				else {
					UserTips.ins().showTips("你已有帮会，不可申请")
				}
			}
		}

		let fbIndex = 0
		if (chatData.share.showInfo && chatData.share.showInfo.length) {
			let tData = chatData.share.showInfo
			for (const item in tData) {
				//   Player = 0,  --玩家 (只有服务端用)
				//   Pet = 1,   --宠物
				//   Treasure = 2, --法宝
				//   Ride = 3,   --坐骑
				//   Fb = 4,   --副本
				//   Item = 5,   --装备
				let itemData = tData[item]
				if (itemData.type === 1)//宠物
				{
					let data = itemData
					if (data && data.value) {
						this.sendOtherPet(chatData.id, data.value)
						// let petConfig = GameGlobal.Config.petBiographyConfig[data.value];
						// if(petConfig)
						// 	ViewManager.ins().open(PetInfoPanel,petConfig,true);
					}
				}
				else if (itemData.type === 2)//法宝
				{
					let data = itemData
					if (data && data.value && data.valueEx) {
						let treasure = new TreasureData()
						let skilList = []
						try {
							if (data.strvalue) {
								let arr = data.strvalue.split(",")
								for (let data of arr) {
									let v = Number(data)
									if (!isNaN(v)) {
										skilList.push(v)
									}
								}
							}
						} catch (e) {

						}
						treasure.initData(data.value, data.valueEx, skilList)
						ViewManager.ins().open(TreasureArrInfo, treasure, null, true, chatData.name)//隐藏按钮
					}
				}
				else if (itemData.type === 3)//坐骑
				{

				}
				else if (itemData.type === 4)//副本
				{
					if (chatData.share.shareId === 20)//关卡协助
					{
						GameGlobal.UserFb.raidAssistPkboss(itemData.value, chatData.id)
					}
					else {
						//组队

						fbIndex = itemData.value //副本index
						if (itemData.value && itemData.valueEx) {
							if (chatData.id != GameLogic.ins().actorModel.actorID) {

								GameGlobal.CrossBattleTeamModel.SendJoin(itemData.value,
									chatData.id, itemData.valueEx);
							}
							else {
								// UserTips.ins().showTips("您已在副本队伍中")
							}

						}
					}
				}
				else if (itemData.type === 5)//装备
				{
					let data = itemData
					if (data && data.value) {
						// ViewManager.ins().open(EquipDetailedWin, data.value, data.valueEx);
						this.sendOtherActorEq(chatData.id, data.valueEx)
					}
				}
				else if (itemData.type === 6)//仙侣
				{
					let data = itemData
					if (data && data.value) {
						this.sendOtherXianlv(chatData.id, data.value)
					}
				}
			}
		}


		//配表对应跳转
		if (chatData.share && chatData.share.shareId) {
			let shareObj = GlobalConfig.ins().ChatTipsConfig[chatData.share.shareId]
			if (shareObj.target) {
				let otherObj = null
				if (chatData.share.shareId === 15)//八十一难
				{
					otherObj = fbIndex
					GameGlobal.TsumKoBaseModel.chatXiD = fbIndex;
					GameGlobal.TsumKoBaseModel.changeId();
					if (GameGlobal.TsumKoBaseModel.IsOpenView() == true)
						ViewManager.ins().Guide(shareObj.target, otherObj);
					else
						GameGlobal.TsumKoBaseModel.chatXiD = 0;
				}
				else {
					ViewManager.ins().Guide(shareObj.target, otherObj);
				}
			}
		}

	}


	/**设置迷你面板聊天数据 */
	private SetMinichatData(val: ChatInfoData | ChatSystemData) {
		if (this.minichatList.length >= this.miniChatMax) {
			let len = this.miniChatMax >> 1;
			while (len--) {
				this.minichatList.removeItemAt(this.minichatList.length - 1)
			}
		}
		if (val.str) {
			this.minichatList.addItemAt(val, 0);
			this.minichatList.source.sort(Chat.miniChatSortFunction)
			this.minichatList.refresh()
			MiniChatPanel.Refresh()
		}
	};

	private SetMinichatDatas(val: ChatInfoData[] | ChatSystemData[]): void {
		for (let data of val) {
			this.minichatList.addItemAt(data, 0);
		}
		this.minichatList.source.sort(function (lhs, rhs) {
			return rhs.time - lhs.time
		})
		while (this.minichatList.length > this.miniChatMax) {
			this.minichatList.removeItemAt(this.minichatList.length - 1);
		}
		this.minichatList.refresh()
		MiniChatPanel.Refresh()
	}

	private static miniChatSortFunction(lhs, rhs) {
		return lhs && rhs ? rhs.time - lhs.time : 0
	}

	private setWorldchatData(t) {
		if (this.worldchatList.length >= this.charMax) {
			this.worldchatList.removeItemAt(this.worldchatList.length - 1)
		}
		this.worldchatList.addItemAt(t, 0)
	}

	// 断线的时候清除聊天信息
	public OnSocketClose() {
		if (this.minichatList) {
			this.minichatList.removeAll()
		}
		if (this.worldchatList) (
			this.worldchatList.removeAll()
		)
		if (this.guildchatList) {
			this.guildchatList.removeAll()
		}
	}

	public static DeblockingShow(): boolean {
		return Deblocking.Check(DeblockingType.TYPE_49, true) || GameServer.IsMerge()
	}

	public static DeblockingSend(): boolean {
		return Deblocking.Check(DeblockingType.TYPE_49)
	}



	public static Send(channelType: number, msg: string, sucCallback: Function = null): boolean {
		if (DEBUG) {
			if (window["CHAT_GM"]) {
				GameLogic.SendGM(msg)
				return
			}
		}
		var state = GameGlobal.Chat.speakState(channelType)
		var func = () => {
			if (msg.length < 1 || "点击输入聊天内容" == msg) {
				UserTips.ErrorTip("请输入聊天内容")
				return false
			}

			if (Chat.GUILD_TYPE == channelType) {
				if (Chat.CanGuildChat()) {
					GameGlobal.Chat.SendGuildMessage(msg)
					GameGlobal.Chat.startupSpeakTime(channelType)
				}
			} else {
				if (Chat.DeblockingSend()) {
					if (GameGlobal.Chat.checkRepeatString(msg)) {
						GameGlobal.Chat.sendChatInfo(1, msg);//目前只有世界
					}
					GameGlobal.Chat.UpSpeak = msg
					GameGlobal.Chat.startupSpeakTime(channelType)
				}
			}

			if (sucCallback) {
				sucCallback()
			}
			return true
		};
		if (0 > state) {
			UserTips.ins().showTips("通关" + Math.abs(state) + "关后可以在世界频道发言")
			return false
		}
		if (state > 0) {
			if (0 == channelType) {
				// if (GameGlobal.Chat.isNoShowTipsPanel) {
				// } else {
				// 	ViewManager.ins().open(ChatTipsWin, e, func);
				// }
			} else {
				UserTips.ins().showTips("|C:0xff0000&T:您发言太快了|");
				return false
			}
		}
		else {
			return func()
		}
	}

	public RemoveChatByActors(actorId: number) {
		if (!actorId) {
			return
		}
		this.RemoveChatByActor(this.minichatList, actorId)
		this.RemoveChatByActor(this.worldchatList, actorId)
		this.RemoveChatByActor(this.guildchatList, actorId)
	}

	public RemoveChatByActor(list: eui.ArrayCollection, actorId: number) {
		let source = list.source
		if (!source || !source.length) {
			return
		}
		let remove = false
		for (let i = source.length - 1; i >= 0; --i) {
			let data = source[i]
			if (actorId == data.id) {
				source.splice(i, 1)
				remove = true
			}
		}
		if (remove) {
			list.replaceAll(source)
			list.refresh()
		}
	}

	// public RemoveChatByActors(actorIds: number[]) {
	// 	if (!actorIds || !actorIds.length) {
	// 		return
	// 	}
	// 	let ids = {}
	// 	for (let id of actorIds) {
	// 		ids[id] = true
	// 	}
	// 	this.RemoveChatByActor(this.minichatList, ids)
	// 	this.RemoveChatByActor(this.worldchatList, ids)
	// 	this.RemoveChatByActor(this.guildchatList, ids)
	// }

	// public RemoveChatByActor(list: eui.ArrayCollection, actorIds: {[key: number]: boolean}) {
	// 	let source = list.source
	// 	if (!source || !source.length) {
	// 		return
	// 	}
	// 	let remove = false
	// 	for (let i = source.length - 1; i >= 0; --i) {
	// 		let data = source[i]
	// 		if (actorIds[data.id]) {
	// 			source.splice(i, 1)
	// 			remove = true
	// 		}
	// 	}
	// 	if (remove) {
	// 		list.replaceAll(source)
	// 		list.refresh()
	// 	}
	// }
}

enum ChatType {
	/**公告 */
	Public = 3,
	/**系统 */
	System = 2,
	/**世界聊天 */
	Normal = 1,
	Guild = 4,

	/** 世界聊天 - 公告类型 */
	NormalPublic = 10,
}