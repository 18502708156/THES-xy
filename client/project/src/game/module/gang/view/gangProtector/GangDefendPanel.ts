class GangDefendPanel extends BaseView implements ICommonWindowTitle {
    public static NAME = "帮会守护"
    /////////////////////////////////////////////////////////////////////////////
    // GangDefendPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected petShowPanel: PetShowPanel;
    protected nameBg: eui.Image;
    protected lbName: eui.Label;
    protected challenge_btn: eui.Button;
    protected btnPrev: eui.Button;
    protected btnNext: eui.Button;
    protected renWuList: eui.List;
    protected curSkill_group: eui.Group;
    protected nextImage: eui.Image;
    protected curAttr_label: eui.Label;
    protected nextAttrs_label: eui.Label;
    protected exp_bar: eui.ProgressBar;
    protected protectAward_btn: eui.Image;
    protected defendImg: eui.Image;
    protected labLv: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    public static goto_types = [
        { "type": 0, "desc": "帮会妖怪" },
        { "type": 1, "desc": "采集" },
        { "type": 2, "desc": "收购橙色" },
        { "type": 3, "desc": "收购紫色" },
        { "type": 4, "desc": "收购蓝色" },
        { "type": 5, "desc": "收购绿色" },
        { "type": 6, "desc": "帮会蟠桃" },
        { "type": 7, "desc": "帮会副本" },
        { "type": 8, "desc": "帮会红色" },
    ]

    private defendInfo: GangProtectorInfo = new GangProtectorInfo();
    private maxLv = 0;
    private nextLv = 1;
    public constructor() {
        super()
        //this.skinName = "GangDefendPanelSkin"
    }

    public childrenCreated() {
        this.renWuList.itemRenderer = GangDefendItem;
        this.renWuList.dataProvider = new eui.ArrayCollection([]);

        this.exp_bar.slideDuration = 0;
        this.exp_bar.labelFunction = this.expFuncLabel
        for (var key in GameGlobal.Config.GuildActiveConfig) {
            this.maxLv++;
        }
        this.lbName.text = GameGlobal.Config.GuildConfig.activename;
    }
    private expFuncLabel(value, maximum): string {
        return value + "/" + maximum
    }
    public OnOpen() {
        this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, this.upDataProtectorInfo)
        this.observe(MessageDef.GANG_UPDATA_PROTECTOR_TASK_INFO, this.upDataTaskData)
        this._AddClick(this.challenge_btn, this._OnClick)
        this._AddClick(this.btnPrev, this._OnClick)
        this._AddClick(this.btnNext, this._OnClick)
        this._AddClick(this.protectAward_btn, this._OnClick)
        GameGlobal.GangModel.sendGetProtectorInfo();
        this.upDataProtectorInfo();
        this.upDataTaskData();
    }

    public OnClose() {

    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.challenge_btn:

                var curNeed = GameGlobal.Config.GuildActiveConfig[this.nextLv].exp
                if (this.defendInfo.totalActive < curNeed) {
                    UserTips.ins().showTips("活跃点不足")
                    return;
                }
                GameGlobal.GangModel.sendProtectorUpLv();
                break
            case this.btnPrev:
                if (this.nextLv > 1)
                    this.nextLv -= 1;
                this.UpdateContent();
                break
            case this.btnNext:
                if (this.nextLv < this.maxLv)
                    this.nextLv += 1;
                this.UpdateContent();
                break
            case this.protectAward_btn:
                ViewManager.ins().open(GangProtectorJinJieAwardWin, this.nextLv)
                break
        }
    }

    private upDataProtectorInfo(rsp?) {
        this.defendInfo = GameGlobal.GangModel.protectorInfo
        if (!this.defendInfo) {
            return
        }
        this.nextLv = GameGlobal.GangModel.protectorInfo.protectorLv + 1;
        this.UpdateContent();
    }
    UpdateContent(): void {
        if (!this.defendInfo) {
            return
        }

        this.labLv.text = `${this.defendInfo.protectorLv}`

        var config = GameGlobal.Config.GuildActiveConfig[this.nextLv];
        if (config != null) {
            //this.lbName.text = config.
            var curAttr = [];
            if (this.nextLv <= 1) {
                for (let i = 0; i < config.attrpower.length; i++) {
                    curAttr[i] = { value: 0, 'type': config.attrpower[i].type };
                }
            }
            else
                curAttr = GameGlobal.Config.GuildActiveConfig[this.nextLv - 1].attrpower;
            this.curAttr_label.textFlow = TextFlowMaker.generateTextFlow(AttributeData.getAttStr(curAttr, 0, 1, "："))

            var nextConfig = GameGlobal.Config.GuildActiveConfig[this.nextLv];
            if (nextConfig != null) {
                this.curAttr_label.x = 13;
                this.nextImage.visible = true;
                this.nextAttrs_label.textFlow = TextFlowMaker.generateTextFlow(AttributeData.getAttStr(nextConfig.attrpower, 0, 1, "："))
                this.exp_bar.maximum = nextConfig.exp;
            } else {
                this.curAttr_label.x = 113;
                this.nextImage.visible = false;
                this.nextAttrs_label.text = "";
                this.exp_bar.value = config.exp;
            }
            this.exp_bar.value = this.defendInfo.totalActive;
        }
        // this.petShowPanel.SetBody(GangConst.GetFuBenBossSkin(config.bossid))
        this.defendImg.source = GameGlobal.Config.GuildActiveConfig[this.nextLv].pid;
    }
    private upDataTaskData() {
        let tail = [];
        let head = [];
        var config = GameGlobal.Config.GuildTaskConfig;
        let taskInfos: Sproto.protector_task_info[] = GameGlobal.GangModel.gangProtectorTaskInfo
        for (var key in config) {
            var count = 0;
            for (var i = 0; i < taskInfos.length; i++) {
                if (taskInfos[i].taskId == parseInt(key)) {
                    count = taskInfos[i].count;
                }
            }
            let item = { "taskid": config[key].taskid, "maxCount": config[key].num, "curCount": count, "exp": config[key].exp, "name": config[key].name };
            if (item.maxCount <= item.curCount)
                tail.push(item)
            else
                head.push(item)
        }
        (this.renWuList.dataProvider as eui.ArrayCollection).replaceAll(head.concat(tail));
    }
    private UpdateRedPoint() {

    }
}
class GangDefendItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    // GangDefendListItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected itemName: eui.Label;
    protected time_txt: eui.Label;
    protected exp_txt: eui.Label;
    protected go_btn: eui.Button;
    protected bg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    private _playerId: number

    public constructor() {
        super();

    }
    childrenCreated(): void {
        super.childrenCreated()
        this.go_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
    }
    private onTap(e): void {
        if (this.data.taskid == 1007) {
            ViewManager.ins().close(GangProtectorMainWin);
            ViewManager.ins().close(GangMainWin);
            ViewManager.ins().openIndex(GangMainWin, GangMainWin.GANG_PANTAOHUI_PANEL);
        }
        else if (this.data.taskid == 1008) {
            ViewManager.ins().close(GangProtectorMainWin);
            ViewManager.ins().close(GangMainWin);
            ViewManager.ins().openIndex(GangMainWin, GangMainWin.GANG_FUBEN_PANEL);
        }
        // else if (this.data.taskid == 1001) {
        //     ViewManager.ins().close(GangProtectorMainWin)
        //     ViewManager.ins().open(GangBossPanel)
        // }
        else {
            if (!UserFb.CheckFighting())
                return
                
            GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.GuildConfig.mapid)
            ViewManager.ins().close(GangProtectorMainWin)
            ViewManager.ins().close(GangMainWin)
        }
    }
    public dataChanged() {
        this.itemName.text = this.data.name;
        this.time_txt.text = this.data.curCount + "/" + this.data.maxCount;
        this.exp_txt.text = this.data.exp;
        if (this.itemIndex % 2 != 0) {
            this.bg.visible = false
        } else {
            this.bg.visible = true;
        }
        this.itemName.text = this.data.name;
    }

    $onRemoveFromStage(): void {
        super.$onRemoveFromStage();

        if (this.go_btn) this.go_btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTap, this)
    }

}