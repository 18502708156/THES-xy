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
var MapRaidGangBattle = (function (_super) {
    __extends(MapRaidGangBattle, _super);
    function MapRaidGangBattle(type) {
        var _this = _super.call(this) || this;
        _this.mIsShowGuild = true;
        _this.mBossMap = {};
        _this.mType = type;
        return _this;
    }
    MapRaidGangBattle.prototype.Init = function () {
        _super.prototype.Init.call(this);
        this.CreateBoss();
        this.CreateDragonGuard();
        GameGlobal.MessageCenter.addListener(MessageDef.GANGBATTLE_UPDATE_KINGINFO, this.SetKingBossHide, this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.RemoveDragon, this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGBATTLE_SHOW_GUARDTIP, this.CreateDragonGuard, this);
        GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_TEAM_MAIN_INFO, this.DelayUpdateTeam, this);
        GameGlobal.GangBattleTeamModel.SendGetMyTeamInfos();
    };
    // public TeamInfo() {
    // 	let data: {[key: number]: number[]} = GameGlobal.GangBattleTeamModel.GetAllTeam()
    // 	for (let key in data) {
    // 		let teamId = Number(key)
    // 		let memIds = data[key]
    // 		for (let actorId of memIds) {
    // 			this.UpdateEntityTeam(actorId, teamId)
    // 		}
    // 		this.UpdateTeamEntityList(teamId, memIds)	
    // 	}
    // }
    MapRaidGangBattle.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        if (!this.view) {
            switch (this.mType) {
                case MapRaidGangBattle.GANG_BATTLE_TYPE_OUTSIDER:
                    this.view = GBattleOutsiderScieneWin;
                    break;
                case MapRaidGangBattle.GANG_BATTLE_TYPE_DRAGON:
                    this.view = GBattleDragonScieneWin;
                    break;
                case MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE:
                    this.view = GBattleTempleScieneWin;
                    break;
            }
        }
        GameGlobal.ViewManagerImpl.Open(this.view);
        var panel = this.GetGameMapPanel();
        if (panel) {
            panel.showReturnBtn(false);
        }
        this.UpdateReborn();
    };
    MapRaidGangBattle.prototype.OnMapClick = function (localX, localY) {
        GameGlobal.MessageCenter.dispatch(MessageDef.MOVE_UPDATE_INFO, localX, localY);
        return _super.prototype.OnMapClick.call(this, localX, localY);
    };
    MapRaidGangBattle.prototype.CreateBoss = function () {
        if (this.mType == MapRaidGangBattle.GANG_BATTLE_TYPE_OUTSIDER) {
            var bossList = GangBattleConst.GetKingList();
            var idx = 1;
            for (var _i = 0, bossList_1 = bossList; _i < bossList_1.length; _i++) {
                var bossConf = bossList_1[_i];
                var entity_1 = GameGlobal.RaidMgr.mMapRaid.CreateMonster(bossConf.bossid, (bossConf.pos[0]), (bossConf.pos[1]));
                entity_1.SetClick();
                var handle_1 = entity_1.GetHandle();
                this.mBossMap[handle_1] = bossConf.id;
            }
            return;
        }
        if (this.mType == MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE) {
            return;
        }
        if (GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON)) {
            return;
        }
        var pos = GameGlobal.Config.GuildBattleBaseConfig.sboss_bronpos;
        var monsterId = GameGlobal.Config.GuildBattleBaseConfig.sbossid;
        var entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(monsterId, (pos[0]), (pos[1]));
        entity.SetClick();
        var handle = entity.GetHandle();
        this.mBossMap[handle] = this.mType;
    };
    MapRaidGangBattle.prototype.Create = function (entityData) {
        var entity = _super.prototype.Create.call(this, entityData);
        if (entity) {
            entity.SetClick();
        }
        return entity;
    };
    MapRaidGangBattle.prototype.OnEntityClick = function (handle) {
        var bossId = this.mBossMap[handle];
        if (bossId) {
            if (bossId == MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE) {
                ViewManager.ins().open(GBattleDragonGuardWin);
                return;
            }
            if (!GameGlobal.GangBattleModel.IsKingAlive(bossId)) {
                UserTips.ins().showTips("BOSS未复活");
                return;
            }
            if (bossId == MapRaidGangBattle.GANG_BATTLE_TYPE_DRAGON
                && GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON)) {
                UserTips.ins().showTips("BOSS已经死亡");
                return;
            }
            GameGlobal.GangBattleModel.SendAttackBoss(bossId);
            return;
        }
        var entity = this.mEntityList[handle];
        if (entity.GetInfo().guildID == GameGlobal.actorModel.guildID) {
            UserTips.ins().showTips("不可攻击同帮会玩家");
            return;
        }
        GameGlobal.GangBattleModel.SendAttackPlayer(handle);
    };
    MapRaidGangBattle.prototype.OnMoveLeval = function (orderId, handle, taget_x, taget_y) {
        var bossId = orderId;
        if (GameGlobal.GangBattleModel.IsKingAlive(bossId)) {
            GameGlobal.GangBattleModel.SendAttackBoss(bossId);
        }
    };
    MapRaidGangBattle.prototype.SetKingBossHide = function () {
        var _this = this;
        var _loop_1 = function (key) {
            var handle = parseInt(key);
            var bossId = this_1.mBossMap[handle];
            if (!GameGlobal.GangBattleModel.IsKingAlive(bossId)) {
                this_1.RemoveEntity(handle);
                this_1.mBossMap[handle] = null;
                var rebornTime = GameGlobal.GangBattleModel.GetKingRebornDiffTime(bossId);
                TimerManager.ins().doTimer(rebornTime * 1000, 1, function () {
                    var bossConf = GangBattleConst.GetKingConfig(bossId);
                    var entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(bossConf.bossid, (bossConf.pos[0]), (bossConf.pos[1]));
                    entity.SetClick();
                    var handle = entity.GetHandle();
                    _this.mBossMap[handle] = bossConf.id;
                }, this_1);
            }
        };
        var this_1 = this;
        for (var key in this.mBossMap) {
            _loop_1(key);
        }
    };
    MapRaidGangBattle.prototype.RemoveDragon = function () {
        for (var key in this.mBossMap) {
            if (MapRaidGangBattle.GANG_BATTLE_TYPE_DRAGON == this.mBossMap[key]
                && GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON)) {
                var handle = parseInt(key);
                this.RemoveEntity(handle);
                this.mBossMap[handle] = null;
                break;
            }
        }
    };
    MapRaidGangBattle.prototype.CreateDragonGuard = function () {
        var _this = this;
        if (this.mType != MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE) {
            return;
        }
        var showEndTime = GameGlobal.GangBattleModel.mGuardShowTime;
        if (!showEndTime) {
            return;
        }
        var durationTime = Math.max(showEndTime - GameServer.serverTime, 0);
        TimerManager.ins().doTimer(durationTime * 1000, 1, function () {
            var pos = GameGlobal.Config.GuildBattleBaseConfig.lboss_bronpos;
            var monsterId = GameGlobal.Config.GuildBattleBaseConfig.lbossid;
            var entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(monsterId, (pos[0]), (pos[1]));
            entity.SetClick();
            var handle = entity.GetHandle();
            _this.mBossMap[handle] = _this.mType;
        }, this);
    };
    MapRaidGangBattle.prototype.UpdateReborn = function () {
        var time = GameGlobal.GangBattleModel.GetRebornTime();
        if (time > 0) {
            this.ShowRebornView(time);
        }
        else {
            this.RemoveRebornView();
        }
    };
    /** 复活消耗 */
    MapRaidGangBattle.prototype.GetRebornYb = function () {
        return GameGlobal.Config.GuildBattleBaseConfig.revivecost;
    };
    /** 复活方法 */
    MapRaidGangBattle.prototype.SendRelive = function () {
        GameGlobal.GangBattleModel.SendClearRebornCD();
    };
    MapRaidGangBattle.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        GameGlobal.ViewManagerImpl.Close(this.view);
    };
    MapRaidGangBattle.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
        GameGlobal.MessageCenter.removeAll(this);
        TimerManager.ins().removeAll(this);
        GameGlobal.ViewManagerImpl.Destroy(this.view);
        this.view = null;
    };
    MapRaidGangBattle.prototype.GetTeamModel = function () {
        return GameGlobal.GangBattleTeamModel;
    };
    MapRaidGangBattle.GANG_BATTLE_TYPE_OUTSIDER = 100004;
    MapRaidGangBattle.GANG_BATTLE_TYPE_DRAGON = 100005;
    MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE = 100006;
    return MapRaidGangBattle;
}(CommonMapRaid));
__reflect(MapRaidGangBattle.prototype, "MapRaidGangBattle");
//# sourceMappingURL=MapRaidGangBattle.js.map