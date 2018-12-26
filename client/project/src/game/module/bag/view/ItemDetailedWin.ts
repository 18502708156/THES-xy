class ItemDetailedWin extends BaseEuiView {

	itemIcon: ItemIcon;
	nameLabel: eui.Label;
	lv: eui.Label;
	num: eui.Label;
	description: eui.Label;
	power: eui.Label;
	BG: any;
	group1: eui.Group
	group2: eui.Group

	jobLabel1: eui.Label

	private powerLabel: eui.BitmapLabel
	private lineImg: eui.Image

	public initUI() {
		super.initUI();
		this.skinName = "ItemTipsSkin";

		this.jobLabel1.visible = false
	};
	public OnOpen(...param: any[]) {
		var type = param[0];
		var id = param[1];
		var num = param[2];
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
		this.setData(type, id, num);
	};
	public OnClose() {
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
	};
	public otherClose(evt) {
		ViewManager.ins().close(this);
	};
	public setData(type, id, num) {
		var numStr = "";
		if (num == undefined) {
			var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
			if (data && data.count) {
				numStr = data.count + ""
			}
		} else {
			numStr = num + "";
		}
		var config = GlobalConfig.ins().ItemConfig[id];
		if (config.name) {
			this.nameLabel.text = config.name;
		}
		else {
			this.nameLabel.text = "";
		}
		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[config.quality];
		this.itemIcon.setData(config);

		if (config.level) {
			this.lv.text = "等级：" + config.level + "级";
		}
		else {
			this.lv.text = "";
		}

		if (config.type == ItemType.DESTINY) {
			let str = config.desc + "\n"
			let attrConfig = GameGlobal.Config.DestinyAttrsConfig[id]
			if (attrConfig) {
				str += AttributeData.getAttStr(attrConfig.attars, 1, 1, "+", false, "00fc06&", "        ")	
			}
			this.description.textFlow = TextFlowMaker.generateTextFlow(str);
		} else {
			this.description.textFlow = TextFlowMaker.generateTextFlow(config.desc);
		}
		if (config.type == 2) {
			// var sID = MiJiSkillConfig.getSkillIDByItem(config.id);
			// this.power.text = "评分：" + GlobalConfig.ins().MiJiSkillConfig[sID].power;
		}
		else
			this.power.text = "";

		this.num.text = "数量：" + numStr;
		if (this.power.text == "") {
			this.powerLabel.visible = false
			this.powerLabel.y = 0
			this.lineImg.y = 140
		}

		egret.callLater(this.LaterUpdate, this)
	};

	private LaterUpdate(): void {
		this.group1.height = this.group2.height + 37
	}

}

ItemDetailedWin.LAYER_LEVEL =  LayerManager.UI_Popup;