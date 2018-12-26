class AIUnitStandState extends AIUnitState {
	public constructor() {
		super()
		this.mType = AIUnitStateType.STAND
	}

	private m_Play: AIUnitAction

	private m_Evade: AIUnitEvadeAction
	private m_Hit: AIUnitHitAction

	public PlayHit(): number {
		if (this.m_Play) {
			if (!egret.is(this.m_Play, "AIUnitHitAction")) {
				this.m_Play.OnExit()
				this.m_Play = null
			}
		}
		let play: AIUnitHitAction = this.m_Play as any
		if (!play) {
			if (!this.m_Hit) {
				this.m_Hit = new AIUnitHitAction
				this.m_Hit.Init(this)
			}
			play = this.m_Hit
			play.OnEnter()
			this.m_Play = play
		}
		return play.mHit
	}

	public PlayEvade(): number {
		if (!this.m_Play) {
			if (!this.m_Evade) {
				this.m_Evade = new AIUnitEvadeAction
				this.m_Evade.Init(this)
			}
			this.m_Play = this.m_Evade
			this.m_Play.OnEnter()
		}
		return 0
	}

	public ClearOtherAnim() {
		if (this.m_Play) {
			this.m_Play.OnExit()
			this.m_Play = null
		}
	}

	OnEnter(): void {
		super.OnEnter()
		this.mUnit.mEntity.UpdateAction(EntityClipType.STAND, false)
	}

	OnUpdate(delta: number): void {
		if (this.m_Play) {
			if (this.m_Play.OnUpdate(delta) == AIUnitReturn.NEXT) {
				this.m_Play.OnExit()
				this.m_Play = null
			}
		}
	}


	OnExit(): void {
		
	}
}