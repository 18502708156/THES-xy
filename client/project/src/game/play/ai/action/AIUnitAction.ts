enum AIUnitReturn {
	CONTINUE,
	NEXT,
	BREAK,
}

class AIUnitAction {

	protected static POOL: AIUnitAction[] = []
	
	protected m_UnitState: AIUnitState

	public GetUnit(): AIUnit {
		return this.m_UnitState.mUnit
	}

	public GetEntity(): MapEntity {
		return this.m_UnitState.mUnit.mEntity
	}

	public GetArgs(): AIUnitArgs {
		return this.m_UnitState.mAIUnitArgs
	}

	public Init(unitState: AIUnitState): void {
		this.m_UnitState = unitState
	}

	public OnUpdate(delta: number): AIUnitReturn {
		return AIUnitReturn.NEXT
	}

	OnEnter(): void {

	}

	OnExit(): void {

	}
}