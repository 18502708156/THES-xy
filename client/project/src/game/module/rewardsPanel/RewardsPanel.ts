class RewardsPanel extends BaseEuiView{
	public static LAYER_LEVEL = LayerManager.UI_Popup;
	// RewardsWinSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected uiBg1: eui.Image;
	protected tipsTxt: eui.Label;
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
		this.skinName = "RewardsWinSkin";
		this.validateNow()
	}

	OnOpen(...param): void {
		this.AddClick(this.returnBtn, this.onTap);
		this.AddClick(this.closeBtn, this.onTap);
		this.AddClick(this.lqBtn, this.onTap);
		if (param)
			this.updateData(param[0]);
	}
	OnClose(): void {
		this.removeEvents();
	}

	updateData(data: any): void {
		this.titleName.text = data.title;
		this.tipsTxt.textFlow = TextFlowMaker.generateTextFlow(data.txt);
		this.rewardList.dataProvider = new eui.ArrayCollection(data.itemData);
		this.index = data.index;
	//	this.funObj.fun = data.fun;
	//	this.funObj.thisObj = data.thisObj;
	}

	onTap(e: egret.TouchEvent) {
		switch (e.target)
		{
			case this.closeBtn:
			case this.returnBtn:
			case this.lqBtn:
				this.CloseSelf();
				if(e.target == this.lqBtn)
					GameGlobal.UserFb.getCbtReward(this.index,1);
					// if(this.funObj.fun) 
					// 	this.funObj.call(this.funObj.fun, this.funObj.thisObj);
					
				break;
		}
	}
}
RewardsPanel.LAYER_LEVEL =  LayerManager.UI_Popup;