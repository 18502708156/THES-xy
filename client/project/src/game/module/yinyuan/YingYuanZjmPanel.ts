class YingYuanZjmPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup
	public face: eui.Component;
	public closeBtn: eui.Button;

	public constructor() {
		super()
		this.skinName = "YingYuanZjmSkin";

	}

	private m_EndTime = 5;

	public OnOpen(...param: any[]) {
		this.updateContent()
		this.m_EndTime = 5
		this.AddClick(this.closeBtn, this._OnClick)
		this.AddTimer(1000, 6, this.updateCloseBtnLabel);
	}

	private updateContent() {
		let dataRole = GameGlobal.YingYuanModel.partner
		this.face["face"].source = ResDataPath.GetHeadImgName(dataRole.job, dataRole.sex)
	}

	updateCloseBtnLabel() {
		this.m_EndTime--;
		if (this.m_EndTime <= 0)
			ViewManager.ins().close(this);
		this.closeBtn.label = "确定(" + this.m_EndTime + "s)";
	};

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	public OnClose() {

	}
}