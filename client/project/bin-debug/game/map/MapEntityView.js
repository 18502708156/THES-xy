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
var MapEntityView = (function (_super) {
    __extends(MapEntityView, _super);
    function MapEntityView() {
        var _this = _super.call(this) || this;
        _this._dropLayer = new egret.DisplayObjectContainer;
        _this._dropLayer.name = "drop";
        _this.addChild(_this._dropLayer);
        _this._entityLayer = new egret.DisplayObjectContainer;
        _this._entityLayer.name = "entityLayer";
        _this.addChild(_this._entityLayer);
        return _this;
    }
    MapEntityView.prototype.sortEntity = function () {
        this._entityLayer.$children.sort(MapView.sortF);
    };
    /** 清理对象 */
    MapEntityView.prototype.RemoveDropLayer = function () {
        this._dropLayer.removeChildren();
    };
    MapEntityView.prototype.RemoveEntityLayer = function () {
        TimerManager.ins().remove(this.sortEntity, this);
        DisplayUtils.removeFromParent(this._entityLayer);
    };
    MapEntityView.prototype.AddEntityLayer = function () {
        if (this._entityLayer.parent) {
            return;
        }
        TimerManager.ins().doTimer(500, 0, this.sortEntity, this);
        this.addChild(this._entityLayer);
    };
    MapEntityView.prototype.AddDrop = function (target) {
        this._dropLayer.addChild(target);
    };
    MapEntityView.prototype.AddEntity = function (entity) {
        this._entityLayer.addChild(entity);
    };
    MapEntityView.prototype.LocalToGlobal = function (x, y, temp) {
        this._entityLayer.localToGlobal(x, y, temp);
    };
    MapEntityView.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        if (this._entityLayer.parent) {
            TimerManager.ins().doTimer(500, 0, this.sortEntity, this);
        }
    };
    MapEntityView.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        TimerManager.ins().remove(this.sortEntity, this);
    };
    return MapEntityView;
}(egret.DisplayObjectContainer));
__reflect(MapEntityView.prototype, "MapEntityView");
//# sourceMappingURL=MapEntityView.js.map