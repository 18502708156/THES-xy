class ShopGoodsWarn extends BaseEuiView {
	public constructor() {
		super();
	}
    /////////////////////////////////////////////////////////////////////////////
    // GainGoodsSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected nameTxt: eui.Label;
    protected itemIcon: ItemIcon;
    protected price: PriceIcon;
    protected countTxt: eui.TextInput;
    protected decBtn: eui.Button;
    protected addBtn: eui.Button;
    protected add10Btn: eui.Button;
    protected dec10Btn: eui.Button;
    protected totalPrice: PriceIcon;
    protected buyBtn: eui.Button;
    protected dialogReturnBtn: eui.Button;
    protected lbAccount: eui.Label;
    protected recharge: eui.Label;
    protected lbGo1: eui.Label;
    protected lbGo0: eui.Label;
    protected lbGo2: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private _totalNum = 0
	_goodsId
	goodsGroup


	nGoodsId = 0; 

	tThisShopData;

	nShopType = -1;//商店类型 -1代表没有找到对应的商店
	nItemIndex = 0;//所需要获得物品index (对应商店表中的index)

	nNum = 1;//需要购买个数

	tLbGo = [];

	initUI() {
		super.initUI()
		this.skinName = "GainGoodsSkin";
		// this.gainList.itemRenderer = GainGoodsItem;
		this.countTxt.restrict = "0-9";
		// this.price.setType(MoneyConst.byb);
		// this.totalPrice.setType(MoneyConst.byb);
		// this.itemIcon.imgJob.visible = false;
		this.observe(MessageDef.BYB_CHANGE, this.setData)
		this.observe(MessageDef.YB_CHANGE, this.setData)

		this.tLbGo[0] = this.lbGo0
		this.tLbGo[1] = this.lbGo1
		this.tLbGo[2] = this.lbGo2

		UIHelper.SetLinkStyleLabel(this.recharge)
		// for (let label of this.tLbGo) {
		// 	this._AddClick(label, this.onTouchList)
		// }

	};
	OnOpen() {

		this.commonDialog.SetReturnButton(this.dialogReturnBtn)
		this.commonDialog.setBgVisible(false)//这个框需要隐藏背景框,自己设置一个新的
		this.commonDialog.OnAdded(this)
			this.decBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.dec10Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.add10Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			// this.lbRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

			



			// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			// this.gainList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchList, this);
			this.countTxt.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
			// MessageCenter.addListener(Shop.postBuyResult, this.buyCallBack, this);
	};

	OnClose() {
		this.commonDialog.OnRemoved()
		this.decBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.addBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.dec10Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.add10Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.recharge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.lbRecharge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.gainList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchList, this);
		this.countTxt.removeEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		MessageCenter.ins().removeAll(this);
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.recharge:
				RechargeWin.Open()
				this.CloseSelf()
				break;
			case this.decBtn:
				this.setTotalPrice(this._totalNum - 1);
				break;
			case this.addBtn:
				this.setTotalPrice(this._totalNum + 1);
				break;
			case this.dec10Btn:
				this.setTotalPrice(this._totalNum - 10);
				break;
			case this.add10Btn:
				this.setTotalPrice(this._totalNum + 10);
				break;
			case this.buyBtn:
				if(this.nShopType >-1 &&this.nItemIndex>0)
				{
					var bEn = false
					if(this.nShopType ===ShopController.EN_SHOP_BANGYUAN)
					{
						if (GameLogic.ins().actorModel.byb >= this.totalPrice.getPrice()) {
							bEn = true
						}
					}
					else if(this.nShopType ===ShopController.EN_SHOP_YUANBAO)
					{
						if (GameLogic.ins().actorModel.yb >= this.totalPrice.getPrice()) {
							bEn = true
						}
					}

					if(bEn)
					{
						ShopManage.ins().sendBuy(this.nShopType,this.nItemIndex,this._totalNum)
					}
					else
					{
						UserTips.ins().showTips("元宝不足")
					}
				}
				else
					UserTips.ins().showTips("元宝不足")
				break;
		}
	};

	//寻找商店对应下标
	private searchItemIndex(_id)
	{

		var tShopData  =  ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_BANGYUAN)

		for (const item in tShopData.shop) {
			if(tShopData.shop[item].id === _id)
			{
				this.nItemIndex = tShopData.shop[item].index
				this.nShopType = ShopController.EN_SHOP_BANGYUAN//判断类型



			   var nBuyNusm = 0
			   var nPrice =  tShopData.shop[item].currency.count || 999
			   nBuyNusm =  Math.floor(GameLogic.ins().actorModel.byb / nPrice);
			   if(nBuyNusm>=1)
			   {
					return
			   }

			}
		}

		tShopData  =  ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_YUANBAO)

		for (const item in tShopData.shop) {
			if(tShopData.shop[item].id === _id)
			{
				this.nItemIndex = tShopData.shop[item].index
				this.nShopType = ShopController.EN_SHOP_YUANBAO//判断类型
				return
			}
		}

	}

	// onTouchList(e: egret.TouchEvent) {
	// 	let label = e.currentTarget
	// 	let index = this.tLbGo.indexOf(label)
	// 	if (index == -1) {
	// 		return
	// 	}

	// 	let gainConfig = GameGlobal.Config.GainItemConfig[this.nGoodsId]
	// 	if(gainConfig&&gainConfig.gainWay)
	// 	{
	// 		let data = gainConfig.gainWay[index]
	// 		if (data) {
	// 			GameGlobal.ViewManager.Guide(data[1][0], null)
	// 		}
	// 	}
	// };
	buyCallBack(num) {
		if (num > 0) {
			ViewManager.ins().close(ShopGoodsWarn);
		}
		else
			UserTips.ins().showTips("|C:0xff0000&T:元宝不足|");
	};
	onTxtChange(e) {
		var num = Number(this.countTxt.text);
		this.setTotalPrice(num);
	};
	setData(id, num) {





		this.nGoodsId = id || this.nGoodsId  //物品id
		this.nNum = num || this._totalNum //购买个数
		var shopConfig;


		this.searchItemIndex(this.nGoodsId)
		var itemConfig = GlobalConfig.ins().ItemConfig[this.nGoodsId];
		if(itemConfig)
		{
			this.itemIcon.setData(itemConfig);
			this.nameTxt.text = "" + itemConfig.name;
			this.nameTxt.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
			shopConfig = ItemStoreConfig.getStoreByItemID(this.nGoodsId,this.nShopType);
		} else {
			this.itemIcon.setItemImg(RewardData.getCurrencyRes(id))
			if (id == MoneyConst.yuanbao) {
				this.itemIcon.setItemBg(ResDataPath.GetItemQualityName(4))
			}
			this.nameTxt.text = RewardData.getCurrencyName(id);
			this.nameTxt.textColor = 0xaa6a31
		}


		if(id)
		{
			if(this.nShopType<0)
			{
				this.currentState = "getway"
			}
			else
			{
				this.currentState = "shop"
			}
		}


		//绑元
		if(this.nShopType === ShopController.EN_SHOP_BANGYUAN)
		{
			this.price.setType(MoneyConst.byb);
			this.totalPrice.setType(MoneyConst.byb);
		}
		else if(this.nShopType === ShopController.EN_SHOP_YUANBAO)//元宝
		{
			this.price.setType(MoneyConst.yuanbao);
			this.totalPrice.setType(MoneyConst.yuanbao);
		}
		else
		{
			// shopConfig = null
		}




		// this.validateNow();//刷新界面

		if (shopConfig) {
			this._goodsId = shopConfig.id;
			this.price.setPrice(shopConfig.currency.count);
			this.setTotalPrice(this.nNum);
		}

		
		//跳转内容
		if(id)
		{
			this.setJumpLabel(id)
		}

	};


	private setJumpLabel(_id)
	{
		let gainConfig = GameGlobal.Config.GainItemConfig[_id]
		let tLbPos0 = [360,160,560]//只有在途径为2的时候这样
		let tLbPos1 = [200,520]//只有在途径为2的时候这样
		if(gainConfig&&gainConfig.gainWay&&gainConfig.gainWay.length)
		{
			// for (const item in gainConfig.gainWay) {
			for (let i = 0, len = gainConfig.gainWay.length; i < len; i++) {
				let ptLists = gainConfig.gainWay[i]
				
				if(!this.tLbGo[i])
				{
					continue;
				} 
				this.tLbGo[i].text = ptLists[0] || ""

				this.tLbGo[i].validateNow();//立即刷新
				if(ptLists[2] == 1)
				{
					UIHelper.SetLinkStyleLabel(this.tLbGo[i])
					this._AddClick(this.tLbGo[i],()=>{
						ViewManager.ins().Guide(ptLists[1][0], ptLists[2]);
						ViewManager.ins().close(this)
					})
				}
				else if(ptLists[2] == 2)
				{
					UIHelper.SetLinkStyleLabel(this.tLbGo[i])
					this._AddClick(this.tLbGo[i],()=>{
						GameGlobal.UserTips.showTips(ptLists[0]);
					})
				}

				//重新设置位置
				if(gainConfig.gainWay.length ==2)
				{
					this.tLbGo[i].x = tLbPos1[i] - this.tLbGo[i].width/2
				}
				else
				{
					this.tLbGo[i].x = tLbPos0[i] -this.tLbGo[i].width/2
				}
			}




		}

	}


	setTotalPrice(num: number) {
		var nBuyNusm = 0
		if(this.nShopType === ShopController.EN_SHOP_BANGYUAN)
		{
			 nBuyNusm =  Math.floor(GameLogic.ins().actorModel.byb / this.price.getPrice()) 
			
		}
		else if(this.nShopType === ShopController.EN_SHOP_YUANBAO)
		{
			 nBuyNusm =  Math.floor(GameLogic.ins().actorModel.yb / this.price.getPrice()) 
		}
		if(num < nBuyNusm)
		{
			this._totalNum = num;
		}
		else
		{
			this._totalNum = nBuyNusm;
		}

		if(this._totalNum <1)
		(
			this._totalNum = 1
		)

		this.countTxt.text = this._totalNum + "";
		this.totalPrice.setPrice(this._totalNum * this.price.getPrice());
	};
}

ShopGoodsWarn.LAYER_LEVEL =  LayerManager.UI_Popup;
