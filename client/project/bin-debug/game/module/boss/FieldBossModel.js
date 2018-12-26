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
var Enum_BOSSTYPE;
(function (Enum_BOSSTYPE) {
    Enum_BOSSTYPE[Enum_BOSSTYPE["field_boss"] = 1] = "field_boss";
    Enum_BOSSTYPE[Enum_BOSSTYPE["public_boss"] = 2] = "public_boss";
    Enum_BOSSTYPE[Enum_BOSSTYPE["person_boss"] = 3] = "person_boss";
    Enum_BOSSTYPE[Enum_BOSSTYPE["vip_boss"] = 4] = "vip_boss";
})(Enum_BOSSTYPE || (Enum_BOSSTYPE = {}));
var BossModel = (function (_super) {
    __extends(BossModel, _super);
    function BossModel() {
        var _this = _super.call(this) || this;
        _this.m_FieldBossInfo = [];
        _this.m_PublicBossInfo = [];
        _this.m_VipBossInfo = [];
        /**挑战次数*/
        _this.pBossChallengenum = 0;
        /**恢复时间 */
        _this.pBossRecovertiem = 0;
        /***购买挑战次数 */
        _this.purchasecount = 0;
        /**复活次数 */
        _this.reborncount = 0;
        // public static GetNextFreshTimeStr(bossInfo: FieldBossInfo) {
        // 	let str = ""
        // 	let baseConfig = GameGlobal.Config.FieldBossCommonConfig
        // 	let refreshtime = baseConfig.refreshtime
        // 	let strTime = parseInt(refreshtime[0])
        // 	if (bossInfo.status == FieldBossState.CLOSE) {
        // 		str = "0" + strTime + ":00"
        // 	} else {
        // 		let date = new Date(GameServer.serverTime * 1000)
        // 		let hours = date.getHours()
        // 		let minute = date.getMinutes()
        // 		if (minute < 30) {
        // 			minute = 30
        // 		} else {
        // 			hours = hours + 1
        // 			minute = 0
        // 		}
        // 		str = DateUtils.formatTimeNum(hours) + ":" + DateUtils.formatTimeNum(minute)
        // 	}
        // 	return `|C:0xF5D061&T:下次刷新时间：|C:0x019704&T:${str}|`
        // }
        _this.m_OpenTime = null;
        _this.mIsChallengeTime = {
            mTime: -1000,
            mIsChallenge: false
        };
        _this.mRedPoint = new BossModelRedPoint();
        return _this;
    }
    BossModel.prototype.Init = function () {
        var config = GameGlobal.Config.FieldBossConfig;
        for (var key in config) {
            var configData = config[key];
            var bossInfo = new FieldBossInfo();
            bossInfo.id = configData.id;
            bossInfo.level = configData.level;
            bossInfo.hp = 0;
            bossInfo.ownerName = "";
            bossInfo.ownerGuildName = "";
            bossInfo.ownerHeadId = UIHelper.DEFUALT_HEAD_ID;
            bossInfo.status = FieldBossState.CLOSE;
            bossInfo.leftTime = 0;
            this.m_FieldBossInfo.push(bossInfo);
        }
        config = GameGlobal.Config.PublicBossConfig;
        for (var key in config) {
            var configData = config[key];
            var bossInfo = new PublicBossInfo();
            bossInfo.id = configData.id;
            bossInfo.level = configData.level;
            bossInfo.hp = 0;
            // bossInfo.ownerName = ""
            // bossInfo.ownerGuildName = ""
            // bossInfo.ownerHeadId = UIHelper.DEFUALT_HEAD_ID
            bossInfo.status = FieldBossState.CLOSE;
            // bossInfo.leftTime = 0
            this.m_PublicBossInfo.push(bossInfo);
        }
        config = GameGlobal.Config.VipBossConfig;
        for (var item in config) {
            var pBoss = new VipBossInfo();
            pBoss.initLocalData(config[item]);
            this.m_VipBossInfo.push(pBoss);
        }
        SortTools.sortMap(this.m_PublicBossInfo, 'id', true);
        SortTools.sortMap(this.m_FieldBossInfo, 'id', true);
        this.regNetMsg(S2cProtocol.sc_field_boss_base_list, this._DoBossList);
        this.regNetMsg(S2cProtocol.sc_field_boss_update_one, this._UpdateFieldBoss);
        this.regNetMsg(S2cProtocol.sc_public_boss_base_list, this._DoPublicList);
        this.regNetMsg(S2cProtocol.sc_public_boss_update_one, this._DoUpdatePublicBossOne);
        this.regNetMsg(S2cProtocol.sc_public_boss_update_challenge, this._DoUpdatePublicBossChallenge);
        this.regNetMsg(S2cProtocol.sc_public_boss_record_attack, this._DoPublicBossRecord);
        this.regNetMsg(S2cProtocol.sc_public_boss_record_kill, this._DoPublicBossKillRecord);
        this.regNetMsg(S2cProtocol.sc_public_boss_challenge_fail, this._DoPublicBossChallengeResult);
        this.regNetMsg(S2cProtocol.sc_public_boss_update_attack, this._DoPublicBossUpdateAtk);
        //vipboss
        this.regNetMsg(S2cProtocol.sc_vipboss_base_list, this.vipBossBase);
        this.regNetMsg(S2cProtocol.sc_vipboss_update_one, this.vipBossUpdateOne);
    };
    BossModel.prototype.getRemindByIndex = function (index) {
        return ((this.bossRemind >> (index + 1)) & 1) == 1;
    };
    ;
    BossModel.prototype.setRemind = function (value) {
        this.bossRemind ^= value;
        this.sendSaveRemind();
    };
    ;
    BossModel.prototype.GetBossInfoById = function (type, id) {
        if (type == Enum_BOSSTYPE.field_boss) {
            for (var _i = 0, _a = this.m_FieldBossInfo; _i < _a.length; _i++) {
                var info = _a[_i];
                if (info.id == id) {
                    return info;
                }
            }
        }
        else if (type == Enum_BOSSTYPE.public_boss) {
            for (var _b = 0, _c = this.m_PublicBossInfo; _b < _c.length; _b++) {
                var info = _c[_b];
                if (info.id == id) {
                    return info;
                }
            }
        }
        return null;
    };
    BossModel.prototype.GetBossInfos = function (type) {
        if (type == Enum_BOSSTYPE.field_boss) {
            return this.m_FieldBossInfo;
        }
        else if (type == Enum_BOSSTYPE.public_boss) {
            return this.m_PublicBossInfo;
        }
    };
    BossModel.prototype.getVipBossInfo = function () {
        return this.m_VipBossInfo;
    };
    BossModel.prototype.GetNextRefreshTime = function () {
        var openTime = this.GetOpenTime();
        var time = GameServer.serverTime * 1000;
        if (time >= openTime.mCloseStart && time <= openTime.mCloseEnd) {
            var baseConfig = GameGlobal.Config.FieldBossCommonConfig;
            var refreshtime = baseConfig.refreshtime;
            var strTime = parseInt(refreshtime[0]);
            return "0" + strTime + ":00:00";
        }
        var date = new Date(GameServer.serverTime * 1000);
        var hours = date.getHours();
        var minute = date.getMinutes();
        if (minute < 30) {
            minute = 30;
        }
        else {
            hours = hours + 1;
            minute = 0;
        }
        return DateUtils.formatTimeNum(hours) + ":" + DateUtils.formatTimeNum(minute) + ":00";
    };
    BossModel.prototype.GetRunTime = function () {
        var openTime = this.GetOpenTime();
        var time = GameServer.serverTime * 1000;
        if (time >= openTime.mCloseStart && time <= openTime.mCloseEnd) {
            var baseConfig = GameGlobal.Config.FieldBossCommonConfig;
            var refreshtime = baseConfig.refreshtime;
            var strTime = parseInt(refreshtime[0]);
            return "0" + strTime + ":00:00";
        }
        var date = new Date(GameServer.serverTime * 1000);
        var hours = date.getHours();
        var minute = date.getMinutes();
        if (minute < 30) {
            minute = 25;
        }
        else {
            minute = 55;
        }
        return DateUtils.formatTimeNum(hours) + ":" + DateUtils.formatTimeNum(minute) + ":00";
    };
    BossModel.prototype.OnDayTimer = function () {
        this.m_OpenTime = null;
    };
    BossModel.prototype.GetOpenTime = function () {
        if (this.m_OpenTime == null) {
            var startDate = new Date(GameServer.serverTime * 1000);
            startDate.setHours(8, 0, 0, 0);
            var endDate = new Date(GameServer.serverTime * 1000);
            endDate.setDate(endDate.getDate() + 1);
            endDate.setHours(2, 25, 0, 0);
            var closeStart = new Date(GameServer.serverTime * 1000);
            closeStart.setHours(2, 25, 0, 0);
            var closeEnd = new Date(GameServer.serverTime * 1000);
            closeEnd.setHours(8, 0, 0, 0);
            this.m_OpenTime = {
                mStart: startDate.getTime(),
                mEnd: endDate.getTime(),
                mCloseStart: closeStart.getTime(),
                mCloseEnd: closeEnd.getTime()
            };
        }
        return this.m_OpenTime;
    };
    // 是否是逃跑的状态
    BossModel.prototype.IsRun = function () {
        for (var _i = 0, _a = this.m_FieldBossInfo; _i < _a.length; _i++) {
            var info = _a[_i];
            if (info.status == FieldBossState.RUN) {
                return true;
            }
        }
        return false;
        // let curTime = GameServer.serverTime * 1000
        // let date = new Date(curTime)
        // let minute = date.getMinutes()
        // let t = GameGlobal.Config.FieldBossCommonConfig
        // if (minute <= 30) {
        // 	return minute >= t.escapetime
        // } else {
        // 	return minute >= (t.escapetime + 30)
        // }
    };
    BossModel.prototype.GetRunLeftTime = function () {
        var time = GameServer.serverTime * 1000;
        var date = new Date(time);
        var minute = date.getMinutes();
        var t = GameGlobal.Config.FieldBossCommonConfig;
        if (minute < 30) {
            date.setMinutes(t.escapetime, 0, 0);
        }
        else {
            date.setMinutes(t.escapetime + 30, 0, 0);
        }
        return date.getTime() - time;
    };
    BossModel.prototype._IsChallengeTime = function () {
        this.mIsChallengeTime.mTime = egret.getTimer();
        var openTime = this.GetOpenTime();
        var time = GameServer.serverTime * 1000;
        if (time >= openTime.mCloseStart && time <= openTime.mCloseEnd) {
            return false;
        }
        var date = new Date(GameServer.serverTime * 1000);
        var hours = date.getHours();
        var minute = date.getMinutes();
        var t = GameGlobal.Config.FieldBossCommonConfig;
        if (minute < 30) {
            return minute < t.escapetime;
        }
        else {
            return minute < (t.escapetime + 30);
        }
    };
    BossModel.prototype.IsChallengeTime = function () {
        var t = egret.getTimer();
        var data = this.mIsChallengeTime;
        if (t - data.mTime > 1000) {
            data.mTime = t;
            data.mIsChallenge = this._IsChallengeTime();
        }
        return data.mIsChallenge;
    };
    BossModel.prototype.buyFunc = function () {
        var str = "花费|C:0xd27701&T:" + GameGlobal.Config.PublicBossBaseConfig.cost + "元宝|购买|C:0x0fc06&T:" + GameGlobal.Config.PublicBossBaseConfig.income + "次|挑战次数\r";
        str += "剩余|C:0x0fc06&T:" + (GameGlobal.Config.VipChallengeTimesConfig[GameGlobal.actorModel.vipLv].buychasingtimes - this.purchasecount) + "|次\r";
        var nextCfg = GameGlobal.Config.VipChallengeTimesConfig[GameGlobal.actorModel.vipLv + 1];
        if (nextCfg) {
            str += "|C:0x0fc06&T:vip" + (GameGlobal.actorModel.vipLv + 1) + "|每天可购买|C:0x0fc06&T:" + nextCfg.buychasingtimes + "|次";
        }
        WarnWin.show(str, this.onBuy, this);
    };
    BossModel.prototype.onBuy = function () {
        if (GameGlobal.Config.VipChallengeTimesConfig[GameGlobal.actorModel.vipLv].buychasingtimes - this.purchasecount <= 0) {
            UserTips.InfoTip("购买次数已达上限");
            return;
        }
        if (Checker.Money(MoneyConst.yuanbao, GameGlobal.Config.PublicBossBaseConfig.cost, true)) {
            GameGlobal.BossModel.sendBuyChallege();
        }
    };
    //=================================协议==================
    /**
    * 初始化野外BOSS
    */
    BossModel.prototype._DoBossList = function (rsp) {
        for (var _i = 0, _a = rsp.bossInfos; _i < _a.length; _i++) {
            var data = _a[_i];
            var bossInfo = this.GetBossInfoById(Enum_BOSSTYPE.field_boss, data.id);
            if (bossInfo) {
                bossInfo.hp = data.hp;
                bossInfo.status = data.status;
                bossInfo.ownerId = data.ownerId;
                bossInfo.ownerName = data.ownerName;
                bossInfo.ownerHeadId = data.ownerJob * 10 + data.ownerSex;
                bossInfo.leftTime = data.time || 0;
                bossInfo.ischallenge = data.ischallenge || false;
            }
            else {
                console.error("not boss id => " + data.id);
            }
        }
        // SortTools.sortMap(this.m_FieldBossInfo,'Weight',true)
        GameGlobal.MessageCenter.dispatch(MessageDef.FIELD_BOSS_UPDATE);
    };
    BossModel.prototype._UpdateFieldBoss = function (rsp) {
        var data = rsp.bossInfo;
        var bossInfo = this.GetBossInfoById(Enum_BOSSTYPE.field_boss, data.id);
        if (bossInfo) {
            bossInfo.hp = data.hp;
            bossInfo.status = data.status;
            bossInfo.ownerId = data.ownerId;
            bossInfo.ownerName = data.ownerName;
            bossInfo.ownerHeadId = data.ownerJob * 10 + data.ownerSex;
            bossInfo.leftTime = data.time || 0;
            bossInfo.ischallenge = data.ischallenge || false;
        }
        else {
            console.error("not boss id => " + data.id);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.FIELD_BOSS_UPDATE);
    };
    BossModel.prototype._DoPublicList = function (rsp) {
        for (var _i = 0, _a = rsp.bossInfos; _i < _a.length; _i++) {
            var data = _a[_i];
            var bossInfo = this.GetBossInfoById(Enum_BOSSTYPE.public_boss, data.id);
            if (bossInfo) {
                bossInfo.parser(data);
            }
            else {
                console.error("not boss id => " + data.id);
            }
        }
        // this.m_PublicBossInfo.sort(BossModel.Sort2)
        // SortTools.sortMap(this.m_PublicBossInfo,'Weight',true)
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_UPDATE);
    };
    BossModel.prototype._DoUpdatePublicBossOne = function (rsp) {
        var bossInfo = this.GetBossInfoById(Enum_BOSSTYPE.public_boss, rsp.bossInfo.id);
        if (bossInfo) {
            bossInfo.parser(rsp.bossInfo);
        }
        if (GameGlobal.BossModel.getRemindByIndex(rsp.bossInfo.id - 1))
            if (rsp.bossInfo.reborn)
                GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_REBORN, rsp.bossInfo.id, true);
        // SortTools.sortMap(this.m_PublicBossInfo,'Weight',true)
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_UPDATE);
    };
    BossModel.prototype._DoUpdatePublicBossChallenge = function (rsp) {
        this.pBossChallengenum = rsp.challengenum;
        this.pBossRecovertiem = rsp.recovertiem;
        this.purchasecount = rsp.purchasecount;
        this.reborncount = rsp.reborncount;
        this.bossRemind = rsp.rebornmark;
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_UPDATE);
    };
    BossModel.prototype._DoPublicBossRecord = function (rsp) {
        SortTools.sortMap(rsp.attackinfos, "injure", false);
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_RECORD, [rsp.rank, rsp.attackinfos]);
    };
    BossModel.prototype._DoPublicBossKillRecord = function (rsp) {
        SortTools.sortMap(rsp.killinfos, "killtime", false);
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_RECORD_KILL, rsp.killinfos);
    };
    BossModel.prototype._DoPublicBossUpdateAtk = function (rsp) {
        this.mPubBossAtkInfo = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_UPDATE_ATK);
    };
    // 清理全民boss伤害信息
    BossModel.prototype.ClearPubBossAtkInfo = function () {
        this.mPubBossAtkInfo = null;
    };
    BossModel.prototype._DoPublicBossChallengeResult = function (rsp) {
        UserTips.ErrorTip("挑战失败，BOSS已经死亡");
    };
    BossModel.prototype.vipBossBase = function (rsp) {
        //刷新vipboss 数据内容 //整体
        for (var item in this.m_VipBossInfo) {
            var pData = this.m_VipBossInfo[item];
            for (var index in rsp.bossInfos) {
                if (pData.id == rsp.bossInfos[index].id) {
                    pData.updataDataByServer(rsp.bossInfos[index]); // 更新数据内容
                }
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.VIP_BOSS_UPDATE);
    };
    BossModel.prototype.vipBossUpdateOne = function (rsp) {
        //刷新vipboss 数据内容 //单个
        for (var item in this.m_VipBossInfo) {
            var pData = this.m_VipBossInfo[item];
            if (pData.id == rsp.bossInfo.id) {
                pData.updataDataByServer(rsp.bossInfo);
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.VIP_BOSS_UPDATE);
    };
    /**
    * 请求boss列表数据
    */
    BossModel.prototype.sendCallFieldBossList = function () {
        this.Rpc(C2sProtocol.cs_field_boss_boss_list);
    };
    /**
     * 请求挑战野外boss
     * 1-10
     * @param fbID  副本ID
     */
    BossModel.prototype.sendChallenge = function (id) {
        var req = new Sproto.cs_field_boss_challenge_request();
        req.id = id;
        this.Rpc(C2sProtocol.cs_field_boss_challenge, req);
    };
    BossModel.prototype.sendBuyChallege = function () {
        this.Rpc(C2sProtocol.cs_public_boss_buy_challenge);
    };
    BossModel.prototype.sendPublicChallenge = function (id) {
        var req = new Sproto.cs_public_boss_challenge_request();
        req.id = id;
        this.Rpc(C2sProtocol.cs_public_boss_challenge, req);
    };
    BossModel.prototype.sendPublicReBornChallenge = function (id) {
        var req = new Sproto.cs_public_boss_challenge_reborn_request();
        req.id = id;
        this.Rpc(C2sProtocol.cs_public_boss_challenge_reborn, req);
    };
    BossModel.prototype.sendPublicRecord = function (id) {
        var req = new Sproto.cs_public_boss_record_attack_request();
        req.id = id;
        this.Rpc(C2sProtocol.cs_public_boss_record_attack, req);
    };
    BossModel.prototype.sendPublicKillRecord = function (id) {
        var req = new Sproto.cs_public_boss_record_kill_request();
        req.id = id;
        this.Rpc(C2sProtocol.cs_public_boss_record_kill, req);
    };
    BossModel.prototype.sendSaveRemind = function () {
        var rsp = new Sproto.cs_public_boss_reborn_mark_request;
        rsp.rebornmark = this.bossRemind;
        this.Rpc(C2sProtocol.cs_public_boss_reborn_mark, rsp);
    };
    ;
    //vipboss
    /**
* 请求vip boss列表数据
*/
    BossModel.prototype.sendCallVipBossList = function () {
        this.Rpc(C2sProtocol.cs_vipboss_list);
    };
    //挑战具体关卡
    BossModel.prototype.sendVipbossChallenge = function (_id) {
        if (!_id)
            return;
        var rsp = new Sproto.cs_vipboss_challenge_request;
        rsp.id = _id;
        this.Rpc(C2sProtocol.cs_vipboss_challenge, rsp);
    };
    ;
    //全民BOSS 红点提示
    BossModel.prototype.IsPublicBossNotice = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_45)) {
            return false;
        }
        if (this.pBossChallengenum <= 0) {
            return false;
        }
        var list = this.m_PublicBossInfo;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var bossData = list_1[_i];
            if (GameGlobal.actorModel.level >= bossData.level && !bossData.isKill) {
                return true;
            }
        }
        return false;
    };
    //野外BOSS 红点提示
    BossModel.prototype.IsFieldBossNotice = function () {
        var list = this.m_FieldBossInfo;
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var bossData = list_2[_i];
            var config = GameGlobal.Config.FieldBossConfig[bossData.id];
            if (config && config.needbossprops) {
                if (GameGlobal.UserBag.GetCount(config.needbossprops.id) < config.needbossprops.count) {
                    continue;
                }
            }
            if (GameGlobal.actorModel.level >= bossData.level && bossData.status == FieldBossState.OPEN) {
                return true;
            }
        }
        return false;
    };
    //VIPBOSS 红点提示
    BossModel.prototype.IsVIPBossNotice = function () {
        var list = this.m_VipBossInfo;
        for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
            var bossData = list_3[_i];
            var nVipLv = UserVip.ins().lv;
            if ((GameGlobal.actorModel.level >= bossData.levelLimit || nVipLv >= bossData.viplvlimit)
                && (bossData.vipCount[nVipLv] || 1) - bossData.daycount > 0 && Checker.Money(bossData.costgold.id, bossData.costgold.count, false)) {
                return true;
            }
        }
        return false;
    };
    BossModel.prototype.IsRedPointBoss = function (type) {
        return this.mRedPoint.IsRedAct(type);
    };
    BossModel.prototype.IsRedPoint = function () {
        this.mRedPoint.Get(BossModelRedPoint.INDEX_ACT);
        // return this.mRedPoint.IsRedPoint()
        // 不包括至尊boss
        return this.mRedPoint.IsRedAct(BossModelRedPoint.PERSONNAL_BOSS) || this.mRedPoint.IsRedAct(BossModelRedPoint.PUBLIC_BOSS) || this.mRedPoint.IsRedAct(BossModelRedPoint.FIELD_BOSS);
    };
    return BossModel;
}(BaseSystem));
__reflect(BossModel.prototype, "BossModel");
var BossModelRedPoint = (function (_super) {
    __extends(BossModelRedPoint, _super);
    function BossModelRedPoint() {
        var _this = _super.call(this) || this;
        //////////////////////////////////////////
        _this.mRedPointMap = {};
        return _this;
    }
    BossModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.FB_INFO_UPDATE, MessageDef.PUBLIC_BOSS_UPDATE,
            MessageDef.FIELD_BOSS_UPDATE, MessageDef.VIP_BOSS_UPDATE, MessageDef.VIP_LEVEL_CHANGE];
    };
    BossModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[BossModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a;
        var _a;
    };
    BossModelRedPoint.prototype.OnChange = function (index) {
        if (index == BossModelRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.ALL_BOSS_NOTICE);
        }
    };
    BossModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.mRedPointMap) {
            if (this.mRedPointMap[key]) {
                return true;
            }
        }
        return false;
    };
    BossModelRedPoint.prototype.DoActive = function () {
        this.mRedPointMap[BossModelRedPoint.PERSONNAL_BOSS] = GameGlobal.UserFb.IsPersonBossNotice();
        this.mRedPointMap[BossModelRedPoint.PUBLIC_BOSS] = GameGlobal.BossModel.IsPublicBossNotice();
        this.mRedPointMap[BossModelRedPoint.FIELD_BOSS] = GameGlobal.BossModel.IsFieldBossNotice();
        this.mRedPointMap[BossModelRedPoint.VIP_BOSS] = GameGlobal.BossModel.IsVIPBossNotice();
    };
    BossModelRedPoint.prototype.IsRedAct = function (type) {
        this.Get(BossModelRedPoint.INDEX_ACT);
        return this.mRedPointMap[type];
    };
    BossModelRedPoint.INDEX_ACT = 0;
    /** 红点通知类型 */
    //////////////////////////////////////////
    BossModelRedPoint.PERSONNAL_BOSS = 1;
    BossModelRedPoint.PUBLIC_BOSS = 2;
    BossModelRedPoint.FIELD_BOSS = 3;
    BossModelRedPoint.VIP_BOSS = 4;
    return BossModelRedPoint;
}(IRedPoint));
__reflect(BossModelRedPoint.prototype, "BossModelRedPoint");
//# sourceMappingURL=FieldBossModel.js.map