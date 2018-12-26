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
var GangModel = (function (_super) {
    __extends(GangModel, _super);
    function GangModel() {
        var _this = _super.call(this) || this;
        _this.mGangId = 0;
        _this.mAppliedMap = {};
        _this.mMemberList = [];
        _this.mSkillMap = {};
        _this.gangRecordInfo = new GangRecordInfo();
        _this.gangProtectorTaskInfo = [];
        _this.mAppliedCount = 0;
        _this.mGangBossInfo = new GangBossInfo();
        _this.panTaoHuiList = [];
        _this.panTaoHuiExp = 0;
        _this.rewardMark = 0;
        _this.getPantao = false;
        _this.mRedPoint = new GangModelRedPoint;
        _this.mMyGangInfo = new MyGangInfo;
        _this.regNetMsg(S2cProtocol.sc_guild_info, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_guild_list, _this._RecvGetBangList);
        _this.regNetMsg(S2cProtocol.sc_guild_create_ret, _this._RecvCreateGang);
        _this.regNetMsg(S2cProtocol.sc_guild_apply_list, _this._RecvAppliedGangList);
        _this.regNetMsg(S2cProtocol.sc_guild_playerinfo, _this._RecvMyOtherInfo);
        _this.regNetMsg(S2cProtocol.sc_guild_apply, _this._RecvApplicantList);
        _this.regNetMsg(S2cProtocol.sc_guild_notice_apply, _this._RecvNoticeJionGang);
        _this.regNetMsg(S2cProtocol.sc_guild_autoadd_ret, _this._RecvSetAutoJoin);
        _this.regNetMsg(S2cProtocol.sc_guild_skill_info, _this._RecvSeSkillData);
        _this.regNetMsg(S2cProtocol.sc_guild_skill_learn_ret, _this._RecvSeLearnSkillData);
        _this.regNetMsg(S2cProtocol.sc_guild_members, _this._RecvMemberList);
        _this.regNetMsg(S2cProtocol.sc_guild_change_office_ret, _this._RecvOfficeChange);
        _this.regNetMsg(S2cProtocol.sc_guild_kick_ret, _this._RecvKickOut);
        _this.regNetMsg(S2cProtocol.sc_guild_fund, _this._RecvCapitalChange);
        _this.regNetMsg(S2cProtocol.sc_guild_join_info, _this._RecvJoinInfo);
        _this.RegNetMsgs(S2cProtocol.player_guild_change, _this._RecvGuildChange);
        _this.regNetMsg(S2cProtocol.sc_guild_change_notice_ret, _this._RecvNoticeChange);
        _this.regNetMsg(S2cProtocol.sc_guild_rename_ret, _this._RecvChangeGangName);
        _this.regNetMsg(S2cProtocol.sc_guild_record_data, _this._RecvRecordInfo);
        _this.regNetMsg(S2cProtocol.sc_guild_record_add, _this._RecvAddRecordInfo);
        _this.regNetMsg(S2cProtocol.sc_guild_donate_ret, _this._RecvDonateData);
        _this.regNetMsg(S2cProtocol.sc_guild_donate_info, _this._RecvContributeCount);
        _this.regNetMsg(S2cProtocol.sc_guild_protector_info, _this._RecvProtectorData);
        _this.regNetMsg(S2cProtocol.sc_guild_boss_info, _this._RecvGangBossData);
        _this.regNetMsg(S2cProtocol.sc_guild_peach_info, _this._panTaoInfo);
        _this.regNetMsg(S2cProtocol.sc_guild_peach_record, _this._panTaoTol);
        _this.regNetMsg(S2cProtocol.sc_guild_peach_record_add, _this._addPantaoInfo);
        _this.regNetMsg(S2cProtocol.sc_guild_protector_task_info, _this._RecvProtectorTaskData);
        return _this;
    }
    GangModel.prototype.Init = function () {
    };
    //请求蟠桃数据
    GangModel.prototype.SendGetPanTaoHuiInfo = function () {
        this.Rpc(C2sProtocol.cs_guild_peach_info);
    };
    //蟠桃会信息
    GangModel.prototype._panTaoInfo = function (rsp) {
        this.rewardMark = rsp.rewardMark;
        this.getPantao = rsp.eatStatus;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_PANTAOINFO);
    };
    //蟠桃会总记录和经验
    GangModel.prototype._panTaoTol = function (rsp) {
        this.panTaoHuiList = rsp.eatRecord;
        this.panTaoHuiExp = rsp.peachExp;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_PANTAOINFO);
    };
    //蟠桃会添加一条记录
    GangModel.prototype._addPantaoInfo = function (rsp) {
        this.panTaoHuiList.push(rsp.eatRecord);
        this.panTaoHuiExp = rsp.peachExp;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_PANTAOINFO);
    };
    //使用蟠桃
    GangModel.prototype.panTaoeatPeach = function (id) {
        var config = GlobalConfig.ins().GuildPeachConfig[id];
        if (!Checker.Money(config.cost.id, config.cost.count, Checker.YUNBAO_FRAME))
            return;
        if (this.getPantao) {
            UserTips.ins().showTips("今日已使用过该物品");
            return;
        }
        var msg = new Sproto.cs_guild_peach_eat_request;
        msg.id = id;
        this.Rpc(C2sProtocol.cs_guild_peach_eat, msg);
    };
    //获取帮会等级
    GangModel.prototype.getGangLv = function () {
        var lv = 0;
        if (this.myGangInfo && this.myGangInfo.mLevel) {
            lv = this.myGangInfo.mLevel;
        }
        return lv;
    };
    GangModel.prototype.getPanTaoRed = function (id) {
        if (!BitUtil.Has(this.rewardMark, id - 1)) {
            return false;
        }
        if (GlobalConfig.ins().GuildPeachRewardConfig[id].exp > this.panTaoHuiExp) {
            return 1;
        }
        return 2;
    };
    GangModel.prototype.getPanTaoJl = function (id) {
        if (!BitUtil.Has(this.rewardMark, id - 1)) {
            UserTips.ins().showTips("奖励已领取");
            return false;
        }
        if (GlobalConfig.ins().GuildPeachRewardConfig[id].exp > this.panTaoHuiExp) {
            UserTips.ins().showTips("未达到所需蟠桃值");
            return 1;
        }
        return 2;
    };
    //领取奖励
    GangModel.prototype.panTaoBoxPeach = function (id) {
        if (!BitUtil.Has(this.rewardMark, id - 1)) {
            UserTips.ins().showTips("奖励已领取");
            return;
        }
        if (GlobalConfig.ins().GuildPeachRewardConfig[id].exp > this.panTaoHuiExp) {
            UserTips.ins().showTips("未达到所需蟠桃值");
            return;
        }
        var msg = new Sproto.cs_guild_peach_reward_request;
        msg.id = id;
        this.Rpc(C2sProtocol.cs_guild_peach_reward, msg);
    };
    GangModel.prototype._DoInitInfo = function (rsp) {
        this.mGangId = rsp.id;
        this.mGangName = rsp.name;
        this.mMyGangInfo.UpdateInfo(rsp.summary, rsp.variable);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_INIT);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_BASE_INFO);
    };
    GangModel.prototype._RecvGetBangList = function (rsp) {
        this.mReceiveCount = rsp.receiveCount;
        var guilds = rsp.guilds;
        this.mGangList = new Array();
        var idx = 1;
        for (var _i = 0, _a = rsp.guilds; _i < _a.length; _i++) {
            var info = _a[_i];
            var tempGangInfo = new GangInfo;
            tempGangInfo.UpdateInfo(info, idx);
            this.mGangList.push(tempGangInfo);
            idx++;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_LIST);
    };
    GangModel.prototype._RecvCreateGang = function (rsp) {
        if (rsp.result != 0)
            return;
        this.mGangId = rsp.id;
        this.Rpc(C2sProtocol.cs_guild_getinfo);
        GameGlobal.GangModel.SendGetPanTaoHuiInfo();
        GameGlobal.GangModel.sendGetSkillInfos();
        GameGlobal.GangModel.sendGetProtectorInfo();
        GameGlobal.GangMapModel.SendGetExchange();
        GameGlobal.GuildTeamModel.SendGetInfos();
        GameGlobal.GangModel.sendGetGangBossInfo();
        this._GangIdChange();
    };
    GangModel.prototype._RecvAppliedGangList = function (rsp) {
        this.mAppliedMap = {};
        this.mAppliedCount = rsp.guilds.length;
        for (var _i = 0, _a = rsp.guilds; _i < _a.length; _i++) {
            var info = _a[_i];
            var tempGangInfo = this.mAppliedMap[info.id];
            if (!tempGangInfo) {
                this.mAppliedMap[info.id] = info.id;
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_APPLIED_LIST);
    };
    GangModel.prototype._RecvMyOtherInfo = function (rsp) {
        if (!this.mMyGangInfo)
            return;
        this.mMyGangInfo.UpdateOtherInfo(rsp);
    };
    GangModel.prototype._RecvApplicantList = function (rsp) {
        this.mApplicantList = new Array();
        for (var _i = 0, _a = rsp.applyinfo; _i < _a.length; _i++) {
            var info = _a[_i];
            var tempApplicantInfo = new ApplicantInfo;
            tempApplicantInfo.UpdateInfo(info);
            this.mApplicantList.push(tempApplicantInfo);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_APPLICANT_LIST);
    };
    GangModel.prototype._RecvNoticeJionGang = function (rsp) {
        if (rsp.result == 0) {
            this.mGangId = 0;
            ViewManager.ins().close(GangListWin);
            return;
        }
        this.mGangId = rsp.id;
        this.Rpc(C2sProtocol.cs_guild_getinfo);
        GameGlobal.GangModel.SendGetPanTaoHuiInfo();
        GameGlobal.GangModel.sendGetSkillInfos();
        GameGlobal.GangModel.sendGetProtectorInfo();
        GameGlobal.GangMapModel.SendGetExchange();
        GameGlobal.GuildTeamModel.SendGetInfos();
        GameGlobal.GangModel.sendGetGangBossInfo();
        this._GangIdChange();
    };
    GangModel.prototype._RecvSetAutoJoin = function (rsp) {
        this.mMyGangInfo.UpdateAutoJoinInfo(rsp.autoJoin, rsp.needPower);
        UserTips.ins().showTips("设置成功");
    };
    //获取技能信息
    GangModel.prototype._RecvSeSkillData = function (rsp) {
        var skillInfos = rsp.skillInfos;
        for (var _i = 0, skillInfos_1 = skillInfos; _i < skillInfos_1.length; _i++) {
            var skillInfo = skillInfos_1[_i];
            var gangSkillInfo = this.mSkillMap[skillInfo.posId];
            if (!gangSkillInfo) {
                gangSkillInfo = new GangSkillInfo;
                this.mSkillMap[skillInfo.posId] = gangSkillInfo;
            }
            gangSkillInfo.UpdateInfo(skillInfo);
        }
        skillInfos = skillInfos.sort(GangConst.sortSkill);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_SKILL_UP, skillInfos);
    };
    GangModel.prototype._RecvSeLearnSkillData = function (rsp) {
        var skillInfo = rsp.skillInfo;
        var gangSkillInfo = this.mSkillMap[skillInfo.posId];
        if (gangSkillInfo)
            gangSkillInfo.UpdateInfo(skillInfo);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_SKILL_LEARN_UP, skillInfo);
    };
    GangModel.prototype._RecvMemberList = function (rsp) {
        this.mMemberList = new Array();
        for (var _i = 0, _a = rsp.members; _i < _a.length; _i++) {
            var info = _a[_i];
            var tempMemberInfo = new GangMemberInfo;
            tempMemberInfo.UpdateInfo(info);
            this.mMemberList.push(tempMemberInfo);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_MEMBER_LIST);
    };
    GangModel.prototype._RecvOfficeChange = function (rsp) {
        var playerId = rsp.playerid;
        var office = rsp.office;
        if (playerId == GameGlobal.actorModel.actorID) {
            this.myGangInfo.mOffice = office;
        }
        for (var _i = 0, _a = this.mMemberList; _i < _a.length; _i++) {
            var memberInfo = _a[_i];
            if (memberInfo.mPlayerId == playerId) {
                memberInfo.mOffice = office;
                break;
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_MEMBER_LIST);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_MEMBER_INFO);
    };
    GangModel.prototype._RecvKickOut = function (rsp) {
        var playerId = rsp.playerid;
        var index = 0;
        for (var _i = 0, _a = this.mMemberList; _i < _a.length; _i++) {
            var memberInfo = _a[_i];
            if (memberInfo.mPlayerId == playerId) {
                this.mMemberList.splice(index, 1);
                break;
            }
            index++;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_MEMBER_LIST);
    };
    GangModel.prototype._RecvCapitalChange = function (rsp) {
        if (!this.myGangInfo) {
            return;
        }
        this.myGangInfo.mCapital = rsp.fund;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_BASE_INFO);
    };
    GangModel.prototype._RecvJoinInfo = function () {
        //有人申请加入帮会的通知  可用来显示红点
        this.SendGetApplicantList();
    };
    GangModel.prototype._RecvGuildChange = function (rsp) {
        var oldId = this.mGangId;
        this.mGangId = rsp.guildID;
        this.mGangName = rsp.guildName;
        if (oldId) {
            this.resetInfo();
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_EXIT_NOTICE);
    };
    GangModel.prototype._RecvNoticeChange = function (rsp) {
        this.mMyGangInfo.mNotice = rsp.text;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_BASE_INFO);
    };
    GangModel.prototype._RecvChangeGangName = function (rsp) {
        if (rsp.errorInfo) {
            UserTips.ins().showTips(rsp.errorInfo);
            return;
        }
        this.mMyGangInfo.mGangName = rsp.newGuildName;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_BASE_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_CHANGE_NAME);
    };
    GangModel.prototype._RecvRecordInfo = function (rsp) {
        var infos = rsp.records;
        var msgList = [];
        if (infos != null) {
            for (var i = 0; i < infos.length; i++) {
                var type = infos[i].type;
                if (type == GangRecordInfo.History) {
                    this.gangRecordInfo.addRecordToString(infos[i]);
                }
                else if (type == GangRecordInfo.Chat) {
                    msgList.push(infos[i].chatRecord);
                }
                // this.gangRecordInfo.addRecordToString(infos[i]);
            }
        }
        if (msgList.length) {
            GameGlobal.Chat.DoGuildMessagess(msgList);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_RECORD);
    };
    GangModel.prototype._RecvAddRecordInfo = function (rsp) {
        var type = rsp.record.type;
        if (type == GangRecordInfo.History) {
            this.gangRecordInfo.addRecordToString(rsp.record);
            GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_RECORD);
        }
        else if (type == GangRecordInfo.Chat) {
            GameGlobal.Chat.DoGuildMessages(rsp.record.chatRecord);
        }
    };
    GangModel.prototype._RecvDonateData = function (rsp) {
        if (!rsp.result)
            return;
        this.mCoutributeCount = rsp.totalNum;
        UserTips.ins().showTips("捐献成功");
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_CONTRIBUTECOUNT);
    };
    GangModel.prototype._RecvContributeCount = function (rsp) {
        this.mCoutributeCount = rsp.totalNum;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_CONTRIBUTECOUNT);
    };
    GangModel.prototype._RecvProtectorData = function (rsp) {
        this.mProtectorInfo = new GangProtectorInfo;
        this.mProtectorInfo.parser(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_PROTECTOR_INFO, rsp);
    };
    GangModel.prototype._RecvProtectorTaskData = function (rsp) {
        if (rsp.taskinfos != null) {
            this.gangProtectorTaskInfo = rsp.taskinfos;
            GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_PROTECTOR_TASK_INFO, rsp);
        }
    };
    //返回帮会boss数据 更新也是这条
    GangModel.prototype._RecvGangBossData = function (rsp) {
        // if(rsp.event == 1){
        //     //开始，进入副本战斗界面 指开始时间到了
        // 	ViewManager.ins().closeAll();
        // }
        // else 
        // {
        // 	if(rsp.event == 2)//指结束时间到了
        // 		ViewManager.ins().open(GangBossPanel);
        // }
        this.mGangBossInfo.UpdateInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_GANG_BOSS_INFO, rsp);
    };
    GangModel.prototype._GangIdChange = function () {
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_ID_CHANGE);
    };
    // 发送请求--------------------------
    GangModel.prototype.SendGetPlayerInfo = function () {
        this.Rpc(C2sProtocol.cs_guild_getplayerinfo);
    };
    GangModel.prototype.SendGetGangBaseInfo = function () {
        this.Rpc(C2sProtocol.cs_guild_getinfo);
    };
    GangModel.prototype.SendCreateGang = function (id, name) {
        var req = new Sproto.cs_guild_create_request;
        req.id = id;
        req.name = name;
        this.Rpc(C2sProtocol.cs_guild_create, req);
    };
    //帮会改名
    GangModel.prototype.sendChangeName = function (name) {
        var req = new Sproto.cs_guild_rename_request;
        req.guildName = name;
        this.Rpc(C2sProtocol.cs_guild_rename, req);
    };
    //帮会技能
    GangModel.prototype.sendGetSkillInfos = function () {
        var req = new Sproto.cs_guild_skill_info_request;
        this.Rpc(C2sProtocol.cs_guild_skill_info, req);
    };
    //帮会技能
    GangModel.prototype.sendLearnGangSkill = function () {
        var req = new Sproto.cs_guild_skill_learn_request;
        this.Rpc(C2sProtocol.cs_guild_skill_learn, req);
    };
    //获取帮会列表
    GangModel.prototype.SendGetGangList = function () {
        this.Rpc(C2sProtocol.cs_guild_getlist);
    };
    //获取申请列表
    GangModel.prototype.SendGetApplyList = function () {
        this.Rpc(C2sProtocol.cs_guild_apply_list);
    };
    //发送请求加入
    GangModel.prototype.SendJoinGang = function (id) {
        var req = new Sproto.cs_guild_join_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_guild_join, req);
    };
    GangModel.prototype.SendSetApply = function (playerId, isAgree) {
        var req = new Sproto.cs_guild_setapply_request;
        req.playerid = playerId;
        req.result = isAgree ? 1 : 0;
        this.Rpc(C2sProtocol.cs_guild_setapply, req);
    };
    GangModel.prototype.SendAutoJoin = function (auto, power) {
        var req = new Sproto.cs_guild_setautoadd_request;
        req.auto = auto;
        req.power = power;
        this.Rpc(C2sProtocol.cs_guild_setautoadd, req);
    };
    GangModel.prototype.SendGetApplicantList = function () {
        this.Rpc(C2sProtocol.cs_guild_getapply);
    };
    GangModel.prototype.SendGetMemberList = function () {
        this.Rpc(C2sProtocol.cs_guild_getmembers);
    };
    GangModel.prototype.SendExchangOffice = function (playerId, office) {
        var req = new Sproto.cs_guild_change_office_request;
        req.playerid = playerId;
        req.office = office;
        this.Rpc(C2sProtocol.cs_guild_change_office, req);
    };
    GangModel.prototype.SendKickOutMember = function (playerId) {
        var req = new Sproto.cs_guild_kick_request;
        req.playerid = playerId;
        this.Rpc(C2sProtocol.cs_guild_kick, req);
    };
    GangModel.prototype.SendExit = function () {
        this.Rpc(C2sProtocol.cs_guild_quit);
    };
    GangModel.prototype.SendModifyNotice = function (text) {
        var req = new Sproto.cs_guild_change_notice_request;
        req.text = text;
        this.Rpc(C2sProtocol.cs_guild_change_notice, req);
    };
    GangModel.prototype.SendGetJuanXuanList = function (id) {
        var req = new Sproto.cs_guild_donate_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_guild_donate, req);
    };
    //发送获取帮派守护信息
    GangModel.prototype.sendGetProtectorInfo = function () {
        var req = new Sproto.cs_guild_protector_info_request;
        this.Rpc(C2sProtocol.cs_guild_protector_info, req);
    };
    //发送获取帮派守护升级信息
    GangModel.prototype.sendProtectorUpLv = function () {
        var req = new Sproto.cs_guild_protector_uplevel_request;
        this.Rpc(C2sProtocol.cs_guild_protector_uplevel, req);
    };
    //发送获取帮派守护每日奖励信息
    GangModel.prototype.sendGetProtectorEveryDataAward = function (id) {
        var req = new Sproto.cs_guild_protector_everyday_reward_request;
        req.rewardId = id;
        this.Rpc(C2sProtocol.cs_guild_protector_everyday_reward, req);
    };
    //帮会boss --------------------------------------
    //发送获取帮派守护每日奖励信息
    GangModel.prototype.sendGetGangBossInfo = function () {
        var req = new Sproto.cs_guild_boss_info_request;
        this.Rpc(C2sProtocol.cs_guild_boss_info, req);
    };
    //发送挑战帮会boss
    GangModel.prototype.sendPKGangBoss = function () {
        var req = new Sproto.cs_guild_boss_pk_request;
        this.Rpc(C2sProtocol.cs_guild_boss_pk, req);
    };
    //发送领取boss奖励
    GangModel.prototype.sendGetGangBossAward = function () {
        var req = new Sproto.cs_guild_boss_reward_request;
        this.Rpc(C2sProtocol.cs_guild_boss_reward, req);
    };
    //-------------------------------------------------------------------
    GangModel.prototype.SendRecruitMember = function () {
        var req = new Sproto.cs_guild_member_recruit_request;
        this.Rpc(C2sProtocol.cs_guild_member_recruit, req);
    };
    GangModel.prototype.resetInfo = function () {
        this.mMyGangInfo = new MyGangInfo;
        this.mGangList = null;
        this.mAppliedMap = {};
        this.mApplicantList = null;
        this.mMemberList = [];
        this.mSkillMap = {};
        this.mProtectorInfo = null;
        this.gangRecordInfo = new GangRecordInfo;
        this.gangProtectorTaskInfo = [];
        this.panTaoHuiList = [];
        this.panTaoHuiExp = 0;
        this.rewardMark = 0;
        this.getPantao = false;
        this.mGangBossInfo = new GangBossInfo;
        this._GangIdChange();
    };
    Object.defineProperty(GangModel.prototype, "gangList", {
        get: function () {
            return this.mGangList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangModel.prototype, "myGangInfo", {
        get: function () {
            return this.mMyGangInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangModel.prototype, "applicantList", {
        get: function () {
            return this.mApplicantList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangModel.prototype, "memberList", {
        get: function () {
            return this.mMemberList;
        },
        enumerable: true,
        configurable: true
    });
    GangModel.prototype.IsApplied = function (gangId) {
        return this.mAppliedMap[gangId] != null;
    };
    GangModel.prototype.HasGang = function () {
        return this.mGangId > 0;
    };
    Object.defineProperty(GangModel.prototype, "protectorInfo", {
        get: function () {
            return this.mProtectorInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangModel.prototype, "receiveCount", {
        get: function () {
            return this.mReceiveCount;
        },
        enumerable: true,
        configurable: true
    });
    GangModel.prototype.HandleApplicant = function (playerId) {
        var index = 0;
        for (var _i = 0, _a = this.mApplicantList; _i < _a.length; _i++) {
            var applicantInfo = _a[_i];
            if (applicantInfo.mPlayerId == playerId) {
                this.mApplicantList.splice(index, 1);
                break;
            }
            index++;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_APPLICANT_LIST);
    };
    GangModel.prototype.GetMemberInfoByPlayerId = function (playerId) {
        for (var _i = 0, _a = this.mMemberList; _i < _a.length; _i++) {
            var memberInfo = _a[_i];
            if (memberInfo.mPlayerId == playerId) {
                return memberInfo;
            }
        }
    };
    GangModel.prototype.GetDeputyCount = function () {
        var count = 0;
        for (var _i = 0, _a = this.mMemberList; _i < _a.length; _i++) {
            var memberInfo = _a[_i];
            if (memberInfo.mOffice == GangConst.DEPUTY_OFFICE) {
                count++;
            }
        }
        return count;
    };
    GangModel.prototype.HasPantao = function () {
        if (!this.HasGang())
            return false;
        return !this.getPantao;
    };
    GangModel.prototype.HasPanTaoAward = function () {
        if (!this.HasGang())
            return false;
        for (var key in GameGlobal.Config.GuildPeachRewardConfig) {
            var awardId = parseInt(key);
            var config = GameGlobal.Config.GuildPeachRewardConfig[key];
            if (!BitUtil.Has(this.rewardMark, awardId - 1))
                continue;
            if (config.exp <= this.panTaoHuiExp)
                return true;
        }
        return false;
    };
    GangModel.prototype.CanGangSkillUpgrade = function () {
        if (!this.HasGang())
            return false;
        for (var posId in this.mSkillMap) {
            var gangSkillInfo = this.mSkillMap[posId];
            if (gangSkillInfo.CanUpgrade()) {
                return true;
            }
        }
        return false;
    };
    GangModel.prototype.CanGangProtectorUpgrade = function () {
        if (!this.HasGang() || !this.mProtectorInfo)
            return false;
        var upgradeExp = GangConst.GetProtectorUpgradeExp(this.mProtectorInfo.protectorLv + 1);
        if (upgradeExp == -1)
            return false;
        return this.mProtectorInfo.totalActive >= upgradeExp;
    };
    GangModel.prototype.HasDailyAward = function () {
        if (!this.HasGang() || !this.mProtectorInfo)
            return false;
        for (var key in GameGlobal.Config.GuildEverydayConfig) {
            var config = GameGlobal.Config.GuildEverydayConfig[key];
            if (config.exp <= this.mProtectorInfo.todayActive && (this.mProtectorInfo.rewardMark & Math.pow(2, config.id - 1)) > 0)
                return true;
        }
        return false;
    };
    GangModel.prototype.HasContributeAward = function () {
        if (!this.HasGang() || this.mCoutributeCount == null)
            return false;
        if (this.mCoutributeCount >= GameGlobal.Config.GuildConfig.maxcount)
            return false;
        for (var key in GameGlobal.Config.GuildDonateConfig) {
            var config = GameGlobal.Config.GuildDonateConfig[key];
            var cost = config.cost;
            if (Checker.Data(cost, false))
                return true;
        }
        return false;
    };
    GangModel.prototype.HasGangBoss = function () {
        if (!this.HasGang())
            return false;
        return this.mGangBossInfo.mHasAward || this.mGangBossInfo.mStatus == 1;
    };
    GangModel.prototype.HasApplicant = function () {
        if (!this.HasGang() || !this.mApplicantList)
            return false;
        return this.mApplicantList.length > 0;
    };
    GangModel.prototype.IsGangBattleOpen = function () {
        if (!this.HasGang())
            return false;
        return GameGlobal.ActivityModel.GetActivityOpenFlag(ActivityModel.TYPE_GANG_BATTLE);
    };
    GangModel.prototype.OpenGangView = function () {
        if (GameGlobal.GangModel.HasGang())
            ViewManager.ins().open(GangMainWin);
        else
            ViewManager.ins().open(GangListWin);
    };
    return GangModel;
}(BaseSystem));
__reflect(GangModel.prototype, "GangModel");
//# sourceMappingURL=GangModel.js.map