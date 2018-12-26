// class AIUnitStandAction extends AIUnitAction {
// 	public constructor() {
// 		super()
// 	}
// 	private m_Move: any = null
// 	private m_Play: boolean = false
// 	OnEnter(): void {
// 		this.m_Move = null
// 		this.m_Play = false
// 	}
// 	public OnUpdate(delta: number): AIUnitReturn {
// 		let args = this.GetArgs()
// 		if (args.mHit) {
// 			if (!this.m_Play) {
// 				this.m_UnitState.mUnit.mEntity.UpdateAction(EntityClipType.HIT, true)
// 				this.m_Play = true
// 			}
// 			let v = args.mHit -= delta
// 			if (v <= 0) {
// 				this.m_Move = null
// 				args.mHit = null
// 				if (this.m_Play) {
// 					this.m_UnitState.mUnit.mEntity.UpdateAction(EntityClipType.STAND, false)
// 					this.m_Play = false
// 				}
// 			} else {
// 				let entity = this.GetEntity()
// 				let resetTime = AIConfig.HIT_RESET_TIME
// 				if (v < resetTime) {
// 					let moveData = this.m_Move
// 					if (moveData == null) {
// 						moveData = this.m_Move = {
// 							sx: entity.x,
// 							sy: entity.y,
// 							ex: null,
// 							ey: null,
// 							x: null,
// 							y: null,
// 						}
// 						BattleCtrl.GetPos(entity.GetInfo().team == Team.My, entity.GetInfo().posIndex, moveData)
// 						moveData.ex = moveData.x
// 						moveData.ey = moveData.y
// 					}
// 					MathUtils.Lerp(moveData.sx, moveData.sy, moveData.ex, moveData.ey, (resetTime - v) / resetTime, moveData)
// 					entity.x = moveData.x
// 					entity.y = moveData.y
// 				} else if (v > 300 || v < 220) {
// 					let isMy = entity.GetInfo().team != Team.My
// 					let mx = (isMy ? -1.2 : 1.2) * AIUnitDeadState.speed
// 					let my = (isMy ? -1.2 : 1.2) * AIUnitDeadState.speed
// 					entity.x += mx
// 					entity.y += my
// 				} 
// 			}
// 		}
// 		return AIUnitReturn.CONTINUE
// 	}
// } 
//# sourceMappingURL=AIUnitStandAction.js.map