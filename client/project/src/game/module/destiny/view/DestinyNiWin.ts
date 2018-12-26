class DestinyNiWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main


	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
		this.mCommonWindowBg.title = "逆命"
	}

	public childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(DestinyNiPanel),
			// TabView.CreateTabViewData(DestinyNiEq),
		])
	}

	public OnOpen() {
		this.mCommonWindowBg.OnAdded(this)
		
		this.UpdateContent()
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}



	private UpdateContent() {
		if (GameGlobal.LingtongAttrModel.IsActive()) {
			this.mCommonWindowBg.GetCurViewStackElement().UpdateContent()
		}
	}




    public static openCheck(...param: any[]) {
        // return Deblocking.Check(DeblockingType.TYPE_116)
        return true
    }
}