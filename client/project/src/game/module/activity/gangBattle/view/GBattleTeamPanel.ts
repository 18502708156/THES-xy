class GBattleTeamPanel  extends GangMineMyTeamPanel {
    public constructor() {
        super()
        this.model = GameGlobal.GangBattleTeamModel;
    }
    
    protected OnClickZaomu() {
        if (this.model.mTeamInfo.IsMyTeam()) {
             //发送到聊天
            GameGlobal.GangBattleTeamModel.SendRecruit()
            UserTips.InfoTip("已经发布招募信息")
        } else {
            GameGlobal.UserTips.showTips('您不是队长没有权限操作');
        }
    }

}