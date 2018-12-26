class GBattleExitTipWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GBattleExitTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected btnPrev: eui.Button;
	protected btnExit: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GBattleExitTipSkin"
		
		this._AddClick(this.btnPrev, this._OnClick)
		this._AddClick(this.btnExit, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(true)
		this.commonDialog.title = "提示"
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch(e.currentTarget) {
			case this.btnExit:
				GameGlobal.CommonRaidModel.MapLeave()
				GameGlobal.GangBattleModel.SendExitGBattle()
			break
			case this.btnPrev:
				GameGlobal.GangBattleModel.SendReturnPrev()
			break
		}

		this.CloseSelf()
	}
}