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
var TsumKoModel = (function (_super) {
    __extends(TsumKoModel, _super);
    function TsumKoModel() {
        var _this = _super.call(this, UserFb.FB_TYPE_LIFE_DEATH_PLUNDER) || this;
        _this.btnSign0 = true;
        _this.btnSign1 = true;
        return _this;
    }
    TsumKoModel.prototype.CheckEnter = function (id) {
        return true;
    };
    return TsumKoModel;
}(TeamBaseModel));
__reflect(TsumKoModel.prototype, "TsumKoModel");
//# sourceMappingURL=TsumKoModel.js.map