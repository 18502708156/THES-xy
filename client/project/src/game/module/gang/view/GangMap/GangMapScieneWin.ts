class GangMapScieneWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_GAME_MAP;
	public static VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM

    /////////////////////////////////////////////////////////////////////////////
    // GangMapSceneSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected groupTask: eui.Group;
    protected item1: GangMapTaskItem;
    protected item2: GangMapTaskItem;
    protected cbAuto: eui.CheckBox;
    protected btnArr: eui.Button;
    protected groupAdaptation: eui.Group;
    protected btnExchange: eui.Button;
    protected labTip: eui.Label;
    protected groupPick: eui.Group;
    protected bar: eui.ProgressBar;
    /////////////////////////////////////////////////////////////////////////////

    private mPickTime: number

	public constructor() {
		super()
		this.skinName = "GangMapSceneSkin"

        this._AddClick(this.btnArr, this._OnClicked)
        this._AddClick(this.btnExchange, this._OnClicked)
        this.cbAuto.addEventListener(egret.Event.CHANGE, this._OnCbAutoChange, this)

        GameGlobal.GangMapModel.SendGetMapTaskInfo()
        GameGlobal.GangMapModel.SendGetExchange()
	}

	public OnOpen() {
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
        this.observe(MessageDef.GANGMAP_UPDATE_TASKINFO, this.UpdateItem)
        this.observe(MessageDef.GANGMAP_START_PICKPLANT_NOTICY, this._StartPickPlant)
        this.observe(MessageDef.GANGMAP_ONEKEYFINISH, this._UpdateCheckBox)
        this.observe(MessageDef.GANGMAP_HIDEPICKPROGRESS, this._HidePickProgress)
        this.observe(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO, this.UpdateRedPoint)

        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)

        this.bar.maximum = GameGlobal.Config.GuildConfig.collectiontime * 10
        let multiTime = GameGlobal.Config.GuildConfig.doubletime
        this.labTip.text = `召集时间： ${multiTime.star}-${multiTime.ends}在帮会进行任务可获得多倍经验`
        this.groupPick.visible = false
        this.AdaptationGroup(false)
        this.UpdateRedPoint()
	}

    public UpdateItem() {
        let taskList = CommonUtils.GetArray(GameGlobal.Config.GuildMapTaskConfig, "id")
        this.item1.SetTaskInfo(1, taskList[0])
        this.item2.SetTaskInfo(2, taskList[1])

        this.UpdateRedPoint()
    }

	public OnClose() {
		TimerManager.ins().removeAll(this)
	}

    private UpdateRedPoint() {
        UIHelper.ShowRedPoint(this.btnExchange, GameGlobal.GangMapModel.CanItemExchange())
    }

    private _OnClicked(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnArr:
                this.ShowTaskView(this.btnArr.$getScaleX() != -1)
            break
            case this.btnExchange:
                ViewManager.ins().open(GangMapExchangeWin)
            break
        }
    }

    private _StartPickPlant() {
        this.groupPick.visible = true
        this.mPickTime = 0
        let totalTime = GameGlobal.Config.GuildConfig.collectiontime
        this.AddTimer(100, totalTime * 10, this._UpdateBar)
    }

    private _UpdateCheckBox() {
        this.cbAuto.selected = false
        GameGlobal.GangMapModel.SetAutoTask(false)
    }

    private _HidePickProgress() {
        this.groupPick.visible = false
        this.bar.value = 0
        TimerManager.ins().removeAll(this)
        this._UpdateCheckBox()
    }

    private _UpdateBar() {
        this.mPickTime++
        this.bar.value = this.mPickTime

        if (this.mPickTime == GameGlobal.Config.GuildConfig.collectiontime * 10)
        {
            this.groupPick.visible = false
            this.bar.value = 0
        }
    }
    
    private _OnCbAutoChange() {
        GameGlobal.GangMapModel.SetAutoTask(this.cbAuto.selected)
    }

    private AdaptationGroup(zoomFlag) {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation)
		this.groupAdaptation.y -= 160

        this.ShowTaskView(!zoomFlag)
    }

    private ShowTaskView(isShow) {
        this.btnArr.$setScaleX(isShow ? -1 : 1)
        this.groupTask.visible = isShow
    }
}