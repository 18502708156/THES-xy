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
var PositionForeshowModel = (function (_super) {
    __extends(PositionForeshowModel, _super);
    function PositionForeshowModel() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_position_info, _this._getPositionInfo);
        return _this;
    }
    PositionForeshowModel.prototype.isRedPoint = function () {
        if (!this.position_info) {
            return false;
        }
        for (var _i = 0, _a = this.position_info.data; _i < _a.length; _i++) {
            var val = _a[_i];
            if (val.typ == 1)
                return true;
        }
        return false;
    };
    PositionForeshowModel.prototype.sendGetAward = function (id) {
        var req = new Sproto.cs_position_getawards_request;
        req.no = id;
        this.Rpc(C2sProtocol.cs_position_getawards, req, function (rep) {
            if (rep.ret) {
                MessageCenter.ins().dispatch(MessageDef.POSITION_AWARD_CHANGE);
            }
        }, this);
    };
    PositionForeshowModel.prototype._getPositionInfo = function (req) {
        if (req) {
            this.position_info = req;
            MessageCenter.ins().dispatch(MessageDef.POSITION_STATE_CHANGE);
        }
    };
    return PositionForeshowModel;
}(BaseSystem));
__reflect(PositionForeshowModel.prototype, "PositionForeshowModel");
//# sourceMappingURL=PositionForeshowModel.js.map