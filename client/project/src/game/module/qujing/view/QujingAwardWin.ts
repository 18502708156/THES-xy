class QujingAwardWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // QujingAwardSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected labAward1: eui.Label;
	protected labAward2: eui.Label;
	protected labAward3: eui.Label;
	protected labAward4: eui.Label;
	protected btnAward: eui.Button;
	protected labName: eui.Label;
	protected imgIcon: eui.Image;
	protected groupTip1: eui.Group;
	protected labTip1: eui.Label;
	protected labResult1: eui.Label;
	protected groupTip2: eui.Group;
	protected labTip2: eui.Label;
	protected labResult2: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "QujingAwardSkin"
		this._AddClick(this.btnAward, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "取经奖励"
		this.UpdateContent(param[0])
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private UpdateContent(rewardInfo) {
		let baseInfo = GameGlobal.QujingModel.baseInfo
		let config = GameGlobal.QujingModel.GetConfigByQuality(baseInfo.mQuality)
		this.labName.text = config.name
		this.labName.textColor = ItemBase.GetColorByQuality(config.quality-1)
		this.imgIcon.source = config.icon

		let index = 1
		for (let reward of rewardInfo.reachReward || [])
		{
			let cntlName = `labAward${index}`
			if (this[cntlName]) 
			{
				this[cntlName].visible = true
				let lossCount = this.GetLossCount(reward, rewardInfo.lossReward || [])
				let text = `|C:0x6e330b&T:${this.GetItemName(reward)}：||C:0x019704&T:${reward.count}|`
				if (lossCount)
				{
					text += `|C:0xdb0000&T:  ${lossCount}| `
				}
				this[cntlName].textFlow = TextFlowMaker.generateTextFlow(text)
			}

			index++
		}

		index = 1
		for (let record of rewardInfo.record)
		{
			let groupName = `groupTip${index}`
			if (this[groupName])
			{
				this[groupName].visible = true
				let text = `|C:0x019704&T:${record.name}||C:0x6e330b&T:抢夺了我的||C:0xdb0000&T:${config.name}|`
				this[`labTip${index}`].textFlow = TextFlowMaker.generateTextFlow(text)
				this[`labResult${index}`].text = record.isWin ? "抵御失败" : "抵御成功"
				this[`labResult${index}`].textColor = record.isWin ? 0xdb0000 : 0x019704
			}

			index++
		}
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnAward:
				GameGlobal.QujingModel.SendGainAward()
				ViewManager.ins().close(this)
			break
		}
	}

	private GetLossCount(reward, lossList) {
		for (let lostInfo of lossList) 
		{
			if (reward.id == lostInfo.id)
				return lostInfo.count
		}
	}

	private GetItemName(reward) {
		if (reward.type == 0)
			return RewardData.getCurrencyName(reward.id)

		let itemConfig = GlobalConfig.ins().ItemConfig[reward.id]
		return itemConfig.name
	}
}