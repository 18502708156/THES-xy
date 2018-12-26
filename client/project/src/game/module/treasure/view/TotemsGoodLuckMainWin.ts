/**
 * 转盘分页_神装/図腾
 */
class TotemsGoodLuckMainWin extends BaseEuiView 
{
	
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
	public mType: number

	public static Open(type) {
		ViewManager.ins().open(ActivityRewardShowWin, 0, type)
	}

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	public OnOpen(...args) {
		var index = args[0];
		
		let list=[];
		
		if (Deblocking.Check(DeblockingType.TYPE_137, true))
		{
			list.push(TabView.CreateTabViewData(TotemsGoodLuckWin))
		}
		else
		{
			if (index == 1)
				index = 0
		}
		
		//if (Deblocking.Check(DeblockingType.TYPE_143, true))
		{
			list.push(TabView.CreateTabViewData(TotemsGoodLuckWin2))
		}
		
		this.mCommonWindowBg.SetTabView(list);
		this.mCommonWindowBg.OnAdded(this, index);
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}

	public GetAwardList(idx) {
		if (idx == 0)
			return ActivityRewardShowConst.GetAwardListByActivityType(this.mType)

		if (idx == 1)
			return ActivityRewardShowConst.GetRankAwardListByActivityType(this.mType)

		if (idx == 2)
			return ActivityRewardShowConst.GetDragonRankAwardListByActivityType(this.mType)
	}

	public GetImgSource() {
		return ActivityRewardShowConst.GetImageSourceByActivityType(this.mType)
	}
}