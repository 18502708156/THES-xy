/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/8 14:15
 * @meaning: 商店管理类
 * 
 **/

class ShopManage extends BaseSystem {



    public  pShopController: ShopController//商店


    //单例
	static ins(): ShopManage {
		return super.ins()
	}

    public Init(): void {
        this.pShopController.Init();//初始化商店数据内容
	}

    public constructor() {
		super();

        this.pShopController = ShopController.ins();//初始化商店类

		this.regNetMsg(S2cProtocol.sc_shop_buy, this.shopUpdataBuy);
        this.regNetMsg(S2cProtocol.sc_shop_buy_update, this.shopInit);
        this.regNetMsg(S2cProtocol.sc_shop_mystical_update, this.getMysterShopData);
        this.regNetMsg(S2cProtocol.sc_shop_buy_unlockdata, this.shopUnlockData);
        

	}


    /**
         * 发送购买物品
         * 16-2
         * @param shopType	商店类型
         * @param index		物品
         * @param buynum	数量
         * 
         */
    public sendBuy(shopType, arr, nums) {
        var cs_shop_buy = new Sproto.cs_shop_buy_request();
        cs_shop_buy.shopType = shopType;
        cs_shop_buy.index = arr;
        cs_shop_buy.buynum = nums;
        GameSocket.ins().Rpc(C2sProtocol.cs_shop_buy, cs_shop_buy);
    };


    //商店购买次数更新
    public shopUpdataBuy(rsp : Sproto.sc_shop_buy_request)
    {
        // var data = rsp
        this.pShopController.updateByAddShop(rsp)

        //购买物品更新提示
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_CHANGE)
    }

    //初始化商店购买次数
    public shopInit(rsp : Sproto.sc_shop_buy_update_request )
    {
         this.pShopController.updataByServer(rsp)
    }


    //商店解锁条件
    public shopUnlockData(rsp : Sproto.sc_shop_buy_unlockdata_request )
    {
        this.pShopController.shopUnlockData(rsp)
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_CHANGE)
    }


    public sendRefreshMysteryShopData(){
       let  req = new Sproto.cs_shop_mystical_refresh_request()
       this.Rpc(C2sProtocol.cs_shop_mystical_refresh, req);
    }
   
    private getMysterShopData(req:Sproto.sc_shop_mystical_update_request){
        if(req)
          {
              this.pShopController.mysteryData = req;
              MessageCenter.ins().dispatch(MessageDef.SHOP_MYSTERY_REFRESH);
          } 
    }

    sendMysteryBuy(index, num){
        let req = new Sproto.cs_shop_mystical_buy_request
        req.index = index;
        req.buynum = num;
        this.Rpc(C2sProtocol.cs_shop_mystical_buy, req);
    }

     sendAllMysteryBuy(){
         let items = ShopController.ins().getMysteryShopData()
        //  let beBuyItmes = [];
         for(let val of items){
             if(!val.isBuy)
             {
                let price = val.item.currency;
                if (Checker.Money(price.id, price.count))
                 this.sendMysteryBuy(val.item.index, val.item.daycount)
             }
         }
    }
}