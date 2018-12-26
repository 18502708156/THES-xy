var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameMap = (function () {
    function GameMap() {
    }
    GameMap.GetMap = function () {
        if (this.m_MapLayer == null) {
            console.error("not mapview !!!");
            return new MapView;
        }
        return this.m_MapLayer;
    };
    GameMap.SetGameMainActive = function (active) {
        var gameMainLayer = this.m_Group;
        if (active && !gameMainLayer.parent) {
            LayerManager.Game_Main.addChild(gameMainLayer);
        }
        else if (!active && gameMainLayer.parent) {
            DisplayUtils.removeFromParent(gameMainLayer);
        }
    };
    GameMap.Init = function () {
        if (this.m_Init) {
            return;
        }
        this.m_Group = new egret.DisplayObjectContainer;
        LayerManager.Game_Main.addChild(this.m_Group);
        this.m_Init = true;
        this.m_MapLayer = new MapView;
        this.m_MapLayer.initMap();
        this.m_Group.addChildAt(this.m_MapLayer, 0);
        this.mBattleLayer = new egret.DisplayObjectContainer;
        this.m_Group.addChild(this.mBattleLayer);
        this.m_BattleView = new BattleView;
        // 显示的时候加载
        // this.mBattleLayer.addChild(this.m_BattleView)
        this.onResize();
        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        this.grid = this.grid || new MapGrid;
        this.aStar = this.aStar || new AStar;
        this.mapZip = this.mapZip || new JSZip(RES.getRes("map"));
        RES.destroyRes("map");
    };
    GameMap.onResize = function () {
        this.m_BattleView.onResize();
    };
    GameMap.SetShowState = function (type) {
        if (type == this.m_ShowState) {
            return;
        }
        this.m_ShowState = type;
        if (this.m_MapLayer) {
            if (type == RaidMgr.TYPE_NORMAL) {
                DisplayUtils.removeFromParent(this.m_MapLayer.mCityEntityView);
                this.m_Group.addChildAt(this.mBattleLayer, 1);
                this.m_MapLayer.addChildAt(this.m_MapLayer.mMapEntityView, 1);
            }
            else {
                DisplayUtils.removeFromParent(this.m_MapLayer.mMapEntityView);
                DisplayUtils.removeFromParent(this.mBattleLayer);
                this.m_MapLayer.addChildAt(this.m_MapLayer.mCityEntityView, 2);
            }
        }
    };
    GameMap.GetBattleView = function () {
        return this.m_BattleView;
    };
    GameMap.AddBattleEntity = function (entity) {
        this.m_BattleView.AddEntity(entity);
    };
    GameMap.ClearBattleView = function () {
        this.m_BattleView.Clear();
    };
    GameMap.SetActive = function (active) {
        GameMap.SetGameMainActive(active);
    };
    GameMap.EntityHpChange = function (damageData, shake) {
        if (shake === void 0) { shake = null; }
        var targetTeam = damageData.team;
        var tx = damageData.x;
        var ty = damageData.y;
        var type = damageData.type;
        var value = damageData.value;
        var config = SkillsConfig.GetSkillEffConfig(damageData.skillId);
        if (config && config.shake) {
            DisplayUtils.shakeIt(this.m_BattleView, config.shake[0], config.shake[1], config.shake[2]);
        }
        else if (shake) {
            DisplayUtils.shakeIt(this.m_BattleView, shake[0], shake[1], shake[2]);
        }
        var bloodLayer = this.m_BattleView.bloodLayer;
        bloodLayer.ShowBlood(targetTeam, tx, ty, type, value);
    };
    /** 更新数据 */
    GameMap.UpdateScene = function () {
        // TimerManager.ins().doNext(this.DoUpdateScene, this)
        this.DoUpdateScene();
    };
    GameMap.DoUpdateScene = function () {
        var curId = GameGlobal.RaidMgr.GetCurMapId();
        if (this.m_MapLayer.mapId == curId) {
            return;
        }
        var mapName = GlobalConfig.ins().ScenesConfig[curId].mapfilename;
        var mapfile = this.mapZip.file(ResDataPath.GetMapData(mapName));
        if (mapfile) {
            this.parserBytes(JSON.parse(mapfile.asText()));
            this.m_MapLayer.ChangeMap(curId, mapName);
        }
        else {
            egret.log("地图资源读取异常:" + mapName);
        }
    };
    /** 解析流 */
    GameMap.parserBytes = function (data) {
        this.CELL_SIZE = 64;
        this.MAX_WIDTH = data.width;
        this.MAX_HEIGHT = data.height;
        this.COL = data.realWidth;
        this.ROW = data.realHeight;
        this.chunkw = data.chunkw || 512;
        this.chunkh = data.chunkh || 512;
        this.scale = data.scale || 0;
        this.scalechunk = data.scalechunk || 512;
        this.mPath = data.path || [];
        this.grid.initGrid(this.ROW, this.COL, data.datas);
        this.aStar.initFromMap(this.grid);
    };
    GameMap.GetRandomPos = function (centerX, centerY, ranX, ranY, tempPos) {
        var x = null;
        var y = null;
        for (var i = 0; i < 6; ++i) {
            var x1 = MathUtils.limitInteger(centerX - ranX, centerX + ranX);
            var y1 = MathUtils.limitInteger(centerY - ranX, centerY + ranX);
            if (GameMap.checkWalkable(x1, y1)) {
                x = x1;
                y = y1;
                break;
            }
        }
        if (x != null && y != null && tempPos != null) {
            tempPos.x = x;
            tempPos.y = y;
        }
        else {
            tempPos.x = centerX;
            tempPos.y = centerY;
        }
    };
    /** 检查是否不可移动 */
    GameMap.checkWalkable = function (x, y) {
        return GameMap.grid.isWalkableTile(x, y);
    };
    ;
    /** 检查是否需要透明 */
    GameMap.checkAlpha = function (x, y) {
        return GameMap.grid.IsHide(x, y);
    };
    GameMap.parser = function (rsp) {
        this.oldFbId = this.fubenID;
        this.oldFbType = this.fbType;
        this.fubenID = rsp.fubenID;
        if (rsp.mapX) {
            this.mapX = Const.PosToPixel(rsp.mapX);
        }
        else {
            this.mapX = null;
        }
        if (rsp.mapY) {
            this.mapY = Const.PosToPixel(rsp.mapY);
        }
        else {
            this.mapY = null;
        }
        this.fbType = rsp.fbType;
    };
    GameMap.CloseView = function (clsType) {
        if (ViewManager.ins().isShow(clsType)) {
            ViewManager.ins().close(clsType);
            return true;
        }
        return false;
    };
    GameMap.mPath = [];
    GameMap.m_Init = false;
    GameMap.m_ShowState = -1;
    GameMap.CRIT_SHAKE = [6, 60, 3];
    // public static getFileName() {
    //     return GlobalConfig.ins().ScenesConfig[this.mapID].mapfilename;
    // }
    GameMap.TYPE_ID_CITY = 100101;
    return GameMap;
}());
__reflect(GameMap.prototype, "GameMap");
//# sourceMappingURL=GameMap.js.map