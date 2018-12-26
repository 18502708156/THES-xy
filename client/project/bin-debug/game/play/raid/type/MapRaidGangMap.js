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
var MapRaidGangMap = (function (_super) {
    __extends(MapRaidGangMap, _super);
    function MapRaidGangMap() {
        var _this = _super.call(this) || this;
        // private view: GangMapScieneWin
        _this.mCountMap = {};
        _this.mEntityMap = {};
        _this.mPosMap = {};
        _this.mRobotMap = {};
        _this.mMemberCount = 0;
        _this.mAuto = false;
        return _this;
    }
    MapRaidGangMap.prototype.Init = function () {
        _super.prototype.Init.call(this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGMAP_MAPENTITY_INIT, this.InitEntity, this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGMAP_UPDATE_UPDATEENTITY, this.UpdateEntityInfo, this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGMAP_AUTO_TASK, this.UpdateAutoTask, this);
        GameGlobal.MessageCenter.addListener(MessageDef.GANGMAP_RESET_MAPENTITY, this._ResetMapEntity, this);
        this.CreateRobotList();
    };
    MapRaidGangMap.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
        GameGlobal.MessageCenter.removeAll(this);
        TimerManager.ins().removeAll(this);
        GameGlobal.ViewManagerImpl.Destroy(GangMapScieneWin);
    };
    MapRaidGangMap.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        GameGlobal.ViewManagerImpl.Open(GangMapScieneWin);
    };
    MapRaidGangMap.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        GameGlobal.ViewManagerImpl.Close(GangMapScieneWin);
    };
    MapRaidGangMap.prototype.InitEntity = function () {
        this._CalculateCount(GangMapConst.TYPE_MONSTER);
        this._CalculateCount(GangMapConst.TYPE_PLANT);
        this._CreateEntityList(GangMapConst.TYPE_MONSTER);
        this._CreateEntityList(GangMapConst.TYPE_PLANT);
    };
    MapRaidGangMap.prototype.OnEntityClick = function (handle) {
        var pos = this._GetPosByHandle(handle);
        if (!pos)
            return;
        GameGlobal.RaidMgr.mMapRaid.MoveOrder(handle, Const.PosToPixel(parseInt(pos[0])), Const.PosToPixel(parseInt(pos[1])));
    };
    MapRaidGangMap.prototype.OnMoveLeval = function (orderId, handle, taget_x, taget_y) {
        var _this = this;
        var type = this.mEntityMap[orderId];
        var taskId = GangMapConst.GetGangMapTaskId(type);
        if (!taskId)
            return;
        if (type == GangMapConst.TYPE_PLANT) {
            GameGlobal.GangMapModel.StartPickPlantNotice();
            var totalTime = GameGlobal.Config.GuildConfig.collectiontime;
            TimerManager.ins().doTimer(totalTime * 1000, 1, function () {
                _this.RemoveEntity(orderId);
                _this._RemovePosRecord(orderId);
                _this.mEntityMap[orderId] = null;
                GameGlobal.GangMapModel.SendFinishTask(taskId);
            }, this);
            return;
        }
        this.RemoveEntity(orderId);
        this._RemovePosRecord(orderId);
        this.mEntityMap[orderId] = null;
        GameGlobal.GangMapModel.SendFinishTask(taskId);
    };
    MapRaidGangMap.prototype.OnMapClick = function (localX, localY) {
        GameGlobal.GangMapModel.HidePickProgressNoticy();
        TimerManager.ins().removeAll(this);
        return _super.prototype.OnMapClick.call(this, localX, localY);
    };
    MapRaidGangMap.prototype.UpdateEntityInfo = function () {
        this._UpdateMapEntity(GangMapConst.TYPE_MONSTER);
        this._UpdateMapEntity(GangMapConst.TYPE_PLANT);
        this._StartAutoTasks();
    };
    MapRaidGangMap.prototype.UpdateAutoTask = function (auto) {
        this.mAuto = auto;
        this._StartAutoTasks();
    };
    MapRaidGangMap.prototype._StartAutoTasks = function () {
        if (!this.mAuto)
            return;
        if (this._StarAutoTask(GangMapConst.TYPE_MONSTER))
            return;
        this._StarAutoTask(GangMapConst.TYPE_PLANT);
    };
    MapRaidGangMap.prototype._StarAutoTask = function (type) {
        var taskId = GangMapConst.GetGangMapTaskId(type);
        var handle;
        if (!GameGlobal.GangMapModel.IsTaskDone(taskId)) {
            handle = this._GetMapEntityHandle(type);
            if (handle) {
                this.OnEntityClick(handle);
                return true;
            }
        }
        return false;
    };
    MapRaidGangMap.prototype._UpdateMapEntity = function (type) {
        if (this._GetCurCountInMap(type) >= (this.mCountMap[type] || 0)) {
            return;
        }
        var taskId = GangMapConst.GetGangMapTaskId(type);
        if (GameGlobal.GangMapModel.IsTaskDone(taskId)) {
            this._ResetMapEntity();
            return;
        }
        this._CreateGMapEntity(type);
    };
    MapRaidGangMap.prototype._CalculateCount = function (type) {
        var taskId = GangMapConst.GetGangMapTaskId(type);
        if (GameGlobal.GangMapModel.IsTaskDone(taskId)) {
            this.mCountMap[type] = 0;
            return;
        }
        var totalCount = GameGlobal.Config.GuildConfig.count;
        if (type == GangMapConst.TYPE_MONSTER) {
            this.mCountMap[type] = Math.floor(Math.random() * (totalCount - 2)) + 1;
        }
        else {
            this.mCountMap[type] = totalCount - this.mCountMap[GangMapConst.TYPE_MONSTER];
        }
    };
    MapRaidGangMap.prototype._CreateEntityList = function (type) {
        var count = this.mCountMap[type];
        for (var idx = 0; idx < count; idx++) {
            this._CreateGMapEntity(type);
        }
    };
    MapRaidGangMap.prototype._CreateGMapEntity = function (type) {
        var monsterId = GangMapConst.GetGangMapEntityId(type);
        var pos = this._GetRandomPos();
        var entity;
        var handle;
        if (type == GangMapConst.TYPE_MONSTER) {
            entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(monsterId, Const.PosToPixel(pos.x), Const.PosToPixel(pos.y));
            entity.SetClick(false);
            handle = entity.GetHandle();
        }
        else {
            handle = GameGlobal.RaidMgr.mMapRaid.CreateImage(monsterId, Const.PosToPixel(pos.x) - 80, Const.PosToPixel(pos.y) - 160);
        }
        this.mEntityMap[handle] = type;
        var key = pos.x + "_" + pos.y;
        this.mPosMap[key] = handle;
    };
    MapRaidGangMap.prototype._GetRandomPos = function () {
        var pos = new egret.Point;
        while (true) {
            var centerX = Math.floor(GameMap.COL / 2);
            var centerY = Math.floor(GameMap.ROW / 2);
            GameMap.GetRandomPos(centerX, centerY, centerX - 2, centerY - 2, pos);
            var key = pos.x + "_" + pos.y;
            if (!this.mPosMap[key]) {
                return pos;
            }
        }
    };
    MapRaidGangMap.prototype._RemovePosRecord = function (handle) {
        for (var key in this.mPosMap) {
            if (this.mPosMap[key] == handle) {
                this.mPosMap[key] = null;
                break;
            }
        }
    };
    MapRaidGangMap.prototype._GetCurCountInMap = function (type) {
        var count = 0;
        for (var key in this.mEntityMap) {
            if (this.mEntityMap[key] == type)
                count++;
        }
        return count;
    };
    MapRaidGangMap.prototype._ResetMapEntity = function () {
        for (var key in this.mEntityMap) {
            var handle = parseInt(key);
            this.RemoveEntity(handle);
        }
        this.mEntityMap = {};
        this.mCountMap = {};
        this.mPosMap = {};
        this._CalculateCount(GangMapConst.TYPE_MONSTER);
        this._CalculateCount(GangMapConst.TYPE_PLANT);
        this._CreateEntityList(GangMapConst.TYPE_MONSTER);
        this._CreateEntityList(GangMapConst.TYPE_PLANT);
    };
    MapRaidGangMap.prototype._GetMapEntityHandle = function (type) {
        for (var key in this.mEntityMap) {
            if (this.mEntityMap[key] == type) {
                return parseInt(key);
            }
        }
    };
    MapRaidGangMap.prototype._GetPosByHandle = function (handle) {
        for (var key in this.mPosMap) {
            if (this.mPosMap[key] == handle) {
                return key.split("_");
            }
        }
    };
    MapRaidGangMap.prototype.CreateRole = function (player) {
        // 移动Id相同的机器人
        this.RemoveRobot(player.id);
        this.mMemberCount++;
        _super.prototype.CreateRole.call(this, player);
    };
    MapRaidGangMap.prototype.CreateRobotRole = function (player) {
        var list = [];
        var entityRole = new EntityRole;
        entityRole.parserBase({
            ownerid: player.id,
            handler: player.id,
            type: EntityType.Role,
            shows: {
                job: player.job,
                sex: player.sex,
                shows: player.shows
            },
        });
        entityRole.entityName = player.name;
        list.push(entityRole);
        this.AddRobotTeam(player.id, list);
    };
    MapRaidGangMap.prototype.AddRobotTeam = function (handle, entityDatas) {
        for (var i = 1; i < entityDatas.length; i++) {
            entityDatas[i].x = entityDatas[i - 1].x - 50;
            entityDatas[i].y = entityDatas[i - 1].y;
        }
        var list = [];
        for (var _i = 0, entityDatas_1 = entityDatas; _i < entityDatas_1.length; _i++) {
            var entityData = entityDatas_1[_i];
            var entity = this.Create(entityData);
            if (entity) {
                list.push(entity);
            }
        }
        if (!list.length) {
            return;
        }
        var team = this.CreateRobotTeam();
        team.mMasterHandle = handle;
        team.Init(list);
        this.cTeam[handle] = team;
        // this.mTeam.push(team)
    };
    MapRaidGangMap.prototype.CreateRobotTeam = function () {
        return new NormalMoveTeam;
    };
    MapRaidGangMap.prototype.RemoveEntity = function (handle) {
        if (!this.mEntityMap[handle] && !this.mRobotMap[handle])
            this.mMemberCount--;
        return _super.prototype.RemoveEntity.call(this, handle);
    };
    MapRaidGangMap.prototype.RemoveRobot = function (playerId) {
        if (this.mRobotMap[playerId])
            this.RemoveEntity(playerId);
        this.mRobotMap[playerId] = null;
    };
    MapRaidGangMap.prototype.CreateRobotList = function () {
        var robotList = GameGlobal.GangMapModel.mRobotList;
        var curMemCount = this.mMemberCount;
        for (var idx = curMemCount; idx < 10; idx++) {
            var robotInfo = robotList[idx];
            if (!robotInfo)
                break;
            if (!this.mRobotMap[robotInfo.id]) {
                this.mRobotMap[robotInfo.id] = robotInfo.id;
                this.CreateRobotRole(robotInfo);
            }
        }
    };
    return MapRaidGangMap;
}(CommonMapRaid));
__reflect(MapRaidGangMap.prototype, "MapRaidGangMap");
//# sourceMappingURL=MapRaidGangMap.js.map