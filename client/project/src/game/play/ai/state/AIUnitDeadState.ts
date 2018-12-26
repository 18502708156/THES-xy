class AIUnitDeadState extends AIUnitState {
	public constructor() {
		super()
		this.mType = AIUnitStateType.Die
	}

	OnEnter(): void {
		GameGlobal.EntityEffMgr.UnbindByHandle(this.mUnit.mEntity.GetHandle())

		let entity = this.mUnit.mEntity
		let info = entity.GetInfo()
		let isFlash = false
		if (info && info.type == EntityType.Monster) {
			isFlash = Math.random() > 0.3
		} 
		if (isFlash) {
			this.mAction = [new AIUnitDeadFlash()]
		} else {
			this.mAction = [new AIUnitDeadKickOut()]
		}
		for (let action of this.mAction) {
			action.Init(this)
		}
		super.OnEnter()
	}

	OnExit(): void {
		
	}

	public static speed = 1.5
}