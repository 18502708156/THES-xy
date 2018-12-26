class MapRaidCity extends CommonMapRaid {

	private mWorshipModel: MapNpcEntity
	private mIsOpen = false

	private mTheFirstHandle: number
	private mTheTipHandle: number
	private mNpcMap: {[key: number]: number} = {}

	// 主城创建角色时间间隔
	protected m_CreateGapSetting = 0.2

	public constructor() {
		super()
	}

	protected IsBackground(): boolean {
		return GameGlobal.RaidMgr.mShowType != RaidMgr.TYPE_CITY
	}

	protected DoEnter() {
		this.OnOpen()
	}

	protected DoExit() {
		// 重写
	}

	protected OnShowView() {
		// 重写
	}

	protected OnHideView() {
		// 重写
	}

	public OnBackground() {
		super.OnBackground()
		ViewManager.ins().close(GameCityPanel)
		GameGlobal.MessageCenter.removeAll(this)
		this.mIsOpen = false
	}

	public OnForeground() {
		super.OnForeground()
		this.OnOpen()
	}

	private OnOpen() {
		if (this.mIsOpen) {
			return
		}
		this.mIsOpen = true
		ViewManager.ins().open(GameCityPanel)
		GameGlobal.MessageCenter.addListener(MessageDef.MAIN_CITY_INFO, this._UpdateInfo, this)
		this._UpdateInfo()
	}

	protected GetMapEntityView() {
		return GameMap.GetMap().mCityEntityView
	}

	private _UpdateInfo() {
		this.CreateNpcList()

		let info = GameGlobal.CommonRaidModel.mMainCityInfo
		if (info && info.championid == 0) {
			let pos = GameGlobal.Config.CityBaseConfig.onepos
			this.mTheTipHandle = this.CreateImage("ui_zjm_bm_zhanlidiyi", pos[0]-85, pos[1]-90)
		}

		if (!info || !info.championid || !info.shows) {
			return
		}
		info.shows.shows[RoleShowDataType.ROLE_TITLE] = 1902
		if (!this.mWorshipModel) {
			let data = new MapNpcEntity
			let entityRole = new EntityRole
			entityRole.parserBase({
				shows: info.shows
			} as any)
			data.UpdateInfo(entityRole)
			let pos = GameGlobal.Config.CityBaseConfig.onepos
			this.mTheFirstHandle = this.CreateObject(data, pos[0], pos[1])	
			data.SetDir(5)
			data.UpdateAction(EntityClipType.STAND, false)
			this.mWorshipModel = data
		} else {
			let entityRole = new EntityRole
			entityRole.parserBase({
				shows: info.shows
			} as any)
			this.mWorshipModel.UpdateInfo(entityRole)
		}
	}

	public Create(entityData: EntityData): MapEntity {
		let entity = super.Create(entityData)
		if (entity) { 
			entity.SetClick(false)
		}
		return entity
	}

	public OnEntityClick(handle: number) {
		if (handle == this.mTheTipHandle)
		{
			UserTips.ins().showTips("全服战力第一，每天24:00刷新")
			return
		}
		if (handle == this.mTheFirstHandle)
		{
			ViewManager.ins().open(TheFirstPlayerTipWin)
			return
		}

		let npcId = this.GetNpcId(handle)
		if (npcId != -1)
		{
			ViewManager.ins().open(NpcDialogPopWin, npcId)
			return
		}
		
		let entity = this.GetEntity(handle)
		this.OnMapClick(entity.$getX(), entity.$getY())
		GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_VIEW_ONCITYMAP, handle)
		GameGlobal.PlayerInfoModel.sendOtherId(handle)
	}

	public CreateNpcList() {
		for (let key in GameGlobal.Config.CityNpcConfig)
		{
			let config = GameGlobal.Config.CityNpcConfig[key]
			if (!this.mNpcMap[config.id])
			{
				let entity = this.CreateMonster(config.npcid, config.npcpos[0], config.npcpos[1])
				this.mNpcMap[config.id] = entity.GetHandle()
			}
		}
	}

	public GetNpcId(handle) {
		for (let key in this.mNpcMap)
		{
			if (this.mNpcMap[key] == handle)
				return parseInt(key)
		}

		return -1
	} 

	public RemoveAllEntity() {
		super.RemoveAllEntity()
		this.mNpcMap = {}
	}
}