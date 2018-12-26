class ChatFaceView extends eui.Component {

    /////////////////////////////////////////////////////////////////////////////
    // ChatFaceSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Group;
    protected posGroup: eui.Group;
    protected faceGroup: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	private m_Callback: Function

	public constructor(callback: Function) {
		super()
		this.skinName = "ChatFaceSkin"

		this.m_Callback = callback

		for (let i = 0; i < this.faceGroup.numChildren; i++) {
			let index = i + 1
			let img = this.faceGroup.getChildAt(i) as eui.Image
			img.source = "ui_fc" + DateUtils.formatTimeNum(index)
		}

		this.touchEnabled = true
		this.touchChildren = true

		this.bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnCloseClick, this)
		this.faceGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnCloseClick(e: egret.TouchEvent) {
		DisplayUtils.removeFromParent(this)
	}

	private _OnClick(e: egret.TouchEvent) {
		let index = this.faceGroup.$children.indexOf(e.target)
		if (this.m_Callback) {
			this.m_Callback(index + 1)
			this.m_Callback = null
		}
		DisplayUtils.removeFromParent(this)
	}

	public SetPos(x: number, y: number) {
		this.posGroup.x = x
		this.posGroup.y = y
	}


	$onRemoveFromStage(): void{
		super.$onRemoveFromStage();
		if (this.m_Callback) {
			this.m_Callback = null
		}
	}
}