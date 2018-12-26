class GainLabel extends eui.Component {

	/////////////////////////////////////////////////////////////////////////////
	// GainLabelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	public getwayLabel: eui.Label;
	protected getGroup: eui.Group;
	/////////////////////////////////////////////////////////////////////////////

	private mLabels: eui.Label[] = []
	private gainWayData: any

	private mId: number

	public constructor() {
		super()
	}

	childrenCreated() {

		this.mLabels = this.getGroup.$children as any
		for (let i = 0; i < this.mLabels.length; i++) {
			this.mLabels[i].name = i + ""
			this.mLabels[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
		}
		if (this.mId) {
			this.SetId(this.mId)
		}
	}

	private OnClick(e: egret.TouchEvent) {
		if (!this.gainWayData) {
			return
		}
		let index = Number(e.currentTarget.name)
		let data = this.gainWayData[index]
		if (data && data[2] == 1) {
			GameGlobal.ViewManager.Guide(data[1][0])
		}
		else if (data && data[2] == 2) {
			GameGlobal.UserTips.showTips(data[0])
		}
	}

	public SetId(id: number) {
		this.mId = id
		if (!this.mLabels.length) {
			return
		}
		for (let label of this.mLabels) {
			UIHelper.SetVisible(label, false)
		}

		let gainConfig = GameGlobal.Config.GainItemConfig[id]
		if (gainConfig && gainConfig.gainWay && gainConfig.gainWay.length) {
			this.gainWayData = gainConfig.gainWay
			for (let i = 0; i < gainConfig.gainWay.length; i++) {
				let data = gainConfig.gainWay[i]
				let label = this.mLabels[i]
				if (!label) {
					break
				}
				UIHelper.SetVisible(label, true)
				if (!data[2]) {
					label.text = data[0]
				} else {
					UIHelper.SetLinkStyleLabel(label, data[0])
				}
			}
		} else {
			this.mLabels[0].text = "暂无"
			UIHelper.SetVisible(this.mLabels[0], true)
		}
	}
}