class BUnitJumpAction  extends BUnitAction {

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

	private bezier: Bezier

	public static CreateByTarget(entity: MapEntity, src: MapEntity): BUnitJumpAction {
		let p = egret.$TempPoint
		if (entity) {
			BattleCtrl.GetOffsetPos(entity, p)
		} else {
			p.x = src.x
			p.y = src.y
		}
		return this.Create(p.x, p.y, src)
	}

	public static CreateByBlock(entity: MapEntity, src: MapEntity): BUnitJumpAction {
		let p = egret.$TempPoint
		if (entity) {
			BattleCtrl.GetOffsetBlockPos(entity, p)
		} else {
			p.x = src.x
			p.y = src.y
		}
		return this.Create(p.x, p.y, src)
	}

	public static Create(x: number, y: number, src: MapEntity): BUnitJumpAction {
		let action = new BUnitJumpAction
		action.m_EndX = x
		action.m_EndY = y
		action.m_Entity = src
		return action
	}

	// private GetY(time: number, maxTime: number): number {
	// 	time *= 0.001
	// 	maxTime *= 0.001
	// 	let a = BUnitJumpAction.SPEED_A
	// 	if (maxTime * maxTime * a / 8.0 > BUnitJumpAction.MAX_A) {
	// 		a = BUnitJumpAction.MAX_A * 8 / (maxTime * maxTime)
	// 	}
	// 	return 0.5 * a * maxTime * time - 0.5 * a * time * time
	// }

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
		// MathUtils.Lerp(startX, startY, this.m_EndX, this.m_EndY, temp, tempPos)
		// this.m_Entity.SetPos(tempPos.x, tempPos.y)	
		this.bezier.Get(temp, tempPos)
		this.m_Entity.SetPos(tempPos.x, tempPos.y)
		if (temp >= 1) {
			return AIUnitReturn.NEXT
		}
		return AIUnitReturn.CONTINUE
	}

	OnEnter(): void {
		this.m_Entity.UpdateAction(EntityClipType.JUMP, true)

		let sx = this.m_SX = this.m_Entity.x
		let sy = this.m_SY = this.m_Entity.y

		let x1 = sx - this.m_EndX
		let y1 = sy - this.m_EndY

		let dx = this.m_EndX - sx
		let dy = this.m_EndY - sy

		this.m_Duration = Math.ceil(Math.sqrt(x1 * x1 + y1 * y1) / BUnitJumpAction.SPEED)
		this.m_Time = 0

		this.bezier = new Bezier([
			{x: sx, y: sy},
			{x: sx + dx * 0.25, y: sy + dy * 0.25 - 70},
			{x: sx + dx * 0.75, y: sy + dy * 0.75 - 70},
			{x: this.m_EndX, y: this.m_EndY},
		] as any)
	}

	OnExit(): void {
		super.OnExit()
		GameMap.GetBattleView().UpdateSort()
	}
}