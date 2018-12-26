class BaseView extends eui.Component {

	public mIsAutoSkin = true

	private m_IsOpen: boolean = false

    public static RedPointCheck(): boolean {
        return false
    }

	constructor() {
		super()
		let name = Util.GetClass(this).NAME
		if (name) {
			this.name = name
		}
		// this.addEventListener(egret.Event.COMPLETE, this._DoComp, this)
	}

	$setParent(parent: egret.DisplayObjectContainer): boolean {
		let oldParent = this.$parent
		let ret = super.$setParent(parent)
		if (ret) {
			if (oldParent) {
				let view = Util.GetParentByType(parent, BaseEuiView) as BaseEuiView
				if (view && view.UnRefBaseView) {
					view.UnRefBaseView(this)
				}
			}
			if (parent) {
				let view = Util.GetParentByType(parent, BaseEuiView) as BaseEuiView
				if (view && view.RefBaseView) {
					view.RefBaseView(this)
				}
			}
		}
		return ret
	}

	private m_EventList = []

	protected _AddClick(targetObj: egret.DisplayObject, func: Function): void {
		this._AddEvent(egret.TouchEvent.TOUCH_TAP, targetObj, func)
	}

	protected _AddItemClick(target: egret.DisplayObject, func: Function): void {
		this._AddEvent(eui.ItemTapEvent.ITEM_TAP, target, func)
	}

	protected _AddChange(targetObj: egret.DisplayObject, func: Function): void {
		this._AddEvent(egret.TouchEvent.CHANGE, targetObj, func)
	}

	protected _AddEvent(event: string, targetObj: egret.DisplayObject, func: Function) {
		if (targetObj == null) {
            console.log("没有给定目标控件", this["__class__"])
			return;
		}
		let list = this.m_EventList
		for (var i = 0; i < list.length; ++i) {
			if (list[i].addObject == targetObj) {
				return
			}
		}

		var data = new EventListenerData(targetObj, event, func, this, false, 0);
		list.push(data)
	}

    public destoryView() {
        this.OnDestroy()
        TimerManager.ins().removeAll(this);
		let list = this.m_EventList
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].clean();
		}
		this.m_EventList = []
        this.UnrefSkin()
    }

	protected OnDestroy() {

	}

	private eventList: EventListenerData[] = []

	public AddTimer(delay: number, repeatCount: number, func: Function) {
		 TimerManager.ins().doTimer(delay, repeatCount, func, this);
	}

	public AddLoopTimer(delay: number, func: Function) {
		func.call(this)
		TimerManager.ins().doTimer(1000, 0, func, this);
	}

	public RemoveTimer(func: Function) {
		TimerManager.ins().remove(func, this)
	}

	observe(event: string, func: Function): void {
		MessageCenter.ins().addListener(event, func, this)
	}

	removeObserve() {
		MessageCenter.ins().removeAll(this)
	}

    AddClick(target: egret.DisplayObject, func: Function): void {
        this.AddEvent(egret.TouchEvent.TOUCH_TAP, func, this, target)
	}

	AddItemClick(target: egret.DisplayObject, func: Function): void {
		this.AddEvent(eui.ItemTapEvent.ITEM_TAP, func, this, target)
	}

	AddChange(target: egret.DisplayObject, func: Function) {
		this.AddEvent(egret.TouchEvent.CHANGE, func, this, target)
	}

	AddEvent(event: string, func: Function, thisObject: any, targetObj: egret.DisplayObject = null, useCapture: boolean = false) {
		if (targetObj == null) {
			// targetObj = this;
            console.log("没有给定目标控件", this["__class__"])
			return;
		}

		for (var i = 0, list = this.eventList; i < list.length; ++i) {
			if (list[i].addObject == targetObj) {
				// console.debug("重复绑定对象", this["__class__"])
				return
			}
		}

		var data = new EventListenerData(targetObj, event, func, thisObject, useCapture, 0);
		if (data) {
			this.eventList.push(data)
		} else {
			console.log("绑定侦听事件失败")
		}
	}

	removeEvents(): void {
        let list = this.eventList
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].clean();
		}
		this.eventList = []
	}

	private static EMPTY = []

    public DoOpen(param: any = null) {
		if (!this.m_IsOpen) {
			this.m_IsOpen = true
	        this.OnOpen.apply(this, param || BaseView.EMPTY);
		}
		this.OnResume.apply(this, param || BaseView.EMPTY)
	}

	public DoClose(...param: any[]) {
		if (!this.m_IsOpen) {
			return
		}
		this.m_IsOpen = false
        this.OnClose.apply(this, param);
		for (var i = 0; i < this.numChildren; i++) {
			var child = this.getChildAt(i);
			if (egret.is(child, "BaseView")) {
				(child as BaseView).DoClose(param)
			}
		}
		this.removeEvents()
		this.removeObserve()
		TimerManager.ins().removeAll(this)
	}

	/**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    public OnOpen(...param: any[]) {
    }

	/**
	 * 重复开启面板执行
	 */
	public OnResume(...param: any[]) {

	}

	/**
	 * 面板关闭执行函数，用于子类继承
	 */
    public OnClose() {
    }

	private m_RefSkinName: string = null

	public $parseSkinName():void {
		super.$parseSkinName()
		let skinName = this.skinName
		if (this.m_RefSkinName == skinName) {
			return
		}
		this.UnrefSkin()
		this.m_RefSkinName = skinName
		this.RefSkin()
	}

	protected RefSkin(): void {
		if (this.m_RefSkinName) {
			ResMgr.RefSkin(this.m_RefSkinName)
		}
	}

	protected UnrefSkin(): void {
		if (this.m_RefSkinName) {
			ResMgr.UnrefSkin(this.m_RefSkinName)
			this.m_RefSkinName = null
		}
	}

	$onRemoveFromStage(): void {
		super.$onRemoveFromStage();
		if (this.mIsAutoSkin) {
			this.UnrefSkin()
		}
	}

	public CheckUnrefSkin() {
		if (!this.$stage && this.mIsAutoSkin) {
			this.UnrefSkin()
		}
	}
}