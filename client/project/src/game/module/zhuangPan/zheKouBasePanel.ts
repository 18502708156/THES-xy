class zheKouBasePanel extends BaseView implements ICommonWindow {

    protected list: eui.List;
    protected time_txt: eui.Label;
    protected getwayLabel: GetwayLabel;
    protected scroller: eui.Scroller

    protected activityType: number
    protected _activityId: number;

    public constructor() {
        super()
        this.activityType = ActivityKaiFuFuncType.ACT_26_DisCountShop
        this.skinName = "zhuangPanShopSkin";
    }
    public childrenCreated() {
        this.list.itemRenderer = zhekouShopItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    }
    public OnOpen(...param: any[]) {
        this._activityId = param[0]
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent)
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent)
        this.AddClick(this.getwayLabel, this._OnClick);
        this.UpdateContent();
        this.AddTimer(1000, 0, this.updateTime)
        this.updateTime();

    }
    public set activityId(value) {
        this._activityId = value;
        this.UpdateContent();
    }
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

class zhekouShopItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // zhuangPanItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected name_txt: eui.Label;
    protected gainway_txt: eui.Label;
    protected priceIcon1: PriceIcon;
    protected priceIcon2: PriceIcon;

    protected imgBuyEnd: eui.Image;
    protected itemIcon: ItemBase;
    protected btn_buy: eui.Button;
    //protected btn_look: eui.Button;
    protected limit_txt: eui.Label;
    protected look_txt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super()
    }
    public childrenCreated() {
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        //this.btn_look.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this)
        this.gainway_txt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
    protected onClick(e: egret.TouchEvent): void {
        if (e.currentTarget == this.btn_buy) {
            if (!Checker.Money(this.data.cfg.gold.id, this.data.cfg.gold.count, true)) {
                return;
            }
            GameGlobal.ActivityKaiFuModel.sendReward(this.data.cfg.Id, this.data.cfg.index)
        } else if (e.currentTarget == this.gainway_txt) {
            let cfgObj = this.data.cfg

            GameGlobal.ViewManager.Guide(cfgObj.gainway[0][1][0])

        }
    }

    dataChanged() {

        let type = this.data.type;
        let cfgObj = this.data.cfg

        let actType = this.data.actType

        let activityData: ActivityType26Data = <ActivityType26Data>GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);

        this.itemIcon.data = cfgObj.itemid;
        this.itemIcon.isShowName(false)
        this.itemIcon.setCount(cfgObj.count);
        let goodsCfg = GameGlobal.Config.ItemConfig[cfgObj.itemid];
        this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        this.name_txt.text = goodsCfg.name;

        let buyNum = 0

        if (cfgObj.type.type == 2) {
            //不限购
            this.limit_txt.text = "不限购"
        } else {

            if (activityData) {
                buyNum = activityData.buynums[cfgObj.index - 1]
            }
            this.limit_txt.text = "限购（" + buyNum + "/" + cfgObj.type.value + "）"
        }
        let value = cfgObj.value;
        this.imgBuyEnd.visible = false;

        //buyNum = GameGlobal.ActivityKaiFuModel.advancedInfo.getBuyNum(cfgObj.Id);
        if (cfgObj.type.type != 2 && cfgObj.type.value <= buyNum) {
            this.imgBuyEnd.visible = true;
        } else {
            if (KaiFuTargetShopPanel.curLookIndex == -1) {
                KaiFuTargetShopPanel.curLookIndex = cfgObj.index
                GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_TARGET_ShOP_LOOK, cfgObj.index, cfgObj.pid, cfgObj.itemtype);
            }
        }

        this.btn_buy.visible = (this.imgBuyEnd.visible) ? false : true;
        this.priceIcon1.text = cfgObj.showgold;
        this.priceIcon2.text = cfgObj.gold.count;
        if (cfgObj.gainway) {
            this.gainway_txt.text = cfgObj.gainway[0][0]
            UIHelper.SetLinkStyleLabel(this.gainway_txt, cfgObj.gainway[0][0])
        }
        this.gainway_txt.visible = cfgObj.gainway

    }


}
