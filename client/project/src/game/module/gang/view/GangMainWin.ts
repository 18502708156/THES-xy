class GangMainWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GangMainSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected viewStack: TabView;
    /////////////////////////////////////////////////////////////////////////////


	public static GANG_INFO_PANEL = 0;
	public static GANG_FUBEN_PANEL = 1;
	public static GANG_SKILL_PANEL = 2;
	public static GANG_PANTAOHUI_PANEL = 3;

	public constructor() {
		super()
		this.skinName = "GangMainSkin"

		this.observe(MessageDef.GANG_EXIT_NOTICE, this.HandleExit)
		this.observe(MessageDef.GANG_UPDATE_PANTAOINFO, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.GANG_SKILL_UP, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.GANG_SKILL_LEARN_UP, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.GUILD_CONTRIB_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.GANG_UPDATE_APPLICANT_LIST, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.GANG_UPDATE_FBCOUNT, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.GANGBOSS_UPDATE_INFO, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ACTIVITY_LIST_INFO, this.UpdateTabBtnRedPoint)
	}

	public childrenCreated() {
		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(GangInfoPanel, {skinName: "GangInfoSkin"}),
			TabView.CreateTabViewData(GangFuBenPanel),
			TabView.CreateTabViewData(GangSkillListView, {skinName: "GangSkillListSkin"}),
			TabView.CreateTabViewData(GangPantaoYuanPanel, {skinName: "GangPangTaoHuiSkin"})
		]
		 
		this.commonWindowBg.SetViewStack(this.viewStack)
	}

	public OnOpen(...args) {
		var index = args[0];
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
		this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.VIEW_APPILICANT) 
											|| GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.CONTRIBUTE)
											|| GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GUARD_UPGRADE)
											|| GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.DAILY_AWARD)
											|| GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_MAP_ASSEMBLED)
											|| GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_EXCHANGE)
											|| GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_BATTLE)
											|| GameGlobal.GangBossModel.IsGangBossAct()
											|| GameGlobal.GangModel.IsGangBattleOpen())
		this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_FUBEN))
		this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.SKILL_UPGRADE))
		this.commonWindowBg.ShowTalRedPoint(3, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.EAT_PEACH) 
											|| GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.PEACH_AWARD))
	}

	

	public OnClose() {
		MainBottomPanel.CloseNav(this)
	}

	private HandleExit() {
		ViewManager.ins().close(this)
	}
}