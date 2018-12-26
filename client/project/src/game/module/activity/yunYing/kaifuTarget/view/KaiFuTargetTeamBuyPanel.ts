class KaiFuTargetTeamBuyPanel extends KaiFuTargetBasePanel
{
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuTargetTeamBuyPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    protected time_txt: eui.Label;
    protected people_txt: eui.Label;
    protected getwayLabel: GetwayLabel;
    protected tabBar: eui.TabBar;
    protected allReCharge_label:eui.Label;
    /////////////////////////////////////////////////////////////////////////////


    
	public constructor()
    {
        super()
        this.skinName = "KaiFuTargetTeamBuyPanelSkin";
        this.activityType = ActivityKaiFuFuncType.ACT_21_OutdrawDiscountShop
    }
    // public set activityId(value)
    // {
    //     this._activityId = value;
    //     this.UpdateContent();
    // }
	public childrenCreated() 
    {
        this.list.itemRenderer = KaiFuTargetBaseAwardItem;
        this.tabBar.dataProvider = new eui.ArrayCollection(["团购10人", "团购20人", "团购60人", "团购100人", "团购200人"])
        this.tabBar.selectedIndex = 0;
        this.tabBar.validateNow();
    }
	public OnOpen()
    {
        super.OnOpen();
        this.AddItemClick(this.tabBar,this.changeTab)
    }
    private changeTab(e): void
    {
        this.UpdateContent();
    }
   
    protected getReward(): any
    {

        let config = GameGlobal.Config.ActivityType21Config[this._activityId];
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        let arr = []
        let parr = [10, 20, 60, 100, 200];
        let redPoint = [false,false,false,false,false]
        let pnum = parr[this.tabBar.selectedIndex];
        let i:number;
        let len:number = config.length;
        for( i =  0; i < len ;i ++ )
        {
            let cfgObj = config[i];
            let canGet
            let getted
            if (activityData) {
                canGet = activityData.canGetRecordByIndex(cfgObj.index);
                getted = activityData.GetRecordByIndex(cfgObj.index)
            }
            if (canGet && !getted)
            {
                redPoint[parr.indexOf(cfgObj.type)] = true;
            }    
            if (pnum != cfgObj.type)
            {
                continue;
            }
            let o :any= {};
            o.cfg = cfgObj
            o.weight = cfgObj.Id;
            o.actType = this.activityType 
            if (canGet) { 
                if (getted) o.weight += 1000;
                else o.weight -= 1000;
            }else if (getted) o.weight += 1000;
            
            arr.push(o); 
        }

        len = redPoint.length;
        for( i = 0 ; i < len ;i ++ )
        {
            if (this.tabBar.getChildAt(i))
            {
                 (<any>this.tabBar.getChildAt(i)).getChildAt(1).visible = redPoint[i];
            }    
        }
        
        return arr
    }
    
	public OnClose() 
	{
		
	}
    public UpdateContent() 
	{
        super.UpdateContent();
        this.allReCharge_label.text = "今日充值：" + 0;
        let activityData:ActivityType21Data = <ActivityType21Data>(GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId));
        if(activityData)
        {
            this.allReCharge_label.text = "今日充值：" + activityData.rechargeNum;
            this.people_txt.text = activityData.people + "人";
            let array = this.tabBar.dataProvider as eui.ArrayCollection
            let i:number;
            let len:number = array.length;
            for( i = 0 ; i < len ;i ++ )
            {
                (<any>this.tabBar.getChildAt(i)).redPoint = activityData.canGetRecordByIndex(i + 1);
            }
        } else {
            this.people_txt.text =  "0人";
        }
        
	}

    protected _OnClick(e: egret.TouchEvent)
    {
        RechargeWin.Open();
    }
    
}
