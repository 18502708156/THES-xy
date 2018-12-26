class BattleUnit {

	public mRaid: BattleMgr
	public mInfo: EntityData
	public mTeamIndex: number

	public mSkill: SUnitSkill[] = []
	public mBuffs: {[key: number]: BattleUnitBuff} = {}

	private action: BattleAtkAction

	public static Equal(lhs: BattleUnit, rhs: BattleUnit): boolean {
		if (!lhs || !rhs) {
			return false
		}
		return lhs.mInfo.handle == rhs.mInfo.handle
	}
		
	public Init(raid: BattleMgr, entityData: EntityData, teamIndex: number) {
		this.mRaid = raid
		this.mInfo = entityData
		this.mTeamIndex = teamIndex

		this.action = new BattleAtkAction
		this.action.Init(this)

		let ids = entityData.GetSkillIDs()
		this.mSkill = []
		let index = 0
		for (let id of ids) {
			if (id) {
				this.mSkill.push(new SUnitSkill(this, id))
			}
		}

		for (let skill of this.mSkill) {
			skill.Init()
		}
		this.mBuffs = {}
	}

	public IsDead(): boolean {
		return this.mInfo.getAtt(AttributeType.atHp) <= 0
	}

	public CanUseSkill(): boolean {
		return true
	}

	public CanBlock(): boolean {
		if (this.IsDead()) {
			return false
		}
		return true
	}

	public GetMaxHp(): number {
		return Math.floor(this.mInfo.getAtt(AttributeType.atMaxHp))
	}

	public IsTarget(): boolean {
		return !this.IsDead()
	}

	public Turn(turnDatas: BUnitAction[]) {
		if (this.IsDead()) {
			return
		}

		let data = this.action.Turn()
		if (data) {
			turnDatas.push(data)
		}
	}

	public Hit(type: DamageTypes, value: number, caster: BattleUnit): void {
		this.UpdateHp(value, caster)
	}

	public UpdateHp(value: number, caster: BattleUnit): void {
		let self = this
		if (self.IsDead()) {
			return
		}
		let nowHp = self.mInfo.getAtt(AttributeType.atHp) + value
		let maxHp = self.GetMaxHp()
		nowHp = nowHp > maxHp ? maxHp : nowHp
		nowHp = nowHp < 0 ? 0 : nowHp
		self.mInfo.setAtt(AttributeType.atHp, nowHp)
		if (nowHp <= 0) {
			this.mRaid.OnUnitDead(self.mInfo.handle)
		}
	}

	public TurnBuff(list: BUnitAction[]): void {
		for (let key in this.mBuffs) {
			let buff = this.mBuffs[key]
			if (!buff.Turn()) {
				this.RemoveBuff(list, Number(key))
			}
		}
	}

	public RemoveBuff(list: BUnitAction[], buffId: number): BUnitAction {
		let buff = this.mBuffs[buffId]
		if (!buff) {
			return
		}
		delete this.mBuffs[buffId]
		list.push(buff.OnRemove())
	}

	private CheckBuff(list: BUnitAction[], buffId: number) {
		let config = GameGlobal.Config.EffectsConfig[buffId]
		if (!config) {
			return
		}
		let groupId = config[GameGlobal.Config.EffectsConfig_keys.group]

		let removeList = []
		for (let key in this.mBuffs) {
			let buffConfig = GameGlobal.Config.EffectsConfig[Number(key)]
			if (!buffConfig) {
				continue
			}
			if (buffConfig[GameGlobal.Config.EffectsConfig_keys.group] == groupId) {
				removeList.push(Number(key))
			}
		}
		for (let id of removeList) {
			this.RemoveBuff(list, id)
		}
	}

	public AddBuffs(list: BUnitAction[], src: number, buffId: number[]) {
		for (let id of buffId) {
			this.AddBuff(list, src, id)
		}
		let tmpData = new BAddBuffAction
		tmpData.src = src
		tmpData.target = this.mInfo.handle
		tmpData.args = buffId
		list.push(tmpData)
	}

	private AddBuff(list: BUnitAction[], src: number, buffId: number) {
		let config = GameGlobal.Config.EffectsConfig[buffId]
		if (!config) {
			return
		}
		this.CheckBuff(list, buffId)

		let unitBuff = new BattleUnitBuff
		unitBuff.mTarget = this
		unitBuff.mBuffId = buffId
		unitBuff.mConfig = config
		unitBuff.mTurn = 0
		unitBuff.OnAdd()
		this.mBuffs[buffId] = unitBuff
	}
}