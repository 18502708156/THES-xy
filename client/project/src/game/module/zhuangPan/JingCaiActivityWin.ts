class JingCaiActivityWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
    // KaiFuActivityWinSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		//this.skinName = "FuliMainSkin"
		this.skinName = UIHelper.PANEL_NO_TAB
	}

	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(ZhuangPanActivityPanel),
		])
	}
	private changeTitle(e): void
	{
		this.commonWindowBg.SetTitle(e[0])
	}

	public OnOpen(...param: any[]) {
		var nIndex = param[0] || 0;
		this.commonWindowBg.OnAdded(this, nIndex)
		let openActid = param[1];//默认第二个参数是要打开的子窗口的子窗口 
		if(openActid){
			<any>this.commonWindowBg.GetCurViewStackElement().OnOpen(null,openActid);
		}
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}
}