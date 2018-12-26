class NpcDialogPopWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// NpcDialogSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected imgIcon: eui.Image;
	protected cmlabName: CmLabel;
	protected labDesc: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "NpcDialogSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		let npcId = param[0]
		let config = GameGlobal.Config.CityNpcConfig[npcId]
		if (!config)
			return

		this.imgIcon.source = config.icon
		this.cmlabName.text = config.npcname
		this.labDesc.text = this.GetRandomDesc(config.des)
	}

	public OnClose() {

	}

	public GetRandomDesc(desList) {
		if (!desList || desList.length == 0)
			return ""

		let len = desList.length
		let randIdx = Math.floor(Math.random() * (len - 0.1))
		return desList[randIdx]
	}
}