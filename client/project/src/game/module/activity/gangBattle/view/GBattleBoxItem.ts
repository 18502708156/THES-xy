class GBattleBoxItem extends eui.Component implements  eui.UIComponent {

	// GBattleScoreBoxSkin.exml

	protected imgBox: eui.Image;
    protected groupScore: eui.Group;
    protected labCurScore: eui.Label;
	protected labItem: eui.Label;
	protected priceIcon: PriceIcon;


	public constructor() {
		super()
	}

	public childrenCreated() {
		this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBoxClick, this)
		this.groupScore.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnScoreClick, this)
	}

	public SetScoreInfo() {
		let gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo
        let curScore = gbPlayerGlobalInfo.mScore
        let scoreConfig = GameGlobal.GangBattleModel.GetNextScoreConfig()
        if (scoreConfig)
        {
            let curScoreText = curScore >= (scoreConfig.needpoints || 0) ? `|C:0x2dff42&T:${curScore}` :  `|C:0xdb0000&T:${curScore}`
            this.labCurScore.textFlow = TextFlowMaker.generateTextFlow(`${curScoreText}/|C:0xffffff&T:${scoreConfig.needpoints || 0}|`)
			let item = scoreConfig.showitem[0]
			this.priceIcon.visible = true
			this.priceIcon.type = item.id
			this.priceIcon.setPrice(item.count, 2)
        }
        else
        {
			this.labCurScore.text = ""
            this.labItem.text = `没有可领取的奖励`
			this.labItem.textColor = Color.OrangeColor
			this.priceIcon.visible = false
        }
	}

	private _OnBoxClick(e: egret.TouchEvent) {
		ViewManager.ins().open(GBattleScoreWin)
	}

	private _OnScoreClick() {
		let gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo
		let curScore = gbPlayerGlobalInfo.mScore
		let scoreConfig = GameGlobal.GangBattleModel.GetNextScoreConfig()
		if (!scoreConfig)
		{
			return
		}
		if (curScore >= scoreConfig.needpoints)
		{
			GameGlobal.GangBattleModel.SendGainScoreAward(scoreConfig.id)
		}
		else
		{
			UserTips.ins().showTips("积分不足")
		}
	}
}