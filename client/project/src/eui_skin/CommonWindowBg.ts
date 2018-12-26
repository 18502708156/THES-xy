class CommonWindowBg extends eui.Component implements eui.UIComponent {

	public constructor() {
		super();
	}

	private m_CommonWindow: any

	public returnBtn: eui.Button
	public closeBtn: eui.Button
	public helpBtn: eui.Button
	private nameIcon: eui.Label
	public tabBar: eui.TabBar
	public viewStack: eui.ViewStack | TabView

	private m_CurShowView: BaseView
	private m_TabDatas: eui.ICollection
	private m_OldIndex: number

	private mHelpId = null
	private mHelpTitle = null

	private static EMPTY_CLS = {
		"getCurRole": function () { return 0 },
		"DoOpen": function () { },
		"onViewStackIndexChange": function () { },
		"DoClose": function () { },
		"addEventListener": function () { },
		"removeEventListener": function () { },
		"visible": false,
		"numElements": 0,
		"numChildren": 0,
		"selectedIndex": 0,
		"validateNow": function () { },
		"getElementAt": function () { },
	}

	private m_Title: string

	public set title(value) {
		this.m_Title = value
	}

	public setHelp(help: number, title: string) {
		this.mHelpId = help;
		if (!title) {
			return
		}
		this.mHelpTitle = title
	}

	$setParent(parent: egret.DisplayObjectContainer): boolean {
		let ret = super.$setParent(parent)
		if (ret && parent) {
			if (egret.is(parent, "BaseEuiView")) {
				if ((parent as BaseEuiView).mCommonWindowBg) {
					console.error("repeat add commonwindowbg => " + egret.getQualifiedClassName(parent))
				} else {
					(parent as BaseEuiView).mCommonWindowBg = this
				}
			} else {
				console.error("parent not baseeuiview ")
			}
		}
		return ret
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.touchEnabled = false
		// this.touchChildren = true
		if (this.viewStack) {
			this.viewStack.touchEnabled = false
		}

		this.m_TabDatas = this.viewStack


		if (this.viewStack == null) {
			this.viewStack = <eui.ViewStack><any>CommonWindowBg.EMPTY_CLS
		}
		if (this.tabBar == null) {
			this.tabBar = <eui.TabBar><any>CommonWindowBg.EMPTY_CLS
		}
		this.tabBar.itemRenderer = WindowTabBarItem
	}

	private OnTap(touchEvent: egret.TouchEvent): void {
		let target = touchEvent.target
		if (target == this.helpBtn && this.mHelpId) {
			ViewManager.ins().open(ActivityDescPanel, this.mHelpId, this.mHelpTitle);
			return
		}
		let clickIndex = 0
		switch (target) {
			case this.returnBtn:
				clickIndex = 0
				break;

			case this.closeBtn:
				clickIndex = 1
				break;
		}
		if (this.m_CommonWindow && this.m_CommonWindow.OnBackClick) {
			if (this.m_CommonWindow.OnBackClick(clickIndex) == 0) {
				ViewManager.ins().close(this.m_CommonWindow)
			}
		} else {
			ViewManager.ins().close(this.m_CommonWindow)
		}
	}

	private _CheckTab(index: number): boolean {
		let cls = null
		if (egret.is(this.viewStack, "TabView")) {
			cls = (this.viewStack as TabView).GetElementCls(index)
		} else {
			cls = Util.GetClass(this.viewStack.getElementAt(index))
		}
		if (cls && cls.openCheck && !cls.openCheck()) {
			return false
		}
		let bool = this.m_CommonWindow.OnOpenIndex ? this.m_CommonWindow.OnOpenIndex(index) : true
		if (!bool) {
			return false
		}
		return true
	}

	private _OnTabTap(): void {
		let check = this._CheckTab(this.tabBar.selectedIndex)
		if (!check) {
			this.tabBar.selectedIndex = this.m_OldIndex
		}
	}

	private _OnTabChange(): void {
		if (this.viewStack.selectedIndex != this.m_OldIndex) {
			this.m_OldIndex = this.viewStack.selectedIndex
			this._UpdateRoleSelectVisible()
			this._UpdateTitle()
			this._UpdateHelpBtn()
			// this._UpdateRoleSelect()
			this._SetCurShowView(this._GetCurViewStackElement())

			this._UpdateViewContent()
		}
	}

	public SetTabIndex(index): void {
		if (this._CheckTab(index)) {
			this.viewStack.selectedIndex = index
			this._OnTabChange()
		}
	}

	private _OnRoleSelect(): void {
		// this._UpdateRoleSelect()
		this._UpdateViewContent()
	}

	private _GetCurViewStackElement(): BaseView {
		let view = this.viewStack.getElementAt(this.viewStack.selectedIndex) as BaseView
		return view
		// if (egret.is(view, "ICommonWindowTitle")) {
		// 	return <ICommonWindowTitle><any>view
		// } else {
		// 	// console.log(`CommonWindowTitle:_GetCurViewStackElement view is null, index = ${this.viewStack.selectedIndex}`)
		// }
		// return null
	}

	public GetCurViewStackElement(): any {
		return this.viewStack.getElementAt(this.viewStack.selectedIndex)
	}

	public GetViewStackElementByIndex(index): any {
		return this.viewStack.getElementAt(index)
	}

	public GetViewByClassType(cls: any): egret.DisplayObject {
		for (let i = 0; i < this.viewStack.length; i++) {
			let view = this.viewStack.getElementAt(i)
			if (view && Util.GetClass(view) == cls) {
				return view
			}
		}
		return null
	}

	/**
	 * 更新界面Title的显示
	 */
	private _UpdateTitle(): void {
		let iconName
		let view = this._GetCurViewStackElement()
		if (view) {
			iconName = view["windowTitleIconName"]
			if (!iconName && !this.m_Title) {
				iconName = (<egret.DisplayObjectContainer><any>view).name
			}
		}
		if (!iconName) {
			if (egret.is(this.m_CommonWindow, "ICommonWindowTitle")) {
				iconName = (<ICommonWindowTitle><any>this.m_CommonWindow).windowTitleIconName
			}
		}
		if (!iconName) {
			iconName = this.m_Title
		}
		if (iconName && this.nameIcon) {
			if (egret.is(this.nameIcon, "eui.BitmapLabel")) {
				(this.nameIcon as eui.Label).text = iconName
			} else {
				(this.nameIcon as any).source = iconName
			}
		}
	}

	public SetTitle(title: string) {
		if (egret.is(this.nameIcon, "eui.BitmapLabel")) {
			(this.nameIcon as eui.Label).text = title
		} else {
			(this.nameIcon as any).source = title
		}
	}

	/**
	 * 更新界面内容
	 */
	private _UpdateViewContent(): void {
		let view = this._GetCurViewStackElement()
		if (view) {
			if (view["UpdateContent"]) {
				view["UpdateContent"]()
			}
		} else {
			if (egret.is(this.m_CommonWindow, "ICommonWindowTitle")) {
				(<ICommonWindowTitle><any>this.m_CommonWindow).UpdateContent()
			}
		}
	}

	private _SetCurShowView(view: BaseView, data: any = null) {
		if (this.m_CurShowView && this.m_CurShowView["DoClose"]) {
			this.m_CurShowView["DoClose"]()
			this.m_CurShowView = null
		}
		this.m_CurShowView = view
		if (this.m_CurShowView && this.m_CurShowView["DoOpen"]) {
			if (egret.is(view, "ICommonWindowRoleSelect")) {
				// (<ICommonWindowRoleSelect><any>view).m_RoleSelectPanel = this.roleSelect
			}
			if (egret.is(view, "BaseView")) {
				// (view as BaseView).mCommonWindowBg = this
			}
			if (data != null) {
				data = [data]
			}
			this.m_CurShowView["DoOpen"](data)
		}
	}

	private _UpdateRoleSelectVisible() {
		// 如果当前是角色选择页
		let view = this._GetCurViewStackElement()

	}

	public SetTabView(datas: ITabViewData[]) {
		if (!egret.is(this.viewStack, "TabView")) {
			console.error("not tabview !!!")
			return
		}
		let tabView = this.viewStack as TabView
		tabView.tabChildren = datas
	}

	public SetViewStack(viewStack: eui.ViewStack | TabView) {
		if (viewStack == null) {
			console.error("commonwindowbg:setviewstack stack is null!!!")
			return
		}
		this.viewStack = viewStack
		this.m_TabDatas = this.viewStack
	}

	public SetTabDatas(datas: eui.ICollection): void {
		this.m_TabDatas = datas
	}

	public AddChildStack(view: eui.Component) {
		this.viewStack.addChild(view)
	}

	public SetChildStack(views: egret.DisplayObject[]) {
		this.viewStack.elementsContent = views
	}

	private _Added = false

	public OnAdded(commonWindow: ICommonWindow, index: number = 0, subData: any = null): void {
		this._Added = true
		this.m_CommonWindow = commonWindow

		let len = this.m_TabDatas ? (this.m_TabDatas.length || 0) : 0
		if (index >= len) {
			index = 0
		}

		this.m_OldIndex = index
		this.tabBar.dataProvider = this.m_TabDatas
		this.TabBarSetData(this.tabBar, this.m_TabDatas)
		this.tabBar.validateNow()

		this.viewStack.selectedIndex = index

		if (this.returnBtn) {
			this.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		}
		if (this.helpBtn) {
			this.helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		}
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		this.tabBar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTabTap, this)
		this.tabBar.addEventListener(egret.Event.CHANGE, this._OnTabChange, this)

		// if (egret.is(this.m_CommonWindow, "ICommonWindowRoleSelect")) {
		// 	(<ICommonWindowRoleSelect><any>this.m_CommonWindow).m_RoleSelectPanel = this.roleSelect
		// }

		// 更新标题
		this._UpdateTitle()
		this._UpdateHelpBtn()
		// 更新角色选择状态
		this._UpdateRoleSelectVisible()
		// 子面板open
		this._SetCurShowView(this._GetCurViewStackElement(), subData)
		// 子面板更新数据
		this._UpdateViewContent()

		if (this.m_CommonWindow) {
			DisplayUtils.ChangeParent(this.closeBtn, this.m_CommonWindow as any)
		}
		if (this.m_CommonWindow && this.helpBtn) {
			DisplayUtils.ChangeParent(this.helpBtn, this.m_CommonWindow as any)
		}
	}

	public OnRemoved(): void {
		if (!this._Added) {
			return
		}
		this._Added = false
		if (this.returnBtn) this.returnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		this.tabBar.removeEventListener(egret.Event.CHANGE, this._OnTabChange, this)
		this.tabBar.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTabTap, this)
		if (this.helpBtn) {
			this.helpBtn.removeEventListener(egret.TouchEvent.CHANGE, this.OnTap, this)
		}
		if (this.tabBar != null) {
			this.tabBar.dataProvider = null
		}
		this.tabBar.itemRenderer = WindowTabBarItem

		this._SetCurShowView(null)

		this.m_CommonWindow = null
	}

	public OnDestroy() {
		for (let i = 0; i < this.viewStack.numChildren; ++i) {
			let view = this.viewStack.getChildAt(i)
			if (view && view["OnDestroy"]) {
				view["OnDestroy"]()
			}
		}
		// if (egret.is(this.viewStack, "NewViewStack")) {
		// 	this.m_TabDatas = null;
		// 	(<NewViewStack>this.viewStack).destroy();
		// }
	}

	private _UpdateHelpBtn() {
		if (!this.helpBtn) {
			return
		}
		let helpId
		let view = this._GetCurViewStackElement()
		if (view) {
			helpId = view["mWindowHelpId"]
		}
		if (!helpId) {
			helpId = this.m_CommonWindow.mWindowHelpId
		}
		this.helpBtn.visible = helpId != null
		this.mHelpId = helpId
	}

	public GetSelectedIndex(): number {
		return this.viewStack.selectedIndex
	}

	public CloseStack(index: number): void {
		this.viewStack.getElementAt(index)['DoClose']();
	}

	public ClearTalRedPoint(): void {
		for (let i = 0; i < this.tabBar.numChildren; ++i) {
			this.ShowTalRedPoint(i, false)
		}
	}

	private _GetTalRedTarget(index: number): eui.Image {
		if (index >= this.tabBar.numElements) {
			return
		}
		let obj = this.tabBar.getElementAt(index)
		if (!obj) {
			return
		}
		return obj["redPoint"]
	}

	public ShowTalRedPoint(index: number, isShow: boolean) {
		let redPoint = this._GetTalRedTarget(index)
		if (redPoint) {
			redPoint.visible = isShow
		}
	}

	public CheckTalRedPoint(index: number) {
		let cls = null
		if (egret.is(this.viewStack, "TabView")) {
			let list = this.viewStack["childrenList"]
			if (list) {
				let data = list[index]
				if (data) {
					if (data.obj) {
						cls = Util.GetClass(data.obj)
					} else {
						cls = egret.getDefinitionByName(data.className)
					}
				}
			}
		} else {
			cls = Util.GetClass(this.viewStack.getElementAt(index))
		}
		if (cls && cls.RedPointCheck) {
			let state = cls.RedPointCheck()
			this.ShowTalRedPoint(index, state)
		}
	}

	public CheckTabRedPoint(): boolean {
		var ret = false
		for (let i = 0; i < this.viewStack.numElements; ++i) {
			let view = this.viewStack.getElementAt(i)
			if (view["CheckRedPoint"]) {
				let redpoint = view["CheckRedPoint"]()
				this.ShowTalRedPoint(i, redpoint)
				if (redpoint) ret = true
			}
		}
		return ret
	}

	// public SetRoleSelectVisible(visible: boolean): void {
	// 	this.roleSelect.visible = visible
	// }

	private TabBarSetData(bar: eui.TabBar, value: eui.ICollection) {
		let dp = bar.$dataProvider;
		if (dp && egret.is(dp, "TabView")) {
			dp.removeEventListener(eui.PropertyEvent.PROPERTY_CHANGE, (bar as any).onViewStackIndexChange, bar);
			bar.removeEventListener(egret.Event.CHANGE, (bar as any).onIndexChanged, bar);
		}
		if (value && egret.is(value, "TabView")) {
			value.addEventListener(eui.PropertyEvent.PROPERTY_CHANGE, (bar as any).onViewStackIndexChange, bar);
			bar.addEventListener(egret.Event.CHANGE, (bar as any).onIndexChanged, bar);
		}
	}
}

class WindowTabBarItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
    // BtnTab0Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected redPoint: eui.Image;
    protected labelDisplay: eui.Label;
    protected jjkh_img: eui.Image;
    /////////////////////////////////////////////////////////////////////////////


	dataChanged() {
		let data = this.data
		this.labelDisplay.text = data.name;
		if (data.notShow) {
			UIHelper.SetVisible(this, false)
		} else {
			UIHelper.SetVisible(this, true)
		}
	}	
}