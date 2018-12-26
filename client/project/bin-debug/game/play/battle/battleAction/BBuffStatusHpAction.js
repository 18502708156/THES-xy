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
var BBuffStatusHpAction = (function (_super) {
    __extends(BBuffStatusHpAction, _super);
    function BBuffStatusHpAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_BUFFSTATUSHP;
        return _this;
    }
    BBuffStatusHpAction.Create = function (data) {
        var action = new BBuffStatusHpAction;
        action.src = data.src;
        action.target = data.target;
        action.args = data.args;
        action.actions = BattleTurnDataParse.ParseDatas(data.actions);
        return action;
    };
    BBuffStatusHpAction.prototype.IsLianji = function () {
        return this.args && this.args[0] == BuffType.TYPE_10;
    };
    BBuffStatusHpAction.prototype.IsFanji = function () {
        return this.args && this.args[0] == BuffType.TYPE_5;
    };
    BBuffStatusHpAction.prototype.OnUpdate = function (delta) {
        this.DoExecute();
        return AIUnitReturn.NEXT;
    };
    BBuffStatusHpAction.prototype.DoExecute = function () {
        if (true) {
            console.log("Status HP Buff", this.src, this.target, this.args);
        }
        var src = this.mContext.GetEntity(this.src);
        if (src) {
            src.mAI.ChangeHp(this.args[0], this.args[1], this.HasDead());
        }
    };
    return BBuffStatusHpAction;
}(BUnitAction));
__reflect(BBuffStatusHpAction.prototype, "BBuffStatusHpAction");
//# sourceMappingURL=BBuffStatusHpAction.js.map