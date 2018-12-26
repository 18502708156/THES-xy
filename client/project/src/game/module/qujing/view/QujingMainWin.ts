class QujingMainWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // QujingMainSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected groupEscorting: eui.Group;
	protected btnRecord: eui.Button;
	protected labCount: eui.Label;
	protected labRobCount: eui.Label;
	protected btnEscort: eui.Button;
	protected imgDouble: eui.Image;
	protected labQuilkFinish: eui.Label;
	protected panel: eui.Panel;
	protected durationLab: DurationLabel;

    /////////////////////////////////////////////////////////////////////////////

	private mShowRewardInfo: any
	private mItem: QujingEscortItem

	public constructor() {
		super()
		this.skinName = "QujingMainSkin"
		this.commonWindowBg.SetTitle("取经东归")

		this._AddClick(this.btnEscort, this._OnClick)
		this._AddClick(this.btnRecord, this._OnClick)
		this._AddClick(this.labQuilkFinish, this._OnClick)
		GameGlobal.QujingModel.SendEnterEscortView()
		GameGlobal.QujingModel.SendEscortList()
	}

	public childrenCreated() {
		this.durationLab.SetColor(0x6e330b)
	}

	public OnOpen(...args) {
		this.observe(MessageDef.QUJING_UPDATE_BASEINFO, this.UpdateContent)
		this.observe(MessageDef.QUJING_SHOW_REWARD, this.RecordReward)
		this.observe(MessageDef.QUJING_UPDATE_ESCORTLIST, this.ShowEscortList)
		this.observe(MessageDef.QUJING_SHOW_ROBVIEW, this.ShowRobView)
		this.commonWindowBg.OnAdded(this)
		this.shuffleList()
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
            case this.btnRecord:
				ViewManager.ins().open(QujingRecordWin)
			break
			case this.btnEscort:
				this.HandleEscort()
			break
			case this.labQuilkFinish:
				this.HandleQuilkFinish()
			break
		}
	}

	private UpdateContent() {
		let baseInfo = GameGlobal.QujingModel.baseInfo
		let escortMaxCount = GameGlobal.Config.EscortBaseConfig.escortnum
		this.labCount.text = `${escortMaxCount - baseInfo.mEscortCount}/${escortMaxCount}`
		let robMaxCount = GameGlobal.Config.EscortBaseConfig.robtime
		this.labRobCount.text = `${robMaxCount - baseInfo.mRobCount}/${robMaxCount}`

		this.groupEscorting.visible = baseInfo.mState == QujingModel.ESCORT_STATE_DOING
		this.btnEscort.label = this.GetBtnLabelText(baseInfo.mState)
		this.imgDouble.visible = GameGlobal.QujingModel.IsDoudleAwardTime()
		this.labQuilkFinish.textFlow = (new egret.HtmlTextParser).parser("<font color='#019704'><u>"+ "快速完成" +"</u></font>")

		if (this.mItem && this.mItem.parent)
		{
			this.panel.removeChild(this.mItem)
			this.mItem = null
		}
			
		if (baseInfo.mState == QujingModel.ESCORT_STATE_DOING)
		{
			this.durationLab.SetEndTime(baseInfo.mFinishTime, DurationLabel.TIMETEXT_TYPE_MMSS)
			this.SetMyEscortInfo()
		}
		else
		{
			this.durationLab.Stop()
		}
	}


	private RecordReward(info) {
		this.mShowRewardInfo = info
		ViewManager.ins().open(QujingAwardWin, this.mShowRewardInfo)
	}

	private ShowRobView(playerId) {
		ViewManager.ins().open(QujingRevengeWin, playerId, QujingModel.ESCORT_FIGHT_TYPE_ROB)
	}

	private ShowEscortList() {
		let escortList = GameGlobal.QujingModel.escortList
		let idx = 0
		for (let escortInfo of escortList) {
			let settingInfo = this.mSettingList[idx]
			if (!settingInfo)
				break

			let escortItem = new QujingEscortItem
			escortItem.$setX(settingInfo.xPos)
			escortItem.$setY(settingInfo.yPos)
			escortItem.SetItem(escortInfo, idx*0.3, settingInfo)
			this.panel.addChild(escortItem)
			idx++
		}
	}

	private SetMyEscortInfo() {
		this.mItem = new QujingEscortItem
		let escortInfo = new EscortInfo
		let baseInfo = GameGlobal.QujingModel.baseInfo
		escortInfo.mFinishTime = baseInfo.mFinishTime
		escortInfo.mPlayerId = GameGlobal.actorModel.actorID
		escortInfo.mPlayerName = GameGlobal.actorModel.name
		escortInfo.mQuality = baseInfo.mQuality
		escortInfo.mPower = GameGlobal.actorModel.power
		escortInfo.mRobbedCount = 0
		this.mItem.SetItem(escortInfo, 0, {time:18})
		this.mItem.$setY(350)
		this.panel.addChild(this.mItem)
	}

	private HandleQuilkFinish() {
		let cost = GameGlobal.Config.EscortBaseConfig.completecostb
		WarnWin.show(`是否花费${cost.count}${GameGlobal.actorModel.GetCurrencyName(cost.id)}快速完成?`, () => {
			Checker.Currency(cost, true, null, () => {
				GameGlobal.QujingModel.SendQuilkFinish()
			})
		}, this)
	}

	private HandleEscort() {
		let baseInfo = GameGlobal.QujingModel.baseInfo
		let state = baseInfo.mState
		switch(state) {
			case QujingModel.ESCORT_STATE_FREE:
				if (baseInfo.mEscortCount == GameGlobal.Config.EscortBaseConfig.escortnum)
				{
					UserTips.ins().showTips("今日次数用完了")
					return
				}

				if (!GameGlobal.QujingModel.IsDoudleAwardTime())
				{
					ViewManager.ins().open(QujingTipPanel)
					return
				}

				ViewManager.ins().open(QujingChooseWin)
			break
			case QujingModel.ESCORT_STATE_DOING:
				UserTips.ins().showTips("护送中...")
			break
			case QujingModel.ESCORT_STATE_DONE:
				if (!this.mShowRewardInfo)
					return
					
				ViewManager.ins().open(QujingAwardWin, this.mShowRewardInfo)
			break
		}
		
	}

	private GetBtnLabelText(state) {
		let text = ""
		switch(state) {
			case QujingModel.ESCORT_STATE_FREE:
				text = "前往护送"
			break
			case QujingModel.ESCORT_STATE_DOING:
				text = "护送中"
			break
			case QujingModel.ESCORT_STATE_DONE:
				text = "领取奖励"
			break
		}

		return text
	}

	private GetTimeText(diffTime) {
		let min = Math.floor(diffTime / 60)
		let second = diffTime % 60
		return `${min}:${second}`
	}

	private mSettingList = [
		{xPos:-200, yPos:20, time:22},
		{xPos:-400, yPos:180, time:26},
		{xPos:-100, yPos:320, time:20},
		{xPos:-300, yPos:20, time:24},
		{xPos:0, yPos:240, time:18},
		{xPos:-150, yPos:400, time:21},
		{xPos:-350, yPos:370, time:25},
		{xPos:-100, yPos:80, time:20},
		{xPos:-200, yPos:450, time:22},
		{xPos:-250, yPos:220, time:23},
	]

	private shuffleList() {
		for (let idx=0; idx<this.mSettingList.length; ++idx)
		{
			let swapIdx = MathUtils.limitInteger(idx+1, this.mSettingList.length-1)
			let tempInfo = this.mSettingList[swapIdx]
			this.mSettingList[swapIdx] = this.mSettingList[idx]
			this.mSettingList[idx] = tempInfo
		}
	}
}