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
var EntityManager = (function (_super) {
    __extends(EntityManager, _super);
    function EntityManager() {
        return _super.call(this) || this;
    }
    EntityManager.ins = function () {
        return _super.ins.call(this);
    };
    EntityManager.prototype.isMySubRole = function (handle) {
        if (SubRoles.ins().GetRoleData().handle == handle)
            return true;
        return false;
    };
    EntityManager.prototype.IsHideMap = function () {
        return false;
    };
    EntityManager.prototype.IsHideMapType2 = function () {
        return false;
    };
    EntityManager.prototype.IsShadownEntityMap = function () {
        return false;
    };
    EntityManager.prototype.HasWillBoss = function () {
        // return RaidAIMgr.GetAI().getTeamCount(Team.WillBoss) > 0
        return false;
    };
    EntityManager.prototype.onTouchBegin = function () {
    };
    EntityManager.prototype.removeWillBoss = function () {
    };
    EntityManager.prototype.UpdateWingShowState = function (isHide) {
    };
    EntityManager.prototype.IsHideOther = function () {
        return FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GAME_OTHER_PLAYER);
    };
    EntityManager.prototype.CountShowNum = function () {
        // let entityList = RaidAIMgr.GetAI().GetUnitList()
        // let count = 0;
        // let myHanlde = GameGlobal.actorModel.handle
        // for (let key in entityList) {
        //     let unit = entityList[key]
        //     let entity = unit.mEntity
        //     if (entity.GetShowState() && entity.infoModel && entity.infoModel.masterHandle && entity.infoModel.masterHandle != myHanlde && !unit.IsMonster()) {
        //         ++count
        //     }
        // }
        // return count
        return 0;
    };
    EntityManager.prototype.HideOtherEntity = function () {
        // let b = this.IsHideOther()
        // let entityList = RaidAIMgr.GetAI().GetUnitList()
        // for (let key in entityList) {
        //     let unit = entityList[key]
        //     if (unit.GetTeam() != Team.WillEntity) {
        //         continue
        //     }
        //     if (b) {
        //         unit.mEntity.SetShowState(false)
        //     } else {
        //         if (this.IsHideMap() && this.CountShowNum() >= EntityManager.MAX_SHOW_NUM) {
        //             return
        //         }
        //         unit.mEntity.SetShowState(true)
        //     }
        // }
    };
    EntityManager.prototype.GetLookAtRole = function () {
        // return RaidAIMgr.GetAI().GetLookAtRole()
        return GameGlobal.RaidMgr.GetRaid().GetLookAtRole();
    };
    // public Create(entityData: EntityModel): Entity {
    //     let entity: Entity = ObjectPool.pop("Entity")
    //     entity.Init(entityData)
    //     return entity
    // }
    EntityManager.prototype.IsHideEntity = function (entity) {
        // if (entity.team == Team.WillEntity && this.IsHideOther() && this.IsHideMapType2()) {
        //     return true
        // }
        // if (this.IsHideMap() && entity.team == Team.WillEntity) {
        //     if (this.IsHideOther()) {
        //         return true
        //     }
        //     if (this.CountShowNum() >= EntityManager.MAX_SHOW_NUM) {
        //         return true
        //     }
        // }
        return false;
    };
    EntityManager.prototype.ShowHideSomeOne = function (handle) {
        //     this.HideByHandle(handle)
        //     let entityList = RaidAIMgr.GetAI().GetUnitList()
        //     for (let key in entityList) {
        //         let unit = entityList[key]
        //         if (unit.mEntity.GetShowState()) {
        //             continue
        //         }
        //         if (unit.GetTeam() != Team.WillEntity) {
        //             continue
        //         }
        //         if (unit.GetMasterHandle() != handle) {
        //             continue
        //         }
        //         unit.mEntity.SetShowState(true)
        //     }
    };
    EntityManager.prototype.HideByHandle = function (handle) {
        // let showNum = this.CountShowNum()
        // if (showNum >= EntityManager.MAX_SHOW_NUM) {
        //     let entityList = RaidAIMgr.GetAI().GetUnitList()
        //     for (let key in entityList) {
        //         let unit = entityList[key]
        //         if (unit.mEntity.GetShowState() && unit.GetTeam() == Team.WillEntity && unit.GetMasterHandle() != handle) {
        //             if (--showNum <= EntityManager.MAX_SHOW_NUM - 3) {
        //                 break
        //             }
        //             unit.mEntity.SetShowState(false)
        //         }
        //     }
        // }
    };
    EntityManager.MAX_SHOW_NUM = 10;
    return EntityManager;
}(BaseClass));
__reflect(EntityManager.prototype, "EntityManager");
//# sourceMappingURL=EntityManager.js.map