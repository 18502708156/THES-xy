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
var NormalBattleRaid = (function (_super) {
    __extends(NormalBattleRaid, _super);
    function NormalBattleRaid() {
        var _this = _super.call(this) || this;
        // 测试
        _this.mIsManual = false;
        _this.mMySide = 2;
        _this.battleMgr = new BattleMgr;
        return _this;
    }
    NormalBattleRaid.prototype.ShowBattleLayer = function () {
        GameMap.GetBattleView().ShowDefault();
    };
    NormalBattleRaid.prototype.Init = function () {
        _super.prototype.Init.call(this);
        this.battleMgr.Init(this);
    };
    NormalBattleRaid.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        this.m_StartTime = this.m_StartTime >> 1;
        this.battleMgr.OnEnter();
    };
    NormalBattleRaid.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        this.battleMgr.OnExit();
    };
    NormalBattleRaid.prototype.ClearEntityEffMgr = function () {
        GameGlobal.EntityEffMgr.Clear(false);
    };
    NormalBattleRaid.prototype.Update = function (d) {
        _super.prototype.Update.call(this, d);
        this.battleMgr.Update(d);
    };
    NormalBattleRaid.prototype.UseSkill = function (list) {
        this.battleMgr.UseSkill(list);
    };
    // 一回合结束
    NormalBattleRaid.prototype.TurnFinish = function () {
        if (this.mIsManual) {
            this.battleMgr.TurnExecuteFinish();
        }
        _super.prototype.TurnFinish.call(this);
    };
    NormalBattleRaid.prototype.SetBattleData = function () {
        var list1 = [];
        var config = GameGlobal.UserFb.config;
        var len = MathUtils.limitInteger(config.minunm, config.maxnum);
        var monIndex = 0;
        var monConfig = config.waveMonsterId;
        // let indexArray = MathUtils.RandomArr(1, 10, len)
        var indexArray = NormalBattleRaid.POS_ARR;
        var rate = GameGlobal.UserFb.guanqiaID > 100 ? 0.5 : 1;
        for (var i = 0; i < len; i++) {
            var configData = monConfig[(monIndex++ % monConfig.length)];
            var entityData = MonstersConfig.CreateByData(configData.id, configData, rate);
            list1.push(entityData);
            entityData.posIndex = indexArray[i];
        }
        var list2 = [];
        var entityRole = NormalBattleRaid.GetMyRole();
        if (!entityRole) {
            return;
        }
        entityRole.posIndex = 8;
        list2.push(entityRole);
        var entityPet = NormalBattleRaid.GetMyPet();
        if (entityPet) {
            entityPet.posIndex = 3;
            list2.push(entityPet);
        }
        var entityLingtong = NormalBattleRaid.CreateLingtong();
        if (entityLingtong) {
            entityLingtong.posIndex = 2;
            list2.push(entityLingtong);
        }
        for (var i = 0; i < 2; i++) {
            var entity = NormalBattleRaid.GetXianlv(i);
            if (entity) {
                entity.posIndex = i == 0 ? 7 : 9;
                list2.push(entity);
            }
        }
        var tiannv = this.GetTiannv();
        if (tiannv) {
            tiannv.posIndex = 6;
            list2.push(tiannv);
        }
        var tianshen = NormalBattleRaid.GetTianshen();
        if (tianshen) {
            tianshen.posIndex = 10;
            list2.push(tianshen);
        }
        for (var _i = 0, list2_1 = list2; _i < list2_1.length; _i++) {
            var data = list2_1[_i];
            data.side = 2;
        }
        var list = [list1, list2];
        _super.prototype.SetBattleData.call(this, list);
        this.battleMgr.SetBattleData(list);
    };
    NormalBattleRaid.GetMyPet = function () {
        var id = GameGlobal.PetModel.GetShowId();
        if (!id) {
            return;
        }
        var petInfo = GameGlobal.PetModel.GetPetInfo(id);
        var entity = new EntityPet;
        var handle = MonstersConfig.GetHandle();
        entity.parserBase({
            type: EntityType.Pet,
            handler: handle,
            monid: id,
            ownerid: GameGlobal.actorModel.actorID,
            // attrs: NormalBattleRaid.CopyAttr(petInfo.GetAttrs()),
            attrs: CommonUtils.copyDataHandler(GameGlobal.SubRoles.GetRoleData().attributeData),
            shows: {
                id: id,
                shows: [GameGlobal.PetTonglModel.mDressId, GameGlobal.PetShouhModel.mDressId]
            }
        });
        return entity;
    };
    NormalBattleRaid.CopyAttr = function (attr) {
        var data = [];
        for (var _i = 0, attr_1 = attr; _i < attr_1.length; _i++) {
            var val = attr_1[_i];
            data[val.type] = val.value;
        }
        for (var i = 0; i < AttributeType.atCount; i++) {
            if (!data[i]) {
                data[i] = 0;
            }
        }
        data[AttributeType.atHp] = data[AttributeType.atMaxHp];
        return data;
    };
    NormalBattleRaid.GetXianlv = function (index) {
        var xianlvId = GameGlobal.XianlvModel.mBattleList[index];
        if (!xianlvId) {
            return;
        }
        var info = GameGlobal.XianlvModel.GetXianlvInfo(xianlvId);
        var entity = new EntityXianlv;
        var handle = MonstersConfig.GetHandle();
        entity.parserBase({
            type: EntityType.Xianlv,
            handler: handle,
            monid: xianlvId,
            ownerid: GameGlobal.actorModel.actorID,
            // attrs: NormalBattleRaid.CopyAttr(info.GetAttrs()),
            attrs: CommonUtils.copyDataHandler(GameGlobal.SubRoles.GetRoleData().attributeData),
            shows: {
                id: xianlvId,
                shows: [GameGlobal.XianlvFzModel.mDressId, GameGlobal.XianlvXwModel.mDressId]
            }
        });
        entity.skillsData = [info.GetSkillId()];
        return entity;
    };
    NormalBattleRaid.prototype.GetTiannv = function () {
        if (!GameGlobal.HavingModel.IsDeblocking()) {
            return null;
        }
        if (!GameGlobal.HavingModel.mLevel) {
            return null;
        }
        var entity = new EntityTiannv;
        var handle = MonstersConfig.GetHandle();
        entity.parserBase({
            type: EntityType.Tiannv,
            handler: handle,
            monid: 0,
            ownerid: GameGlobal.actorModel.actorID,
            attrs: CommonUtils.copyDataHandler(GameGlobal.SubRoles.GetRoleData().attributeData),
            shows: {
                shows: [GameGlobal.HavingModel.mDressId, GameGlobal.HavingLingqModel.mDressId, GameGlobal.HavingHuanModel.mDressId]
            }
        });
        entity.skillsData = GameGlobal.HavingModel.GetSkillIds();
        return entity;
    };
    NormalBattleRaid.GetTianshen = function () {
        var battleId = GameGlobal.TianShenModel.mBattleID;
        if (!battleId) {
            return null;
        }
        var info = GameGlobal.TianShenModel.mTianShenList[battleId];
        if (!info) {
            return null;
        }
        var entity = new EntityTianshen;
        var handle = MonstersConfig.GetHandle();
        entity.parserBase({
            type: EntityType.Shenjiang,
            handler: handle,
            monid: battleId,
            ownerid: GameGlobal.actorModel.actorID,
            // attrs: this.CopyAttr(info.GetAttrs()),
            attrs: CommonUtils.copyDataHandler(GameGlobal.SubRoles.GetRoleData().attributeData),
            shows: {
                id: battleId
            }
        });
        return entity;
    };
    NormalBattleRaid.CreateLingtong = function () {
        var id = GameGlobal.LingtongPetModel.GetShowId();
        if (!id) {
            return null;
        }
        var entity = new EntityLingtong;
        var handle = MonstersConfig.GetHandle();
        entity.parserBase({
            type: EntityType.Lingtong,
            handler: handle,
            monid: 0,
            ownerid: GameGlobal.actorModel.actorID,
            attrs: CommonUtils.copyDataHandler(GameGlobal.SubRoles.GetRoleData().attributeData),
            shows: {
                id: id,
            },
        });
        entity.skillsData = CommonUtils.copyDataHandler(GameGlobal.LingtongAttrModel.GetCurSkill(id));
        return entity;
    };
    NormalBattleRaid.GetMyRole = function () {
        var role = GameGlobal.SubRoles.GetRoleData();
        if (!role) {
            return null;
        }
        var entityRole = new EntityRole;
        var handle = GameGlobal.actorModel.actorID;
        entityRole.parserBase({
            type: EntityType.Role,
            handler: handle,
            monid: 0,
            ownerid: GameGlobal.actorModel.actorID,
            attrs: CommonUtils.copyDataHandler(role.attributeData),
            shows: {
                name: GameGlobal.actorModel.name,
                shows: [GameGlobal.UserRide.mDressId, GameGlobal.UserWing.mDressId, GameGlobal.TianxModel.mDressId, GameGlobal.SwordModel.mDressId, GameGlobal.UserSkin.getWearId(), GameGlobal.UserTitle.getWearId()],
                job: role.job,
                sex: role.sex,
            },
        });
        entityRole.skillsData = CommonUtils.copyDataHandler(role.GetCurSkillSortIds());
        return entityRole;
    };
    NormalBattleRaid.POS_ARR = [8, 3, 7, 9, 6, 10, 2, 4, 1, 5];
    return NormalBattleRaid;
}(BattleRaid));
__reflect(NormalBattleRaid.prototype, "NormalBattleRaid");
//# sourceMappingURL=NormalBattleRaid.js.map