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
var TheFirstPlayerTipWin = (function (_super) {
    __extends(TheFirstPlayerTipWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TheFirstPlayerTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "TheFirstPlayerTipSkin";
        _this._AddClick(_this.btnNormal, _this._OnClick);
        _this._AddClick(_this.btnCost, _this._OnClick);
        _this._AddClick(_this.btnHelp, _this._OnClick);
        return _this;
    }
    TheFirstPlayerTipWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "战力第一";
        var cost = GameGlobal.Config.CityBaseConfig.goldworship;
        this.price.type = cost.id;
        this.price.price = cost.count;
        this.btnCost.label = GameGlobal.actorModel.GetCurrencyName(cost.id) + "\u819C\u62DC";
        this.observe(MessageDef.MAIN_CITY_INFO, this.UpdateContent);
        this.observe(MessageDef.PALYER_INFO, this.UpdatePlayerInfo);
        var info = GameGlobal.CommonRaidModel.mMainCityInfo;
        if (!info)
            return;
        GameGlobal.PlayerInfoModel.sendOtherId(info.championid);
        var normalItem = GameGlobal.Config.CityBaseConfig.worshipreward;
        this.itemNormal.setItemAward(normalItem.type, normalItem.id, normalItem.count);
        var costItem = GameGlobal.Config.CityBaseConfig.goldworshipreward;
        this.itemCost.setItemAward(costItem.type, costItem.id, costItem.count);
        this.UpdateContent();
    };
    TheFirstPlayerTipWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    TheFirstPlayerTipWin.prototype.UpdateContent = function () {
        var info = GameGlobal.CommonRaidModel.mMainCityInfo;
        if (!info)
            return;
        this.labCharm.text = "" + info.charismaNum;
        this.btnNormal.visible = info.worship == 0;
        this.btnCost.visible = info.worship == 0;
        this.imgNormal.visible = info.worship == 1;
        this.imgCost.visible = info.worship == 2;
    };
    TheFirstPlayerTipWin.prototype.UpdatePlayerInfo = function (playerInfo) {
        this.labName.text = "" + playerInfo.name;
        this.powerLabel.text = playerInfo.power;
        playerInfo.shows[RoleShowDataType.ROLE_TITLE] = 1902;
        this.roleShowPanel.SetShowImage(playerInfo);
    };
    TheFirstPlayerTipWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnCost:
                var cost_1 = GameGlobal.Config.CityBaseConfig.goldworship;
                WarnWin.show("\u662F\u5426\u82B1\u8D39" + cost_1.count + GameGlobal.actorModel.GetCurrencyName(cost_1.id) + "\u819C\u62DC\uFF1F", function () {
                    Checker.Money(cost_1.id, cost_1.count, true, null, function () {
                        GameGlobal.CommonRaidModel.SendWorship(2);
                    });
                }, this);
                break;
            case this.btnNormal:
                GameGlobal.CommonRaidModel.SendWorship(1);
                break;
            case this.btnHelp:
                ViewManager.ins().open(ActivityDescPanel, 26, "规则说明");
                break;
        }
    };
    TheFirstPlayerTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return TheFirstPlayerTipWin;
}(BaseEuiView));
__reflect(TheFirstPlayerTipWin.prototype, "TheFirstPlayerTipWin");
//# sourceMappingURL=TheFirstPlayerTipWin.js.map