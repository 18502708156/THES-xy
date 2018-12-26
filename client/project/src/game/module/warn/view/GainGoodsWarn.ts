class GainGoodsWarn extends BaseEuiView {
	public constructor() {
		super();
	}
	private commonDialog: CommonDialog
	private gainList:eui.List
	private titleTxt:eui.Label
	private dialogReturnBtn: eui.Button

	initUI() {
		super.initUI()
		this.skinName = "GainGoodsNewSkin";
		this.gainList.itemRenderer = GainItem;
		
	};
	OnOpen() {

		this.commonDialog.SetReturnButton(this.dialogReturnBtn)
		this.commonDialog.OnAdded(this)

	};

	OnClose() {
		this.commonDialog.OnRemoved()
		MessageCenter.ins().removeAll(this);
	};

	


	setData(ids) {
		
		this.gainList.dataProvider = new eui.ArrayCollection(ids);
		this.validateNow();
		// var len = this.gainList.dataProvider.length ;
		
		let h = (this.gainList.y - this.commonDialog.y) + this.gainList.height + 15;
		let targety = (this.height - h)/2;
		let py = this.commonDialog.y - targety;
		this.commonDialog.y -= py;
		this.commonDialog.height = h;
		this.titleTxt.y -= py;
		this.gainList.y -= py;
		this.dialogReturnBtn.y = this.commonDialog.y + this.commonDialog.height - this.dialogReturnBtn.height + 5;

		
	};
	
}

GainGoodsWarn.LAYER_LEVEL =  LayerManager.UI_Popup;

class GainItem extends eui.ItemRenderer
{
	gainList
	itemsGroup:eui.Group
	item0
	item1
	item2
	public constructor() {
		super();
		this.skinName = 'GainItemSkin'
		this.gainList.itemRenderer = GainGoodsItem;
		
	}
	onTouchList(e) {
		var item = e.target;
		if (!item) {
			return
		}
		item = item.userData
		if (item) {
			if (item[1][0]) {
				ViewManager.ins().closePartPanel()
				ViewManager.ins().close(ShopGoodsWarn);
			}
		}
	};
	dataChanged() {
		let ids 
		if(typeof this.data == 'number')
		{
			ids = [this.data];
		}else{
			ids = this.data;
		}

		
		let i:number;
		let len1:number = 3;
		for( i = 0 ; i < len1 ;i ++ )
		{
			let group:eui.Group = this['item' + i];
			if(ids.length <= i)
			{
				if(group.parent) this.itemsGroup.removeChild(group);
				continue
			}else{
				if(!group.parent)  this.itemsGroup.addChild(group);
			}
			let nameTxt:eui.Label = <eui.Label>group.getChildAt(0);
			let itemIcon = <any>group.getChildAt(1);
			// itemIcon.isShowName(false)
			let id = ids[i];
			if (id >= 101501 && id <= 151505) {
				var itemConfig = GlobalConfig.ins().ItemConfig[id];
				// itemIcon.data = (itemConfig);
				itemIcon.setData(itemConfig);
				nameTxt.text = ids.length > 1?"": ("" + itemConfig.name);
				nameTxt.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];

			} else if (id > 20000) {
				var itemConfig = GlobalConfig.ins().ItemConfig[id];
				// itemIcon.data = (itemConfig);
				itemIcon.setData(itemConfig);
				nameTxt.text = ids.length > 1?"": "" + itemConfig.name;
				nameTxt.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];

				
			} else {
				itemIcon.setItemAward(0,id,1);
			}
		}
		let id = ids[0]
		var gainConfig = GlobalConfig.ins().GainItemConfig[id];
		if (gainConfig != null) {
			let config = gainConfig.gainWay.slice(0, gainConfig.gainWay.length)
			// for (let i = 0; i < config.length; ++i) {
				// let data = config[i]
				// if (data[1][0] == ViewIndexDef.ACT_GIFT) {
					// let activityData = ActivityModel.ins().GetActivityDataByType(2)
					// if (!ActivityModel.ins().IsOpen(activityData)) {
					// 	config.splice(i, 1)
					// }
					// if(id==ViewIndexDef.EGG_BROKEN_PANEL&&!EggBroken.IsOpen()){// 判断砸金蛋活动是否关闭
                    //     config.splice(i, 1) 
					// } 
				// }
			// }
			this.gainList.dataProvider = new eui.ArrayCollection(config);
		} 
		var len = this.gainList.dataProvider.length ;
		this.gainList.height = len*110;
		
	}
	initEvent = false;
	$onAddToStage(stage: egret.Stage, nestLevel: number): void
	{
		super.$onAddToStage(stage,nestLevel);
		if(this.initEvent == false)
		{
			this.initEvent = true;
			this.gainList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchList, this);
		}
	}
	$onRemoveFromStage(): void{
		super.$onRemoveFromStage();
		if(this.initEvent == true)
		{
			this.initEvent = false;
			this.gainList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchList, this);
		}
	}

	
}