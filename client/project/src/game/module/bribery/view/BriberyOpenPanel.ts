/**
 * 红包打开介面
 */
class BriberyOpenPanel extends BaseEuiView 
{

    public static LAYER_LEVEL=LayerManager.UI_Popup;

	//skinName
    // briberyOpenSkin.exml
   
	//protected com: CommonDialog;
    //描述
	private lab: eui.Label;
    //打开Btn
	private okBtn:eui.Button;
	//关闭按钮
	private closeImg:eui.Image;
	//显示获得
	private priceIcon:PriceIcon;
	//bg
	private com:eui.Component;

	public constructor() 
    {
		super()
		this.skinName="briberyOpenSkin";

        //this._AddClick(this.com,this.CloseSelf);
		this._AddClick(this,this.CloseSelf);
		this._AddClick(this.closeImg,this.CloseSelf);
		this._AddClick(this.okBtn,this._onclick);
		this._AddClick(this.com,this._onclick);
	}

	public childrenCreated() 
    {
		// this.observe(MessageDef.FULI_GET_RECEIVEBRIBERY, this.showItem);
	}
	public OnOpen(...param: any[])
	{
		let msg = param[0]
		this.showItem(msg)

	}
	private showItem(msg)
	{
		if(msg.ret==true)
		{
			this.priceIcon.type=3;
			this.priceIcon.setColor(0xFFD700);
			this.priceIcon.price=msg.bybNum;
		}
	}
	private _onclick(e: egret.TouchEvent)
	{
		switch (e.currentTarget) 
        {
			case this.okBtn:
				ViewManager.ins().close(BriberyOpenPanel);
				break;
			case this.com:
				ViewManager.ins().close(BriberyOpenPanel);
				break;
		}
	}
	public OnClose() 
	{
		
	}

	
}