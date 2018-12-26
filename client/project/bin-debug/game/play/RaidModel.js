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
var RaidModel = (function (_super) {
    __extends(RaidModel, _super);
    function RaidModel() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_battle_action, _this._DoBattleAction);
        _this.regNetMsg(S2cProtocol.sc_battle_entitys, _this._DoBattleRaid);
        _this.regNetMsg(S2cProtocol.sc_raid_chapter_boss_result, _this._DoBossResult);
        _this.regNetMsg(S2cProtocol.sc_raid_sweep_reward, _this.onlyResult);
        _this.regNetMsg(S2cProtocol.sc_raid_chapter_mondata, _this._DoChapterMonData);
        _this.regNetMsg(S2cProtocol.sc_arena_pk_result, _this._DoArenaPkResult);
        _this.regNetMsg(S2cProtocol.sc_battle_record, _this._DoBattleRecord);
        _this.regNetMsg(S2cProtocol.sc_battle_manual, _this._DoBattleManual);
        _this.regNetMsg(S2cProtocol.sc_battle_set_auto, _this._DoBattleSetAuto);
        return _this;
    }
    RaidModel.prototype.GetBattleRaid = function () {
        return GameGlobal.RaidMgr.mBattleRaid;
    };
    RaidModel.prototype._DoChapterMonData = function (rsp) {
        var dict = {};
        for (var _i = 0, _a = rsp.mondata; _i < _a.length; _i++) {
            var data = _a[_i];
            dict[data.id] = data;
        }
        this.mChapterData = {
            fbcfg: rsp.fbcfg,
            mondata: dict
        };
    };
    RaidModel.prototype._DoBossResult = function (rsp) {
        var raid = this.GetBattleRaid();
        if (raid) {
            // 跨服boss击杀奖励的状态
            var notSet = (GameMap.fbType == UserFb.KF_BOSS || GameMap.fbType == UserFb.FB_TYPE_GANG_BOSS) && raid.mFinishAction != null;
            if (!notSet) {
                var finishAction = new BattleDefaultFinishData;
                finishAction.ret = rsp.result;
                finishAction.isWin = rsp.result == 1;
                RaidModel.IS_FIGHT_WIN = rsp.result == 1;
                finishAction.rewards = RewardData.ToRewardDatas(rsp.rewards);
                finishAction.star = rsp.star;
                raid.SetFinishAction(finishAction);
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GUANQIA_CHANGE);
    };
    RaidModel.prototype.OnCrossBossResult = function (rsp) {
        var raid = this.GetBattleRaid();
        if (raid && (GameMap.fbType == UserFb.KF_BOSS || GameMap.fbType == UserFb.FB_TYPE_GANG_BOSS)) {
            var finishAction = new CrossBossFinishData;
            finishAction.rewards = rsp.rewards;
            raid.SetFinishAction(finishAction);
        }
        else {
            // ViewManager.ins().open(ResultAcrossBossPanel, rsp.rewards) //后端改为发邮件，前端暂时不弹奖励，等待新排版的UI
        }
    };
    RaidModel.prototype.onlyResult = function (rsp) {
        ViewManager.ins().open(rsp.result ? ResultWinPanel : ResultFailPanel, rsp.rewards, function () {
        });
    };
    /**竞技场结果 */
    RaidModel.prototype._DoArenaPkResult = function (rsp) {
        //是否秒杀
        if (rsp.iskill) {
            rsp.rewards = RewardData.ToRewardDatas(rsp.rewards);
            ViewManager.ins().open(ArenaPKResultPanel, rsp.result ? true : false, rsp.rewards, rsp.maxrank, rsp.rank, rsp.lastrank, function () {
                GameGlobal.Arena.sendGetRewards();
                GameGlobal.Arena.sendArenaData();
            });
            return;
        }
        var raid = this.GetBattleRaid();
        if (raid) {
            var finishAction = new ArenaPKFinishData;
            finishAction.isWin = rsp.result == 1;
            finishAction.rewards = RewardData.ToRewardDatas(rsp.rewards);
            finishAction.maxrank = rsp.lastmaxrank;
            finishAction.lastrank = rsp.lastrank;
            finishAction.rank = rsp.rank;
            raid.SetFinishAction(finishAction);
        }
    };
    RaidModel.prototype._DoBattleAction = function (rsp) {
        var data = BattleTurnDataParse.Parse(rsp);
        var raid = this.GetBattleRaid();
        if (raid) {
            if (raid.mIsManual) {
                raid.Turn(data[0]);
            }
            else {
                raid.TurnAll(data);
            }
        }
    };
    RaidModel.prototype._DoBattleRecord = function (rsp) {
        var raidType = rsp.raidType;
        var manual = rsp.manual;
        var entityDatas = rsp.entitydatas;
        if (!entityDatas) {
            console.error("_DoBattleRecord entitydatas == null");
            return;
        }
        var list1 = [];
        var list2 = [];
        for (var _i = 0, entityDatas_1 = entityDatas; _i < entityDatas_1.length; _i++) {
            var data = entityDatas_1[_i];
            var entityData = this._GetEntityData(data);
            if (data.side == EntityBattleSide.Def) {
                list1.push(entityData);
            }
            else {
                list2.push(entityData);
            }
        }
        var raid = this.EnterBattle(raidType, rsp.fbid, [list1, list2]);
        if (raid) {
            raid.mIsVideo = true;
            raid.TurnAll(BattleTurnDataParse.Parse(rsp));
            raid.SetFinishAction(new BattleVideoFinishData(function () {
                ViewManager.ins().open(ArenaWin, 1);
            }));
        }
        ViewManager.ins().close(XiandaoVideoPanel);
        ViewManager.ins().close(ArenaWin);
    };
    RaidModel.prototype._DoBattleRaid = function (rsp) {
        var raidType = rsp.raidType;
        var manual = rsp.manual;
        var entityDatas = rsp.entitydatas;
        var list1 = [];
        var list2 = [];
        for (var _i = 0, entityDatas_2 = entityDatas; _i < entityDatas_2.length; _i++) {
            var data = entityDatas_2[_i];
            var entityData = this._GetEntityData(data);
            if (data.side == EntityBattleSide.Def) {
                list1.push(entityData);
            }
            else {
                list2.push(entityData);
            }
        }
        var raid = this.EnterBattle(raidType, rsp.fbid, [list1, list2]);
        if (manual) {
            if (raid) {
                raid.SetManual(true);
            }
        }
    };
    /**
     * 进入战斗
     */
    RaidModel.prototype.EnterBattle = function (raidType, fbid, entitys) {
        var rsp = new BattleMapData;
        if (raidType == UserFb.FB_TYPE_GUANQIABOSS) {
            var cfg = GameGlobal.RaidModel.mChapterData.fbcfg;
            rsp.mFbId = cfg.fbid;
            rsp.mMapId = cfg.scenes[0];
            rsp.mFbType = UserFb.FB_TYPE_GUANQIABOSS;
            rsp.mFbName = cfg.name;
            rsp.mFbDesc = cfg.desc;
        }
        else {
            var cfg = GameGlobal.Config.InstanceConfig[fbid];
            rsp.mFbId = fbid;
            rsp.mMapId = cfg[GameGlobal.Config.InstanceConfig_keys.scenes][0];
            rsp.mFbType = raidType;
            rsp.mFbName = cfg[GameGlobal.Config.InstanceConfig_keys.name];
            rsp.mFbDesc = cfg[GameGlobal.Config.InstanceConfig_keys.desc];
        }
        rsp.entitys = entitys;
        return GameGlobal.RaidMgr.EnterBattleRaid(rsp);
    };
    RaidModel.prototype._GetEntityData = function (rsp) {
        var entityData;
        if (rsp.type == EntityType.Role) {
            entityData = new EntityRole;
        }
        else if (rsp.type == EntityType.Monster) {
            entityData = new EntityData;
        }
        else if (rsp.type == EntityType.Xianlv) {
            entityData = new EntityXianlv;
        }
        else if (rsp.type == EntityType.Pet) {
            entityData = new EntityPet;
        }
        else if (rsp.type == EntityType.Tiannv) {
            entityData = new EntityTiannv;
        }
        else if (rsp.type == EntityType.Shenjiang) {
            entityData = new EntityTianshen;
        }
        else if (rsp.type == EntityType.Lingtong) {
            entityData = new EntityLingtong;
        }
        else {
            console.error("not entity type => " + rsp.type);
        }
        if (entityData) {
            entityData.parserBase(rsp);
            entityData.posIndex = rsp.pos;
            entityData.side = rsp.side;
        }
        return entityData;
    };
    RaidModel.prototype.SendGetBossReward = function () {
        this.Rpc(C2sProtocol.cs_raid_get_boss_reward, new Sproto.cs_raid_get_boss_reward_request());
    };
    /** 手动战斗 */
    RaidModel.prototype._DoBattleManual = function (rsp) {
        GameGlobal.RaidMgr.mBattleRaid.StartManual(rsp.time, rsp.useskills);
    };
    RaidModel.prototype._DoBattleSetAuto = function (rsp) {
        GameGlobal.RaidMgr.mBattleRaid.SetAuto(rsp.isauto == 1);
    };
    /**最近一次战斗 胜利或者失败 */
    RaidModel.IS_FIGHT_WIN = true;
    return RaidModel;
}(BaseSystem));
__reflect(RaidModel.prototype, "RaidModel");
//# sourceMappingURL=RaidModel.js.map