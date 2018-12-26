class MoneyTreePanel extends BaseView {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// MoneyTreeSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	protected goUpBtn: eui.Button
	protected depictLabel1: eui.Label
	protected mc_img: eui.Image
	protected bar: eui.ProgressBar
	protected image1: eui.Image
	protected image3: eui.Image
	protected image2: eui.Image
	protected playNum: eui.Label
	protected add: eui.Label
	protected cost: PriceIcon
	protected depictLabel2: eui.Image
	protected getNum: eui.BitmapLabel
	protected addPoint: eui.BitmapLabel
	////////////////////////////////////////////////////////////////////////////////////////////////////

	posY
	mc1
	mc2
	mc3
	// expMc: MovieClip
	rect: egret.Rectangle
	baojiMc
	movieExp

	costNum

	// descBtn


	public constructor() {
		super()

		this.posY = 690
		let posY2 = 50
		this.skinName = "MoneyTreeSkin"
		this.mc1 = new MovieClip
		this.mc1.x = 120
		this.mc1.y = posY2
		this.mc2 = new MovieClip
		this.mc2.x = 280
		this.mc2.y = posY2
		this.mc3 = new MovieClip
		this.mc3.x = 560
		this.mc3.y = posY2
		// this.expMc = new MovieClip
		// this.expMc.x = 87
		// this.expMc.y = this.posY
		// this.expMc.blendMode = egret.BlendMode.ADD
		this.rect = new egret.Rectangle(-35, 0, 70, 60)
		// this.addChildAt(this.expMc, this.getChildIndex(this.mc_img) + 1)
		this.baojiMc = new MovieClip
		this.baojiMc.x = 207
		this.baojiMc.y = 270
		this.movieExp = new MovieClip

	}

	OnOpen() {
		this.observe(MessageDef.MONEY_INFO_CHANGE, this.refushInfo)
		this.AddClick(this.goUpBtn, this.onTap)
		this.AddClick(this.image1, this.onTap)
		this.AddClick(this.image2, this.onTap)
		this.AddClick(this.image3, this.onTap)
		this.AddClick(this.depictLabel2, this.onTap)
		this.refushInfo(!0)
	}

	OnClose() {
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.goUpBtn:
				if (MoneyTreeModel.ins().playNum >= MoneyTreeModel.ins().cruMaxNum) return void (GameGlobal.actorModel.vipLv >= 10 ? UserTips.ins().showTips("|C:0xff0000&T:今日次数已用完|") : UserTips.ins().showTips("|C:0xff0000&T:提高vip等级，获得更多次数|"));
				if (GameGlobal.actorModel.yb >= (this.costNum))
					return void MoneyTreeModel.ins().sendPlayYaoYao();
				UserTips.ins().showTips("|C:0xff0000&T:元宝不足|");
				break;
			case this.image1:
				ViewManager.ins().open(MoneyTreeBoxWin, 1);
				break;
			case this.image2:
				ViewManager.ins().open(MoneyTreeBoxWin, 2);
				break;
			case this.image3:
				ViewManager.ins().open(MoneyTreeBoxWin, 3);
				break;
			case this.depictLabel2:
				ViewManager.ins().open(VipMainPanel);
				break;
			// case this.descBtn:
			// App.ViewManager.open(ViewConst.ZsBossRuleSpeak, 5)
		}
	}


	refushInfo(e = false, t = 0) {

		var model = MoneyTreeModel.ins()
		let costConfig = model.getIndexCost()
		let infoConfig = model.getNowCoefficientinfo()
		let infoConfigData = model.getNowCoefficientinfo(1);

		//增加一次免费摇钱次数(由配表控制)
		let costStr = costConfig.yuanbao + ""
		if (costConfig.yuanbao == 0) {
			costStr = "本次免费"
			// this.cost.iconImg.visible = false
		}
		else {
			// this.cost.iconImg.visible = true
			let costStr = costConfig.yuanbao + ""
		}

		// this.bar.maximum = model.maxNum
		this.bar.maximum = 55
		if (model.playNum == model.maxNum) {
			this.depictLabel1.visible = !1, this.playNum.visible = !1, this.cost.visible = !1, this.getNum.text = "今日次数\n已全部用完"
		} else {
			this.depictLabel1.visible = !0, this.playNum.visible = !0, this.cost.visible = !0, this.playNum.text = "（今日使用：" + model.playNum + "/" + model.cruMaxNum + "）"
			this.costNum = costConfig.yuanbao, this.cost.setText(costStr)
			// this.getNum.text = "立即获得\n" + CommonUtils.overLength(Math.floor(costConfig.gold * infoConfig.rate / 100)) + "(+" + (infoConfig.rate - 100) + "%)金币";
			this.getNum.text = "立即获得\n" + CommonUtils.overLength(Math.floor(costConfig.gold * infoConfig.rate / 100)) + "金币";
		}
		this.add.text = "加成：" + (infoConfig.rate - 100) + "%"
		this.bar.value = model.playNum
		e || this.moveExpMc();
		var s = 0;
		null == infoConfigData
			? (this.addPoint.text = "已满级", this.mc_img.height = 76)
			: (this.addPoint.text = model.exp + "/" + infoConfigData.needExp, s = 60 * (.5 - model.exp / infoConfigData.needExp), this.mc_img.height = (76 / infoConfigData.needExp) * model.exp)
		this.rect.y = s
		// this.expMc.mask = this.rect
		// this.expMc.scrollRect = new egret.Rectangle(-35, 5, 70, 60)
		this.refushBoxInfo()
		t > 1 && (this.baojiMc.loadFile(ResDataPath.GetUIEffePath("moneytreecrit"), !0, 1), this.addChild(this.baojiMc))
	}

	moveExpMc() {
		this.movieExp.x = 189, this.movieExp.y = 257, this.movieExp.loadFile(ResDataPath.GetUIEffePath("moneytreeexp"), !0, 1), this.addChild(this.movieExp);
		var e = egret.Tween.get(this.movieExp);
		e.to({
			y: 140,
			x: 48
		}, 420)
	}

	refushBoxInfo() {
		var moneyTree = MoneyTreeModel.ins();
		// this.image_1.visible = moneyTree.getOrderByIndex(0) >= 1, this.image_2.visible = moneyTree.getOrderByIndex(1) >= 1, this.image_3.visible = moneyTree.getOrderByIndex(2) >= 1;
		for (var t = 1; 4 > t; t++) {
			var i = this["mc" + t];
			moneyTree.checkBoxIsCanget(t) ? this.playEffect(i) : i.parent && DisplayUtils.removeFromParent(i)
		}
	}

	playEffect(e) {
		e.loadFile(ResDataPath.GetUIEffePath("taskBox"), !0, 100), this.addChild(e)
	}
}