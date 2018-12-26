class DailyInfoPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "西游历练"

    /////////////////////////////////////////////////////////////////////////////
    // DailyInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected powerLabel: PowerLabel;
    protected labPropName1: eui.Label;
    protected labPropNum1: eui.Label;
    protected labPropName2: eui.Label;
    protected labPropNum2: eui.Label;
    protected labPropName3: eui.Label;
    protected labPropNum3: eui.Label;
    protected labLevel: eui.Label;
    protected btnUpgrade: eui.Button;
    protected progExp: eui.ProgressBar;
    protected labLvExp: eui.Label;
    protected imgIcon: eui.Image;
    protected imgQuality: eui.Image;
    protected btnPrev: eui.Button;
    protected btnNext: eui.Button;
    protected labUpgradeTip: eui.Label;
    protected upgradeGroup: eui.Group;
    protected item1: ItemBaseNotName;
    protected item2: ItemBaseNotName;
    protected item3: ItemBaseNotName;
    protected labActiveNum: eui.Label;
    protected progActive: eui.ProgressBar;
    protected boxItem1: DailyBoxItem;
    protected boxItem2: DailyBoxItem;
    protected boxItem3: DailyBoxItem;
    protected boxItem4: DailyBoxItem;
    protected boxItem5: DailyBoxItem;
    protected btnResRetrieve: eui.Button;
    protected btnExpRetrieve: eui.Button;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

    private mMedalId: number
    private mChooseMedalId: number

	public constructor() {
		super()

	}

    public childrenCreated() {
        this._AddClick(this.btnUpgrade, this._OnClick)
        this._AddClick(this.btnPrev, this._OnClick)
        this._AddClick(this.btnNext, this._OnClick)
        this._AddClick(this.btnResRetrieve, this._OnClick)
        this._AddClick(this.btnExpRetrieve, this._OnClick)

        this.list.itemRenderer = DailyTaskItem
        this.SetTaskList()
        this.SetRetrieveBtn()
        this.SetMedalInfo()
        this.SetActiveNumInfo()
    }

    public UpdateContent() {
        
    }

	public OnOpen() {
        this.observe(MessageDef.DAILY_ACTIVE_UPDATE, this.SetActiveNumInfo)
        this.observe(MessageDef.DAILY_MEDAL_UPDATE, this.SetMedalInfo)
        this.observe(MessageDef.DAILY_TASKLIST_UPDATE, this.SetTaskList)
        this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.SetRetrieveBtn)
        this.observe(MessageDef.DAILY_UPDATE_RETREVE_VIEW, this.SetRetrieveBtn)
	}

	public OnClose() {
        
	}

    private SetRetrieveBtn() {
        UIHelper.ShowRedPoint(this.btnExpRetrieve, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.EXP_RETRIEVE))
        UIHelper.ShowRedPoint(this.btnResRetrieve, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.RES_RETRIEVE))
    }

    private SetTaskList() {
        let taskList = CommonUtils.GetArray(GameGlobal.Config.DailyProgressConfig, "id")
        let getWeight = function (config) {
			let confId = config.id
            if (GameGlobal.DailyModel.GetTaskCount(confId) >= config.maxtimes)
                confId += 1000

            let curLevel = GameGlobal.actorModel.level
            if (curLevel < config.openlv)
                confId += 500
    
			return confId
		}

		taskList.sort(function (lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})

        this.list.dataProvider = new eui.ArrayCollection(taskList)
    }

    private SetActiveNumInfo() {
        let baseInfo = GameGlobal.DailyModel.baseInfo
        this.labActiveNum.text = baseInfo.mCurActive.toString()

        let maxActiveNum = GameGlobal.Config.DailyBaseConfig.activeupnum
        this.progActive.maximum = GameGlobal.Config.DailyBaseConfig.activeupnum
        this.progActive.value = baseInfo.mCurActive
        let boxList = CommonUtils.GetArray(GameGlobal.Config.DailyActiveConfig, "id")
        let idx = 1
        for (let config of boxList)
        {
            if (this[`boxItem${idx}`])
            {
                this[`boxItem${idx}`].visible = true
                this[`boxItem${idx}`].$setX((config.target / maxActiveNum) * 500 - 36)
                this[`boxItem${idx}`].setBoxInfo(config)
            }

            idx++
        }
    }

    private SetMedalInfo() {
        let baseInfo = GameGlobal.DailyModel.baseInfo
        this.mMedalId = DailyConst.GetMedalId(baseInfo.mLevel)
        this.SetMedal(this.mMedalId)

        this.labLevel.text = `Lv.${baseInfo.mLevel}`
        let curConfig = GameGlobal.Config.DailyAttrsConfig[baseInfo.mLevel]
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(curConfig.attrpower)
        UIHelper.ShowRedPoint(this.btnUpgrade, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.MEDAL_UPGRADE))

        let idx = 1
        for (let attr of curConfig.attrpower)
        {
            if (this[`labPropName${idx}`])
            {
                this[`labPropName${idx}`].text = `${AttributeData.getAttrStrByType(attr.type)}：`
                this[`labPropNum${idx}`].text = attr.value
            }

            idx++
        }

        let NextConfig = GameGlobal.Config.DailyAttrsConfig[baseInfo.mLevel+1]
        if (NextConfig)
        {
            this.progExp.maximum = NextConfig.proexp
            this.progExp.value = baseInfo.mExp
            this.labLvExp.text = `${baseInfo.mExp}/${NextConfig.proexp}`

            let idx = 1
            for (let reward of NextConfig.rewards)
            {
                if (this[`item${idx}`])
                {
                    this[`item${idx}`].visible = true
                    this[`item${idx}`].setItemAward(reward.type, reward.id, reward.count)
                }

                idx++
            }
        }
        else
        {
            this.progExp.maximum = 999
            this.progExp.value = 999
            this.labLvExp.text = ""
            this.btnUpgrade.filters = Color.GetFilter()
            this.btnUpgrade.enabled = false

            let idx = 1
            for (let reward of curConfig.rewards)
            {
                if (this[`item${idx}`])
                {
                    this[`item${idx}`].visible = true
                    this[`item${idx}`].setItemAward(reward.type, reward.id, reward.count)
                }

                idx++
            }
        }
        
    }

    private SetMedal(medalId) {
        this.mChooseMedalId = medalId
        let config = GameGlobal.Config.DailyMedalConfig[medalId]
        if (!config)
        {
            return
        }
        
        this.imgIcon.source = config.icon
        this.imgQuality.source = `ui_xyll_bm_${config.grade}`
        this.btnPrev.visible = DailyConst.HasPrevMedal(medalId)
        this.btnNext.visible = DailyConst.HasNextMedal(medalId) && medalId <= this.mMedalId
        this.labUpgradeTip.visible = medalId > this.mMedalId
        if (medalId > this.mMedalId)
        {
            let day = GameGlobal.DailyModel.GetTimeReach(config.level)
            let text = `|C:0x019704&T:${config.level}|C:0x6e330b&T:级激活(约|C:0x019704&T:${day}|C:0x6e330b&T:天后)|`
            this.labUpgradeTip.textFlow = TextFlowMaker.generateTextFlow(text)
        }
    }
    
    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnUpgrade:
                let baseInfo = GameGlobal.DailyModel.baseInfo
                let NextConfig = GameGlobal.Config.DailyAttrsConfig[baseInfo.mLevel+1]
                if (NextConfig.proexp <= baseInfo.mExp)
                {
                    GameGlobal.DailyModel.SendUpgradeMedal()
                }
            break
            case this.btnPrev:
                this.SetMedal(this.mChooseMedalId-1)
            break
            case this.btnNext:
                this.SetMedal(this.mChooseMedalId+1)
            break
            case this.btnExpRetrieve:
                GameGlobal.DailyModel.RecordExpFlag(true)
                ViewManager.ins().open(DailyExpRetrieveWin)
            break
            case this.btnResRetrieve:
                GameGlobal.DailyModel.RecordResFlag(true)
                ViewManager.ins().open(DailyResRetrieveWin)
            break
        }
    }
}

class DailyTaskItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DailyTaskItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgBg: eui.Image;
    protected labTaskName: eui.Label;
    protected labCount: eui.Label;
    protected labActiveTip: eui.Label;
    protected btnGoto: eui.Button;
    protected labTip: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
	public childrenCreated() {
		this.btnGoto.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGotoBtnClick, this)
	}

	public dataChanged() {
        let config = this.data
		this.imgBg.visible = this.itemIndex % 2 == 0
        this.btnGoto.name = config.id
        this.labTaskName.text = config.name
        this.labCount.text = `${GameGlobal.DailyModel.GetTaskCount(config.id)}/${config.maxtimes}`
        this.labActiveTip.text = `${config.exp}点/次`

        let curLevel = GameGlobal.actorModel.level
        if (GameGlobal.DailyModel.GetTaskCount(config.id) < config.maxtimes)
        {
            this.btnGoto.visible = curLevel >= config.openlv
            this.labTip.visible = curLevel < config.openlv
            this.labTip.text = `${config.openlv}级开启`
            this.labTip.textColor = Color.Red
            return
        }

        this.btnGoto.visible = false
        this.labTip.visible = true
        this.labTip.text = "已完成"
        this.labTip.textColor = Color.l_green_1
	}

    private _OnGotoBtnClick(e: egret.TouchEvent) {
        let taskId = parseInt(e.currentTarget.name)
        switch(taskId) {
            case DailyConst.TASK_TYPE_PERSONALBOSS:
                ViewManager.ins().open(BossMainPanel)
            break
            case DailyConst.TASK_TYPE_PUBLICBOSS:
                ViewManager.ins().openIndex(BossMainPanel, 1)
            break
            case DailyConst.TASK_TYPE_EQUIPSMELT:
                ViewManager.ins().open(SmeltEquipTotalWin);
            break
            case DailyConst.TASK_TYPE_ARENA:
                ViewManager.ins().open(ArenaWin)
            break
            case DailyConst.TASK_TYPE_MATERIALCOPY:
                ViewManager.ins().open(FbLayer)
            break
            case DailyConst.TASK_TYPE_ESCORT:
                ViewManager.ins().open(QujingMainWin)
            break
            case DailyConst.TASK_TYPE_TEAMCOPY:
                ViewManager.ins().open(CrossMainPanel)
            break
            case DailyConst.TASK_TYPE_PERCHARGE:
                RechargeWin.Open()
            break
        }

        ViewManager.ins().close(DailyMainWin)
    }
}
