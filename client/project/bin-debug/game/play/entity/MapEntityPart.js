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
var MapEntityPart = (function () {
    function MapEntityPart(entity) {
        this.m_Entity = entity;
    }
    MapEntityPart.prototype._GetFootRingContainer = function () {
        if (!this.footRingContainer) {
            this.footRingContainer = new egret.DisplayObjectContainer;
            this.m_Entity.addChildAt(this.footRingContainer, 0);
        }
        return this.footRingContainer;
    };
    MapEntityPart.prototype._DeleteFootRingContainer = function () {
        if (this.footRingContainer) {
            egret.Tween.removeTweens(this.footRingContainer);
            this.footRingContainer.removeChildren();
            DisplayUtils.removeFromParent(this.footRingContainer);
            this.footRingContainer.visible = false;
            this.footRingContainer = null;
        }
    };
    MapEntityPart.prototype.SetType = function (src) {
        if (!this.mZhengYingView) {
            this.mZhengYingView = new EntityZhengYingView();
        }
        this.mZhengYingView.SetType(src);
        this.m_Entity.addChild(this.mZhengYingView);
    };
    MapEntityPart.prototype.ChageStatus = function (type) {
        if (type) {
            if (!this.mStatusView) {
                this.mStatusView = new EntityStatusView;
            }
            this.mStatusView.SetType(type);
            this.m_Entity.addChild(this.mStatusView);
        }
        else {
            if (this.mStatusView) {
                DisplayUtils.removeFromParent(this.mStatusView);
            }
        }
    };
    MapEntityPart.prototype.RemovePlot = function () {
        if (this.mPlotView) {
            DisplayUtils.removeFromParent(this.mPlotView);
            this.mPlotView = null;
        }
    };
    MapEntityPart.prototype.SetPlot = function (msg) {
        if (!this.mPlotView) {
            this.mPlotView = new PlotSimplePanel();
        }
        this.mPlotView.SetMsg(msg);
        this.m_Entity.addChildAt(this.mPlotView, this.m_Entity.numChildren);
    };
    MapEntityPart.prototype.Dispose = function () {
        this._DeleteFootRingContainer();
        if (this.mZhengYingView) {
            DisplayUtils.removeFromParent(this.mZhengYingView);
            this.mZhengYingView = null;
        }
        if (this.mStatusView) {
            DisplayUtils.removeFromParent(this.mStatusView);
            this.mStatusView = null;
        }
        this.RemovePlot();
    };
    return MapEntityPart;
}());
__reflect(MapEntityPart.prototype, "MapEntityPart");
var EntityStatusView = (function (_super) {
    __extends(EntityStatusView, _super);
    function EntityStatusView() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    EntityStatusView.prototype.init = function () {
        this.sate = new eui.Image();
        this.sate.x = -28;
        this.sate.y = -200;
        this.addChild(this.sate);
    };
    EntityStatusView.prototype.SetType = function (src) {
        this.sate.source = EntityStatusView.TYPE[src] || "";
    };
    EntityStatusView.NONE = 1;
    EntityStatusView.ATK = 2;
    EntityStatusView.DIE = 3;
    EntityStatusView.TYPE = (_a = {},
        _a[1] = "",
        _a[2] = "ui_hddt_bm_zhandouzhong",
        _a[3] = "ui_zd_bm_youling",
        _a);
    return EntityStatusView;
}(egret.DisplayObjectContainer));
__reflect(EntityStatusView.prototype, "EntityStatusView");
var EntityZhengYingView = (function (_super) {
    __extends(EntityZhengYingView, _super);
    function EntityZhengYingView() {
        var _this = _super.call(this) || this;
        _this.Init();
        return _this;
    }
    EntityZhengYingView.prototype.Init = function () {
        this.typeImg = new eui.Image();
        this.typeImg.y = 0;
        this.typeImg.x = -100;
        this.addChild(this.typeImg);
    };
    EntityZhengYingView.prototype.SetType = function (src) {
        this.typeImg.source = src;
    };
    return EntityZhengYingView;
}(egret.DisplayObjectContainer));
__reflect(EntityZhengYingView.prototype, "EntityZhengYingView");
var _a;
//# sourceMappingURL=MapEntityPart.js.map