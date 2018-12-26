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
var BaseView = (function (_super) {
    __extends(BaseView, _super);
    function BaseView() {
        var _this = _super.call(this) || this;
        _this.mIsAutoSkin = true;
        _this.m_IsOpen = false;
        _this.m_EventList = [];
        _this.eventList = [];
        _this.m_RefSkinName = null;
        var name = Util.GetClass(_this).NAME;
        if (name) {
            _this.name = name;
        }
        return _this;
        // this.addEventListener(egret.Event.COMPLETE, this._DoComp, this)
    }
    BaseView.RedPointCheck = function () {
        return false;
    };
    BaseView.prototype.$setParent = function (parent) {
        var oldParent = this.$parent;
        var ret = _super.prototype.$setParent.call(this, parent);
        if (ret) {
            if (oldParent) {
                var view = Util.GetParentByType(parent, BaseEuiView);
                if (view && view.UnRefBaseView) {
                    view.UnRefBaseView(this);
                }
            }
            if (parent) {
                var view = Util.GetParentByType(parent, BaseEuiView);
                if (view && view.RefBaseView) {
                    view.RefBaseView(this);
                }
            }
        }
        return ret;
    };
    BaseView.prototype._AddClick = function (targetObj, func) {
        this._AddEvent(egret.TouchEvent.TOUCH_TAP, targetObj, func);
    };
    BaseView.prototype._AddItemClick = function (target, func) {
        this._AddEvent(eui.ItemTapEvent.ITEM_TAP, target, func);
    };
    BaseView.prototype._AddChange = function (targetObj, func) {
        this._AddEvent(egret.TouchEvent.CHANGE, targetObj, func);
    };
    BaseView.prototype._AddEvent = function (event, targetObj, func) {
        if (targetObj == null) {
            console.log("没有给定目标控件", this["__class__"]);
            return;
        }
        var list = this.m_EventList;
        for (var i = 0; i < list.length; ++i) {
            if (list[i].addObject == targetObj) {
                return;
            }
        }
        var data = new EventListenerData(targetObj, event, func, this, false, 0);
        list.push(data);
    };
    BaseView.prototype.destoryView = function () {
        this.OnDestroy();
        TimerManager.ins().removeAll(this);
        var list = this.m_EventList;
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].clean();
        }
        this.m_EventList = [];
        this.UnrefSkin();
    };
    BaseView.prototype.OnDestroy = function () {
    };
    BaseView.prototype.AddTimer = function (delay, repeatCount, func) {
        TimerManager.ins().doTimer(delay, repeatCount, func, this);
    };
    BaseView.prototype.AddLoopTimer = function (delay, func) {
        func.call(this);
        TimerManager.ins().doTimer(1000, 0, func, this);
    };
    BaseView.prototype.RemoveTimer = function (func) {
        TimerManager.ins().remove(func, this);
    };
    BaseView.prototype.observe = function (event, func) {
        MessageCenter.ins().addListener(event, func, this);
    };
    BaseView.prototype.removeObserve = function () {
        MessageCenter.ins().removeAll(this);
    };
    BaseView.prototype.AddClick = function (target, func) {
        this.AddEvent(egret.TouchEvent.TOUCH_TAP, func, this, target);
    };
    BaseView.prototype.AddItemClick = function (target, func) {
        this.AddEvent(eui.ItemTapEvent.ITEM_TAP, func, this, target);
    };
    BaseView.prototype.AddChange = function (target, func) {
        this.AddEvent(egret.TouchEvent.CHANGE, func, this, target);
    };
    BaseView.prototype.AddEvent = function (event, func, thisObject, targetObj, useCapture) {
        if (targetObj === void 0) { targetObj = null; }
        if (useCapture === void 0) { useCapture = false; }
        if (targetObj == null) {
            // targetObj = this;
            console.log("没有给定目标控件", this["__class__"]);
            return;
        }
        for (var i = 0, list = this.eventList; i < list.length; ++i) {
            if (list[i].addObject == targetObj) {
                // console.debug("重复绑定对象", this["__class__"])
                return;
            }
        }
        var data = new EventListenerData(targetObj, event, func, thisObject, useCapture, 0);
        if (data) {
            this.eventList.push(data);
        }
        else {
            console.log("绑定侦听事件失败");
        }
    };
    BaseView.prototype.removeEvents = function () {
        var list = this.eventList;
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].clean();
        }
        this.eventList = [];
    };
    BaseView.prototype.DoOpen = function (param) {
        if (param === void 0) { param = null; }
        if (!this.m_IsOpen) {
            this.m_IsOpen = true;
            this.OnOpen.apply(this, param || BaseView.EMPTY);
        }
        this.OnResume.apply(this, param || BaseView.EMPTY);
    };
    BaseView.prototype.DoClose = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (!this.m_IsOpen) {
            return;
        }
        this.m_IsOpen = false;
        this.OnClose.apply(this, param);
        for (var i = 0; i < this.numChildren; i++) {
            var child = this.getChildAt(i);
            if (egret.is(child, "BaseView")) {
                child.DoClose(param);
            }
        }
        this.removeEvents();
        this.removeObserve();
        TimerManager.ins().removeAll(this);
    };
    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    BaseView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * 重复开启面板执行
     */
    BaseView.prototype.OnResume = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * 面板关闭执行函数，用于子类继承
     */
    BaseView.prototype.OnClose = function () {
    };
    BaseView.prototype.$parseSkinName = function () {
        _super.prototype.$parseSkinName.call(this);
        var skinName = this.skinName;
        if (this.m_RefSkinName == skinName) {
            return;
        }
        this.UnrefSkin();
        this.m_RefSkinName = skinName;
        this.RefSkin();
    };
    BaseView.prototype.RefSkin = function () {
        if (this.m_RefSkinName) {
            ResMgr.RefSkin(this.m_RefSkinName);
        }
    };
    BaseView.prototype.UnrefSkin = function () {
        if (this.m_RefSkinName) {
            ResMgr.UnrefSkin(this.m_RefSkinName);
            this.m_RefSkinName = null;
        }
    };
    BaseView.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        if (this.mIsAutoSkin) {
            this.UnrefSkin();
        }
    };
    BaseView.prototype.CheckUnrefSkin = function () {
        if (!this.$stage && this.mIsAutoSkin) {
            this.UnrefSkin();
        }
    };
    BaseView.EMPTY = [];
    return BaseView;
}(eui.Component));
__reflect(BaseView.prototype, "BaseView");
//# sourceMappingURL=BaseView.js.map