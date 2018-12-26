/**
 * 
 */
class BriberyBasePanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup;
	
	protected count = 0;

	// private itemArr = [];

	private itemDic={};

	private data: any;
	//系统红包表
	private bonusBaseConfigTab: any;
	private key=0;
	private is=true;
	private dic={};
	public constructor() {
		super()
		this.skinName = "briberyBaseSkin";
	}

	public childrenCreated() {


		this.data = GameGlobal.FuliModel.FuliData;
		this.bonusBaseConfigTab = GameGlobal.Config.BonusBaseConfig;
	}

	private showItem(): void 
	{
		this.key=this.data.briberyID;
		this.itemDic[this.key]=this.data.endtime;
		this.item();
	}

	private item(): void 
	{
		this.is=false;
		let b = false;

		// if(this.count<5)
		// {
		let img = new BriberyItem;
		
		img.y = -149;
		img.x = Math.floor(Math.random() * 585);
		this.addChild(img);
		
		img.visible = true;

		img.itemDic=this.itemDic;
		img.key=this.key;
		this.dic[img.key]=img;
		img.x = Math.floor(Math.random() * 585);
		img.y = -149;

	
		let item = img
		let lostTime=item.itemDic[img.key]-GameServer.serverTime-this.bonusBaseConfigTab.falltime;
		egret.Tween.get(item).to
			({ x: Math.floor(Math.random() * 585), y: 1131 },
			this.bonusBaseConfigTab.falltime* 1000,egret.Ease.sineOut 	). //this.bonusBaseConfigTab.falltime
			wait(lostTime* 1000).call(() =>  //this.bonusBaseConfigTab.staytime
			{ 
				if(item.itemDic[img.key]-GameServer.serverTime<2)
				{
					if(this.dic[img.key]!=undefined)
					{
						this.dic[img.key].visible = false;
					}
				}
					
				if(item.parent!=null)
					item.parent.removeChild(item);
				for (var key  in this.dic) 
				{
					if (this.dic[key].visible) 
						b = true;
					else
						b=false;
				}
				if (b == false)
					ViewManager.ins().close(BriberyBasePanel);
			}, this);
		// }

		// if(this.count<this.bonusBaseConfigTab.maxlimit)
			// this.count++;
		// else
		// 	this.count=0;
	}

	private Fun() {

	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.FULI_GET_HAVEBRIBERY, this.showItem);
		// let count = this.bonusBaseConfigTab.maxlimit;

		// for (let i = 0; i < 10; i++) {
		// 	let img = new BriberyItem;

		// 	this.itemArr.push(img);
		// 	//this.itemArr[i].source = "ui_hb_bm_hongbao0";

		// 	this.itemArr[i].y = -149;
		// 	this.itemArr[i].x = Math.floor(Math.random() * 585);
		// 	this.addChild(this.itemArr[i]);
		// }
		if(this.is==false)
			this.showItem();
	}

	
}

class BriberyItem extends eui.Component
{
	//skinName
	//briberyItem.exml

	private img:eui.Image;
	public itemDic={};
	public key=0;

	public constructor() 
	{
		super();
		this.skinName = "briberyItem"
		
	}
	
	public childrenCreated() 
	{
		this.img.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.itemDic={};
		this.key=0;
	}

	public _OnClick(e: egret.TouchEvent)
	{
		switch (e.currentTarget)
		{	
			case this.img:
				ViewManager.ins().open(BriberyPanel,this.itemDic,this.key,this);
				break;
		} ;
	}
}
