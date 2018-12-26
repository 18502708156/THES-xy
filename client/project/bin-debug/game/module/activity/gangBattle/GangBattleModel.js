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
var GangBattleModel = (function (_super) {
    __extends(GangBattleModel, _super);
    function GangBattleModel() {
        var _this = _super.call(this) || this;
        _this.mKingInfoMap = {};
        _this.mMyGBattleInfo = new MyGangBattleInfo;
        _this.mGBPlayerGlobalInfo = new GBattlePlayerGlobalInfo;
        _this.mGBGangGlobalInfo = new GBattleGangGlobalInfo;
        _this.mBossInfo = new GangBattleBossInfo;
        _this.mGuardsInfo = new GuardsInfo;
        _this.mGRanksInfo = new GangRanksInfo;
        _this.mGBPlayerRanksInfo = new GBattlePlayerRanksInfo;
        _this.regNetMsg(S2cProtocol.sc_guildwar_player_info, _this._DoPlayerInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_guild_info, _this._DoGangInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_boss_info, _this._DoBossInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_barrier_info, _this._DoGateInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_four_king_info, _this._DoKingInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_guard_info, _this._DoGuardInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_guild_rank, _this._DoGuildRankInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_player_global_info, _this._DoPlayerGlobalInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_player_rank, _this._DoPlayerRank);
        _this.regNetMsg(S2cProtocol.sc_guildwar_all_guild_rank_info, _this._DoAllGangRankInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_all_player_rank_info, _this._DoAllPlayerRank);
        _this.regNetMsg(S2cProtocol.sc_guildwar_myguild_global_info, _this._DoMyGangGlobalInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_enter_war_guild, _this._DoBeforeEnterInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_enter_dragon_guild, _this._DoEnterDragonInfo);
        _this.regNetMsg(S2cProtocol.sc_guildwar_ultimate_attack, _this._DoDragonGuardShowTime);
        _this.regNetMsg(S2cProtocol.sc_guildwar_report, _this.getEndAwardPanelData);
        return _this;
    }
    GangBattleModel.prototype.Init = function () {
    };
    GangBattleModel.prototype._DoPlayerInfo = function (rsp) {
        this.mMyGBattleInfo.UpdateInfo(rsp);
        this.EnterMapScence();
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_MYINFO);
    };
    GangBattleModel.prototype._DoGangInfo = function (rsp) {
        this.mMyGBattleInfo.UpdateGangInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_MYINFO);
    };
    GangBattleModel.prototype._DoBossInfo = function (rsp) {
        this.mBossInfo.UpdateInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_BOSSINFO);
    };
    GangBattleModel.prototype._DoGateInfo = function (rsp) {
        this.mMyGBattleInfo.UpdateGateInfo(rsp);
    };
    GangBattleModel.prototype._DoKingInfo = function (rsp) {
        for (var _i = 0, _a = rsp.bossinfos; _i < _a.length; _i++) {
            var kingInfo = _a[_i];
            var gbKingInfo = this.mKingInfoMap[kingInfo.bossid];
            if (!gbKingInfo) {
                gbKingInfo = new GangBattleKingInfo;
                this.mKingInfoMap[kingInfo.bossid] = gbKingInfo;
            }
            gbKingInfo.UpdateInfo(kingInfo);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_KINGINFO);
    };
    GangBattleModel.prototype._DoGuardInfo = function (rsp) {
        this.mGuardsInfo.UpdataInfo(rsp);
    };
    GangBattleModel.prototype._DoGuildRankInfo = function (rsp) {
        this.mGRanksInfo.UpdateInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_GANGRANK);
    };
    GangBattleModel.prototype._DoPlayerGlobalInfo = function (rsp) {
        this.mGBPlayerGlobalInfo.UpdateInfo(rsp);
        GangBattleConst.level = rsp.worldlevel;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_MYINFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_DURATION);
    };
    GangBattleModel.prototype._DoPlayerRank = function (rsp) {
        this.mGBPlayerRanksInfo.UpdateInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_PLAYERRANK);
    };
    GangBattleModel.prototype._DoAllGangRankInfo = function (rsp) {
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_ALLGANGRANK, rsp.rankinfos);
    };
    GangBattleModel.prototype._DoAllPlayerRank = function (rsp) {
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_ALLPLAYERRANK, rsp);
    };
    GangBattleModel.prototype._DoMyGangGlobalInfo = function (rsp) {
        this.mGBGangGlobalInfo.UnpdateInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_MYINFO);
    };
    GangBattleModel.prototype._DoBeforeEnterInfo = function (rsp) {
        this.mChampionInfo = rsp.championGuild;
        this.mJoinInfos = rsp.guildinfos;
    };
    GangBattleModel.prototype._DoEnterDragonInfo = function (rsp) {
        this.mEnterDragonInfo = rsp;
    };
    GangBattleModel.prototype._DoDragonGuardShowTime = function (rsp) {
        this.mGuardShowTime = rsp.countdown;
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_SHOW_GUARDTIP);
    };
    GangBattleModel.prototype.SendEnterBattle = function () {
        var _this = this;
        var req = new Sproto.cs_guildwar_enter_request;
        this.Rpc(C2sProtocol.cs_guildwar_enter, req, function (rsp) {
            if (rsp.ret) {
                _this.mActiveOpenFlag = true;
                GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_OPEN_GATEVIEW);
                if (_this.mMyGBattleInfo.mGateId == GangBattleModel.ACTIVE_TYPE_GATE) {
                    ViewManager.ins().open(GBattleMainWin);
                }
            }
            else {
                _this.mActiveOpenFlag = false;
                GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_OPEN_GATEVIEW);
                ViewManager.ins().open(GBattleMainWin);
            }
        }, this);
    };
    GangBattleModel.prototype.SendAttackBoss = function (bossId) {
        var req = new Sproto.cs_guildwar_attack_boss_request;
        req.bossid = bossId;
        this.Rpc(C2sProtocol.cs_guildwar_attack_boss, req);
    };
    GangBattleModel.prototype.SendEnterNext = function () {
        var req = new Sproto.cs_guildwar_next_barrier_request;
        this.Rpc(C2sProtocol.cs_guildwar_next_barrier, req, function (rsp) {
            if (!rsp.ret)
                return;
            GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_OPEN_GATEVIEW);
            GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_ENTER_NEXT_GATE);
        }, this);
    };
    GangBattleModel.prototype.SendReturnPrev = function () {
        var req = new Sproto.cs_guildwar_last_barrier_request;
        this.Rpc(C2sProtocol.cs_guildwar_last_barrier, req, function (rsp) {
            if (rsp.ret) {
            }
        }, this);
    };
    GangBattleModel.prototype.SendAttackPlayer = function (id) {
        var req = new Sproto.cs_guildwar_attack_player_request;
        req.targetid = id;
        this.Rpc(C2sProtocol.cs_guildwar_attack_player, req, function (rsp) {
            if (rsp.ret == 1) {
                UserTips.ins().showTips("同帮玩家不可相互攻击");
                return;
            }
            else if (rsp.ret == 2) {
                UserTips.ins().showTips("不可攻击复活中的玩家");
                return;
            }
            else if (rsp.ret == 3) {
                UserTips.ins().showTips("目标不是队长");
                return;
            }
        }, this);
    };
    GangBattleModel.prototype.SendClearRebornCD = function () {
        var req = new Sproto.cs_guildwar_clear_reborncd_request;
        this.Rpc(C2sProtocol.cs_guildwar_clear_reborncd, req, function (rsp) {
            if (rsp.ret) {
            }
        }, this);
    };
    GangBattleModel.prototype.SendAllGangRank = function () {
        var req = new Sproto.cs_guildwar_all_guild_rank_info_request;
        this.Rpc(C2sProtocol.cs_guildwar_all_guild_rank_info, req);
    };
    GangBattleModel.prototype.SendAllPlayerRank = function () {
        var req = new Sproto.cs_guildwar_all_player_rank_info_request;
        this.Rpc(C2sProtocol.cs_guildwar_all_player_rank_info, req);
    };
    GangBattleModel.prototype.SendExitGBattle = function () {
        var req = new Sproto.cs_guildwar_exit_barrier_request;
        this.Rpc(C2sProtocol.cs_guildwar_exit_barrier, req);
    };
    GangBattleModel.prototype.SendGainScoreAward = function (id) {
        var req = new Sproto.cs_guildwar_get_score_reward_request;
        req.rewardid = id;
        this.Rpc(C2sProtocol.cs_guildwar_get_score_reward, req);
    };
    Object.defineProperty(GangBattleModel.prototype, "bossInfo", {
        get: function () {
            return this.mBossInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangBattleModel.prototype, "myGBattleInfo", {
        get: function () {
            return this.mMyGBattleInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangBattleModel.prototype, "guardsInfo", {
        get: function () {
            return this.mGuardsInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangBattleModel.prototype, "gRanksInfo", {
        get: function () {
            return this.mGRanksInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangBattleModel.prototype, "gbPlayerGlobalInfo", {
        get: function () {
            return this.mGBPlayerGlobalInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangBattleModel.prototype, "gbGangGlobalInfo", {
        get: function () {
            return this.mGBGangGlobalInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GangBattleModel.prototype, "gbPlayerRanksInfo", {
        get: function () {
            return this.mGBPlayerRanksInfo;
        },
        enumerable: true,
        configurable: true
    });
    GangBattleModel.prototype.IsActive = function () {
        return this.mActiveOpenFlag;
    };
    GangBattleModel.prototype.IsBroken = function (gateType) {
        if (gateType == GangBattleModel.ACTIVE_TYPE_DRAGON) {
            return this.mEnterDragonInfo && this.mEnterDragonInfo.guildinfos != null;
        }
        return this.mMyGBattleInfo.mGateId == gateType && this.mMyGBattleInfo.mBrokenFlag;
    };
    GangBattleModel.prototype.CanAttack = function () {
        return GameServer.serverTime >= this.mMyGBattleInfo.mAttackTime;
    };
    GangBattleModel.prototype.IsKingAlive = function (bossId) {
        var gbKingInfo = this.mKingInfoMap[bossId];
        if (!gbKingInfo)
            return true;
        return gbKingInfo.mRebornTime <= GameServer.serverTime;
    };
    GangBattleModel.prototype.GetKingRebornDiffTime = function (bossId) {
        var gbKingInfo = this.mKingInfoMap[bossId];
        if (!gbKingInfo)
            return 0;
        return Math.max(gbKingInfo.mRebornTime - GameServer.serverTime, 0);
    };
    GangBattleModel.prototype.GetKingRebornTime = function (bossId) {
        var gbKingInfo = this.mKingInfoMap[bossId];
        if (!gbKingInfo)
            return 0;
        return gbKingInfo.mRebornTime;
    };
    GangBattleModel.prototype.GetRebornTime = function () {
        return this.mGBPlayerGlobalInfo.mRebornTime - GameServer.serverTime;
    };
    GangBattleModel.prototype.GetNextScoreConfig = function () {
        if (!this.mGBPlayerGlobalInfo.mScoreReward) {
            return;
        }
        var scoreList = GangBattleConst.GetScoreList();
        for (var _i = 0, scoreList_1 = scoreList; _i < scoreList_1.length; _i++) {
            var config = scoreList_1[_i];
            if ((this.mGBPlayerGlobalInfo.mScoreReward & Math.pow(2, config.id - 1)) > 0) {
                return config;
            }
        }
    };
    GangBattleModel.prototype.HasScoreRewardGain = function (rewardId) {
        if (!this.mGBPlayerGlobalInfo.mScoreReward) {
            return false;
        }
        return (this.mGBPlayerGlobalInfo.mScoreReward & Math.pow(2, rewardId - 1)) == 0;
    };
    GangBattleModel.prototype.CanScoreRewardGain = function (rewardId) {
        var config = GangBattleConst.GetScoreConfig(rewardId);
        if (!config) {
            return false;
        }
        var curScore = this.mGBPlayerGlobalInfo.mScore;
        return curScore >= config.needpoints;
    };
    GangBattleModel.prototype.NeedJumpToOutsider = function () {
        return this.mMyGBattleInfo.mGateId != GangBattleModel.ACTIVE_TYPE_GATE;
    };
    GangBattleModel.prototype.GetActiveEndTime = function () {
        return this.mGBPlayerGlobalInfo.mEndTime || 0;
    };
    GangBattleModel.prototype.IsInOutsideScience = function () {
        return this.mMyGBattleInfo.mGateId == GangBattleModel.ACTIVE_TYPE_OUTSIDER;
    };
    GangBattleModel.prototype.EnterMapScence = function () {
        if (BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR || BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR_PK)
            return;
        if (this.mMyGBattleInfo.mGateId == GangBattleModel.ACTIVE_TYPE_GATE)
            return;
        var mapId;
        switch (this.mMyGBattleInfo.mGateId) {
            case GangBattleModel.ACTIVE_TYPE_OUTSIDER:
                mapId = GameGlobal.Config.GuildBattleBaseConfig.t_mapid;
                break;
            case GangBattleModel.ACTIVE_TYPE_DRAGON:
                mapId = GameGlobal.Config.GuildBattleBaseConfig.s_mapid;
                break;
            case GangBattleModel.ACTIVE_TYPE_TEMPLE:
                mapId = GameGlobal.Config.GuildBattleBaseConfig.l_mapid;
                break;
        }
        if (!GameGlobal.CommonRaidModel.IsInCurMap(mapId))
            GameGlobal.CommonRaidModel._MapGo(mapId);
    };
    GangBattleModel.prototype.getEndAwardPanelData = function (rep) {
        if (rep) {
            var data = new activityEndAwardData();
            data.award = rep.rewards;
            data.auction = rep.auctionrewards;
            data.paneltitle = "帮会战";
            data.rankTxt = "\u6211\u7684\u5E2E\u4F1A\u6392\u540D\uFF1A\u7B2C" + rep.guilddetail.rank + "\u540D";
            var icon1Date = { titleName: "", name: "", iconSrc: "", iconBgSrc: "", banghuiTxt: "" };
            icon1Date.titleName = "本次帮会胜方";
            icon1Date.name = rep.sharedata.victory + "(s" + rep.sharedata.serverid + "\u670D)";
            icon1Date.iconSrc = "ui_bh_bm_qizi";
            icon1Date.banghuiTxt = icon1Date.name.charAt(0);
            data.icon1 = icon1Date;
            ViewManager.ins().open(ActivityEndAwardPanel, data);
        }
    };
    GangBattleModel.ACTIVE_TYPE_GATE = 0;
    GangBattleModel.ACTIVE_TYPE_OUTSIDER = 1;
    GangBattleModel.ACTIVE_TYPE_DRAGON = 2;
    GangBattleModel.ACTIVE_TYPE_TEMPLE = 3;
    return GangBattleModel;
}(BaseSystem));
__reflect(GangBattleModel.prototype, "GangBattleModel");
//# sourceMappingURL=GangBattleModel.js.map