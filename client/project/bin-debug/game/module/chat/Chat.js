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
var Chat = (function (_super) {
    __extends(Chat, _super);
    function Chat() {
        var _this = _super.call(this) || this;
        //聊天数据
        _this.chatInterval = 5000;
        _this.charMax = 50;
        _this.miniChatMax = 30;
        _this.UpSpeak = "";
        /**迷你聊天数据 */
        _this.minichatList = new eui.ArrayCollection();
        _this.worldchatList = new eui.ArrayCollection;
        // syschatList = new eui.ArrayCollection
        _this.guildchatList = new eui.ArrayCollection;
        _this.miniChatOpenStatus = false;
        _this.isNoShowTipsPanel = false;
        _this.publicCD = 0;
        _this.regNetMsg(S2cProtocol.sc_chat_new_msg, _this._DoNewChatMsg);
        _this.regNetMsg(S2cProtocol.sc_chat_init_msg, _this._DoInitChatMsg);
        _this.regNetMsg(S2cProtocol.sc_chat_is_send_success, _this.doIsSendSuccess);
        _this.regNetMsg(S2cProtocol.sc_chat_filte_list, _this._DoChatFilte);
        // this.regNetMsg(S2cProtocol.sc_chat_system_message, this.doSystemMessage);
        _this.RegNetMsgs(S2cProtocol.sc_show_other_spellsRes, _this.spellsRes);
        _this.RegNetMsgs(S2cProtocol.sc_show_other_pet, _this.pet);
        _this.RegNetMsgs(S2cProtocol.sc_other_equip, _this.item);
        _this.RegNetMsgs(S2cProtocol.sc_other_xianlv, _this.xianlv);
        return _this;
    }
    Chat.prototype.speakState = function (type) {
        return 0;
    };
    Chat.prototype.startupSpeakTime = function (type) {
    };
    Chat.CanGuildChat = function () {
        if (!GameGlobal.actorModel.HasGuild()) {
            UserTips.ins().showTips("请先加入帮会");
            return false;
        }
        // if (!Guild.IsConditionChat()) {
        // 	// UserTips.ins().showTips("开服第三天开启帮会聊天")
        // 	return false
        // }
        return true;
    };
    Chat.prototype.Init = function () {
    };
    Chat.ins = function () {
        return _super.ins.call(this);
    };
    ;
    Chat.prototype.sendChatInfo = function (type, str) {
        if (str.length <= 0) {
            UserTips.ins().showTips("|C:0xff0000&T:请输入聊天内容|");
            return;
        }
        var req = new Sproto.cs_chat_send_info_request;
        req.str = str;
        req.type = type;
        this.Rpc(C2sProtocol.cs_chat_send_info, req);
    };
    /**
     * 发送帮会聊天消息
     */
    Chat.prototype.SendGuildMessage = function (str) {
        var req = new Sproto.cs_guild_sendchat_request;
        req.str = str;
        this.Rpc(C2sProtocol.cs_guild_sendchat, req);
    };
    /**
     * 发送分享消息
     */
    Chat.prototype.chatShareInfo = function (shareId, params) {
        var req = new Sproto.cs_chat_share_info_request;
        req.shareId = shareId;
        req.params = params;
        this.Rpc(C2sProtocol.cs_chat_share_info, req);
    };
    //查看他人宠物
    Chat.prototype.sendOtherPet = function (otherid, petid) {
        var req = new Sproto.cs_get_other_actor_pet_request;
        req.otherid = otherid;
        req.petid = petid;
        this.Rpc(C2sProtocol.cs_get_other_actor_pet, req);
    };
    //查看他人法宝
    Chat.prototype.sendOtherSpells = function (otherid, pos) {
        var req = new Sproto.cs_get_other_actor_spellsRes_request;
        req.otherid = otherid;
        req.pos = pos;
        this.Rpc(C2sProtocol.cs_get_other_actor_spellsRes, req);
    };
    //查看物品
    Chat.prototype.sendOtherActorItem = function (otherid, itemhandle) {
        var req = new Sproto.cs_get_other_actor_item_request;
        // let req = new Sproto.cs_get_other_actor_item_request;
        req.otherid = otherid;
        // req.otherid = otherid
        req.itemhandle = itemhandle;
        // req.itemhandle = itemhandle
        this.Rpc(C2sProtocol.cs_get_other_actor_item, req);
        // req.slot = slot
        // this.Rpc(C2sProtocol.cs_get_other_actor_item, req);
    };
    //查看装备
    Chat.prototype.sendOtherActorEq = function (otherid, slot) {
        var req = new Sproto.cs_get_other_actor_equip_request;
        req.otherid = otherid;
        req.slot = slot;
        this.Rpc(C2sProtocol.cs_get_other_actor_equip, req);
    };
    //查看仙侣
    Chat.prototype.sendOtherXianlv = function (otherid, id) {
        var req = new Sproto.cs_get_other_actor_xianlv_request;
        req.otherid = otherid;
        req.id = id;
        this.Rpc(C2sProtocol.cs_get_other_actor_xianlv, req);
    };
    // client_chat_param
    /**
     * 广播帮会聊天消息
     */
    Chat.prototype.DoGuildMessagess = function (chats) {
        if (chats && chats.length) {
            chats.sort(Chat.miniChatSortFunction);
        }
        var list = [];
        for (var _i = 0, chats_1 = chats; _i < chats_1.length; _i++) {
            var data = chats_1[_i];
            var chatInfo = new ChatInfoData(data);
            list.push(chatInfo);
            this.guildchatList.addItemAt(chatInfo, 0);
        }
        this.SetMinichatDatas(list);
    };
    /**
     * 广播帮会聊天消息
     */
    Chat.prototype.DoGuildMessages = function (t) {
        var chatInfo = new ChatInfoData(t);
        if (this.guildchatList.length >= this.charMax) {
            this.guildchatList.removeItemAt(this.guildchatList.length - 1);
        }
        this.guildchatList.addItemAt(chatInfo, 0);
        this.SetMinichatData(chatInfo);
    };
    Chat.prototype._DoInitChatMsg = function (rsp) {
        if (!Chat.DeblockingShow()) {
            return;
        }
        var list = [];
        for (var _i = 0, _a = rsp.chatDatas; _i < _a.length; _i++) {
            var data = _a[_i];
            var msg = new ChatInfoData(data);
            list.push(msg);
            if (data.type == ChatType.Public || data.type == ChatType.System) {
                continue;
            }
            this.worldchatList.addItemAt(msg, 0);
        }
        this.SetMinichatDatas(list);
    };
    /**收到新的新的聊天消息 */
    Chat.prototype._DoNewChatMsg = function (bytes) {
        if (!Chat.DeblockingShow()) {
            return;
        }
        if (!bytes || !bytes.chatData) {
            return;
        }
        var type = bytes.chatData.type;
        if (type == ChatType.Public || type == ChatType.System) {
            var item = new ChatInfoData(bytes.chatData);
            this.DoSysChatMsg(item);
        }
        else {
            var message = new ChatInfoData(bytes.chatData);
            if (this.worldchatList.length >= this.charMax) {
                this.worldchatList.removeItemAt(this.worldchatList.length - 1);
            }
            this.worldchatList.addItemAt(message, 0);
            this.SetMinichatData(message);
        }
        if (bytes.chatData && bytes.chatData.share && bytes.chatData.share.shareId) {
            var shareObj = GlobalConfig.ins().ChatTipsConfig[bytes.chatData.share.shareId];
            if (shareObj && shareObj.notice) {
                if (shareObj.type == 4) {
                    GameGlobal.Notice.StaticNotice(bytes.chatData.str);
                }
                else {
                    GameGlobal.Notice.Notice(bytes.chatData.str);
                }
            }
        }
    };
    Chat.prototype.doIsSendSuccess = function (bytes) {
        if (bytes.success) {
            GameGlobal.MessageCenter.dispatch(MessageDef.SEND_MSG_INFO_SUCCESS);
        }
    };
    Chat.prototype._DoChatFilte = function (rsp) {
        if (!rsp) {
            return;
        }
        this.RemoveChatByActors(rsp.filter || 0);
    };
    //打开法宝界面
    Chat.prototype.spellsRes = function (req) {
        if (req) {
            var pData = new TreasureData();
            pData.initData(req.spellsNo, req.lv, []);
            ViewManager.ins().open(TreasureArrInfo, pData, null, true); //隐藏按钮
        }
    };
    //打开宠物展示界面
    Chat.prototype.pet = function (req) {
        if (req) {
            var petConfig = GameGlobal.Config.petBiographyConfig[req.petid];
            if (petConfig) {
                var config = CommonUtils.copyDataHandler(petConfig);
                config.buffskill = [];
                for (var _i = 0, _a = req.pet.buffs; _i < _a.length; _i++) {
                    var val = _a[_i];
                    var skill = {};
                    skill["id"] = val;
                    config.buffskill.push(skill);
                }
                ViewManager.ins().open(PetInfoPanel, config, false);
            }
        }
    };
    //打开装备展示界面
    Chat.prototype.item = function (req) {
        if (req.data) {
            var equip = new EquipsData();
            equip.parser(req.data);
            ViewManager.ins().open(EquipDetailedWin, req.data.item.id, equip);
        }
    };
    //查看仙侣
    Chat.prototype.xianlv = function (req) {
        if (req) {
            var partnerGiftConfig = CommonUtils.copyDataHandler(GameGlobal.Config.partnerBiographyConfig[req.id]);
            var giftConfig = GameGlobal.Config.partnerGiftConfig[partnerGiftConfig.quality][req.level - 1];
            var attrsConfig = GameGlobal.Config.partnerAttrsConfig[req.id][req.star - 1];
            partnerGiftConfig.attrs = AttributeData.sumArrValueAttr(partnerGiftConfig.attrs, AttributeData.sumArrValueAttr(giftConfig.attrs, attrsConfig.attrs));
            partnerGiftConfig["star"] = req.star;
            ViewManager.ins().open(XianLvInfoPanel, partnerGiftConfig);
        }
    };
    Chat.prototype.DoSysChatMsg = function (message) {
        this.SetMinichatData(message);
    };
    Chat.prototype.DoInitSysChatMsg = function (list) {
        this.SetMinichatDatas(list);
    };
    Chat.prototype.checkRepeatString = function (str) {
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
    };
    //分析分享内容
    Chat.prototype.analyzeCn = function (_data) {
        var data = _data;
        var s = "";
        if (!data)
            return "";
        if (!data.share)
            return "";
        var shareObj = GlobalConfig.ins().ChatTipsConfig[data.share.shareId];
        if (shareObj) {
            if (shareObj.des) {
                var str = "<a href=\"event:" + data.share.shareId + "\"><u>" + shareObj.des + "</u></a>";
                s = "<font color = '" + "0x27a02a" + "'>" + str + "</font>";
            }
            else {
                var itemStr = "";
                var sColor = "0x27a02a";
                if (data.share.shareId) {
                    var sId = data.share.shareId;
                    if (sId === 1) {
                        var shId = data.share.showInfo[0].value || 0;
                        var petConfig = GameGlobal.Config.petBiographyConfig[shId];
                        if (petConfig) {
                            itemStr = petConfig.name || "";
                            sColor = ItemBase.QUALITY_COLOR[petConfig.quality] + "";
                        }
                    }
                    else if (sId === 2) {
                        var shId = data.share.showInfo[0].value || 0;
                        var pConfig = GameGlobal.Config.ItemConfig[shId];
                        if (pConfig) {
                            itemStr = pConfig.name || "";
                            sColor = ItemBase.QUALITY_COLOR[pConfig.quality] + "";
                        }
                    }
                    else if (sId === 3) {
                        var shId = data.share.showInfo[0].value || 0;
                        var shLv = data.share.showInfo[0].valueEx || 0;
                        var treasure = new TreasureData();
                        treasure.initData(shId, shLv, []);
                        itemStr = treasure.name || "";
                        sColor = ItemBase.QUALITY_COLOR[treasure.quality] + "";
                    }
                    else if (sId === 12) {
                        var shId = data.share.showInfo[0].value || 0;
                        var xianlvConfig = GameGlobal.Config.partnerBiographyConfig[shId];
                        if (xianlvConfig) {
                            itemStr = xianlvConfig.name || "";
                            sColor = ItemBase.QUALITY_COLOR[xianlvConfig.quality] + "";
                        }
                    }
                }
                var str = "<a href=\"event:" + data.share.shareId + "\"><u>" + itemStr + "</u></a>";
                s = "<font color = '" + sColor + "'>" + str + "</font>";
            }
        }
        return s;
    };
    Chat.prototype.HandleChatShare = function (e, data) {
        var text = e.text;
        if (text) {
            var itemId = null;
            var spellsData = null;
            if (text.indexOf("itemId:") != -1) {
                itemId = Number(text.replace("itemId:", ""));
                if (isNaN(itemId)) {
                    itemId = null;
                }
            }
            else if (text.indexOf("spellsData:") != -1) {
                spellsData = text.replace("spellsData:", "");
                if (!spellsData) {
                    spellsData = null;
                }
            }
            if (itemId) {
                var itemConfig = GameGlobal.Config.ItemConfig[itemId];
                if (itemConfig) {
                    if (ItemConst.OPEN_EQUIPS_TIPS[itemConfig.type]) {
                        ViewManager.ins().open(EquipDetailedWin, itemConfig.id);
                    }
                    else {
                        ViewManager.ins().open(ItemDetailedWin, 0, itemConfig.id, 1);
                    }
                }
            }
            else if (spellsData) {
                var array = spellsData.split(",");
                var id = Number(array[0]);
                if (id && !isNaN(id)) {
                    var skillIds = [];
                    for (var i = 1; i < array.length; i++) {
                        var skillId = Number(array[i]);
                        if (isNaN(skillId)) {
                            continue;
                        }
                        skillIds.push(skillId);
                    }
                    var treasure = new TreasureData();
                    treasure.initData(id, 1, skillIds);
                    ViewManager.ins().open(TreasureArrInfo, treasure, null, true, data.name); //隐藏按钮
                }
            }
            else {
                //跳转界面
                if (data.share && Number(text) == data.share.shareId) {
                    GameGlobal.Chat.shareJump(data);
                }
                else {
                    ViewManager.ins().open(PlayerDetailsPanel, text); //玩家
                }
            }
        }
    };
    //分享跳转内容
    Chat.prototype.shareJump = function (_data) {
        var chatData = _data;
        if (!chatData)
            return;
        var shareObj = GlobalConfig.ins().ChatTipsConfig[chatData.share.shareId];
        if (!Deblocking.Check(shareObj.openid)) {
            return;
        }
        //玩家数据
        if (chatData.share.player && chatData.share.player.length) {
            var tData = chatData.share.player;
            if (chatData.share.shareId === 9 || chatData.share.shareId === 10) {
                var bJoin = GameGlobal.actorModel.guildID;
                if (!bJoin) {
                    GameGlobal.GangModel.SendJoinGang(tData[0].guildid); //只拿第一个玩家的id信息做加入依据
                    UserTips.ins().showTips("已申请加入");
                }
                else {
                    UserTips.ins().showTips("你已有帮会，不可申请");
                }
            }
        }
        var fbIndex = 0;
        if (chatData.share.showInfo && chatData.share.showInfo.length) {
            var tData = chatData.share.showInfo;
            for (var item in tData) {
                //   Player = 0,  --玩家 (只有服务端用)
                //   Pet = 1,   --宠物
                //   Treasure = 2, --法宝
                //   Ride = 3,   --坐骑
                //   Fb = 4,   --副本
                //   Item = 5,   --装备
                var itemData = tData[item];
                if (itemData.type === 1) {
                    var data = itemData;
                    if (data && data.value) {
                        this.sendOtherPet(chatData.id, data.value);
                        // let petConfig = GameGlobal.Config.petBiographyConfig[data.value];
                        // if(petConfig)
                        // 	ViewManager.ins().open(PetInfoPanel,petConfig,true);
                    }
                }
                else if (itemData.type === 2) {
                    var data = itemData;
                    if (data && data.value && data.valueEx) {
                        var treasure = new TreasureData();
                        var skilList = [];
                        try {
                            if (data.strvalue) {
                                var arr = data.strvalue.split(",");
                                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                                    var data_1 = arr_1[_i];
                                    var v = Number(data_1);
                                    if (!isNaN(v)) {
                                        skilList.push(v);
                                    }
                                }
                            }
                        }
                        catch (e) {
                        }
                        treasure.initData(data.value, data.valueEx, skilList);
                        ViewManager.ins().open(TreasureArrInfo, treasure, null, true, chatData.name); //隐藏按钮
                    }
                }
                else if (itemData.type === 3) {
                }
                else if (itemData.type === 4) {
                    if (chatData.share.shareId === 20) {
                        GameGlobal.UserFb.raidAssistPkboss(itemData.value, chatData.id);
                    }
                    else {
                        //组队
                        fbIndex = itemData.value; //副本index
                        if (itemData.value && itemData.valueEx) {
                            if (chatData.id != GameLogic.ins().actorModel.actorID) {
                                GameGlobal.CrossBattleTeamModel.SendJoin(itemData.value, chatData.id, itemData.valueEx);
                            }
                            else {
                                // UserTips.ins().showTips("您已在副本队伍中")
                            }
                        }
                    }
                }
                else if (itemData.type === 5) {
                    var data = itemData;
                    if (data && data.value) {
                        // ViewManager.ins().open(EquipDetailedWin, data.value, data.valueEx);
                        this.sendOtherActorEq(chatData.id, data.valueEx);
                    }
                }
                else if (itemData.type === 6) {
                    var data = itemData;
                    if (data && data.value) {
                        this.sendOtherXianlv(chatData.id, data.value);
                    }
                }
            }
        }
        //配表对应跳转
        if (chatData.share && chatData.share.shareId) {
            var shareObj_1 = GlobalConfig.ins().ChatTipsConfig[chatData.share.shareId];
            if (shareObj_1.target) {
                var otherObj = null;
                if (chatData.share.shareId === 15) {
                    otherObj = fbIndex;
                    GameGlobal.TsumKoBaseModel.chatXiD = fbIndex;
                    GameGlobal.TsumKoBaseModel.changeId();
                    if (GameGlobal.TsumKoBaseModel.IsOpenView() == true)
                        ViewManager.ins().Guide(shareObj_1.target, otherObj);
                    else
                        GameGlobal.TsumKoBaseModel.chatXiD = 0;
                }
                else {
                    ViewManager.ins().Guide(shareObj_1.target, otherObj);
                }
            }
        }
    };
    /**设置迷你面板聊天数据 */
    Chat.prototype.SetMinichatData = function (val) {
        if (this.minichatList.length >= this.miniChatMax) {
            var len = this.miniChatMax >> 1;
            while (len--) {
                this.minichatList.removeItemAt(this.minichatList.length - 1);
            }
        }
        if (val.str) {
            this.minichatList.addItemAt(val, 0);
            this.minichatList.source.sort(Chat.miniChatSortFunction);
            this.minichatList.refresh();
            MiniChatPanel.Refresh();
        }
    };
    ;
    Chat.prototype.SetMinichatDatas = function (val) {
        for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
            var data = val_1[_i];
            this.minichatList.addItemAt(data, 0);
        }
        this.minichatList.source.sort(function (lhs, rhs) {
            return rhs.time - lhs.time;
        });
        while (this.minichatList.length > this.miniChatMax) {
            this.minichatList.removeItemAt(this.minichatList.length - 1);
        }
        this.minichatList.refresh();
        MiniChatPanel.Refresh();
    };
    Chat.miniChatSortFunction = function (lhs, rhs) {
        return lhs && rhs ? rhs.time - lhs.time : 0;
    };
    Chat.prototype.setWorldchatData = function (t) {
        if (this.worldchatList.length >= this.charMax) {
            this.worldchatList.removeItemAt(this.worldchatList.length - 1);
        }
        this.worldchatList.addItemAt(t, 0);
    };
    // 断线的时候清除聊天信息
    Chat.prototype.OnSocketClose = function () {
        if (this.minichatList) {
            this.minichatList.removeAll();
        }
        if (this.worldchatList)
            (this.worldchatList.removeAll());
        if (this.guildchatList) {
            this.guildchatList.removeAll();
        }
    };
    Chat.DeblockingShow = function () {
        return Deblocking.Check(DeblockingType.TYPE_49, true) || GameServer.IsMerge();
    };
    Chat.DeblockingSend = function () {
        return Deblocking.Check(DeblockingType.TYPE_49);
    };
    Chat.Send = function (channelType, msg, sucCallback) {
        if (sucCallback === void 0) { sucCallback = null; }
        if (true) {
            if (window["CHAT_GM"]) {
                GameLogic.SendGM(msg);
                return;
            }
        }
        var state = GameGlobal.Chat.speakState(channelType);
        var func = function () {
            if (msg.length < 1 || "点击输入聊天内容" == msg) {
                UserTips.ErrorTip("请输入聊天内容");
                return false;
            }
            if (Chat.GUILD_TYPE == channelType) {
                if (Chat.CanGuildChat()) {
                    GameGlobal.Chat.SendGuildMessage(msg);
                    GameGlobal.Chat.startupSpeakTime(channelType);
                }
            }
            else {
                if (Chat.DeblockingSend()) {
                    if (GameGlobal.Chat.checkRepeatString(msg)) {
                        GameGlobal.Chat.sendChatInfo(1, msg); //目前只有世界
                    }
                    GameGlobal.Chat.UpSpeak = msg;
                    GameGlobal.Chat.startupSpeakTime(channelType);
                }
            }
            if (sucCallback) {
                sucCallback();
            }
            return true;
        };
        if (0 > state) {
            UserTips.ins().showTips("通关" + Math.abs(state) + "关后可以在世界频道发言");
            return false;
        }
        if (state > 0) {
            if (0 == channelType) {
                // if (GameGlobal.Chat.isNoShowTipsPanel) {
                // } else {
                // 	ViewManager.ins().open(ChatTipsWin, e, func);
                // }
            }
            else {
                UserTips.ins().showTips("|C:0xff0000&T:您发言太快了|");
                return false;
            }
        }
        else {
            return func();
        }
    };
    Chat.prototype.RemoveChatByActors = function (actorId) {
        if (!actorId) {
            return;
        }
        this.RemoveChatByActor(this.minichatList, actorId);
        this.RemoveChatByActor(this.worldchatList, actorId);
        this.RemoveChatByActor(this.guildchatList, actorId);
    };
    Chat.prototype.RemoveChatByActor = function (list, actorId) {
        var source = list.source;
        if (!source || !source.length) {
            return;
        }
        var remove = false;
        for (var i = source.length - 1; i >= 0; --i) {
            var data = source[i];
            if (actorId == data.id) {
                source.splice(i, 1);
                remove = true;
            }
        }
        if (remove) {
            list.replaceAll(source);
            list.refresh();
        }
    };
    Chat.ALL_TYPE = 0;
    Chat.WORLD_TYPE = 1;
    Chat.GUILD_TYPE = 2;
    return Chat;
}(BaseSystem));
__reflect(Chat.prototype, "Chat");
var ChatType;
(function (ChatType) {
    /**公告 */
    ChatType[ChatType["Public"] = 3] = "Public";
    /**系统 */
    ChatType[ChatType["System"] = 2] = "System";
    /**世界聊天 */
    ChatType[ChatType["Normal"] = 1] = "Normal";
    ChatType[ChatType["Guild"] = 4] = "Guild";
    /** 世界聊天 - 公告类型 */
    ChatType[ChatType["NormalPublic"] = 10] = "NormalPublic";
})(ChatType || (ChatType = {}));
//# sourceMappingURL=Chat.js.map