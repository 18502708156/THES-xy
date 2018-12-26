class Raid {

	public mIsShowGuild: boolean

	public mIsExit = false

	public mMySide = 0
	public mEntityList: {[key: number]: MapEntity} = {}

	private m_DeltaTime: number = 0

	public UpdateSetting(settingId: number) {
		for (let key in this.mEntityList) {
			let entity = this.mEntityList[key]
			if (!entity) {
				return
			}
			entity.UpdateSetting(settingId)
		}
	}

	public GetSpeed(): number {
		return 1
	}

	public Init(): void {
		
	}

	/**
	 * 地图点击
	 */
	public OnMapClick(localX: number, localY: number): void {

	}

	public DoUpdate(delta: number): void {
		if (this.IsBackground()) {
			this.m_DeltaTime += delta
			if (this.m_DeltaTime < 250) {
				return
			}
			delta = this.m_DeltaTime
			this.m_DeltaTime = 0
		} else {
			if (this.m_DeltaTime) {
				delta = this.m_DeltaTime + delta
				this.m_DeltaTime = 0
			}
		}
		
		
		this.Update(delta)
	}

	/**
	 * 更新
	 */
	public Update(delta: number): void {
	}

	/**
	 * 进入
	 */
	public OnEnter() {
		this.m_DeltaTime = 0
	}

	/**
	 * 退出
	 */
	public OnExit() {
	}

	public OnBackground() {

	}

	public OnForeground() {

	}

	protected IsBackground(): boolean {
		return false
	}

	/**
	 * 移除所以实体
	 */
	public RemoveAllEntity(): void {
		for (let key in this.mEntityList) {
			let unit = this.mEntityList[key]
            unit.Dispose()
			ObjectPool.push(unit)
		}
		this.mEntityList = {}
	}

	/**
	 * 移除实体
	 */
	public RemoveEntity(handle: number): boolean {
		let unit = this.mEntityList[handle]
		if (!unit) {
			return false
		}
        unit.Dispose()
		ObjectPool.push(unit)
        delete this.mEntityList[handle]
        return true
	}
	
	public CalcEntityTeam(entityData: EntityData): Team {
		if (entityData.masterHandle) {
			if (entityData.masterHandle == GameGlobal.actorModel.actorID) {
				return Team.My
			} 
			if (SubRoles.ins().GetRoleData() && entityData.masterHandle == SubRoles.ins().GetRoleData().handle) {
				return Team.My
			}
		}
		if (entityData.side != 0 && this.mMySide != 0 && entityData.side == this.mMySide) {
			return Team.My
		}
		if (entityData.type == EntityType.Monster) {
			return Team.Monster	
		}
		return Team.WillEntity
	}

	protected AddEntity(entityData: EntityData): MapEntity {
		let entity = ObjectPool.pop("MapEntity") as MapEntity
		entity.Init(this, entityData)
		this.mEntityList[entity.GetHandle()] = entity
		return entity
	}

	public GetEntityNameStyle(info: EntityData): string {
		return info.GetName()
	}

	protected GetEntityNameStyleSvr(info: EntityData): string {
		return GameString.GetSerAndName(info.serverId, info.GetName())
	}

	public GetEntity(handle: number): MapEntity {
		return this.mEntityList[handle]
	}

	public CreateEntity(entityData: EntityData): MapEntity {
		return null
	}

	public DoExitFb(): boolean {
		return false
	}

	public getMainRole(): MapEntity {
		let role = SubRoles.ins().GetRoleData()
		if (!role) {
			return null
		}
		return this.mEntityList[SubRoles.ins().GetRoleData().handle]
    }

	public getNoDieRole(): MapEntity {
       return this.getMainRole();
	}

	public GetLookAtRole(): MapEntity {
        let role = this.getNoDieRole()
        if (role) {
            return role
        }
        return null
    }

	public FinishBattle() {
	}

	public GetTurnId() {
		return 1
	}
}
