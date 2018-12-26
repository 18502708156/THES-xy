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
var KaiFuQiTianShopPanel = (function (_super) {
    __extends(KaiFuQiTianShopPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuQiTianShopPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuQiTianShopPanelSkin";
        return _this;
    }
    KaiFuQiTianShopPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = QiTianShopItem;
    };
    KaiFuQiTianShopPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
        this.UpdateContent();
    };
    KaiFuQiTianShopPanel.prototype.OnClose = function () {
    };
    KaiFuQiTianShopPanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        var arrlist = this.getShopList();
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
    };
    KaiFuQiTianShopPanel.RedPoint = function () {
        return false;
    };
    KaiFuQiTianShopPanel.prototype.getShopList = function () {
        var arr = ActivityConst.GetQiTianActivityIds(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY, 2);
        return arr;
    };
    KaiFuQiTianShopPanel.prototype._OnClick = function (e) {
    };
    return KaiFuQiTianShopPanel;
}(BaseEuiView));
__reflect(KaiFuQiTianShopPanel.prototype, "KaiFuQiTianShopPanel", ["ICommonWindow"]);
var QiTianShopItem = (function (_super) {
    __extends(QiTianShopItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function QiTianShopItem() {
        return _super.call(this) || this;
    }
    QiTianShopItem.prototype.childrenCreated = function () {
        this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    QiTianShopItem.prototype.dataChanged = function () {
        var cfgObj = ActivityConst.GetCfgObjByValue(this.data);
        if (cfgObj == null)
            return;
        this.itemIcon.setItemAward(1, cfgObj.itemid, cfgObj.count);
        //let goodsCfg = GameGlobal.Config.ItemConfig[cfgObj.itemid];
        // this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        // this.name_txt.text = goodsCfg.name;
        if (KaiFuQiTianActivityPanel.OPEN_SHOW_DAY > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7) {
            this.tip2.text = "明日开启";
            this.imgBuyEnd.visible = false;
            this.buy.visible = false;
            //return 
        }
        else {
            var value = cfgObj.value;
            this.imgBuyEnd.visible = false;
            this.tip2.text = "";
            var activityType2Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.data.id);
            if (activityType2Data) {
                var buyNum = activityType2Data.buyData[cfgObj.index - 1];
                if (cfgObj.type.type != 2 && cfgObj.type.value <= buyNum) {
                    this.imgBuyEnd.visible = true;
                }
            }
            this.buy.visible = !this.imgBuyEnd.visible;
            //this.priceIcon1.text = cfgObj.showgold;
            //this.priceIcon2.text = cfgObj.gold.count;
            if (this.buy.visible && KaiFuQiTianActivityPanel.OPEN_SHOW_DAY < GameServer.serverOpenDay) {
                this.buy.visible = false;
                this.tip2.text = "已过期";
            }
            else {
                this.tip2.text = "";
            }
        }
        this.priceIcon1.text = cfgObj.showgold;
        this.priceIcon2.text = cfgObj.gold.count;
    };
    QiTianShopItem.prototype.onClick = function (e) {
        // if(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7)
        // {
        //     UserTips.ins().showTips("明日开放购买")
        //     return;
        // }
        var cfgObj = ActivityConst.GetCfgObjByValue(this.data);
        if (!Checker.Money(cfgObj.gold.id, cfgObj.gold.count, true)) {
            return;
        }
        GameGlobal.ActivityKaiFuModel.sendReward(this.data.id, cfgObj.index);
    };
    return QiTianShopItem;
}(eui.ItemRenderer));
__reflect(QiTianShopItem.prototype, "QiTianShopItem");
//# sourceMappingURL=KaiFuQiTianShopPanel.js.map