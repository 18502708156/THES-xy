class QujingRevengeWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// QujingRevengeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected imgFace: eui.Image;
	protected btnCancel: eui.Button;
	protected btnConfirm: eui.Button;
	protected labName: eui.Label;
	protected labPower: eui.Label;
	protected labGangName: eui.Label;
	protected labAwardTitle: eui.Label;
	protected labTip: eui.Label;
	protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	private mId: number
	private mType: number
	private mPlayerId: number

	public constructor() {
		super()
		this.skinName = "QujingRevengeSkin"
		this._AddClick(this.btnConfirm, this._OnClick)
		this._AddClick(this.btnCancel, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.observe(MessageDef.PALYER_INFO, this.UpdateContent)

		this.mId = param[0]
		this.mType = param[1]
		this.list.itemRenderer = ItemBaseNotName
		this.list.dataProvider = new eui.ArrayCollection([])

		if (this.mType == QujingModel.ESCORT_FIGHT_TYPE_REVENGE) 
		{
			this.commonDialog.title = "复仇"
			this.labAwardTitle.text = "复仇奖励"
			this.labTip.visible = true
			let recordInfo = GameGlobal.QujingModel.GetRecordInfo(this.mId)
			GameGlobal.PlayerInfoModel.sendOtherId(recordInfo.mPlayerId)
		}
		else
		{
			this.commonDialog.title = "拦截"
			this.labAwardTitle.text = "拦截奖励"
			this.labTip.visible = false
			let escortInfo = GameGlobal.QujingModel.GetEscortInfo(this.mId)
			GameGlobal.PlayerInfoModel.sendOtherId(escortInfo.mPlayerId)
		}
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	public UpdateContent(playerInfo: Sproto.sc_show_other_player_request) {
		this.imgFace.source = ResDataPath.GetHeadImgName(playerInfo.job, playerInfo.sex)
		this.labName.text = `名称：${playerInfo.name}`
		this.labPower.text = `战力：${playerInfo.power}`
		this.labGangName.text = playerInfo.guildName ? `帮会：${playerInfo.guildName}` : ""

		let rewards
		if (this.mType == QujingModel.ESCORT_FIGHT_TYPE_REVENGE) 
		{
			let info = GameGlobal.QujingModel.GetRecordInfo(this.mId)
			let config = GameGlobal.QujingModel.GetConfigByQuality(info.mQuality)
			rewards = config.revengeaward
		}
		else
		{
			let info = GameGlobal.QujingModel.GetEscortInfo(this.mId)
			let config = GameGlobal.QujingModel.GetConfigByQuality(info.mQuality)
			rewards = config.robreward
		}

		this.list.dataProvider = new eui.ArrayCollection(rewards)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnCancel:
				ViewManager.ins().close(this)
			break
			case this.btnConfirm:
				if (!UserFb.CheckFighting())
					return
					
				if (this.mType == QujingModel.ESCORT_FIGHT_TYPE_REVENGE)
					GameGlobal.QujingModel.SendRevenge(this.mId)
				else
					GameGlobal.QujingModel.SendRob(this.mId)

				ViewManager.ins().close(this)
			break
		}
	}
}