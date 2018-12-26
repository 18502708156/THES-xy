/**
 * 福利_給十万元宝
 */
class FuliGiveGoldMainPanel extends BaseEuiView
{
	//skinName
	//FuliGiveGoldMainSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Main;
	//BG
	// commonWindowBg:CommonWindowBg;
	//labArr
	labArr=[];

	private itemList:eui.List;
	//送十万元宝表
	private tab:any;
    public static CheckRedPoint() {
        return GameGlobal.FuliModel.mRedPoint.GoldShowRedPoint();
    }
	public constructor()
    {
        super()
        this.skinName="FuliGiveGoldMainSkin";
    }
	public childrenCreated() 
    {
		this.tab=GameGlobal.Config.PresentGoldConfig;
        // this.commonWindowBg.SetTitle("送十万元宝");
        this.observe(MessageDef.FULI_GIVEGOLD_INFO, this.UpdateItemList)
		// this._AddClick(this.buyBtn,this._OnClick);
    }
	public OnOpen()
    {
        // this.commonWindowBg.OnAdded(this);

        this.itemList.itemRenderer=GiveGoldListItem;
        this.UpdateItemList();
	}
    public UpdateItemList() 
    {
        let list = CommonUtils.GetArray(this.tab,"id");
        let getWeight =  (config) => {
			let confId = config.id
			if (GameGlobal.FuliModel.isReceiveGold(confId))
			{
				return confId + 100000
			}

			return confId
		}
        
        list.sort(function (lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})
        this.itemList.dataProvider=new eui.ArrayCollection([]);
        this.itemList.dataProvider = new eui.ArrayCollection(list);
    }
    
    private _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            
        }
    }
    public OnClose() 
	{
        this.removeObserve();
		// this.commonWindowBg.OnRemoved();
	}
}

class GiveGoldListItem extends eui.ItemRenderer
{
    //skinName
    //GiveGoldItem.exml


    //道具
    private itemList:eui.List;
    //累计天数
    private addDayLaberl:eui.Label;
    //到达天数
    private dayLabel:eui.Label;
    //领取按钮
    private receiveBtn:eui.Button;
    //以领取Logo
    private itemGetImg:eui.Image;
    private msg:any;
    public childrenCreated()
    {
        this.receiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this._OnClick,this);
        this.msg=GameGlobal.FuliModel.FuliData;
    }

    dataChanged()
    {
        //登陸的天數
        let nowDay=this.msg.addDayCount;

        let data=this.data;
        this.addDayLaberl.text="累计登陆"+data.days+"天";
        this.itemList.itemRenderer=ItemBase;
        this.itemList.dataProvider=new eui.ArrayCollection([]);
        this.itemList.dataProvider=new eui.ArrayCollection(data.item);
        //this.dayLabel.text=1+"天/"+data.days+"天";
        this.dayLabel.textFlow=(new egret.HtmlTextParser).parser("<a color=0xFE0203>"+nowDay+"天/</a>"+data.days+"天");
        data.id;
        if(nowDay>=data.days)
        {
            this.dayLabel.visible=false;
            //是否領取了
            //if(data.id==this.msg.recordEdIndex)//以领取
            //if(this.msg.recordEdIndex>=data.id)
            if(GameGlobal.FuliModel.isReceiveGold(data.id)==true)//以领取
            {
                this.receiveBtn.visible=false;
                this.itemGetImg.visible=true;
            }
            else
            {
                this.receiveBtn.visible=true;
                this.itemGetImg.visible=false;
            }

        }
        else
        {
            this.dayLabel.visible=true;
            this.receiveBtn.visible=false;
            this.itemGetImg.visible=false;
        }
    }

    private _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.receiveBtn:
                this.receiveBtn.visible=false;
                this.itemGetImg.visible=true;
                GameGlobal.FuliModel.GiveGold(this.data.id);
                break;
        }
    }
}