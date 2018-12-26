class CrossBattleTeamPanel extends GangMineMyTeamPanel {
    public constructor() {
        super()
        this.model = GameGlobal.CrossBattleTeamModel;
    }
     protected onClickHandler(e: egret.TouchEvent) {
        switch (e.target) {
            case this.exitBtn:
                this.CloseSelf();
                this.model.SendLeave(1);
                break;
            case this.zaomuBtn:
                if (this.model.mTeamInfo.IsMyTeam()) {
                    //发送到聊天
                    GameGlobal.CrossBattleModel.SendRecruit()
                    UserTips.InfoTip("已经发布招募信息")
                } else {
                    GameGlobal.UserTips.showTips('您不是队长没有权限操作');
                }
                break;
            case this.setUpBtn:
                if (this.model.mTeamInfo.IsMyTeam()) {
                    this.model.SendGetTeamCondition(GameGlobal.CrossBattleModel.camp, parseInt(this.tpower.text));
                } else {
                    this.tpower.text = this.model.mTeamInfo.needpower + ''
                    GameGlobal.UserTips.showTips('您不是队长没有权限操作');
                }
                break;
        }
    }
}