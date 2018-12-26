class AIUnitHitAction extends AIUnitAction {
	public constructor() {
		super()
	}

	private m_Move: any = null
    public mHit: number = 0

    private m_Pos: IBattlePoint

	OnEnter(): void {
        this.m_Move = null
        this.mHit = AIConfig.PLAY_ANIM_TIME - 200
        this.m_UnitState.mUnit.mEntity.UpdateAction(EntityClipType.HIT, true)
        if (!this.m_Pos) {
            this.m_Pos = {} as any
        }
        let entity = this.GetEntity()
        this.m_Pos.x = entity.x
        this.m_Pos.y = entity.y
    }
    
    OnExit(): void {
        let entity = this.GetEntity()
        entity.x = this.m_Pos.x
        entity.y = this.m_Pos.y
        this.m_UnitState.mUnit.mEntity.UpdateAction(EntityClipType.STAND, false)
    }

	public OnUpdate(delta: number): AIUnitReturn {
        let v = this.mHit -= delta
        if (v <= 0) {
            this.m_Move = null
            this.mHit = 0
            return AIUnitReturn.NEXT
        } else {
            let entity = this.GetEntity()
            let resetTime = 80
            if (v < resetTime) {
                let moveData = this.m_Move
                if (moveData == null) {
                    moveData = this.m_Move = {
                        sx: entity.x,
                        sy: entity.y,
                    }
                }
                MathUtils.Lerp(moveData.sx, moveData.sy, this.m_Pos.x, this.m_Pos.y, (resetTime - v) / resetTime, entity)
            } else if (v > 300 || v < 120) {
                let isMy = !entity.GetInfo().IsSide()
                let mx = (isMy ? -1.2 : 1.2) * AIUnitDeadState.speed
                let my = (isMy ? -1.2 : 1.2) * AIUnitDeadState.speed
                entity.x += mx
                entity.y += my
            } 
        }
		return AIUnitReturn.CONTINUE
	}
}