class AIUnitRunAction extends AIUnitAction {
	// 起点坐标
	private m_SX: number
	private m_SY: number

	// 目标终点
	private m_EndX: number
	private m_EndY: number

	private m_Duration: number
	private m_Time: number

	public OnUpdate(delta: number): AIUnitReturn {
		let startX = this.m_SX
		let startY = this.m_SY
		this.m_Time = this.m_Time + delta
		let temp
		if (this.m_Time >= this.m_Duration) {
			temp = 1
		} else {
			temp = this.m_Time / this.m_Duration
		}
		let tempPos = MathUtils.TEMP_POS
		MathUtils.Lerp(startX, startY, this.m_EndX, this.m_EndY, temp, tempPos)
		this.GetEntity().SetPos(tempPos.x, tempPos.y)	
		if (temp >= 1) {
			return AIUnitReturn.NEXT
		}
		return AIUnitReturn.CONTINUE
	}

	OnEnter(): void {
		let sx = this.m_SX = this.GetUnit().mEntity.x
		let sy = this.m_SY = this.GetUnit().mEntity.y
		let args = this.GetArgs()
		this.m_EndX = args.mEndX
		this.m_EndY = args.mEndY
		let x1 = sx - args.mEndX
		let y1 = sy - args.mEndY
		this.GetUnit().mEntity.LookPos(args.mEndX, args.mEndY)

		this.m_Duration = Math.ceil(Math.sqrt(x1 * x1 + y1 * y1) / Const.GetMoveSpeed() * 1000)
		this.m_Time = 0
	}
}