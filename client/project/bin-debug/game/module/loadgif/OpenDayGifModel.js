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
var OpenDayGifModel = (function (_super) {
    __extends(OpenDayGifModel, _super);
    function OpenDayGifModel() {
        var _this = _super.call(this) || this;
        _this.tolDay = 0;
        _this.mConfigLen = null;
        _this.regNetMsg(S2cProtocol.sc_welfare_login_gift_info, _this.LoginGift);
        return _this;
    }
    OpenDayGifModel.prototype.LoginGift = function (rsp) {
        this.tolDay = rsp.totalLoginday;
        this.receivemark = rsp.receivemark;
        GameGlobal.MessageCenter.dispatch(MessageDef.LOGINDAYGIF);
    };
    OpenDayGifModel.prototype.getLoginReward = function (index) {
        var day = new Sproto.cs_welfare_get_loginreward_request;
        day.indexDay = index;
        this.Rpc(C2sProtocol.cs_welfare_get_loginreward, day);
    };
    OpenDayGifModel.prototype.OpenDayPointRed = function () {
        var Config = GameGlobal.Config.LoginRewardConfig;
        var ConfigData = [];
        for (var data in Config) {
            if (Number(data) <= OpenDayGifModel.ins().tolDay && !BitUtil.Has(OpenDayGifModel.ins().receivemark, Number(data) - 1)) {
                return true;
            }
        }
        return false;
    };
    OpenDayGifModel.prototype.OpenDayIcon = function () {
        var Config = GameGlobal.Config.LoginRewardConfig;
        var ConfigData = [];
        for (var data in Config) {
            if (!BitUtil.Has(OpenDayGifModel.ins().receivemark, Number(data) - 1)) {
                return true;
            }
        }
        return false;
    };
    OpenDayGifModel.prototype.GetShowDayImg = function () {
        if (!this.mConfigLen) {
            this.mConfigLen = CommonUtils.getObjectLength(GameGlobal.Config.LoginRewardConfig);
        }
        var mark = this.receivemark;
        var Config = GameGlobal.Config.LoginRewardConfig;
        var btnIcon = "";
        for (var i = 1; i <= this.mConfigLen; i++) {
            var data = Config[i];
            if (!BitUtil.Has(mark, i - 1)) {
                return data.btnicon;
            }
        }
        return "";
    };
    return OpenDayGifModel;
}(BaseSystem));
__reflect(OpenDayGifModel.prototype, "OpenDayGifModel");
//# sourceMappingURL=OpenDayGifModel.js.map