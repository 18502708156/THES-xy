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
var TabEuiView = (function (_super) {
    __extends(TabEuiView, _super);
    function TabEuiView() {
        var _this = _super.call(this) || this;
        _this.touchEnabled = false;
        _this.touchChildren = true;
        return _this;
    }
    TabEuiView.prototype.ShowOrHide = function (index, visible) {
        var child = _super.prototype.ShowOrHide.call(this, index, visible);
        if (child) {
            if (egret.is(child, "BaseView")) {
                if (visible) {
                    var data = [];
                    if (this.m_TmpIndex == index) {
                        data = [this.m_TmpData];
                    }
                    child.DoOpen(data);
                }
                else {
                    child.DoClose();
                }
            }
        }
        return child;
    };
    TabEuiView.prototype.Replace = function (cls) {
        for (var _i = 0, _a = this.childrenList; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.obj && egret.is(data.obj, "BaseView")) {
                data.obj.DoClose();
            }
        }
        _super.prototype.Replace.call(this, cls);
    };
    TabEuiView.prototype.CloseView = function () {
        var view = this.getElementAt(this.selectedIndex);
        if (view && view["DoClose"]) {
            view["DoClose"]();
            view.visible = false;
        }
        this.m_TmpIndex = null;
        this.m_TmpData = null;
        this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION;
        this._selectedIndex = -1;
    };
    TabEuiView.prototype.OpenIndex = function (index, data) {
        this.m_TmpIndex = index;
        this.m_TmpData = data;
        this.selectedIndex = index;
    };
    return TabEuiView;
}(TabView));
__reflect(TabEuiView.prototype, "TabEuiView");
//# sourceMappingURL=TabEuiView.js.map