class HavingMainPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main
	/////////////////////////////////////////////////////////////////////////////
	// HavingMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "HavingMainSkin";
	}
	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(HavingUpLevelPanel, { skinName: "HavingUpLevelSkin", mContext: this }),
			TabView.CreateTabViewData(HavingMagicPanel, { skinName: "HavingMagicSkin", mContext: this }),
			TabView.CreateTabViewData(HavingHuanPanel),
			TabView.CreateTabViewData(HavingReikiPanel),
		]);
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_19);
	}

	public OnOpen(...args: any[]) {
		var openIndex = args[0]
		var checkOpen = this.OnOpenIndex(openIndex)
		this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0)

		this.observe(GameGlobal.HavingModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.HavingModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.HavingHuanModel.GetItemRpUpdateMsg(), this.UpdateRedPoint2)
		this.observe(GameGlobal.HavingHuanModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint2)
		this.observe(GameGlobal.HavingLingqModel.GetItemRpUpdateMsg(), this.UpdateRedPoint3)
		this.observe(GameGlobal.HavingLingqModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint3)
		this.UpdateRedPoint()
		this.UpdateRedPoint2()
		this.UpdateRedPoint3()
		this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)
		this.updateJiJieBtnPng();
	}
	
	private updateJiJieBtnPng(): void
	{
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(2), [ActivityKaiFuJiJieType.tiannv_flower]);
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(3), [ActivityKaiFuJiJieType.tiannv_nimbus]);
	}

	public UpdateRedPoint() {
		this.mCommonWindowBg.CheckTalRedPoint(0)
		this.mCommonWindowBg.CheckTalRedPoint(1)
	}

	public UpdateRedPoint2() {
		this.mCommonWindowBg.CheckTalRedPoint(2)
	}

	public UpdateRedPoint3() {
		this.mCommonWindowBg.CheckTalRedPoint(3)
	}


	public OnClose() {
		MainBottomPanel.CloseNav(this)
	}

	public OnOpenIndex(selectedIndex: number): boolean {
		switch (selectedIndex) {
			case 1:
				return Deblocking.Check(DeblockingType.TYPE_20);
			case 2:
				return Deblocking.Check(DeblockingType.TYPE_21);
			case 3:
				return Deblocking.Check(DeblockingType.TYPE_22);
		}
		return true
	}

}
