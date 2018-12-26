class CommonRewardsPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup;
	// CommonRewardsWin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected uiBg1: eui.Image;
	protected rewardList: eui.List;
	protected titleName: eui.BitmapLabel;
	protected returnBtn: eui.Button;
	protected closeBtn: eui.Button;
	protected lqBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////
	private index;
	private funObj: any = {};

	public constructor() {
		super();

	}

	initUI(): void {
		super.initUI();
		this.skinName = "CommonRewardsWin";
		this.rewardList.itemRenderer = ItemBase;
		this.validateNow()
	}

	OnOpen(...param): void {
		this.AddClick(this.returnBtn, this.onTap);
		this.AddClick(this.closeBtn, this.onTap);
		this.AddClick(this.lqBtn, this.onTap);
		if (param)
			this.updateData(param);
	}
	OnClose(): void {
		this.removeEvents();
	}

	updateData(data: any): void {
		this.titleName.text = data[0];
		this.rewardList.dataProvider = new eui.ArrayCollection([data[1]]);
		this.funObj = data[2];

	}

	onTap(e: egret.TouchEvent) {
		switch (e.target) {
			case this.closeBtn:
			case this.returnBtn:
			case this.lqBtn:
				this.CloseSelf();
				if (e.target == this.lqBtn)
					if (this.funObj)
						this.funObj();
				break;
		}
	}
}
CommonRewardsPanel.LAYER_LEVEL =  LayerManager.UI_Popup;