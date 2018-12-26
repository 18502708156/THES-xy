class DailyMainWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // DailyMainSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected viewStack: TabView;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "DailyMainSkin"
	}

	public childrenCreated() {
		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(DailyInfoPanel, {skinName: "DailyInfoSkin"}),
			TabView.CreateTabViewData(DailyFomalhautMainPanel, {skinName: "DailyFomalhautMainSkin"}),
			TabView.CreateTabViewData(DailyPeacePanel, {skinName: "DailyPeaceSkin"}),
			TabView.CreateTabViewData(DailyTeamPanel, {skinName: "DailyTeamSkin"}),
		]
		 
		this.commonWindowBg.SetViewStack(this.viewStack)
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_48);
	}

	public OnOpen(...args) {
		var index = args[0];
		this.commonWindowBg.OnAdded(this, index)

		this.observe(MessageDef.DAILY_MEDAL_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.DAILY_ACTIVE_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.DAILY_TEAM_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.DAILY_PEACE_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.DAILY_UPDATE_RETREVE_VIEW, this.UpdateTabBtnRedPoint)

		this.UpdateTabBtnRedPoint()
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private UpdateTabBtnRedPoint() {
		let redPointFlag = GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.MEDAL_UPGRADE)
							|| GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.ACTIVE_BOX_REWARD)
							|| GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.RES_RETRIEVE)
							|| GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.EXP_RETRIEVE)
		this.commonWindowBg.ShowTalRedPoint(0, redPointFlag)
		this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.FOMALHAUT_NOTICE))
		this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.PEACE_REWARD))
		this.commonWindowBg.ShowTalRedPoint(3, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.TEAM_REWARD))
	}
}