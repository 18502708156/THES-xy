class MapRaid extends Raid {

	// 最大实体模型显示数量
	public static MAX_SHOW_COUNT = 12
	// 最大实体显示数量
	public static MAX_ENTITY_COUNT = 25

	public mMapId: number = 0

	private mObjects: {[key: number]: egret.DisplayObject} = {}

	// public mTeam: MoveTeam[] = []
	public cTeam: { [type: number]: MoveTeam } = {}
	public mFbId: number
	public mFbType: number

	public constructor() {
		super()
	}

	public GetSceneId(): number {
		return 0
	}

	protected IsBackground(): boolean {
		return GameGlobal.RaidMgr.mShowType != RaidMgr.TYPE_NORMAL
	}

	public OnMapClick(localX: number, localY: number): boolean {
		return this.MoveOrder(MoveTeam.NONE_ORDER, localX, localY)
	}

	protected GetMyTeam(): MoveTeam {
		return this.cTeam[GameGlobal.actorModel.actorID]
	}

	/**
	 * 移动指令
	 * @param 	MoveTeam.NONE_ORDER or null	地图点击的指令
	 * 			其它
	 * @param	像素
	 * @param	像素
	 * @param	目的点偏移
	 */
	public MoveOrder(orderId: number, localX: number, localY: number, offset: number = 0): boolean {
		let team = this.GetMyTeam()
		if (team) {
			team.MoveTo(orderId, localX, localY, offset, this.IsBackground())
			return true
		} else {
			// UserTips.InfoTip("")
			console.log("队长才能移动")
		}
		return false
	}

	public Create(entityData: EntityData): MapEntity {
		if (this.mEntityList[entityData.handle]) {
			console.warn("重复添加对象 handle => " + entityData.handle)
			return null
		}
		entityData.team = this.CalcEntityTeam(entityData)

		switch (entityData.type) {
			case EntityType.Role:
				let roleModel = entityData as EntityRole
				if (entityData.team == Team.My) {
					//把属性数据合拼到子角色信息里`
					let role = GameGlobal.SubRoles.GetRoleData()
					if (role) {
						entityData = role.MergeData(roleModel);
					} else {
						console.error('my team not my role => ')
					}
				}
				break
			case EntityType.Monster:
				break
			case EntityType.Pet:
				break
		}

		let entity = this.AddEntity(entityData)
		// 隐藏其它玩家
		let hideEntity = entityData.team == Team.WillEntity && FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER)
		if (!hideEntity) {
			this.AddToMap(entity)
		}
		entity.SetPos(entityData.x || 0, entityData.y || 0)
		return entity
	}

	protected AddToMap(entity: MapEntity) {
		if (entity.GetTeam() == Team.WillEntity) {
			let count = 0
			for (let key in this.mEntityList) {
				let data = this.mEntityList[key]
				if (data.GetTeam() == Team.WillEntity) {
					++count
				}
			}
			if (count > MapRaid.MAX_ENTITY_COUNT) {
				return
			}
			if (count > MapRaid.MAX_SHOW_COUNT) {
				if (entity.m_Model) {
					entity.m_Model.SetMaxCountState(true)
				}
			}
	 	} 
		this.GetMapEntityView().AddEntity(entity)
	}

	public AddTeam(handle: number, entityDatas: EntityData[]): void {
		// 偏移坐标
		for (let i = 1; i < entityDatas.length; i++) {
			entityDatas[i].x = entityDatas[i - 1].x - 50
			entityDatas[i].y = entityDatas[i - 1].y
		}
		let list: MapEntity[] = []
		for (let entityData of entityDatas) {
			let entity = this.Create(entityData)
			if (entity) {
				list.push(entity)
			}
		}
		if (!list.length) {
			return
		}
		this.CreateTeamData(handle, list)

	}

	public AddEntityToTeamByHandle(handle: number, entityData: EntityData): void {
		let team = this.cTeam[handle]
		if (team) {
			this.AddEntityToTeam(team, entityData)
		}
	}

	public AddEntityToTeam(team: MoveTeam, entityData: EntityData): void {
		let entity = this.Create(entityData)
		if (!entity) {
			return
		}
		team.AddEntity(entity)
	}

	protected CreateTeam(): MoveTeam {
		return new MoveTeam
	}

	public CreateEntity(entityData: EntityData): MapEntity {
		return this.Create(entityData)
	}

	public Update(delta: number): void {
		for (let key in this.cTeam) {
			this.cTeam[key].Update(delta)
		}
		if (this.IsBackground()) {
			return
		}
		GameMap.GetMap().LookAt(this.GetLookAtRole())
	}

	public Init() {
		GameMap.UpdateScene()
	}
	
	public OnForeground() {
		GameMap.UpdateScene()
		GameMap.GetMap().LookAt(this.GetLookAtRole())
	}

	public OnEnter() {
		GameGlobal.RaidMgr.UpdateBGM()
		this.GetMapEntityView().AddEntityLayer()
		GameMap.GetMap().LookAt(this.GetLookAtRole())
	}

	public OnExit() {
		this.GetMapEntityView().RemoveEntityLayer()
	}

	protected GetMapEntityView() {
		return GameMap.GetMap().mMapEntityView
	}

	/**
	 * 清理场景
	 */
	public Clear() {
		this.GetMapEntityView().RemoveDropLayer()
		this.RemoveAllEntity()
		this.cTeam = {}
		this.mObjects = {}
		GameGlobal.MessageCenter.removeAll(this)
		TimerManager.ins().removeAll(this)
	}

	// 解散队伍信息，并不清除实体信息
	protected DismissTeam(handle: number) {
		let team = this.cTeam[handle]
		if (team) {
			team.Clear()	
			delete this.cTeam[handle]
		} else {
			console.warn("解散不存在的队伍 => " + handle)
		}
	}

	protected CreateTeamData(handle: number, list: MapEntity[]) {
		let team = this.CreateTeam()
		team.mMasterHandle = handle
		team.Init(list)
		this.cTeam[handle] = team;
	}

	// public UpdateEntityTeam(teamHandle: number, memIds: number[]) {
	// 	let memKeys = {}
	// 	for (let id of memIds) {
	// 		memKeys[id] = true
	// 	}
	// 	let team = this.GetTeam(teamHandle)
	// 	if (team) {
	// 		let memHandle = {}
	// 		for (let mem of team.mMember) {
	// 			if (mem.mTarget) {
	// 				memHandle[mem.mTarget.GetHandle()] = true
	// 			}
	// 		}
	// 		for (let key in memHandle) {
	// 			let handle = Number(key)
	// 			if (!memKeys[handle]) {
	// 				team.RemoveMem(handle)
	// 			}
	// 		}
	// 		for (let key in memKeys) {
	// 			let handle = Number(key)
	// 			if (!memHandle[handle]) {
	// 				let entity = this.GetEntity(handle)
	// 				if (entity) {
	// 					team.AddEntity(entity)
	// 				}
	// 			}
	// 		}
	// 	} else {

	// 	}
	// }

	/**
	 * 创建一个怪物对象
	 * 怪物id
	 * x：像素坐标
	 * y：像素坐标
	 * @return 对象的唯一id
	 */
	public CreateMonster(monsterId: number, x: number, y: number): MapEntity {
		let config = GameGlobal.Config.MonstersConfig[monsterId]
		if (!config) {
			console.warn("not monster id => " + monsterId)
			return
		}
		let data = MonstersConfig.CreateModel(config)
		data.x = x
		data.y = y
		let entity = this.Create(data)
		if (!entity) {
			console.warn("create monster failure => " + monsterId)
			return null
		}
		entity.UpdateAction(EntityClipType.STAND, false)
		return entity
	}

	/**
	 * 创建一个图片对象
	 * 图片资源名
	 * x：像素坐标
	 * y：像素坐标
	 * @return 对象的唯一id
	 */
	public CreateImage(imageName: string, x: number, y: number, touchEnabled: boolean = true): number {
		let img = new eui.Image
		img.source = imageName
		img.touchEnabled = touchEnabled
		return this.CreateObject(img, x, y)
	}

	/**
	 * 创建一个静态对象
	 * x：像素坐标
	 * y：像素坐标
	 * @return 对象的唯一id
	 */
	public CreateObject(obj: egret.DisplayObject, x: number, y: number): number {
		let img = obj
		let id = MonstersConfig.GetHandle()
		img.name = id + ""
		img.x = x
		img.y = y
		img.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
			let mapRaid = GameGlobal.RaidMgr.GetCurMapRaid()
			mapRaid.OnEntityClick(Number(this.name))
		}, img)
		this.mObjects[id] = img
		this.GetMapEntityView().AddDrop(img)
		return id
	}

	public RemoveEntity(handle: number): boolean {
		let ret = super.RemoveEntity(handle)
		if (!ret) {
			let obj = this.mObjects[handle]
			if (obj) {
				if (obj["Dispose"]) {
					obj["Dispose"]()
				}
				DisplayUtils.removeFromParent(obj)
				delete this.mObjects[handle]
			}
		}
		return ret
	}

	public UpdatePlayerStatus(id: number, status: number): void {
		let entity = this.mEntityList[id]
		if (!entity) {
			return
		}
		entity.ChageStatus(status)
	}

	public SetSelectEntity(handle: number): void {
	}

	public ClearSelectEntity(handle: number): void {
	}

	/***************************************************************************
	 * 副本事件
	 */

	/*移动事件结束回掉*/
	public OnMoveLeval(orderId: number, handle: number, taget_x: number, taget_y: number) {

	}

	// 角色点击之前的时间
	public OnPreEntityClick(handle: number): boolean {
		return true	
	}

	// 角色点击
	public OnEntityClick(handle: number) {
	}

	//  退出场景回调
	public OnLeave() {

	}

	//是否隐藏其他角色
	public IsShowOther(bool: boolean) {
		for (let key in this.mEntityList) {
			let entity = this.mEntityList[key]
			if (!entity) {
				continue
			}
			if (entity.GetInfo().team != Team.WillEntity) {
				continue
			}
			if (!entity.parent) {
				this.AddToMap(entity)
			} else {
				DisplayUtils.removeFromParent(entity)
			}
		}
	}

	public ShapeShift(handle: number, id: string) {
		if (!this.mEntityList[handle]) {
			return
		}
		let model = this.mEntityList[handle].m_Model
		if (!model) {
			return
		}
		model.SetReplaceBody(id)
	}

	public replyShapeShift(handle: number) {
		if (!this.mEntityList[handle]) {
			return
		}
		let model = this.mEntityList[handle].m_Model
		if (!model) {
			return
		}
		let BodyId = this.mEntityList[handle].m_Info.GetBodyId()
		model.SetReplaceBody(null)
	}


	public UpdateRole() {
		let handle = SubRoles.ins().GetRoleData().handle
		let role = this.mEntityList[handle]
		if (role) {
			role.UpdateInfo()
		}
	}

	public UpdateOtherRole(rsp: Sproto.sc_map_player_update_request) {
		let entity = this.mEntityList[rsp.id]
		if (!entity) {
			return
		}
		if (!rsp.player) {
			return
		}
		let info = entity.GetInfo() as EntityRole
		if (!info || info.type != EntityType.Role) {
			return
		}
		// 自己的角色
		if (info.handle == GameGlobal.actorModel.actorID) {
			// 九重天需要更新临时称号
			if (this.mFbType == UserFb.FB_TYPE_CLOUD_NINE) {
				let show = rsp.player.shows || []
				info.mTitle = show[RoleShowDataType.ROLE_TITLE] || 0
				entity.UpdateInfo()
			}
			return
		}

		let show = rsp.player.shows || []
		info.mBodyId = show[RoleShowDataType.ROLE_SKIN] || 0
        info.mRideId = show[RoleShowDataType.ROLE_RIDE] || 0
        info.mWingId = show[RoleShowDataType.ROLE_WING] || 0
        info.mTianxianId = show[RoleShowDataType.ROLE_TIANXIAN] || 0
        info.mSwordId = show[RoleShowDataType.ROLE_SWORD] || 0
        info.mTitle = show[RoleShowDataType.ROLE_TITLE] || 0
		entity.UpdateInfo()
	}
}