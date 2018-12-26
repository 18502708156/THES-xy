class GrowUpWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	/////////////////////////////////////////////////////////////////////////////
	private views: ITabViewData[];

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL;
	}

	private static GetViews() {
		let views = [];
		let num = GameGlobal.RechargeModel.rechargeNum;
		/*首充 */
		if (0 == num) {
			views.push(FirstChargePanel);
		}
		else {
			let config = GameGlobal.Config.FirstRechargeConfig;
			let isFirst: boolean = false;
			for (let key in config) {
				if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
					isFirst = true;
					break;
				}
			}
			if (isFirst) views.push(FirstChargePanel);
		}
		/*成长基金 */
		let growupData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11) as ActivityType24Data;
		if (growupData && growupData.isOpenActivity()) {
			views.push(GrowUpPanel);
		}
		else if (growupData && growupData.canReward()) {
			views.push(GrowUpPanel);
		}
		/*投资计划 */
		let investData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(12) as ActivityType8Data;
		if (investData && investData.isOpenActivity()) {
			views.push(InvestmentPlanPanel);
		}
		else if (investData && investData.canReward()) {
			views.push(InvestmentPlanPanel);
		}
		/*消费有礼 */
		// let consumData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(13) as ActivityType25Data;
		// if (consumData && consumData.isOpenActivity()) {
		// 	views.push(ConsumptionPanel);
		// }
		return views
	}

	public childrenCreated() {
		let views = GrowUpWin.GetViews()
		this.views = []
		for (let data of views) {
			this.views.push(TabView.CreateTabViewData(data))
		}
		this.commonWindowBg.SetTabView(this.views);
	}

	public OnOpenIndex(selectedIndex: number): boolean {
		switch (selectedIndex) {
			case 1:
				if (Deblocking.Check(DeblockingType.TYPE_106, true)) {
					return true;
				}
				break;
			case 2:
				if (Deblocking.Check(DeblockingType.TYPE_107, true)) {
					return true;
				}
				break;
			case 3:
				if (Deblocking.Check(DeblockingType.TYPE_108, true)) {
					return true;
				}
				break;
		}
		return true
	}

	public OnOpen(...param: any[]) {
		var nIndex = param[0] || 0;
		this.commonWindowBg.OnAdded(this, nIndex)

		this.observe(MessageDef.RECHARGE_FIRST_UPDATE, this.UpdateTabBtnRedPoint);
		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ACTIVITY_INFO, this.UpdateTabBtnRedPoint)
		this.UpdateTabBtnRedPoint()
	}

	private UpdateTabBtnRedPoint() {
		this.commonWindowBg.CheckTalRedPoint(0);
		this.commonWindowBg.CheckTalRedPoint(1);
		this.commonWindowBg.CheckTalRedPoint(2);
		this.commonWindowBg.CheckTalRedPoint(3);
	}

	public OnClose() {
		this.removeObserve();
		this.commonWindowBg.OnRemoved()
	}

	public static openCheck(): boolean {
		let view = GrowUpWin.GetViews()
		if (!view || !view.length) {
			UserTips.InfoTip("已经首充")
			return false
		}
		return true
	}
}