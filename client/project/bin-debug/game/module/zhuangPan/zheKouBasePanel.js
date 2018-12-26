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
var zheKouBasePanel = (function (_super) {
    __extends(zheKouBasePanel, _super);
    function zheKouBasePanel() {
        var _this = _super.call(this) || this;
        _this.activityType = ActivityKaiFuFuncType.ACT_26_DisCountShop;
        _this.skinName = "zhuangPanShopSkin";
        return _this;
    }
    zheKouBasePanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = zhekouShopItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    zheKouBasePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._activityId = param[0];
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.AddClick(this.getwayLabel, this._OnClick);
        this.UpdateContent();
        this.AddTimer(1000, 0, this.updateTime);
        this.updateTime();
    };
    Object.defineProperty(zheKouBasePanel.prototype, "activityId", {
        set: function (value) {
            this._activityId = value;
            this.UpdateContent();
        },
        enumerable: true,
        configurable: true
    });
    zheKouBasePanel.prototype.updateTime = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow(activityData.getRemindTimeString());
        }
        else {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow("活动未开启");
        }
    };
    zheKouBasePanel.prototype.getReward = function () {
        var arr = [];
        var config = ActivityConst.GetConfigByActityType(this.activityType)[this._activityId];
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        var i;
        var len = config.length;
        for (i = 0; i < len; i++) {
            var cfgObj = config[i];
            if (cfgObj.Id != this._activityId) {
                continue;
            }
            var o = {};
            o.cfg = cfgObj;
            o.actType = this.activityType;
            o.weight = cfgObj.index;
            if (activityData) {
                var canGet = activityData.canGetRecordByIndex(cfgObj.index);
                var getted = activityData.GetRecordByIndex(cfgObj.index);
                if (canGet) {
                    if (getted)
                        o.weight += 1000;
                    else
                        o.weight -= 1000;
                }
                else if (getted)
                    o.weight += 1000;
            }
            arr.push(o);
        }
        return arr;
    };
    zheKouBasePanel.prototype.OnClose = function () {
    };
    zheKouBasePanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        if (!this._activityId)
            return;
        var arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        if (this.list.dataProvider) {
            this.list.dataProvider.replaceAll(arrlist);
        }
        else {
            this.list.dataProvider = new eui.ArrayCollection(arrlist);
        }
        //this.list.dataProvider = new eui.ArrayCollection(arrlist); 
    };
    zheKouBasePanel.prototype._OnClick = function (e) {
    };
    return zheKouBasePanel;
}(BaseView));
__reflect(zheKouBasePanel.prototype, "zheKouBasePanel", ["ICommonWindow"]);
var zhekouShopItem = (function (_super) {
    __extends(zhekouShopItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function zhekouShopItem() {
        return _super.call(this) || this;
    }
    zhekouShopItem.prototype.childrenCreated = function () {
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        //this.btn_look.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this)
        this.gainway_txt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    zhekouShopItem.prototype.onClick = function (e) {
        if (e.currentTarget == this.btn_buy) {
            if (!Checker.Money(this.data.cfg.gold.id, this.data.cfg.gold.count, true)) {
                return;
            }
            GameGlobal.ActivityKaiFuModel.sendReward(this.data.cfg.Id, this.data.cfg.index);
        }
        else if (e.currentTarget == this.gainway_txt) {
            var cfgObj = this.data.cfg;
            GameGlobal.ViewManager.Guide(cfgObj.gainway[0][1][0]);
        }
    };
    zhekouShopItem.prototype.dataChanged = function () {
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        var actType = this.data.actType;
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
        this.itemIcon.data = cfgObj.itemid;
        this.itemIcon.isShowName(false);
        this.itemIcon.setCount(cfgObj.count);
        var goodsCfg = GameGlobal.Config.ItemConfig[cfgObj.itemid];
        this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        this.name_txt.text = goodsCfg.name;
        var buyNum = 0;
        if (cfgObj.type.type == 2) {
            //不限购
            this.limit_txt.text = "不限购";
        }
        else {
            if (activityData) {
                buyNum = activityData.buynums[cfgObj.index - 1];
            }
            this.limit_txt.text = "限购（" + buyNum + "/" + cfgObj.type.value + "）";
        }
        var value = cfgObj.value;
        this.imgBuyEnd.visible = false;
        //buyNum = GameGlobal.ActivityKaiFuModel.advancedInfo.getBuyNum(cfgObj.Id);
        if (cfgObj.type.type != 2 && cfgObj.type.value <= buyNum) {
            this.imgBuyEnd.visible = true;
        }
        else {
            if (KaiFuTargetShopPanel.curLookIndex == -1) {
                KaiFuTargetShopPanel.curLookIndex = cfgObj.index;
                GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_TARGET_ShOP_LOOK, cfgObj.index, cfgObj.pid, cfgObj.itemtype);
            }
        }
        this.btn_buy.visible = (this.imgBuyEnd.visible) ? false : true;
        this.priceIcon1.text = cfgObj.showgold;
        this.priceIcon2.text = cfgObj.gold.count;
        if (cfgObj.gainway) {
            this.gainway_txt.text = cfgObj.gainway[0][0];
            UIHelper.SetLinkStyleLabel(this.gainway_txt, cfgObj.gainway[0][0]);
        }
        this.gainway_txt.visible = cfgObj.gainway;
    };
    return zhekouShopItem;
}(eui.ItemRenderer));
__reflect(zhekouShopItem.prototype, "zhekouShopItem");
//# sourceMappingURL=zheKouBasePanel.js.map