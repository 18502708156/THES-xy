class GuideHand extends eui.Component {

	/////////////////////////////////////////////////////////////////////////////
	// GuideHandSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected play: egret.tween.TweenGroup;
	protected group: eui.Group;
	protected handImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	private static SPEED = 1100

	private static TYPE_STAND = 0
	private static TYPE_MOVE = 1

	private m_CX: number
	private m_CY: number
	private m_EX: number
	private m_EY: number
	private m_Duration: number
	private m_Time: number

	private m_Type: number = 0

	private m_ObjParent: BaseView
	private m_Target: egret.DisplayObject

	protected mc: MovieClip
	// private m_GuideId: number
	// private m_StepId: number

	private m_Listener: { ResetFunc: Function, list: any[] } = { ResetFunc: null, list: [] }

	private m_PosInvalid: boolean = false

	public constructor() {
		super()
		this.skinName = "GuideHandSkin"
		this.touchEnabled = false
		this.touchChildren = false
		this.play.addEventListener('complete', this.onTweenGroupComplete, this);
		this.mc = this.mc || new MovieClip;
		this.mc.x = 0;
		this.mc.y = 0;
		this.mc.loadFile(ResDataPath.GetUIEffePath2("ui_guide_001"), true, -1);
		this.group.addChild(this.mc)
	}

	private Play() {
		this.mc.visible = true
		this.play.play(0)
	}

	private Pause() {
		this.mc.visible = false
		this.play.play(0)
		this.play.pause()
	}

	private onTweenGroupComplete(): void {
		if (!this.m_Target) {
			return
		}
		this.play.play(0)
	}

	private RemoveTargetEvent() {
		let target = this.m_Target
		if (!target) {
			return
		}
		for (let data of this.m_Listener.list) {
			data.target.removeEventListener(data.event, data.func, data.thisObject)
		}
		this.m_Listener.list = []
		this.m_Listener.ResetFunc = null

		this.m_Target = null
		this.m_ObjParent = null
	}

	private AddEventListener(target: egret.DisplayObject, msg: string, func: Function, thisObject: any, use?, pri?) {
		target.addEventListener(msg, func, thisObject, use, pri)
		this.m_Listener.list.push({
			target: target,
			event: msg,
			func: func,
			thisObject: thisObject,
		})
	}

	private AddTargetEvent(target: egret.DisplayObject, guideId: number, step: number) {
		let gId = guideId
		let sId = step
		let OnTargetRemoved = (e: egret.Event) => {
			if (e.target != e.currentTarget) {
				return
			}
			GameGlobal.GuideUtil.OnTargetRemoved(gId, sId)
		}
		let OnTargetTap = () => {
			GameGlobal.GuideUtil.OnTargetTap(gId, sId)
		}
		this.m_Listener.ResetFunc = (guideId: number, step: number) => {
			gId = guideId
			sId = step
		}
		this.AddEventListener(target, egret.Event.REMOVED_FROM_STAGE, OnTargetRemoved, this)
		this.AddEventListener(target, egret.Event.REMOVED, OnTargetRemoved, this)
		this.AddEventListener(target, egret.Event.ADDED, this.OnTargetAdded, this)
		this.AddEventListener(target, egret.TouchEvent.TOUCH_TAP, OnTargetTap, this, false, -999)
		this.m_Target = target
	}

	private OnTargetAdded(e: egret.Event) {
		if (e.target != e.currentTarget) {
			return
		}
		this.OnTargetPosition()
	}

	private GetTargetPosition() {
		let target = this.m_Target
		if (!target) {
			return
		}
		let point = egret.$TempPoint
		DisplayUtils.GetGlobalPos(target, point)
		this.globalToLocal(point.x, point.y, point)
		return {
			x: point.x + (target.width >> 1),
			y: point.y + (target.height >> 1)
		}
	}

	private OnTargetPosition() {
		let target = this.m_Target
		if (!target) {
			return
		}
		let point = this.GetTargetPosition()
		if (!point) {
			return
		}
		this.group.x = point.x
		this.group.y = point.y
	}

	private OnMoveTargetPosition() {
		let target = this.m_Target
		if (!target) {
			return
		}
		let point = this.GetTargetPosition()
		if (!point) {
			return
		}
		this.m_CX = this.group.x
		this.m_CY = this.group.y
		this.m_EX = point.x
		this.m_EY = point.y
		let x1 = this.m_EX - this.m_CX
		let y1 = this.m_EY - this.m_CY
		let len = Math.sqrt(x1 * x1 + y1 * y1)
		this.m_Time = 0
		this.m_Duration = Math.ceil(len / GuideHand.SPEED * 1000)
	}

	public OnClose() {
		this.RemoveTargetEvent()
	}

	public OnUpdate(delta: number) {
		if (this.m_Target && this.m_ObjParent) {
			if (this.m_Target.$visible && this.m_ObjParent.$visible && !this.$visible) {
				this.$setVisible(true)
			} else if ((!this.m_Target.$visible || !this.m_ObjParent.$visible) && this.$visible) {
				this.$setVisible(false)
			}
		}
		switch (this.m_Type) {
			case GuideHand.TYPE_STAND:
				this.OnTargetPosition()
				break
			case GuideHand.TYPE_MOVE:
				if (this.m_PosInvalid) {
					this.OnMoveTargetPosition()
					this.m_PosInvalid = false
				} else {
					this.m_Time += delta
					let tmp
					if (this.m_Time >= this.m_Duration) {
						tmp = 1
						this.m_Duration = 0
					} else {
						tmp = this.m_Time / this.m_Duration
					}
					tmp = egret.Ease.sineOut(tmp)
					MathUtils.Lerp(this.m_CX, this.m_CY, this.m_EX, this.m_EY, tmp, this.group)
					if (tmp >= 1) {
						this.m_Type = GuideHand.TYPE_STAND
						this.Play()
					}
				}
				break
		}
	}

	private SetTargetData(guideId: number, stepId: number, objParent: BaseView, obj: egret.DisplayObject) {
		if (this.m_Target == obj) {
			if (this.m_Listener.ResetFunc) {
				this.m_Listener.ResetFunc(guideId, stepId)
			}
			return
		}
		if (this.m_Target) {
			this.RemoveTargetEvent()
		}
		if (!this.m_Target) {
			this.m_ObjParent = objParent
			this.AddTargetEvent(obj, guideId, stepId)
		}
	}

	public ShowTarget(guildId: number, stepId: number, objParent: BaseView, obj: egret.DisplayObject) {
		this.SetTargetData(guildId, stepId, objParent, obj)
		this.m_PosInvalid = true
		this.m_Type = GuideHand.TYPE_STAND
		this.Play()
	}

	public MoveToTarget(guildId: number, stepId: number, objParent: BaseView, obj: egret.DisplayObject) {
		this.SetTargetData(guildId, stepId, objParent, obj)
		this.m_PosInvalid = true
		this.m_Type = GuideHand.TYPE_MOVE
		this.Pause()
	}
}