class DeityEquipWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // DeityEquipMainSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected btnDetail: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "DeityEquipMainSkin"
	}

	public childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(DeityEquipAwakePanel),
			TabView.CreateTabViewData(DeityEquipInjectPanel),
		])
	}

	public OnOpen(...args) {
		var index = args[0];
		this.mCommonWindowBg.OnAdded(this, index)

		this._AddClick(this.btnDetail, this._OnClicked)
		this.observe(MessageDef.CHANGE_EQUIP, this.UpdateTabBtnRedPoint)
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateTabBtnRedPoint)
		this.UpdateTabBtnRedPoint()
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}

	private UpdateTabBtnRedPoint() {
		this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.UserEquip.HasDeityEquipAwake() || GameGlobal.UserEquip.HasDeityEquipResolve())
		this.mCommonWindowBg.ShowTalRedPoint(1, GameGlobal.UserEquip.HasDeityEquipInject())
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_32)
	}

	OnOpenIndex(openIndex: number): boolean {
		if (openIndex == 1) {
			if (GameGlobal.UserEquip.GetDeityEquipPos() == -1)
			{
				UserTips.ins().showTips("穿戴神装之后才可前往注灵")
				return false
			}
		}

		return true
	}

	private _OnClicked() {
		ViewManager.ins().open(DeityEquipDetailWin)
	}
}