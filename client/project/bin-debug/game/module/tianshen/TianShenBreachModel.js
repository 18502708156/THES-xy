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
var TianShenBreachModel = (function (_super) {
    __extends(TianShenBreachModel, _super);
    function TianShenBreachModel() {
        return _super.call(this) || this;
    }
    TianShenBreachModel.prototype.getLevelsConfig = function (id) {
        return GameGlobal.Config.AirMarshalBreachConfig[id];
    };
    /**
     * 获取突破等级对应战力属性
     */
    TianShenBreachModel.prototype.getPower = function (id, level) {
        var lvConfig = this.getLevelsConfig(id)[level];
        if (lvConfig.attrs) {
            return ItemConfig.CalcAttrScoreValue(lvConfig.attrs);
        }
        return 0;
    };
    /**
     * 天神突破
     * @param tsid 天神id
     */
    TianShenBreachModel.prototype.sendTianShenBreach = function (tsid) {
        var req = new Sproto.cs_tianshen_promotion_request;
        req.no = tsid;
        this.Rpc(C2sProtocol.cs_tianshen_promotion, req, function (rsp) {
            if (rsp.ret) {
                var info = GameGlobal.TianShenModel.mTianShenList[rsp.no];
                if (info) {
                    info.mBreachLv = rsp.promotion;
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_BREACH);
            }
        }, this);
    };
    return TianShenBreachModel;
}(BaseSystem));
__reflect(TianShenBreachModel.prototype, "TianShenBreachModel");
//# sourceMappingURL=TianShenBreachModel.js.map