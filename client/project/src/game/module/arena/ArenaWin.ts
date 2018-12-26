class ArenaWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main
	private commonWindowBg: CommonWindowBg;

	/**竞技场 */
	public constructor() {
		super()
	}

	initUI() {
		super.initUI();
		this.skinName = "ArenaWinSkin"

		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(ArenaInfoPanel, { skinName: "ArenaInfoSkin" }),
			TabView.CreateTabViewData(XiandaoPanel),
			TabView.CreateTabViewData(LadderInfoPanel),
		])
	};

	OnOpen(...args: any[]) {
		GameGlobal.Ladder.SendGetInitInfo()
		GameGlobal.Ladder.sendGetRankInfo()

		GameGlobal.XiandaoModel.SendGetInfo()
		var openIndex = args[0]
		var checkOpen = this.OnOpenIndex(openIndex)
		this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0)

		this.observe(MessageDef.ARENA_INFO_DATA, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ARENA_BUY_RESULT, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.LADDER_CHANGE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.LADDER_WINNER, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.LADDER_PRE_WEEK_REWARD, this.UpdateTabBtnRedPoint)

		this.UpdateTabBtnRedPoint()
	}

	private UpdateTabBtnRedPoint() {
		this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.Arena.IsRedPoint())
		this.mCommonWindowBg.ShowTalRedPoint(1, GameGlobal.XiandaoModel.mRedPoint.IsRedPoint())
		this.mCommonWindowBg.ShowTalRedPoint(2, GameGlobal.Ladder.IsRedPoint())
	}

	OnClose() {
		this.removeObserve()
		this.commonWindowBg.OnRemoved()
	};

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_42);
	}

	public OnOpenIndex(selectedIndex: number): boolean {
		if (1 == selectedIndex) {
			return Deblocking.Check(DeblockingType.TYPE_43);
		} else if (selectedIndex == 2) {
			return Deblocking.Check(GameGlobal.Config.KingSportsBaseConfig.openid)
		}
		return true;
	}

}