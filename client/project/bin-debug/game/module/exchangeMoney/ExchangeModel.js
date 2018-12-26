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
/**
 * 银两兑换Model
 */
var ExchangeModel = (function (_super) {
    __extends(ExchangeModel, _super);
    function ExchangeModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //兑换
    ExchangeModel.prototype.exchange = function () {
        var req = new Sproto.cs_exchange_gold_perform_request;
        this.Rpc(C2sProtocol.cs_exchange_gold_perform, req, function (rsp) {
            GameGlobal.MessageCenter.dispatch(MessageDef.EXCHANGE_COUNT, rsp);
        }, this);
    };
    //银两兑换信息
    ExchangeModel.prototype.exchangeInfo = function () {
        var req = new Sproto.cs_exchange_gold_info_request;
        this.Rpc(C2sProtocol.cs_exchange_gold_info, req, function (rsp) {
            GameGlobal.MessageCenter.dispatch(MessageDef.EXCHANGE_COUNT, rsp);
        }, this);
    };
    return ExchangeModel;
}(BaseSystem));
__reflect(ExchangeModel.prototype, "ExchangeModel");
//# sourceMappingURL=ExchangeModel.js.map