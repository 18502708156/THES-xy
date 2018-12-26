class BattleMgr {

	private m_EntityTeams: BattleUnit[][] = []
	private m_Entity: {[key: number]: BattleUnit} = {}
	private m_UseSkill: {[key: number]: GameBattleManualData} = {}

	private mOverData
	private m_StartTime: number = 1

	public mRaid: BattleRaid
	
	public Init(raid: BattleRaid) {
		this.mRaid = raid
	}

	public OnEnter() {
		this.mOverData = null
	}

	public Update(delta: number): void {
		if (this.m_StartTime > 0) {
			if ((this.m_StartTime -= delta) <= 0) {
				this.StartTurn()
			}
		}
	}

	public OnExit(): void {
		this.m_EntityTeams = []
		this.m_Entity = []
	}

	public UseSkill(datas: GameBattleManualData[]) {
		let dict = this.m_UseSkill = {}
		for (let data of datas) {
			dict[data.handle] = data
		}
		this.ManualTurn()
	}
	// public GetUnit(handle: number): IBattleUnit {
	// 	return this.m_Entity[handle]
	// }

	public GetRaidUnit(handle: number): BattleUnit {
		return this.m_Entity[handle]
	}

	public SetBattleData(list: EntityData[][]): void {
		for (let datas of list) {
			let list = []
			for (let data of datas) {
				let cls = Util.GetClass(data)
				let role = new cls
				CommonUtils.CopyTo(data, role)
				let unit = new BattleUnit
				unit.Init(this, role, this.m_EntityTeams.length)
				this.m_Entity[unit.mInfo.handle] = unit
				list.push(unit)
			}
			this.m_EntityTeams.push(list)
		}
		this.m_StartTime = 5
	}

	public OnUnitDead(handle: number): void {
		this.m_Check = true
	}

	public OnAttack(unit: BattleUnit): BattleUnit {
		let units = this.m_EntityTeams[unit.mTeamIndex]
		for (let data of units) {
			if (BattleUnit.Equal(data, unit)) {
				continue
			}
			if (data.CanBlock()) {
				return data
			}
		}
		return null
	}
	
	private GetEntityTargetList(entitys: BattleUnit[]): number[] {
		let list = []
		for (let entity of entitys) {
			if (!entity.IsTarget()) {
				continue
			}
			list.push(entity.mInfo.handle)
		}
		return list
	}

	public GetAllEmemyList(teamIndex: number): number[] {
		let entitys = this.m_EntityTeams[(teamIndex + 1) % 2]
		return this.GetEntityTargetList(entitys)
	}

	public GetAllFriendlyList(teamIndex: number): number[] {
		let entitys = this.m_EntityTeams[teamIndex]
		return this.GetEntityTargetList(entitys)
	}

	private StartTurn() {
		if (this.mRaid.mIsManual) {
			this.mRaid.StartManual(15, null)
		} else {
			this.AutoTurn()
		}
	}

	private AutoTurn() {
		let list: BUnitAction[][] = []
		let overData = null
		for (let i = 0; i < 99; ++i) {
			let turnData: BUnitAction[] = []
			overData = this.Turn(turnData)
			if (turnData && turnData.length) {
				list.push(turnData)
			} else {
				break
			}
			if (overData) {
				break
			}
		}
		if (overData) {
			this.mOverData = overData
		} else {
			console.error("not over data")
		}
		this.mRaid.TurnAll(list)
		this.mRaid.SetFinishAction(overData)
	}

	// 客户端一回合执行结束
	public TurnExecuteFinish() {
		// 没有结束，通知副本选择技能
		if (!this.mOverData) {
			this.mRaid.StartManual(15, null)
		}
	}

	private ManualTurn() {
		let turnData: BUnitAction[] = []
		let overData = this.Turn(turnData)
		if (turnData && turnData.length) {
			this.mRaid.Turn(turnData)
		}
		if (overData) {
			this.mOverData = overData
			this.mRaid.SetFinishAction(overData)
		}
	}

	private Turn(turnData: BUnitAction[]): BattleNormalFinishData {
		turnData.push(new BTurnStartAction())

		let speed: BattleUnit[][] = []
		for (let datas of this.m_EntityTeams) {
			speed.push(datas)
		}
		speed.sort(function(lhs: BattleUnit[], rhs: BattleUnit[]) {
			let s1 = 0
			for (let d of lhs) {
				s1 += d.mInfo.getAtt(AttributeType.atSpeed)
			}
			let s2 = 0
			for (let d of rhs) {
				s2 += d.mInfo.getAtt(AttributeType.atSpeed)
			}
			return s2 - s1
		})

		for (let datas of speed) {
			datas.sort(function(lhs, rhs) {
				return rhs.mInfo.getAtt(AttributeType.atSpeed) - lhs.mInfo.getAtt(AttributeType.atSpeed)
			})
			for (let data of datas) {
				data.TurnBuff(turnData)
			}
			for (let data of datas) {
				data.Turn(turnData)
				let retData = this.UnitCheckDead(turnData)
				if (retData) {
					return retData
				}
			}
		}
		return null
	}

	private m_Check = false

	private UnitCheckDead(turnData: BUnitAction[]): BattleNormalFinishData {
		if (!this.m_Check) {
			return null
		}
		this.m_Check = false
		for (let i = 0; i < this.m_EntityTeams.length; ++i) {
			let datas = this.m_EntityTeams[i]
			let has = false
			for (let data of datas) {
				if (!data.IsDead()) {
					has = true
					break
				}
			}
			if (!has) {
				let data = new BattleNormalFinishData
				data.isWin = i == 0 ? true : false
				return data
			}
		}
		return null
	}
}