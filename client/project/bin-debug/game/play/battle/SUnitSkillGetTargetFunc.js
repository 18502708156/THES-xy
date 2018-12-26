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
var SUnitSkillGetTarget = (function () {
    function SUnitSkillGetTarget() {
        this.mTargets = [];
    }
    SUnitSkillGetTarget.prototype.Init = function (targets, args) {
        this.mArgs = args;
        CommonUtils.CopyTo(targets, this.mTargets);
    };
    return SUnitSkillGetTarget;
}());
__reflect(SUnitSkillGetTarget.prototype, "SUnitSkillGetTarget");
var SUnitSkillGetTarget10001 = (function (_super) {
    __extends(SUnitSkillGetTarget10001, _super);
    function SUnitSkillGetTarget10001() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SUnitSkillGetTarget10001.prototype.Get = function () {
        return this.mTargets;
    };
    return SUnitSkillGetTarget10001;
}(SUnitSkillGetTarget));
__reflect(SUnitSkillGetTarget10001.prototype, "SUnitSkillGetTarget10001");
var SUnitSkillGetTarget10002 = (function (_super) {
    __extends(SUnitSkillGetTarget10002, _super);
    function SUnitSkillGetTarget10002() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mIndex = 0;
        return _this;
    }
    SUnitSkillGetTarget10002.prototype.Get = function () {
        return [this.mTargets[(this.mIndex++) % this.mTargets.length]];
    };
    return SUnitSkillGetTarget10002;
}(SUnitSkillGetTarget));
__reflect(SUnitSkillGetTarget10002.prototype, "SUnitSkillGetTarget10002");
var SUnitSkillGetTarget10003 = (function (_super) {
    __extends(SUnitSkillGetTarget10003, _super);
    function SUnitSkillGetTarget10003() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SUnitSkillGetTarget10003.prototype.Get = function () {
        if (this.mTargets.length == 0) {
            return [];
        }
        var index = MathUtils.limitInteger(0, this.mTargets.length - 1);
        var list = [this.mTargets[index]];
        this.mTargets.splice(index, 1);
        return list;
    };
    return SUnitSkillGetTarget10003;
}(SUnitSkillGetTarget));
__reflect(SUnitSkillGetTarget10003.prototype, "SUnitSkillGetTarget10003");
var SUnitSkillGetTarget10004 = (function (_super) {
    __extends(SUnitSkillGetTarget10004, _super);
    function SUnitSkillGetTarget10004() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SUnitSkillGetTarget10004.prototype.Get = function () {
        return MathUtils.RandomArrayData(this.mTargets, this.mArgs ? this.mArgs.count : 1);
    };
    return SUnitSkillGetTarget10004;
}(SUnitSkillGetTarget));
__reflect(SUnitSkillGetTarget10004.prototype, "SUnitSkillGetTarget10004");
//# sourceMappingURL=SUnitSkillGetTargetFunc.js.map