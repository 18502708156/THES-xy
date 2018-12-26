
// 动作加载数据
class BattleMvData extends egret.HashObject {
	// 只显示的方向
	// private static mWay: {[key: number]: boolean} = {[3]: true, [5]: true}
	private offset: any = null
	private mParent: egret.DisplayObjectContainer
	private mIndex: number

	public mv: EntityMovieObject
	public mIsHead: boolean
	public mSettingId: number
	// 模型名字
	public name: string
	// 替换的名字
	public replaceName: string
	// 是否是骑乘类型
	public ride: boolean
	// 只播放的动画
	public mAnimType: {[key: number]: boolean}

	public job: number = null
	public sex: number = null

	public mIsShow = true

	private mIsPlayWayAnim = false

	// 显示的模型名称
	public GetName(): string {
		if (this.replaceName) {
			return this.replaceName
		}
		return this.name
	}

	public GetClipName(): EntityClipType {
		let anim = this.m_Context.GetClipType()
		if (this.mAnimType) {
			if (!this.mAnimType[anim]) {
				anim = EntityClipType.STAND
			}
		}
		if (!this.replaceName && this.ride) {
			anim = 100 + anim
		}
		return anim
	}

	// 不添加方向动作状态
	private m_NotState: boolean = false

	public SetNotState(): void {
		this.m_NotState = true
		if (this.mv) {
			this.mv.m_LoadAndPlay = false
		}
	}

	public SetOffset(offset) {
		if (this.mv) {
			this.mv.x = offset.x
			this.mv.y = offset.y
		} else {
			this.offset = offset
		}
	}

	private m_Context: BattleEntity

	constructor(context: BattleEntity, hide: boolean = false) {
		super()
		this.m_Context = context
		if (hide && this.mv) {
			this.mv.visible = false
		}
	}

	public UpdateSetting(settingId: number) {
		if (this.mSettingId == settingId) {
			if (this.mv) {
				this.mv.visible = this.IsSettingShow()
			}
		}
	}

	private IsSettingShow(): boolean {
		if (this.mSettingId) {
			return !FuncOpenModel.HasSaveData(this.mSettingId)
		}
		return true
	}

	public Init() {
		this.replaceName = null
		this.mIsShow = true
		this.mIsPlayWayAnim = false
	}

	public SetParent(parent: egret.DisplayObjectContainer, index: number) {
		this.mParent = parent
		this.mIndex = index
	}

	private AddToParent() {
		if (!this.mParent) {
			console.log("not parent")
			return
		}
		if (!this.mv) {
			return
		}
		this.mParent.addChildAt(this.mv, this.mIndex || 0)
	}

	public Create() {
		this.mv = new EntityMovieObject
		this.mv.$hashCode = this.hashCode
		if (this.offset) {
			this.mv.x = this.offset.x
			this.mv.y = this.offset.y
			this.offset = null
		}
	}

	public SetId(appId: number) {
		if (appId) {
			this.name = AppearanceConfig.GetAppe(appId, this.job, this.sex)
			// if (this.mIsHead) {
			// 	this.name += "_h"
			// }
		} else {
			this.name = null
			if (this.mv) {
				this.mv.visible = false
				this.mv.stop()
			}
		}
	}

	public Load() {
		if (!this.mIsShow) {
			return
		}
		let res = this.GetName()
		let mc = this.mv
		if (res) {
			if (mc) {
				mc.stop();
			}
			if (this.mSettingId != null) {
				// 不显示该对象
				if (FuncOpenModel.HasSaveData(this.mSettingId)) {
					return
				}
			}
			if (this.mIsHead) {
				let hasHead = false
				let data = GameGlobal.Config.AppearancePosConfig[this.name]
				if (data) {
					let dir = this.m_Context.GetDir()
					if (dir < 2 || dir > 6) {
						hasHead = data.upRes
					} else {
						hasHead = data.downRes
					}
				}
				if (!hasHead) {
					res = null
					if (this.mv) {
						if (this.mv.visible) {
							this.mv.visible = false
							this.mv.stop()
						}
					}
				} else {
					if (this.mv) {
						this.mv.visible = true
					}
					res += "_h"
				}
			}
			if (!res) {
				return
			}
			if (!mc) {
				this.Create()
				mc = this.mv
				mc.addEventListener(egret.Event.CHANGE, this.SyncFrame, this);
				if (this.m_NotState) {
					this.mv.m_LoadAndPlay = false
				}
			}
			if (!mc.parent) {
				this.mParent.addChildAt(this.mv, this.mIndex)
			}
			if (this.m_NotState) {
				this.m_Context.LoadMcAnim(mc, res, null, null)
			} else {
				this.m_Context.LoadMcAnim(mc, res, this.m_Context.GetDir(), this.GetClipName())
			}
		}
	}

	private SyncFrame(e: egret.Event): void {
		let mc = e.currentTarget as EntityMovieObject
		if (mc.movieClipData.$isDataValid() && this.m_Context.mBody.mv) {
			mc.gotoAndPlay(this.m_Context.mBody.mv.currentFrame, this.m_Context.GetPlayCount())
		}
	}

	public SetShowState(isShow: boolean) {
		this.mIsShow = isShow
		if (!this.mv) {
			return
		}
		let mv = this.mv
		if (isShow) {
			if (!mv.parent) {
				this.AddToParent()
			}
		} else {
			if (mv.parent) {
				DisplayUtils.removeFromParent(mv)
			}
		}
	}

	public ClearCache() {
		if (this.mv) {
			this.mv.ClearCache()
		}
	}

	public UpdateWayTween() {
		let dir = this.m_Context.GetDir()
		let mv = this.mv
		if (!mv) {
			return
		}
		
		let x
		let y
		if (dir > 4) {
			if (!this.m_NotState) {
				this.mv.scaleX = -1
			}
			x = 100
			y = -100
		} else {
			if (!this.m_NotState) {
				this.mv.scaleX = 1
			}
			x = -100
			y = -100
		}
		if (dir <= 2 || dir >= 6) {
			y += 40
		} 
		if (this.mIsPlayWayAnim && mv.$stage) {
			if (mv.x != x || mv.y != y) {
				egret.Tween.removeTweens(mv)
				egret.Tween.get(mv).to({
					x: x,
					y: y,
				}, 1300, egret.Ease.sineOut)
			}
		} else {
			mv.x = x
			mv.y = y
			this.mIsPlayWayAnim = true
		}
	}
}
