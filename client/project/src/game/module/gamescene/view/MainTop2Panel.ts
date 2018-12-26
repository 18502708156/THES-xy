class MainTop2Panel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_USER_INFO

    /////////////////////////////////////////////////////////////////////////////
    // MainTop2PanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected playerInfo: MainPlayerInfoView;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "MainTop2PanelSkin";
	}

	public destoryView() { }

	public OnOpen(...param: any[]) {
		super.OnOpen(param);
		this.playerInfo.OnOpen()
	}

	public OnClose() {
		this.playerInfo.OnClose()
	}
}