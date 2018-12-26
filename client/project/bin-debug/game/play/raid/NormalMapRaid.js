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
var NormalMapRaid = (function (_super) {
    __extends(NormalMapRaid, _super);
    function NormalMapRaid() {
        var _this = _super.call(this) || this;
        // 挂机场景退出的时间
        _this.m_ExitTime = 0;
        // 进入战斗的检查时间
        _this.m_CheckTime = 1;
        _this.mCreateFlag = 0;
        _this.mCreateOther = 1500;
        _this.mCreateCount = 4;
        //师门怪物
        _this.mMonsterMap = {};
        _this.mMonsterPosMap = {};
        _this.mRefMonDatas = [];
        _this.m_ShowRidePids = [];
        _this.m_ShowWingPids = [];
        _this.m_ShowTianxPids = [];
        _this.m_ShowSwordPids = [];
        _this.m_ShowPids = [];
        return _this;
    }
    NormalMapRaid.prototype.Init = function () {
        _super.prototype.Init.call(this);
        GameGlobal.MessageCenter.addListener(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.UpdateMonsterInfo, this);
        this.UpdateMonsterInfo();
        this.mCreateFlag = 0;
        this.mCreateCount = GameGlobal.UserFb.guanqiaID <= 50 ? 6 : 4;
        try {
            var config = GameGlobal.UserFb.config.waveMonsterId;
            for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
                var data = config_1[_i];
                var str = ResDataPath.GetMoviePath(AppearanceConfig.GetAppe(data.avatar));
                EntityMovieObject.Ref(str);
                this.mRefMonDatas.push(str);
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    NormalMapRaid.prototype.AddToMap = function (entity) {
        this.GetMapEntityView().AddEntity(entity);
    };
    NormalMapRaid.prototype.GetSceneId = function () {
        return GameGlobal.UserFb.config.sid;
    };
    // 下一次进入战斗的时间
    NormalMapRaid.prototype.GetNextTime = function () {
        var interval = 15;
        var config = GameGlobal.Config.ScenesConfig[this.GetSceneId()];
        if (config && config.interval) {
            interval = config.interval || 15;
        }
        // if ((GameGlobal.UserFb.guanqiaID || 0) <= 30) {
        // 	return NormalMapRaid.REFRESH_TIME
        // }
        return Math.max((this.m_ExitTime + interval) - GameServer.serverTime, 5) * 1000;
    };
    NormalMapRaid.prototype.Update = function (delta) {
        _super.prototype.Update.call(this, delta);
        if (this.m_CheckTime > 0) {
            if ((this.m_CheckTime -= delta) <= 0) {
                this.InnerEnterBattle();
            }
        }
        if (this.mCreateFlag < this.mCreateCount) {
            if (this.mCreateFlag == 0) {
                this.mCreateFlag++;
                this.CreateMyRole();
            }
            else {
                if (this.mCreateOther > 0) {
                    if ((this.mCreateOther -= delta) <= 0) {
                        this.mCreateFlag++;
                        this.CreateOtherRole();
                        this.mCreateOther = 1500;
                    }
                }
            }
        }
    };
    NormalMapRaid.prototype.CreateEntity = function (entityData) {
        console.log("normal map create entity !!!");
        return null;
    };
    NormalMapRaid.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        this.m_CheckTime = this.GetNextTime();
    };
    NormalMapRaid.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        this.m_ExitTime = GameServer.serverTime;
    };
    NormalMapRaid.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
        this.m_ExitTime = 0;
        this.mCreateFlag = 0;
        this.mCreateOther = 1000;
        for (var _i = 0, _a = this.mRefMonDatas; _i < _a.length; _i++) {
            var data = _a[_i];
            EntityMovieObject.Unref(data);
        }
        this.mRefMonDatas = [];
    };
    NormalMapRaid.prototype.CreateMyRole = function () {
        var list = [];
        var entityRole = NormalBattleRaid.GetMyRole();
        if (entityRole) {
            var sceneConfig = GameGlobal.Config.ScenesConfig[this.GetSceneId()];
            if (sceneConfig) {
                entityRole.x = Const.PosToPixel(sceneConfig.enterX);
                entityRole.y = Const.PosToPixel(sceneConfig.enterY);
            }
            list.push(entityRole);
        }
        else {
            return;
        }
        if (GameGlobal.PetModel.GetShowId()) {
            list.push(this.CreatePet(GameGlobal.PetModel.GetShowId(), entityRole.handle));
        }
        var xianlvId = GameGlobal.XianlvModel.GetXianlvId();
        if (xianlvId) {
            list.push(this.CreateXianlv(xianlvId, entityRole.handle));
        }
        if (GameGlobal.HavingModel.IsDeblocking()) {
            var tiannvId = GameGlobal.HavingModel.mDressId;
            if (tiannvId) {
                list.push(this.CreateTiannv(GameGlobal.HavingModel.mDressId, entityRole.handle));
            }
        }
        var tianshen = NormalBattleRaid.GetTianshen();
        if (tianshen) {
            list.push(tianshen);
        }
        this.AddTeam(GameGlobal.actorModel.actorID, list);
    };
    NormalMapRaid.prototype.GetRobotPid = function (model, poolList) {
        var id;
        if (poolList && poolList.length >= 2) {
            id = poolList[MathUtils.limitInteger(0, poolList.length - 1)];
        }
        if (id != null) {
            id = Math.min(0 + MathUtils.limitInteger(0, model.mLevel), model.mLevel);
            if (poolList && poolList.indexOf(id) == -1) {
                poolList.push(id);
            }
        }
        return id;
    };
    NormalMapRaid.prototype.CreateOtherRole = function () {
        var list = [];
        var role = SubRoles.ins().GetRoleData();
        var job = MathUtils.limitInteger(1, 3);
        var entityRole = new EntityRole;
        var aId = MonstersConfig.GetHandle();
        var isMul = this.mCreateCount > 4;
        var ridePid = this.GetRobotPid(GameGlobal.UserRide, this.m_ShowRidePids);
        var wingPid = this.GetRobotPid(GameGlobal.UserWing, this.m_ShowWingPids);
        var tianxPid = this.GetRobotPid(GameGlobal.TianxModel, this.m_ShowTianxPids);
        var swordPid = this.GetRobotPid(GameGlobal.SwordModel, this.m_ShowSwordPids);
        // 没有坐骑的时候只显示默认
        if (!ridePid) {
            swordPid = 0;
            wingPid = 0;
        }
        var titlePid;
        var ownerList = GameGlobal.UserTitle.getOwnList();
        if (ownerList && ownerList.length) {
            var data = ownerList[MathUtils.limit(0, ownerList.length - 1)];
            if (data) {
                titlePid = data.id;
            }
        }
        if (!titlePid) {
            titlePid = 0;
        }
        var config = GameGlobal.Config.RobotNameConfig[GameGlobal.actorModel.sex][MathUtils.limitInteger(0, 49)];
        entityRole.parserBase({
            type: EntityType.Role,
            handler: aId,
            monid: 0,
            ownerid: aId,
            attrs: [],
            shows: {
                name: config ? config.name : "",
                shows: [ridePid, wingPid, tianxPid, swordPid, 0, titlePid],
                job: job,
                sex: MathUtils.limitInteger(0, 1),
            },
        });
        entityRole.skillsData = [];
        list.push(entityRole);
        if (this.m_ShowPids.length >= 3) {
            list.push(this.CreateOtherPet(this.m_ShowPids[MathUtils.limitInteger(0, this.m_ShowPids.length - 1)], aId));
        }
        else {
            var petId = this.getRamNum(this.petArry());
            if (petId) {
                if (this.m_ShowPids.indexOf(petId) == -1) {
                    this.m_ShowPids.push(petId);
                }
                list.push(this.CreateOtherPet(petId, aId));
            }
        }
        if (this.mCreateFlag <= 4) {
            var xlData = this.getRamNum(this.xlArry());
            if (xlData) {
                list.push(this.CreateOtherXianlv(xlData, aId));
            }
        }
        this.AddTeam(aId, list);
    };
    NormalMapRaid.prototype.petArry = function () {
        var Config = GameGlobal.Config.petBiographyConfig;
        var list = [];
        var datas = GameGlobal.PetModel.mPetList;
        for (var data in datas) {
            if (datas[Number(data)].mLevel > 0 && Config[Number(data)].type < 2) {
                list.push(Number(data));
            }
        }
        return list;
    };
    NormalMapRaid.prototype.xlArry = function () {
        var Config = GameGlobal.Config.partnerBiographyConfig;
        var list = [];
        var datas = GameGlobal.XianlvModel.mXianlvList;
        for (var data in datas) {
            if (datas[Number(data)].mLevel > 0 && Config[Number(data)].quality < 5) {
                list.push(Number(data));
            }
        }
        return list;
    };
    NormalMapRaid.prototype.getRamNum = function (list) {
        var arry = list;
        return arry[Math.floor(Math.random() * arry.length)];
    };
    NormalMapRaid.prototype.CreateOtherXianlv = function (xianlvId, masterHandle) {
        var entity = new EntityXianlv;
        var xwPid = this.GetRobotPid(GameGlobal.XianlvXwModel, null);
        var fzPid = this.GetRobotPid(GameGlobal.XianlvFzModel, null);
        entity.parserBase({
            type: EntityType.Xianlv,
            handler: MonstersConfig.GetHandle(),
            ownerid: masterHandle,
            shows: {
                id: xianlvId,
                shows: [fzPid, xwPid]
            }
        });
        return entity;
    };
    NormalMapRaid.prototype.CreateOtherPet = function (petId, masterHandle) {
        var petModel = new EntityPet;
        petModel.parserBase({
            type: EntityType.Pet,
            handler: MonstersConfig.GetHandle(),
            ownerid: masterHandle,
            shows: {
                id: petId,
            }
        });
        return petModel;
    };
    NormalMapRaid.prototype.CreateTeam = function () {
        return new NormalMoveTeam;
    };
    NormalMapRaid.prototype.InnerEnterBattle = function () {
        if (GameGlobal.UserFb.CheckAutoPKBoss()) {
            return;
        }
        if (!SubRoles.ins().GetRoleData()) {
            return;
        }
        GameGlobal.RaidMgr.EnterNormalBattle();
    };
    NormalMapRaid.prototype.CreatePet = function (petId, masterHandle) {
        var petModel = new EntityPet;
        petModel.parserBase({
            type: EntityType.Pet,
            handler: MonstersConfig.GetHandle(),
            ownerid: masterHandle,
            shows: {
                id: petId,
                shows: [GameGlobal.PetTonglModel.mDressId, GameGlobal.PetShouhModel.mDressId]
            }
        });
        return petModel;
    };
    // private CreateLingtong(petId: number, masterHandle: number): EntityLingtong {
    // 	let petModel = new EntityLingtong
    // 	petModel.parserBase({
    // 		type: EntityType.Lingtong,
    // 		handler: MonstersConfig.GetHandle(),
    // 		ownerid: masterHandle,
    // 		shows: {
    // 			id: petId
    // 		}
    // 	} as Sproto.entity_data)
    // 	return petModel
    // }
    NormalMapRaid.prototype.CreateXianlv = function (xianlvId, masterHandle) {
        var entity = new EntityXianlv;
        entity.parserBase({
            type: EntityType.Xianlv,
            handler: MonstersConfig.GetHandle(),
            ownerid: masterHandle,
            shows: {
                id: xianlvId,
                shows: [GameGlobal.XianlvFzModel.mDressId, GameGlobal.XianlvXwModel.mDressId]
            }
        });
        return entity;
    };
    NormalMapRaid.prototype.CreateTiannv = function (tiannvId, masterHandle) {
        var entity = new EntityTiannv;
        entity.parserBase({
            type: EntityType.Tiannv,
            handler: MonstersConfig.GetHandle(),
            ownerid: masterHandle,
            shows: {
                shows: [tiannvId, GameGlobal.HavingLingqModel.mDressId, GameGlobal.HavingHuanModel.mDressId]
            }
        });
        return entity;
    };
    NormalMapRaid.prototype.GetOwnEntity = function (entityType) {
        var roleHandle = SubRoles.ins().GetRoleData().handle;
        var actHandle = GameGlobal.actorModel.actorID;
        for (var key in this.mEntityList) {
            var data = this.mEntityList[key];
            var info = data.GetInfo();
            if (info.type == entityType && info.masterHandle) {
                var role = this.mEntityList[info.masterHandle];
                if (role) {
                    var handle = role.GetHandle();
                    if (handle == roleHandle || handle == actHandle) {
                        return data;
                    }
                }
            }
        }
        return null;
    };
    NormalMapRaid.prototype.UpdateRolePet = function (petId) {
        if (!this.IsCreateMy()) {
            return;
        }
        var handle = SubRoles.ins().GetRoleData().handle;
        var petData = this.GetOwnEntity(EntityType.Pet);
        if (petData) {
            if (petId) {
                petData.GetInfo().configID = petId;
                petData.UpdateInfo();
            }
            else {
                this.RemoveEntity(petData.GetHandle());
            }
        }
        else {
            if (petId) {
                this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, this.CreatePet(petId, handle));
            }
        }
    };
    // public UpdateRoleLingtong(ligntongid: number) {
    // 	if (!this.IsCreateMy()) {
    // 		return
    // 	}
    // 	let handle = SubRoles.ins().GetRoleData().handle
    // 	let petData: MapEntity = this.GetOwnEntity(EntityType.Pet)
    // 	if (petData) {
    // 		if (ligntongid) {
    // 			petData.GetInfo().configID = ligntongid
    // 			petData.UpdateInfo()
    // 		} else {
    // 			this.RemoveEntity(petData.GetHandle())
    // 		}
    // 	} else {
    // 		if (ligntongid) {
    // 			this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, this.CreateLingtong(ligntongid, handle))
    // 		}
    // 	}
    // }
    NormalMapRaid.prototype.UpdateRolePetTongl = function (id) {
        var petData = this.GetOwnEntity(EntityType.Pet);
        if (petData) {
            petData.GetInfo().mTlId = UserTemplate.GetAppaId(GameGlobal.PetTonglModel.SkinConfig, id);
            petData.UpdateInfo();
        }
    };
    NormalMapRaid.prototype.UpdateRolePetShouh = function (id) {
        var petData = this.GetOwnEntity(EntityType.Pet);
        if (petData) {
            petData.GetInfo().mShId = UserTemplate.GetAppaId(GameGlobal.PetShouhModel.SkinConfig, id);
            petData.UpdateInfo();
        }
    };
    NormalMapRaid.prototype.UpdateRoleXianlv = function (xianlvId) {
        var handle = SubRoles.ins().GetRoleData().handle;
        var petData = this.GetOwnEntity(EntityType.Xianlv);
        if (petData) {
            if (xianlvId) {
                petData.GetInfo().configID = xianlvId;
                petData.UpdateInfo();
            }
            else {
                this.RemoveEntity(petData.GetHandle());
            }
        }
        else {
            if (xianlvId) {
                this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, this.CreateXianlv(xianlvId, handle));
            }
        }
    };
    NormalMapRaid.prototype.UpdateRoleXianlvFz = function (xwId) {
        var petData = this.GetOwnEntity(EntityType.Xianlv);
        if (petData) {
            petData.GetInfo().mFazId = UserTemplate.GetAppaId(GameGlobal.XianlvFzModel.SkinConfig, xwId);
            petData.UpdateInfo();
        }
    };
    NormalMapRaid.prototype.UpdateRoleXianlvXw = function (xwId) {
        var petData = this.GetOwnEntity(EntityType.Xianlv);
        if (petData) {
            petData.GetInfo().mXianwId = UserTemplate.GetAppaId(GameGlobal.XianlvXwModel.SkinConfig, xwId);
            petData.UpdateInfo();
        }
    };
    NormalMapRaid.prototype.UpdateRoleTiannv = function () {
        if (!this.IsCreateMy()) {
            return;
        }
        var handle = SubRoles.ins().GetRoleData().handle;
        var petData = this.GetOwnEntity(EntityType.Tiannv);
        if (petData) {
            // if (shengj) {
            // 	petData.GetInfo().configID = shengj
            // 	petData.UpdateInfo()
            // } else {
            // 	this.RemoveEntityByOwnHandle(GameGlobal.actorModel.actorID, petData.GetHandle())
            // }
            console.log("not imple create UpdateRoleTiannv");
        }
        else {
            var tiannvId = GameGlobal.HavingModel.mDressId;
            if (tiannvId) {
                this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, this.CreateTiannv(GameGlobal.HavingModel.mDressId, handle));
            }
        }
    };
    NormalMapRaid.prototype.IsCreateMy = function () {
        return this.mEntityList[SubRoles.ins().GetRoleData().handle] != null;
    };
    NormalMapRaid.prototype.UpdateRoleTiannvLq = function (xwId) {
        var petData = this.GetOwnEntity(EntityType.Tiannv);
        if (petData) {
            petData.GetInfo().mLq = UserTemplate.GetAppaId(GameGlobal.HavingLingqModel.SkinConfig, xwId);
            petData.UpdateInfo();
        }
    };
    NormalMapRaid.prototype.UpdateRoleTiannvHua = function (xwId) {
        var petData = this.GetOwnEntity(EntityType.Tiannv);
        if (petData) {
            petData.GetInfo().mHua = UserTemplate.GetAppaId(GameGlobal.HavingHuanModel.SkinConfig, xwId);
            petData.UpdateInfo();
        }
    };
    NormalMapRaid.prototype.UpdateRoleTianshen = function (shengj) {
        var handle = SubRoles.ins().GetRoleData().handle;
        var petData = this.GetOwnEntity(EntityType.Shenjiang);
        if (petData) {
            if (shengj) {
                petData.GetInfo().configID = shengj;
                petData.UpdateInfo();
            }
            else {
                this.RemoveEntity(petData.GetHandle());
            }
        }
        else {
            if (shengj) {
                this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, NormalBattleRaid.GetTianshen());
            }
        }
    };
    NormalMapRaid.prototype.UpdateMonsterInfo = function () {
        this._ResetMapEntity();
        var monsterList = GameGlobal.DailyModel.GetMonsterList();
        for (var _i = 0, monsterList_1 = monsterList; _i < monsterList_1.length; _i++) {
            var monsterId = monsterList_1[_i];
            this.CreateMyMonster(monsterId);
        }
    };
    NormalMapRaid.prototype.CreateMyMonster = function (monsterId, pos) {
        if (!pos) {
            pos = this._GetRandomPos();
        }
        var entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(monsterId, Const.PosToPixel(pos.x), Const.PosToPixel(pos.y));
        entity.SetClick(false);
        var handle = entity.GetHandle();
        this.mMonsterMap[handle] = monsterId;
        var key = pos.x + "_" + pos.y;
        this.mMonsterPosMap[key] = handle;
    };
    NormalMapRaid.prototype._GetRandomPos = function () {
        var pos = new egret.Point;
        while (true) {
            var centerX = Math.floor(GameMap.COL / 2);
            var centerY = Math.floor(GameMap.ROW / 2);
            GameMap.GetRandomPos(centerX, centerY, centerX - 2, centerY - 2, pos);
            var key = pos.x + "_" + pos.y;
            if (!this.mMonsterPosMap[key]) {
                return pos;
            }
        }
    };
    NormalMapRaid.prototype.OnEntityClick = function (handle) {
        var monsterId = this.mMonsterMap[handle];
        var taskIndex = GameGlobal.DailyModel.GetTaskIndex(monsterId);
        if (taskIndex == -1) {
            return;
        }
        ViewManager.ins().open(DailyFomalhautTaskPanel, taskIndex);
    };
    NormalMapRaid.prototype._ResetMapEntity = function () {
        for (var key in this.mMonsterMap) {
            var handle = parseInt(key);
            this.RemoveEntity(handle);
        }
        this.mMonsterMap = {};
        this.mMonsterPosMap = {};
    };
    NormalMapRaid.REFRESH_TIME = 8000;
    return NormalMapRaid;
}(MapRaid));
__reflect(NormalMapRaid.prototype, "NormalMapRaid");
//# sourceMappingURL=NormalMapRaid.js.map