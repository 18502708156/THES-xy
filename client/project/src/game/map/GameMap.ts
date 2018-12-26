class GameMap {

    static grid: MapGrid;
    static aStar: AStar;
    static mapZip: JSZip;
    static mPath: IGameMapPointData[] = []

    static CELL_SIZE: number;
    static MAX_WIDTH: number;
    static MAX_HEIGHT: number;
    static COL: number;
    static ROW: number;

    static chunkw: number;
    static chunkh: number;
    static scale: number;
    static scalechunk: number;

    public static oldFbId 
    public static oldFbType

    static fubenID: number;
    static mapX: number;
    static mapY: number;
    static fbType: number;

    private static m_Init = false
    private static m_Group: egret.DisplayObjectContainer
    private static m_MapLayer: MapView
    public static mBattleLayer: egret.DisplayObjectContainer
    private static m_BattleView: BattleView;

    private static m_ShowState = -1

    public static CRIT_SHAKE = [6, 60, 3]

    public static GetMap(): MapView {
        if (this.m_MapLayer == null) {
            console.error("not mapview !!!")
            return new MapView
        }
        return this.m_MapLayer
    }

    public static SetGameMainActive(active) {
        let gameMainLayer = this.m_Group
        if (active && !gameMainLayer.parent) {
            LayerManager.Game_Main.addChild(gameMainLayer);
        } else if (!active && gameMainLayer.parent) {
            DisplayUtils.removeFromParent(gameMainLayer)
        }
    }

    public static Init() {
        if (this.m_Init) {
            return
        }
        this.m_Group = new egret.DisplayObjectContainer
        LayerManager.Game_Main.addChild(this.m_Group)

        this.m_Init = true
        this.m_MapLayer = new MapView;
        this.m_MapLayer.initMap();
        this.m_Group.addChildAt(this.m_MapLayer, 0)

        this.mBattleLayer = new egret.DisplayObjectContainer
		this.m_Group.addChild(this.mBattleLayer);
        
        this.m_BattleView = new BattleView;
        // 显示的时候加载
        // this.mBattleLayer.addChild(this.m_BattleView)

        this.onResize()
        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);

        this.grid = this.grid || new MapGrid;
        this.aStar = this.aStar || new AStar;
        this.mapZip = this.mapZip || new JSZip(RES.getRes("map"));
        RES.destroyRes("map")
    }

    private static onResize() {
        this.m_BattleView.onResize()
    }

    public static SetShowState(type: number) {
        if (type == this.m_ShowState) {
            return
        }
        this.m_ShowState = type
        if (this.m_MapLayer) {
            if (type == RaidMgr.TYPE_NORMAL) {
                DisplayUtils.removeFromParent(this.m_MapLayer.mCityEntityView)
                this.m_Group.addChildAt(this.mBattleLayer, 1);
                this.m_MapLayer.addChildAt(this.m_MapLayer.mMapEntityView, 1)
            } else {
                DisplayUtils.removeFromParent(this.m_MapLayer.mMapEntityView)
                DisplayUtils.removeFromParent(this.mBattleLayer)
                this.m_MapLayer.addChildAt(this.m_MapLayer.mCityEntityView, 2)
            }
        }
    }

    public static GetBattleView(): BattleView {
        return this.m_BattleView
    }

	public static AddBattleEntity(entity: egret.DisplayObject): void {
		this.m_BattleView.AddEntity(entity)
	}

    public static ClearBattleView(): void {
        this.m_BattleView.Clear()
    }

    public static SetActive(active: boolean): void {
        GameMap.SetGameMainActive(active)
    }

    public static EntityHpChange(damageData: DamageData, shake = null) {
        let targetTeam: Team = damageData.team
        let tx: number = damageData.x
        let ty: number = damageData.y
        let type: DamageTypes = damageData.type
        let value: number = damageData.value

        let config = SkillsConfig.GetSkillEffConfig(damageData.skillId)
        if (config && config.shake) {
            DisplayUtils.shakeIt(this.m_BattleView, config.shake[0], config.shake[1], config.shake[2])
        } else if (shake) {
            DisplayUtils.shakeIt(this.m_BattleView, shake[0], shake[1], shake[2])
        }

        let bloodLayer = this.m_BattleView.bloodLayer
        bloodLayer.ShowBlood(targetTeam, tx, ty, type, value)
    }

    /** 更新数据 */
    public static UpdateScene() {
        // TimerManager.ins().doNext(this.DoUpdateScene, this)
        this.DoUpdateScene()
    }

    private static DoUpdateScene() {
        let curId = GameGlobal.RaidMgr.GetCurMapId()
        if (this.m_MapLayer.mapId == curId) {
            return
        }
        var mapName = GlobalConfig.ins().ScenesConfig[curId].mapfilename
        var mapfile = this.mapZip.file(ResDataPath.GetMapData(mapName));
        if (mapfile) {
            this.parserBytes(JSON.parse(mapfile.asText()));
            this.m_MapLayer.ChangeMap(curId, mapName)
        }
        else {
            egret.log("地图资源读取异常:" + mapName);
        }
    }

    /** 解析流 */
    public static parserBytes(data) {
        this.CELL_SIZE = 64
        this.MAX_WIDTH = data.width
        this.MAX_HEIGHT = data.height
        this.COL = data.realWidth
        this.ROW = data.realHeight

        this.chunkw = data.chunkw || 512
        this.chunkh = data.chunkh || 512
        this.scale = data.scale || 0
        this.scalechunk = data.scalechunk || 512

        this.mPath = data.path || []
        this.grid.initGrid(this.ROW, this.COL, data.datas);
        this.aStar.initFromMap(this.grid);
    }

    public static GetRandomPos(centerX: number, centerY: number, ranX: number, ranY: number, tempPos: egret.Point): void {
        let x = null
        let y = null
        for (let i = 0; i < 6; ++i) {
            let x1 = MathUtils.limitInteger(centerX - ranX, centerX + ranX)
            let y1 = MathUtils.limitInteger(centerY - ranX, centerY + ranX)
            if (GameMap.checkWalkable(x1, y1)) {
                x = x1
                y = y1
                break
            }
        }
        if (x != null && y != null && tempPos != null) {
            tempPos.x = x
            tempPos.y = y
        } else {
            tempPos.x = centerX
            tempPos.y = centerY
        }
    }
    
    /** 检查是否不可移动 */
    public static checkWalkable(x: number, y: number): boolean {
        return GameMap.grid.isWalkableTile(x, y)
    };
    /** 检查是否需要透明 */
    public static checkAlpha(x, y) {
        return GameMap.grid.IsHide(x, y)
    }

    public static parser(rsp: GameMapData) {
        this.oldFbId = this.fubenID
        this.oldFbType = this.fbType

        this.fubenID = rsp.fubenID
        if (rsp.mapX) {
            this.mapX = Const.PosToPixel(rsp.mapX)
        } else {
            this.mapX = null
        }
        if (rsp.mapY) {
            this.mapY = Const.PosToPixel(rsp.mapY)
        } else {
            this.mapY = null
        }
        this.fbType = rsp.fbType
    }

    public static CloseView(clsType): boolean {
        if (ViewManager.ins().isShow(clsType)) {
            ViewManager.ins().close(clsType)
            return true
        }
        return false
    }

    // public static getFileName() {
    //     return GlobalConfig.ins().ScenesConfig[this.mapID].mapfilename;
    // }

    public static TYPE_ID_CITY = 100101
}

interface IGameMapPointData {
    x: number
    y: number
    type: number
    points: egret.Point[]
}