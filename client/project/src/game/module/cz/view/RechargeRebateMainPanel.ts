class RechargeRebateMainPanel extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// RechargeRebateMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected list: eui.List;
	protected tabEuiView: TabEuiView;
	/////////////////////////////////////////////////////////////////////////////
	protected dataList
	protected index: number
	protected listIcon

	// 福利大厅图标列表
	public static WelfareIcon = [
		{ type: 1, cls: RechargeRebatePanel, icon: "ui_bm_chongzhifanli" },
	]

	private iconList: eui.List
	private selectBtnType: number = 0
	private mListLRBtnCtrl: ListLRBtnCtrl;

	public constructor() {
		super()
		this.skinName = "RechargeRebateMainSkin"
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 130)
		let ActivitySumBtnConfig = GameGlobal.Config.ActivitySumBtnConfig
		this.dataList = []
		this.listIcon = []
		let list = []
		for (let Config in ActivitySumBtnConfig) {
			if (ActivitySumBtnConfig[Number(Config)].openId == 5) {
				let BaseModel = GameGlobal.ActivityKaiFuModel.GetActivityDataById(Number(Config))
				if (BaseModel) {
					if (BaseModel.openState) {
						this.dataList.push(Number(Config))
						//let wlist = RechargeRebateMainPanel.WelfareIcon.slice()
						//for (let data of wlist) {
						list.push(TabView.CreateTabViewData({ type: 1, cls: RechargeRebatePanel, icon: "ui_bm_chongzhifanli" }.cls))
						this.listIcon.push({ type: 1, id:Number(Config) , cls: RechargeRebatePanel, icon: "ui_bm_chongzhifanli" })
						//}
					}
				}
			}
		}

		//let wlist = RechargeRebateMainPanel.WelfareIcon.slice()

		// for (let data of wlist) {
		// 	list.push(TabView.CreateTabViewData(data.cls))
		// }
		this.tabEuiView.tabChildren = list 

		this.list.itemRenderer = RechargeBtnItem
		this.list.dataProvider = new eui.ArrayCollection(this.listIcon)
		this._AddItemClick(this.list, this.OnClickMenu)
	}

	OnClickMenu(e: eui.ItemTapEvent) {
		this.openPage(e.itemIndex)
	}

	openPage(index): void {
		let data: any = this.dataList[index];
		// if (data.type) {
		// 	KaiFuActivityPanel.OPEN_JIJIE_TYPE = data.type;
		// }
		//GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_JIJIE_CHANGE_TITILE, data.title)
		this.index = index;
		if (!data) {
			return
		}
		this.tabEuiView.OpenIndex(this.index, data)
		// this.tabEuiView.selectedIndex = this.index;
		// (this.tabEuiView.getElementAt(index) as any).DoOpen(data.actid)
		// if (this.list.selectedIndex != this.index) {
		// 	this.list.selectedIndex = this.index
		// } else {
		// 	(<any>this.tabEuiView.getElementAt(this.index)).OnOpen(data.actid);
		// }
	}

	OnOpen(...param: any[]) {
		// this.observe(MessageDef.RP_SIGN_UPDATE, this.UpdateListRedPoint)
		//this.selectBtnType = param[0] || 0
		this.index = 0
		// if (this.selectBtnType) {
		// 	let i = 0
		// 	for (let data of RechargeRebateMainPanel.WelfareIcon) {
		// 		if (data.type == this.selectBtnType) {
		// 			index = i
		// 			break
		// 		}
		// 		++i
		// 	}
		// }
		//this.tabEuiView.selectedIndex = index
		//this.tabEuiView.OpenIndex(index, this.dataList[index])
		this.list.selectedIndex = this.index
		this.mListLRBtnCtrl.OnRefresh();
		this.mCommonWindowBg.OnAdded(this)
		this.openPage(this.index);
		this.UpdateListRedPoint();
	}

	OnClose() {
		this.tabEuiView.CloseView()

		this.mCommonWindowBg.OnRemoved()
	}

	private UpdateListRedPoint() {
		for (let i = 0; i < this.list.numChildren; ++i) {
			let child = this.list.getChildAt(i)
			if (child && child["UpdateRedPoint"]) {
				child["UpdateRedPoint"]()
			}
		}
	}
}
