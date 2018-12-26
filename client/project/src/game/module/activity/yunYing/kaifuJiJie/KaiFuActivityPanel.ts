class KaiFuActivityPanel extends BaseEuiView implements ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	public static NAME = "开服活动"
	/////////////////////////////////////////////////////////////////////////////
	// KaiFuActivityPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////

	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected list: eui.List;
	protected tabEuiView: TabEuiView;
	/////////////////////////////////////////////////////////////////////////////

	private mListLRBtnCtrl: ListLRBtnCtrl;

	private activityIconList = []

	public constructor() {
		super()
		this.skinName = "KaiFuActivityPanelSkin"
	}

	static sortByType(a, b) {
		return a.type - b.type
	}

	private GetTargetIconList() {
		let iconList = []
		let btnList = ActivitySumBtnConfig.GetOpenList(2)
		for (let key in btnList) {
			let data = btnList[key]
			let actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(data.id)
			if (actData && actData.openState) {    //actData.isOpenActivity()
				data.activityType = ActivityConfig.GetActTypeById(data.id)
				if (data.activityType == ActivityKaiFuFuncType.ACT_22_OrangePetTarget && actData.AllGotten()) {
					continue
				}
				iconList.push(data)
			}
		}
		iconList.sort(KaiFuActivityPanel.sortByType)
		return iconList
	}

	private GetJijieIconList() {
		let list = []
		let serverDay = GameServer.serverOpenDay;
		let ProgressCrazyBaseConfig = GameGlobal.Config.ProgressCrazyBaseConfig
		if (serverDay <= ProgressCrazyBaseConfig.initialorder.length) {
			let type = ProgressCrazyBaseConfig.initialorder[serverDay - 1]
			list.push({ jijieType: type, activityType: ActivityKaiFuFuncType.ACT_99990_JiJie,  cls: KaiFuJiJiePanel, icon: ProgressCrazyBaseConfig.probtn[type - 1], title: "进阶狂欢" })
			list.push({ jijieType: type, activityType: ActivityKaiFuFuncType.ACT_99991_JiJieRank, cls: KaiFuJiJieRankPanel, icon: ProgressCrazyBaseConfig.rankbtn[type - 1], title: "进阶排行" });
			list.push({ jijieType: type, activityType: ActivityKaiFuFuncType.ACT_99992_JiJieShop, cls: KaiFuJiJieShopPanel, icon: "ui_bm_zhekoushangdian", title: "折扣商店" });
			list.push({ jijieType: type, activityType: ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge, cls: KaiFuLeiJiReChargePanel, icon: "ui_bm_leijichongzhi", title: "累计充值" });
		} else {
			let i: number;
			let index = (serverDay - ProgressCrazyBaseConfig.initialorder.length - 1) % ProgressCrazyBaseConfig.progressorder.length
			let arr = ProgressCrazyBaseConfig.progressorder[index]
			let len: number = arr.length;
			for (i = 0; i < len; i++) {
				list.push({ jijieType: arr[i], activityType: ActivityKaiFuFuncType.ACT_99990_JiJie, cls: KaiFuJiJiePanel, icon: ProgressCrazyBaseConfig.probtn[arr[i] - 1], title: "进阶狂欢" })
			}
			index = (serverDay - ProgressCrazyBaseConfig.initialorder.length - 1) % ProgressCrazyBaseConfig.rechargeorder.length
			list.push({ jijieType: ProgressCrazyBaseConfig.shoporder[index], activityType: ActivityKaiFuFuncType.ACT_99992_JiJieShop, cls: KaiFuJiJieShopPanel, icon: "ui_bm_zhekoushangdian", title: "折扣商店" });
			list.push({ jijieType: ProgressCrazyBaseConfig.rechargeorder[index], activityType: ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge, cls: KaiFuLeiJiReChargePanel, icon: "ui_bm_leijichongzhi", title: "累计充值" });
		}
		return list
	}

	childrenCreated(): void {

		let list1 = this.GetJijieIconList()
		let list2 = this.GetTargetIconList()
		this.activityIconList = []
		this.activityIconList = this.activityIconList.concat(list1)
		this.activityIconList = this.activityIconList.concat(list2)

		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 126)

		let list = []
		for (let data of this.activityIconList) {
			list.push(TabView.CreateTabViewData(ActivityDataFactory.GetPanel(data.activityType), {jijieType: data.jijieType, _activityId: data.id}))
		}
		this.tabEuiView.tabChildren = list

		this.list.itemRenderer = KaiFuBtnItem
		this.list.dataProvider = new eui.ArrayCollection(this.activityIconList)
	}

	private UpdateRedList() {
		for (let data of this.activityIconList) {
			let redPoint = false
			if (data.activityType == ActivityKaiFuFuncType.ACT_99990_JiJie) {
				if (GameGlobal.ActivityKaiFuModel.RedPointAdvancedUpLevelByType(data.jijieType) == true) {
					redPoint = true;
				}
			} else if (data.activityType == ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge) {
				if (GameGlobal.ActivityKaiFuModel.RedPointAdvancedReCharge() == true) {
					redPoint = true;
				}
			} else if (data.activityType == ActivityKaiFuFuncType.ACT_99992_JiJieShop) {
				if (GameGlobal.ActivityKaiFuModel.RedPointAdvanceShop()) {
					redPoint = true;
				}
			} else {
				let actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(data.id);
				if (actData && actData.hasReward()) {
					redPoint = true;
				}
			}
			data.__redPoint__ = redPoint
		}
	}

	OnClickMenu(e: eui.ItemTapEvent) {
		this.openPage(e.itemIndex)
	}

	openPage(index): void {
		let data: any = this.activityIconList[index];
		this.tabEuiView.selectedIndex = index;
		this.list.selectedIndex = index
	}

	OnOpen(...param: any[]) {
		let data = param[0]

		let index = 0
		if (data && data.val) {
			let val = data.val
			if (data.isId) {
				for (var i = 0; i < this.activityIconList.length; i++) {
					if (this.activityIconList[i].id == val) {
						index = i;
						break;
					}
				}
			} else {
				for (var i = 0; i < this.activityIconList.length; i++) {
					if (this.activityIconList[i].activityType == val) {
						index = i;
						break;
					}
				}
			}
		}

		if (index && index > 3) {
			this.mListLRBtnCtrl.SetLeftIndex(index)
		}
		this.mListLRBtnCtrl.OnRefresh();
		
		this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent)
		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
		this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
		this.AddItemClick(this.list, this.OnClickMenu)
		this.openPage(index);
		this.UpdateContent();

	}

	UpdateContent(): void {
		this.UpdateRedList()
		UIHelper.ListRefresh(this.list)
		
		let list = []
		for (let data of this.activityIconList) {
			list.push(data.__redPoint__ ? true : false)
		}
		this.mListLRBtnCtrl.SetRedPointList(list)
		this.mListLRBtnCtrl.OnRefresh()

		let view = this.tabEuiView.getElementAt(this.tabEuiView.selectedIndex) as any
		if (view && view.UpdateContent) {
			view.UpdateContent()
		}
	}

	OnClose() {
		this.tabEuiView.CloseView()
	}
}

class KaiFuBtnItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// FuliBtnSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected icon: eui.Image;
	protected redPoint: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
	}

	dataChanged() {
		let data = this.data
		// 七天尊享
		if (data.id == 15) {
			let curday = Math.min(GameServer.serverOpenDay, 7)
			let config = GameGlobal.Config.ActivityType17Config[15]
			let source = ""
			for (let key in config) {
				if (config[key].day == curday) {
					source = config[key].info.btn
					break
				}
			}
			this.icon.source = source
		} else {
			this.icon.source = data.icon
		}
		this.redPoint.visible = this.data.__redPoint__
		// let redPoint = false
		// if (data.activityType == ActivityKaiFuFuncType.ACT_99990_JiJie) {
		// 	if (GameGlobal.ActivityKaiFuModel.RedPointAdvancedUpLevelByType(data.jijieType) == true) {
		// 		redPoint = true;
		// 	}
		// } else if (data.activityType == ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge) {
		// 	if (GameGlobal.ActivityKaiFuModel.RedPointAdvancedReCharge() == true) {
		// 		redPoint = true;
		// 	}
		// } else {
		// 	let actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.data.id);
		// 	if (actData && actData.hasReward()) {
		// 		redPoint = true;
		// 	}
		// }
		// this.redPoint.visible = redPoint
	}
}