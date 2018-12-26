interface IBattleModel {
	scale: number;
	dir: number;
	sex: number;
	job: number;

	GetTitle(): number;

	GetWeaponId(): number;
	GetWingId(): number;
	GetBodyId(): number;
	GetRideId(): number;
}

class BattleEntity extends egret.DisplayObjectContainer {

	public static POS = -125;

	public mPosY = BattleEntity.POS

	// 超过最大显示数量
	protected mIsMaxCountState = false

	protected m_Dir: number
	protected m_Container: egret.DisplayObjectContainer
	public mBody = new BattleMvData(this)
	protected mBodyImage: eui.Image

	private m_Scale: number = 1

	private m_AnimState: EntityClipType
	private m_PlayOnce: boolean

	private m_Call: boolean

	private _title: eui.Image;

	public constructor() {
		super()
		this.m_Dir = 3

		this.touchEnabled = false
		this.touchChildren = false
		this.m_Container = new egret.DisplayObjectContainer
		this.addChildAt(this.m_Container, CharMcOrder.CONTAINER_TYPE)

		this.mBody.SetParent(this.m_Container, 0)
		this.mBody.Create()
		this.m_Container.addChild(this.mBody.mv)

		this.mBody.mv.addEventListener(egret.Event.CHANGE, this._BodyLoaded, this)
	}

	public SetMaxCountState(state: boolean) {
		if (this.mIsMaxCountState == state) {
			return
		}
		this.mIsMaxCountState = state
		if (state) {
			if (this.m_Container.parent) {
				DisplayUtils.removeFromParent(this.m_Container)
			}
		} else {
			if (!this.m_Container.parent) {
				this.addChildAt(this.m_Container, CharMcOrder.CONTAINER_TYPE)
			}
		}
		this.DoMaxCountState()
	}

	protected DoMaxCountState() {

	}

	// 子类实现
	public UpdateSetting(settingId: number) {
	}

	public GetClipType(): EntityClipType {
		return this.m_AnimState
	}

	protected SetMvState(mvData: BattleMvData, isShow: boolean) {
		if (!mvData) {
			return
		}
		mvData.SetShowState(isShow)
	}

	public SetModelShow(state: boolean) {
		this.SetMvState(this.mBody, state)
	}

	public GetDir(): number {
		return this.m_Dir
	}

	// 替身显示状态
	public IsReplaceShow(show: boolean) {
	}

	public Init(entity: EntityData): void {
		this.alpha = 1
		this.mPosY = BattleEntity.POS
		this.touchEnabled = false
		this.touchChildren = false
		this.mIsMaxCountState = false
		this.m_Scale = entity.scale || 1
		this.m_Container.scaleX = this.m_Container.scaleY = this.m_Scale
		this.addChildAt(this.m_Container, CharMcOrder.CONTAINER_TYPE)
		this.m_Dir = entity.dir || 3
		this.m_AnimState = null
		this.mBody.Init()
		
		this.UpdateInfo(entity)
	}

	public Dispose(): void {
		if (this.m_Call) {
			TimerManager.ins().remove(this._PlayClip2, this)
			this.m_Call = false
		}
		this.mBody.ClearCache()
		if (this._title) {
			this._title.source = ""
			DisplayUtils.removeFromParent(this._title)
		}
		if (this.mBodyImage) {
			this.mBodyImage.source = ""
			DisplayUtils.removeFromParent(this.mBodyImage)
		}
	}

	public SetDir(dir: number): void {
		if (this.m_Dir == dir) {
			return
		}
		this.m_Dir = dir
		this.PlayClip()
	}


	/**
	 *  替身名称
	 * 	bodyName == null 还原显示的模型
	 */
	public SetReplaceBody(bodyName: string): void {
		if (this.mBody.replaceName == bodyName) {
			return
		}
		this.mBody.replaceName = bodyName
		this.IsReplaceShow(bodyName != null)
		this.PlayClip()
	}

	public UpdateAction(animState: EntityClipType, once: boolean): void {
		if (this.m_AnimState == animState) {
			return
		}
		this.m_PlayOnce = once
		this.m_AnimState = animState
		this.PlayClip()
	}

