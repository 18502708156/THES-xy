class RaidAIUnit extends AIUnit {

	public Init(entity: MapEntity): void {

		var addState = (state: AIUnitState) => {
			this.mStateList[state.mType] = state
		}
		addState(AIUnit.GetStandState(this))

		let dead = new AIUnitDeadState
		dead.Init(this)
		addState(dead)

		super.Init(entity)
		this.mCurState.OnEnter()
	}
}