class DestinyUpWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
		this.mCommonWindowBg.title = "命格"
	}

	public childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(DestinyPanel),
			TabView.CreateTabViewData(DestinyNiPanel),
		])
	}

	public OnOpen(...param: any[]) {
		this.mCommonWindowBg.OnAdded(this, param[0], param[1])

		this.observe(MessageDef.DESTINY_RP, this.UpdateRedPoint)
		this.UpdateRedPoint()
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}

	public UpdateRedPoint() {
		this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.DestinyController.mRedPoint.IsRedPoint())
	}
}