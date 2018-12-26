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
var GangMapExchangeWin = (function (_super) {
    __extends(GangMapExchangeWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangMapExchangeWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangMapExchangeSkin";
        _this._AddClick(_this.btnRefresh, _this._OnClick);
        return _this;
    }
    GangMapExchangeWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "帮会兑换";
        this.list.itemRenderer = GangMapExchangeItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
        this.observe(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO, this.UpdateContent);
        GameGlobal.GangMapModel.SendGetExchange();
        var cost = GameGlobal.Config.GuildConfig.buycost;
        this.priceicon.type = cost.id;
        this.priceicon.price = cost.count;
        this.durationLab.SetColor(0x019704);
    };
    GangMapExchangeWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GangMapExchangeWin.prototype.UpdateContent = function () {
        var gmExchange = GameGlobal.GangMapModel.gangMapExchangeInfo;
        this.durationLab.SetCallbackFunc(function () {
            GameGlobal.GangMapModel.SendGetExchange();
        });
        this.durationLab.SetEndTime(gmExchange.mRefreshTime || 0, DurationLabel.TIMETEXT_TYPE_HHMMSS);
        this.labCount.text = "" + (GameGlobal.Config.GuildConfig.number - gmExchange.mRefreshCount);
        var exchangeList = gmExchange.mExchangeList;
        this.list.dataProvider = new eui.ArrayCollection(exchangeList);
    };
    GangMapExchangeWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnRefresh:
                var cost_1 = GameGlobal.Config.GuildConfig.buycost;
                WarnWin.show("\u662F\u5426\u82B1\u8D39" + cost_1.count + GameGlobal.actorModel.GetCurrencyName(cost_1.id) + "\u5237\u65B0\uFF1F", function () {
                    Checker.Money(cost_1.id, cost_1.count, true, null, function () {
                        GameGlobal.GangMapModel.SendRefreshExchange();
                    });
                }, this);
                break;
        }
    };
    GangMapExchangeWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangMapExchangeWin;
}(BaseEuiView));
__reflect(GangMapExchangeWin.prototype, "GangMapExchangeWin");
var GangMapExchangeItem = (function (_super) {
    __extends(GangMapExchangeItem, _super);
    function GangMapExchangeItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mEnoughFlag = true;
        return _this;
    }
    GangMapExchangeItem.prototype.childrenCreated = function () {
        this.labMaterial1.text = "";
        this.labMaterial2.text = "";
        this.btnExchange.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClicked, this);
    };
    GangMapExchangeItem.prototype.dataChanged = function () {
        var exchangeItemId = this.data;
        var config = GameGlobal.Config.GuildMapBuyConfig[exchangeItemId];
        this.itemIcon.setItemAward(config.icon.type, config.icon.id, config.icon.count);
        var materialInfo1 = config.cost[0];
        if (materialInfo1) {
            var name_1 = GangMapConst.GetGangMapItemName(materialInfo1.id);
            var curNum = GameGlobal.GangMapModel.GetGangMapItemNum(materialInfo1.id);
            var color = curNum >= materialInfo1.count ? 0x019704 : 0xdb0000;
            var text = name_1 + " |C:" + color + "&T:" + curNum + "/" + materialInfo1.count + "|";
            this.labMaterial1.textFlow = TextFlowMaker.generateTextFlow(text);
            this.mEnoughFlag = curNum < materialInfo1.count ? false : this.mEnoughFlag;
        }
        var materialInfo2 = config.cost[1];
        if (materialInfo2) {
            var name_2 = GangMapConst.GetGangMapItemName(materialInfo2.id);
            var curNum = GameGlobal.GangMapModel.GetGangMapItemNum(materialInfo2.id);
            var color = curNum >= materialInfo1.count ? 0x019704 : 0xdb0000;
            var text = name_2 + " |C:" + color + "&T:" + curNum + "/" + materialInfo2.count + "|";
            this.labMaterial2.textFlow = TextFlowMaker.generateTextFlow(text);
            this.mEnoughFlag = curNum < materialInfo2.count ? false : this.mEnoughFlag;
        }
        this.btnExchange.filters = GameGlobal.GangMapModel.HasExchangeItem(exchangeItemId) ? Color.GetFilter() : null;
    };
    GangMapExchangeItem.prototype._OnBtnClicked = function (e) {
        if (!this.mEnoughFlag) {
            UserTips.ins().showTips("物品不足");
            return;
        }
        GameGlobal.GangMapModel.SendExchange(this.data);
    };
    return GangMapExchangeItem;
}(eui.ItemRenderer));
__reflect(GangMapExchangeItem.prototype, "GangMapExchangeItem");
//# sourceMappingURL=GangMapExchangeWin.js.map