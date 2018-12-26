class CrossBattleChargeWarn extends BaseEuiView {
	public constructor() {
		super()
	}
    public sureBtn:eui.Button
	private commonDialog: CommonDialog
	protected petShowPanel: PetShowPanel;

	initUI() {
		super.initUI()
		this.skinName = "CrossBattleChargeSkin"
		
	}

	OnOpen() {
		this.AddClick(this.sureBtn, this.onTap);
		this.commonDialog.OnAdded(this)
		this.commonDialog.setBgVisible(true)
		this.updataView()
	}

	updataView() {
	this.petShowPanel.SetBodyId(300004)
	}

	OnClose() {
		this.commonDialog.OnRemoved()
		this.removeEvents()
	}

	onTap = function (e) {
        GameGlobal.CrossBattleModel.getBs()
	}

}

CrossBattleChargeWarn.LAYER_LEVEL =  LayerManager.UI_Popup