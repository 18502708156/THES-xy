class BossMainPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// BossMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	/////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "BossMainSkin"
	}

	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(PersonBossPanel),
			TabView.CreateTabViewData(PublicBossPanel),
			TabView.CreateTabViewData(FieldBossPanel),
			TabView.CreateTabViewData(VipBossPanel),
		])
	}

	public OnOpen(...param: any[]) {
		var nIndex = param[0] || 0;
		this.commonWindowBg.OnAdded(this, nIndex)

		this.observe(MessageDef.FB_INFO_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.PUBLIC_BOSS_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.FIELD_BOSS_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.VIP_BOSS_UPDATE, this.UpdateTabBtnRedPoint)

		this.UpdateTabBtnRedPoint()
	}

	private UpdateTabBtnRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.UserFb.IsPersonBossNotice())
		this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.BossModel.IsPublicBossNotice())
		this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.BossModel.IsFieldBossNotice())
		this.commonWindowBg.ShowTalRedPoint(3, GameGlobal.BossModel.IsVIPBossNotice())
	}


	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_44);
	}

	public OnOpenIndex(selectedIndex: number): boolean {
		if (1 == selectedIndex) {
			return Deblocking.Check(DeblockingType.TYPE_45);
		}
		else if (2 == selectedIndex) {
			return Deblocking.Check(DeblockingType.TYPE_46);
		}
		return true;
	}

}