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
var BAddBuffAction = (function (_super) {
    __extends(BAddBuffAction, _super);
    function BAddBuffAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_ACTIONBUFF;
        return _this;
    }
    BAddBuffAction.Create = function (data) {
        var action = new BAddBuffAction;
        action.src = data.src;
        action.target = data.target;
        action.args = data.args;
        return action;
    };
    BAddBuffAction.prototype.OnUpdate = function (delta) {
        if (true) {
            // console.log("Add Buff", this.src, this.target, this.args)
        }
        this.DoExecute();
        return AIUnitReturn.NEXT;
    };
    BAddBuffAction.prototype.DoExecute = function () {
        var target = this.mContext.GetEntity(this.target);
        if (!target) {
            return;
        }
        for (var _i = 0, _a = this.args; _i < _a.length; _i++) {
            var id = _a[_i];
            target.mAI.AddBuff(id);
        }
    };
    return BAddBuffAction;
}(BUnitAction));
__reflect(BAddBuffAction.prototype, "BAddBuffAction");
//# sourceMappingURL=BAddBuffAction.js.map