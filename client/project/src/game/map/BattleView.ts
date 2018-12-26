class BattleView extends egret.DisplayObjectContainer {

	private _blackImg1: eui.Image
	private _Img: eui.Image
	private _bgMapImg: eui.Image
	private _entityLayer: egret.DisplayObjectContainer;
	public bloodLayer: BloodView;

	public constructor() {
		super()
		this.width = StageUtils.WIDTH
		this._bgMapImg = new eui.Image
		this._bgMapImg.horizontalCenter = 0
		this._bgMapImg.x = -120
		this.addChild(this._bgMapImg)
		this._blackImg1 = new eui.Image
		this._blackImg1.source = "ui_cm_black"
		this.addChild(this._blackImg1)
		this._Img = new eui.Image
		this._Img.source = ResDataPath.ROOT + "image/battlemap/backMark.png"
		this._Img.horizontalCenter = 0
		this.addChild(this._Img)
		this._Img.addEventListener(egret.Event.COMPLETE, this.onResize, this)
		this._entityLayer = new egret.DisplayObjectContainer
		this._entityLayer.width = 529
		this._entityLayer.height = 548
		this.addChild(this._entityLayer)
		this.bloodLayer = new BloodView
		this.addChild(this.bloodLayer)

		this.onResize()
	}

	public onResize(): void {
		let stageWidth = egret.MainContext.instance.stage.stageWidth
		let stageHeight = egret.MainContext.instance.stage.stageHeight
		this._Img.x = (stageWidth - this._Img.width) >> 1
		this._Img.y = ((stageHeight - this._Img.height) >> 1) - 60
		this._bgMapImg.height = stageHeight
		this._bgMapImg.height = stageHeight / StageUtils.HEIGHT * 960
		this._bgMapImg.x = (stageWidth - this._bgMapImg.width) >> 1
		this._bgMapImg.y = 0
		this._blackImg1.x = -100
		this._blackImg1.y = -100
		this._blackImg1.width = stageWidth + 200
		this._blackImg1.height = stageHeight + 200
		

		this._entityLayer.x = (stageWidth - this._entityLayer.width) >> 1
		this._entityLayer.y = ((stageHeight - this._entityLayer.height) >> 1) - 40
		this.bloodLayer.x = this._entityLayer.x
		this.bloodLayer.y = this._entityLayer.y
	}

	// public Show(resName: string): void {
		
	// }

	public showMapBg(resName: string): void
	{
		this._bgMapImg.visible = true
		this._blackImg1.alpha = 0.7
		this._Img.alpha = 1
		this.alpha = 1

		GameMap.mBattleLayer.addChild(this);

		let imgPath = resName
		if (this._bgMapImg.source != imgPath) {
			ResMgr.Ref(imgPath)
		}
		this._bgMapImg.source = imgPath

	}

	public Hide(): void {
		let imgPath = this._bgMapImg.source as string
		if (imgPath) {
			ResMgr.Unref(imgPath)
			this._bgMapImg.source = ""
		}
		this._bgMapImg.visible = false
		DisplayUtils.removeFromParent(this)
	}

	public ShowDefault(): void {
		this._bgMapImg.visible = false
		this._blackImg1.alpha = 0
		this._Img.alpha = 0
		this.alpha = 1

		GameMap.mBattleLayer.addChild(this);

		egret.Tween.removeTweens(this)
		egret.Tween.removeTweens(this._blackImg1)
		egret.Tween.removeTweens(this._Img)

		egret.Tween.get(this._blackImg1).to({
			alpha: 0.7
		}, 300)
		egret.Tween.get(this._Img).to({
			alpha: 1
		}, 300)
	}

	public StartHide(func: Function): void {
		egret.Tween.get(this).to({
			alpha: 0
		}, 500).call(()=>{
			this.Hide()
			if (func) (
				func()
			)
		})
	}

	public AddEntity(entity: egret.DisplayObject): void {
		this._entityLayer.addChild(entity)
		this.UpdateSort()
	}

	// 获取对应的全局坐标
	public GetEntityGlobal(x: number, y: number, pos: egret.Point) {
		this._entityLayer.localToGlobal(x, y, pos)
	}

	public Clear(): void {
		this.bloodLayer.Clear()
	}

	public UpdateSort(immediately = false) {
		if (immediately) {
			TimerManager.ins().remove(this.UpdateIndex, this)
			this.UpdateIndex()
		} else {
			if (!this.m_IsUpdate) {
				this.m_IsUpdate = true
				if (this._entityLayer.$children.length) {
					TimerManager.ins().doTimer(500, 1, this.UpdateIndex, this)
				}
			}
		}
	}

	private m_IsUpdate = false

	private UpdateIndex() {
		this.m_IsUpdate = false		
		this._entityLayer.$children.sort(MapView.sortF)
	}
}