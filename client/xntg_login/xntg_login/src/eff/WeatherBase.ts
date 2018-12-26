class WeatherBase {

	_runing = false
	_first = false
	timerFrame = 15e3
	index = 0

	imageList: egret.Texture[] = []
	private m_Temp: number = 0

	constructor(t) {
		this.index = t
	}

	playWeather(tex: egret.Texture[]) {
		this.imageList = tex || []
		if (false == this._runing) {
			this._runing = true
			this._first = true
			this.onWeatherStart()
			if (this.timerFrame > 0) {
			} else {
				this.timerFrame = 60
			}
			egret.startTick(this.weatherUpdateHandler, this)
			WeatherFactory.weatherRunlist[this.index] = this
		}
	}

	stopWeather() {
		if (true == this._runing) {
			this._runing = false
			egret.stopTick(this.weatherUpdateHandler, this)
			this.onWeatherStop()
			delete WeatherFactory.weatherRunlist[this.index]
		}
	}

	weatherUpdateHandler(time: number): boolean {
		if (time > (this.m_Temp + this.timerFrame)) {
			this.m_Temp = time
		} else {
			return false
		}
		if (true == this._first) {
			this._first = false
		} else {
			this.onWeatherUpdate()
		}
		return false
	}

	onWeatherInit() { }

	onWeatherStart() { }

	onWeatherUpdate() { }

	onWeatherStop() { }
}