class TianshenDetailWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// TianshenDetailSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected item: ItemBaseNotName;
	protected labItemName: eui.Label;
	protected labItemDesc: eui.Label;
	protected showPanel: PetShowPanel;
	protected labName: eui.Label;
	protected labDesc: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TianshenDetailSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		let config = param[0]
		let count = param[1]

		this.item.setDataByConfig(config)
		this.item.setCount(`${count || ""}`)
		this.labItemName.text = config.name
		this.labItemName.textColor = ItemBase.GetColorByQuality(config.quality)

		let tianshenConfig = GameGlobal.Config.AirMarshalListConfig[config.pid]
		this.labName.text = tianshenConfig.name
		this.labName.textColor = ItemBase.GetColorByQuality(tianshenConfig.quality)
		this.labItemDesc.text = `可用于激活天神【${tianshenConfig.name}】`
		this.labDesc.text = config.desc

		this.showPanel.SetBody(GameGlobal.TianShenModel.GetSkin(config.pid))
	}

	public OnClose() {

	}
}