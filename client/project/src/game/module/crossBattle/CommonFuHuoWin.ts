class CommonFuHuoWin extends eui.Component implements eui.UIComponent {

	/////////////////////////////////////////////////////////////////////////////
	// CommonFuHuSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected fuhuo: eui.Group;
	protected fuhuoTime: eui.Label;
	protected fuhuoPrice: PriceIcon;
	protected fuhuoBnt: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "CommonFuHuSkin";
		this.percentWidth = 100
		this.percentHeight = 100
		this.fuhuoBnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this)
	}


	public fuHuoTime: number = 0
	public price: any
	public fun: any

	private mContext: GameMapPanel

	public SetData(time: number, yb: IRewardData, func: Function) {
		this.mContext = this.parent as GameMapPanel

		TimerManager.ins().removeAll(this)

		this.fuHuoTime = time
		this.price = yb
		this.fun = func

		this.fuhuoPrice.setType(this.price.id);
		this.fuhuoPrice.setPrice(this.price.count);
		this.fuhuoPrice.setColor(0xffffff)

		this.update()
		TimerManager.ins().doTimer(1000, this.fuHuoTime, this.update, this)
	}

	click() {
		if (Checker.Money(this.price.id, this.price.count, Checker.YUNBAO_FRAME)) {
			if (this.fun) {
				this.fun()
			}
			DisplayUtils.removeFromParent(this)
		}
	}

	OnClose() {
		TimerManager.ins().remove(this.update, this);
		DisplayUtils.removeFromParent(this);
	}

	update() {
		this.fuHuoTime--;
		this.fuhuoTime.text = "复活倒计时：" + this.fuHuoTime
		if (this.fuHuoTime <= 0) {
			TimerManager.ins().remove(this.update, this);
			DisplayUtils.removeFromParent(this)
		}
	}

	$onRemoveFromStage(): void {
		super.$onRemoveFromStage();
		this.fun = null
		TimerManager.ins().removeAll(this)
		if (this.mContext) {
			this.mContext.mRebornView = null
		}
	}
}