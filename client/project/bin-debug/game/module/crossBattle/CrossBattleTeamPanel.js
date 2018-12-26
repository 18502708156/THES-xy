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
var CrossBattleTeamPanel = (function (_super) {
    __extends(CrossBattleTeamPanel, _super);
    function CrossBattleTeamPanel() {
        var _this = _super.call(this) || this;
        _this.model = GameGlobal.CrossBattleTeamModel;
        return _this;
    }
    CrossBattleTeamPanel.prototype.onClickHandler = function (e) {
        switch (e.target) {
            case this.exitBtn:
                this.CloseSelf();
                this.model.SendLeave(1);
                break;
            case this.zaomuBtn:
                if (this.model.mTeamInfo.IsMyTeam()) {
                    //发送到聊天
                    GameGlobal.CrossBattleModel.SendRecruit();
                    UserTips.InfoTip("已经发布招募信息");
                }
                else {
                    GameGlobal.UserTips.showTips('您不是队长没有权限操作');
                }
                break;
            case this.setUpBtn:
                if (this.model.mTeamInfo.IsMyTeam()) {
                    this.model.SendGetTeamCondition(GameGlobal.CrossBattleModel.camp, parseInt(this.tpower.text));
                }
                else {
                    this.tpower.text = this.model.mTeamInfo.needpower + '';
                    GameGlobal.UserTips.showTips('您不是队长没有权限操作');
                }
                break;
        }
    };
    return CrossBattleTeamPanel;
}(GangMineMyTeamPanel));
__reflect(CrossBattleTeamPanel.prototype, "CrossBattleTeamPanel");
//# sourceMappingURL=CrossBattleTeamPanel.js.map