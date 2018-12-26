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
var BRemoveBuffAction = (function (_super) {
    __extends(BRemoveBuffAction, _super);
    function BRemoveBuffAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_REMOVEBUFF;
        return _this;
    }
    BRemoveBuffAction.Create = function (data) {
        var action = new BRemoveBuffAction;
        action.id = data.id;
        action.src = data.src;
        action.args = data.args;
        return action;
    };
    BRemoveBuffAction.prototype.OnUpdate = function (delta) {
        this.DoExecute();
        return AIUnitReturn.NEXT;
    };
    BRemoveBuffAction.prototype.DoExecute = function () {
        var target = this.mContext.GetEntity(this.src);
        if (!target) {
            return;
        }
        // for (let id of this.args) {
        // 	target.mAI.RemoveBuff(id)
        // }
        target.mAI.RemoveBuff(this.id, this.args[0] == 2);
    };
    return BRemoveBuffAction;
}(BUnitAction));
__reflect(BRemoveBuffAction.prototype, "BRemoveBuffAction");
//# sourceMappingURL=BRemoveBuffAction.js.map