/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/3 11:51
 * @meaning: 金装分解界面
 * 
 **/

class ShopResolveLayer extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	/////////////////////////////////////////////////////////////////////////////
	// ShopResolveSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected listView: eui.List;
	protected priceIcon: PriceIcon;
	protected gainWayLabel0: eui.Label
	protected gainWayLabel1: eui.Label
	protected gainWayLabel2: eui.Label
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()

		this.skinName = "ShopResolveSkin"
		this.listView.itemRenderer = ShopResolveItem;

	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.commonDialog.title = "金装分解"
		this.observe(MessageDef.BYB_CHANGE, this.updateContent)
		this.observe(MessageDef.YB_CHANGE, this.updateContent)
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.updateContent)
		this._AddClick(this.gainWayLabel0, this.tap);
		this._AddClick(this.gainWayLabel1, this.tap);
		this._AddClick(this.gainWayLabel2, this.tap);

		this.priceIcon.setType(MoneyConst.JingZhuang);
		UIHelper.SetLinkStyleLabel(this.gainWayLabel0);
		UIHelper.SetLinkStyleLabel(this.gainWayLabel1);
		UIHelper.SetLinkStyleLabel(this.gainWayLabel2);
		this.updateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
	}

	private updateContent() {
		this.priceIcon.setPrice(CommonUtils.overLength(ShopController.ins().getBuyItemNums(MoneyConst.JingZhuang)))
		var itemList = UserBag.ins().getBagEquipByLevelSort(ITEM_QUALITY.ORANGE_QUALITY);//4为橙色
		//只分解比自己装备要低的
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(itemList);
	}
	private tap(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.gainWayLabel0:
				ViewManager.ins().Guide(1007);
				break
			case this.gainWayLabel1:
				ViewManager.ins().Guide(1029);
				break
			case this.gainWayLabel2:
				ViewManager.ins().Guide(1031);
				break
		}
		this.CloseSelf();
	}
}


/**
 * ShopResolveItem
 */
class ShopResolveItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// ShopResolveItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////

	protected nameLabel: eui.Label;
	protected priceIcon: PriceIcon;
	protected itemIcon: ItemBaseNotName;
	protected buy: eui.Button;

	/////////////////////////////////////////////////////////////////////////////

	constructor() {
		super();
	}
	public childrenCreated() {
		this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this)
	}

	public destruct() {
		this.buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this)
	}


	public dataChanged() {
		if (this.data.itemConfig) {
			this.itemIcon.setDataByConfig(this.data.itemConfig);
			this.itemIcon.setItemCount(false)
			this.nameLabel.text = this.data.itemConfig.name + "(Lv." + this.data.itemConfig.level + ")"

			//分解货币
			var nKey = this.data.itemConfig.level * 10000 + this.data.itemConfig.type * 100 + this.data.itemConfig.quality
			var oRong = GlobalConfig.ins().SmeltConfig[nKey]
			if (oRong && oRong.cost) {
				if (oRong.cost.length) {
					for (const item in oRong.cost) {
						var tCost = oRong.cost[item]
						this.priceIcon.setType(tCost.id)
						this.priceIcon.setPrice(tCost.count)
					}

				}
			}
		}


	}

	onBtnClick() {
		var tArr = [];
		var tArrHandle = { handle: 1 };
		if (this.data && this.data.handle) {
			tArrHandle.handle = this.data.handle;
			tArr.push(tArrHandle)
			UserEquip.ins().sendSmeltEquip(tArr)
		}
	}
}