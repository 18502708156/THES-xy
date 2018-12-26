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
var BaseEuiView = (function (_super) {
    __extends(BaseEuiView, _super);
    function BaseEuiView() {
        var _this = _super.call(this) || this;
        _this.mIsAutoSkin = false;
        _this._resources = null;
        _this._isInit = false;
        _this.mRefBaseView = {};
        _this._resources = null;
        _this._isInit = false;
        _this.SetFullType();
        return _this;
    }
    BaseEuiView.prototype.SetFullType = function () {
        this.percentHeight = 100;
        this.percentWidth = 100;
    };
    BaseEuiView.prototype.isInit = function () {
        return this._isInit;
    };
    BaseEuiView.prototype.isShow = function () {
        return ViewManager.ins().isShow(this);
    };
    BaseEuiView.prototype.DoClose = function () {
        if (this.mCommonWindowBg) {
            this.mCommonWindowBg.OnRemoved();
        }
        if (this.mDialog) {
            this.mDialog.OnRemoved();
        }
        _super.prototype.DoClose.call(this);
    };
    BaseEuiView.prototype.DoInit = function () {
        this._isInit = true;
        this.initUI();
    };
    /**
     *对面板进行显示初始化，用于子类继承
     */
    BaseEuiView.prototype.initUI = function () {
    };
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    BaseEuiView.prototype.initData = function () {
    };
    BaseEuiView.prototype.destoryView = function () {
        if (this.mRemoveNotDestroyView) {
            return;
        }
        _super.prototype.destoryView.call(this);
        ViewManager.ins().destroy(this.hashCode);
        if (this.mCommonWindowBg) {
            this.mCommonWindowBg.OnDestroy();
        }
        if (this.mRefBaseView) {
            for (var key in this.mRefBaseView) {
                var view = this.mRefBaseView[key];
                if (view) {
                    view.destoryView();
                }
            }
            this.mRefBaseView = null;
        }
    };
    /**
     * 加载面板所需资源
     */
    BaseEuiView.prototype.loadResource = function (loadComplete, initComplete) {
        if (this._resources && this._resources.length > 0) {
            ResourceUtils.ins().loadResource(this._resources, [], function () {
                loadComplete();
                initComplete();
            }, null, this);
            // this.addEventListener(eui.UIEvent.CREATION_COMPLETE, initComplete, this);
        }
        else {
            loadComplete();
            initComplete();
        }
    };
    /**
     * 设置是否隐藏
     * @param value
     */
    BaseEuiView.prototype.setVisible = function (value) {
        this.visible = value;
    };
    BaseEuiView.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return true;
    };
    BaseEuiView.prototype.GetLayerLevel = function () {
        return null;
    };
    BaseEuiView.prototype.SetTableIndex = function (index) {
        var window = this.mCommonWindowBg;
        if (window) {
            window.SetTabIndex(index);
        }
    };
    BaseEuiView.prototype.getSubViewByIndex = function (index) {
        var window = this.mCommonWindowBg;
        if (window) {
            return window.GetViewStackElementByIndex(index);
        }
        return null;
    };
    BaseEuiView.prototype.CloseSelf = function () {
        ViewManager.ins().close(this);
    };
    BaseEuiView.prototype.RefBaseView = function (view) {
        if (!egret.is(view, "BaseView")) {
            return;
        }
        if (!this.mRefBaseView) {
            this.mRefBaseView = {};
        }
        view.mIsAutoSkin = null;
        this.mRefBaseView[view.hashCode] = view;
    };
    BaseEuiView.prototype.UnRefBaseView = function (view) {
        if (!egret.is(view, "BaseView")) {
            return;
        }
        if (!this.mRefBaseView) {
            return;
        }
        view.mIsAutoSkin = true;
        delete this.mRefBaseView[view.hashCode];
        view.CheckUnrefSkin();
    };
    // protected SetFullScreenType() {
    //     this.addEventListener(egret.Event.RESIZE, this.OnFullScreenResize, this);
    //     this.OnFullScreenResize()
    // }
    BaseEuiView.prototype.OnFullScreenResize = function () {
        // egret.callLater(this.DoFullScreenResize, this)
        this.width = GameGlobal.StageUtils.GetWidth();
        this.height = GameGlobal.StageUtils.GetHeight();
        if (this.parent) {
            var w = StageUtils.WIDTH;
            var h = StageUtils.HEIGHT;
            this.x = (w - this.width) >> 1;
            this.y = (h - this.height) >> 1;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
    };
    // 定义view对象的层级
    BaseEuiView.LAYER_LEVEL = null;
    // 定义view对象的名称
    BaseEuiView.VIEW_LAYER_LEVEL = null;
    return BaseEuiView;
}(BaseView));
__reflect(BaseEuiView.prototype, "BaseEuiView");
//# sourceMappingURL=BaseEuiView.js.map