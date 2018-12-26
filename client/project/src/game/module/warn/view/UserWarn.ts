class UserWarn extends BaseSystem {

	static ins(): UserWarn {
		return super.ins();
	};

	setWarnLabel(str, callBackFun, callBackFun2, statu = "normal", data = null) {
		TimerManager.ins().doNext(() => {
			let win = (<WarnWin>ViewManager.ins().open(WarnWin))
			win.setWarnLabel(str, callBackFun, callBackFun2, statu, data);
		}, this)
	};

	setWarnContent(content: string | eui.Component, callBackFun: { func: Function, thisObj: any }, callBackFun2: { func: Function, thisObj: any }, statu = "normal", data = null) {
		(<WarnWin>ViewManager.ins().open(WarnWin)).setWarnContent(content, callBackFun, callBackFun2, statu, data);
	};

	setshowReward(str, callBackFun, callBackFun2, statu = "reward", data = null) {
		(<WarnWin>ViewManager.ins().open(WarnWin)).setshowReward(str, callBackFun, callBackFun2, statu, data);
	};

	setshowCheckBox(name: string, str, callBackFun, callBackFun2, statu = "checkBox", data = null) {
		if (WarnWinDate.ins().checkerHintByName(name)) {
			WarnWinDate.ins().setRecord(name, true, callBackFun);
			(<WarnWin>ViewManager.ins().open(WarnWin)).setshowCheckBox(name, str, callBackFun, callBackFun2, statu, data);
		}
	};

	setBuyGoodsWarn(id, num = 1) {
		if (id == MoneyConst.gold) {
			ViewManager.ins().open(ExchangeMoneyWin)
			return
		}

		//策划要求写死
		if (Deblocking.Check(96, true)) {
			(<ShopGoodsWarn>ViewManager.ins().open(ShopGoodsWarn)).setData(id, num);
		} else {
			let config = GameGlobal.Config.ItemConfig[id]
			if (config) {
				if (config.name) {
					UserTips.InfoTip(config.name + "不足")
				}
			} else {
				let name = MoneyConstToName[id]
				if (name) {
					UserTips.InfoTip(name + "不足")
				} else {
					UserTips.InfoTip("材料不足")
				}
			}
		}
	}

	BuyGoodsWarn(id, num = 1) {
		if (id == MoneyConst.gold) {
			ViewManager.ins().open(ExchangeMoneyWin)
			return
		}
		(<ShopGoodsWarn>ViewManager.ins().open(ShopGoodsWarn)).setData(id, num);
	}

	setGainGoodsWarn(ids) {
		(<GainGoodsWarn>ViewManager.ins().open(GainGoodsWarn)).setData(ids);
	}

	public static CheckBagCapacity(): boolean {
		if (GameGlobal.UserBag.getSurplusCount() < 20) {
			WarnWin.show("背包空间不足20，请先清理背包，以免不能获取怪物掉落物品", () => {
				ViewManager.ins().open(SmeltEquipTotalWin)
			}, this, null, null, "sure")
			return false
		}
		return true
	}
}