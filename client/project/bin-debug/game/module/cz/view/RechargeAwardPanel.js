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
var RechargeAwardPanel = (function (_super) {
    __extends(RechargeAwardPanel, _super);
    function RechargeAwardPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._resources = ["ui_czth_bm_biaotou", "chongzhitehui_json", "ui_czth_bm_tupian02", "ui_czth_bm_tupian01"];
        _this.skinName = "RechargeAwardSkin";
        _this.list.itemRenderer = RechargeAwardItem;
        _this.commonDialog.notClickMask = true;
        return _this;
    }
    RechargeAwardPanel.prototype.childrenCreated = function () {
        var items = CommonUtils.GetArray(GameGlobal.Config.DiscountBaseConfig.itemid);
        this.list.dataProvider = new eui.ArrayCollection(items);
        var textdes;
        if (LocationProperty.GetRechargeId() == 3) {
            textdes = GameGlobal.Config.DiscountBaseConfig.textdes2;
        }
        else {
            textdes = GameGlobal.Config.DiscountBaseConfig.textdes;
        }
        var i = 0;
        for (var _i = 0, textdes_1 = textdes; _i < textdes_1.length; _i++) {
            var val = textdes_1[_i];
            var btn = this["btn" + i];
            btn.getTxt.text = val.des;
            btn.tipsTxt.text = "\u5145\u503C" + GameGlobal.Config.PayItemsConfig[val.id].amount / 100 + "\u5143";
            btn.rechargeId = val.id;
            btn.tipsImg.visible = textdes[i].taget;
            this._AddClick(btn.rechargeBtn, this.tap);
            i++;
        }
        this.AddClick(this.giftBtn, this.gift);
    };
    RechargeAwardPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.observe(MessageDef.RECHARGE_UPDATE, this.updataContent);
        this.updataContent();
    };
    RechargeAwardPanel.prototype.updataContent = function () {
        var config = GameGlobal.Config.DiscountBaseConfig;
        if (config.showtype == 0)
            this.titelImg.source = GameGlobal.Config.TitleConf[config.titlpid].icon;
        else
            this.petShowpanel.SetBody(AppearanceConfig.GetUIPath(config.titlpid));
        this.btnGroup.visible = GameGlobal.RechargeModel.choicerechare == 0;
        this.giftBtn.visible = GameGlobal.RechargeModel.choicerechare > 0;
        this.getImg.visible = GameGlobal.RechargeModel.choicerechare < 0;
    };
    RechargeAwardPanel.prototype.tap = function (e) {
        var obj = e.currentTarget;
        while (obj.skinName != "RechargeAwardBtnSkin" && obj.parent) {
            obj = obj.parent;
        }
        var config = GameGlobal.Config.DiscountBaseConfig;
        if (LocationProperty.NotRechargeGood()) {
            config.rechargegood = null;
        }
        if (config.rechargegood && obj.rechargeId != config.rechargegood) {
            var rechargeConfig = GameGlobal.Config.PayItemsConfig;
            var data = {};
            for (var key in rechargeConfig) {
                if (parseInt(key) == obj.rechargeId)
                    data["btnName"] = "\u5145\u503C" + rechargeConfig[key].cash + "\u5143";
                if (parseInt(key) == config.rechargegood)
                    data["btnName2"] = "\u5145\u503C" + rechargeConfig[key].cash + "\u5143";
            }
            data["closeExecuteCallFun2"] = false;
            WarnWin.show(config.des, function () {
                if (obj.rechargeId)
                    GameGlobal.RechargeModel.sendRecharge(obj.rechargeId);
            }, this, function () {
                GameGlobal.RechargeModel.sendRecharge(config.rechargegood);
            }, this, "normal", data);
        }
        else if (obj.rechargeId) {
            GameGlobal.RechargeModel.sendRecharge(obj.rechargeId);
        }
    };
    RechargeAwardPanel.prototype.gift = function () {
        GameGlobal.RechargeModel.sendGiftAward();
    };
    RechargeAwardPanel.NAME = "特惠充值";
    RechargeAwardPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return RechargeAwardPanel;
}(BaseEuiView));
__reflect(RechargeAwardPanel.prototype, "RechargeAwardPanel");
var RechargeAwardItem = (function (_super) {
    __extends(RechargeAwardItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function RechargeAwardItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "RechargeAwardItemSkin";
        return _this;
    }
    RechargeAwardItem.prototype.dataChanged = function () {
        this.item.data = this.data;
        this.tipsImg.visible = this.data.taget;
    };
    return RechargeAwardItem;
}(ItemRenderer));
__reflect(RechargeAwardItem.prototype, "RechargeAwardItem");
//# sourceMappingURL=RechargeAwardPanel.js.map