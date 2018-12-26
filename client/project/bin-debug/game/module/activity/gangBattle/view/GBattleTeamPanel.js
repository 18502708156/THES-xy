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
var GBattleTeamPanel = (function (_super) {
    __extends(GBattleTeamPanel, _super);
    function GBattleTeamPanel() {
        var _this = _super.call(this) || this;
        _this.model = GameGlobal.GangBattleTeamModel;
        return _this;
    }
    GBattleTeamPanel.prototype.OnClickZaomu = function () {
        if (this.model.mTeamInfo.IsMyTeam()) {
            //发送到聊天
            GameGlobal.GangBattleTeamModel.SendRecruit();
            UserTips.InfoTip("已经发布招募信息");
        }
        else {
            GameGlobal.UserTips.showTips('您不是队长没有权限操作');
        }
    };
    return GBattleTeamPanel;
}(GangMineMyTeamPanel));
__reflect(GBattleTeamPanel.prototype, "GBattleTeamPanel");
//# sourceMappingURL=GBattleTeamPanel.js.map