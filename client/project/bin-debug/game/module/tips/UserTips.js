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
var UserTips = (function (_super) {
    __extends(UserTips, _super);
    function UserTips() {
        var _this = _super.call(this) || this;
        MessageCenter.ins().addListener(MessageDef.POWER_BOOST, _this.showBoostPower, _this);
        _this.regNetMsg(S2cProtocol.sc_error_code, _this._ErrorTip);
        return _this;
    }
    UserTips.ins = function () {
        return _super.ins.call(this);
    };
    UserTips.prototype._ErrorTip = function (rsp) {
        var msg = rsp.msg;
        if (msg) {
            this.showTips(msg);
        }
    };
    UserTips.ErrorTip = function (str) {
        UserTips.ins().showTips("|C:0xff0000&T:" + str + "|");
    };
    // string, ...args: any[]
    UserTips.FormatTip = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        UserTips.ins().showTips("|C:0xFFF5E0&T:" + StringUtils.FormatS.apply(null, args) + "|");
    };
    UserTips.InfoTip = function (str) {
        UserTips.ins().showTips("|C:0xFFF5E0&T:" + str + "|");
    };
    UserTips.InfoTip2 = function (str) {
        UserTips.ins().showTips("|C:0x00ff00&T:" + str + "|");
    };
    UserTips.prototype.showTips = function (str) {
        var view = ViewManager.ins().getView(TipsView);
        if (!view) {
            view = ViewManager.ins().open(TipsView);
        }
        view.showIconTips(str, "");
    };
    UserTips.prototype.showContTips = function (str, src) {
        var view = ViewManager.ins().getView(TipsView);
        if (!view) {
            view = ViewManager.ins().open(TipsView);
        }
        view.showIconTips(str, src);
    };
    UserTips.prototype.showGoodEquipTips = function (itemData) {
        var view = ViewManager.ins().getView(TipsView);
        if (!view) {
            view = ViewManager.ins().open(TipsView);
        }
        view.showGoodEquipTip(itemData);
    };
    UserTips.prototype.showBoostPower = function (currentValue, lastValue) {
        var view = ViewManager.ins().getView(BoostPowerView);
        if (!view) {
            view = ViewManager.ins().open(BoostPowerView);
        }
        view.showBoostPower(currentValue, lastValue);
    };
    UserTips.prototype.showFuncNotice = function (lv) {
        // ViewManager.ins().open(FuncNoticeWin).showWin(lv);
    };
    return UserTips;
}(BaseSystem));
__reflect(UserTips.prototype, "UserTips");
//# sourceMappingURL=UserTips.js.map