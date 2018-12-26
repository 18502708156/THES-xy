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
var RelationIconRule = (function (_super) {
    __extends(RelationIconRule, _super);
    function RelationIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    RelationIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_41, true);
    };
    RelationIconRule.prototype.checkShowRedPoint = function () {
        var length = GameGlobal.TeacherController.teacherInfo.messageData.length;
        return length > 0;
    };
    RelationIconRule.prototype.tapExecute = function () {
        var openId = GameGlobal.Config.MasterBaseConfig.openid;
        if (Deblocking.Check(openId)) {
            ViewManager.ins().open(RelationWin);
        }
    };
    return RelationIconRule;
}(RuleIconBase));
__reflect(RelationIconRule.prototype, "RelationIconRule");
//# sourceMappingURL=RelationIconRule.js.map