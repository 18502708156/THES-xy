class KaiFuQiTianActivityPanel extends BaseEuiView implements ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	public static NAME = "七天尊享"
	/////////////////////////////////////////////////////////////////////////////
    // KaiFuQiTianActivityPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tabEuiView: TabEuiView;
    protected sevenDay_btn: eui.Image;
    protected look_btn: eui.Image;
    protected time_label: eui.Label;
	protected dayList:eui.List;
	protected tabBar:eui.TabBar;
	protected seventhDaySelected_icon:eui.Image
	protected petShowPanel:PetShowPanel
    /////////////////////////////////////////////////////////////////////////////
	private index = -1;
	public static OPEN_SHOW_DAY 
	private tabDatas = [
		{ cls: KaiFuQiTianFuLiPanel, label: "每日福利" },
		// { cls: KaiFuQiTianOtherPanel, label: "竞技场" },
		{ cls: KaiFuQiTianShopPanel, label: "低价贩售" },
	]

	private dayListData = [
			{ id: 1,day:1},
			{ id: 2, day:2},
			{ id: 3, day:3},
			{ id: 4, day:4},
			{ id: 5, day:5},
			{ id: 6, day:6},
		]

	public constructor() {
		super()
		this.skinName = "KaiFuQiTianActivityPanelSkin"	
	}
	
	childrenCreated(): void
	{
		let list = []
		list.push(TabView.CreateTabViewData(KaiFuQiTianFuLiPanel))
		// list.push(TabView.CreateTabViewData(KaiFuQiTianOtherPanel))
		list.push(TabView.CreateTabViewData(KaiFuQiTianShopPanel))
		this.tabEuiView.tabChildren = list
		
		this.dayList.itemRenderer = QiTianDayButtonItem
		this.dayList.dataProvider = new eui.ArrayCollection(this.dayListData)
		
		this.tabBar.itemRenderer = QiTianTabItem
		this.tabBar.dataProvider = new eui.ArrayCollection(this.tabDatas);

	}

	OnOpen(...param: any[]) {
		this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
		this.AddTimer(1000,0,this.updateTime)
		
		KaiFuQiTianActivityPanel.OPEN_SHOW_DAY = Math.min(GameServer.serverOpenDay,7);
		this.index = 0
		this.AddItemClick(this.dayList, this.OnClickDayMenu)
		this.AddItemClick(this.tabBar, this.OnClickTabMenu)
		this.AddClick(this.sevenDay_btn, this.onClick)
		this.AddClick(this.look_btn, this.onClick)
		
		this.UpdateContent();
		this.updateTime();


		let petId = GameGlobal.Config.WeekEnjoyBaseConfig.petid;
			let config;
			if((petId + "").indexOf("9") == 0){
				//宠物
				config = GameGlobal.Config.petBiographyConfig[petId];
			}else{
				config = GameGlobal.Config.partnerBiographyConfig[petId];	
			}
			if(config)
				this.petShowPanel.SetBody(PetConst.GetSkin(config.id))	
		this.petShowPanel.scaleX = -0.4;
		this.petShowPanel.scaleY = 0.4;
	}
	private updateTime(): void
	{
		let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_17_ArenaTarget);

		if (activityData)
		{
			this.time_label.textFlow =TextFlowMaker.generateTextFlow( activityData.getRemindTimeString() )
		}	else {
			this.time_label.text = "活动未开启"
		}
    }
	UpdateContent(): void
	{
		let serverDay = GameServer.serverOpenDay;
		this.dayList.selectedIndex = KaiFuQiTianActivityPanel.OPEN_SHOW_DAY - 1;
		//改变第二个标签的名字
		var curDataTab2Name = GameGlobal.Config.WeekEnjoyBaseConfig.name[KaiFuQiTianActivityPanel.OPEN_SHOW_DAY - 1]
		// this.tabDatas[1].label = curDataTab2Name;
		
		let d:number;
		let dLen:number = 7;
		for( d = 0 ; d < dLen ;d ++ )
		{
			let dRed = false;
			let i:number;
			let len:number = this.tabDatas.length;
			for( i = 0 ; i < len ;i ++ )
			{
				let b = (<any>this.tabDatas[i].cls["RedPoint"])(d + 1);
				if(d + 1 == KaiFuQiTianActivityPanel.OPEN_SHOW_DAY) (<any>this.tabDatas[i]).redPoint = b;
				if (b) dRed = true;	
			}	
			if (d == dLen - 1)
			{
				UIHelper.ShowRedPoint(this.sevenDay_btn, dRed);
			}else
			{
				(<any>this.dayListData[d]).redPoint = dRed
			}
		}
		(this.dayList.dataProvider as eui.ArrayCollection).replaceAll(this.dayListData);
		(this.tabBar.dataProvider as eui.ArrayCollection).replaceAll(this.tabDatas);
		// this.dayListData[i] = this.tabDatas[i].cls["RedPoint"]();
		if(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY == 7)
		{
			this.dayList.selectedIndex = -1
			this.seventhDaySelected_icon.visible = true;
		}else{
			this.seventhDaySelected_icon.visible = false;
		}	

		this.openPage(this.index)
	}
	OnClickDayMenu(e: eui.ItemTapEvent) 
	{
		let day = e.itemIndex + 1
		this.changeDayFunc(day);
	}
	private changeDayFunc(day): void
	{
		let serverDay = GameServer.serverOpenDay;
		if (day > serverDay + 1)
		{
			this.dayList.selectedIndex = KaiFuQiTianActivityPanel.OPEN_SHOW_DAY - 1
			UserTips.ins().showTips("活动未开启，请第" + day + "天再来");
			return;
		}	
		// if (day < serverDay)
		// {
		// 	this.dayList.selectedIndex = KaiFuQiTianActivityPanel.OPEN_SHOW_DAY - 1
		// 	UserTips.ins().showTips("活动已经关闭");
		// 	return;
		// }
		KaiFuQiTianActivityPanel.OPEN_SHOW_DAY = day
		this.UpdateContent();
	}

	OnClickTabMenu(e: eui.ItemTapEvent) 
	{
		this.index = e.itemIndex;
		this.UpdateContent();
	}
	onClick(e:egret.TouchEvent) 
	{
		if (e.currentTarget == this.look_btn)
		{
			let petId = GameGlobal.Config.WeekEnjoyBaseConfig.petid;
			let config;
			if((petId + "").indexOf("9") == 0){
				//宠物
				config = GameGlobal.Config.petBiographyConfig[petId];
				if(config)
					ViewManager.ins().open(PetInfoPanel,config);
			}else{
				config = GameGlobal.Config.partnerBiographyConfig[petId];
				if(config)
					ViewManager.ins().open(XianLvInfoPanel,config);
			}
			
			
		}
		else if (e.currentTarget == this.sevenDay_btn)
		{
			this.changeDayFunc(7)
		}	
	}
	openPage(index): void
	{	
		this.tabEuiView.selectedIndex = this.index;
		
		if(this.tabBar.selectedIndex == this.index)
		{
			(<any>this.tabEuiView.getElementAt(this.index)).OnOpen();
		}
		this.tabBar.selectedIndex = this.index
	}

	OnClose() {
		this.tabEuiView.CloseView()	
	}

	private UpdateListRedPoint() {
		// for (let i = 0; i < this.iconList.numChildren; ++i) {
		// 	let child = this.iconList.getChildAt(i)
		// 	if (child && child["UpdateRedPoint"]) {
		// 		child["UpdateRedPoint"]()
		// 	}
		// }
	}
}

class QiTianDayButtonItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DayBtnSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected labelDisplay: eui.Label;
    protected selected_icon: eui.Image;
    protected redPoint: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
	public constructor() {
		super()
	}
	dataChanged() {
		this.labelDisplay.text = "第" + this.data.day + "天" 
		this.redPoint.visible = this.data.redPoint;
	}
	
}


class QiTianTabItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // BtnTab4Skin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected redPoint: eui.Image;
    protected labelDisplay: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
	}

	dataChanged() 
	{
		this.labelDisplay.text = this.data.label;
		this.redPoint.visible = this.data.redPoint;
	}
	
}