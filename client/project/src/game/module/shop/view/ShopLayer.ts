/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 商店主界面
 * 
 **/
class ShopLayer extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	viewStack: TabView;
	private commonWindowBg: CommonWindowBg

	tShopData = [];


	initUI() {
		super.initUI()
		this.skinName = "ShopSkin";

	}

	OnOpen(...param: any[]) {
		this.viewStack.tabChildren = this.getOpenList(param[0] || []);//商店列表
		this.commonWindowBg.SetViewStack(this.viewStack)
		this.viewStack.UpdateTabShowState(this.viewStack.length, false)
		this.commonWindowBg.OnAdded(this, 0, param[1])

		let shopType = param[1]
		if (shopType == ShopController.EN_SHOP_EQUIP) {
			this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateTabBtnRedPoint)

			this.UpdateTabBtnRedPoint()
		}

	}

	private UpdateTabBtnRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.UserBag.HasOrangeEquip())
	}


	getOpenList(tLayerType: [number]) {
		var list = []
		for (const item in tLayerType) {
			switch (tLayerType[item]) {
				case ShopController.EN_SHOP_DAYAN:
					list.push(TabView.CreateTabViewData(ShopNormalView));
					break;
				case ShopController.EN_SHOP_EQUIP:
					list.push(TabView.CreateTabViewData(ShopEquipLayer));
					break;
				case ShopController.EN_SHOP_BLACK:
					list.push(TabView.CreateTabViewData(ShopBlackLayer));
					break;
				case ShopController.EN_SHOP_YUANBAO:
					list.push(TabView.CreateTabViewData(ShopYuanBaoLayer));
					break;
				case ShopController.EN_SHOP_BANGYUAN:
					list.push(TabView.CreateTabViewData(ShopBangYuanLayer));
					break;
				case ShopController.EN_SHOP_CAILIAO:
					list.push(TabView.CreateTabViewData(ShopCaiLiaoLayer));
					break;
				case ShopController.EN_SHOP_ARENA:
					list.push(TabView.CreateTabViewData(ShopArenaLayer));
					break;
				case ShopController.EN_SHOP_XIANDU:
					list.push(TabView.CreateTabViewData(ShopXianDaoLayer));
					break;
				case ShopController.EN_SHOP_WEIWANG:
					list.push(TabView.CreateTabViewData(ShopWeiWangLayer));
					break;
				case ShopController.EN_SHOP_BASHI:
					list.push(TabView.CreateTabViewData(shopBashiLayer));
					break;
				case ShopController.EN_SHOP_CHONGWU:
					list.push(TabView.CreateTabViewData(ShopChongWuLayer));
					break;
				case ShopController.EN_SHOP_XIANLV:
					list.push(TabView.CreateTabViewData(ShopXianlvLayer));
					break;
				case ShopController.EN_SHOP_BANGPAI:
					list.push(TabView.CreateTabViewData(ShopBanghuiLayer));
					break;
				case ShopController.EN_SHOP_ZHUANGBAN:
					list.push(TabView.CreateTabViewData(ShopZhangBanLayer));
					break;
				case ShopController.EN_SHOP_PIFU:
					list.push(TabView.CreateTabViewData(ShopPiFuLayer));
					break;
				case ShopController.EN_SHOP_YOUQING:
					list.push(TabView.CreateTabViewData(ShopYouQingLayer));
					break;
				case ShopController.EN_SHOP_JINGJI:
					list.push(TabView.CreateTabViewData(ShopJingJiLayer));
					break;
				case ShopController.EN_SHOP_QUJING:
					list.push(TabView.CreateTabViewData(ShopQuJingLayer));
					break;
				case ShopController.EN_SHOP_DATI:
					list.push(TabView.CreateTabViewData(ShopDaTiLayer));
					break;
				case ShopController.EN_SHOP_MYSTERY:
					list.push(TabView.CreateTabViewData(ShopMysteryPanel));
					break;
				case ShopController.EN_SHOP_INTEGRAL:
					list.push(TabView.CreateTabViewData(ShopIntegralPnael));
					break;
				case ShopController.EN_SHOP_TREASURE_HUNT:
					list.push(TabView.CreateTabViewData(ShopTreasureHuntPnael));
					break;
			}
		}

		return list

	}

	OnClose() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
	}


	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }
}
