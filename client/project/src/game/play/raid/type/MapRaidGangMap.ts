class MapRaidGangMap extends CommonMapRaid {

	// private view: GangMapScieneWin

	private mCountMap = {}
	private mEntityMap = {}
	private mPosMap = {}
	private mRobotMap = {}
	private mMemberCount:number = 0
	private mAuto: boolean = false

	public constructor() {
		super()
	}

	public Init() {
		super.Init()

		GameGlobal.MessageCenter.addListener(MessageDef.GANGMAP_MAPENTITY_INIT, this.InitEntity, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GANGMAP_UPDATE_UPDATEENTITY, this.UpdateEntityInfo, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GANGMAP_AUTO_TASK, this.UpdateAutoTask, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GANGMAP_RESET_MAPENTITY, this._ResetMapEntity, this)

		this.CreateRobotList()
	}
	
	public Clear() {
		super.Clear()
		GameGlobal.MessageCenter.removeAll(this)
		TimerManager.ins().removeAll(this)

		GameGlobal.ViewManagerImpl.Destroy(GangMapScieneWin)
	}

	public OnEnter() {
		super.OnEnter()
		GameGlobal.ViewManagerImpl.Open(GangMapScieneWin)
	}

	public OnExit() {
		super.OnExit()
		GameGlobal.ViewManagerImpl.Close(GangMapScieneWin)
	}

	public InitEntity() {
		this._CalculateCount(GangMapConst.TYPE_MONSTER)
		this._CalculateCount(GangMapConst.TYPE_PLANT)
		this._CreateEntityList(GangMapConst.TYPE_MONSTER)
		this._CreateEntityList(GangMapConst.TYPE_PLANT)
	}

	public OnEntityClick(handle: number) {
		let pos = this._GetPosByHandle(handle)
		if (!pos)
			return

		GameGlobal.RaidMgr.mMapRaid.MoveOrder(handle, Const.PosToPixel(parseInt(pos[0])), Const.PosToPixel(parseInt(pos[1])))
	}

	public OnMoveLeval(orderId: number, handle: number, taget_x: number, taget_y: number) {
		let type = this.mEntityMap[orderId]
		let taskId = GangMapConst.GetGangMapTaskId(type)
		if (!taskId)
			return

		if (type == GangMapConst.TYPE_PLANT)
		{
			GameGlobal.GangMapModel.StartPickPlantNotice()
			let totalTime = GameGlobal.Config.GuildConfig.collectiontime
			TimerManager.ins().doTimer(totalTime * 1000, 1, () => {
				this.RemoveEntity(orderId)
				this._RemovePosRecord(orderId)
				this.mEntityMap[orderId] = null
				GameGlobal.GangMapModel.SendFinishTask(taskId)
			}, this)

			return
		}
		this.RemoveEntity(orderId)
		this._RemovePosRecord(orderId)
		this.mEntityMap[orderId] = null
		GameGlobal.GangMapModel.SendFinishTask(taskId)
	}

	public OnMapClick(localX: number, localY: number): boolean {
		GameGlobal.GangMapModel.HidePickProgressNoticy()
		TimerManager.ins().removeAll(this)
		return super.OnMapClick(localX, localY)
	}

	public UpdateEntityInfo() {
		this._UpdateMapEntity(GangMapConst.TYPE_MONSTER)
		this._UpdateMapEntity(GangMapConst.TYPE_PLANT)
		this._StartAutoTasks()
	}

	public UpdateAutoTask(auto) {
		this.mAuto = auto

		this._StartAutoTasks()
	}

	public _StartAutoTasks() {
		if (!this.mAuto)
			return

		if (this._StarAutoTask(GangMapConst.TYPE_MONSTER))
			return

		this._StarAutoTask(GangMapConst.TYPE_PLANT)
	}

	private _StarAutoTask(type) {
		let taskId = GangMapConst.GetGangMapTaskId(type)
		let handle
		if (!GameGlobal.GangMapModel.IsTaskDone(taskId))
		{
			handle = this._GetMapEntityHandle(type)
			if (handle)
			{
				this.OnEntityClick(handle)
				return true
			}
		}

		return false
	}

	private _UpdateMapEntity(type)
	{
		if (this._GetCurCountInMap(type) >= (this.mCountMap[type] || 0))
		{
			return
		}

		let taskId = GangMapConst.GetGangMapTaskId(type)
		if (GameGlobal.GangMapModel.IsTaskDone(taskId))
		{
			this._ResetMapEntity()
			return
		}
		this._CreateGMapEntity(type)
	}

	private _CalculateCount(type) {
		let taskId = GangMapConst.GetGangMapTaskId(type)
		if (GameGlobal.GangMapModel.IsTaskDone(taskId))
		{
			this.mCountMap[type] = 0
			return
		}

		let totalCount = GameGlobal.Config.GuildConfig.count
		if (type == GangMapConst.TYPE_MONSTER)
		{
			this.mCountMap[type] = Math.floor(Math.random() * (totalCount - 2)) + 1
		}
		else
		{
			this.mCountMap[type] = totalCount - this.mCountMap[GangMapConst.TYPE_MONSTER]
		}
	}

	private _CreateEntityList(type) {
		let count = this.mCountMap[type]
		for (let idx=0; idx<count; idx++)
		{
			this._CreateGMapEntity(type)
		}
	}

	private _CreateGMapEntity(type) {
		let monsterId = GangMapConst.GetGangMapEntityId(type)
		let pos = this._GetRandomPos()
		let entity
		let handle
		if (type == GangMapConst.TYPE_MONSTER)
		{
			entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(monsterId, Const.PosToPixel(pos.x), Const.PosToPixel(pos.y))
			entity.SetClick(false)
			handle = entity.GetHandle()
		}
		else
		{
			handle = GameGlobal.RaidMgr.mMapRaid.CreateImage(monsterId, Const.PosToPixel(pos.x)-80, Const.PosToPixel(pos.y)-160)
		}
		
		this.mEntityMap[handle] =  type
		let key = `${pos.x}_${pos.y}`
		this.mPosMap[key] = handle
	}

	private _GetRandomPos() {
		let pos: egret.Point = new egret.Point

		while (true)
		{
			let centerX = Math.floor(GameMap.COL/2)
			let centerY = Math.floor(GameMap.ROW/2)
			GameMap.GetRandomPos(centerX, centerY, centerX-2, centerY-2, pos)
			let key = `${pos.x}_${pos.y}`
			if (!this.mPosMap[key])
			{
				return pos
			}
		}
	}

	private _RemovePosRecord(handle: number) {
		for (let key in this.mPosMap)
		{
			if (this.mPosMap[key] == handle)
			{
				this.mPosMap[key] = null
				break
			}
		}
	}

	private _GetCurCountInMap(type) {
		let count = 0
		for (let key in this.mEntityMap)
		{
			if (this.mEntityMap[key] == type)
				count++
		}

		return count
	}

	private _ResetMapEntity() {
		for (let key in this.mEntityMap)
		{
			let handle = parseInt(key)
			this.RemoveEntity(handle)
		}

		this.mEntityMap = {}
		this.mCountMap = {}
		this.mPosMap = {}

		this._CalculateCount(GangMapConst.TYPE_MONSTER)
		this._CalculateCount(GangMapConst.TYPE_PLANT)
		this._CreateEntityList(GangMapConst.TYPE_MONSTER)
		this._CreateEntityList(GangMapConst.TYPE_PLANT)
	}

	private _GetMapEntityHandle(type) {
		for (let key in this.mEntityMap)
		{
			if (this.mEntityMap[key] == type)
			{
				return parseInt(key)
			}
		}
	}

	private _GetPosByHandle(handle) {
		for (let key in this.mPosMap) {
			if (this.mPosMap[key] == handle)
			{
				return key.split("_")
			}
		}
	}

	public CreateRole(player: Sproto.map_player): void {
		// 移动Id相同的机器人
		this.RemoveRobot(player.id)
		this.mMemberCount ++
		super.CreateRole(player)
	}

	public CreateRobotRole(player: Sproto.guild_map_shows): void {
		let list = []
		let entityRole = new EntityRole
		entityRole.parserBase({   
			ownerid: player.id,
			handler: player.id,
			type: EntityType.Role,
			shows: {
				job: player.job,
				sex: player.sex,
				shows: player.shows
			},
		} as Sproto.entity_data)
		entityRole.entityName = player.name;
		list.push(entityRole)
		this.AddRobotTeam(player.id, list)
	}

	public AddRobotTeam(handle: number, entityDatas: EntityData[]): void {
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
		let team = this.CreateRobotTeam()
		team.mMasterHandle = handle
		team.Init(list)
		this.cTeam[handle] = team;
		// this.mTeam.push(team)
	}

	protected CreateRobotTeam(): MoveTeam {
		return new NormalMoveTeam
	}

	public RemoveEntity(handle: number): boolean {
		if (!this.mEntityMap[handle] && !this.mRobotMap[handle])
			this.mMemberCount --

		return super.RemoveEntity(handle)
	}

	public RemoveRobot(playerId) {
		if (this.mRobotMap[playerId])
			this.RemoveEntity(playerId)

		this.mRobotMap[playerId] = null		
	}

	public CreateRobotList() {
		let robotList = GameGlobal.GangMapModel.mRobotList
		let curMemCount = this.mMemberCount
		for (let idx=curMemCount; idx<10; idx++)
		{
			let robotInfo = robotList[idx]
			if (!robotInfo)
				break
				
			if (!this.mRobotMap[robotInfo.id])
			{
				this.mRobotMap[robotInfo.id] = robotInfo.id
				this.CreateRobotRole(robotInfo)
			}
		}
	}
}