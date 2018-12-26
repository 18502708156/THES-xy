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
var BUnitListAction = (function (_super) {
    __extends(BUnitListAction, _super);
    function BUnitListAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mList = [];
        _this.mIndex = 0;
        _this.mIsEnter = true;
        return _this;
    }
    BUnitListAction.CreateList = function (list) {
        var action = new BUnitListAction;
        action.mList = list;
        return action;
    };
    BUnitListAction.prototype.OnUpdate = function (delta) {
        var action = this.mList[this.mIndex];
        if (action) {
            if (!action.mInit) {
                action.Init(this.mContext);
                action.mInit = true;
            }
            if (this.mIsEnter) {
                action.OnEnter();
                this.mIsEnter = false;
            }
            var ret = action.OnUpdate(delta);
            if (ret != AIUnitReturn.CONTINUE) {
                action.OnExit();
                ++this.mIndex;
                this.mIsEnter = true;
            }
            return AIUnitReturn.CONTINUE;
        }
        return AIUnitReturn.NEXT;
    };
    BUnitListAction.prototype.OnExit = function () {
        // for (let action of this.mList) {
        //     action.OnExit()
        // }
    };
    return BUnitListAction;
}(BUnitAction));
__reflect(BUnitListAction.prototype, "BUnitListAction");
//# sourceMappingURL=BUnitListAction.js.map