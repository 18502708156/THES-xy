class DailyPeacePanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "每日300"//"平定安邦"

    /////////////////////////////////////////////////////////////////////////////
    // DailyPeaceSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list:eui.List;
    protected btnOneKey:eui.Button;
    protected labWaveCount:eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()

	}

    public childrenCreated() {
        this._AddClick(this.btnOneKey, this._OnClick)

        this.list.itemRenderer = DailyPeaceItem;
        let peaceList = DailyConst.GetPeaceList()
        this.list.dataProvider = new eui.ArrayCollection(peaceList);
        
        this.SetWaveInfo()
    }

    private SetWaveInfo() {
        let peaceInfo = GameGlobal.DailyModel.peaceInfo
        let maxCount = GameGlobal.Config.DailyBaseConfig.chapterWar
        this.labWaveCount.textFlow = TextFlowMaker.generateTextFlow(`|C:0x019704&T:${peaceInfo.mCurValue}||C:0x6e330b&T:/${maxCount}|`)
        this.btnOneKey.enabled = !GameGlobal.DailyModel.IsPeaceTargetDone(maxCount)
    }

	public UpdateContent() {
        this.SetWaveInfo()
        UIHelper.ListRefresh(this.list)
	}

	public OnOpen() {
        this.observe(MessageDef.DAILY_PEACE_UPDATE, this.UpdateContent)
	}

	public OnClose() {
        
	}
    
    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnOneKey:
                let peaceInfo = GameGlobal.DailyModel.peaceInfo
                let maxCount = GameGlobal.Config.DailyBaseConfig.chapterWar
                let count = maxCount - peaceInfo.mCurValue
                let cost = GameGlobal.Config.DailyBaseConfig.chapterWarcost[0]
                WarnWin.show(`是否花费${cost.count * count}元宝快速完成？`, () => {
                    if (Checker.Money(cost.id, cost.count * count))
                    {
                        GameGlobal.DailyModel.SendQuilkDone(DailyConst.TYPE_PEACE)
                    }
                }, this)
            break
        }
    }
}

class DailyPeaceItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DailyPeaceItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected labText: eui.Label;
    protected item1: ItemBaseNotName;
    protected item2: ItemBaseNotName;
    protected item3: ItemBaseNotName;
    protected item4: ItemBaseNotName;
    protected btnGain: eui.Button;
    protected imgGained: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
	public childrenCreated() {
		this.btnGain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGainBtnClick, this)
	}

	public dataChanged() {
		let config = this.data
        this.btnGain.name = config.reward

        this.labText.text = `消灭${config.target}波奖励`
        this.imgGained.visible = GameGlobal.DailyModel.HasGainedPeaceReward(config.reward)
        this.btnGain.visible = !GameGlobal.DailyModel.HasGainedPeaceReward(config.reward)
        let redPointFlag = GameGlobal.DailyModel.IsPeaceTargetDone(config.target) && !GameGlobal.DailyModel.HasGainedPeaceReward(config.reward)
        UIHelper.ShowRedPoint(this.btnGain, redPointFlag)

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

    private _OnGainBtnClick(e: egret.TouchEvent) {
		let rewardNum = parseInt(e.currentTarget.name)
        if (!GameGlobal.DailyModel.IsPeaceTargetDone(this.data.target))
        {
            UserTips.ins().showTips("目标未达成，不可领取！")
            return
        }

        GameGlobal.DailyModel.SendGainAward(DailyConst.TYPE_PEACE, rewardNum)
    }
}
