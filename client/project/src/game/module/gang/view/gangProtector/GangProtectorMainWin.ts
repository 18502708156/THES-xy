class GangProtectorMainWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main
    /////////////////////////////////////////////////////////////////////////////
    // GangProtectorMainSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected viewStack: TabView;
    /////////////////////////////////////////////////////////////////////////////

	public static GANG_PROTECTOR_PANEL = 0;
	public static GANG_AWARD_PANEL = 1;

	public constructor() {
		super()
		this.skinName = "GangProtectorMainSkin"

		this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, this.UpdateTabBtnRedPoint)
	}

	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(GangDefendPanel, {skinName: "GangDefendPanelSkin", mContext: this}),
			TabView.CreateTabViewData(GangProtectorAwardPanel, {skinName: "GangProtectorAwardListSkin", mContext: this}),
		])
	}

	public OnOpen(...args) {
		var index = 0;
		if(args && args.length > 0){
			index = args[0];
		}
		
		this.commonWindowBg.OnAdded(this, index)
		this.UpdateTabBtnRedPoint()
	}

	public static openCheck(...param: any[]) {
		if (!GameGlobal.GangModel.HasGang())
		{
			UserTips.ins().showTips("您还没有帮会，请先加入帮会")
			return false
		}
		return Deblocking.Check(DeblockingType.TYPE_50)
	}

	private UpdateTabBtnRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GUARD_UPGRADE))
		this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.DAILY_AWARD))

	}

	public OnClose() {
	}
}