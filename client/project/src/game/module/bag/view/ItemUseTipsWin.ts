class ItemUseTipsWin extends BaseEuiView {
	
    public static LAYER_LEVEL = LayerManager.UI_Popup

	maxNum = 0;
	numLabel
	itemIcon
	goodsId
	minBtn
	maxBtn
	sub1Btn
	add1Btn
	useBtn
	useNum
	// isBossBox
	nameLabel
	lv
	num
	description: eui.Label
	add: eui.Group
	private addHeight: number

	private group1: eui.Group
	private group2: eui.Group
	private dialogMask: eui.Component

	btnLessTen: eui.Button
	btnAddTen: eui.Button

	public constructor() {
		super();


	}


	initUI() {
		super.initUI()
		this.skinName = "ItemUseTipsSkin";
		this.numLabel.restrict = "0-9";
		// this.itemIcon.imgJob.visible = false;
		this.addHeight = this.add.height
	};
	OnOpen(...param: any[]) {
		var type = param[0];
		var id = param[1];
		this.goodsId = id;

		this.AddClick(this.dialogMask, this.CloseSelf)
		// this.colorCanvas.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
		this.minBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.maxBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);

		this.btnLessTen.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.btnAddTen.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);		

		this.sub1Btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.add1Btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.useBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.observe(MessageDef.postUseItemSuccess, this.useSuccess);
		this.numLabel.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		this.useNum = 1;
		this.numLabel.text = this.useNum + "";
		this.setData(type, id);
		// this.isBossBox = this.bossBoxIdList.lastIndexOf(id) != -1;
	};
	OnClose() {
		// this.colorCanvas.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
		this.minBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.maxBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);

		this.btnLessTen.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.btnAddTen.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);

		this.sub1Btn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.add1Btn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.useBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.numLabel.removeEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		MessageCenter.ins().removeAll(this);
	};

	onTxtChange(e) {
		var num = Number(this.numLabel.text);
		if (num > this.maxNum) {
			num = this.maxNum;
		}
		this.useNum = num;
		this.numLabel.text = this.useNum + "";
	};
	onTap(e) {
		switch (e.target) {
			case this.minBtn:
				this.useNum--;
				if (this.useNum <= 0) {
					this.useNum = 1;
				}
				break;
			case this.maxBtn:
				this.useNum += 1;
				if (this.useNum > this.maxNum) {
					this.useNum = this.maxNum;
				}
				break;

			case this.btnLessTen:
				// this.useNum -=  10 ;
				// if (this.useNum <= 0) {
				// 	this.useNum = 1;
				// }
				this.useNum  = 1;
				break;
			case this.btnAddTen:
				// this.useNum+= 10;
				// if (this.useNum > this.maxNum) {
				// 	this.useNum = this.maxNum;
				// }
				this.useNum = this.maxNum;
				break;				
			case this.sub1Btn:
				this.useNum--;
				if (this.useNum <= 0) {
					this.useNum = 1;
				}
				break;
			case this.add1Btn:
				this.useNum++;
				if (this.useNum > this.maxNum) {
					this.useNum = this.maxNum;
				}
				break;
			case this.useBtn:
				// if (this.isBossBox) {
				//     ViewManager.ins().close(ItemUseTipsWin);
				//     ViewManager.ins().open(RandBossWin, this.goodsId);
				//     return;
				// }
				if (UserBag.ins().sendUseItem(this.goodsId, this.useNum)) {
					ViewManager.ins().close(ItemUseTipsWin);
				}
				break;
		}
		this.numLabel.text = this.useNum + "";
	};
	useSuccess() {
		var data = UserBag.ins().getBagItemById(this.goodsId);
		if (!data) {
			ViewManager.ins().close(ItemUseTipsWin);
		}
		else {
			this.setData(0, this.goodsId);
			this.onTxtChange(null);
		}
	};
	setData(type, id) {
		var numStr = "";
		var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
		this.maxNum = data.count;
		// if (this.maxNum > 100) {
		// 	this.maxNum = 100;
		// }
		numStr = data.count + "";


		var config = GlobalConfig.ins().ItemConfig[id];
		this.nameLabel.text = config.name;
		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[config.quality];
		this.itemIcon.setData(config);
		this.lv.text = "等级：" + config.level + "级";
		this.num.text = "数量：" + numStr;
		this.description.textFlow = TextFlowMaker.generateTextFlow(config.desc);
		// this.add.visible = config.useType == 1;
		// if (!this.add.visible) {
		// 	this.add.height = 0
		// } else {
		// 	this.add.height = this.addHeight
		// }
		egret.callLater(this._UpdateLayout, this)
	};

	private _UpdateLayout(): void {
		// this.commMid.height = this.group1.height + 50
	}
}