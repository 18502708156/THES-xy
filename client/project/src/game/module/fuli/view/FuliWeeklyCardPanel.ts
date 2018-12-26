/**
 * 福利_周卡
 */
class FuliWeeklyCardPanel extends BaseEuiView
{
	//skinName
	//FuliWeeklyCardSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Main;
	lab0:eui.Label
	lab1:eui.Label
	lab2:eui.Label
	lab3:eui.Label
	
	//labArr
	labArr=[];
	//购买btn
	private buyBtn:eui.Button;	
	//剩余天数
	private dayLabel:eui.Label;
	//福利大厅表
	private tab:any;
	public constructor()
    {
        super()
        this.skinName = "FuliWeeklyCardSkin";
    }
	public childrenCreated() 
    {
		this.tab=GameGlobal.Config.WelfareBaseConfig;
        this.labArr=[this.lab0,this.lab1,this.lab2,this.lab3];
		this._AddClick(this.buyBtn,this._OnClick);
		this.observe(MessageDef.FULI_MONTH_WEEK_CHANGE,this.updateBtnTOLabel);
    }
	public OnOpen()
    {
		for(let i=0;i<4;i++)
		{
			let text="";
			if(i<2)
			{
				text=this.tab["tips0"+(i+8)];
			}
			else
			{
				text=this.tab["tips"+(i+8)];
			}
			this.labArr[i].textFlow = TextFlowMaker.generateTextFlow(text);
			this.labArr[i].parent.visible = this.labArr[i].text != "";
		}
		
		//this.lab0.textFlow = TextFlowMaker.generateTextFlow(this.tab.tips08);
		let week=GameGlobal.FuliModel.FuliData.week;
		this.dayLabel.textFlow=(new egret.HtmlTextParser).parser("<font>剩余有效期<a color=0x019704>" + week + "</a>天</font>");
		//this.dayLabel.text="剩余有效期"+week+"天";
		if(week!=undefined && week!=null )
		{
			//this.dayLabel.text=week;
			if(week==0)//未购买 or 到期
			{
				this.buyBtn.visible=true;
				this.dayLabel.visible=false;
			}
			else//
			{
				this.buyBtn.visible=false;
				this.dayLabel.visible=true;
			}
		}

	}
    public UpdateContent() 
    {
        
        
    }

	private updateBtnTOLabel():void
	{
		let week=GameGlobal.FuliModel.FuliData.week;
		if(week>0)
		{
			this.buyBtn.visible=false;
			this.dayLabel.visible=true;
			this.dayLabel.textFlow=(new egret.HtmlTextParser).parser("剩余有效期<a color=0x019704>" + week + "天</a>");
		}
	}
    
    private _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.buyBtn:
				RechargeWin.OpenMonthCard();
            break;
        }
    }
    public OnClose() 
	{
		
	}
}