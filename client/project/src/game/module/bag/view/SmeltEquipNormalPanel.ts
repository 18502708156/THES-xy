class SmeltEquipNormalPanel extends BaseView implements ICommonWindowTitle {
	static NAME = "普通装备"

	/////////////////////////////////////////////////////////////////////////////
	// SmeltMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected itemList: eui.List;
	protected group: eui.Group;
	protected autocheck: eui.CheckBox;
	protected smeltBtn2: eui.Button;
	protected smeltBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////


	UpdateContent(): void {
		this.setItemData();
	}

	public constructor() {
		super()
	}

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.smeltBtn2,
		}
	}

	smeltEquips
	dataInfo
	mc_group: eui.Group;
	lbTips: eui.Label;
	viewIndex = 0
	childrenCreated() {


		this.smeltEquips = [];
		this.smeltEquips.length = Const.SMELT_COUNT;
		this.itemList.itemRenderer = SmeltEquipItem;
		this.dataInfo = new eui.ArrayCollection(this.smeltEquips);
		this.itemList.dataProvider = this.dataInfo;
	};
	OnOpen() {
		this.smeltBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.smeltBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.itemList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

		// this._AddItemClick()
		this._AddItemClick(this.itemList, this.onListViewClick)
		this.autocheck.addEventListener(egret.Event.CHANGE, this.chage, this)
		// this.group.visible = Deblocking.Check(DeblockingType.TYEP_01, true) //暂时没有vip功能

		this.group.visible = true

		this.observe(MessageDef.BAG_DEAL_SMELT, this.smeltComplete);
		this.observe(MessageDef.postEquipCheckList, this.setItemList);
		this.autocheck.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_BAG_RONG_LIAN)
	}

	OnClose() {
		this.smeltBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.itemList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	}

	smeltComplete() {
		var n = this.itemList.numChildren;
		while (n--) {
			(this.itemList.getChildAt(n) as SmeltEquipItem).playEff();
		}
		this.setItemData();

	}

	setItemData() {
		this.smeltEquips = this.getSmeltData();
		this.dataInfo.replaceAll(this.smeltEquips);
	}

	/**
	 * getSmeltData _type 类型,1为常规容量,2为大量容量, 件数由设置而定
	 */
	public getSmeltData(_type = 1) {
		var nType = _type || 1;
		var list1 = UserBag.ins().getOutEquips()
		let nCount = Const.SMELT_COUNT
		if (nType == 2) {
			nCount = Const.SMELT_LARGE_COUNT
		}
		if (list1.length < nCount) {
			this.creatListLength(list1, nCount);
		} else if (list1.length > nCount) {
			list1 = list1.slice(0, nCount)
		}
		return list1
	}

	//填充返回的列表
	private creatListLength(list, count) {
		if (list.length < count) {
			for (var i = 0; i < count; i++) {
				if (list[i] == undefined) {
					list[i] = null;
				}
			}
		}
	}

	setItemList(list) {
		this.dataInfo.replaceAll(list);
		this.itemList.dataProvider = this.dataInfo;
	};

	chage() {
		if (Deblocking.Check(1)) {
			FuncOpenModel.SetData(FuncOpenModel.SAVE_BAG_RONG_LIAN, this.autocheck.selected)
		}
		else {
			this.autocheck.selected = false
		}
	}


	private onListViewClick(e: eui.ItemTapEvent) {
		var pItem = e.item
		if (!pItem) {
			var smeltList = UserBag.ins().getBagSortQualityEquips(5, 0, 0);
			if (smeltList.length > 0) {
				ViewManager.ins().open(BagMakeEx);
			}
			else {
				UserTips.ins().showTips("|C:0xff0000&T:当前没有可熔炼的装备|");
			}
		}
	}


	onTap(e) {
		switch (e.currentTarget) {
			case this.smeltBtn:
				UserEquip.ins().sendSmeltEquip(this.smeltEquips);
				break;
			case this.smeltBtn2:
				UserEquip.ins().sendSmeltEquip(this.getSmeltData(2));
				break;
		}
	};
}