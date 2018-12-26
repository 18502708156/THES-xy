class KaiFuActivityWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
    // KaiFuActivityWinSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    /////////////////////////////////////////////////////////////////////////////

	public static Show(val: number = null, isId: boolean = true) {
		let data = null
		if (val) {
			data = {
				val: val,
				isId: isId,
			}
		}
		ViewManager.ins().open(KaiFuActivityWin, data)
	}


	public constructor() {
		super()
		this.skinName = UIHelper.PANEL_NO_TAB
	}

	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(KaiFuActivityPanel),
			// TabView.CreateTabViewData(KaiFuTargetPanel, null, !GameGlobal.ActivityKaiFuModel.hasActivityTarget()),
			// TabView.CreateTabViewData(KaiFuQiTianActivityPanel,null,!GameGlobal.ActivityKaiFuModel.hasActivityQiTian()),
		])
	}
	
	// private changeTitle(e): void
	// {
	// 	this.commonWindowBg.SetTitle(e[0])
	// }

	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this, 0, param[0])

		this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ACTIVITY_INFO, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ACTIVITY_DABIAO_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ACTIVITY_IS_GET_AWARDS, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ACTIVITY_RACE_HISTORY, this.UpdateTabBtnRedPoint)

		this.UpdateTabBtnRedPoint()
	}

	private UpdateTabBtnRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.ActivityKaiFuModel.RedPointAdvanced() || GameGlobal.ActivityKaiFuModel.RedPointTarget())
		// this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.ActivityKaiFuModel.RedPointTarget())
		// this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.ActivityKaiFuModel.RedPointQiTian())
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}
}