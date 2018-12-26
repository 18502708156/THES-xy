class ZhuangPanShopPanel extends BaseView implements ICommonWindow {
    public img: eui.Image
    public bnt: eui.Image
    public click: boolean = true
    public items: eui.Group
    public zhuangPanBg: eui.Image;
    public lastTime: eui.Label;
    public times: eui.Label;
    public bar: eui.ProgressBar;
    public barText: eui.Label
    public say: eui.Label
    public cj: eui.Image

    protected activityType: number
    protected _activityId: number;
    protected index: number = 0
    public activityData: ActivityType6Data

    public constructor() {
        super()
        this.skinName = "zhuangPanPanelSkin";
    }

    public childrenCreated() {

    }

    public OnOpen(...param: any[]) {
        this._activityId = param[0]
        //       this._AddClick(this.bnt, this._Onclick)
        this._AddClick(this.cj, this._Onclick)
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateIndex)
        this.observe(MessageDef.ACTIVITY_ADVANCED_ZHUANG_PAN_RULE, this._anminRota)
        this.AddTimer(1000, 0, this.UpdataTime)
        this.UpdateContent()
    }

    public OnClose() {

    }

    public _Onclick() { 
        if (this.activityData.openState == 0 && this.activityData.drawtime <= 0) {
            UserTips.InfoTip("活动结束")
            return
        }

        if (this.activityData.drawtime <= 0) {
            UserTips.InfoTip("没有次数")
            return
        }

        if (!this.click) {
            return
        }
        GameGlobal.ActivityKaiFuModel.sendReward(this._activityId, 1)
    }

    public _anminRota(rsp) {
        let rota = Math.random() * 360 + 360 * 7
        if (this.click) {
            this.click = false
            egret.Tween.get(this.bnt).to({ rotation: rota }, 3000, egret.Ease.sineInOut).call(() => {
                ViewManager.ins().open(ZhuangPanResultPanel, rsp)
                this.click = true
                this.bnt.rotation = 0
            })
        }
    }

    public UpdateIndex(index) {
        if (index == this._activityId) {
            this.UpdateContent()
        }
        return
    }

    public UpdateContent() {
        this.activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId) as ActivityType6Data
        this.index = this.activityData.reachindex || 0
        if (this.index == 10) {
            this.index = 9
        }
        this.times.text = "次数:" + (this.activityData.drawtime || 0)
        this.UpdateItems()
        this.UpdateBar()
        this.UpdataTime()
        this.UpdataBg()
    }

    public UpdateItems() {
        let Config = GameGlobal.Config.ActivityType6Config[this._activityId][this.index]
        for (let i = 0; i < this.items.numChildren; i++) {
            let item = this.items.getChildAt(i) as ZhuangPanitem
            //for (let a = 0; a < Config.showitem.length; a++) {
            item.data = Config.showitem[i]
            //}
        }
    }

    public UpdataTime() {
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            this.lastTime.textFlow = TextFlowMaker.generateTextFlow(activityData.getRemindTimeString())
        } else {
            this.lastTime.textFlow = TextFlowMaker.generateTextFlow("活动未开启")
        }
    }

    public UpdateBar() {
        let curIndex = this.index
        if (this.index == 10) {
            curIndex = 9
        }
        let Config = GameGlobal.Config.ActivityType6Config[this._activityId][curIndex]
        this.zhuangPanBg.source = Config.pic
        this.bar.maximum = Config.value
        this.bar.value = this.activityData.value || 0
        let text = Config.text
        let arry = text.split("%s")
        this.barText.text = arry[0] + "" + (Config.value - (this.activityData.value || 0)) + "" +arry[1]+"" + Config.count + "" + arry[2]
        if (Config.value - this.activityData.value <= 0 && curIndex == 9) {
            this.barText.text = "已达到最大数额"
        }
    }

    public UpdataBg() {
        if (this.activityData.openState == 0) {
            this.lastTime.visible = false
            if (this.activityData.drawtime <= 0) {
                this.say.text = "活动结束"
            } else {
                this.say.text = "活动结束 \n 您还有" + (this.activityData.drawtime || 0) + "次抽奖请尽快使用"
            }
        } else {
            this.say.text = ""
        }
    }
}


class ZhuangPanitem extends eui.ItemRenderer {
    private item:ItemBaseNotName
    private quality:eui.Image
    public childrenCreated() {

    }

    public dataChanged() {
           this.item.data = this.data;
           this.quality.source = ""
           if(GameGlobal.Config.ItemConfig[this.data.id].quality == 4){
               this.quality.source = "ui_jchd_bm_zhenping";
           }
           if(GameGlobal.Config.ItemConfig[this.data.id].quality == 5){
               this.quality.source = "ui_jchd_bm_zhenxi";
           }
           
    }

}