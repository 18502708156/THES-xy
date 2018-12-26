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
var JingMaiData = (function (_super) {
    __extends(JingMaiData, _super);
    function JingMaiData() {
        var _this = _super.call(this) || this;
        _this.level = 0;
        _this.regNetMsg(S2cProtocol.sc_vein_update, _this.getJingMaiData);
        return _this;
    }
    JingMaiData.prototype.getJingMaiData = function (rspData) {
        if (rspData == null) {
            return;
        }
        this.level = rspData.level;
        this.totalAttrs = rspData.totalattr;
        MessageCenter.ins().dispatch(MessageDef.JINGMAI_DATA_UPDATE, rspData);
    };
    JingMaiData.prototype.sendJingMaiUpLevel = function () {
        this.Rpc(C2sProtocol.cs_vein_Breakthrough);
    };
    /**每重级数 */
    JingMaiData.MAX_LEVEL = 11;
    return JingMaiData;
}(BaseSystem));
__reflect(JingMaiData.prototype, "JingMaiData");
//# sourceMappingURL=JingMaiData.js.map