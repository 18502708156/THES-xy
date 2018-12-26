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
var BUnitPlayWordAction = (function (_super) {
    __extends(BUnitPlayWordAction, _super);
    function BUnitPlayWordAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mTime = 500;
        return _this;
    }
    BUnitPlayWordAction.Create = function (src, anim) {
        var action = new BUnitPlayWordAction;
        action.m_Anim = anim;
        action.m_Src = src.GetHandle();
        return action;
    };
    BUnitPlayWordAction.prototype.OnEnter = function () {
        var target = this.mContext.GetEntity(this.m_Src);
        if (target) {
            this.mTime = AIConfig.WORD_EFF_TIME;
            GameMap.GetBattleView().bloodLayer.ShowSkillName(target.x, target.y, this.m_Anim);
        }
        else {
            this.mTime = 0;
        }
    };
    BUnitPlayWordAction.prototype.OnUpdate = function (delta) {
        return (this.mTime -= delta) <= 0 ? AIUnitReturn.NEXT : AIUnitReturn.CONTINUE;
    };
    return BUnitPlayWordAction;
}(BUnitAction));
__reflect(BUnitPlayWordAction.prototype, "BUnitPlayWordAction");
//# sourceMappingURL=BUnitPlayWordAction.js.map