class BUnitAtkAction  extends BUnitAction {

	private skillId: number
	private event: BUnitAction[][]
	private m_Triggers: any[] = []
	private m_TriggerIndex = 0

	private m_SkillEffConfig: any

	public mRaid: BattleRaid
	public mSelf: MapEntity

	public static Create(raid: BattleRaid, src: MapEntity, skillId: number, event: BUnitAction[][]): BUnitAtkAction {
		let action = new BUnitAtkAction
		action.mRaid = raid
		action.mSelf = src
		action.skillId = skillId
		action.event = event
		action.m_SkillEffConfig = SkillsConfig.GetSkillEffConfig(skillId)
		return action 
	}

	OnEnter(): void {
		this.InitTriggerList()
		super.OnEnter()
	}

	OnExit(): void {
		super.OnExit()
		if (this.mSelf) {
			this.mSelf.UpdateAction(EntityClipType.STAND, false)
		}
		this.event = [[]]
		this.m_Triggers = []
	}

	public OnUpdate(delta: number): AIUnitReturn {
		let triggerData = this.m_Triggers[this.m_TriggerIndex]
		if (triggerData) {
			if (triggerData.time >= 0) {
				if ((triggerData.time -= delta) > 0) {
					return AIUnitReturn.CONTINUE
				}
			}
			if (triggerData.event) {
				// true 继续执行
				if (triggerData.event.call(this, delta, triggerData.data)) {
					return AIUnitReturn.CONTINUE
				}
			}
			if (++this.m_TriggerIndex >= this.m_Triggers.length) {
				return AIUnitReturn.NEXT 
			} 
			return AIUnitReturn.CONTINUE
		}
		return AIUnitReturn.NEXT 
	}

	private ExeAction(val: BUnitAction): void {
		if (val.mType == BattleTurnDataParse.TYPE_ACTIONHP) {
			this.DamageFunc(val as BattleDamageBaseData)
		} else {
			val.Execute(this.mRaid)
			if (val.mType == BattleTurnDataParse.TYPE_REMOVEBUFF) {
			} else if (val.mType == BattleTurnDataParse.TYPE_ACTIONBUFF) {
			} else if (val.mType == BattleTurnDataParse.TYPE_BUFFSTATUSHP) {
			} else {
				console.error("not impl DamageFunc type => " + val.mType)
			}
		}
	}

	private ExecuteFunc(delta: number, data: BUnitAction[]): void {
		if (!data) {
			return
		}
		let raid = this.mRaid
		for (let val of data) {
			this.ExeAction(val)
		}
	}

	private DelayExecuteFunc(delta: number, data: BUnitAtkDelayExeData): boolean {
		if (data.index >= data.data.length) {
			return false
		}
		if (data.time < 125) {
			data.time += delta
			return true
		}
		data.time = 0
		this.ExeAction(data.data[data.index++])
		if (data.index >= data.data.length) {
			return false
		}
		return true
	}

	private PreExecuteFunc(data: BUnitAction[]): boolean {
		if (!data) {
			return
		}
		let pos = this.m_SkillEffConfig ? this.m_SkillEffConfig.becastPos : SkillsConfig.BECAST_TYPE.TYPE_0
		if (pos != SkillsConfig.BECAST_TYPE.TYPE_1) {
			return
		}
		let raid = this.mRaid
		for (let val of data) {
			let d = val as BattleDamageBaseData
			let target = this.mRaid.GetEntity(d.target)
			if (!target) {
				continue
			}
			GameGlobal.EntityEffMgr.PlayEffByPos(this.m_SkillEffConfig, target.x, target.y)
		}
	}

	private DamageFunc(d: BattleDamageBaseData): void {
		let target = this.mRaid.GetEntity(d.target)
		if (!target) {
			return
		}
		let data = DamageData.Set(target.GetInfo().team, target.x, target.y, d.type, d.value, this.skillId)
		if (d.type == DamageTypes.Evade) {
			target.mAI.Evade(data)
		} else {
			target.mAI.Hit(data, d.HasDead())
			let info = target.GetInfo()
			if (info) {
				if (this.m_SkillEffConfig && this.m_SkillEffConfig.becastPos != SkillsConfig.BECAST_TYPE.TYPE_1) {
					GameGlobal.EntityEffMgr.PlayBecastEff(this.m_SkillEffConfig, d.target, info.x, info.y, target.GetDir())
				}
				this.mRaid.OnEventDamage(info.handle)
			}
		}
	}

	private InitTriggerList(): void {
		this.m_Triggers = []
		this.m_TriggerIndex = 0
		let list = []
		if (this.event.length > 0) {
			list[0] = {time: 0, event: this.PlayFunc, data: null}
			let gap = 30
			let t = -gap
			for (let data of this.event) {
				t += gap
				let animId = this.m_SkillEffConfig.animId
				if (animId == 100) {
					let funcData = new BUnitAtkDelayExeData
					funcData.data = data || []
					funcData.index = 0
					funcData.time = 0
					list.push({time: gap, event: this.DelayExecuteFunc, data: funcData})
				} else {
					list.push({time: gap, event: this.ExecuteFunc, data: data})
				}
			}
			list[1].time = AIConfig.HIT_TIME
			list.push({time: Math.max(AIConfig.HIT_RESET_TIME - t, 0), event: null, data: null})
		}
		this.m_Triggers = list
	}

	private PlayFunc(): void {
		let skillEffConfig = this.m_SkillEffConfig
		if (!skillEffConfig) {
			console.warn("not skilleff config => " + this.skillId)
			return
		}
		this.mSelf.mAI.ClearOtherAnim()
		this.mSelf.ReplayAction(EntityClipType.ATTACK, true)
		if (this.event && this.event[0]) {
			this.PreExecuteFunc(this.event[0])
		}
		GameGlobal.EntityEffMgr.PlayCastSkillEff(skillEffConfig, this.mSelf)
	}
}

class BUnitAtkDelayExeData {
	data: BUnitAction[]
	index: number
	time: number
}