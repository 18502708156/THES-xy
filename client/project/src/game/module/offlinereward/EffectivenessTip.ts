class EffectivenessTip extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // CheckEfficienSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bgImg: eui.Image;
    protected groupGold: eui.Group;
    protected nextMoney: eui.Label;
    protected curMoney: eui.Label;
    protected groupExp: eui.Group;
    protected nextExp: eui.Label;
    protected curExp: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "CheckEfficienSkin";
		this.touchEnabled = false
		this.touchChildren = false
	}


	OnOpen() {

		this.update();
		TimerManager.ins().doTimer(2000, 1, () => {
			var t = egret.Tween.get(this);
			t.to({ "alpha": 0 }, 1000).call(() => {
				this.alpha = 1;
				ViewManager.ins().close(this);
			}, this);
		}, this);
	};

	update() {
		let userFb = GameGlobal.UserFb
		if (userFb.config.expEff == userFb.lastData.expEff) {
			this.groupExp.visible = false;
		}
		else {
			this.groupExp.visible = true;
			this.nextExp.text = userFb.config.expEff + "";
			this.curExp.text = userFb.lastData.expEff + "";
		}
		if (userFb.config.goldEff == userFb.lastData.goldEff) {
			this.groupGold.visible = false;
		}
		else {
			this.groupGold.visible = true;
			this.nextMoney.text = userFb.config.goldEff + "";
			this.curMoney.text = userFb.lastData.goldEff + "";
		}
	};
}
