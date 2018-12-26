class BoostPowerView extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Tips
	public constructor() {
		super()
		
		this.skinName = "BoostPowerSkin"
		this.group.verticalCenter = 50
		this.group.horizontalCenter = 0
		this.touchEnabled = false
		this.touchChildren = false
	}
    /////////////////////////////////////////////////////////////////////////////
    // BoostPowerSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected img: eui.Image;
    protected powerLabel: eui.BitmapLabel;
    protected addPowerLabel: eui.BitmapLabel;
    /////////////////////////////////////////////////////////////////////////////

	private mc: MovieClip

	private lastTime = 0
	private lastPower = 0

	private timeout = 0

	public destoryView() {
    }


	initUI() {
		super.initUI()
	}
	private timeId: number

	public showBoostPower(e, t): void {
		if (0 == this.lastPower) {
			this.lastPower = t
			this.timeId = egret.setTimeout(this.delayPowerUp, this, 500)
		} else {
			if (this.timeId) {
				egret.clearTimeout(this.timeId)
			}
			this.timeId = egret.setTimeout(this.delayPowerUp, this, 500)
		}
	}

	private clearShow() {
		egret.Tween.removeTweens(this.img)
		egret.Tween.removeTweens(this.powerLabel)
		egret.Tween.removeTweens(this.addPowerLabel)
		this.img.visible = !1
		this.addPowerLabel.text = ""
		TimerManager.ins().removeAll(this)
		egret.clearTimeout(this.timeout)
		this.timeout = 0
	}

	private delayPowerUp(): void {
		this.timeId = null
		if (!ViewManager.ins().isShow(BoostPowerView)) {
			ViewManager.ins().open(BoostPowerView)
		}

        // this.mc.loadUrl(ResDataPath.GetUIEffePath2("effe_ui_uppower_floor"), true, 1);
		// this.group.addChild(this.mc)

		var power = this.lastPower
		var curPower = GameLogic.ins().actorModel.power
		this.lastPower = 0

		if (curPower > power) {
			this.showPowerUp(power, curPower)
		}
	}

	private showPowerUp(lastPower, curPower): void {
		this.clearShow()
		this.img.visible = !0
		this.img.alpha = 1;

		let bitmapObj = this.powerLabel
		bitmapObj.alpha = 1

		var diffValue = curPower - lastPower;
		TimerManager.ins().doTimer(20, 25, () => {
			var t = diffValue;
			t += Math.round(Math.random() * t);
			var lastPowerStr = lastPower.toString()
			var o = t.toString().length == lastPowerStr.length ? t.toString().slice(1) : t + ""
			lastPowerStr = lastPowerStr.charAt(0)
			lastPowerStr += o
			bitmapObj.text =lastPowerStr
		}, this, () => {
			bitmapObj.text =GameLogic.ins().actorModel.power.toString()
			var e = "+" + diffValue
			var addLabel = this.addPowerLabel 
			addLabel.alpha = 1
			addLabel.y = 0
			addLabel.text = e
			addLabel.x = bitmapObj.width - addLabel.width
			addLabel.y -= bitmapObj.height
			var t1 = 1e3
			let	t2 = 500
			let tween = egret.Tween.get(addLabel);
			tween.to({
				y: addLabel.y - 45
			}, t1).to({
				alpha: 0
			}, t2)
			var tween2 = egret.Tween.get(bitmapObj);
			tween2.wait(t1).to({
				alpha: 0
			}, t2)
			var tween3 = egret.Tween.get(this.img);
			tween3.wait(t1).to({
				alpha: 0
			}, t2).call(() => {
				this.img.visible = false
				this.CloseSelf()
			}, this)
		}, this)
	}
}
;