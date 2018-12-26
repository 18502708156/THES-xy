class DailyBoxItem extends eui.Component implements  eui.UIComponent {

	// DailyBoxSkin.exml

	protected imgBox: eui.Image;
	protected labActiveNum: eui.Label;
	protected imgGained: eui.Image;
	protected redPoint: eui.Image


	public constructor() {
		super()
	}

	public childrenCreated() {
		this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBoxClick, this)
	}

	public setBoxInfo(boxConfig) {
		this.imgBox.name = boxConfig.id
		this.imgBox.source = `ui_xyll_bm_xiangzi0${boxConfig.quality}`
		this.labActiveNum.text = boxConfig.target
		this.imgGained.visible = GameGlobal.DailyModel.HasGainedActiveReward(boxConfig.id)
		this.redPoint.visible = GameGlobal.DailyModel.IsActiveTargetDone(boxConfig.target) && !this.imgGained.visible
	}

	private _OnBoxClick(e: egret.TouchEvent) {
		let rewardNum = parseInt(e.currentTarget.name)
		if (GameGlobal.DailyModel.HasGainedActiveReward(rewardNum))
		{
			return
		}

		let config = GameGlobal.Config.DailyActiveConfig[rewardNum]
		if (GameGlobal.DailyModel.IsActiveTargetDone(config.target))
		{
			GameGlobal.DailyModel.SendGainActiveAward(rewardNum)
			return
		}

		ViewManager.ins().open(DailyAwardView, config.reward, config.target)
	}
}