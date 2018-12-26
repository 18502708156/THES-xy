class ZhuangPanActivityPanel extends BaseEuiView implements ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	public static NAME = "精彩活动"
	/////////////////////////////////////////////////////////////////////////////
	// KaiFuActivityPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////

	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected list: eui.List;
	protected tabEuiView: TabEuiView;
	/////////////////////////////////////////////////////////////////////////////

	public static OPEN_JIJIE_TYPE: number
	private mListLRBtnCtrl: ListLRBtnCtrl;
	private dataList = []
	private listIcon = []

	private activityIconList = [
	]

	public constructor() {
		super()
		this.skinName = "KaiFuActivityPanelSkin"
	}

	childrenCreated(): void {
		let serverDay = GameServer.serverOpenDay;
		let ActivityConfig = GameGlobal.Config.ActivityConfig
		let ActivitySumBtnConfig = GameGlobal.Config.ActivitySumBtnConfig
		this.dataList = []
		for (let Config in ActivitySumBtnConfig) {
			if (ActivitySumBtnConfig[Number(Config)].openId == 4) {
				this.dataList.push(Number(Config))
			}
		}

		for (let i = 0; i < this.dataList.length; i++) {
			let id = this.dataList[i]
			let cls
			if (ActivityConfig[id].activityType == 6) {
				cls = ZhuangPanShopPanel
			}
			if (ActivityConfig[id].activityType == 26) {
				cls = zheKouBasePanel
			}
			let BaseModel = GameGlobal.ActivityKaiFuModel.GetActivityDataById(id)
			if (BaseModel) {
				if (BaseModel.openState) {
					this.activityIconList.push({ cls: cls, icon: ActivitySumBtnConfig[id].icon, actid: id, title: ActivityConfig[id].tabicon });
				}
			}

		}

		// this.activityIconList.push({ cls: ZhuangPanShopPanel, icon: "ui_jchd_bt_xiaofeizhuanpan", actid: 23, title: "消费转盘" });
		// this.activityIconList.push({ cls: ZhuangPanShopPanel, icon: "ui_jchd_bt_chongzhizhuanpan", actid: 24, title: "充值转盘" });
		// this.activityIconList.push({ cls: ZheKouShopPanel, icon: "ui_zc_bm_qitianzunxiang", actid: 25, title: "折扣商店" });
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 130)

		let list = []
		this.listIcon = []
		for (let data of this.activityIconList) {
			list.push(TabView.CreateTabViewData(data.cls))
			this.listIcon.push(this.UpdateList(data.icon, false))
		}
		this.tabEuiView.tabChildren = list
		this.list.itemRenderer = KaiFuBtnItem
		this.list.dataProvider = new eui.ArrayCollection(this.listIcon)
	}

	public UpdateList(icon: string, redPoint: boolean) {
		return { icon: icon, redPoint: redPoint }
	}

	private index = 0;

	OnClickMenu(e: eui.ItemTapEvent) {
		this.openPage(e.itemIndex)
	}

	openPage(index): void {
		let data: any = this.activityIconList[index];
		// if (data.type) {
		// 	KaiFuActivityPanel.OPEN_JIJIE_TYPE = data.type;
		// }
		//GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_JIJIE_CHANGE_TITILE, data.title)
		this.index = index;
		if (!data) {
			return
		}
		this.tabEuiView.OpenIndex(this.index, data.actid)
		// this.tabEuiView.selectedIndex = this.index;
		// (this.tabEuiView.getElementAt(index) as any).DoOpen(data.actid)
		// if (this.list.selectedIndex != this.index) {
		// 	this.list.selectedIndex = this.index
		// } else {
		// 	(<any>this.tabEuiView.getElementAt(this.index)).OnOpen(data.actid);
		// }
	}

	OnOpen(...param: any[]) {
		if (param[0]) {
			this.index = param[0];
		}
		this.list.selectedIndex = 0
		if (param[1]) {
			for (var i = 0; i < this.activityIconList.length; i++) {
				if (this.activityIconList[i].cls == param[1]) {
					this.index = i;
					break;
				}
			}
		}
		this.mListLRBtnCtrl.OnRefresh();
		this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent)
		this.observe(MessageDef.ACTIVITY_UPDATE, this.getUpList)
		this.AddItemClick(this.list, this.OnClickMenu)
		this.openPage(this.index);
		this.UpdateContent();
	}

	UpdateContent(): void {
		let i: number;
		let len: number = this.activityIconList.length;
		for (i = 0; i < len; i++) {
			let data: any = this.activityIconList[i];
			data.redPoint = false;
			let actId = data.actid;
			let actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(actId);
		}
		let array = this.list.dataProvider as eui.ArrayCollection
		array.replaceAll(this.listIcon)
		this.getUpList()
	}

	OnClose() {
		this.tabEuiView.CloseView()
	}

	public getUpList() {
		let ActivityConfig = GameGlobal.Config.ActivityConfig
		this.listIcon = []
		for (let i = 0; i < this.activityIconList.length; i++) {
			let index = GameGlobal.ActivityKaiFuModel.jingCaiRedPoint(ActivityConfig[this.activityIconList[i].actid].activityType, this.activityIconList[i].actid, i)
			this.listIcon.push(this.UpdateListRedPoint(index))
		}
		let array = this.list.dataProvider as eui.ArrayCollection
		array.replaceAll(this.listIcon)
	}

	private UpdateListRedPoint(i) {
		return this.UpdateList(this.activityIconList[i[0]].icon, i[1])
	}

}