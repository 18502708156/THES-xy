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
var BBuffChangeHpAction = (function (_super) {
    __extends(BBuffChangeHpAction, _super);
    function BBuffChangeHpAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_BUFFHP;
        return _this;
    }
    BBuffChangeHpAction.Create = function (data) {
        var action = new BBuffChangeHpAction;
        action.src = data.src;
        action.target = data.target;
        action.arg = data.arg;
        action.actions = BattleTurnDataParse.ParseDatas(data.actions);
        return action;
    };
    BBuffChangeHpAction.prototype.OnUpdate = function (delta) {
        this.DoExecute();
        return AIUnitReturn.NEXT;
    };
    BBuffChangeHpAction.prototype.DoExecute = function () {
        console.log("Change HP Buff", this.src, this.target, this.arg);
        var target = this.mContext.GetEntity(this.target);
        if (target) {
            target.mAI.ChangeHp(0, this.arg, this.HasDead());
        }
    };
    return BBuffChangeHpAction;
}(BUnitAction));
__reflect(BBuffChangeHpAction.prototype, "BBuffChangeHpAction");
//# sourceMappingURL=BBuffChangeHpAction.js.map