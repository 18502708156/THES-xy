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
var ListAction = (function (_super) {
    __extends(ListAction, _super);
    function ListAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mList = [];
        _this.mIndex = 0;
        _this.m_DoEnter = true;
        return _this;
    }
    ListAction.Create = function (list) {
        var action = new ParallelAction;
        action.mList = list;
        return action;
    };
    ListAction.prototype.Init = function (unitState) {
        _super.prototype.Init.call(this, unitState);
        for (var _i = 0, _a = this.mList; _i < _a.length; _i++) {
            var action = _a[_i];
            action.Init(unitState);
        }
    };
    ListAction.prototype.OnUpdate = function (delta) {
        var action = this.mList[this.mIndex];
        if (action) {
            if (this.m_DoEnter) {
                action.OnEnter();
                this.m_DoEnter = false;
            }
            var ret = action.OnUpdate(delta);
            if (ret != AIUnitReturn.CONTINUE) {
                ++this.mIndex;
                this.m_DoEnter = true;
            }
            return AIUnitReturn.CONTINUE;
        }
        return AIUnitReturn.NEXT;
    };
    ListAction.prototype.OnExit = function () {
        for (var _i = 0, _a = this.mList; _i < _a.length; _i++) {
            var action = _a[_i];
            action.OnExit();
        }
    };
    return ListAction;
}(AIUnitAction));
__reflect(ListAction.prototype, "ListAction");
//# sourceMappingURL=ListAction.js.map