var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CommonWindowBg = (function (_super) {
    __extends(CommonWindowBg, _super);
    function CommonWindowBg() {
        var _this = _super.call(this) || this;
        _this.mHelpId = null;
        _this.mHelpTitle = null;
        _this._Added = false;
        return _this;
    }
    Object.defineProperty(CommonWindowBg.prototype, "title", {
        set: function (value) {
            this.m_Title = value;
        },
        enumerable: true,
        configurable: true
    });
    CommonWindowBg.prototype.setHelp = function (help, title) {
        this.mHelpId = help;
        if (!title) {
            return;
        }
        this.mHelpTitle = title;
    };
    CommonWindowBg.prototype.$setParent = function (parent) {
        var ret = _super.prototype.$setParent.call(this, parent);
        if (ret && parent) {
            if (egret.is(parent, "BaseEuiView")) {
                if (parent.mCommonWindowBg) {
                    console.error("repeat add commonwindowbg => " + egret.getQualifiedClassName(parent));
                }
                else {
                    parent.mCommonWindowBg = this;
                }
            }
            else {
                console.error("parent not baseeuiview ");
            }
        }
        return ret;
    };
    CommonWindowBg.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    CommonWindowBg.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.touchEnabled = false;
        // this.touchChildren = true
        if (this.viewStack) {
            this.viewStack.touchEnabled = false;
        }
        this.m_TabDatas = this.viewStack;
        if (this.viewStack == null) {
            this.viewStack = CommonWindowBg.EMPTY_CLS;
        }
        if (this.tabBar == null) {
            this.tabBar = CommonWindowBg.EMPTY_CLS;
        }
        this.tabBar.itemRenderer = WindowTabBarItem;
    };
    CommonWindowBg.prototype.OnTap = function (touchEvent) {
        var target = touchEvent.target;
        if (target == this.helpBtn && this.mHelpId) {
            ViewManager.ins().open(ActivityDescPanel, this.mHelpId, this.mHelpTitle);
            return;
        }
        var clickIndex = 0;
        switch (target) {
            case this.returnBtn:
                clickIndex = 0;
                break;
            case this.closeBtn:
                clickIndex = 1;
                break;
        }
        if (this.m_CommonWindow && this.m_CommonWindow.OnBackClick) {
            if (this.m_CommonWindow.OnBackClick(clickIndex) == 0) {
                ViewManager.ins().close(this.m_CommonWindow);
            }
        }
        else {
            ViewManager.ins().close(this.m_CommonWindow);
        }
    };
    CommonWindowBg.prototype._CheckTab = function (index) {
        var cls = null;
        if (egret.is(this.viewStack, "TabView")) {
            cls = this.viewStack.GetElementCls(index);
        }
        else {
            cls = Util.GetClass(this.viewStack.getElementAt(index));
        }
        if (cls && cls.openCheck && !cls.openCheck()) {
            return false;
        }
        var bool = this.m_CommonWindow.OnOpenIndex ? this.m_CommonWindow.OnOpenIndex(index) : true;
        if (!bool) {
            return false;
        }
        return true;
    };
    CommonWindowBg.prototype._OnTabTap = function () {
        var check = this._CheckTab(this.tabBar.selectedIndex);
        if (!check) {
            this.tabBar.selectedIndex = this.m_OldIndex;
        }
    };
    CommonWindowBg.prototype._OnTabChange = function () {
        if (this.viewStack.selectedIndex != this.m_OldIndex) {
            this.m_OldIndex = this.viewStack.selectedIndex;
            this._UpdateRoleSelectVisible();
            this._UpdateTitle();
            this._UpdateHelpBtn();
            // this._UpdateRoleSelect()
            this._SetCurShowView(this._GetCurViewStackElement());
            this._UpdateViewContent();
        }
    };
    CommonWindowBg.prototype.SetTabIndex = function (index) {
        if (this._CheckTab(index)) {
            this.viewStack.selectedIndex = index;
            this._OnTabChange();
        }
    };
    CommonWindowBg.prototype._OnRoleSelect = function () {
        // this._UpdateRoleSelect()
        this._UpdateViewContent();
    };
    CommonWindowBg.prototype._GetCurViewStackElement = function () {
        var view = this.viewStack.getElementAt(this.viewStack.selectedIndex);
        return view;
        // if (egret.is(view, "ICommonWindowTitle")) {
        // 	return <ICommonWindowTitle><any>view
        // } else {
        // 	// console.log(`CommonWindowTitle:_GetCurViewStackElement view is null, index = ${this.viewStack.selectedIndex}`)
        // }
        // return null
    };
    CommonWindowBg.prototype.GetCurViewStackElement = function () {
        return this.viewStack.getElementAt(this.viewStack.selectedIndex);
    };
    CommonWindowBg.prototype.GetViewStackElementByIndex = function (index) {
        return this.viewStack.getElementAt(index);
    };
    CommonWindowBg.prototype.GetViewByClassType = function (cls) {
        for (var i = 0; i < this.viewStack.length; i++) {
            var view = this.viewStack.getElementAt(i);
            if (view && Util.GetClass(view) == cls) {
                return view;
            }
        }
        return null;
    };
    /**
     * 更新界面Title的显示
     */
    CommonWindowBg.prototype._UpdateTitle = function () {
        var iconName;
        var view = this._GetCurViewStackElement();
        if (view) {
            iconName = view["windowTitleIconName"];
            if (!iconName && !this.m_Title) {
                iconName = view.name;
            }
        }
        if (!iconName) {
            if (egret.is(this.m_CommonWindow, "ICommonWindowTitle")) {
                iconName = this.m_CommonWindow.windowTitleIconName;
            }
        }
        if (!iconName) {
            iconName = this.m_Title;
        }
        if (iconName && this.nameIcon) {
            if (egret.is(this.nameIcon, "eui.BitmapLabel")) {
                this.nameIcon.text = iconName;
            }
            else {
                this.nameIcon.source = iconName;
            }
        }
    };
    CommonWindowBg.prototype.SetTitle = function (title) {
        if (egret.is(this.nameIcon, "eui.BitmapLabel")) {
            this.nameIcon.text = title;
        }
        else {
            this.nameIcon.source = title;
        }
    };
    /**
     * 更新界面内容
     */
    CommonWindowBg.prototype._UpdateViewContent = function () {
        var view = this._GetCurViewStackElement();
        if (view) {
            if (view["UpdateContent"]) {
                view["UpdateContent"]();
            }
        }
        else {
            if (egret.is(this.m_CommonWindow, "ICommonWindowTitle")) {
                this.m_CommonWindow.UpdateContent();
            }
        }
    };
    CommonWindowBg.prototype._SetCurShowView = function (view, data) {
        if (data === void 0) { data = null; }
        if (this.m_CurShowView && this.m_CurShowView["DoClose"]) {
            this.m_CurShowView["DoClose"]();
            this.m_CurShowView = null;
        }
        this.m_CurShowView = view;
        if (this.m_CurShowView && this.m_CurShowView["DoOpen"]) {
            if (egret.is(view, "ICommonWindowRoleSelect")) {
                // (<ICommonWindowRoleSelect><any>view).m_RoleSelectPanel = this.roleSelect
            }
            if (egret.is(view, "BaseView")) {
                // (view as BaseView).mCommonWindowBg = this
            }
            if (data != null) {
                data = [data];
            }
            this.m_CurShowView["DoOpen"](data);
        }
    };
    CommonWindowBg.prototype._UpdateRoleSelectVisible = function () {
        // 如果当前是角色选择页
        var view = this._GetCurViewStackElement();
    };
    CommonWindowBg.prototype.SetTabView = function (datas) {
        if (!egret.is(this.viewStack, "TabView")) {
            console.error("not tabview !!!");
            return;
        }
        var tabView = this.viewStack;
        tabView.tabChildren = datas;
    };
    CommonWindowBg.prototype.SetViewStack = function (viewStack) {
        if (viewStack == null) {
            console.error("commonwindowbg:setviewstack stack is null!!!");
            return;
        }
        this.viewStack = viewStack;
        this.m_TabDatas = this.viewStack;
    };
    CommonWindowBg.prototype.SetTabDatas = function (datas) {
        this.m_TabDatas = datas;
    };
    CommonWindowBg.prototype.AddChildStack = function (view) {
        this.viewStack.addChild(view);
    };
    CommonWindowBg.prototype.SetChildStack = function (views) {
        this.viewStack.elementsContent = views;
    };
    CommonWindowBg.prototype.OnAdded = function (commonWindow, index, subData) {
        if (index === void 0) { index = 0; }
        if (subData === void 0) { subData = null; }
        this._Added = true;
        this.m_CommonWindow = commonWindow;
        var len = this.m_TabDatas ? (this.m_TabDatas.length || 0) : 0;
        if (index >= len) {
            index = 0;
        }
        this.m_OldIndex = index;
        this.tabBar.dataProvider = this.m_TabDatas;
        this.TabBarSetData(this.tabBar, this.m_TabDatas);
        this.tabBar.validateNow();
        this.viewStack.selectedIndex = index;
        if (this.returnBtn) {
            this.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this);
        }
        if (this.helpBtn) {
            this.helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this);
        }
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this);
        this.tabBar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTabTap, this);
        this.tabBar.addEventListener(egret.Event.CHANGE, this._OnTabChange, this);
        // if (egret.is(this.m_CommonWindow, "ICommonWindowRoleSelect")) {
        // 	(<ICommonWindowRoleSelect><any>this.m_CommonWindow).m_RoleSelectPanel = this.roleSelect
        // }
        // 更新标题
        this._UpdateTitle();
        this._UpdateHelpBtn();
        // 更新角色选择状态
        this._UpdateRoleSelectVisible();
        // 子面板open
        this._SetCurShowView(this._GetCurViewStackElement(), subData);
        // 子面板更新数据
        this._UpdateViewContent();
        if (this.m_CommonWindow) {
            DisplayUtils.ChangeParent(this.closeBtn, this.m_CommonWindow);
        }
        if (this.m_CommonWindow && this.helpBtn) {
            DisplayUtils.ChangeParent(this.helpBtn, this.m_CommonWindow);
        }
    };
    CommonWindowBg.prototype.OnRemoved = function () {
        if (!this._Added) {
            return;
        }
        this._Added = false;
        if (this.returnBtn)
            this.returnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this);
        this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this);
        this.tabBar.removeEventListener(egret.Event.CHANGE, this._OnTabChange, this);
        this.tabBar.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTabTap, this);
        if (this.helpBtn) {
            this.helpBtn.removeEventListener(egret.TouchEvent.CHANGE, this.OnTap, this);
        }
        if (this.tabBar != null) {
            this.tabBar.dataProvider = null;
        }
        this.tabBar.itemRenderer = WindowTabBarItem;
        this._SetCurShowView(null);
        this.m_CommonWindow = null;
    };
    CommonWindowBg.prototype.OnDestroy = function () {
        for (var i = 0; i < this.viewStack.numChildren; ++i) {
            var view = this.viewStack.getChildAt(i);
            if (view && view["OnDestroy"]) {
                view["OnDestroy"]();
            }
        }
        // if (egret.is(this.viewStack, "NewViewStack")) {
        // 	this.m_TabDatas = null;
        // 	(<NewViewStack>this.viewStack).destroy();
        // }
    };
    CommonWindowBg.prototype._UpdateHelpBtn = function () {
        if (!this.helpBtn) {
            return;
        }
        var helpId;
        var view = this._GetCurViewStackElement();
        if (view) {
            helpId = view["mWindowHelpId"];
        }
        if (!helpId) {
            helpId = this.m_CommonWindow.mWindowHelpId;
        }
        this.helpBtn.visible = helpId != null;
        this.mHelpId = helpId;
    };
    CommonWindowBg.prototype.GetSelectedIndex = function () {
        return this.viewStack.selectedIndex;
    };
    CommonWindowBg.prototype.CloseStack = function (index) {
        this.viewStack.getElementAt(index)['DoClose']();
    };
    CommonWindowBg.prototype.ClearTalRedPoint = function () {
        for (var i = 0; i < this.tabBar.numChildren; ++i) {
            this.ShowTalRedPoint(i, false);
        }
    };
    CommonWindowBg.prototype._GetTalRedTarget = function (index) {
        if (index >= this.tabBar.numElements) {
            return;
        }
        var obj = this.tabBar.getElementAt(index);
        if (!obj) {
            return;
        }
        return obj["redPoint"];
    };
    CommonWindowBg.prototype.ShowTalRedPoint = function (index, isShow) {
        var redPoint = this._GetTalRedTarget(index);
        if (redPoint) {
            redPoint.visible = isShow;
        }
    };
    CommonWindowBg.prototype.CheckTalRedPoint = function (index) {
        var cls = null;
        if (egret.is(this.viewStack, "TabView")) {
            var list = this.viewStack["childrenList"];
            if (list) {
                var data = list[index];
                if (data) {
                    if (data.obj) {
                        cls = Util.GetClass(data.obj);
                    }
                    else {
                        cls = egret.getDefinitionByName(data.className);
                    }
                }
            }
        }
        else {
            cls = Util.GetClass(this.viewStack.getElementAt(index));
        }
        if (cls && cls.RedPointCheck) {
            var state = cls.RedPointCheck();
            this.ShowTalRedPoint(index, state);
        }
    };
    CommonWindowBg.prototype.CheckTabRedPoint = function () {
        var ret = false;
        for (var i = 0; i < this.viewStack.numElements; ++i) {
            var view = this.viewStack.getElementAt(i);
            if (view["CheckRedPoint"]) {
                var redpoint = view["CheckRedPoint"]();
                this.ShowTalRedPoint(i, redpoint);
                if (redpoint)
                    ret = true;
            }
        }
        return ret;
    };
    // public SetRoleSelectVisible(visible: boolean): void {
    // 	this.roleSelect.visible = visible
    // }
    CommonWindowBg.prototype.TabBarSetData = function (bar, value) {
        var dp = bar.$dataProvider;
        if (dp && egret.is(dp, "TabView")) {
            dp.removeEventListener(eui.PropertyEvent.PROPERTY_CHANGE, bar.onViewStackIndexChange, bar);
            bar.removeEventListener(egret.Event.CHANGE, bar.onIndexChanged, bar);
        }
        if (value && egret.is(value, "TabView")) {
            value.addEventListener(eui.PropertyEvent.PROPERTY_CHANGE, bar.onViewStackIndexChange, bar);
            bar.addEventListener(egret.Event.CHANGE, bar.onIndexChanged, bar);
        }
    };
    CommonWindowBg.EMPTY_CLS = {
        "getCurRole": function () { return 0; },
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
    };
    return CommonWindowBg;
}(eui.Component));
__reflect(CommonWindowBg.prototype, "CommonWindowBg", ["eui.UIComponent", "egret.DisplayObject"]);
var WindowTabBarItem = (function (_super) {
    __extends(WindowTabBarItem, _super);
    function WindowTabBarItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    WindowTabBarItem.prototype.dataChanged = function () {
        var data = this.data;
        this.labelDisplay.text = data.name;
        if (data.notShow) {
            UIHelper.SetVisible(this, false);
        }
        else {
            UIHelper.SetVisible(this, true);
        }
    };
    return WindowTabBarItem;
}(eui.ItemRenderer));
__reflect(WindowTabBarItem.prototype, "WindowTabBarItem");
//# sourceMappingURL=CommonWindowBg.js.map