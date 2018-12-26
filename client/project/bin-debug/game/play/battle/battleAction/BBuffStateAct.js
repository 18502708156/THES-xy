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
var BBuffStateAct = (function (_super) {
    __extends(BBuffStateAct, _super);
    function BBuffStateAct() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_BUFFSTATUSACT;
        return _this;
    }
    BBuffStateAct.Create = function (data) {
        var action = new BBuffStateAct;
        action.src = data.src;
        action.target = data.target;
        action.args = data.args;
        action.actions = BattleTurnDataParse.ParseDatas(data.actions);
        return action;
    };
    BBuffStateAct.prototype.OnUpdate = function (delta) {
        this.DoExecute();
        return AIUnitReturn.NEXT;
    };
    BBuffStateAct.prototype.DoExecute = function () {
        console.log("Status HP Buff", this.src, this.target, this.args);
        var target = this.mContext.GetEntity(this.target);
        if (target) {
            target.mAI.BuffAct(this.args[0], this.args[1], this.HasDead());
        }
    };
    return BBuffStateAct;
}(BUnitAction));
__reflect(BBuffStateAct.prototype, "BBuffStateAct");
//# sourceMappingURL=BBuffStateAct.js.map