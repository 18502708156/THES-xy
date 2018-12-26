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
var MapView = (function (_super) {
    __extends(MapView, _super);
    function MapView() {
        var _this = _super.call(this) || this;
        _this.mClickEff = [];
        _this.m_PreX = null;
        _this.m_PreY = null;
        return _this;
    }
    MapView.prototype.initMap = function () {
        this._mapImage = new MapViewBg();
        this.touchEnabled = true;
        this.touchChildren = true;
        this._mapImage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onGridClick, this);
        this._mapImage.touchEnabled = true;
        this.addChild(this._mapImage);
        this.mMapEntityView = new MapEntityView;
        this.mMapEntityView.name = "map";
        this.mCityEntityView = new MapEntityView;
        this.mCityEntityView.name = "city";
        this.addChild(this.mMapEntityView);
        this.addChild(this.mCityEntityView);
    };
    MapView.prototype.addMapCity = function () {
        if (!this.MainCityView) {
            this.MainCityView = new MainCityView;
        }
        // this._dropLayer.addChild(this.MainCityView);
        this.mMapEntityView.AddDrop(this.MainCityView);
    };
    MapView.prototype.removeMapCity = function () {
        DisplayUtils.removeFromParent(this.MainCityView);
        this.MainCityView = null;
    };
    MapView.sortF = function (d1, d2) {
        if (d1.y - d2.y > 1) {
            return 1;
        }
        else if (d1.y - d2.y < -1) {
            return -1;
        }
        else {
            return d1.$hashCode - d2.$hashCode;
        }
    };
    MapView.prototype.onGridClick = function (event) {
        var x = event.localX;
        var y = event.localY;
        var eff = this.mClickEff.pop();
        if (!eff) {
            eff = new MovieBaseObject;
        }
        eff.Play(ResDataPath.GetUIEffePath("scene_click001"), null, 1, true, this.OnEffComp, this, true);
        eff.x = x;
        eff.y = y;
        this.addChild(eff);
        if (GameMap.checkWalkable(Const.PixelToPos(x), Const.PixelToPos(y))) {
            GameGlobal.RaidMgr.OnMapClick(event.localX, event.localY);
        }
        else {
            if (true) {
                console.log("not walkable => ", x, y);
            }
        }
    };
    MapView.prototype.OnEffComp = function (eff) {
        this.mClickEff.push(eff);
    };
    MapView.prototype.LookAt = function (role) {
        if (role == null) {
            return;
        }
        this.UpdatePos(role.x, role.y);
    };
    MapView.prototype._UpdatePos = function (x, y) {
        var width = GameGlobal.StageUtils.GetWidth();
        var height = GameGlobal.StageUtils.GetHeight();
        if (x != null) {
            if (GameMap.MAX_WIDTH < width) {
                // this.x = ((width - GameMap.MAX_WIDTH) >> 1)
                this.x = 0;
            }
            else {
                this.x = -Math.min(Math.max(x - (width >> 1), 0), GameMap.MAX_WIDTH - width);
            }
        }
        if (y != null) {
            if (GameMap.MAX_HEIGHT < height) {
                this.y = ((height - GameMap.MAX_HEIGHT) >> 1);
            }
            else {
                this.y = -Math.min(Math.max(y - 50 - (height >> 1), 0), GameMap.MAX_HEIGHT - height);
            }
        }
    };
    MapView.prototype.UpdatePos = function (x, y) {
        if (this.m_PreX != x || this.m_PreY != y) {
            this.m_PreX = x;
            this.m_PreY = y;
            this._UpdatePos(x, y);
            this._mapImage.updateHDMap(this);
        }
    };
    /**
     * 切换地图会清除场景上的所有显示
     */
    MapView.prototype.ChangeMap = function (mapId, mapName) {
        if (this.mapId == mapId) {
            return;
        }
        this.m_PreX = null;
        this.m_PreY = null;
        this.mapId = mapId;
        this._UpdatePos(GameMap.mapX, GameMap.mapY);
        if (GameMap.MAX_WIDTH < GameGlobal.StageUtils.GetWidth()) {
            this._mapImage.scaleX = GameGlobal.StageUtils.GetWidth() / GameMap.MAX_WIDTH;
        }
        else {
            this._mapImage.scaleX = 1;
        }
        this._mapImage.lastUpdateX = this.x;
        this._mapImage.lastUpdateY = this.y;
        this._mapImage.initThumbnail(GameMap.MAX_WIDTH, GameMap.MAX_HEIGHT, mapName);
        this._mapImage.updateHDMap(this, true);
    };
    ;
    return MapView;
}(egret.DisplayObjectContainer));
__reflect(MapView.prototype, "MapView");
//# sourceMappingURL=MapView.js.map