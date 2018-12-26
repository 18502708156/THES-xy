class AuctionMainPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL;
	}

	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(AuctionAllServicePanel),
			TabView.CreateTabViewData(AuctionGuildPanel),
		])
	}

	public OnOpen(...param: any[]) {
		var nIndex = param[0] || 0;
		this.commonWindowBg.OnAdded(this, nIndex)
	}

	public OnOpenIndex(selectedIndex: number): boolean {
		if(selectedIndex == 1) {
			if(!GameGlobal.actorModel.HasGuild()) {
				UserTips.ins().showTips('您没有加入帮会');
				return false;
			}
		}
		return true
	}

	
    public static openCheck(...param: any[]) {
		if (param[0] == 1) {
			if(!GameGlobal.actorModel.HasGuild()) {
				UserTips.ins().showTips('您没有加入帮会');
				return false;
			}
		}
        return true;
    }
}