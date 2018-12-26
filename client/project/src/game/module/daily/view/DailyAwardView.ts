class DailyAwardView extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // DailyAwardSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonDialog:CommonDialog;
	protected labText:eui.Label;
	protected item1:ItemBaseNotName;
	protected item2:ItemBaseNotName;
	protected item3:ItemBaseNotName;
    /////////////////////////////////////////////////////////////////////////////


	private mChooseIdx: number

	public constructor() {
		super()
		this.skinName = "DailyAwardSkin"
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "奖励展示"
		let rewards = param[0]
		let target = param[1]

		this.labText.text = `活跃度达到${target}的奖励`
		let idx = 1
		for (let reward of rewards)
		{
			if (this[`item${idx}`])
			{
				this[`item${idx}`].visible = true
				this[`item${idx}`].setItemAward(reward.type, reward.id, reward.count)
			}

			idx++
		}
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}