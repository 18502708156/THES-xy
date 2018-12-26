class GangProtectorJinJieAwardWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// GangProtectorJinJieAwardSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected list: eui.List;
	protected desc_text: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GangProtectorJinJieAwardSkin"
		this.commonDialog.title = "进阶奖励"
	}

	public childrenCreated() {
		this.list.itemRenderer = ItemBase
		this.list.dataProvider = new eui.ArrayCollection([])
	}

	public OnOpen(...args) {
		this.commonDialog.OnAdded(this);
		if (args && args.length > 0)
			this.UpdateContent(args[0]);
	}
	private UpdateContent(lv) {
		var itemLists = [];
		var config = GameGlobal.Config.GuildActiveConfig[lv + 1];
		if (config == null) {
			config = GameGlobal.Config.GuildActiveConfig[lv];
		}
		(this.list.dataProvider as eui.ArrayCollection).replaceAll(config.reward);
		this.desc_text.text = "守护达到" + lv + "级可获得"
	}

	public OnClose() {
		this.removeEvents();
	}
}