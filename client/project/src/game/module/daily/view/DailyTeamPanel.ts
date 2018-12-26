class DailyTeamPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "组队历练"

    /////////////////////////////////////////////////////////////////////////////
    // DailyTeamSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected labCount: eui.Label;
    protected labAmbitionTip: eui.Label;
    protected labTip: eui.Label;
    protected item1: ItemBaseNotName;
    protected item2: ItemBaseNotName;
    protected item3: ItemBaseNotName;
    protected item4: ItemBaseNotName;
    protected prog: eui.ProgressBar;
    protected btnOneKey: eui.Button;
    protected btnGoTo: eui.Button;
    protected imgDouble: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()

	}

    public childrenCreated() {
        this._AddClick(this.btnGoTo, this._OnClick)
        this._AddClick(this.btnOneKey, this._OnClick)
        
        this.UpdateContent()
    }

	public UpdateContent() {
        let teamInfo = GameGlobal.DailyModel.teamInfo
        let maxCount = GameGlobal.Config.CrossTeamConfig.rewardCount
        this.labCount.text = `${GameGlobal.CrossTeamModel.GetCount()}/${maxCount}`
        this.labTip.text = GameGlobal.CrossTeamModel.GetDescForDaily()
        let ambitionCount = GameGlobal.Config.DailyBaseConfig.teamFB
        this.labAmbitionTip.text = `完成${ambitionCount}次任意组队副本可获得以下额外奖励`
        this.imgDouble.visible = GameGlobal.CrossTeamModel.IsDoubleReward()

        this.prog.maximum = ambitionCount
        this.prog.value = teamInfo.mCurValue

        this.btnOneKey.label = GameGlobal.DailyModel.IsTeamTargetDone() ? "领取奖励" : "一键完成"
        this.btnOneKey.enabled = !GameGlobal.DailyModel.HasGainedTeamReward()
        let redPointFlag = GameGlobal.DailyModel.IsTeamTargetDone() && !GameGlobal.DailyModel.HasGainedTeamReward()
        UIHelper.ShowRedPoint(this.btnOneKey, redPointFlag)
        if (GameGlobal.DailyModel.HasGainedTeamReward())
            this.btnOneKey.label = "已领取"

        let config = DailyConst.GetTeamConfig()
        let idx = 1
        for (let reward of config.itemid)
        {
            let itemName = `item${idx}`
			if (this[itemName])
			{
				this[itemName].visible = true
				this[itemName].setItemAward(reward.type, reward.id, reward.count)
			}

			idx++
        }
	}

	public OnOpen() {
        this.observe(MessageDef.DAILY_TEAM_UPDATE, this.UpdateContent)
	}

	public OnClose() {
        
	}
    
    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnGoTo:
                ViewManager.ins().open(CrossMainPanel)
                ViewManager.ins().close(DailyMainWin)
            break
            case this.btnOneKey:
                if (GameGlobal.DailyModel.IsTeamTargetDone())
                {
                    let config = DailyConst.GetTeamConfig()
                    GameGlobal.DailyModel.SendGainAward(DailyConst.TYPE_TEAM, config.reward)
                }
                else
                {
                    let cost = GameGlobal.Config.DailyBaseConfig.teamFBcost[0]
                    WarnWin.show(`是否花费${cost.count}元宝快速完成？`, () => {
                        if (Checker.Money(cost.id, cost.count))
                        {
                            GameGlobal.DailyModel.SendQuilkDone(DailyConst.TYPE_TEAM)
                        }
                    }, this)
    
                }
                    
            break
        }
    }
}