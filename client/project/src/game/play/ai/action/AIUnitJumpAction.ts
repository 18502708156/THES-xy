class AIUnitJumpAction extends AIUnitAction {

	public static readonly SPEED = 1.42
	public static readonly SPEED_A = 1000
	public static readonly MAX_A = 150

	// 起点坐标
	private m_SX: number
	private m_SY: number

	// 目标终点
	private m_EndX: number
	private m_EndY: number

	private m_Duration: number
	private m_Time: number

	private target: number
	private isOffset: boolean

	private m_Entity: MapEntity

	public static CreateMove(entity: MapEntity, src: MapEntity): AIUnitJumpAction {
		let action = this.CreateByTarget(entity, src)
		action.m_Entity = src
		return action
	}

	public static CreateByTarget(entity: MapEntity, src: MapEntity): AIUnitJumpAction {
		let p = egret.$TempPoint
		if (entity) {
			BattleCtrl.GetOffsetPos(entity, p)
		} else {
			p.x = src.x
			p.y = src.y
		}
		return this.Create(p.x, p.y)
	}

	public static CreateByBlock(entity: MapEntity, src: AIUnit): AIUnitJumpAction {
		let p = egret.$TempPoint
		if (entity) {
			BattleCtrl.GetOffsetBlockPos(entity, p)
		} else {
			p.x = src.mEntity.x
			p.y = src.mEntity.y
		}
		return this.Create(p.x, p.y)
	}

	public static Create(x: number, y: number): AIUnitJumpAction {
		let action = new AIUnitJumpAction
		action.m_EndX = x
		action.m_EndY = y
		return action
	}

	private GetY(time: number, maxTime: number): number {
		time *= 0.001
		maxTime *= 0.001
		let a = AIUnitJumpAction.SPEED_A
		if (maxTime * maxTime * a / 8.0 > AIUnitJumpAction.MAX_A) {
			a = AIUnitJumpAction.MAX_A * 8 / (maxTime * maxTime)
		}
		return 0.5 * a * maxTime * time - 0.5 * a * time * time
	}

	public OnUpdate(delta: number): AIUnitReturn {
		let startX = this.m_SX
		let startY = this.m_SY
		this.m_Time = this.m_Time + delta
		let temp
		if (this.m_Time >= this.m_Duration) {
			temp = 1
		} else {
			// temp = egret.Ease.cubicOut(this.m_Time / this.m_Duration)
			temp = this.m_Time / this.m_Duration
			var e = temp - 1;
			temp = e * e * e + 1
		}
		let tempPos = MathUtils.TEMP_POS
		MathUtils.Lerp(startX, startY, this.m_EndX, this.m_EndY, temp, tempPos)
		this.m_Entity.SetPos(tempPos.x, tempPos.y)	
		if (temp >= 1) {
			return AIUnitReturn.NEXT
		}
		return AIUnitReturn.CONTINUE
	}

	OnEnter(): void {
		if (this.m_Entity == null) {
			this.m_Entity = this.GetEntity()
		}
		this.m_Entity.UpdateAction(EntityClipType.JUMP, true)

		let sx = this.m_SX = this.m_Entity.x
		let sy = this.m_SY = this.m_Entity.y

		let x1 = sx - this.m_EndX
		let y1 = sy - this.m_EndY
		// this.GetEntity().LookPos(args.mEndX, args.mEndY)

		this.m_Duration = Math.ceil(Math.sqrt(x1 * x1 + y1 * y1) / AIUnitJumpAction.SPEED)
		this.m_Time = 0
	}
}