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
var ArenaIconRule = (function (_super) {
    __extends(ArenaIconRule, _super);
    function ArenaIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ARENA_INFO_DATA, MessageDef.ARENA_BUY_RESULT];
        _this.tar["redPoint"] = _this.tar.getChildByName("redPoint");
        return _this;
    }
    ArenaIconRule.prototype.checkShowIcon = function () {
        return true;
    };
    ArenaIconRule.prototype.checkShowRedPoint = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_42, true)) {
            return false;
        }
        if (GameGlobal.Arena.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.Ladder.IsRedPoint()) {
            return true;
        }
        return false;
    };
    ArenaIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(ArenaWin);
    };
    return ArenaIconRule;
}(RuleIconBase));
__reflect(ArenaIconRule.prototype, "ArenaIconRule");
//# sourceMappingURL=ArenaIconRule.js.map