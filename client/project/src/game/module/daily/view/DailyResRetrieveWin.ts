class DailyResRetrieveWin extends BaseEuiView {
	
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	public childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(DailyResRetrievePanel),
			TabView.CreateTabViewData(DailyResRetrieveGoldPanel),
		])
	}

	public OnOpen(...args) {
		var index = args[0];
		this.mCommonWindowBg.OnAdded(this, index)
		
		this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.DAILY_UPDATE_RETREVE_VIEW, this.UpdateTabBtnRedPoint)

		this.UpdateTabBtnRedPoint()
	}

	private UpdateTabBtnRedPoint() {
		let flag = GameGlobal.DailyModel.GetRetrieveResListByType(DailyConst.TASK_RETRIEVE_COST_BINDGOD).length > 0
		flag = flag && !GameGlobal.DailyModel.mViewBindGoldRes
		this.mCommonWindowBg.ShowTalRedPoint(0, flag)
		flag = GameGlobal.DailyModel.GetRetrieveResListByType(DailyConst.TASK_RETRIEVE_COST_GOD).length > 0
		flag = flag && !GameGlobal.DailyModel.mViewGoldRes
		this.mCommonWindowBg.ShowTalRedPoint(1, flag)
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}

}