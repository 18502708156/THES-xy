class EntityManager extends BaseClass {

    static readonly MAX_SHOW_NUM = 10

    public willBoss: number

    public constructor() {
        super();
    }

    public static ins(): EntityManager {
        return super.ins();
    }

    public isMySubRole(handle: number): boolean {

            if (SubRoles.ins().GetRoleData().handle == handle)
                return true;

        return false;
    }

    public IsHideMap() {
        return false
    }

    public IsHideMapType2(): boolean {
        return false
    }

    public IsShadownEntityMap() {
        return false
    }

    public HasWillBoss(): boolean {
        // return RaidAIMgr.GetAI().getTeamCount(Team.WillBoss) > 0
        return false
    }

    public onTouchBegin() {
        
    }

    public removeWillBoss(): void {
        
    }

    public UpdateWingShowState(isHide: boolean): void {
        
    }

    private IsHideOther(): boolean {
        return FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GAME_OTHER_PLAYER)
    }

    public CountShowNum(): number {
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
        return 0
    }

    public HideOtherEntity(): void {
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
    }

    public GetLookAtRole(): MapEntity {
        // return RaidAIMgr.GetAI().GetLookAtRole()
        return GameGlobal.RaidMgr.GetRaid().GetLookAtRole()
    }

    // public Create(entityData: EntityModel): Entity {
    //     let entity: Entity = ObjectPool.pop("Entity")
    //     entity.Init(entityData)
    //     return entity
    // }

    private IsHideEntity(entity: EntityData): boolean {
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
        return false
    }

    ShowHideSomeOne(handle: number) {
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
    }

    private HideByHandle(handle: number) {
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
    }
}