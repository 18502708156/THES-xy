/**
 * 福利_月卡
 */
class FuliMonthlyCardPanel extends BaseEuiView
{
	//skinName
	//FuliMonthlyCardSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Main;
	lab0:eui.Label
	lab1:eui.Label
	lab2:eui.Label
	lab3:eui.Label
	lab4:eui.Label
	lab5:eui.Label
	lab6:eui.Label
	//labArr
	labArr=[];
	//购买btn
	private buyBtn:eui.Button;	
	//剩余天数
	private dayLabel:eui.Label;
	//福利大厅表
	private tab:any;

	private itemList:eui.List;
	private l0:eui.Group;
	private l1:eui.Group;
	private l2:eui.Group;
	private l3:eui.Group;
	private comArr=[];
	public constructor()
    {
        super()
        this.skinName = "FuliMonthlyCardSkin";
    }
	public childrenCreated() 
    {
		this.tab=GameGlobal.Config.WelfareBaseConfig;
        this.labArr=[this.lab0,this.lab1,this.lab2,this.lab3,this.lab4,this.lab5,this.lab6];
		this.comArr=[this.l0,this.l1,this.l2,this.l3];
		this.observe(MessageDef.FULI_MONTH_WEEK_CHANGE,this.updateBtnTOLabel);
		this.observe(MessageDef.FULI_MONTH_WEEK_CHANGE,this.updateListShow);
		this._AddClick(this.buyBtn,this._OnClick);
		this.itemList.itemRenderer=ItemBase;
		this.itemList.dataProvider=new eui.ArrayCollection([]);
    }
	public OnOpen()
    {
		for(let i=0;i<7;i++)
		{
			let text=this.tab["tips0"+(i+1)];
			this.labArr[i].textFlow = TextFlowMaker.generateTextFlow(text);
		}
		let month=GameGlobal.FuliModel.FuliData.month;
		if(month!=undefined && month!=null )
		{
			this.dayLabel.textFlow=(new egret.HtmlTextParser).parser("剩余有效期<a color=0x019704>" + month + "天</a>");
			//this.dayLabel.textFlow=TextFlowMaker.generateTextFlow("剩余有效期|C:0x019704 &T:" + month + "天|")
			if(month==0)//未购买 or 到期
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
		
		this.updateListShow();
	}
	private updateListShow():void
	{
		let firstMonth=GameGlobal.FuliModel.FuliData.firstMonth;
		let firstreward=GameGlobal.Config.CardConfig[1].firstreward;
		if(firstMonth!=0 && firstreward!=undefined) //買過月卡
		{
			this.comArr[3].visible=false;
			this.comArr[0].y=-21;
			this.comArr[1].y=164;
			this.comArr[2].y=349;
			//this.comArr[3].y=537;
		}
		else
		{
			this.comArr[3].visible=true;
			//this.itemList.itemRenderer=ItemBase;
			this.itemList.dataProvider=new eui.ArrayCollection(firstreward);
			this.comArr[3].y=-21;
			this.comArr[0].y=164;
			this.comArr[1].y=349;
			this.comArr[2].y=534;
		}
	}

	private updateBtnTOLabel():void
	{
		let month=GameGlobal.FuliModel.FuliData.month;
		if(month>0)
		{
			this.buyBtn.visible=false;
			this.dayLabel.visible=true;
			this.dayLabel.textFlow=(new egret.HtmlTextParser).parser("剩余有效期<a color=0x019704>" + month + "天</a>");
		}
	}

    public UpdateContent() 
    {
        
        
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