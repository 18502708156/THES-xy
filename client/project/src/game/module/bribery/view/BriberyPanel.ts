/**
 * 红包介面
 */
class BriberyPanel extends BaseEuiView 
{

    public static LAYER_LEVEL=LayerManager.UI_Popup;

	//skinName
    // briberySkin.exml
   
	//protected com: CommonDialog;
    //描述
	private lab:eui.Label;
    //打开Btn
	private okBtn:eui.Button;
	//关闭按钮
	private closeImg:eui.Image;
	
	private briberyDic={};
	private briberyId=0;
	private item:BriberyItem;

	public constructor() 
    {
		super()
		this.skinName="briberySkin";

        //this._AddClick(this.com,this.CloseSelf);
		this._AddClick(this.closeImg,this.CloseSelf);
		this._AddClick(this.okBtn,this._OnClick);
	}

	public OnOpen(briberyDic,briberyKey,item) 
	{
		this.observe(MessageDef.FULI_GET_RECEIVEBRIBERY, this.OpenXXX)
		this.briberyDic=briberyDic;
		this.briberyId=briberyKey;
		this.item=item;
		this.lab.textFlow=
			(new egret.HtmlTextParser).parser("<a color=0xFFD700>【"
				+ GameGlobal.FuliModel.FuliData.playerName + 
				"】</a>给全服发了一波红包,快来拼手气!");
	
	}

	public OnClose() {
		
	}

	public OpenXXX(rsp: Sproto.cs_welfare_bonus_open_response) {
		if (rsp.ret)
		{
			ViewManager.ins().open(BriberyOpenPanel, rsp);
		}
		else
		{
			UserTips.ins().showTips("红包已被抢光");
			this.item.visible=false;
			if(this.item.parent!=null)
				this.item.parent.removeChild(this.item);
		}

		ViewManager.ins().close(BriberyPanel);
	}

	private _OnClick(e: egret.TouchEvent)
	{
		switch (e.currentTarget)
		{	
			case this.okBtn:
				// ViewManager.ins().close(BriberyPanel);
				
				if(this.briberyDic[this.briberyId]-GameServer.serverTime>2)
				{	
					GameGlobal.FuliModel.ReceiveBribery(this.briberyId);
					// ViewManager.ins().open(BriberyOpenPanel);
					this.item.visible=false;
					if(this.item.parent!=null)
						this.item.parent.removeChild(this.item);
				}	
				else
					UserTips.ins().showTips("红包已被抢光");
					this.item.visible=false;
					if(this.item.parent!=null)
						this.item.parent.removeChild(this.item);
				break;
		
		} 
	}
}