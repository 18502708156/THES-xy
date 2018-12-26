class TianxianMainPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// TianxianMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected viewStack: TabView;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TianxianMainSkin"
	}

	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(TianxPanel),
			TabView.CreateTabViewData(SwordPanel),
		])
	}

	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param[0] || 0)

		this.observe(GameGlobal.TianxModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex0)
		this.observe(GameGlobal.TianxModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex0)
		this.UpdateRedPointIndex0()

		this.observe(GameGlobal.SwordModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex1)
		this.observe(GameGlobal.SwordModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex1)
		this.UpdateRedPointIndex1()

		this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)
		this.updateJiJieBtnPng();
	}
	private updateJiJieBtnPng(): void {
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(0), [ActivityKaiFuJiJieType.fairy]);
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(1), [ActivityKaiFuJiJieType.weapon]);
	}

	private UpdateRedPointIndex0() {
		this.commonWindowBg.CheckTalRedPoint(0)
	}

	private UpdateRedPointIndex1() {
		this.commonWindowBg.CheckTalRedPoint(1)
	}

	public OnClose() {
		GameGlobal.MessageCenter.dispatch(MessageDef.CHANGE_EQUIP)	
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_27);
	}
}