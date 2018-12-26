class GBattleDragonGuardWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GBattleDragonGuardSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected btnConfirm: eui.Button;
	protected item1: GBattleDragonItem;
	protected item2: GBattleDragonItem;
	protected item3: GBattleDragonItem;
	protected bar: eui.ProgressBar;
	protected labProgNum: eui.Label;
	protected labDurationTip: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GBattleDragonGuardSkin"
		
		this._AddClick(this.btnConfirm, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "神龙鼎"
		let guardsInfo = GameGlobal.GangBattleModel.guardsInfo
		this.bar.maximum = 100
		this.bar.value = guardsInfo.mHp
		this.labProgNum.text = `${guardsInfo.mHp}%`

		if (guardsInfo.mGuardType == 0)
		{
			// this.labDurationTip.text = ""
			let monstrerIconList = GameGlobal.Config.GuildBattleBaseConfig.lboss_icon
			let monsterNameList = GameGlobal.Config.GuildBattleBaseConfig.lboss_name
			let idx = 1
			for (let icon of monstrerIconList)
			{
				if (this[`item${idx}`])
				{
					this[`item${idx}`].visible = true
					this[`item${idx}`].SetMonsterInfo(icon, monsterNameList[idx-1])
				}

				idx++
			}
			return
		}

		// this.labDurationTip.text = `已占领时长：${GameServer.serverTime - guardsInfo.mHoldTime}s`
		// this.AddTimer(1000, 0, this.UpdateTime)
		
		let guardList = guardsInfo.mGuardList
		if (guardList.length == 1)
		{
			this.item1.visible = false
			this.item2.visible = true
			this.item2.SetGuardInfo(guardList[0])
			return 
		}
		let idx = 1
		for (let info of guardList)
		{
			if (this[`item${idx}`])
			{
				this[`item${idx}`].visible = true
				this[`item${idx}`].SetGuardInfo(info)
				this[`item${idx}`].SetLeader(idx == 1)
			}

			idx++
		}
	}

	public OnClose() {
		TimerManager.ins().removeAll(this)
		this.commonDialog.OnRemoved()
	}

	// private UpdateTime() {
	// 	let guardsInfo = GameGlobal.GangBattleModel.guardsInfo
	// 	this.labDurationTip.text = `已占领时长：${GameServer.serverTime - guardsInfo.mHoldTime}s`
	// }

	private _OnClick(e: egret.TouchEvent) {
		let guardsInfo = GameGlobal.GangBattleModel.guardsInfo
		if (guardsInfo.mGangId == GameGlobal.actorModel.guildID)
		{
			UserTips.ins().showTips("同帮会不可互相攻击")
			return
		}

		GameGlobal.GangBattleModel.SendAttackBoss(null)
		this.CloseSelf()
	}
}