class HouseDetailWin  extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	
	/////////////////////////////////////////////////////////////////////////////
    // HouseDetailSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
	protected labCurAttr: eui.Label;
	protected groupUnMax: eui.Group;
	protected labNextAttr: eui.Label;
	protected imgIcon: eui.Image;
	protected labMaxLv: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "HouseDetailSkin"
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "房屋"

		this.labMaxLv.visible = GameGlobal.YingYuanModel.IsMaxLevel()
		this.groupUnMax.visible = !this.labMaxLv.visible
		
		let grade = GameGlobal.YingYuanModel.GetHouseGrade()
		let config = HouseConst.GetHouseShowConfig(grade)
		if (!config)
		{
			return
		}

		this.imgIcon.source = config.image
		this.labCurAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.YingYuanModel.GetCurAttr())
		this.labNextAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.YingYuanModel.GetNextAttr())
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}