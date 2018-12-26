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
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        var _this = _super.call(this) || this;
        _this.childrenDatas = [];
        _this.childrenList = [];
        _this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION;
        _this._selectedIndex = -1;
        return _this;
    }
    TabView.CreateTabViewData = function (cls, args, notShow) {
        if (notShow === void 0) { notShow = false; }
        var data;
        if (typeof (cls) == "string") {
            data = {
                className: (cls),
                name: "",
                notShow: notShow
            };
        }
        else {
            data = {
                className: egret.getQualifiedClassName(cls),
                name: cls.NAME || "",
                notShow: notShow
            };
        }
        if (args) {
            for (var key in args) {
                data[key] = args[key];
            }
        }
        return data;
    };
    Object.defineProperty(TabView.prototype, "layout", {
        get: function () {
            return this.$layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, "selectedIndex", {
        get: function () {
            return this.proposedSelectedIndex != eui.ListBase.NO_PROPOSED_SELECTION ? this.proposedSelectedIndex : this._selectedIndex;
        },
        set: function (value) {
            value = +value | 0;
            this.setSelectedIndex(value);
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype.setSelectedIndex = function (value) {
        if (value == this.selectedIndex) {
            return;
        }
        if (!this.childrenList.length) {
            return;
        }
        this.NewChild(value);
        this.proposedSelectedIndex = value;
        this.invalidateProperties();
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedIndex");
    };
    TabView.prototype.commitProperties = function () {
        _super.prototype.commitProperties.call(this);
        if (this.proposedSelectedIndex != eui.ListBase.NO_PROPOSED_SELECTION) {
            this.commitSelection(this.proposedSelectedIndex);
            this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION;
        }
    };
    TabView.prototype.commitSelection = function (newIndex) {
        if (newIndex >= 0 && newIndex < this.childrenList.length) {
            if (this._selectedIndex != newIndex) {
                this.ShowOrHide(this._selectedIndex, false);
            }
            this._selectedIndex = newIndex;
            // this.CreateChild(newIndex)
            this.ShowOrHide(newIndex, true);
        }
        else {
            this._selectedIndex = -1;
        }
        this.invalidateSize();
        this.invalidateDisplayList();
    };
    TabView.prototype.NewChild = function (index) {
        var data = this.childrenList[index];
        if (data && !data.obj) {
            var cls = egret.getDefinitionByName(data.className);
            var obj = data.obj = new cls;
            data.className = null;
            var keys = Object.keys(data);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var value = data[key];
                if (!value) {
                    continue;
                }
                if (key == "id") {
                    this[value] = obj;
                }
                else {
                    if (key.indexOf("$") == -1) {
                        obj[key] = value;
                    }
                }
            }
            this.addChild(obj);
            obj.visible = false;
        }
        return data && data.obj ? true : false;
    };
    TabView.prototype.Replace = function (cls) {
        this.RemoveAll();
        this.childrenList[0] = TabView.CreateTabViewData(cls);
        this.selectedIndex = 0;
    };
    TabView.prototype.RemoveAll = function () {
        this._selectedIndex = -1;
        this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION;
        this.removeChildren();
        for (var _i = 0, _a = this.childrenList; _i < _a.length; _i++) {
            var data = _a[_i];
            var id = data["id"];
            if (id) {
                this[id] = null;
            }
        }
        this.childrenList = [];
    };
    TabView.prototype.ShowOrHide = function (index, visible) {
        var data = this.childrenList[index];
        if (data && data.obj) {
            var child = data.obj;
            if (egret.is(child, "eui.UIComponent")) {
                child.includeInLayout = visible;
            }
            child.visible = visible;
            return child;
        }
    };
    TabView.prototype._UpdateList = function () {
        this.childrenList = [];
        for (var _i = 0, _a = this.childrenDatas; _i < _a.length; _i++) {
            var data = _a[_i];
            // if (!data.notShow) {
            this.childrenList.push(data);
            // }
        }
    };
    TabView.prototype.UpdateTabShowState = function (index, state) {
        var data = this.childrenDatas[index];
        if (data) {
            data.notShow = !state;
        }
        this._UpdateList();
    };
    Object.defineProperty(TabView.prototype, "length", {
        get: function () {
            return this.childrenList.length;
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype.getItemAt = function (index) {
        var data = this.childrenList[index];
        // return data ? data.name : ""
        return data;
    };
    TabView.prototype.getItemIndex = function (item) {
        var list = this.childrenList;
        var length = list.length;
        for (var i = 0; i < length; i++) {
            if (list[i].name == item) {
                return i;
            }
        }
        return -1;
    };
    TabView.prototype.getElementAt = function (index) {
        var data = this.childrenList[index];
        return data ? data.obj : null;
    };
    TabView.prototype.GetElementCls = function (index) {
        var data = this.childrenList[index];
        if (data) {
            if (data.obj) {
                return Util.GetClass(data.obj);
            }
            if (data.className) {
                return egret.getDefinitionByName(data.className);
            }
        }
        return null;
    };
    Object.defineProperty(TabView.prototype, "tabChildren", {
        set: function (datas) {
            this.childrenDatas = datas;
            this._UpdateList();
        },
        enumerable: true,
        configurable: true
    });
    TabView.COPY = {
        "name": 1,
        "skinName": 1,
    };
    return TabView;
}(eui.Group));
__reflect(TabView.prototype, "TabView", ["eui.ICollection", "egret.IEventDispatcher"]);
eui.registerBindable(TabView.prototype, "selectedIndex");
eui.registerProperty(TabView, "tabChildren", "Array", true);
//# sourceMappingURL=TabView.js.map