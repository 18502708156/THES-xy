class LadderRankWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main
	public static NAME = "王者排名"

	private commonWindowBg: CommonWindowBg

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	public childrenCreated() {
		this.mCommonWindowBg.title = "王者排名"
		this.mCommonWindowBg.tabBar.visible = false
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(LadderRankPanel),
		])
	}

	public OnOpen() {
		this.commonWindowBg.OnAdded(this)
	}
}

class LadderWeekRankWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main
	public static NAME = "王者上周排名"

	private commonWindowBg: CommonWindowBg

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	public childrenCreated() {
		this.mCommonWindowBg.title = "王者上周排名"
		this.mCommonWindowBg.tabBar.visible = false
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(LadderPreWeekPanel),
		])
	}

	public OnOpen() {
		this.commonWindowBg.OnAdded(this)
	}
}


class LadderWinnerWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main
	public static NAME = "跨服王者"

	private commonWindowBg: CommonWindowBg

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	public childrenCreated() {
		this.mCommonWindowBg.title = "跨服王者"
		this.mCommonWindowBg.tabBar.visible = false
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(LadderWinnerPanel),
		])
	}

	public OnOpen() {
		this.commonWindowBg.OnAdded(this)
	}
}