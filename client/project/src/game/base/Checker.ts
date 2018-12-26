class Checker {
	public static YUNBAO_FRAME = 2

	public static Level(zsLevel: number, level: number, showTip: boolean = true): boolean {
		let lv = GameLogic.ins().actorModel.level
		let zsLv = 0//UserZs.ins().lv
		if (zsLevel && zsLevel > zsLv) {
			if (showTip) {
				UserTips.ins().showTips("等级不足")
			}
			return false
		}
		if (level && level > lv) {
			if (showTip) {
				UserTips.ins().showTips("等级不足")
			}
			return false
		}
		return true
	}


	public static VipLevel(level: number, showTip: boolean = true): boolean {
		let lv = UserVip.ins().lv	
		if (level && level > lv) {
			if (showTip) {
				UserTips.ins().showTips("VIP等级不足")
			}
			return false
		}
		return true
	}

	/*
		判断货币是否足够 针对于数值表cost = {type=0, id=x, count=xx}
		type: 传入 cost.id
		value: 传入 cost.count
		cbFunc: 回调方法
	*/
	public static Money(type: MoneyConst, value, showTip: boolean | number = true, showTitle =  null, cbFunc?: Function) {
		let curNum = GameGlobal.actorModel.GetNum(type)

		if (curNum >= value)
		{
			if (cbFunc)
			{
				cbFunc()
			}
			return true
		}

		if (!showTip)
		{
			return false
		}

		let tipText = ""
		switch(type) {
			case MoneyConst.gold:
				tipText = "银两不足"
				ViewManager.ins().open(ExchangeMoneyWin)
			break
			case MoneyConst.yuanbao:
				 tipText = "元宝不足"
			break
			case MoneyConst.byb:
				tipText = "绑元不足"
			break
			case MoneyConst.GuildContrib:
				tipText = "帮贡不足"
			break
		}

		if (showTip == Checker.YUNBAO_FRAME && type == MoneyConst.yuanbao)
		{
			Checker.YunbaoTip(showTitle)
		}
		else
		{
			UserTips.ins().showTips(tipText)
		}
		
		return false
	}

	/**
	*	costData: {type=0, id=3, count=100, subid?=2, subcount?=50}
	*   与上面Money方法相类似，主要用于处理绑元不足，可使用元宝抵用的情况
	*	cbFunc：传入回调 若cbFunc有值，则当绑元不足时，会弹出提示确认框，点击确认按钮则自动调用cbFunc
	*	warnTip: 弹出绑元不足时提示框中的文本 默认为"绑元不足，是否花费【xx元宝】？"
	*/
	public static Currency(costData, showTip: boolean | number, showTitle , cbFunc: Function, warnTip?: string): boolean {
		if (costData.type != 0)
			return

		if (!costData.subid)
			return Checker.Money(costData.id, costData.count, showTip, showTitle, cbFunc)

		if (Checker.Money(costData.id, costData.count, false, null, cbFunc))
			return true
		
		if (cbFunc)
		{
			WarnWin.show(warnTip || `绑元不足，是否花费【${costData.subcount}元宝】？`, () => {
				Checker.Money(costData.subid, costData.subcount, showTip, showTitle, cbFunc)
			}, this)
		}
		
		return false
	}

	public static YunbaoTip(showTitle: string = null) {
		let chargeTip = ""
		let state = 3 //Recharge.ins().ToDayRechargeState()
		if (state != 0) {
			chargeTip = "\n现在充值可获得：", Color.Blue
			if (state == 1) {
				chargeTip += StringUtils.addColor("首冲任意金额，五倍返元宝", Color.Yellow)
			} else if (state == 2) {
				chargeTip += StringUtils.addColor("每日首充惊喜大礼包", Color.Yellow)
			} else {
				chargeTip = ""
			}
		}
		let title = showTitle || "所需元宝不足，是否前往充值？"
		WarnWin.show(TextFlowMaker.generateTextFlow(title + chargeTip), () => {
			RechargeWin.Open()
		}, this, null, null, "sure", {
			btnName: state == 1 ? "首充" : "充值",
			title: "温馨提示"
		})
	}

	public static Data(data: {type: number, id: number, count: number}, showTip: boolean = true): boolean {
		if (!data) {
			return false
		}
		if (data.type == 0) {
			return this.Money(data.id, data.count, showTip)
		} else {
			if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
				return true
			} else {
				if (showTip) {
					UserTips.InfoTip(GameGlobal.Config.ItemConfig[data.id].name + "数量不足")
				}
			}
		}
		
	}

	public static Datas(datas: {type: number, id: number, count: number}[], showTip: boolean = true): boolean {
		if (!datas) {
			return false
		}
		for (let data of datas) {
			if (!this.Data(data, showTip)) {
				return false
			}
		}
		return true
	}

	public static CheckItem(itemId: number, value: number, autoBuy: boolean, price: number = null, type = ShopController.EN_SHOP_BANGYUAN): boolean {
		let check = true
		// let price = GameGlobal.actorModel.yb
		if (price == null) {
			price = GameGlobal.actorModel.yb
		}

		let count = GameGlobal.UserBag.GetCount(itemId)
		if (count >= value) {
			return true
		}
		if (autoBuy) {
			let needCount = value - count
			let needYb = ItemStoreConfig.GetPrice(itemId, type) * needCount
			if (price >= needYb) {
				return true
			}
		}
		UserWarn.ins().setBuyGoodsWarn(itemId)
		return false
	}

	public static CheckDatas(datas: {type: number, id: number, count: number}[], autoBuy: boolean,bOpenBuy = true): boolean {
		if (!datas || !datas.length) {
			return false
		}
		let check = true
		let price = GameGlobal.actorModel.yb
		for (let data of datas) {
			if (data.type == 0) {
				if (!this.Money(data.id, data.count)) {
					check = false
					break
				}
			} else {
				let count = GameGlobal.UserBag.GetCount(data.id)
				if (count < data.count) {
					if (autoBuy) {
						let needCount = data.count - count
						let needYb = ItemStoreConfig.GetPrice(data.id) * needCount
						price -= needYb
						if (price < 1) {
							check = false
							if(bOpenBuy)
							{
								UserWarn.ins().setBuyGoodsWarn(data.id)
							}
							break
						}
					} else {
						check = false
						if(bOpenBuy)
						{
							UserWarn.ins().setBuyGoodsWarn(data.id)
						}
					}
					break
				}
			}
		}
		if (check) {
			return true
		}
		return false
	}

	public static OpenDay(day: number, showTip = true): boolean {
		if (GameServer.serverOpenDay < day) {
			if (showTip) {
				UserTips.ErrorTip(`开服第${day}天开启`)
			}
			return false
		}
		return true
	}
}