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
var BattleDamageBaseData = (function (_super) {
    __extends(BattleDamageBaseData, _super);
    function BattleDamageBaseData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_ACTIONHP;
        return _this;
    }
    BattleDamageBaseData.Create = function (data) {
        var damageData = new BattleDamageBaseData;
        damageData.target = data.target;
        damageData.type = data.args[0];
        damageData.value = data.args[1];
        if (data.actions) {
            for (var _i = 0, _a = data.actions; _i < _a.length; _i++) {
                var d = _a[_i];
                var data_1 = BattleTurnDataParse.ParseData(d);
                if (data_1) {
                    damageData.Push(data_1);
                }
            }
        }
        return damageData;
    };
    BattleDamageBaseData.prototype.HasDead = function () {
        if (this.actions) {
            for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
                var ac = _a[_i];
                if (ac.mType == BattleTurnDataParse.TYPE_DEAD) {
                    return true;
                }
            }
        }
        return false;
    };
    BattleDamageBaseData.prototype.Push = function (action) {
        if (!this.actions) {
            this.actions = [];
        }
        this.actions.push(action);
    };
    return BattleDamageBaseData;
}(BUnitAction));
__reflect(BattleDamageBaseData.prototype, "BattleDamageBaseData");
//# sourceMappingURL=BattleDamageBaseData.js.map