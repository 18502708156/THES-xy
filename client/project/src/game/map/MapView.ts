class MapView extends egret.DisplayObjectContainer {
	public constructor() {
		super();
	}

	private _mapImage: MapViewBg;

	public mMapEntityView: MapEntityView
	public mCityEntityView: MapEntityView

	public MainCityView: MainCityView

	public mapId: number

	private mClickEff: MovieBaseObject[] = []

	public initMap() {
		this._mapImage = new MapViewBg();

		this.touchEnabled = true;
		this.touchChildren = true;
		this._mapImage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onGridClick, this);
		this._mapImage.touchEnabled = true

		this.addChild(this._mapImage);
		this.mMapEntityView = new MapEntityView
		this.mMapEntityView.name = "map"
		this.mCityEntityView = new MapEntityView
		this.mCityEntityView.name = "city"
		this.addChild(this.mMapEntityView);
		this.addChild(this.mCityEntityView);
	}

	addMapCity() {
		if (!this.MainCityView) {
			this.MainCityView = new MainCityView;
		}
		// this._dropLayer.addChild(this.MainCityView);
		this.mMapEntityView.AddDrop(this.MainCityView)
	}

	removeMapCity() {
		DisplayUtils.removeFromParent(this.MainCityView)
		this.MainCityView = null
	}

	public static sortF(d1: egret.DisplayObject, d2: egret.DisplayObject) {
		if (d1.y - d2.y > 1) {
			return 1;
		}
		else if (d1.y - d2.y < -1) {
			return -1;
		}
		else {
			return d1.$hashCode - d2.$hashCode
		}
	}

	public onGridClick(event) {
		let x = event.localX
		let y = event.localY
		let eff = this.mClickEff.pop()
		if (!eff) {
			eff = new MovieBaseObject
		}
		eff.Play(ResDataPath.GetUIEffePath("scene_click001"), null, 1, true, this.OnEffComp, this, true)
		eff.x = x
		eff.y = y
		this.addChild(eff)
		if (GameMap.checkWalkable(Const.PixelToPos(x), Const.PixelToPos(y))) {
			GameGlobal.RaidMgr.OnMapClick(event.localX, event.localY)
		} else {
			if (DEBUG) {
				console.log("not walkable => ", x, y)
			}
		}
	}

	private OnEffComp(eff: MovieBaseObject) {
		this.mClickEff.push(eff)
	}

	private m_PreX = null
	private m_PreY = null

	public LookAt(role: egret.DisplayObject): void {
		if (role == null) {
			return;
		}
		this.UpdatePos(role.x, role.y)
	}

	private _UpdatePos(x: number, y: number): void {
		let width = GameGlobal.StageUtils.GetWidth()
		let height = GameGlobal.StageUtils.GetHeight()
		if (x != null) {
			if (GameMap.MAX_WIDTH < width) {
				// this.x = ((width - GameMap.MAX_WIDTH) >> 1)
				this.x = 0
			} else {
				this.x = -Math.min(Math.max(x - (width >> 1), 0), GameMap.MAX_WIDTH - width);
			}
		}
		if (y != null) {
			if (GameMap.MAX_HEIGHT < height) {
				this.y = ((height - GameMap.MAX_HEIGHT) >> 1)
			} else {
				this.y = -Math.min(Math.max(y - 50 - (height >> 1), 0), GameMap.MAX_HEIGHT - height);
			}
		}
	}

	public UpdatePos(x: number, y: number): void {
		if (this.m_PreX != x || this.m_PreY != y) {
			this.m_PreX = x
			this.m_PreY = y
			this._UpdatePos(x, y)
			this._mapImage.updateHDMap(this);
		}
	}

    /**
     * 切换地图会清除场景上的所有显示
     */
	public ChangeMap(mapId: number, mapName: string) {
		if (this.mapId == mapId) {
			return
		}
		this.m_PreX = null
		this.m_PreY = null
		this.mapId = mapId
		this._UpdatePos(GameMap.mapX, GameMap.mapY)
		if (GameMap.MAX_WIDTH < GameGlobal.StageUtils.GetWidth()) {
			this._mapImage.scaleX = GameGlobal.StageUtils.GetWidth() / GameMap.MAX_WIDTH
		} else {
			this._mapImage.scaleX = 1
		}
		this._mapImage.lastUpdateX = this.x
		this._mapImage.lastUpdateY = this.y
		this._mapImage.initThumbnail(GameMap.MAX_WIDTH, GameMap.MAX_HEIGHT, mapName);
		this._mapImage.updateHDMap(this, true);
	};
}