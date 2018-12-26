/**
 81难-生死劫(小关卡记录界面)
 */
// TsumKoBaseRecordSkin.exml
class TsumKoBaseRecordPanel extends BaseEuiView implements ICommonWindow
{
	public static LAYER_LEVEL = LayerManager.UI_Main;

	private shopBtn:eui.Button;//商店 
	private challengeLabel:eui.Label;//返回挑战

	private ranksLabel:eui.Label;//队伍0
	private ranksLabel1:eui.Label;//队伍1
	private roundLabel:eui.Label;//回合0
	private roundLabel1:eui.Label;//回合1
	private timeLabel:eui.Label;//时间
	private timeLabel1:eui.Label;//时间1
	private countLabel:eui.Label;//人数
	private commonWindowBg: CommonWindowBg;//背景框

	private title0:eui.Label;//標題0
	private itemList:eui.List;//itemList
	private title1:eui.Label;//標題2


	public constructor()
    {
        super()
        this.skinName = "TsumKoBaseRecordSkin";

		this.observe(MessageDef.CHOICECHECKPOINT, this.updateView);
        
	}
	public childrenCreated() 
	{
		this.observe(MessageDef.TSUMKO_RECORD, this.record);
		this._AddClick(this.shopBtn, this._onClick);

	}
	public OnOpen(...param: any[]) 
	{
		this.updateView();

		this.commonWindowBg.OnAdded(this);
		this.commonWindowBg.SetTitle("八十一难");
		this.challengeLabel.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			ViewManager.ins().open(TsumKoBasePanel);
			ViewManager.ins().close(TsumKoBaseRecordPanel);
       },this);
		let count1=GameGlobal.Config.DisasterFbBaseConfig.assisttimes;
		let helpCount=GameGlobal.TsumKoBaseModel.info_helpReward;
		if(helpCount==undefined)helpCount=0;
		let count=count1-helpCount;
		this.countLabel.text="("+count+"/"+count1+")";
		
	}

	private updateView()
	{
		let id=GameGlobal.TsumKoBaseModel.recordId;
		this.itemList.itemRenderer=ItemBase;
		this.itemList.dataProvider = new eui.ArrayCollection([]);
		this.itemList.dataProvider= new eui.ArrayCollection(GameGlobal.Config.DisasterFbConfig[id].showdrop);

		this.title1.text=GameGlobal.Config.DisasterFbConfig[id].name;
		this.title0.text=GameGlobal.Config.DisasterFbConfig[id].name;
	}

	public record(req):void
	{
		if(req.first!=null)
		{
			
			let name1="",name2="",name3="";
			if(req.first.name1!=undefined)name1=req.first.name1;
			if(req.first.name2!=undefined)name2=req.first.name2;
			if(req.first.name3!=undefined)name3=req.first.name3;
			this.ranksLabel.text=name1+name2+name3;
			this.roundLabel.text=req.first.round+"回合";
			this.timeLabel.text=DateUtils.format_2(req.first.time*1000);
		}
		else
		{
			this.ranksLabel.text="暂 无";
			this.roundLabel.text="暂 无";
			this.timeLabel.text="暂 无";
		}
		if(req.fast!=null)
		{
			let name1="",name2="",name3="";
			if(req.fast.name1!=undefined)name1=req.fast.name1;
			if(req.fast.name2!=undefined)name2=req.fast.name2;
			if(req.fast.name3!=undefined)name3=req.fast.name3;
			this.ranksLabel1.text=name1+name2+name3;
			this.roundLabel1.text=req.fast.round+"回合";
			this.timeLabel1.text=DateUtils.format_2(req.fast.time*1000);
		}
		else
		{
			this.ranksLabel1.text="暂 无";
			this.roundLabel1.text="暂 无";
			this.timeLabel1.text="暂 无";
		}
	}
	private _onClick(e:egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.shopBtn:
                ViewManager.ins().open(ShopLayer,[ShopController.EN_SHOP_BASHI]);
                break;
        }
    }
	public OnClose() 
	{
		this.commonWindowBg.OnRemoved();
	}
	
}