class KaiFuQiTianFuLiPanel extends BaseEuiView
{
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuQiTianFuLiPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////
    private curDay:number;
	public constructor()
    {
        super()
        this.skinName = "KaiFuQiTianFuLiPanelSkin";
    }
	public childrenCreated() 
    {
		this.list.itemRenderer = QiTianFuLiAwardItem;
    }
	public OnOpen()
    {
       this.UpdateContent();
    }
    private getReward(): any
    {
        let arr = ActivityConst.GetQiTianActivityIds(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY,0)
        
        return arr
    }
    
	public OnClose() 
	{
		
	}
    public UpdateContent() 
	{
		 if (!this.visible) return;

        let arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
    }
    static RedPoint(day:number): boolean
    {
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(7);
        if (activityData && activityData.canGetRecordByIndex(day))
        {
            return true;
        }
        activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(8);

        if (activityData )
        {
            let config = activityData.GetConfig()
            for (let key in config) {
                if (config.hasOwnProperty(key)) {
                    let cfgobj = config[key];
                    if (cfgobj.day != day)
                    {
                        continue
                    }    
                    if (activityData.canGetRecordByIndex(cfgobj.index))
                    {
                        return true;
                    }    
                }
            }
        }
        return false;
    }

    private _OnClick(e: egret.TouchEvent)
    {
       
    }   
}

class QiTianFuLiAwardItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuQiTianAwardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tipsTxt: eui.Label;
    protected list: eui.List;
    protected btn: eui.Button;
    protected getted_img: eui.Image;
    protected tip2:eui.Label
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
    }
    public childrenCreated() 
    {
		this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this)
    }
    private onClick(e:egret.TouchEvent): void
    {
        let config = ActivityConst.GetCfgObjByValue(this.data);
        if (this.btn.label == "领 取")
        {
            GameGlobal.ActivityKaiFuModel.sendReward(config.Id,config.index)
        }
        else if (this.btn.label == "前 往")
        {
            if(config.gainway)
            {
                GameGlobal.ViewManager.Guide(config.gainway[0][1][0])
            }  
        }      
    }
    


	dataChanged() {

        let config = ActivityConst.GetCfgObjByValue(this.data); 
        this.tipsTxt.text = config.des.replace("%s",config.value) 
        this.list.dataProvider = new eui.ArrayCollection(config.rewards);
        

        if (KaiFuQiTianActivityPanel.OPEN_SHOW_DAY > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7)
        {
            this.tip2.text = "明日开启"
            this.getted_img.visible = false;
            this.btn.visible = false;
        } else
        {
            this.tip2.text = ""
            this.getted_img.visible = false;
            this.btn.visible = true;
            this.btn.label = config.gainway?"前 往":"未达成"

            let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(config.Id);
            if (activityData )
            {
                let canReward = activityData.canGetRecordByIndex(config.index);
                let getted = activityData.GetRecordByIndex(config.index);
                if (canReward)
                {
                    if (!getted)
                    {
                        this.btn.label = "领 取"
                    } 
                }   
                this.getted_img.visible = getted;
                UIHelper.ShowRedPoint(this.btn, canReward);
                this.btn.visible = !this.getted_img.visible;
                if (!canReward && KaiFuQiTianActivityPanel.OPEN_SHOW_DAY < GameServer.serverOpenDay)
                {
                    this.btn.visible = false;
                    this.tip2.text = "已过期"
                }    
            }
        }  
        
          
	}	
}