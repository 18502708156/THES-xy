class MapRaidAcrossBoss extends CommonMapRaid {

	public mIsShowGuild: boolean = true
	protected m_HelpId = 20

	private view: AcrossBossSceneView
	private mBossHandle: number
	private mAcrossBossBox: {[key: number]: AcrossBossBox} = {}

	private mPreState: number
	public mSelList: boolean[] = []

	public constructor() {
		super()
	}

	public Init() {
		super.Init()
	}

	protected GetRebornData(): IRewardData {
		return GameGlobal.Config.KfBossBaseConfig.revivecost
	}

	public UpdateSel(index: number, list: boolean[]) {
		this.mSelList = list
		if (index == 0) {
			this.HideBoss()
		} else if (index == 2) {
			this.AutoChallenge()
		}
	}

	public OnEnter() {
		super.OnEnter()
		this.mPreState = GameGlobal.AcrossBossController.status
		let view = new AcrossBossSceneView(this)
		this.AddView(view)
		this.SetRebornCheckbox(view.checkBox3)
		GameGlobal.MessageCenter.addListener(MessageDef.KF_BOSS_BOX, this.UpdateBox, this)
		GameGlobal.MessageCenter.addListener(MessageDef.KF_BOSS_BOX_COLLENT, this.UpdateBoxBar, this)
		GameGlobal.MessageCenter.addListener(MessageDef.KF_BOSS_UPDATE_INFO, this.UpdateState, this)
		GameGlobal.MessageCenter.addListener(MessageDef.KF_BOSS_DEAD, this.UpdateDead, this)
		this.UpdateBox(true)
		this.UpdateBoxBar()

		let state = GameGlobal.AcrossBossController.status
		if (state == AcrossBossState.BOSS) {
			this.CreateBossModel()
		} else if (state == AcrossBossState.KILL) {
			this.RemoveBoss()
		}
		this.UpdateDead()
	}

	public Create(entityData: EntityData): MapEntity {
		let entity = super.Create(entityData)
		if (entity) { 
			entity.SetClick();
		}
		return entity
	}

	public GetEntityNameStyle(info: EntityData): string {
		return this.GetEntityNameStyleSvr(info)
	}

	public MoveOrder(orderId: number, localX: number, localY: number, offset: number = 0): boolean {
		let ret = super.MoveOrder(orderId, localX, localY, offset)
		// 有移动指令，有采集，取消采集
		let box = GameGlobal.AcrossBossController.mCollectNow
		for (let key in box) {
			for (let data of box[key]) {
				if (data.playerid == GameGlobal.actorModel.actorID) {
					GameGlobal.AcrossBossController.RemoveCollentBox()
					return ret
				}
			}
		}
		return ret
	}

	public OnExit() {
		super.OnExit()
		GameGlobal.MessageCenter.removeAll(this)
	}

	public Clear() {
		super.Clear()
		let bossBox = this.mAcrossBossBox
		for (let key in bossBox) {
			bossBox[key].DoRemoved()
			delete bossBox[key]
		}
		this.mAcrossBossBox = {}
		this.mBossHandle = 0
		GameGlobal.AcrossBossController.ClearData()
	}
	
	private UpdateState() {
		let state = GameGlobal.AcrossBossController.status
		
		if (this.mPreState < AcrossBossState.BOSS && state == AcrossBossState.BOSS) {
			this.CreateBossModel()
			this.AutoChallenge()
		} else if (state == AcrossBossState.KILL) {
			this.RemoveBoss()
		} 
		this.mPreState = state
	}

	private RemoveBoss() {
		if (this.mBossHandle) {
			this.RemoveEntity(this.mBossHandle)
			this.mBossHandle = null
		}
	}

	public CreateBossModel() {
		if (this.mBossHandle) {
			return
		}
		let config = GameGlobal.Config.KfBossBaseConfig
		let mons = this.CreateMonster(config.bossid, config.bossbron[0], config.bossbron[1])
		if (mons) {
			this.mBossHandle = mons.GetHandle()
			mons.SetClick()
			if (this.mSelList[0]) {
				mons.visible = false
			}
		}
	}

	// 角色点击之前的时间
	public OnPreEntityClick(handle: number): boolean {
		let entity = this.GetEntity(handle)
		if (entity && entity.m_Info && entity.m_Info.guildID == GameGlobal.actorModel.guildID) {
			UserTips.InfoTip("不能挑战同帮会玩家")
			return false
		}
		return true
	}

	public OnEntityClick(handle: number) {
		let entity = this.GetEntity(handle)
		if (!entity) {
			return
		}
		this.MoveOrder(handle, entity.x, entity.y)
	}

	public UpdateBox(notPlay: boolean = false) {
		let box = GameGlobal.AcrossBossController.mBox
		let bossBox = this.mAcrossBossBox
		for (let key in bossBox) {
			if (!box[key]) {
				bossBox[key].DoRemoved()
				delete bossBox[key]
			}
		}
		for (let key in box) {
			if (!bossBox[key]) {
				let item = bossBox[key] = new AcrossBossBox(box[key], GameGlobal.Config.KfBossBaseConfig.coltime)
				item.OnAdded(notPlay)
			}
		}
	}

	 
	/*移动事件结束回掉*/
	public OnMoveLeval(orderId: number, handle:number,taget_x:number,taget_y:number) {
		if (GameGlobal.actorModel.actorID != handle) {
			return
		}
		// 点击的是盒子
		let box = this.mAcrossBossBox[orderId]
		if (box) {
			GameGlobal.AcrossBossManage.sendCollectBox(orderId)
			return
		}
		// 点击boss
		if (this.mBossHandle == orderId) {
			GameGlobal.AcrossBossManage.sendChallenge(null)
			return
		}
		// 点击其它玩家
		let entity = this.GetEntity(orderId)
		if (entity) {
			GameGlobal.AcrossBossManage.sendChallenge(orderId)
			return
		}
	}

	// 我的采集时间
	private GetMyBoxBar(): number {
		let actorId = GameGlobal.actorModel.actorID
		let nows = GameGlobal.AcrossBossController.mCollectNow
		for (let key in nows) {
			for(let data of nows[key]) {
				if (data.playerid == actorId && data.time > GameServer.serverTime) {
					return data.time			
				}
			}
		}
		return null
	}

	public UpdateBoxBar() {
		let nows = GameGlobal.AcrossBossController.mCollectNow
		let boxs = this.mAcrossBossBox
		for (let id in boxs) {
			let box = boxs[id]
			if (!nows[id]) {
				box.RemoveBar()
				continue
			}
			box.ShowBars(nows[id])
		}
	}

	protected GetRebornYb(): IRewardData {
		return GameGlobal.Config.KfBossBaseConfig.revivecost
	}

	protected SendRelive(): void {
		GameGlobal.AcrossBossManage.sendRelive()
	}

	private UpdateDead() {
		let time = GameGlobal.AcrossBossController.GetDeadTime()
		if (time > 0) {
			this.ShowRebornView(time)
		} else {
			this.RemoveRebornView()
			this.AutoChallenge()
		}
	}

	// 自动挑战
	private AutoChallenge() {
		if (this.mSelList[2] && this.mBossHandle) {
			this.OnEntityClick(this.mBossHandle)
		}
	}

	private HideBoss() {
		let entity = this.GetEntity(this.mBossHandle)
		if (entity) {
			entity.visible = this.mSelList[0] ? false : true
		}
	}
}