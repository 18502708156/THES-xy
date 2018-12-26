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
var BUnitParallelAction = (function (_super) {
    __extends(BUnitParallelAction, _super);
    function BUnitParallelAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mList = [];
        return _this;
    }
    BUnitParallelAction.Create = function (list) {
        var action = new BUnitParallelAction;
        action.mList = list;
        return action;
    };
    BUnitParallelAction.prototype.Init = function (context) {
        for (var _i = 0, _a = this.mList; _i < _a.length; _i++) {
            var action = _a[_i];
            action.Init(context);
        }
    };
    BUnitParallelAction.prototype.OnEnter = function () {
        for (var _i = 0, _a = this.mList; _i < _a.length; _i++) {
            var action = _a[_i];
            action.OnEnter();
        }
    };
    BUnitParallelAction.prototype.OnUpdate = function (delta) {
        for (var i = this.mList.length - 1; i >= 0; --i) {
            var action = this.mList[i];
            if (action.OnUpdate(delta) != AIUnitReturn.CONTINUE) {
                this.mList.splice(i, 1);
            }
        }
        if (this.mList.length < 1) {
            return AIUnitReturn.NEXT;
        }
        return AIUnitReturn.CONTINUE;
    };
    BUnitParallelAction.prototype.OnExit = function () {
        for (var _i = 0, _a = this.mList; _i < _a.length; _i++) {
            var action = _a[_i];
            action.OnExit();
        }
    };
    return BUnitParallelAction;
}(BUnitAction));
__reflect(BUnitParallelAction.prototype, "BUnitParallelAction");
//# sourceMappingURL=BUnitParallelAction.js.map