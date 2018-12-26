class CatchPetResultFailWin extends BaseEuiView {	
	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // ResultWinSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected closeBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	closeFunc: Function

	public constructor() {
		super();
		this.skinName = "CatchPetResultFailSkin";
	}

	initUI() {
		super.initUI()
		this.AddClick(this.closeBtn, this.OnClick)
	};
	
	private m_BtnStr: string = ""
	private m_EndTime = 5;

	OnOpen(...param: any[]) {
		this.SetBtnLabel("退出")
		this.SetCloseFunc(param[1])
		super.OnOpen()
		this.m_EndTime = 5;
		this.updateCloseBtnLabel();
		this.AddTimer(1000, 6, this.updateCloseBtnLabel);
	}

	protected SetCloseFunc(func: Function) {
		this.closeFunc = func
	}

	protected SetBtnLabel(text: string) {
		this.m_BtnStr = text
	}

	OnClose() {
		TimerManager.ins().remove(this.updateCloseBtnLabel, this);

		if (this.closeFunc) {
			this.closeFunc();
			this.closeFunc = null;
		}
	}

	updateCloseBtnLabel() {
		this.m_EndTime--;
		if (this.m_EndTime <= 0)
			ViewManager.ins().close(this);
		this.closeBtn.label = this.m_BtnStr + "(" + this.m_EndTime + "s)";
	};

	OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.closeBtn:
				this.CloseSelf()
			break
		}
	} 
}