/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 商店商品item1
 * 
 **/

class ItemShopPanel extends BaseView implements ICommonWindowTitle{

	listView
	private priceIcon: PriceIcon
	btn_down_name = "ui_cjg_btn_djg"
    btn_up_name = "ui_cjg_btn_djgs"
	childrenCreated() {

this.name = this as any
		this.skinName = "ItemShopSkin";
	}

	open() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// MessageCenter.addListener(Shop.postBuyResult, this.buyResultCB, this);
		this.updateData();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};
	updateData() {
		var arr = [];
		var dataProvider = ItemStoreConfig.GetItemBYStoreConfig();
		for (var k in dataProvider) {
			arr.push(dataProvider[k]);
		}
		this.listView.dataProvider = new eui.ArrayCollection(arr);

		this.priceIcon.price = GameGlobal.actorModel.yb
	};
	onTap(e) {
		if (e.target.name == "buy") {
			var goodsID = e.target.parent['goodsID'];
			ViewManager.ins().open(BuyWin, goodsID);
		}
	};
	buyResultCB(result) {
		if (result == 1) {
			UserTips.ins().showTips("购买成功");
		}
		else {
			UserTips.ins().showTips("|C:0xff0000&T:购买失败|");
		}

		this.priceIcon.price = GameGlobal.actorModel.yb
	};
	UpdateContent(): void {}
}
