class SmeltSelectWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	public constructor() {
		super()
	}

	itemList: eui.List
	itemScroller
	checkList
	len
	// closeBtn
	// closeBtn0
	sureBtn
	countLabel
	
	private commonDialog: CommonDialog

	initUI() {
		super.initUI()
		this.skinName = "SmeltSelectSkin";
		this.itemList.itemRenderer = SmeltSelectItem;
		this.itemScroller.viewport = this.itemList;
		this.checkList = [];
	};
	OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.len = param[1];
		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
		this.itemList.dataProvider = new eui.ArrayCollection(param[0]);
		this.setSmeltEquipList(param[2]);
	};
	OnClose() {
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
		this.foolChecklist();
		MessageCenter.ins().removeAll(this);
		GameGlobal.MessageCenter.dispatch(MessageDef.postEquipCheckList, this.checkList)
	};
	onItemTap(e: eui.ItemTapEvent) {
		var item: SmeltSelectItem = e.itemRenderer as SmeltSelectItem;
		if (!item.checkBoxs.selected && this.checkList.length >= this.len)
			return;
		item.checkBoxs.selected = !item.checkBoxs.selected;
		var itemData = this.itemList.selectedItem;
		if (item.checkBoxs.selected) {
			this.checkList[this.checkList.length] = itemData;
			if (this.checkList.length == this.len) {
				GameGlobal.MessageCenter.dispatch(MessageDef.postEquipCheckList, this.checkList)
				ViewManager.ins().close(SmeltSelectWin);
				return;
			}
		}
		else {
			var index = this.checkList.indexOf(itemData);
			if (index < 0)
				return;
			this.checkList.splice(index, 1);
		}
		this.setCountLabel(this.checkList.length);
	};
	onTap(e) {
		switch (e.currentTarget) {
			// case this.closeBtn:
			// case this.closeBtn0:
			// 	ViewManager.ins().close(SmeltSelectWin);
			// 	break;
			case this.sureBtn:
				GameGlobal.MessageCenter.dispatch(MessageDef.postEquipCheckList, this.checkList)
				ViewManager.ins().close(SmeltSelectWin);
				break;
		}
	};
	setSmeltEquipList(list) {
		this.checkList = list;
		this.checkListData();
		this.setCountLabel(this.checkList.length);
		TimerManager.ins().doFrame(60, 1, () => {

			// egret.callLater(()=>{
				for (var i = 0; i < this.checkList.length; i++) {
					for (var j = 0; j < this.itemList.numElements; j++) {
						var item: SmeltSelectItem = this.itemList.getElementAt(j) as SmeltSelectItem;
						if (this.checkList[i] && this.checkList[i].handle == item.data.handle) {
							if (this.checkList.length <= this.len) {
								this.checkList[i] = item.data;
								item.checkBoxs.selected = true;
							}
							break;
						}
					}
				}
			// }, this)
		}, this);
	};
	setCountLabel(count) {
		this.countLabel.text = count + "/" + this.len;
	};
	checkListData() {
		var len = this.checkList.length;
		for (var i = len - 1; i >= 0; i--) {
			if (this.checkList[i] == null) {
				this.checkList.splice(i, 1);
			}
		}
	};
	foolChecklist() {
		var len = this.checkList.length;
		for (var i = 0; i < this.len; i++) {
			if (i >= len) {
				this.checkList.push(null);
			}
		}
	};
}
