class AIUnitEvadeAction  extends AIUnitAction {
	public constructor() {
		super()
	}

	private m_Move: any = null

    private m_Pos: IBattlePoint
	private m_Time: number = 0

	OnEnter(): void {
		this.m_Time = 0
        this.m_Move = null
        if (!this.m_Pos) {
            this.m_Pos = {} as any
        }
        let entity = this.GetEntity().GetInfo()
		BattleCtrl.GetPos(entity.IsSide(), entity.posIndex, this.m_Pos)
    }
    
    OnExit(): void {
		let entity = this.GetEntity()
        entity.x = this.m_Pos.x
        entity.y = this.m_Pos.y
    }

	public OnUpdate(delta: number): AIUnitReturn {
		this.m_Time += delta
		let dt = this.m_Time / 600
		let entity = this.GetEntity()
		if (dt >= 1) {
			entity.x = this.m_Pos.x
			entity.y = this.m_Pos.y
			return AIUnitReturn.NEXT
		}
		let x = Math.sin(dt * Math.PI) * 40;
		entity.x = this.m_Pos.x - x
		return AIUnitReturn.CONTINUE
	}
}