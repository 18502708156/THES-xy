class FateFadeView extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    //skinName
    // FateFadeViewSkin.exml



    private describeLabel:eui.Label;//描述
    private enterBtn: eui.Button;//確定btn
    private pointImg: eui.Image;//Eff
    private group: eui.Group;//Eff_Group
    private fateModelItem:FateModelItemPanel;//顯示模型
    private mCount : number//確定Btn_倒計時
    private itemList:eui.List;//道具
    private ID=0;//表ID

    //功能预告表
	private funcNoticeConfigTab:any;	

    public constructor() 
    {
		super()
		this.skinName="FateFadeViewSkin";
		this.mCount=5;
		this._AddClick(this, this.CloseSelf);
		this._AddClick(this.enterBtn, this._onClick);
	}

	public OnOpen(id) 
    {
        this.fateModelItem.typeView=1;
        this.funcNoticeConfigTab=GameGlobal.Config.FuncNoticeConfig;
        this.fateModelItem.scaleX=this.fateModelItem.scaleY=1.5
        this.ID=id;
        this.showEff();
        this.showModel();
        this.describe();
        this.showItem();
		this.AddTimer(1000, 5, this._DoUpdate);
	}

	public OnClose() 
    {
		
	}

    private showModel():void
    {
        let modelType=this.funcNoticeConfigTab[this.ID].type;
        let pid=this.funcNoticeConfigTab[this.ID].pid;
        if(pid!=undefined)
        {
           
            if(pid[1]!=undefined)
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[this.ID].pid[0],this.funcNoticeConfigTab[this.ID].pid[1]);
            else if(pid[0]!=undefined)
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[this.ID].pid[0]);
            else
                this.fateModelItem.showModelType(modelType,this.funcNoticeConfigTab[this.ID].pid);

        }
    }

	private _DoUpdate() 
    {
		this.mCount--;
		this.enterBtn.label = "确定("+ this.mCount.toString() +"s)";
		if (this.mCount == 0)
		{
			ViewManager.ins().close(this);
		}
	}

    private showEff():void
    {
        let eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_hht_001"), true, 0);
        eff.x = this.pointImg.x;
        eff.y = this.pointImg.y;
        eff.scaleX = 2.3;
        eff.scaleY = 2.3;
        this.group.addChild(eff);
    }
    
    private describe():void
    {
         this.describeLabel.text="";
         this.describeLabel.text="解锁"+this.funcNoticeConfigTab[this.ID].des4;
    }

    private showItem()
    {
        this.itemList.itemRenderer=ItemBase;
        this.itemList.dataProvider=new eui.ArrayCollection([]);
        this.itemList.dataProvider=new eui.ArrayCollection(this.funcNoticeConfigTab[this.ID].reward);
    }

	private _onClick(e: egret.TouchEvent)
	{
		switch (e.currentTarget) 
        {
			case this.enterBtn:
                    ViewManager.ins().close(this)
                break
		}
	}



    
}