class BattleRaid extends Raid {

	// public static readonly QUICK_SPEED = 1.5

	public static readonly MAX_INDEX = 9999

	public mIsPlot = 0

	// 录像副本
	public mIsVideo = false
	// 手动副本
	public mIsManual = false

	public mEntityDatas: EntityData[][] = []
	public m_AllTurnData: BUnitAction[][] = []
	public m_TurnData: BUnitAction[] = []
	public m_TurnIndex: number = -1

	public mFinishAction: BattleFinishData;

	public m_TurnId: number = 0
	protected m_StartTime: number = 1

	public m_IsEnter = false

	// 战斗中boss对象
	public mBossHandle: number

	protected mNotShowBlood: boolean
	protected mBattlePanel: BaseEuiView

	public constructor() {
		super()
	}

	public GetSpeed(): number {
		return SystemSettingPanel.GetSpeed()
	}
	
	protected IsBackground(): boolean {
		return GameGlobal.RaidMgr.mShowType != RaidMgr.TYPE_NORMAL
	}

	public OnBackground() {
		if (this.mBattlePanel) {
			this.mBattlePanel.visible = false
		}
	}

	public OnForeground() {
		if (this.mBattlePanel) {
			this.mBattlePanel.visible = true
		}
	}

	public FinishBattle() {
		let data = this.m_TurnData[this.m_TurnIndex]
		if (data && data.mInit) {
			data.OnExit()
		}
		this.m_TurnIndex = -1
		this.m_AllTurnData = []
		if (!this.ExeFinishAction()) {
			console.error("not finish battle action !!!")
			GameGlobal.RaidMgr.EnterCurMapRaid()
		}
	}

	public FinishBattleAndReward() {
		let data = this.m_TurnData[this.m_TurnIndex]
		if (data && data.mInit) {
			data.OnExit()
		}
		this.m_TurnIndex = -1
		this.m_AllTurnData = []

		if (this.mFinishAction && this.mFinishAction.ret == 1) {
			UserTips.InfoTip("已跳过关卡战斗，奖励已进入背包")
			GameGlobal.RaidModel.SendGetBossReward()
		}
		GameGlobal.UserFb.sendExitFb()	
	}

	protected ShowBattleLayer() {
		// GameMap.GetBattleView().showMapBg(ResDataPath.ROOT + "image/battlemap/" + BattleMap.mMapId + ".jpg")
		GameMap.GetBattleView().ShowDefault()
	}

	public Create(entityData: EntityData) {
		entityData.team = this.CalcEntityTeam(entityData)

		let isDir = entityData.side == 2
		BattleCtrl.GetPos(isDir, entityData.posIndex, entityData)
		entityData.dir = isDir ? 7 : 3

		let entity = this.AddEntity(entityData)
		if (!this.mNotShowBlood) {
			entity.ShowBloodBar()
		}

		let ai = new RaidAIUnit
		entity.SetAI(ai)
		ai.UpdateBlood()
		GameMap.AddBattleEntity(entity)
		entity.SetPos(entityData.x, entityData.y)
	}

	private OnPlotEnd(plotId: number) {
		if (this.mIsPlot != plotId) {
			return
		}
		this.mIsPlot = null
		GameGlobal.MessageCenter.removeListener(MessageDef.PLOT_PLAY_END, this.OnPlotEnd, this)
		this.StartTurn()
	}

	OnEnter(): void {
		// if (BattleMap.mFbId) {
		// 	GameGlobal.RaidMgr.SetShowType(RaidMgr.TYPE_NORMAL)
		// }

		this.m_IsEnter = true
		GameGlobal.RaidMgr.UpdateBGM()

		let entitys = this.mEntityDatas

		let mySide
		for (let list of entitys) {
			for (let data of list) {
				if (data.masterHandle == GameGlobal.actorModel.actorID) {
					mySide = this.mMySide = data.side
					break
				}
			}
		}

		let setBossHandle = (data: EntityData) => {
			if (data.side != mySide && data.posIndex == 8) {
				this.mBossHandle = data.handle
			}
		}

		// 我的位置为1的时候，需要重新设置位置
		if (this.mMySide == 1) {
			let team1 = entitys[0]
			for (let data of team1) {
				data.side = 2
			}

			let team2 = entitys[1]
			for (let data of team2) {
				data.side = 1
			}
			let tmp = this.mEntityDatas[0]
			this.mEntityDatas[0] = this.mEntityDatas[1]
			this.mEntityDatas[1] = tmp
		}

		let team1 = entitys[0] || []
		for (let data of team1) {
			if (data.posIndex == -1) {
				continue
			}
			setBossHandle(data)
			this.Create(data)
		}

		let team2 = entitys[1] || []
		for (let data of team2) {
			if (data.posIndex == -1) {
				continue
			}
			setBossHandle(data)
			this.Create(data)
		}

		this.m_StartTime = AIConfig.START_TURN_WAIT_TIME

		let view = this.OpenBattlePanel()
		if (view) {
			this.mBattlePanel = view
			view.visible = this.IsBackground() ? false : true
		}
		this.ShowBattleLayer()

		if (BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS && GameGlobal.PlotModel.OnChapterBattleEnter(GameGlobal.UserFb.guanqiaID)) {
			GameGlobal.MessageCenter.addListener(MessageDef.PLOT_PLAY_END, this.OnPlotEnd, this)
			this.mIsPlot = GameGlobal.UserFb.guanqiaID
		}

		this.UpdateMonPlot()

		GameMap.GetBattleView().UpdateSort(true)
		this.StartTurn()
	}

