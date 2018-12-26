class AIUnitPlayAction extends AIUnitAction {

	private m_Anim: EntityClipType

	public constructor(anim: EntityClipType) {
		super()
		this.m_Anim = anim
	}

	OnEnter(): void {
		this.GetUnit().mEntity.UpdateAction(this.m_Anim, false)
	}

	public OnUpdate(delta: number): AIUnitReturn {
		return AIUnitReturn.NEXT
	}
}