class QujingTipPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // QujingTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected labTip: eui.Label;
	protected btnEnter: eui.Button;
	protected btnCancel: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "QujingTipSkin"
		this._AddClick(this.btnEnter, this._onClick)
		this._AddClick(this.btnCancel, this._onClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "提示"

		let doudleTime = GameGlobal.Config.EscortBaseConfig.doubletime
		this.labTip.text = `${doudleTime[0].star}-${doudleTime[0].ends}和${doudleTime[1].star}-${doudleTime[1].ends}奖励翻倍`
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _onClick(e) {
		switch (e.currentTarget) {
			case this.btnEnter:
				ViewManager.ins().open(QujingChooseWin)
				ViewManager.ins().close(this)
				break
			case this.btnCancel:
				ViewManager.ins().close(this)
			break
		}
	}
}