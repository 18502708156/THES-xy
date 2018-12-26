class YingYuanZhengShuPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup
	protected commonDialog: CommonDialog;
	list:eui.List
	marryTime:eui.Label
	bnt:eui.Button
	public constructor() {
		super()
		this.skinName = "YingYuanZhengShuSkin";
		this.list.itemRenderer = YingYuanHeadItem
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.IS_MARRY_INFO, this.updateContent)
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "结婚证书"
		this._AddClick(this.bnt,this._OnClick)
		this.updateContent()
	}

	private updateContent() {
		let Info = []
        Info.push(GameGlobal.YingYuanModel.marryInfo.husband)		
		Info.push(GameGlobal.YingYuanModel.marryInfo.wife)	
        this.list.dataProvider = new eui.ArrayCollection(Info);
		this.marryTime.text = "登记日期：" +  GameServer.JieHun(GameGlobal.YingYuanModel.marryInfo.time);
	}

	private _OnClick() {
       ViewManager.ins().close(this)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}