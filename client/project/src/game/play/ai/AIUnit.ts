class AIUnit {
	private static TEMP_ARGS = new IAIUnitArgs

	public mEntity: MapEntity

	protected mStateList: { [key: string]: AIUnitState } = {}
	protected mCurState: AIUnitState
	protected mNextState: string

	public mBuffIds: { [key: number]: AIUnitBuff } = {}

	// 已经死亡
	public mIsDead: boolean = false

	protected mDelayAction: {
		mType: string,
		mDelay: number,
	}

	public GetRaid(): BattleRaid {
		return this.mEntity.mRaid as BattleRaid
	}

	public Init(entity: MapEntity): void {
		this.mEntity = entity
		this.mCurState = this.mStateList[AIUnitStateType.STAND]
		this.mNextState = null
		this.mIsDead = false
		this.mBuffIds = {}
	}

	public IsDead(): boolean {
		return this.mIsDead
	}

	public IsTarget(): boolean {
		return !this.IsDead()
	}

	// 添加buff
	public AddBuff(buffId: number) {
		if (!buffId) {
			return
		}
		let data = new AIUnitBuff
		data.mBuffId = buffId
		this.mBuffIds[buffId] = data
		let Config = data.GetEff()
		for (let data in Config) {
			let effConfig = Config[data]
			if (effConfig) {
				if (effConfig.effType == 2) {
					if (effConfig.type == 0) {
						GameGlobal.EntityEffMgr.PlayBecastBuff(effConfig, this.mEntity.GetHandle())
					} else {
						this.creatEff(buffId, effConfig.targetEff)
					}
				} else if (effConfig.effType == 3) {
					GameMap.GetBattleView().bloodLayer.ShowBuffEffText(this.mEntity.x, this.mEntity.y, effConfig.targetEff, effConfig.args)
				} else {
					console.warn("not impl buff effType => " + buffId, effConfig.effType)
				}
			} else {
				if (DEBUG) {
					console.log("not buff effConfig => " + buffId)
				}
			}
			if (DEBUG) {
				// console.log("add buff => " + buffId)
			}
		}
	}

	public creatEff(effId: number, effName: string) {
		let mc = new MovieClip
		mc.loadUrl(ResDataPath.GetSkillPath(effName), true, -1)
		mc.name = effId + ""
		this.mEntity.addBattleBuff(mc)
	}

	public Relive() {
		let info = this.mEntity.GetInfo()
		info.setAtt(AttributeType.atHp, info.getAtt(AttributeType.atMaxHp));
		this.UpdateBlood()
	}

	/**
	 *  移除buff
	 *  @param isclear 是否是净化
	 */
	public RemoveBuff(buffId: number, isclear: boolean = false) {
		if (isclear && this.mBuffIds[buffId]) {
			GameMap.GetBattleView().bloodLayer.ShowWord(this.mEntity.x, this.mEntity.y, 0)
		}
		let name = buffId + ""
		this.mEntity.removeBattleBuff(name)
		delete this.mBuffIds[buffId]
	}

	public BuffAct(type: number, value: number, isDie: boolean) {
		GameMap.GetBattleView().bloodLayer.ShowBuffAct(this.mEntity.x, this.mEntity.y, type, value)
		if (isDie) {
			this.Die(500)
		}
	}

	public ChangeHp(type: number, value: number, isDie: boolean): void {
		let info = this.mEntity.GetInfo()
		info.setAtt(AttributeType.atHp, info.getAtt(AttributeType.atHp) + value);
		this.UpdateBlood()

		GameMap.GetBattleView().bloodLayer.ShowBuffHp(this.mEntity.x, this.mEntity.y, type, value)

		if (isDie) {
			this.Die(500)
		}
	}

	public ClearOtherAnim() {
		this.mCurState.ClearOtherAnim()
	}

	// 闪避动画
	public Evade(damageData: DamageData): void {
		this.mCurState.PlayEvade()
		GameMap.EntityHpChange(damageData);
	}

	public Hit(damageData: DamageData, isDie: boolean): void {
		let info = this.mEntity.GetInfo()
		info.setAtt(AttributeType.atHp, info.getAtt(AttributeType.atHp) + damageData.value);

		let shake
		if (damageData.type == DamageTypes.CRIT) {
			shake = GameMap.CRIT_SHAKE
		}
		GameMap.EntityHpChange(damageData, shake);

		let hitRemain = this.mCurState.PlayHit()
		this.UpdateBlood()

		if (isDie) {
			this.Die(hitRemain)
		}

	}

	public Die(delay: number): void {
		this.mIsDead = true
		if (delay) {
			this.mDelayAction = {
				mType: AIUnitStateType.Die,
				mDelay: delay
			}
		} else {
			this.SetNextState(AIUnitStateType.Die)
		}
	}

	public UpdateBlood() {
		let info = this.mEntity.GetInfo()
		if (!info) {
			return;
		}
		let max = info.getAtt(AttributeType.atMaxHp)
		let cur = info.getAtt(AttributeType.atHp)
		this.mEntity.SetBarValue(cur, max)
	}

	public GetStateArgs(type: string): IAIUnitArgs {
		if (this.GetCurType() == type) {
			return this.GetState(type).mAIUnitArgs
		}
		return AIUnit.TEMP_ARGS
	}

	public GetState(type: string): AIUnitState {
		return this.mStateList[type]
	}

	public GetCurType(): AIUnitStateType {
		return this.mCurState.mType
	}

	public Update(delta: number) {
		if (!this.mCurState) {
			return
		}
		if (this.mNextState != null) {
			this.mCurState.mIsEnter = false
			this.mCurState.OnExit()
			this.mCurState = this.mStateList[this.mNextState]
			this.mNextState = null
		}
		if (!this.mCurState.mIsEnter) {
			this.mCurState.mIsEnter = true
			this.mCurState.OnEnter()
		}
		this.mCurState.OnUpdate(delta)
		if (this.mDelayAction) {
			if ((this.mDelayAction.mDelay -= delta) <= 0) {
				this.SetNextState(this.mDelayAction.mType)
				this.mDelayAction = null
			}
		}
	}

	public StateEndEvent(type: string): void {
		if (type == AIUnitStateType.Die) {
			return
		}
		this.SetNextState(AIUnitStateType.STAND)
		// this.mEntity.mRaid.StateEndEvent(this.mEntity.GetInfo().handle, type)
	}

	public SetNextState(aiType: string): void {
		if (this.GetCurType() == aiType) {
			return
		}
		this.mNextState = aiType
	}

	public StandPos(x: number, y: number): void {
		this.mEntity.SetPos(x, y)
		this.SetNextState(AIUnitStateType.STAND)
	}

	public MoveTo(x: number, y: number): void {
		let ai = this.mStateList[AIUnitStateType.RUN]
		ai.mAIUnitArgs.SetMovePos(x, y)
		this.SetNextState(AIUnitStateType.RUN)
	}

	public Protect(src: number, beSrc: number): void {
		let ai = this.mStateList[AIUnitStateType.PROTECT]
		ai.mAIUnitArgs.Protect(src, beSrc)
		this.SetNextState(AIUnitStateType.PROTECT)
	}

	public static GetStandState(unit: AIUnit): AIUnitState {
		let state = new AIUnitStandState
		state.Init(unit)
		return state
	}

	// public static GetBornState(unit: AIUnit): AIUnitState {
	// 	let state = new AIUnitState()
	// 	state.mType = AIUnitStateType.BORN
	// 	state.Init(unit)
	// 	return state
	// }
}