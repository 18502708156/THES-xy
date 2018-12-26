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
var GangBossModel = (function (_super) {
    __extends(GangBossModel, _super);
    function GangBossModel() {
        var _this = _super.call(this) || this;
        _this.tRankLast = null;
        _this.status = 0;
        _this.changetime = 0;
        _this.shieldvalue = 0;
        _this.hp = 0;
        _this.hpperc = 0;
        _this.mCurRank = null;
        _this.mBox = {};
        _this.mCollectNow = {};
        _this.mPlayerDead = 0;
        _this.regNetMsg(S2cProtocol.sc_guildboss_info, _this.doInfo);
        _this.regNetMsg(S2cProtocol.sc_guildboss_update_info, _this.doUpdateInfo);
        _this.regNetMsg(S2cProtocol.sc_guildboss_box_all, _this.doBoxAll);
        _this.regNetMsg(S2cProtocol.sc_guildboss_box_one, _this.doBoxOne);
        _this.regNetMsg(S2cProtocol.sc_guildboss_player_dead, _this.doPlayerDead);
        _this.regNetMsg(S2cProtocol.sc_guildboss_rank_now, _this.doRankNow);
        _this.regNetMsg(S2cProtocol.sc_guildboss_rewards, _this.doRewards);
        _this.regNetMsg(S2cProtocol.sc_guildboss_rank_last, _this.doRankLast);
        _this.regNetMsg(S2cProtocol.sc_guildboss_collect_all, _this.doCollentAll);
        _this.regNetMsg(S2cProtocol.sc_guildboss_collect_now, _this.doCollentNow);
        return _this;
    }
    GangBossModel.prototype.Init = function () {
        _super.prototype.Init.call(this);
    };
    GangBossModel.prototype.OnDayTimer = function () {
        this.m_EndTime = null;
    };
    GangBossModel.prototype.doInfo = function (rsp) {
        this.status = rsp.status;
        this.changetime = rsp.changetime;
        if (this.status == AcrossBossState.BOSS)
            PlayFunView.GameNotice(MainGameNoticeView.TYPE_GANG_BOSS, 600, MainGameNoticeView.SHOW_TYPE_GOTO);
        else
            PlayFunView.RemoveGameNotice(MainGameNoticeView.TYPE_GANG_BOSS);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_UPDATE_INFO);
    };
    GangBossModel.prototype.getEndTime = function () {
        if (!this.m_EndTime) {
            var endTime = GameGlobal.Config.GuildBossBaseConfig.opentime[1];
            var arr = endTime.split(':');
            var date = new Date(GameServer.serverTime * 1000);
            date.setHours(Number(arr[0]), Number(arr[1]), Number(arr[2]), 0);
            this.m_EndTime = Math.floor(date.getTime() / 1000);
        }
        return Math.max(this.m_EndTime - GameServer.serverTime, 0);
    };
    GangBossModel.prototype.getBossRebornTime = function () {
        if (this.status != AcrossBossState.REBORNING)
            return 0;
        var rebornCD = GameGlobal.Config.GuildBossBaseConfig.bossrevivetime;
        return Math.max(this.changetime + rebornCD - GameServer.serverTime, 0);
    };
    GangBossModel.prototype.doUpdateInfo = function (rsp) {
        this.shieldvalue = rsp.shieldvalue;
        this.hp = rsp.hp;
        this.hpperc = rsp.hpperc;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_UPDATE_HP);
    };
    GangBossModel.prototype.doBoxAll = function (rsp) {
        this.mBox = {};
        for (var _i = 0, _a = rsp.boxinfos; _i < _a.length; _i++) {
            var data = _a[_i];
            this.mBox[data.id] = data;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_BOX);
    };
    GangBossModel.prototype.doBoxOne = function (rsp) {
        var id = rsp.boxinfo.id;
        delete this.mCollectNow[id];
        delete this.mBox[id];
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_BOX);
    };
    GangBossModel.prototype.doPlayerDead = function (rsp) {
        this.mPlayerDead = rsp.deadtime + GameGlobal.Config.GuildBossBaseConfig.revivecd;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_DEAD);
    };
    GangBossModel.prototype.doRankNow = function (rsp) {
        this.mCurRank = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_RANK_NOW);
    };
    GangBossModel.prototype.doRewards = function (rsp) {
        GameGlobal.RaidModel.OnCrossBossResult(rsp);
    };
    GangBossModel.prototype.doRankLast = function (rsp) {
        this.tRankLast = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_CHANGE);
    };
    GangBossModel.prototype.doCollentNow = function (rsp) {
        var data = rsp.info;
        if (data.time) {
            if (!this.mCollectNow[data.boxid]) {
                this.mCollectNow[data.boxid] = [];
            }
            this.mCollectNow[data.boxid].push(data);
        }
        else {
            var list = this.mCollectNow[data.boxid];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].playerid == data.playerid) {
                        list.splice(i, 1);
                        break;
                    }
                }
                if (!list.length) {
                    delete this.mCollectNow[data.boxid];
                }
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_BOX_COLLENT);
    };
    GangBossModel.prototype.doCollentAll = function (rsp) {
        this.mCollectNow = {};
        for (var _i = 0, _a = rsp.infos; _i < _a.length; _i++) {
            var data = _a[_i];
            if (!this.mCollectNow[data.boxid]) {
                this.mCollectNow[data.boxid] = [];
            }
            this.mCollectNow[data.boxid].push(data);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_BOX_COLLENT);
    };
    GangBossModel.prototype.GetDeadTime = function () {
        if (this.mPlayerDead) {
            return Math.max(this.mPlayerDead - GameServer.serverTime, 0);
        }
        return 0;
    };
    GangBossModel.prototype.ClearData = function () {
        this.mBox = {};
        this.mCollectNow = {};
        this.mPlayerDead = 0;
    };
    GangBossModel.prototype.IsGangBossAct = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_50)) {
            return false;
        }
        if (!GameGlobal.GangModel.HasGang())
            return false;
        return this.status != 0 && this.status != 4;
    };
    GangBossModel.prototype.enterMap = function () {
        this.Rpc(C2sProtocol.cs_guildboss_entermap);
    };
    GangBossModel.prototype.sendChallenge = function (challengeid) {
        var req = new Sproto.cs_guildboss_challenge_request;
        req.challengeid = challengeid;
        this.Rpc(C2sProtocol.cs_guildboss_challenge, req);
    };
    GangBossModel.prototype.sendCollectBox = function (boxid) {
        var req = new Sproto.cs_guildboss_collect_box_start_request;
        req.boxid = boxid;
        this.Rpc(C2sProtocol.cs_guildboss_collect_box_start, req);
    };
    GangBossModel.prototype.RemoveCollentBox = function () {
        this.Rpc(C2sProtocol.cs_guildboss_collect_box_cancel);
    };
    GangBossModel.prototype.sendRelive = function () {
        this.Rpc(C2sProtocol.cs_guildboss_relive);
    };
    GangBossModel.prototype.sendGetLastRank = function () {
        this.Rpc(C2sProtocol.cs_guildboss_getranks);
    };
    GangBossModel.prototype.sendGetRewards = function (success) {
        this.Rpc(C2sProtocol.cs_guildboss_get_rewards, null, function (req) {
        });
    };
    return GangBossModel;
}(BaseSystem));
__reflect(GangBossModel.prototype, "GangBossModel");
//# sourceMappingURL=GangBossModel.js.map