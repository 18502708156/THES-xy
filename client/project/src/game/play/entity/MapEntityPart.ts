class MapEntityPart {

	private m_Entity: MapEntity

	private mZhengYingView: EntityZhengYingView
	private mStatusView: EntityStatusView

	private mPlotView: PlotSimplePanel

	public constructor(entity: MapEntity) {
		this.m_Entity = entity
	}

	private footRingContainer: egret.DisplayObjectContainer

	private _GetFootRingContainer(): egret.DisplayObjectContainer {
		if (!this.footRingContainer) {
			this.footRingContainer = new egret.DisplayObjectContainer
			this.m_Entity.addChildAt(this.footRingContainer, 0)
		}
		return this.footRingContainer
	}

	private _DeleteFootRingContainer() {
		if (this.footRingContainer) {
			egret.Tween.removeTweens(this.footRingContainer)
			this.footRingContainer.removeChildren()
			DisplayUtils.removeFromParent(this.footRingContainer)
			this.footRingContainer.visible = false
			this.footRingContainer = null
		}
	}

	public SetType(src: string) {
		if (!this.mZhengYingView) {
			this.mZhengYingView = new EntityZhengYingView()
		}
		this.mZhengYingView.SetType(src)
		this.m_Entity.addChild(this.mZhengYingView)
	}

	public ChageStatus(type: number) {
		if (type) {
			if (!this.mStatusView) {
				this.mStatusView = new EntityStatusView
			}
			this.mStatusView.SetType(type)
			this.m_Entity.addChild(this.mStatusView);
		} else {
			if (this.mStatusView) {
				DisplayUtils.removeFromParent(this.mStatusView)
			}
		}
	}

	public RemovePlot() {
		if (this.mPlotView) {
			DisplayUtils.removeFromParent(this.mPlotView)
			this.mPlotView = null
		}
	}

	public SetPlot(msg: string) {
		if (!this.mPlotView) {
			this.mPlotView = new PlotSimplePanel()
		}
		this.mPlotView.SetMsg(msg)
		this.m_Entity.addChildAt(this.mPlotView, this.m_Entity.numChildren)
	}
	
	public Dispose() {
		this._DeleteFootRingContainer()

		if (this.mZhengYingView) {
			DisplayUtils.removeFromParent(this.mZhengYingView)
			this.mZhengYingView = null
		}
		if (this.mStatusView) {
			DisplayUtils.removeFromParent(this.mStatusView)
			this.mStatusView = null
		}
		this.RemovePlot()
	}

}

class EntityStatusView extends egret.DisplayObjectContainer {

	public static NONE = 1
	public static ATK = 2
	public static DIE = 3

	public static TYPE = {
		[1]: "",
		[2]: "ui_hddt_bm_zhandouzhong",
		[3]: "ui_zd_bm_youling",
	}

	public constructor() {
		super();
		this.init()
	}

	public sate: eui.Image

	private init() {
		this.sate = new eui.Image();
		this.sate.x = -28
		this.sate.y = -200
		this.addChild(this.sate);
	}

	public SetType(src: number) {
		this.sate.source = EntityStatusView.TYPE[src] || ""
	}
}

class EntityZhengYingView extends egret.DisplayObjectContainer {

	private typeImg: eui.Image
	
	public constructor() {
		super();
		this.Init()
	}

	private	Init() {
		this.typeImg = new eui.Image();
		this.typeImg.y = 0
		this.typeImg.x = -100
		this.addChild(this.typeImg);
	}

	public SetType(src: string) {
		this.typeImg.source = src
	}
}