	private UpdateMonPlot() {
		for (let key in this.mEntityList) {
			let entity = this.mEntityList[key]
			let info = entity.GetInfo()
			if (info && info.type == EntityType.Monster) {
				let plot = info.HasPlot()
				if (plot) {
					entity.SetPlot(plot)
					break
				}
			}
		}
	}

	protected OpenBattlePanel(): BaseEuiView {
		return ViewManager.ins().open(GameBattlePanel)
	}

	OnExit(): void {
		if (this.mBattlePanel) {
			ViewManager.ins().close(this.mBattlePanel)
			this.mBattlePanel = null
		}
		this.m_IsEnter = false
		GameMap.GetBattleView().Hide()
		this.RemoveAllEntity()
		this.mEntityDatas = []
		this.m_AllTurnData = []
		this.m_TurnData = []

		// 清理数据
		GameMap.ClearBattleView()
		this.ClearEntityEffMgr()

		GameGlobal.MessageCenter.removeAll(this)
	}

	protected ClearEntityEffMgr() {
		GameGlobal.EntityEffMgr.Clear(true)
	}

	public Update(deltaTime: number): void {
		let speed = 1
		if (!this.mIsManual) {
			speed = SystemSettingPanel.GetSpeed()
		}
		let delta = deltaTime * speed
		let list = this.mEntityList
		for (let k in list) {
			list[k].mAI.Update(delta)
		}

		if (this.mIsPlot) {
			return
		}

		if (this.m_StartTime > 0) {
			this.m_StartTime -= delta
			return
		}

		if (this.m_TurnIndex >= 0 && this.m_TurnIndex < this.m_TurnData.length) {
			let data = this.m_TurnData[this.m_TurnIndex]
			if (data) {
				if (!data.mInit) {
					data.Init(this)
					data.OnEnter()
					data.mInit = true
				}
				if (data.OnUpdate(delta) == AIUnitReturn.NEXT) {
					data.OnExit()
					++this.m_TurnIndex
				}
				if (!this.m_TurnData[this.m_TurnIndex]) {
					this.TurnFinish()
				}
			} else {
				this.TurnFinish()
			}
		}
	}

	public SetBattleData(entitys: EntityData[][]): void {
		this.mEntityDatas = entitys
	}

	public Turn(datas: BUnitAction[]): void {
		this.m_TurnData = datas
		this.m_TurnIndex = 0
		let data = this.m_TurnData[this.m_TurnIndex]
		if (data) {
		} else {
			console.error("not turn data !!!")
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.BATTLE_TURN_START)
	}

	/** 自动 */
	public TurnAll(datas: BUnitAction[][]): void {
		if (this.mIsManual) {
			return
		}
		this.m_AllTurnData = datas
		this.StartTurn()
	}

	private StartTurn(): void {
		if (this.mIsPlot) {
			return
		}
		if (!this.m_IsEnter) {
			return
		}
		if (this.mIsManual) {
			return
		}
		if (this.m_AllTurnData.length) {
			++this.m_TurnId
			let list = this.m_AllTurnData[0]
			this.m_AllTurnData.splice(0, 1)
			if (list) {
				this.Turn(list)
			}
			GameGlobal.MessageCenter.dispatch(MessageDef.BATTLE_TURN)
		} else {
			this.ExeFinishAction()
		}
	}

	public ExeFinishAction() {
		if (this.mFinishAction) {
			this.mFinishAction.Execute(this)
			this.mFinishAction = null
			return true
		}
		return false
	}

	public GetTurnId() {
		return this.m_TurnId
	}

	protected TurnFinish() {
		if (this.mIsManual) {
			// 回合结束，检查结果
			this.ExeFinishAction()
			GameSocket.ins().Rpc(C2sProtocol.cs_battle_play_finish)
		} else {
			this.StartTurn()
		}
	}

	public SetFinishAction(data: BattleFinishData) {
		this.mFinishAction = data
		// 如果是手动的，检测是否播放结果
		if (this.mIsManual && this.m_TurnData.length && this.m_TurnIndex >= this.m_TurnData.length) {
			this.ExeFinishAction()
		}
	}

	public SetManual(flag: boolean) {
		this.mIsManual = flag
	}

	// 开始手动释放技能
	public StartManual(time: number, entitySkill: Sproto.entity_skill[]) {
		++this.m_TurnId
		GameGlobal.MessageCenter.dispatch(MessageDef.BATTLE_TURN)
		if (this.mBattlePanel && egret.is(this.mBattlePanel, "GameBattlePanel")) {
			let panel = this.mBattlePanel as GameBattlePanel
			panel.StartManual(time, entitySkill)
		}
	}

	public SetAuto(isauto: boolean) {
		if (this.mBattlePanel && egret.is(this.mBattlePanel, "GameBattlePanel")) {
			let panel = this.mBattlePanel as GameBattlePanel
			panel.SetAuto(isauto)
		}
	}

	public UseSkill(list: GameBattleManualData[]) {
		let rsp = new Sproto.cs_battle_use_skill_request();
		rsp.use_skill_list = []

		for (let data of list) {
			let useData = new Sproto.use_skill_data
			useData.skillid = data.skillId
			useData.handler = data.handle
			useData.targets = data.targets
			rsp.use_skill_list.push(useData)
		}
		GameSocket.ins().Rpc(C2sProtocol.cs_battle_use_skill, rsp);
	}

	public SendSetAuto(isAuto: boolean) {
		let rsp = new Sproto.cs_battle_set_auto_request
		rsp.isauto = isAuto ? 1 : 0
		GameSocket.ins().Rpc(C2sProtocol.cs_battle_set_auto, rsp);
	}

	// 血量更新事件
	public OnEventDamage(handle: number) {
	}
}