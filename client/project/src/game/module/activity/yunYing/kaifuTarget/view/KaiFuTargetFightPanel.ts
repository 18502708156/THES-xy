class KaiFuTargetFightPanel extends BaseView
{
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuTargetFightPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////

    protected leftBtn: eui.Button;
    protected rightBtn: eui.Button;
    protected time_txt: eui.Label;
    protected getwayLabel: GetwayLabel;
    protected guanQia_label: eui.Label;
    protected powerLabel: PowerLabel;
    protected list: eui.List;
    protected bar: eui.ProgressBar;
    protected awardPetIcon: ItemBase;
    protected awardPetName_label: eui.Label;
    protected awardList: eui.List;
    protected challenge_btn:eui.Button
    protected roleShowpanel: RoleShowPanel;
    protected hasGet_img:eui.Image;
    protected progressIconGroup:eui.Group;
    /////////////////////////////////////////////////////////////////////////////
    private mListLRBtnCtrl: ListLRBtnCtrl;
    protected activityType: number
    protected _activityId: number;
    private canGetCount = 0;
	public constructor()
    {
        super()
        this.skinName = "KaiFuTargetFightPanelSkin";
        this.activityType = ActivityKaiFuFuncType.ACT_22_OrangePetTarget;
        this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 114)
    }
	public childrenCreated() 
    {
		this.list.itemRenderer = TargetGuanQiaItem;
        this.list.dataProvider = new eui.ArrayCollection()
        
        this.awardList.itemRenderer = ItemBaseNotName;
        this.awardList.dataProvider = new eui.ArrayCollection()

        this.bar.snapInterval = 0
        this.bar.maximum = 100;
		this.bar.labelFunction = function (cur, max) 
        {
			//return Math.floor(cur * 100 / max) + "%"
            return ""
		}
    }
	public OnOpen()
    {
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
        this.list.selectedIndex = -1
        this.AddClick(this.getwayLabel, this._OnClick);
        this.AddClick(this.challenge_btn, this._OnClick);
        this.AddClick(this.leftBtn, this._OnClick);
        this.AddClick(this.rightBtn, this._OnClick);
        this.AddItemClick(this.list,this.itemClick)
        this.UpdateContent();
        this.AddLoopTimer(1000, this.updateTime)

        if (this.list.selectedIndex >= 5) {
            this.mListLRBtnCtrl.SetLeftIndex(5)
        }
        this.mListLRBtnCtrl.OnRefresh();

        this.setAwardPetIcon();
    }
   
    private setAwardPetIcon()
    {
        let config = ActivityConst.GetConfigByActityType(this.activityType)[this._activityId];
        var itemData = config[0].showitem2;
        this.awardPetIcon.data = itemData.id;
        this.awardPetName_label.text = config[0].showtext
        //this.awardPetName_label.text = itemConfig.name;
    }

    private itemClick(e:eui.ItemTapEvent)
    {
        this.setCurInfo();
    }
     public UpdateContent() 
	{
		if (!this.visible) return;
        if (!this._activityId) return;
        let arrlist = this.getReward();
        (this.list.dataProvider as eui.ArrayCollection).replaceAll(arrlist)
        if(this.list.selectedIndex == -1)     
            this.list.selectedIndex = 0;                  
        this.setCurInfo(); 
        this.setProgressBarData();  
	}

    private setProgressBarData()
    {
        var curCount = 0;
        if(this.leftBtn.visible == true)
        {
            if(this.canGetCount >= 5){
                curCount = 5;
            }else{
                curCount = this.canGetCount-1;  
            }
        }else{
            if(this.canGetCount > 5){
                curCount = this.canGetCount - 5 - 1
            }else{
                curCount = -1;
            }
        }
        this.bar.value = curCount * 25;
        for(var i = 0;i < this.progressIconGroup.numChildren;i++)
        {
            if(i <= curCount ){
                (this.progressIconGroup.getChildAt(i) as eui.Image).source = "ui_yuan";
            }else{
                (this.progressIconGroup.getChildAt(i) as eui.Image).source = "ui_yuan_quse";
            }
        }
    }

    private setCurInfo()
    {
        let itemData = this.list.selectedItem;
        if(itemData == null)return
        let config = itemData.cfg;
        let awards = config.showreward;
        this.roleShowpanel.Clear();
        if(config.bossid){
            this.roleShowpanel.SetBody(PetConst.GetSkin(config.bossid));
        }  
        this.guanQia_label.text = "第 " + config.gid + " 关";
        let petConfig = GameGlobal.Config.petBiographyConfig[config.bossid];
        if(petConfig != null){
            this.powerLabel.text = ItemConfig.CalcAttrScoreValue(petConfig.attrs);
        }
        this.challenge_btn.label = "挑 战";
        this.awardList.dataProvider  = new eui.ArrayCollection(awards);
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(config.Id);
        if(activityData == null) return
        var canGet = activityData.canGetRecordByIndex(config.gid);
        var hasGet = activityData.GetRecordByIndex(config.gid);
        this.challenge_btn.visible = true;
        this.hasGet_img.visible = false;
        if(canGet && !hasGet){
            this.challenge_btn.label = "领 取"
        }
        else if(!canGet && !hasGet)
        {
            this.challenge_btn.label = "挑 战"
        }
        else if(hasGet)
        {
            this.challenge_btn.visible = false;
            this.hasGet_img.visible = true;
        }
        UIHelper.ShowRedPoint(this.challenge_btn,canGet && !hasGet)
    }

    private updateTime(): void
    {
		let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData ) {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow( activityData.getRemindTimeString())
		} else {
			this.time_txt.text = "活动未开启"
		}	
    }
    protected getReward(): any
    {
        this.canGetCount = 0;
        let arr = []
        let config = ActivityConst.GetConfigByActityType(this.activityType)[this._activityId];
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);

        let i:number;
        let len:number = config.length;
        for( i =  0; i < len ;i ++ )
        {
            let cfgObj = config[i];
            if (cfgObj.Id != this._activityId)
            {
                continue
            }
            let o: any = {};
            o.cfg = cfgObj
            o.actType = this.activityType 
            if(activityData)
            {
                var canGet = activityData.canGetRecordByIndex(cfgObj.gid);
                var hasGet = activityData.GetRecordByIndex(cfgObj.gid);
                if(canGet || hasGet)
                {
                    this.canGetCount ++;
                }
                if(this.list.selectedIndex == -1)
                {
                    if(!canGet && !hasGet){
                        this.list.selectedIndex = i;
                    }
                }
            }
            arr.push(o); 
        }
        return arr
    }

    private _OnClick(e: egret.TouchEvent)
    {
        if(this.list.selectedItem == null) return
        let itemData = this.list.selectedItem;
        if (e.currentTarget == this.getwayLabel)
		{
            let petId = itemData.cfg.bossid;
            let petConfig = GameGlobal.Config.petBiographyConfig[petId];
            if(petConfig)
                ViewManager.ins().open(PetInfoPanel,petConfig);
        }
        else if(e.currentTarget == this.challenge_btn)
        {
            if(this.challenge_btn.label == "挑 战"){
                GameGlobal.ActivityKaiFuModel.sendPetFightInfo(itemData.cfg.Id)
            }
            else if(this.challenge_btn.label == "领 取")
            {
                GameGlobal.ActivityKaiFuModel.sendReward(itemData.cfg.Id,itemData.cfg.gid)
            }
        }else if(e.currentTarget == this.leftBtn){
            this.setProgressBarData();
        }else if(e.currentTarget == this.rightBtn){
            this.setProgressBarData();
        }
    } 
    public OnClose() 
	{
		
	}  
}

class TargetGuanQiaItem extends eui.ItemRenderer 
{
	/////////////////////////////////////////////////////////////////////////////
    // KaiFuTargetGuanQiaItmeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected item: ItemIcon;
    protected lbName: eui.Label;
    protected redPoint: eui.Image;
    protected hasGetAward_img:eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() 
    {
		
	}
	public dataChanged() 
    {
        if(this.data == null)
            return
        let type = this.data.type;
        let cfgObj = this.data.cfg

        var itemId = cfgObj.showitem.id;
        var itemConfig = GameGlobal.Config.ItemConfig[itemId];
        this.item.setData(itemConfig);
        this.lbName.text = itemConfig.name;
        this.lbName.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id); 
        if(activityData){
            let canGet = activityData.canGetRecordByIndex(cfgObj.gid);
            let hasGet = activityData.GetRecordByIndex(cfgObj.gid);
            this.hasGetAward_img.visible = canGet || hasGet;
            UIHelper.ShowRedPoint(this,canGet && hasGet)
        }       
	}
}
