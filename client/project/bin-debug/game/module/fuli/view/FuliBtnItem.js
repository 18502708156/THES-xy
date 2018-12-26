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
var RechargeBtnItem = (function (_super) {
    __extends(RechargeBtnItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function RechargeBtnItem() {
        return _super.call(this) || this;
    }
    RechargeBtnItem.prototype.dataChanged = function () {
        this.icon.source = this.data.icon;
        this.UpdateRedPoint();
    };
    RechargeBtnItem.prototype.UpdateRedPoint = function () {
        if (this.$stage == null || this.redPoint == null) {
            return;
        }
        var showRedPoint = false;
        if (this.data.cls && this.data.cls && this.data.cls["CheckRedPoint"]) {
            showRedPoint = this.data.cls["CheckRedPoint"](this.data.id);
        }
        this.redPoint.visible = showRedPoint;
    };
    return RechargeBtnItem;
}(eui.ItemRenderer));
__reflect(RechargeBtnItem.prototype, "RechargeBtnItem");
var FuliBtnItem = (function (_super) {
    __extends(FuliBtnItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FuliBtnItem() {
        return _super.call(this) || this;
    }
    FuliBtnItem.prototype.dataChanged = function () {
        this.icon.source = this.data.icon;
        this.UpdateRedPoint();
    };
    FuliBtnItem.prototype.UpdateRedPoint = function () {
        if (this.$stage == null || this.redPoint == null) {
            return;
        }
        // let showRedPoint = false
        // if (this.data.cls && this.data.cls && this.data.cls["CheckRedPoint"]) {
        // 	showRedPoint = this.data.cls["CheckRedPoint"](this.data.id)
        // }
        this.redPoint.visible = this.data.__redPoint__;
    };
    return FuliBtnItem;
}(eui.ItemRenderer));
__reflect(FuliBtnItem.prototype, "FuliBtnItem");
//# sourceMappingURL=FuliBtnItem.js.map