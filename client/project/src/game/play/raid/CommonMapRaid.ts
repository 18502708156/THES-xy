class CommonMapRaid extends MapRaid {

	protected m_RebornCheckbox: eui.CheckBox
	protected m_IsAutoReborn: boolean = false

	protected m_CreateGapSetting = 0.07
	private m_CreateGap = 0
	private m_CreatePlayerList: Sproto.map_player[]

	protected m_HelpId: number

	public constructor() {
		super()
	}

	public GetSceneId(): number {
		return GameGlobal.Config.MapConfig[this.mMapId].scenes[0]
	}

	/**
	 * 向场景界面添加一个视图
	 */
	public AddView(view: BaseView) {
		let panel = this.GetGameMapPanel()
		if (!panel) {
			console.error("not GameMapPanel !!!")
			return
		}
		panel.AddChildBaseView(view)
	}

	public OnBackground() {
		super.OnBackground()
		this.OnHideView()
	}

	public OnForeground() {
		super.OnForeground()
		this.OnShowView()
	}

	public Clear() {
		super.Clear()
		this.m_CreateGap = 0
		this.m_CreatePlayerList = null
	}

	protected OnShowView() {
		LayerManager.UI_GAME_MAP.visible = true
	}

	protected OnHideView() {
		LayerManager.UI_GAME_MAP.visible = false
	}

	public SetSelectEntity(handle: number): void {
		let panel = this.GetGameMapPanel()
		if (panel) {
			panel.SetSelect(handle)
		}
	}

	public ClearSelectEntity(handle: number): void {
		let panel = this.GetGameMapPanel()
		if (panel) {
			panel.ClearSelectEntity(handle)
		}
	}

	public IsIsAutoReborn(): boolean {
		return this.m_IsAutoReborn
	}

	/** 设置状态 */
	public SetCheckState(state: boolean) {
		this.m_IsAutoReborn = state
		if (this.m_RebornCheckbox) {
			this.m_RebornCheckbox.selected = state
		}
	}

	/** 设置自动复活的复选框 */
	protected SetRebornCheckbox(box: eui.CheckBox) {
		if (!box) {
			return
		}
		if (this.m_RebornCheckbox) {
			this.m_RebornCheckbox.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickReborn, this)
			this.m_RebornCheckbox = null
		}
		this.m_RebornCheckbox = box
		this.m_RebornCheckbox.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickReborn, this)
	}

	/** 复选框点击事件 */
	protected _OnClickReborn() {
		if (!this.m_RebornCheckbox) {
			return
		}
		let ybData = this.GetRebornYb()
		if (!ybData) {
			console.error("没有设置复活消耗数据")
			return
		}
		if (!this.m_RebornCheckbox.selected) {
			this.SetCheckState(false)
			UserTips.ins().showTips("已取消挑战中自动复活");
			return
		}
		let str = MoneyConstToName[ybData.id]
		let count = ybData.count
		WarnWin.show("确定要在被击败时自动复活吗？<font color='#019704'>\n每次复活将消耗" + count + str + "</font>", () => {
			if (!this.m_RebornCheckbox) {
				return
			}
			if (Checker.Money(ybData.id, ybData.count)) {
				UserTips.ins().showTips("已开启挑战中自动复活");
				this.SetCheckState(true)
			} else {
				this.SetCheckState(false)
			}
		}, this, () => {
			this.SetCheckState(false)
		}, this);
	}

	/** 复活消耗 */
	protected GetRebornYb(): IRewardData {
		return null
	}

	/** 复活方法 */
	protected SendRelive(): void {
	}

	/**
	 * 显示复活界面
	 * @param time 	复活时间
	 */
	public ShowRebornView(time: number): void {
		let data = this.GetRebornYb()
		if (!data) {
			console.error("没有设置复活消耗数据")
			return
		}
		if (this.m_IsAutoReborn) {
			if (Checker.Money(data.id, data.count)) {
				this.SendRelive()
				return
			} else {
				this.SetCheckState(false)
			}
		}
		let panel = this.GetGameMapPanel()
		if (!panel) {
			console.error("not GameMapPanel !!!")
			return
		}
		panel.ShowRebornView(time, data, () => {
			this.SendRelive()
		})
	}

	public RemoveRebornView() {
		let panel = this.GetGameMapPanel()
		if (!panel) {
			return
		}
		panel.RemoveRebornView()
	}

	protected GetGameMapPanel(): GameMapPanel {
		let panel = ViewManager.ins().getView(GameMapPanel) as GameMapPanel
		if (!panel) {
			return
		}
		return panel
	}

	public Update(delta: number): void {
		super.Update(delta)
		if (this.m_CreatePlayerList) {
			if ((this.m_CreateGap += delta) >= this.m_CreateGapSetting) {
				this.m_CreateGap = 0
				let data = this.m_CreatePlayerList.pop()
				if (data) {
					this.CreateRole(data)
				}
				if (!this.m_CreatePlayerList.length) {
					this.m_CreatePlayerList = null
					this.m_CreateGap = 0
				}
			}
		}
	}

	public OnEnter() {
		super.OnEnter()
		this.DoEnter()
	}

	public OnExit() {
		super.OnExit()
		this.DoExit()
	}

	protected DoEnter() {
		let view = ViewManager.ins().open(GameMapPanel) as GameMapPanel
		view.mRaid = this
		view.visible = this.IsBackground() ? false : true
		LayerManager.UI_GAME_MAP.visible = view.visible
		view.SetHelpId(this.m_HelpId)
	}

	protected DoExit() {
		ViewManager.ins().close(GameMapPanel)
		if (this.m_RebornCheckbox) {
			this.m_RebornCheckbox.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickReborn, this)
			this.m_RebornCheckbox = null
		}
	}

	protected GetMyTeam(): MoveTeam {
		return this.cTeam[GameGlobal.actorModel.actorID]
	}

	public OnMapClick(localX: number, localY: number): boolean {
		let ret = super.OnMapClick(localX, localY)
		if (ret) {
			GameGlobal.CommonRaidModel._MapMove(this.mMapId, localX, localY);
			GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST)
		}
		return ret
	}

	/**
	 * 其它玩家的移动
	 */
	public OtherMoveTo(handle: number, localX: number, localY: number) {
		if (!this.cTeam[handle] || handle == GameGlobal.actorModel.actorID) {
			return
		}
		this.cTeam[handle].MoveTo(MoveTeam.NONE_ORDER, localX, localY, 0, this.IsBackground())
	}

	public FlyTo(handle: number, localX: number, localY: number) {
		if (!this.cTeam[handle]) {
			return
		}
		this.cTeam[handle].FlyTo(localX, localY)
	}

	public CreateMyRole(player: Sproto.map_player): void {
		let list = []
		let entityRole = new EntityRole
		entityRole.parserBase({
			ownerid: player.id,
			handler: player.id,
			type: EntityType.Role,
			shows: {
				job: player.job,
				sex: player.sex,
				shows: player.shows,
				serverid: player.serverid,
				guildname: player.guildname,
				guildid: player.guildid,
			},
		} as Sproto.entity_data)
		entityRole.x = Const.PosToPixel(player.x)
		entityRole.y = Const.PosToPixel(player.y);
		entityRole.entityName = player.name;
		list.push(entityRole)
		this.AddTeam(player.id, list)
	}

	public CreateRoleList(players: Sproto.map_player[]): void {
		this.m_CreatePlayerList = players || []
		this.m_CreateGap = 0
	}

	public CreateRole(player: Sproto.map_player): void {
		let list = []
		let entityRole = new EntityRole
		entityRole.parserBase({
			ownerid: player.id,
			handler: player.id,
			type: EntityType.Role,
			shows: {
				job: player.job,
				sex: player.sex,
				shows: player.shows,
				serverid: player.serverid,
				guildname: player.guildname,
				guildid: player.guildid,
			},
		} as Sproto.entity_data)
		entityRole.x = player.x;
		entityRole.y = player.y;
		entityRole.entityName = player.name;
		list.push(entityRole)
		this.AddTeam(player.id, list)
	}

	public CreateMyShapeShiftRole() {

	}

	protected CreateTeam(): MoveTeam {
		return new CommonMoveTeam
	}

	public RemoveEntity(handle: number): boolean {
		let entity = this.mEntityList[handle]
		if (entity) {
			let teamHandle = entity.mTeamHandle
			if (teamHandle) {
				let team = this.cTeam[teamHandle]
				if (team) {
					team.RemoveMem(handle)
					if (team.mMember.length < 1) {
						this.DismissTeam(teamHandle)
					}
				} else {
					delete this.cTeam[teamHandle]
				}
			}
		}
		return super.RemoveEntity(handle)
	}

	protected GetTeamModel(): TeamBaseModel {
		return null
	}

	public DelayUpdateTeam() {
		let teamModel = this.GetTeamModel()
		if (!teamModel) {
			return
		}
		TimerManager.ins().doTimer(400, 1, this.UpdateTeam, this)
	}

	public UpdateTeam() {
		let teamModel = this.GetTeamModel()
		if (!teamModel) {
			return
		}
		let entityList = {}
		for (let key in this.mEntityList) {
			entityList[Number(key)] = true
		}
		let teamList = {}
		for (let key in this.cTeam) {
			teamList[Number(key)] = true
		}
		let data: {[key: number]: number[]} = teamModel.GetAllTeam()
		for (let key in teamList) {
			// 已经不存在的队伍，清除数据
			if (!data[key]) {
				this.DismissTeam(Number(key))
			}
		}
		for (let key in data) {
			let teamId = Number(key)
			let memIds = data[key]
			for (let id of memIds) {
				if (entityList[id]) {
					delete entityList[id]
				}
			}
			if (this.cTeam[teamId]) {
				this.UpdateTeamEntityList(teamId, memIds)
			} else {
				let list = []
				for (let id of memIds) {
					let entity = this.GetEntity(id)
					if (entity) {
						list.push(entity)
					}
					this.CreateTeamData(teamId, list)
				}
			}
		}
		// 给不存在队伍的对象一个自己的队伍
		for (let id in entityList) {
			let handle = Number(id)
			let entity = this.GetEntity(handle)
			if (entity) {
				this.CreateTeamData(handle, [entity])
			}
		}
	}

	private UpdateTeamEntityList(teamId: number, memIds: number[]) {
		let team = this.cTeam[teamId]
		if (!team) {
			return
		}
		let memKeys = {}
		for (let id of memIds) {
			memKeys[id] = true
		}
		let memHandle = {}
		for (let mem of team.mMember) {
			if (mem.mTarget) {
				memHandle[mem.mTarget.GetHandle()] = true
			}
		}
		for (let key in memHandle) {
			let handle = Number(key)
			if (!memKeys[handle]) {
				team.RemoveMem(handle)
			}
		}
		for (let key in memKeys) {
			let handle = Number(key)
			if (!memHandle[handle]) {
				let entity = this.GetEntity(handle)
				if (entity) {
					if (entity.mTeamHandle) {
						let oldTeam = this.cTeam[entity.mTeamHandle]
						if (oldTeam) {
							oldTeam.RemoveMem(handle)
						}
					}
					team.AddEntity(entity)
				}
			}
		}
	}
}

