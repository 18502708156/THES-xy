class GBattleJoinTipWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GBattleJoinTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected btnConfirm: eui.Button;
	protected group1: eui.Group;
	protected labAbbreviated1: eui.Label;
	protected labGangName1: eui.Label;
	protected group2: eui.Group;
	protected labAbbreviated2: eui.Label;
	protected labGangName2: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GBattleJoinTipSkin"
		
		this._AddClick(this.btnConfirm, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "参战帮会"

		let joinInfos = GameGlobal.GangBattleModel.mJoinInfos || []
		for (let idx=0; idx<2; idx++)
		{
			let info = joinInfos[idx]
			this[`group${idx+1}`].visible = info != null
			if (info)
			{
				this[`labAbbreviated${idx+1}`].text = info.guildName.substr(0, 1)
				this[`labGangName${idx+1}`].text = info.guildName
			}
		}
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this)
		
	}
}