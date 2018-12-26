/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/17 11:51
 * @meaning: 副本主界面
 * 
 **/
class FbLayer extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	viewStack: TabView;
	uiBg1:eui.Image;
	uiBg2:eui.Image;
	nameIcon:eui.BitmapLabel;
	private commonWindowBg: CommonWindowBg

	tShopData = [];

	// 引导对象
	public GetGuideTarget() {
		return {
			[3]: this.commonWindowBg.tabBar.getChildAt(2),
			[2]: this.commonWindowBg.tabBar.getChildAt(1),
		}
	}

	// private m_ViewChildren

	initUI() {
		super.initUI()
		this.skinName = "FubenSkin";
		this.commonWindowBg.SetViewStack(this.viewStack)
		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(CaiLiaoFbPanel),
			TabView.CreateTabViewData(FbCbtPanel),
		 	TabView.CreateTabViewData(LingLongTaPanel),
			TabView.CreateTabViewData(TianshilianPanel),
		]

	}
	
	OnOpen(...param: any[]) {

		var nIndex = param[0] || 0;
		this.viewStack.UpdateTabShowState(this.viewStack.length, false)
		this.commonWindowBg.OnAdded(this,nIndex)
		this.uiBg1.visible = true;
		this.uiBg2.visible = false; 

		this.observe(MessageDef.FB_INFO_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.FB_CBT_UPDATE, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.FB_CBT_UPDATE_REWARD, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.FB_TIANTING_UPDATE, this.UpdateTabBtnRedPoint)

		this.mCommonWindowBg.ShowTalRedPoint(1, true) //藏宝图 红点常驻
		this.mCommonWindowBg.ShowTalRedPoint(2, true) //玲珑宝塔 红点常驻
		this.UpdateTabBtnRedPoint()


		var data = GameGlobal.UserTask.mainTaskData[0];
		if (data && data.state == TaskState.GET && data.id == 1034) {
			// 指引坐骑材料副本不需要跳转界面
			GameGlobal.GuideUtil.Finish(this, this.commonWindowBg.returnBtn)
		}
	}

	OnClose() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
	}

	private UpdateTabBtnRedPoint() {
		this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.UserFb.mRedPoint.IsRedAct(FbModelRedPoint.CAILIAO_FB))
		this.mCommonWindowBg.ShowTalRedPoint(3, GameGlobal.UserFb.mRedPoint.IsRedAct(FbModelRedPoint.TIANTING_FB))
	}



	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		
		switch(openIndex)
		{
			case 0:
				this.uiBg1.visible = true;
				this.uiBg2.visible = false;
				// this.commonWindowBg.SetTitle("材料副本");
			break;
			case 1:
				this.uiBg1.visible = false;
				this.uiBg2.visible = false;
				// this.commonWindowBg.SetTitle("藏宝图");
			break;
			case 2:
				this.uiBg1.visible = false;
				this.uiBg2.visible = false;
				// this.commonWindowBg.SetTitle("玲珑宝塔");
			break;
			case 3:
				this.uiBg1.visible = false;
				this.uiBg2.visible = false;
				// this.commonWindowBg.SetTitle("勇闯天庭");
			break;
		}
		return true
	}
	
	UpdateContent(): void {}
}
