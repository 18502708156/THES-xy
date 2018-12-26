class BUnitPlayAction extends BUnitAction {

	private m_Anim: EntityClipType
	private m_Once: boolean
	private m_Src: MapEntity

	public static Create(src: MapEntity, anim: EntityClipType, once: boolean = true): BUnitPlayAction {
		let action = new BUnitPlayAction
		action.m_Anim = anim
		action.m_Src = src
		return action 
	}

	OnEnter(): void {
		this.m_Src.UpdateAction(this.m_Anim, this.m_Once)
	}
}