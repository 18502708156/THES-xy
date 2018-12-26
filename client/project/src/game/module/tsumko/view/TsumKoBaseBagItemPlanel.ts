/**
 * 八十一难 宝箱开启界面
 */
class TsumKoBaseBagItemPlanel extends BaseEuiView
{
	//skinName

	//TsumKoBaseBagItemSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Popup;
	//消耗元宝Lab
	private priceicon:PriceIcon;
	//宝箱btn
	private openBtn:eui.Button;
	//道具列表
	private itemListGoods:eui.List;
	private itemGoodsScroller:eui.Scroller;
	private commonDialog: CommonDialog;


	public constructor()
    {
        super()
        this.skinName = "TsumKoBaseBagItemSkin";
        
	}
	public childrenCreated() 
	{
		this.itemGoodsScroller.viewport=this.itemListGoods;
		this.itemListGoods.itemRenderer=ItemBase;
		this.itemListGoods.dataProvider = new eui.ArrayCollection([]);
		// GameGlobal.TsumKoBaseModel.View_Type=2;
		this.observe(MessageDef.ClOSETSUMKOBASEBAGITEMPLANEL, this.CloseView)
		
	}
	public CloseView()
	{
		this.CloseSelf();
	}
	public OnOpen(...param: any[]) 
	{
		this.commonDialog.OnAdded(this);
		this.commonDialog.showReturnBtn(false);
		this.commonDialog.title="开启宝箱";
		this.itemListGoods.dataProvider=new eui.ArrayCollection(this.items());
		this.priceicon.type=2;
		this.priceicon.price=GameGlobal.Config.DisasterFbBaseConfig.openboxprice;
		this.openBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			let tab=GameGlobal.Config.DisasterFbConfig[GameGlobal.TsumKoBaseModel.recordId];
			let tab2=GameGlobal.Config.DisasterFbBaseConfig;
			WarnWin.show("是否花费"+tab2.openboxprice+"元宝购买宝箱？",()=>
			{
				if(Checker.Money(2,tab2.openboxprice)==true)
				{
					GameGlobal.TsumKoBaseModel.SendBuy(tab.id);
				}
			},this);
		},this);

	}
	public OnClose() 
	{
		this.commonDialog.OnRemoved()
	}
	//宝箱表
	private items():any[]
	{
		let itemArr=[];
		let config = GameGlobal.Config.DisasterBoxConfig
		for (let key in config) 
		{
			let data = config[key]
			itemArr.push(data.item)
		}
		return itemArr;
	}
}