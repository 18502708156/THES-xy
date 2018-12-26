var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var KaiFuJiJieShopPanel = (function (_super) {
    __extends(KaiFuJiJieShopPanel, _super);
    function KaiFuJiJieShopPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuJiJieShopPanelSkin";
        return _this;
    }
    KaiFuJiJieShopPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = KaiFuJiJieShopItem;
        this.list.dataProvider = new eui.ArrayCollection;
    };
    KaiFuJiJieShopPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent);
        this.AddTimer(1000, 0, this.updateTime);
        this.UpdateContent();
        this.updateTime();
    };
    KaiFuJiJieShopPanel.prototype.updateTime = function () {
        var time = DateUtils.format_1(GameServer.dayEndTime - GameServer.serverTimeMilli);
        this.time_txt.textFlow = TextFlowMaker.generateTextFlow("\u6D3B\u52A8\u5012\u8BA1\u65F6\uFF1A|C:0x2dff42&T:" + time + "|");
    };
    KaiFuJiJieShopPanel.prototype.OnClose = function () {
        TimerManager.ins().removeAll(this);
    };
    KaiFuJiJieShopPanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        var type = this.jijieType;
        var arrlist = this.getShopList();
        var weight = function (data) {
            var buyNum = GameGlobal.ActivityKaiFuModel.advancedInfo.getBuyNum(data.cfg.shopid);
            if (data.cfg.type.type != 2 && data.cfg.type.value <= buyNum) {
                return data.cfg.shopid + 1000;
            }
            if (GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(data.cfg.value.type) >= data.cfg.value.value) {
                return data.cfg.shopid - 1000;
            }
            return data.cfg.shopid;
        };
        arrlist.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider.replaceAll(arrlist);
    };
    KaiFuJiJieShopPanel.prototype.getShopList = function () {
        var type = this.jijieType;
        var config = GameGlobal.Config.ProgressCrazyShopConfig;
        var arr = [];
        var obj = config[type];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var cfgObj = obj[key];
                var o = {};
                o.type = type;
                o.cfg = cfgObj;
                arr.push(o);
            }
        }
        return arr;
    };
    KaiFuJiJieShopPanel.prototype._OnClick = function (e) {
    };
    return KaiFuJiJieShopPanel;
}(BaseView));
__reflect(KaiFuJiJieShopPanel.prototype, "KaiFuJiJieShopPanel", ["ICommonWindow"]);
var KaiFuJiJieShopItem = (function (_super) {
    __extends(KaiFuJiJieShopItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuJiJieShopItem() {
        return _super.call(this) || this;
    }
    KaiFuJiJieShopItem.prototype.childrenCreated = function () {
        this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    KaiFuJiJieShopItem.prototype.onClick = function (e) {
        if (this.info.text != "") {
            UserTips.InfoTip("进阶条件不满足");
            return;
        }
        if (!Checker.Money(this.data.cfg.gold.id, this.data.cfg.gold.count, true)) {
            return;
        }
        GameGlobal.ActivityKaiFuModel.Send_advanced_buy(this.data.cfg.shopid, 1, this.data.cfg.orderid);
    };
    KaiFuJiJieShopItem.prototype.dataChanged = function () {
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        this.itemIcon.isShowName(false);
        this.itemIcon.data = cfgObj.itemid;
        this.itemIcon.setCount(cfgObj.count);
        var goodsCfg = GameGlobal.Config.ItemConfig[cfgObj.itemid];
        this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        this.name_txt.text = goodsCfg.name;
        var value = cfgObj.value;
        this.imgBuyEnd.visible = false;
        var buyNum = 0;
        if (GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(value.type) < value.value) {
            if (value.type == 100) {
                this.info.text = "VIP" + value.value + "解锁";
            }
            else {
                this.info.text = ActivityConst.JiJieTypeName(value.type) + "达到" + value.value + "阶解锁";
            }
        }
        else {
            this.info.text = "";
            buyNum = GameGlobal.ActivityKaiFuModel.advancedInfo.getBuyNum(cfgObj.shopid);
            if (cfgObj.type.type != 2 && cfgObj.type.value <= buyNum) {
                this.imgBuyEnd.visible = true;
            }
        }
        if (cfgObj.type.type == 2) {
            //不限购
            this.times_txt.text = "";
        }
        else {
            this.times_txt.text = "限购(" + buyNum + "/" + cfgObj.type.value + ")";
        }
        this.buy.visible = (this.imgBuyEnd.visible || this.info.text != "") ? false : true;
        this.priceIcon1.text = CommonUtils.overLength(cfgObj.showgold);
        this.priceIcon2.text = CommonUtils.overLength(cfgObj.gold.count);
        this.priceIcon1.type = this.priceIcon2.type = cfgObj.gold.id;
        this.mark.visible = cfgObj.mark;
        if (this.mark.visible) {
            this.disPirce_txt.text = cfgObj.mark + "折";
        }
    };
    return KaiFuJiJieShopItem;
}(eui.ItemRenderer));
__reflect(KaiFuJiJieShopItem.prototype, "KaiFuJiJieShopItem");
//# sourceMappingURL=KaiFuJiJieShopPanel.js.map