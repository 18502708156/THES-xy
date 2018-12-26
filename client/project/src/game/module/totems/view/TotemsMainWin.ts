class TotemsMainWin extends BaseEuiView {

	public static NAME = "图腾"
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
			TabView.CreateTabViewData(TotemsMainPanel),
		])	
	}

	public OnOpen(...param: any[]) 
	{
		this.mCommonWindowBg.OnAdded(this, param[0] || 0)

		this.observe(MessageDef.TOTEMS_UPDATEACTIVATION, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.TOTEMS_INFO, this.UpdateTabBtnRedPoint)
		this.UpdateTabBtnRedPoint()
	}

	private UpdateTabBtnRedPoint() 
	{   //CheckTalRedPoint
		this.mCommonWindowBg.ShowTalRedPoint(0,GameGlobal.TotemsModel.mRedPoint.showRedPoint());
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
		let openID=GameGlobal.Config.TotemsBaseConfig.openlv;
		if (Deblocking.Check(openID, false)) {
			return true;
		}
        return false;
    }
}