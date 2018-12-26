class CrossMainPanel extends BaseEuiView {

	public static NAME = "跨服"
    public static LAYER_LEVEL = LayerManager.UI_Main

	// private guildWarView: CrossGuildWarPanel;

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(CrossTeamPanel),
			TabView.CreateTabViewData(AcrossBossPanel),
			TabView.CreateTabViewData(TsumKoPanel),
		])	
	}

	public OnOpen(...param: any[]) {
		this.mCommonWindowBg.OnAdded(this, param[0] || 0, param[1])

		this.observe(MessageDef.KF_BOSS_UPDATE_INFO, this.UpdateTabBtnRedPoint)

		this.UpdateTabBtnRedPoint()
	}

	private UpdateTabBtnRedPoint() {
		this.mCommonWindowBg.CheckTalRedPoint(0)
		this.mCommonWindowBg.CheckTalRedPoint(2)
	}

	OnOpenIndex?(openIndex: number): boolean {
		let openId = -1
		if (openIndex == 1)
		{
			return Deblocking.Check(DeblockingType.TYPE_64)
		}
		else if (openIndex == 2)
		{
			return Deblocking.Check(DeblockingType.TYPE_114);
		}

		return true
	}

    public static openCheck(...param: any[]) {
		if (param[0] == 2) {
			return Deblocking.Check(DeblockingType.TYPE_114);	
		}
        return Deblocking.Check(DeblockingType.TYPE_63);
    }
}