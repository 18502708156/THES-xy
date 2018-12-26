class FuliForeverCardPanel extends BaseEuiView
{

	/////////////////////////////////////////////////////////////////////////////
    // FuliForeverCardSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected labDesc0: eui.Label;
	protected labDesc1: eui.Label;
	protected labDesc2: eui.Label;
	protected labDesc3: eui.Label;
	protected labTip: eui.Label;
	protected btnBuy: eui.Button;
    protected labUpDesc1: eui.Label;
    protected labUpDesc2: eui.Label;
    protected labBagDesc1: eui.Label;
    protected labBagDesc2: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor()
    {
        super()
        this.skinName = "FuliForeverCardSkin";
    }
	public childrenCreated() 
    {
		this._AddClick(this.btnBuy, this._OnClick);
		this.observe(MessageDef.FULI_GET_GIFT_SUCCEED, this.UpdateContent);
    }
	public OnOpen()
    {
		this.labDesc1.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips12)
		this.labDesc2.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips13)
        this.labUpDesc1.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips14)
        this.labUpDesc2.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips15)
        this.labBagDesc1.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips16)
		this.UpdateContent()
	}
    public UpdateContent() 
    {
        this.btnBuy.visible = !GameGlobal.FuliModel.FuliData.foreverFlag
		this.labTip.visible = !this.btnBuy.visible 
    }
    
    private _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.btnBuy:
				RechargeWin.OpenMonthCard()
            break;
        }
    }

    public OnClose() 
	{
		
	}
}