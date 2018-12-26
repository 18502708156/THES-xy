class MapEntityView extends egret.DisplayObjectContainer {

	private _dropLayer: egret.DisplayObjectContainer;
	private _entityLayer: egret.DisplayObjectContainer;

	public constructor() {
		super()
		this._dropLayer = new egret.DisplayObjectContainer;
		this._dropLayer.name = "drop"
		this.addChild(this._dropLayer);
		this._entityLayer = new egret.DisplayObjectContainer;
		this._entityLayer.name = "entityLayer"
		this.addChild(this._entityLayer);
	}

	public sortEntity() {
		this._entityLayer.$children.sort(MapView.sortF);
	}

	/** 清理对象 */
	public RemoveDropLayer() {
		this._dropLayer.removeChildren()
	}

	public RemoveEntityLayer() {
		TimerManager.ins().remove(this.sortEntity, this)
		DisplayUtils.removeFromParent(this._entityLayer)
	}

	public AddEntityLayer() {
		if (this._entityLayer.parent) {
			return
		}
		TimerManager.ins().doTimer(500, 0, this.sortEntity, this);
		this.addChild(this._entityLayer)
	}

	public AddDrop(target: egret.DisplayObject): void {
		this._dropLayer.addChild(target)
	}

	public AddEntity(entity: egret.DisplayObject): void {
		this._entityLayer.addChild(entity);
	}

	public LocalToGlobal(x: number, y: number, temp: egret.Point) {
		this._entityLayer.localToGlobal(x, y, temp)
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage, nestLevel);
		if (this._entityLayer.parent) {
			TimerManager.ins().doTimer(500, 0, this.sortEntity, this);
		}
	}

	$onRemoveFromStage(): void {
		super.$onRemoveFromStage();
		TimerManager.ins().remove(this.sortEntity, this);
	}
}