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
var TreasureHuntModel = (function (_super) {
    __extends(TreasureHuntModel, _super);
    function TreasureHuntModel() {
        var _this = _super.call(this) || this;
        _this.RegNetMsgs(S2cProtocol.sc_luck_info, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_luck_ret, _this._DoRet);
        return _this;
    }
    TreasureHuntModel.prototype.IsFree = function () {
        if (this.mInfo) {
            return this.mInfo.daylist && (this.mInfo.daylist[1] == null || this.mInfo.daylist[1] == 0);
        }
        return false;
    };
    TreasureHuntModel.prototype.GetRound = function () {
        if (this.mInfo) {
            return this.mInfo.round || 1;
        }
        return 1;
    };
    TreasureHuntModel.prototype._DoInitInfo = function (rsp) {
        this.mInfo = rsp;
        if (rsp.equiprecords) {
            rsp.equiprecords = rsp.equiprecords.reverse();
        }
        else {
            rsp.equiprecords = [];
        }
        SortTools.sortMap(rsp.records, "time", false);
        GameGlobal.MessageCenter.dispatch(MessageDef.LUCK_RECORD);
    };
    TreasureHuntModel.prototype._DoRet = function (rsp) {
        if (rsp.type == 1 || rsp.type == 2 || rsp.type == 3 || rsp.type == 4) {
            if (ViewManager.ins().isShow(TreasureResultPanel)) {
                ViewManager.ins().open(TreasureResultPanel, rsp);
            }
            else {
                GameGlobal.MessageCenter.dispatch(MessageDef.LUCK_RET_ANIM, rsp);
            }
            GameGlobal.MessageCenter.dispatch(MessageDef.LUCK_RET_SUC);
        }
    };
    TreasureHuntModel.prototype.SendTreasure = function (type, index) {
        var req = new Sproto.cs_luck_draw_request;
        req.type = type;
        req.index = index;
        this.Rpc(C2sProtocol.cs_luck_draw, req);
    };
    TreasureHuntModel.prototype.SendGetInfo = function () {
        this.Rpc(C2sProtocol.cs_luck_info);
    };
    TreasureHuntModel.prototype.GetLuck = function () {
        if (this.mInfo) {
            return this.mInfo.lucky || 0;
        }
        return 0;
    };
    return TreasureHuntModel;
}(BaseSystem));
__reflect(TreasureHuntModel.prototype, "TreasureHuntModel");
//# sourceMappingURL=TreasureHuntModel.js.map