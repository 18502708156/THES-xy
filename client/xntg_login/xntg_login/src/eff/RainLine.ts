class RainLine extends egret.Bitmap {

	autoRotation = !0
	sptx = 0
	speedx = 0
	speedy = 0
	targety = 0
	sy = 0
	down = !0
	spt = 0
	touchEnabled = !1
	type
	isDeath
	sScale = 0
	rotationPlus = 0

	update() {
		this.spt += this.sptx;
		var t = this.x + this.speedx + 2 * Math.cos(this.spt),
			e = this.y + this.speedy;
		if (0 == this.type) {
			if (this.autoRotation) {
				var i = -(180 * Math.atan2(t - this.x, e - this.y)) / Math.PI + 90;
				this.rotation = i
			}
			if (this.x = t, this.y = e, this.down) {
				if (this.y >= this.targety) return void (this.isDeath = !0)
			} else if (this.y <= this.targety) return void (this.isDeath = !0)
		} else if (this.scaleX += .2, this.scaleY += .2, this.scaleX >= 1) return void (this.isDeath = !0);
		this.isDeath = this.x <= 0 || this.y <= 0 || this.x >= this.stage.stageWidth || this.y >= this.stage.stageHeight
	}
}