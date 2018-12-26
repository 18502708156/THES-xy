class KaiFuTargetBasePanel extends BaseView {

    protected list: eui.List;
    protected time_txt: eui.Label;
    protected getwayLabel: GetwayLabel;
    protected scroller: eui.Scroller

    protected activityType: number
    protected _activityId: number;

    public childrenCreated() {
        this.list.itemRenderer = KaiFuTargetBaseAwardItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    }
    public OnOpen() {
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
        if (this.getwayLabel) {
            this.AddClick(this.getwayLabel, this._OnClick);
        }
        this.UpdateContent();
        this.AddLoopTimer(1000, this.updateTime)
    }
    // public set activityId(value) {
    //     this._activityId = value;
    //     this.UpdateContent();
    // }
    private updateTime(): void {
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow(activityData.getRemindTimeString())
        } else {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow("活动未开启")
        }
    }
    protected getReward(): any {
        let arr = []
        let config = ActivityConst.GetConfigByActityType(this.activityType)[this._activityId];
        let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);

        let i: number;
        let len: number = config.length;
        for (i = 0; i < len; i++) {
            let cfgObj = config[i];
            if (cfgObj.Id != this._activityId) {
                continue
            }
            let o: any = {};
            o.cfg = cfgObj
            o.actType = this.activityType
            o.weight = cfgObj.index;
            if (activityData) {
                let canGet = activityData.canGetRecordByIndex(cfgObj.index)
                let getted = activityData.GetRecordByIndex(cfgObj.index)
                if (canGet) {
                    if (getted) o.weight += 1000;
                    else o.weight -= 1000;
                } else if (getted) o.weight += 1000;
            }
            arr.push(o);
        }
        return arr
    }

    public OnClose() {

    }
    
    public UpdateContent() {
        if (!this.visible) return;
        if (!this._activityId) return;
        let arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        if (this.list.dataProvider) {
            (this.list.dataProvider as eui.ArrayCollection).replaceAll(arrlist);
        } else {
            this.list.dataProvider = new eui.ArrayCollection(arrlist);
        }
        //this.list.dataProvider = new eui.ArrayCollection(arrlist); 
    }

    protected _OnClick(e: egret.TouchEvent) {

    }
}

class KaiFuTargetBaseAwardItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieAwardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tipsTxt: eui.Label;
    protected list: eui.List;
    protected btn: eui.Button;
    protected getted_img: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super()
    }
    public childrenCreated() {
        this.list.itemRenderer = ItemBaseShowCountNoName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
    private onClick(e: egret.TouchEvent): void {
        let cfgObj = this.data.cfg
        if (this.btn.label == "领 取") {
            GameGlobal.ActivityKaiFuModel.sendReward(cfgObj.Id, cfgObj.index)
        } else {
            if (cfgObj.gainway) {
                GameGlobal.ViewManager.Guide(cfgObj.gainway[0][1][0])
            }
            // switch (this.data.actType)
            // {
            //     case ActivityKaiFuFuncType.ACT_3_RechargeContinue:

            //         break;  
            //     case ActivityKaiFuFuncType.ACT_20_RechargeGroupon:

            //         break; 
            //     case ActivityKaiFuFuncType.ACT_1_Upgrade:

            //         break; 
            //     case ActivityKaiFuFuncType.ACT_21_OutdrawDiscountShop:

            //         break; 
            // }

        }

    }

    dataChanged() {

        let type = this.data.type;
        let cfgObj = this.data.cfg
        let weight = this.data.weight;
        let actType = this.data.actType

        let activityData: ActivityType3Data = <ActivityType3Data>GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
        this.btn.visible = weight < 100;
        this.btn.label = (weight > 0 && weight < 100) ? (cfgObj.gainway ? "前 往" : "未达成") : "领 取";
        UIHelper.ShowRedPoint(this.btn, weight < 0)
        this.getted_img.visible = !this.btn.visible
        this.list.dataProvider = new eui.ArrayCollection(cfgObj.rewards);

        let str = ""

        switch (actType) {
            case ActivityKaiFuFuncType.ACT_3_RechargeContinue:
                str = "连接充值" + cfgObj.rechargeday + "天（" + (activityData ? activityData.day : 0) + "/" + cfgObj.rechargeday + "）"
                break;
            case ActivityKaiFuFuncType.ACT_20_RechargeGroupon:
                str = "战力达到 " + CommonUtils.overLength(cfgObj.value);
                break;
            case ActivityKaiFuFuncType.ACT_1_Upgrade:
                str = "角色达到 " + cfgObj.value + "级"
                break;
            case ActivityKaiFuFuncType.ACT_21_OutdrawDiscountShop:
                str = "今日充值人数达" + cfgObj.type + "人";
                if (cfgObj.value == 1) {
                    str += "且个人充值任意金额"
                } else if (cfgObj.value > 1) {
                    str += "且个人充值金额达" + cfgObj.value + "元"
                }
                break;
        }
        this.tipsTxt.textFlow = TextFlowMaker.generateTextFlow(str);
    }
}