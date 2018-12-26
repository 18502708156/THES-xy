class ClearanceAwardPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // ClearanceAwardSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected tips: eui.Label;
	protected goodsName: eui.Label;
	protected goodsCount: eui.Label;
	protected gchapreward: ItemBaseNotName;
	protected btnGain: eui.Button;
	protected hasGainTip: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private chapterId: number

	public constructor() {
		super()
		this.skinName = "ClearanceAwardSkin"
		this._AddClick(this, this.CloseSelf)
		this._AddClick(this.btnGain, this._onClick)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "奖励"

		let mapId = param[0]
		this.chapterId = param[1]
		
		let config = GameGlobal.Config.ChaptersMapConfig[mapId]
		if (!config)
			return

		this.tips.text = config.name

		let chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[this.chapterId]
		let rewards = chapterRewardConfig.rewards
		this.gchapreward.data = rewards[0]

		let itemConfig = GlobalConfig.ins().ItemConfig[rewards[0].id];
		this.goodsName.text = itemConfig.name
		this.goodsCount.text = "数量*" + rewards[0].count
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _onClick(e) {
		switch (e.currentTarget) {
			case this.btnGain:
				GameGlobal.UserFb.gainChapterReward(this.chapterId)
				break
		}
	}
}