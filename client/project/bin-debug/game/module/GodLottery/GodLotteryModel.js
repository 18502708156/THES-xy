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
var GodLotteryModel = (function (_super) {
    __extends(GodLotteryModel, _super);
    function GodLotteryModel() {
        var _this = _super.call(this) || this;
        _this.mLotteryCount = 0;
        _this.RegNetMsgs(S2cProtocol.sc_luck_info, _this._DoInitInfo);
        return _this;
    }
    GodLotteryModel.prototype.Init = function () {
    };
    GodLotteryModel.prototype._DoInitInfo = function (rsp) {
        this.mLotteryCount = rsp.tenNum || 0;
        GameGlobal.MessageCenter.dispatch(MessageDef.GODLOTTERY_UPDATE_INFO);
    };
    GodLotteryModel.prototype.SendLottery = function (type) {
        var _this = this;
        this.mLotteryType = type;
        var req = new Sproto.cs_luck_tianshen_request;
        req.typ = type;
        this.Rpc(C2sProtocol.cs_luck_tianshen, req, function (rsp) {
            if (!rsp.ret)
                return;
            _this.mAwardList = rsp.rewards;
            _this.mLotteryCount = rsp.tenNum || _this.mLotteryCount;
            if (ViewManager.ins().isShow(GodLotteryResultPanel))
                ViewManager.ins().open(GodLotteryResultPanel);
            else
                GameGlobal.MessageCenter.dispatch(MessageDef.GODLOTTERY_UPDATE_LOTTERY);
        }, this);
    };
    GodLotteryModel.prototype.getAwardList = function () {
        var awards = [];
        for (var _i = 0, _a = this.mAwardList; _i < _a.length; _i++) {
            var reward = _a[_i];
            awards.push({ type: 1, id: reward.id, count: reward.num });
        }
        return awards;
    };
    Object.defineProperty(GodLotteryModel.prototype, "lotteryCount", {
        get: function () {
            return this.mLotteryCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GodLotteryModel.prototype, "lotteryType", {
        get: function () {
            return this.mLotteryType;
        },
        enumerable: true,
        configurable: true
    });
    return GodLotteryModel;
}(BaseSystem));
__reflect(GodLotteryModel.prototype, "GodLotteryModel");
//# sourceMappingURL=GodLotteryModel.js.map