class AIUnitDeadKickOut extends AIUnitAction {

	private radius: number
	private count: number
	private vx: number
	private vy: number

	private way = 1
	private wayInvt = 0
	private top = 50
	private bottom = StageUtils.HEIGHT
	private left = 0
	private right = 820

	OnEnter(): void {
		var self = this;
		self.radius = 50
		self.count = 0;
		var speed = AIUnitDeadState.speed
		speed = 1.5 * speed + 1;
		let info = this.GetEntity().GetInfo()
		var posIndex = info.posIndex
		let data = 3;
		(9 == posIndex || 10 == posIndex || 4 == posIndex || 5 == posIndex) && (data = -5)
		if (info.side == 2) {
			self.vx = 12 * speed
			self.vy = (12 - data) * speed
		} else {
			self.vx = -12 * speed
			self.vy = -(12 - data) * speed
		}
	}

	public OnUpdate(delta: number): AIUnitReturn {
		let self = this
		let entity = this.GetEntity()
		let x = entity.x
		let y = entity.y
		self.wayInvt += delta
		if (self.wayInvt > 100) {
			self.way++
			self.wayInvt = 0
			// entity.SetDir(self.way % 8)
			entity.scaleX = self.way % 2 == 0 ? 1 : -1
		}
		entity.x += self.vx
		entity.y += self.vy
		if (self.count >= 2) {
			self.radius = -100
		}
		if (x + self.radius > self.right) {
			entity.x = self.right - self.radius
			self.vx *= -1
			self.count++
		} else if (y + self.radius > self.bottom) {
			entity.y = self.bottom - self.radius
			self.vy *= -1
			self.count++
		} else if (x - self.radius < self.left) {
			entity.x = self.left + self.radius
			self.vx *= -1
			self.count++
		} else if (y - self.radius < self.top) {
			entity.y = self.top + self.radius
			self.vy *= -1
			self.count++
		}
		if (self.count >= 3) {
			entity.visible = false
			return AIUnitReturn.NEXT
		}
		return AIUnitReturn.CONTINUE
	}
}