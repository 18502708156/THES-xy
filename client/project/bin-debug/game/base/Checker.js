var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Checker = (function () {
    function Checker() {
    }
    Checker.Level = function (zsLevel, level, showTip) {
        if (showTip === void 0) { showTip = true; }
        var lv = GameLogic.ins().actorModel.level;
        var zsLv = 0; //UserZs.ins().lv
        if (zsLevel && zsLevel > zsLv) {
            if (showTip) {
                UserTips.ins().showTips("等级不足");
            }
            return false;
        }
        if (level && level > lv) {
            if (showTip) {
                UserTips.ins().showTips("等级不足");
            }
            return false;
        }
        return true;
    };
    Checker.VipLevel = function (level, showTip) {
        if (showTip === void 0) { showTip = true; }
        var lv = UserVip.ins().lv;
        if (level && level > lv) {
            if (showTip) {
                UserTips.ins().showTips("VIP等级不足");
            }
            return false;
        }
        return true;
    };
    /*
        判断货币是否足够 针对于数值表cost = {type=0, id=x, count=xx}
        type: 传入 cost.id
        value: 传入 cost.count
        cbFunc: 回调方法
    */
    Checker.Money = function (type, value, showTip, showTitle, cbFunc) {
        if (showTip === void 0) { showTip = true; }
        if (showTitle === void 0) { showTitle = null; }
        var curNum = GameGlobal.actorModel.GetNum(type);
        if (curNum >= value) {
            if (cbFunc) {
                cbFunc();
            }
            return true;
        }
        if (!showTip) {
            return false;
        }
        var tipText = "";
        switch (type) {
            case MoneyConst.gold:
                tipText = "银两不足";
                ViewManager.ins().open(ExchangeMoneyWin);
                break;
            case MoneyConst.yuanbao:
                tipText = "元宝不足";
                break;
            case MoneyConst.byb:
                tipText = "绑元不足";
                break;
            case MoneyConst.GuildContrib:
                tipText = "帮贡不足";
                break;
        }
        if (showTip == Checker.YUNBAO_FRAME && type == MoneyConst.yuanbao) {
            Checker.YunbaoTip(showTitle);
        }
        else {
            UserTips.ins().showTips(tipText);
        }
        return false;
    };
    /**
    *	costData: {type=0, id=3, count=100, subid?=2, subcount?=50}
    *   与上面Money方法相类似，主要用于处理绑元不足，可使用元宝抵用的情况
    *	cbFunc：传入回调 若cbFunc有值，则当绑元不足时，会弹出提示确认框，点击确认按钮则自动调用cbFunc
    *	warnTip: 弹出绑元不足时提示框中的文本 默认为"绑元不足，是否花费【xx元宝】？"
    */
    Checker.Currency = function (costData, showTip, showTitle, cbFunc, warnTip) {
        if (costData.type != 0)
            return;
        if (!costData.subid)
            return Checker.Money(costData.id, costData.count, showTip, showTitle, cbFunc);
        if (Checker.Money(costData.id, costData.count, false, null, cbFunc))
            return true;
        if (cbFunc) {
            WarnWin.show(warnTip || "\u7ED1\u5143\u4E0D\u8DB3\uFF0C\u662F\u5426\u82B1\u8D39\u3010" + costData.subcount + "\u5143\u5B9D\u3011\uFF1F", function () {
                Checker.Money(costData.subid, costData.subcount, showTip, showTitle, cbFunc);
            }, this);
        }
        return false;
    };
    Checker.YunbaoTip = function (showTitle) {
        if (showTitle === void 0) { showTitle = null; }
        var chargeTip = "";
        var state = 3; //Recharge.ins().ToDayRechargeState()
        if (state != 0) {
            chargeTip = "\n现在充值可获得：", Color.Blue;
            if (state == 1) {
                chargeTip += StringUtils.addColor("首冲任意金额，五倍返元宝", Color.Yellow);
            }
            else if (state == 2) {
                chargeTip += StringUtils.addColor("每日首充惊喜大礼包", Color.Yellow);
            }
            else {
                chargeTip = "";
            }
        }
        var title = showTitle || "所需元宝不足，是否前往充值？";
        WarnWin.show(TextFlowMaker.generateTextFlow(title + chargeTip), function () {
            RechargeWin.Open();
        }, this, null, null, "sure", {
            btnName: state == 1 ? "首充" : "充值",
            title: "温馨提示"
        });
    };
    Checker.Data = function (data, showTip) {
        if (showTip === void 0) { showTip = true; }
        if (!data) {
            return false;
        }
        if (data.type == 0) {
            return this.Money(data.id, data.count, showTip);
        }
        else {
            if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
                return true;
            }
            else {
                if (showTip) {
                    UserTips.InfoTip(GameGlobal.Config.ItemConfig[data.id].name + "数量不足");
                }
            }
        }
    };
    Checker.Datas = function (datas, showTip) {
        if (showTip === void 0) { showTip = true; }
        if (!datas) {
            return false;
        }
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            if (!this.Data(data, showTip)) {
                return false;
            }
        }
        return true;
    };
    Checker.CheckItem = function (itemId, value, autoBuy, price, type) {
        if (price === void 0) { price = null; }
        if (type === void 0) { type = ShopController.EN_SHOP_BANGYUAN; }
        var check = true;
        // let price = GameGlobal.actorModel.yb
        if (price == null) {
            price = GameGlobal.actorModel.yb;
        }
        var count = GameGlobal.UserBag.GetCount(itemId);
        if (count >= value) {
            return true;
        }
        if (autoBuy) {
            var needCount = value - count;
            var needYb = ItemStoreConfig.GetPrice(itemId, type) * needCount;
            if (price >= needYb) {
                return true;
            }
        }
        UserWarn.ins().setBuyGoodsWarn(itemId);
        return false;
    };
    Checker.CheckDatas = function (datas, autoBuy, bOpenBuy) {
        if (bOpenBuy === void 0) { bOpenBuy = true; }
        if (!datas || !datas.length) {
            return false;
        }
        var check = true;
        var price = GameGlobal.actorModel.yb;
        for (var _i = 0, datas_2 = datas; _i < datas_2.length; _i++) {
            var data = datas_2[_i];
            if (data.type == 0) {
                if (!this.Money(data.id, data.count)) {
                    check = false;
                    break;
                }
            }
            else {
                var count = GameGlobal.UserBag.GetCount(data.id);
                if (count < data.count) {
                    if (autoBuy) {
                        var needCount = data.count - count;
                        var needYb = ItemStoreConfig.GetPrice(data.id) * needCount;
                        price -= needYb;
                        if (price < 1) {
                            check = false;
                            if (bOpenBuy) {
                                UserWarn.ins().setBuyGoodsWarn(data.id);
                            }
                            break;
                        }
                    }
                    else {
                        check = false;
                        if (bOpenBuy) {
                            UserWarn.ins().setBuyGoodsWarn(data.id);
                        }
                    }
                    break;
                }
            }
        }
        if (check) {
            return true;
        }
        return false;
    };
    Checker.OpenDay = function (day, showTip) {
        if (showTip === void 0) { showTip = true; }
        if (GameServer.serverOpenDay < day) {
            if (showTip) {
                UserTips.ErrorTip("\u5F00\u670D\u7B2C" + day + "\u5929\u5F00\u542F");
            }
            return false;
        }
        return true;
    };
    Checker.YUNBAO_FRAME = 2;
    return Checker;
}());
__reflect(Checker.prototype, "Checker");
//# sourceMappingURL=Checker.js.map