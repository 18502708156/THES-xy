class RideShowPanel extends eui.Component implements  eui.UIComponent {

	private m_Ride: string
	private m_RideHead: string

	private rideMv: MovieObject
	private rideHeadMv: MovieObject

	private mScale: number

	public constructor() {
		super()
	}

	public SetBodyId(value: number): void {
		let ridePath = AppearanceConfig.GetUIPath(value)
		this.mScale = AppearanceConfig.GetScale(value)
		if (this.m_Ride == ridePath) {
			return
		}
		this.m_Ride = ridePath
		if(ridePath.indexOf("horse") != -1)
		{
			this.m_RideHead = AppearanceConfig.GetUIPath(value, null, null, true)
		}else
		{
			this.m_RideHead = null
		}
		
		this._Update()
	}

	public SetBody(value: string): void {
		this.mScale = 1
		if (this.m_Ride == value) {
			return
		}
		this.m_Ride = value
		this._Update()
	}

	private _SetSource(img: MovieObject, newPath: string) {
		if (!img) {
			return
		}
		if (StringUtils.IsNullOrEmpty(newPath)) {
			img.LoadByUrl(null)
		} else {
			img.LoadByUrl(newPath, -1, true)
		}
	}

	private _NewMovieObject() {
		let obj = new MovieObject
		let scale = 1
		obj.scaleX = obj.scaleY = scale
		obj.x = (this.width * scale) >> 1
		obj.y = (this.height * scale) >> 1
		this.addChild(obj)
		return obj
	}

	private _Update() {
		if (!this.$stage) {
			return
		}
		this.rideMv = this._InitMv(this.m_Ride, this.rideMv)
		if (this.rideMv) {
			this.rideMv.scaleX = this.rideMv.scaleY = this.mScale
		}
		if (this.m_RideHead)
		{
			this.rideHeadMv = this._InitMv(this.m_RideHead, this.rideHeadMv)
		}
		if(this.rideHeadMv) this.rideHeadMv.visible = this.m_RideHead ? true : false
		
		if (this.m_Ride) {
			if (this.m_RideHead) {
				this.rideMv.once(egret.Event.CHANGE, this._LoadBodyEnd, this)
			}
			this._SetSource(this.rideMv, this.m_Ride)
		}
	}

	private _LoadBodyEnd() {
		if (this.m_RideHead) {
			this.rideHeadMv.once(egret.Event.CHANGE, this.SyncFrame, this);
			this.rideHeadMv.LoadByUrl(this.m_RideHead, -1, false)
		}
	}

	private SyncFrame(e: egret.Event): void {
		let mc = e.currentTarget as EntityMovieObject
		if (this.rideMv && !StringUtils.IsNullOrEmpty(this.m_RideHead)) {
			mc.gotoAndPlay(this.rideMv.currentFrame, -1)
		} else {
			mc.gotoAndPlay(1, -1)
		}
	}

	private _InitMv(resName: string, mvObj: MovieObject): MovieObject {
		if (!StringUtils.IsNullOrEmpty(resName)) {
			if (!mvObj) {
				mvObj = this._NewMovieObject()
			}
		} else {
			if (mvObj) {
				mvObj.LoadByUrl(null)
			}
		}
		return mvObj
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
		this._Update()
	}
}