
class KaiFuQiTianOtherPanel extends BaseEuiView
{
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuQiTianOtherPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor()
    {
        super()
        this.skinName = "KaiFuQiTianOtherPanelSkin";
    }
	public childrenCreated() 
    {
		this.list.itemRenderer = QiTianOtherAwardItem;
    }
	public OnOpen()
    {
        this.UpdateContent();
    }
    private getReward(): any
    {
        let idsArr = ActivityConst.GetQiTianActivityIds(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY, 1)
        let arr = []
        let i:number;
        let len:number = idsArr.length;
        for( i =  0; i < len ;i ++ )
        {
            let cfgObj = ActivityConst.GetCfgObjByValue(idsArr[i]);
            let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
            let o: any = {};
            o.cfg = cfgObj
            o.weight = cfgObj.index;
            if(activityData)
            {
                let canGet = activityData.canGetRecordByIndex(cfgObj.index)
                let getted = activityData.GetRecordByIndex(cfgObj.index)
                if (canGet) { 
                    if (getted) o.weight += 1000;
                    else o.weight -= 1000;
                }else if (getted) o.weight += 1000;
            }
            arr.push(o); 
        }

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
    static RedPoint(day): boolean
    {
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(15);
        
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

class QiTianOtherAwardItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieAwardItemSkin.exml
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
        let config = this.data.cfg
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
		
        let type = this.data.type;
        let cfgObj = this.data.cfg
        let weight = this.data.weight;
        let actType = this.data.actType

        this.tipsTxt.text =  cfgObj.des.replace("%s",cfgObj.value);        
        this.list.dataProvider = new eui.ArrayCollection(cfgObj.rewards);   

        // let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
       
         
        

        if (KaiFuQiTianActivityPanel.OPEN_SHOW_DAY > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7)
        {
            this.tip2.text = "明日开启"
            this.getted_img.visible = false;
            this.btn.visible = false;
        } else
        {
            this.tip2.text = ""

            this.btn.visible = weight < 100;
            this.btn.label = (weight > 0 && weight < 100) ? (cfgObj.gainway?"前 往":"未达成") : "领 取";
            UIHelper.ShowRedPoint(this.btn,weight < 0)  
            this.getted_img.visible = !this.btn.visible


            // if (weight > 0 && weight < 100 && KaiFuQiTianActivityPanel.OPEN_SHOW_DAY < GameServer.serverOpenDay)
            // {
            //     this.btn.visible = false;
            //     this.tip2.text = "已过期"
            // }
        }  
        
	}
}