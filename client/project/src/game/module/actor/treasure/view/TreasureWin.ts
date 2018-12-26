/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 14:59
 * @meaning: 法宝主界面
 * 
 **/
class TreasureWin extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	viewStack: TabView;
	private commonWindowBg: CommonWindowBg

	tShopData = [];

    public static openCheck(...param: any[]) {
		if (!Deblocking.Check(DeblockingType.TYPE_31)) {
			return false
		}
        return true;
    }

	initUI() {
		super.initUI()
		this.skinName = "TreasureLayerSkin"; 
		this.commonWindowBg.SetViewStack(this.viewStack)
		this.viewStack.tabChildren = [
            TabView.CreateTabViewData(TreasureUpFirPanel),
            TabView.CreateTabViewData(TreasureUpSecPanel),
            TabView.CreateTabViewData(TreasureMakePanel),
            TabView.CreateTabViewData(TreasureResolvePanel),
		]

	}
	
	OnOpen(...param: any[]) {

		var nIndex = param[0] || 0;
		this.viewStack.UpdateTabShowState(this.viewStack.length, false)
		this.commonWindowBg.OnAdded(this,nIndex)
		this.observe(MessageDef.RP_TREASURE, this.UpdateRedPoint)
		this.UpdateRedPoint()
	}

	OnClose() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	private UpdateRedPoint() {
		this.mCommonWindowBg.CheckTalRedPoint(1)
		this.mCommonWindowBg.CheckTalRedPoint(2)
		this.mCommonWindowBg.CheckTalRedPoint(3)
	}
	
	UpdateContent(): void {}
}
