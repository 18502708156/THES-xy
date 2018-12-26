
class KaiFuQiTianShopPanel extends BaseEuiView implements ICommonWindow
{
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieShopPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    protected time_txt: eui.Label;
    protected lv_txt: eui.Label;
    protected getwayLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor()
    {
        super()
        this.skinName = "KaiFuQiTianShopPanelSkin";
    }
	public childrenCreated() 
    {
		this.list.itemRenderer = QiTianShopItem;
    }
	public OnOpen()
    {
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
        this.UpdateContent();
	}
	public OnClose() 
	{
		
	}
    public UpdateContent() 
	{
        if (!this.visible) return;
		let arrlist = this.getShopList();
        this.list.dataProvider = new eui.ArrayCollection(arrlist);	
    }
    static RedPoint(): boolean
    {
       
        return false;
    }
    private getShopList(): any
    {  
        let arr = ActivityConst.GetQiTianActivityIds(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY,2)
        return arr
    }

    private _OnClick(e: egret.TouchEvent)
    {
       
    }
    
}

class QiTianShopItem extends eui.ItemRenderer 
{
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuQiTianShopItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    // protected name_txt: eui.Label;
    //protected disPirce_txt: eui.Label;
    protected priceIcon1: PriceIcon;
    protected priceIcon2: PriceIcon;
    protected info: eui.Label;
    protected tip2: eui.Label;
    protected imgBuyEnd: eui.Image;
    protected itemIcon: ItemBase;
    protected buy: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
	}

    public childrenCreated() 
    {
        this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this)
    }

	dataChanged() 
    {
        let cfgObj = ActivityConst.GetCfgObjByValue(this.data);
        if(cfgObj == null) return
        this.itemIcon.setItemAward(1,cfgObj.itemid,cfgObj.count);
        //let goodsCfg = GameGlobal.Config.ItemConfig[cfgObj.itemid];
        // this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        // this.name_txt.text = goodsCfg.name;
   
        if (KaiFuQiTianActivityPanel.OPEN_SHOW_DAY > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7)
        {
            this.tip2.text = "明日开启"
            this.imgBuyEnd.visible = false;
            this.buy.visible = false;
            //return 
        } else {
            let value = cfgObj.value;
            this.imgBuyEnd.visible = false;
            this.tip2.text = ""
            let activityType2Data:any = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.data.id);
            if(activityType2Data)
            {
                var buyNum = activityType2Data.buyData[cfgObj.index - 1];
                if (cfgObj.type.type != 2 && cfgObj.type.value <= buyNum)
                {
                    this.imgBuyEnd.visible = true;
                }
            }
         
            this.buy.visible = !this.imgBuyEnd.visible;
            //this.priceIcon1.text = cfgObj.showgold;
            //this.priceIcon2.text = cfgObj.gold.count;

            if (this.buy.visible && KaiFuQiTianActivityPanel.OPEN_SHOW_DAY < GameServer.serverOpenDay)
            {
                this.buy.visible = false;
                this.tip2.text = "已过期"
            } else {
                this.tip2.text = ""
            }
        }
        this.priceIcon1.text = cfgObj.showgold;
        this.priceIcon2.text = cfgObj.gold.count;
    }
    protected onClick(e:egret.TouchEvent): void
    {
        // if(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7)
        // {
        //     UserTips.ins().showTips("明日开放购买")
        //     return;
        // }
        let cfgObj = ActivityConst.GetCfgObjByValue(this.data);
        if (!Checker.Money(cfgObj.gold.id, cfgObj.gold.count,true))
        {
            return;
        }    
        GameGlobal.ActivityKaiFuModel.sendReward(this.data.id, cfgObj.index)
    }
}