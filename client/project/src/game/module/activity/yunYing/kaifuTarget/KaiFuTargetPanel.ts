// class KaiFuTargetPanel extends BaseView implements ICommonWindowTitle {

// 	public static NAME = "开服目标"
// 	/////////////////////////////////////////////////////////////////////////////
// 	// KaiFuTargetPanelSkin.exml
// 	/////////////////////////////////////////////////////////////////////////////

// 	protected leftBtn: eui.Button;
// 	protected rightBtn: eui.Button;
// 	protected list: eui.List;
// 	protected tabEuiView: TabEuiView;
// 	/////////////////////////////////////////////////////////////////////////////

// 	private mListLRBtnCtrl: ListLRBtnCtrl;
// 	private iconList: any[] = []

// 	public constructor() {
// 		super()
// 		this.skinName = "KaiFuTargetPanelSkin"
// 		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 130)

// 		let iconList = this.iconList = []
// 		let btnList = ActivitySumBtnConfig.GetOpenList(2)
// 		for (let key in btnList) {
// 			let data = btnList[key]
// 			let actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(data.id)
// 			if (actData && actData.openState) {    //actData.isOpenActivity()
// 				iconList.push(data)
// 			}
// 		}
// 		iconList.sort(KaiFuTargetPanel.sortByType)
// 		let clsList = []
// 		for (let i = 0; i < iconList.length; i++) {
// 			let id = iconList[i].id
// 			clsList.push(TabView.CreateTabViewData(KaiFuTargetPanel.GetPanel(id), {_activityId: id}))
// 		}

// 		this.tabEuiView.tabChildren = clsList

// 		this.list.itemRenderer = KaiFuTargetBtnItem
// 		this.list.dataProvider = new eui.ArrayCollection(iconList)
// 	}

// 	private openPage(index): void {
// 		this.index = index;
// 		this.tabEuiView.selectedIndex = this.index;
// 		this.list.selectedIndex = this.index;
// 	}

// 	private index = 0;

// 	OnClickMenu(e: eui.ItemTapEvent) {
// 		this.openPage(e.itemIndex)
// 	}

// 	OnOpen(...param: any[]) {
// 		let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_22_OrangePetTarget);
// 		if(activityData == null){
// 			return;
// 		}
	
// 		if (param[1]) {
// 			let i = 0
// 			for (let data of this.iconList) {
// 				if (ActivityConfig.GetActTypeById(data.id) == param[1]) {
// 					this.index = i;
// 					break;
// 				}
// 				i++
// 			}
// 		}
// 		this.mListLRBtnCtrl.OnRefresh();
// 		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
// 		this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
// 		this.AddItemClick(this.list, this.OnClickMenu)
// 		this.openPage(this.index);
// 		this.UpdateContent();
// 	}

// 	UpdateContent(): void {
// 		UIHelper.ListRefresh(this.list)

// 		let view = this.tabEuiView.getElementAt(this.tabEuiView.selectedIndex) as any
// 		if (view && view.UpdateContent) {
// 			view.UpdateContent()
// 		}
// 	}

// 	OnClose() {
// 		this.tabEuiView.CloseView()

// 	}

// 	static sortByType(a, b) {
// 		return a.type - b.type
// 	}


// 	public static GetPanel(actId: number) {
// 		let data = GameGlobal.Config.ActivityConfig[actId]
// 		if (!data) {
// 			return null
// 		}
// 		let cls = ActivityDataFactory.GetPanel(data.activityType)
// 		if (!cls) {
// 			console.warn("not imple act id => ", actId)
// 		}
// 		return cls
// 	}
// }

// class KaiFuTargetBtnItem extends eui.ItemRenderer {

// 	/////////////////////////////////////////////////////////////////////////////
// 	// FuliBtnSkin.exml
// 	/////////////////////////////////////////////////////////////////////////////
// 	protected icon: eui.Image;
// 	protected redPoint: eui.Image;
// 	/////////////////////////////////////////////////////////////////////////////

// 	public constructor() {
// 		super()
// 	}

// 	dataChanged() {
// 		if (this.data.id == 15) {
// 			let curday = Math.min(GameServer.serverOpenDay, 7)
// 			let config = GameGlobal.Config.ActivityType17Config[15]
// 			let source = ""
// 			for (let key in config) {
// 				if (config[key].day == curday) {
// 					source = config[key].info.btn
// 					break
// 				}
// 			}
// 			this.icon.source = source
// 		} else {
// 			this.icon.source = this.data.icon
// 		}

// 		let actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.data.id);
// 		if (actData && actData.hasReward()) {
// 			this.redPoint.visible = true
// 		} else {
// 			this.redPoint.visible = false
// 		}
// 	}
// }