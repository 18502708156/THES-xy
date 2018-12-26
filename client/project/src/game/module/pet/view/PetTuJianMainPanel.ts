class PetTuJianMainPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// PetMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "PetTuJianMainSkin";
	}
	public childrenCreated() {
		this.commonWindowBg.SetTabView([
		TabView.CreateTabViewData(PetTuJianPanel, { skinName: "PetTuJianSkin", mContext: this }),
		TabView.CreateTabViewData(PetGodQualityPanel, { skinName: "PetGodQualitySkin", mContext: this }),
		]);
	}
	
	public OnOpen(...args: any[]) {
		var openIndex = args[0]
		var checkOpen = this.OnOpenIndex(openIndex)
		this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0)
	}

	public OnClose() {
	}
	public OnOpenIndex(selectedIndex: number): boolean {
		return true
	}
}