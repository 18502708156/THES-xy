/**
 * 银两兑换
 */
class ExchangeMoneyWin extends BaseEuiView implements ICommonWindow 
{

	//skinName
	//ExchangeMoneySkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Popup
    protected animGroup: eui.Group;

	//前往VIP_Lab
	private gotoVip:eui.Label;
	private vipbuy_txt:eui.Label;
	private vipGroup:eui.Group;
	//兑换按钮
	private exchangeBtn:eui.Button;
	//银两数量
	private moneyLab:eui.Label;
	//item_Lab
	private itemCount:eui.Label;
	//剩余次数
	private surplusCount:eui.Label;
	//Bg
    private commonDialog:CommonDialog;
	//Tab
	private chaptersCommonConfigTab:any;
	private vipPrivilegeConfigTab:any;	
	private moneyCount="0";
	//剩余次数
	private endCount=1;

	public constructor() {
		super()
		this.skinName = "exchangeMoneySkin"; 
	}

	public childrenCreated() 
    {
		this.commonDialog.OnAdded(this);
		this.commonDialog.showReturnBtn(false);
		this.commonDialog.title="银两兑换";

		//挂机关卡表
		this.chaptersCommonConfigTab=GameGlobal.Config.ChaptersCommonConfig;
		//VIP表
		this.vipPrivilegeConfigTab=GameGlobal.Config.VipPrivilegeConfig;
		GameGlobal.ExchangeModel.exchangeInfo();
		
    }

	OnOpen(...param: any[]) 
	{
		this.AddClick(this.gotoVip,this.onClick)
		this.AddClick(this.exchangeBtn,this.onClick)
		this.observe(MessageDef.EXCHANGE_COUNT, this.surplus);
		this.observe(MessageDef.EXCHANGE_COUNT, this.updateItem);
		
		let itemId=this.chaptersCommonConfigTab.itemid;
		let vipData = UserVip.ins();
		//银两次数
		let count=this.vipPrivilegeConfigTab[vipData.lv].silvertime;
		this.endCount=count;
		this.surplusCount.text="剩余"+count+"次";
		this.moneyLab.text=this.moneyCount;

		let itemCount=GameGlobal.UserBag.GetCount(itemId);
		this.itemCount.text = itemCount + "/1";
		
		let nextCfg = this.vipPrivilegeConfigTab[vipData.lv + 1]
		this.vipGroup.visible = nextCfg;
		if (nextCfg)
		{
			this.vipbuy_txt.text = "VIP" + nextCfg.vipid + "每天可再购买"+(nextCfg.silvertime - this.vipPrivilegeConfigTab[vipData.lv].silvertime)+"次"
		}	

		UIHelper.PlayPanelTween(this.animGroup)
	}

	OnClose() {
		this.commonDialog.OnRemoved();
		
	}

	update()//arr: Sproto.sc_raid_chapter_offline_reward_request) 
	{
		
	}

	onClick(e: egret.TouchEvent) 
	{
		switch (e.currentTarget) 
        {
			case this.gotoVip:
				ViewManager.ins().close(this);
				ViewManager.ins().open(VipMainPanel);
			break;
			case this.exchangeBtn:
				//RPC
				let itemId=this.chaptersCommonConfigTab.itemid;
				if(this.checkItem(itemId,1))
				{
					if(this.endCount>0)
					{
						GameGlobal.ExchangeModel.exchange();
					}
					else
					{
						UserTips.ins().showTips("剩余兑换次数不足");
					}

				}
				else
				{
					if(this.endCount>0)
					{
						let needGold=this.chaptersCommonConfigTab.gold;
						WarnWin.show("是否花费"+needGold+"元宝兑换银两？",()=>{
							if (Checker.Money(2,needGold))
							{
								GameGlobal.ExchangeModel.exchange();
							}
						},this);
					}
					else
					{
						UserTips.ins().showTips("剩余兑换次数不足");
					}
					
				}
			break;
		}
	}
	private checkItem(itemId: number, value: number):boolean
	{
		let count = GameGlobal.UserBag.GetCount(itemId)
		if (count >= value) 
		{
			return true;
		}
		return false;
	}

	private surplus(msg):void
	{
		if(msg.exchangeCount!=null && msg.exchangeCount!=undefined)
		{
			let vipData = UserVip.ins();
			let count=this.vipPrivilegeConfigTab[vipData.lv].silvertime;
			count-=msg.exchangeCount;
			this.endCount=count;
			this.surplusCount.text="剩余"+count+"次";
		}
		if(msg.goldnum!=null && msg.goldnum!=undefined)
		{
			this.moneyCount=(msg.goldnum).toString();
			this.moneyLab.text=this.moneyCount;
		}
	}
	private updateItem(msg):void
	{
		let itemId=this.chaptersCommonConfigTab.itemid;
		let itemCount=GameGlobal.UserBag.GetCount(itemId);
		this.itemCount.text = itemCount + "/1";
	}
}

