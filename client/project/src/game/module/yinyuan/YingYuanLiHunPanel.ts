class YingYuanLiHunPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup
	protected commonDialog: CommonDialog;
	public bnt:eui.Button
	public DayTimes: eui.Label
	public constructor() {
		super()
		this.skinName = "YingYuanXiuShuSkin";
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "一纸休书"
		this._AddClick(this.bnt,this._OnClick)
		this.updateContent()
	}

	private updateContent() {
		let Config = GameGlobal.Config.MarryBaseConfig.frequency
        this.DayTimes.text = "今日还可结婚：" + (Config - GameGlobal.YingYuanModel.marryInfo.today) + "/" + Config
	}

	private _OnClick() {
        GameGlobal.YingYuanModel.marryDivorce()
		ViewManager.ins().close(this)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}