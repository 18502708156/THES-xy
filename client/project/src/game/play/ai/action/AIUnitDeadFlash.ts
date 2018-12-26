class AIUnitDeadFlash extends AIUnitAction {

	private cv: number
	private remain: number
	private alpha: number
	private alphaDir: number

	OnEnter(): void {
		var self = this;
		self.remain = 800
		self.alpha = 1
		self.alphaDir = -1
		self.cv = .1 * AIUnitDeadState.speed

		this.m_UnitState.mUnit.mEntity.UpdateAction(EntityClipType.DIE, true)	
	}

	public OnUpdate(delta: number): AIUnitReturn {
		var self = this;
		self.remain -= delta
		if (self.remain <= 0) {
			return AIUnitReturn.NEXT
		} else if (self.remain <= 600) {
			self.alpha += self.alphaDir * self.cv
			if (self.alpha <= 0 || self.alpha >= 1) {
				self.alphaDir = -self.alphaDir
			}
			this.GetEntity().alpha = self.alpha
		}
		return AIUnitReturn.CONTINUE
	}

	public OnExit(): void {
		super.OnExit()
		this.GetEntity().visible = false
	}
}