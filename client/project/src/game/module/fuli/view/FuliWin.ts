class FuliWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// FuliMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected list: eui.List;
	protected tabEuiView: TabEuiView;
	/////////////////////////////////////////////////////////////////////////////

	// 福利大厅图标列表
	public static WelfareIcon = [
		{ type: 1, cls: FuliSignBoardPnael, icon: "ui_fldt_bt_qiandao" },
		{ type: 2, cls: FuliGiveGoldMainPanel,icon: "ui_fldt_bt_songbaiwanyuanbao"},
		{ type: 3, cls: FuliLvGiftBagPanel, icon: "ui_fldt_bt_libao" },
		{ type: 10, cls: FuliGoldTreePanel, icon: "ui_fldt_bt_yaoqianshu" },
		{ type: 4, cls: FuliMonthlyCardPanel, icon: "ui_fldt_bt_yueka" },
		{ type: 9, cls: FuliForeverCardPanel, icon: "ui_fldt_bt_zhongshenka" },
		// { type: 5, cls: FuliWeeklyCardPanel, icon: "ui_fldt_bt_zhouka" },
		{ type: 6, cls: FuliPracticePanel, icon: "ui_fldt_bt_fuli" },
		{ type: 7, cls: FuliActivationCodePanel, icon: "ui_fldt_bt_jihuoma" },
		{ type: 8, cls: FuliNoticePanel, icon: "ui_fldt_bt_youxigonggao" },
		
	]

	private iconList: eui.List
	private selectBtnType: number = 0
	private mListLRBtnCtrl: ListLRBtnCtrl;

	private mWList: any[] = []

	public constructor() {
		super()
		this.skinName = "FuliMainSkin"
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 130)
		let config = GameGlobal.Config.LvRewardConfig;
		let showLvPanel = true;
		for (let key in config) {
			showLvPanel = (GameGlobal.FuliModel.FuliData.lvMark & 1 << config[key].id) < 1
			if (showLvPanel) break
		}
		let wlist = this.mWList = FuliWin.WelfareIcon.slice()
		if (!showLvPanel)//等级礼包全部领取不再显示
		{
			for (let i = 0; i < wlist.length; i++) {
				if (wlist[i].cls == FuliLvGiftBagPanel) {
					wlist.splice(i, 1)
					break
				}
			}
		}
		// 西游福利
		if (!Deblocking.Check(GameGlobal.Config.WelfareBaseConfig.opentype, true)) {
			for (let i = 0; i < wlist.length; i++) {
				if (wlist[i].cls == FuliPracticePanel) {
					wlist.splice(i, 1)
					break
				}
			}
		}
		let list = []
		for (let data of wlist) {
			list.push(TabView.CreateTabViewData(data.cls))
		}
		this.tabEuiView.tabChildren = list

		this.list.itemRenderer = FuliBtnItem
		this.list.dataProvider = new eui.ArrayCollection(wlist)
		this._AddItemClick(this.list, this.OnClickMenu)
	}
	private index = 0;
	OnClickMenu(e: eui.ItemTapEvent) {
		if (this.tabEuiView.GetElementCls(e.itemIndex) == FuliPracticePanel) {
			let tabId = GameGlobal.Config.WelfareBaseConfig.opentype;
			if (Deblocking.Check(tabId) == true) {
				this.index = e.itemIndex;
				this.tabEuiView.selectedIndex = this.index;
			}
		}
		else {
			this.index = e.itemIndex;
			this.tabEuiView.selectedIndex = this.index;
		}
	}

	OnOpen(...param: any[]) {
		this.observe(MessageDef.RP_SIGN_UPDATE,this.UpdateListRedPoint)
		this.observe(MessageDef.FULI_GOLDTREE_INFO,this.UpdateListRedPoint)
		this.selectBtnType = param[0] || 0
		let index = 0
		if (this.selectBtnType) {
			let i = 0
			for (let data of FuliWin.WelfareIcon) {
				if (data.type == this.selectBtnType) {
					index = i
					break
				}
				++i
			}
		}
		this.tabEuiView.selectedIndex = index
		this.list.selectedIndex = index
		this.mCommonWindowBg.OnAdded(this)
		this.UpdateListRedPoint()
	}

	OnClose() {
		this.tabEuiView.CloseView()
		this.mCommonWindowBg.OnRemoved()
	}

	private UpdateListRedPoint() {
		// for (let i = 0; i < this.list.numChildren; ++i) {
		// 	let child = this.list.getChildAt(i)
		// 	if (child && child["UpdateRedPoint"]) {
		// 		child["UpdateRedPoint"]()
		// 	}
		// }
		let list = []
		for (let data of this.mWList) {
			let showRedPoint = false
			if (data.cls && data.cls && data.cls["CheckRedPoint"]) {
				showRedPoint = data.cls["CheckRedPoint"](data.id)
			}
			data.__redPoint__ = showRedPoint
			list.push(showRedPoint)
		}
		UIHelper.ListRefresh(this.list)

		this.mListLRBtnCtrl.SetRedPointList(list)
		this.mListLRBtnCtrl.OnRefresh()
	}
}