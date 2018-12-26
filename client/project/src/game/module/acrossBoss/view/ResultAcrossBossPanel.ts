class ResultAcrossBossPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // ResultBossWinSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected titleLabel: eui.BitmapLabel;
    protected closeBtn: eui.Button;

	protected listBoos:eui.List
    /////////////////////////////////////////////////////////////////////////////

	protected reWard:any[]

	closeFunc: Function

	public constructor() {
		super();
		this.skinName = "ResultBossWinSkin"
	}

	initUI() {
		super.initUI()
		this.AddClick(this.closeBtn, this.OnClick)
		this.listBoos.itemRenderer = ItemBase
	};
	
	private m_BtnStr: string = "确定"
	private m_EndTime = 5;

	private bFist = true

	OnOpen(...param: any[]) {
		this.m_EndTime = 5;
		this.reWard = param[0]
		
		this.listBoos.dataProvider = new eui.ArrayCollection(this.reWard);
		// this.updateCloseBtnLabel();
		this.AddTimer(1000, 6, this.updateCloseBtnLabel);
	}

	public SetCloseFunc(func: Function) {
		this.closeFunc = func
	}

	protected SetBtnLabel(text: string) {
		this.m_BtnStr = text
	}

	protected SetTitleLabel(text: string) {
		this.titleLabel.text = text
	}

	OnClose() {
		TimerManager.ins().remove(this.updateCloseBtnLabel, this);

		if (this.closeFunc) {
			this.closeFunc();
			this.closeFunc = null;
		}
	}

	updateCloseBtnLabel() {

		// if(this.bFist)
		// {
		// 	this.bFist = false
		// 	this.listBoos.dataProvider = new eui.ArrayCollection(this.reWard);
		// }

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