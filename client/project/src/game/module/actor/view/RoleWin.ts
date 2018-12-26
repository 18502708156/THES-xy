class RoleWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	private commonWindowBg: CommonWindowBg

	canChangeWingEquips: any[];

	public constructor() {
		super()
	}

	public GetRoleInfoPanel(): RoleInfoPanel {
		return this.commonWindowBg.GetViewStackElementByIndex(0)
	}

	initUI() {
		super.initUI();
		this.skinName = "RoleWinSkin"

		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(RoleInfoPanel, { skinName: "RoleInfoSkin" }),
			TabView.CreateTabViewData(RoleSkillPanel, { skinName: "RoleSkillSkin" }),
			TabView.CreateTabViewData(RoleRidePanel),
			TabView.CreateTabViewData(RoleWingPanel),
		])
	};

	destoryView() {
		// 不销毁该界面
	};

	OnOpen(...args: any[]) {
		var openIndex = args[0]
		var checkOpen = this.OnOpenIndex(openIndex)

		this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0)

		this.observe(MessageDef.ROLE_HINT, this.UpdateRedPoint)
		this.observe(MessageDef.RP_ROLE_HINT, this.UpdateRedPoint)
		this.observe(MessageDef.LEVEL_CHANGE, this.UpdateRedPoint)
		this.observe(GameGlobal.TianxModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.TianxModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.SwordModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.SwordModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(MessageDef.RP_TREASURE, this.UpdateRedPoint)
		this.observe(MessageDef.DEITYEQUIP_ALL_NOTICE, this.UpdateRedPoint)
		this.UpdateRedPoint()

		this.observe(MessageDef.RP_SKILL_UPGRADE, this.UpdateSkillRedPoint);
		this.UpdateSkillRedPoint()

		this.observe(GameGlobal.UserRide.GetItemRpUpdateMsg(), this.UpdateRideRedPoint)
		this.observe(GameGlobal.UserRide.GetItemEquipRpUpdateMsg(), this.UpdateRideRedPoint)
		this.UpdateRideRedPoint()

		this.observe(GameGlobal.UserWing.GetItemRpUpdateMsg(), this.UpdateWingRedPoint)
		this.observe(GameGlobal.UserWing.GetItemEquipRpUpdateMsg(), this.UpdateWingRedPoint)
		this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)
		this.UpdateWingRedPoint()
		this.updateJiJieBtnPng();
		// this.updateFateEff();
	}
	private updateJiJieBtnPng(): void {
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(0), [ActivityKaiFuJiJieType.fairy, ActivityKaiFuJiJieType.weapon]);
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(2), [ActivityKaiFuJiJieType.ride]);
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(3), [ActivityKaiFuJiJieType.wing]);
	}
	private updateFateEff()
	{
		FateEff.isShowEff3(this);
	} 

	OnClose() {
		MainBottomPanel.CloseNav(this)
		this.removeObserve()
		this.commonWindowBg.OnRemoved()
	};

	public OnOpenIndex(selectedIndex: number): boolean {
		switch (selectedIndex) {
			case 1:
				return Deblocking.Check(DeblockingType.TYPE_8);
			case 2:
				// UIHelper.SetBtnEffe(this.commonWindowBg.tabBar.getChildAt(2) as eui.Button,"ui_fhy002",false);
				return Deblocking.Check(DeblockingType.TYPE_9);
			case 3:
				// UIHelper.SetBtnEffe(this.commonWindowBg.tabBar.getChildAt(3) as eui.Button,"ui_fhy002",false);
				return Deblocking.Check(DeblockingType.TYPE_10);
		}
		return true
	}

	private UpdateRedPoint() {
		this.commonWindowBg.CheckTalRedPoint(0)
	}

	private UpdateSkillRedPoint() {
		this.commonWindowBg.CheckTalRedPoint(1)
	}

	private UpdateRideRedPoint() {
		this.commonWindowBg.CheckTalRedPoint(2)
	}

	private UpdateWingRedPoint() {
		this.commonWindowBg.CheckTalRedPoint(3)
	}

	public OnBackClick(clickType: number): number {
		return 0
	}
}