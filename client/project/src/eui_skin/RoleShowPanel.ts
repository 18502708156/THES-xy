class RoleShowPanel extends eui.Component implements eui.UIComponent {

	public mScale = 1
	// 是否显示守护
	public mShowTianx: boolean = true

	private wingMv: MovieObject
	private bodyMv: MovieObject
	private weaponMv: MovieObject
	private rideMv: MovieObject
	private rideHeadMv: MovieObject
	private tianx: MovieObject
	private imgTitle: eui.Image

	private m_Weapon: string
	private m_Body: string
	private m_Wing: string
	private m_Ride: string
	private m_RideHead: string
	private m_Tianx: string
	private m_Title: string

	private m_Offset = null

	public constructor() {
		super()
	}

	//服务器下发的数据 显示玩家形象
	public SetShowImage(playerInfo: { shows: number[]; job: number; sex: number; }) {
		let roleShowData = new RoleShowData
		roleShowData.job = playerInfo.job
		roleShowData.sex = playerInfo.sex
		roleShowData.shows = playerInfo.shows
		this.SetAll(roleShowData)
	}

	public SetShowMarry(playerInfo:Sproto.marry_object) {
		let roleShowData = new RoleShowData
		roleShowData.job = playerInfo.job
		roleShowData.sex = playerInfo.sex
		roleShowData.shows = playerInfo.shows
		this.SetAll(roleShowData)
	}

	public ResetData() {
		this.m_Weapon = null
		this.m_Body = null
		this.m_Wing = null
		this.m_Ride = null
		this.m_Tianx = null
	}

	public SetWeapon(value: string): void {
		if (value) {
			this.m_Weapon = value as string
		} else {
			this.m_Weapon = null
		}
		this._Update()
	}


	public SetBody(value: string): void {
		if (value != null) {
			this.m_Body = value as string
		} else {
			this.m_Body = null
		}
		this._Update()
	}


	public SetWing(value: string): void {
		if (value != null) {
			this.m_Wing = value as string
		} else {
			this.m_Wing = null
		}
		this._Update()
	}

	public SetRide(value: string): void {
		if (value != null) {
			this.m_Ride = value as string
		} else {
			this.m_Ride = null
		}
		this._Update()
	}

	public SetTianx(value: string): void {
		if (!this.mShowTianx) {
			return
		}
		if (value != null) {
			this.m_Tianx = value
		} else {
			this.m_Tianx = null
		}
		this._Update()
	}

	public SetTitle(value: string): void {
		this.m_Title = value || ""
		
		if (!this.imgTitle) {
			return
		}

		this._Update()
	}

	public SetTianxPos(x?:number,y?:number):void
	{
		if(!this.tianx)
			return ;
		if(x!=null)
			this.tianx.x=x;
		if(y!=null)
			this.tianx.y=y;
	}

	private _SetSource(img: MovieObject, newPath: string, autoPlay: boolean) {
		if (!img) {
			return
		}
		if (!newPath) {
			img.LoadByUrl(null)
		} else {
			if (autoPlay) {
				if (img.name) {
					img.Play(newPath, img.name || null, -1, true)
				} else {
					img.LoadByUrl(newPath, -1, true)
				}
			} else {
				img.once(egret.Event.CHANGE, this.SyncFrame, this);
				img.LoadByUrl(newPath, -1, false)
			}
		}
	}

	private _NewMovieObject(index: number) {
		let obj = new MovieObject
		obj["__temp_index__"] = index
		let scale = this.mScale || 1.5
		obj.scaleX = obj.scaleY = scale
		obj.x = (this.width * scale) >> 1
		obj.y = (this.height * scale) >> 1
		this.addChild(obj)
		this.$children.sort(RoleShowPanel.SORT);
		return obj
	}

	private static SORT(lhs: MovieObject, rhs: MovieObject): number {
		return (lhs["__temp_index__"] || 0) - (rhs["__temp_index__"] || 0)
	}

	private _Update() {
		if (!this.$stage) {
			return
		}
		TimerManager.ins().doNext(this._DoUpdate, this)
	}

	private _DoUpdate(): void {
		if (!this.$stage) {
			return
		}
		this.rideMv = this._InitMv(this.m_Ride, this.rideMv, 0)
		this.wingMv = this._InitMv(this.m_Wing, this.wingMv, 1)
		this.bodyMv = this._InitMv(this.m_Body, this.bodyMv, 2)
		this.weaponMv = this._InitMv(this.m_Weapon, this.weaponMv, 3)
		this.tianx = this._InitMv(this.m_Tianx, this.tianx, 4)
		this.rideHeadMv = this._InitMv(this.m_RideHead, this.rideHeadMv, 5)
		this._SetImgTitle(this.m_Title)

		if (!StringUtils.IsNullOrEmpty(this.m_Body)) {
			this.bodyMv.once(egret.Event.CHANGE, this._LoadBodyEnd, this)
			this._SetSource(this.bodyMv, this.m_Body, true)
		} else {
			this._LoadBodyEnd()
		}

		let offset = this.m_Offset
		this.SetOffset(this.wingMv, offset)
		this.SetOffset(this.bodyMv, offset)
		this.SetOffset(this.weaponMv, offset)

		if (this.imgTitle && this.m_Title) {
			this.imgTitle.y = -270 + (-60) + (offset ? offset.y : 0)
		}
	}

	private _InitMv(resName: string, mvObj: MovieObject, index: number): MovieObject {
		if (resName) {
			if (!mvObj) {
				mvObj = this._NewMovieObject(index)
				if (index == 4) {
					mvObj.x = -150
					mvObj.y = -210
				}
			}
		} else {
			if (mvObj) {
				mvObj.LoadByUrl(null)
			}
		}
		return mvObj
	}

	private _SetImgTitle(sourcePath) {
		if (!this.imgTitle && !sourcePath)
			return
			
		if (!this.imgTitle) {
			this.imgTitle = new eui.Image
			this.imgTitle.horizontalCenter = 0
			this.imgTitle.y = -270
			this.addChildAt(this.imgTitle, this.numChildren)
		}

		this.imgTitle.source = sourcePath || ""
	}

	private _LoadBodyEnd(): void {
		this._SetSource(this.wingMv, this.m_Wing, false)
		this._SetSource(this.rideMv, this.m_Ride, false)
		this._SetSource(this.rideHeadMv, this.m_RideHead, false)
		this._SetSource(this.weaponMv, this.m_Weapon, false)
		this._SetSource(this.tianx, this.m_Tianx, false)
	}

	private SyncFrame(e: egret.Event): void {
		let mc = e.currentTarget as EntityMovieObject
		if (this.bodyMv && !StringUtils.IsNullOrEmpty(this.m_Body)) {
			mc.gotoAndPlay(this.bodyMv.currentFrame, -1)
		} else {
			mc.gotoAndPlay(1, -1)
		}
	}

	public static GetPath(id: number, job = null, sex = null, ride: boolean = false): string {
		if (!id) {
			return ""
		}
		let appePath = AppearanceConfig.GetUIAppe(id, job, sex, false, ride)
		if (appePath) {
			return ResDataPath.GetMovieStandPath(appePath)
		}
		return ""
	}

	public static GetHeadPath(id: number): string {
		if (!id) {
			return ""
		}
		let appePath = AppearanceConfig.GetUIAppe(id, null, null, true)
		if (appePath) {
			return ResDataPath.GetMovieStandPath(appePath)
		}
		return ""
	}

	public SetAll(target: Role | RoleShowData) {
		let data: RoleShowData
		if (egret.is(target, "Role")) {
			data = (target as Role).GetSubRoleData()
		} else {
			data = target as any
		}
		if (!data) {
			return
		}
		let rideId = data.GetRideId()
		let isRide = rideId > 0
		this.m_Weapon = RoleShowPanel.GetPath(data.GetSwordId(), data.job, data.sex, isRide)
		this.m_Body = RoleShowPanel.GetPath(data.GetBodyId(), data.job, data.sex, isRide)
		this.m_Wing = RoleShowPanel.GetPath(data.GetWingId(), isRide)
		this.m_Ride = RoleShowPanel.GetPath(rideId)
		this.m_RideHead = RoleShowPanel.GetHeadPath(rideId)
		this.m_Title = data.GetTitleId() ? GameGlobal.Config.TitleConf[data.GetTitleId()].icon : ""

		this.m_Offset = AppearanceConfig.GetRideOffset(rideId, true)

		if (this.mShowTianx) {
			this.m_Tianx = RoleShowPanel.GetPath(data.GetTianx())
		}
		this._Update()
	}

	private SetOffset(mv: MovieObject, offset) {
		if (!mv) {
			return
		}
		if (offset) {
			mv.x = offset.x
			mv.y = offset.y
		} else {
			mv.x = 0
			mv.y = 0
		}
	}

	public Set(type: RoleShowDressType, target: Role | RoleShowData) {
		let data: RoleShowData
		if (egret.is(target, "Role")) {
			data = (target as Role).GetSubRoleData()
		} else {
			data = target as any
		}
		if (type == RoleShowDressType.ARM) {
			this.SetWeapon(RoleShowPanel.GetPath(data.GetSwordId(), data.job, data.sex))
		} else if (type == RoleShowDressType.ROLE) {
			this.SetBody(RoleShowPanel.GetPath(data.GetBodyId(), data.job, data.sex))
		} else if (type == RoleShowDressType.WING) {
			this.SetWing(RoleShowPanel.GetPath(data.GetWingId()))
		} else if (type == RoleShowDressType.RIDE) {
			this.SetRide(RoleShowPanel.GetPath(data.GetRideId()))
		} else if (type == RoleShowDressType.TIANX) {
			this.SetTianx(RoleShowPanel.GetPath(data.GetTianx()))
		} else {
			console.log("roleshowpanel not type " + type)
		}
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this._Update()
	}

	public ClearCache() {
		if (this.wingMv) {
			this.wingMv.ClearCache()
		}
		if (this.bodyMv) {
			this.bodyMv.ClearCache()
		}
		if (this.weaponMv) {
			this.weaponMv.ClearCache()
		}
		if (this.tianx) {
			this.tianx.ClearCache()
		}
		if (this.rideMv) {
			this.rideMv.ClearCache()
		}
		if (this.rideHeadMv) {
			this.rideHeadMv.ClearCache()
		}

		this.m_Weapon = null
		this.m_Body = null
		this.m_Wing = null
		this.m_Ride = null
		this.m_RideHead = null
		this.m_Tianx = null

		this.m_Offset = null
	}

	public Clear(): void {
		if (this.wingMv) {
			this.wingMv.Clear()
		}
		if (this.bodyMv) {
			this.bodyMv.Clear()
		}
		if (this.weaponMv) {
			this.weaponMv.Clear()
		}
		if (this.tianx) {
			this.tianx.Clear()
		}
		if (this.rideMv) {
			this.rideMv.Clear()
		}
		if (this.rideHeadMv) {
			this.rideHeadMv.Clear()
		}

		this.m_Weapon = null
		this.m_Body = null
		this.m_Wing = null
		this.m_Ride = null
		this.m_RideHead = null
		this.m_Tianx = null
	}
}