	public ReplayAction(animState: EntityClipType, once: boolean): void {
		this.m_PlayOnce = once
		this.m_AnimState = animState
		this.PlayClip()
	}

	public UpdateInfo(entity: EntityData): void {
		this.mBody.name = entity.GetBodyResPath()
		this.UpdateTitle(entity)
		this.PlayClip()
	}

	protected PlayClip(): void {
		if (this.m_Call || !this.$stage) {
			return
		}
		this.m_Call = true
		TimerManager.ins().doNext(this._PlayClip2, this)
	}

	private _PlayClip2(): void {
		this.m_Call = false
		if (this.m_AnimState == null) {
			return
		}
		if (!this.mIsMaxCountState) {
			this.LoadMcAnim(this.mBody.mv, this.mBody.GetName(), this.GetDir(), this.mBody.GetClipName(), this.GetPlayCount(), true)
		} else {
			if (this.mBodyImage == null) {
				this.mBodyImage = new eui.Image;
				this.mBodyImage.x = -25
				this.mBodyImage.y = -100
			}
			if (!this.mBodyImage.parent) {
				this.mBodyImage.source = "shadow"
				this.addChildAt(this.mBodyImage, CharMcOrder.CONTAINER_TYPE);
			}
		}
	}

	public GetPlayCount(): number {
		return this.m_PlayOnce ? 1 : -1
	}

	protected _BodyLoaded(): void {
	}

	public LoadMc(mc: EntityMovieObject, name: string, count: number = 1, autoPlay: boolean = false): void {
		this.LoadMcAnim(mc, name, this.m_Dir, this.m_AnimState, count, autoPlay)
	}

	public LoadMcAnim(mc: EntityMovieObject, name: string, dir: number, anim: EntityClipType, count: number = 1, autoPlay: boolean = false): void {
		// if (!mc || anim == null) {
		// 	return
		// }
		if (!mc) {
			return
		}
		if (dir != null) {
			if (dir > 4) {
				this.m_Container.scaleX = -1 * this.m_Scale
				dir = 8 - dir
			} else {
				this.m_Container.scaleX = this.m_Scale
			}
		}
		if (!mc.parent) {
			return
		}
		if (!this.$stage) {
			return
		}
		let data = null
		let stateName = ""
		let frameName = null
		if (dir != null) {
			if (anim == null) {
				return
			}
			dir = dir <= 2 ? 1 : 3
			data = EntityClipTypeToName[anim]
			stateName = dir + data[0]
			frameName = data[1]
		}

		let mul = 1
		if (egret.is(this.parent, "MapEntity")) {
			let mapEntity = this.parent as MapEntity
			mul = mapEntity.mRaid ? mapEntity.mRaid.GetSpeed() : 1
		}
		mc.SetFrameRate(mul)
		mc.LoadByUrl(ResDataPath.ROOT_MOVIE + name, stateName, frameName, this.GetPlayCount(), autoPlay)
	}

	public UpdateTitle(entity: IBattleModel) {
		if (!entity) {
			return
		}
		if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_CH)) {
			return
		}
		var title = entity.GetTitle()
		if (this._title) {
			this._title.source = ""
		}
		if (title > 0) {
			let cfg = GlobalConfig.ins().TitleConf[title]
			let titleResName = cfg ? cfg.icon : ""
			if (this._title == null) {
				this._title = new eui.Image;
				this._title.addEventListener(egret.Event.COMPLETE, this._CompleteTitle, this)
			}
			
			this.addChildAt(this._title, CharMcOrder.TITLE_TYPE);
			this._title.source = titleResName
		}
	}

	private _CompleteTitle() {
		if (!this._title.parent) {
			return
		}
		let img = this._title.texture
		if (!img || !img.textureWidth || !img.textureHeight) {
			return
		}
		this._title.x = -(img.textureWidth >> 1)
		this._title.y = -img.textureHeight + this.GetTopPos()
	}

	public GetTopPos(): number {
		return this.mPosY
	}

	public ClearTitle() {
		if (this._title) {
			this._title.source = ""
		}
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage, nestLevel);
		this.PlayClip()
	}
}