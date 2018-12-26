class BUnitPlayWordAction extends BUnitAction {

	private m_Anim: string
	private m_Once: boolean
	private m_Src: number

	private mTime: number = 500

	public static Create(src: MapEntity, anim: string): BUnitPlayWordAction {
		let action = new BUnitPlayWordAction
		action.m_Anim = anim
		action.m_Src = src.GetHandle()
		return action 
	}

	OnEnter(): void {
		let target = this.mContext.GetEntity(this.m_Src)
		if (target) {
			this.mTime = AIConfig.WORD_EFF_TIME
			GameMap.GetBattleView().bloodLayer.ShowSkillName(target.x, target.y, this.m_Anim)
		} else {
			this.mTime = 0
		}
	}

    public OnUpdate(delta: number): AIUnitReturn {
		return (this.mTime -= delta) <= 0 ? AIUnitReturn.NEXT : AIUnitReturn.CONTINUE
    }
}