class CrossBattleTeamWin extends GangMineTeamPanel {

    public model = GameGlobal.CrossBattleTeamModel;
    
	public constructor() {
		super()

	}

    initData() {
        this.list.itemRenderer = CrossBattleTeamItem;
        this.list.dataProvider = null;
    }

    OnOpen(...args: any[]) {
        this.commonWindowBg.OnAdded(this);
        this.AddClick(this.createBtn, this.onClickHandler);
        this.observe(MessageDef.UPDATE_TEAM_LIST, this.updateContent);
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.showMyTeamPanel);
        this.model.SendGetTeamList(GameGlobal.CrossBattleModel.camp);
    }

	protected updateContent() {
        this.list.dataProvider = new eui.ArrayCollection(this.model.mTeamList[GameGlobal.CrossBattleModel.camp]);
    }   

	protected onClickHandler(e: egret.TouchEvent) {
        GameGlobal.CrossBattleTeamModel.SendCreateTeam(GameGlobal.CrossBattleModel.camp)
    }

    protected showMyTeamPanel() {
        this.CloseSelf();
        // ViewManager.ins().open(CrossBattleTeamPanel);
    }
}

class CrossBattleTeamItem extends GangMineTeamItem {
	public constructor() {
		super()
	}		
    protected onClickHandler(e: egret.TouchEvent) { 
        if (this.needPower > GameGlobal.actorModel.power) {
            GameGlobal.UserTips.showTips('战力不足，不能加入'); 
            return;
        } 
        if (this.memberLen >= 3) {
            GameGlobal.UserTips.showTips('队伍满员，不能加入');
            return;
        }
        if (GameGlobal.CrossBattleModel.status == 4) {
            GameGlobal.UserTips.showTips('守城状态中，不能加入');
            return;
        }
        GameGlobal.CrossBattleTeamModel.SendJoin(GameGlobal.CrossBattleModel.camp, this.leaderId);
    }	
}