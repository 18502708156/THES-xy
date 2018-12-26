/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 21:51
 * @meaning: 常规商店详情
 * 
 **/


class ShopEquipLayer extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "装备商店"


	protected account: eui.Label;
	protected goPrice: eui.Label;
	protected redPoint: eui.Image;
	private priceIcon: PriceIcon;
	private listView: eui.List;
	private listTitle: eui.List;

	nSelect222 = 0;

	private tTitleName = [];//商店标题名称

	tShopData;//商店数据
	tItemData = {};//商品数据

	private nSelect = 1//默认选中第一个



	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ShopEquipSkin"
		this.listView.itemRenderer = ShopEquipItem;
		this.listTitle.itemRenderer = ShopEqTitle;
		this.listTitle.selectedIndex = 0;
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setMoney)//
		this.observe(MessageDef.POWER_CHANGE, this.setMoney)//
		this.observe(MessageDef.GUILD_CONTRIB_UPDATE, this.setMoney)//
		this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent)//商店购买变化
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateRedPoint)

		this._AddItemClick(this.listTitle, this.onListClick)
		// this._AddItemClick(this.listView, this.onListViewClick)
		this._AddClick(this.goPrice, this.onClick)

		UIHelper.SetLinkStyleLabel(this.goPrice)


		this.setMoney()
		this.UpdateContent()
		this.UpdateRedPoint()

		let type = param[0]
		if (type) {
			let i = 0
			for (let data of this.tTitleName) {
				if (data.nSelect == type) {
					break
				}
				++i
			}
			this.OnSelectList(type)
			this.listTitle.selectedIndex = i
		}
	}

	private UpdateRedPoint() {
		this.redPoint.visible = GameGlobal.UserBag.HasOrangeEquip()
	}


	public setData() {

		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_EQUIP)


		//重置
		this.tItemData = {}
		this.tTitleName = []

		for (let ind in this.tShopData.shop) {
			if (!this.tItemData[this.tShopData.shop[ind].tabnum]) {
				this.tItemData[this.tShopData.shop[ind].tabnum] = []
			}

			this.tItemData[this.tShopData.shop[ind].tabnum].push(this.tShopData.shop[ind]);//根据标签插入
			let itemConfig = GlobalConfig.ins().ItemConfig[this.tShopData.shop[ind].id];
			if (this.tTitleName.length > 0) {
				for (let i = 0; i < this.tTitleName.length; i++) {
					if (this.tTitleName[i].nSelect === this.tShopData.shop[ind].tabnum) {
						this.tTitleName[i].maxLv = itemConfig.level;
						break;
					}
					if (i == this.tTitleName.length - 1)
						this.tTitleName.push(this.getShopTitleName(this.tShopData.shop[ind].tabnum, itemConfig.level))
				}
			}
			else
				this.tTitleName.push(this.getShopTitleName(this.tShopData.shop[ind].tabnum, itemConfig.level))
		}

		let role = SubRoles.ins().GetRoleData();
		var len = role.getEquipLen();
		let reachQualityCounter = 0;
		let equipMinLv = -1;
		let itemConfig = null;
		for (var i = 0; i < len; i++) {
			var element = role.getEquipByIndex(i);
			if (element)
				itemConfig = element.item.itemConfig;
			if (itemConfig) {
				if (4 <= itemConfig.quality)
					reachQualityCounter++;
				if (equipMinLv > itemConfig.level || equipMinLv < 0)
					equipMinLv = itemConfig.level;
			}
		}
		if (reachQualityCounter >= len) {
			for (let i = 0; i < this.tTitleName.length;) {
				if (this.tTitleName[i].maxLv <= equipMinLv && this.tTitleName[i].nSelect != 1) {
					this.tTitleName.splice(i, 1);
				}
				else
					i++
			}
		}
	}
	
	// _type为 (tabnum字段) 分页标签
	public getShopTitleName(_type, maxLv) {
		var nameObj = {};

		var strName = ""
		if (_type === 1) {
			strName = "物品商店"
		}
		else {
			strName = _type + "级金装"
		}
		nameObj = { nSelect: _type, strName: strName, maxLv: maxLv };
		return nameObj
	}

	UpdateContent() {
		this.setData()
		var tListData = this.tItemData[this.nSelect];
		ShopController.ins().sortLimitTime(tListData);
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(tListData);
		(this.listTitle.dataProvider as eui.ArrayCollection).replaceAll(this.tTitleName);

		var strAccount = ""
		let strNums = GameGlobal.UserFb.lltModel.layer + ""
		if (typeof (this.tShopData.instructions) == "string") {
			strAccount = this.tShopData.instructions.replace("%s", strNums)//这里系统并没有参数,所以后期需要补充
		}

		this.account.text = strAccount
	}

	public setMoney() {
		this.setData()
		if (this.tShopData.moneytype) {
			this.priceIcon.setType(this.tShopData.moneytype)
			this.priceIcon.price = CommonUtils.overLength(ShopController.ins().getBuyItemNums(this.tShopData.moneytype))
		}

	}


	private onListClick(e: eui.ItemTapEvent) {
		let type = e.item.nSelect
		this.OnSelectList(type)
	}

	private OnSelectList(type: number) {
		this.nSelect = type;
		ShopController.ins().sortLimitTime(this.tItemData[type])
		this.listView.dataProvider = new eui.ArrayCollection(this.tItemData[type]);
	}


	private onListViewClick(e: eui.ItemTapEvent) {
		// var pItem = e.item
		// if(pItem&&ShopController.ins().enoughBuy(pItem))
		// {
		// 	ViewManager.ins().open(BuyWin,pItem)
		// }
	}


	/**点击 */
	onClick(e) {
		switch (e.currentTarget) {
			case this.goPrice:
				//跳转
				ViewManager.ins().open(ShopResolveLayer);
				break;
		}
	}
}