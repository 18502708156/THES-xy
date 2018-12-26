class GBattleEnterTempleTipWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GBattleEnterTempleTipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected btnEnter: eui.Button;
	protected labGangName1: eui.Label;
	protected labGangName2: eui.Label;
	protected labGangName3: eui.Label;
	protected groupDuration: eui.Group;
	protected durationLab: DurationLabel;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GBattleEnterTempleTipSkin"
		
		this._AddClick(this.btnEnter, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "龙殿入口"

		let gangList = GameGlobal.GangBattleModel.mEnterDragonInfo.guildinfos
		for (let idx=0; idx<3; idx++)
		{
			let info = gangList[idx]
			this[`labGangName${idx+1}`].text = info ? `${info.guildName}.s${info.serverId}` : ""
		}

		let endTime = GameGlobal.GangBattleModel.mEnterDragonInfo.countdown
		this.groupDuration.visible = endTime > GameServer.serverTime
		if (endTime <= GameServer.serverTime)
		{
			return
		}

		this.durationLab.SetColor(0x6e330b)
		this.durationLab.SetEndTime(endTime, DurationLabel.TIMETEXT_TYPE_MMSS)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		if (!this.CanEnter())
		{
			UserTips.ins().showTips("您的帮会未获得进入资格，可回到上层继续挑战天王")
			return
		}
		
		GameGlobal.GangBattleModel.SendEnterNext()
		ViewManager.ins().close(this)
	}

	private CanEnter() {
		let myGangId = GameGlobal.actorModel.guildID
		let gangList = GameGlobal.GangBattleModel.mEnterDragonInfo.guildinfos
		for (let info of gangList)
		{
			if (myGangId == info.guildId)
			{
				return true
			}
		}

		return false
	}
}