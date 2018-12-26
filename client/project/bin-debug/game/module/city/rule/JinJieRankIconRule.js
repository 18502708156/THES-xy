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
var JinJieRankIconRule = (function (_super) {
    __extends(JinJieRankIconRule, _super);
    function JinJieRankIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.LEVEL_CHANGE];
        return _this;
    }
    JinJieRankIconRule.prototype.checkShowIcon = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_9, true)) {
            return false;
        }
        var serverDay = GameServer.serverOpenDay;
        if (serverDay <= GameGlobal.Config.ProgressCrazyBaseConfig.initialorder.length) {
            var icon = GameGlobal.Config.ProgressCrazyBaseConfig.rankbtn[GameGlobal.Config.ProgressCrazyBaseConfig.initialorder[serverDay - 1] - 1];
            this.iconDisplay.source = icon;
        }
        else {
            this.iconDisplay.source = "";
        }
        return serverDay <= GameGlobal.Config.ProgressCrazyBaseConfig.initialorder.length;
    };
    JinJieRankIconRule.prototype.checkShowRedPoint = function () {
        if (JinJieRankIconRule.mIsFirst) {
            return true;
        }
        return false;
    };
    JinJieRankIconRule.prototype.tapExecute = function () {
        JinJieRankIconRule.mIsFirst = false;
        KaiFuActivityWin.Show(ActivityKaiFuFuncType.ACT_99991_JiJieRank, false); //传如了一个进阶排行活动id 打开要选中进阶排行
    };
    JinJieRankIconRule.mIsFirst = true;
    return JinJieRankIconRule;
}(RuleIconBase));
__reflect(JinJieRankIconRule.prototype, "JinJieRankIconRule");
//# sourceMappingURL=JinJieRankIconRule.js.map