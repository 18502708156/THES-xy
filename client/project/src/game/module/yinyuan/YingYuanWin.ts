class YingYuanWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	private commonWindowBg: CommonWindowBg
	public constructor() {
		super()
	}

	initUI() {
		super.initUI();
		this.skinName = "YingyueWinSkin"
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(YingYuanInfoPanel, { skinName: "YingyueInfoSkin" }),
			// TabView.CreateTabViewData(YingYuanEnAiInfoPanel, {skinName: "YingyueEnAiSkin"}),
			TabView.CreateTabViewData(HouseUpgradePanel, { skinName: "HouseUpgradeSkin" }),
			// TabView.CreateTabViewData({NAME: "灵童"}),
			TabView.CreateTabViewData(TeacherPanel)
		])
	};

	OnOpen(...args: any[]) {
		var openIndex = args[0]
		var checkOpen = this.OnOpenIndex(openIndex)
		this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : Deblocking.Check(DeblockingType.TYPE_39) ? 0 : 2)
		//this.commonWindowBg["helpBtn"].visible = true
		//this.commonWindowBg.setHelp(18,"规则说明")

		this.observe(MessageDef.HOUSE_UPDATE_INFO, this.UpdateTabBtnRedPoint)
		this.observe(GameGlobal.LingtongModel.GetItemRpUpdateMsg(), this.UpdateTeacherRedPoint)
		this.observe(GameGlobal.LingtongModel.GetItemEquipRpUpdateMsg(), this.UpdateTeacherRedPoint)
		this.observe(MessageDef.RP_LINGTONG, this.UpdateTeacherRedPoint)
		this.UpdateTeacherRedPoint()

		this.UpdateTabBtnRedPoint()
	}

	private UpdateTabBtnRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.YingYuanModel.CanUpgrade())
	}

	private UpdateTeacherRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.TeacherController.teacherInfo.messageData.length > 0)
	}

	OnClose() {
		this.removeObserve()
		this.commonWindowBg.OnRemoved()
	};

	checkIsOpen(e) {

	};

	public OnOpenIndex(selectedIndex: number): boolean {
		if (selectedIndex == 3) {
			ViewManager.ins().open(LingtongMainPanel)
			return false
		}
		if (selectedIndex == 2) {
			return Deblocking.Check(DeblockingType.TYPE_41, false)
		}
		if (selectedIndex == 1) {
			if (GameGlobal.YingYuanModel.iSMarry()) {
				return true
			}
			UserTips.ins().showTips("结婚后开启功能")
			return false
		}
		if (selectedIndex == 0) {
			return Deblocking.Check(DeblockingType.TYPE_39, false)
		}
		return true
	}

	updateRedPoint() {

	};

	public OnBackClick(clickType: number): number {
		return 0
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_39)
	}
}