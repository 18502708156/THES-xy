class AIUnitProtectState extends AIUnitState {
	public constructor() {
		super()
		this.mType = AIUnitStateType.PROTECT
	}

	public PlayHit(): number {
		(this.mAction[1] as AIUnitWaitAction).mWait = false
		let action = this.mAction[2] as AIUnitHitAction
		if (action) {
			return action.mHit || 0
		}
	}

	OnEnter(): void {
        let raid = this.mUnit.mEntity.mRaid
		let unit = raid.GetEntity(this.mAIUnitArgs.mBlockSrc)
        let target = raid.GetEntity(this.mAIUnitArgs.mBeBlockSrc)
        this.mAction = [
            AIUnitJumpAction.CreateByBlock(target, unit.mAI),
			new AIUnitWaitAction,
			new AIUnitHitAction,
            AIUnitJumpAction.Create(unit.x, unit.y)
        ]
		for (let action of this.mAction) {
			action.Init(this)
		}
		super.OnEnter()
	}

	OnExit(): void {
		
	}
}