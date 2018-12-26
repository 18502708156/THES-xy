class WeatherFactory {

	static _weatherFlower

	static getFlower () {
		let t = egret.MainContext.instance.stage
		this._weatherFlower = this._weatherFlower || new WeatherFlower()
		this._weatherFlower.setStageTarget(t)
		return this._weatherFlower
	}

	static enabled = !1
	static weatherFBList = []
	static weatherSceneList = []
	static weatherRunlist = {}
}