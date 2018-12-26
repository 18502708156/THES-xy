class UpLvWayMainWin extends BaseEuiView {

	public static NAME = "我要变强"
    public static LAYER_LEVEL = LayerManager.UI_Main

	// private guildWarView: CrossGuildWarPanel;

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	childrenCreated() 
	{
		this.mCommonWindowBg.SetTabView([
			//TabView.CreateTabViewData(CrossTeamPanel),
			TabView.CreateTabViewData(X1Panel,{  Type:1} ),
			TabView.CreateTabViewData(X2Panel,{  Type:2} ),
			TabView.CreateTabViewData(X3Panel,{  Type:3} ),
		])	
	}

	public OnOpen(...param: any[]) 
	{
		this.mCommonWindowBg.OnAdded(this, param[0] || 0)

		this.observe(MessageDef.UPLVWAY_CHANGE_SCORE, this.UpdateTabBtnRedPoint);
		this.observe(MessageDef.UPLVWAY_ACQUIRE_ITEM, this.UpdateTabBtnRedPoint);
		this.UpdateTabBtnRedPoint();
	}

	private UpdateTabBtnRedPoint() 
	{
		//this.mCommonWindowBg.CheckTalRedPoint(0);
		this.mCommonWindowBg.ShowTalRedPoint(0,GameGlobal.UpLvWayModel.mRedPoint.showRedPoint());
		this.mCommonWindowBg.ShowTalRedPoint(1,GameGlobal.UpLvWayModel.mRedPoint.showRedPoint());
		this.mCommonWindowBg.ShowTalRedPoint(2,GameGlobal.UpLvWayModel.mRedPoint.showRedPoint());
	}

	OnOpenIndex?(openIndex: number): boolean 
	{
		// let openId = -1
		// if (openIndex == 1)
		// {
		// 	return Deblocking.Check(DeblockingType.TYPE_64)
		// }
		// else if (openIndex == 2)
		// {
		// 	return Deblocking.Check(DeblockingType.TYPE_114);
		// }

		return true
	}

    public static openCheck(...param: any[]) {
		// if (param[0] == 2) {
		// 	return Deblocking.Check(DeblockingType.TYPE_114);	
		// }
        return true;// Deblocking.Check(DeblockingType.TYPE_63);
    }
}