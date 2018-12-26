class KaiFuJiJieShopPanel extends BaseView implements ICommonWindow {
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieShopPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected time_txt: eui.Label;
    protected scroller: eui.Scroller;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

    // 进阶类型
    public jijieType: number


    public constructor() {
        super()
        this.skinName = "KaiFuJiJieShopPanelSkin";
    }
    public childrenCreated() {
        this.list.itemRenderer = KaiFuJiJieShopItem;
        this.list.dataProvider = new eui.ArrayCollection
    }
    public OnOpen() {
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent)
        this.AddTimer(1000, 0, this.updateTime)
        this.UpdateContent();
        this.updateTime();
    }
    private updateTime(): void {
        var time = DateUtils.format_1(GameServer.dayEndTime - GameServer.serverTimeMilli);
        this.time_txt.textFlow = TextFlowMaker.generateTextFlow(`活动倒计时：|C:0x2dff42&T:${time}|`);
    }
    public OnClose() {
        TimerManager.ins().removeAll(this)
    }
    public UpdateContent() {
        if (!this.visible) return;
        let type = this.jijieType
        let arrlist = this.getShopList();
        let weight = (data) => {
            let buyNum = GameGlobal.ActivityKaiFuModel.advancedInfo.getBuyNum(data.cfg.shopid);
            if (data.cfg.type.type != 2 && data.cfg.type.value <= buyNum) {
                return data.cfg.shopid + 1000;
            }

            if (GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(data.cfg.value.type) >= data.cfg.value.value) {
                return data.cfg.shopid - 1000
            } 

            return data.cfg.shopid;
        }
        arrlist.sort((lhs, rhs) => {
            return weight(lhs) - weight(rhs)
        });
        (<eui.ArrayCollection>this.list.dataProvider).replaceAll(arrlist)
    }
    public getShopList(): any {
        let type = this.jijieType
        let config = GameGlobal.Config.ProgressCrazyShopConfig;
        let arr = []
        let obj = config[type];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let cfgObj = obj[key];
                let o: any = {};
                o.type = type;
                o.cfg = cfgObj
                arr.push(o);
            }
        }
        return arr
    }


    private _OnClick(e: egret.TouchEvent) {

    }

}

class KaiFuJiJieShopItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieShopItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected name_txt: eui.Label;
    protected disPirce_txt: eui.Label;
    protected priceIcon1: PriceIcon;
    protected priceIcon2: PriceIcon;
    protected info: eui.Label;
    protected imgBuyEnd: eui.Image;
    protected itemIcon: ItemBase;
    protected buy: eui.Button;
    protected times_txt: eui.Label
    protected mark: eui.Group
    /////////////////////////////////////////////////////////////////////////////



    public constructor() {
        super()
    }
    public childrenCreated() {

        this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
    protected onClick(e: egret.TouchEvent): void {
        if (this.info.text != "") {
            UserTips.InfoTip("进阶条件不满足");
            return
        }
        if (!Checker.Money(this.data.cfg.gold.id, this.data.cfg.gold.count, true)) {
            return;
        }
        GameGlobal.ActivityKaiFuModel.Send_advanced_buy(this.data.cfg.shopid, 1, this.data.cfg.orderid)
    }

    dataChanged() {

        let type = this.data.type;
        let cfgObj = this.data.cfg
        this.itemIcon.isShowName(false);
        this.itemIcon.data = cfgObj.itemid;
        this.itemIcon.setCount(cfgObj.count)
        let goodsCfg = GameGlobal.Config.ItemConfig[cfgObj.itemid];
        this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        this.name_txt.text = goodsCfg.name;

        let value = cfgObj.value;
        this.imgBuyEnd.visible = false;
        let buyNum = 0;
        if (GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(value.type) < value.value) {
            if (value.type == 100) {
                this.info.text = "VIP" + value.value + "解锁";
            } else {
                this.info.text = ActivityConst.JiJieTypeName(value.type) + "达到" + value.value + "阶解锁";
            }
        } else {
            this.info.text = "";
            buyNum = GameGlobal.ActivityKaiFuModel.advancedInfo.getBuyNum(cfgObj.shopid);
            if (cfgObj.type.type != 2 && cfgObj.type.value <= buyNum) {
                this.imgBuyEnd.visible = true;
            }
        }
        if (cfgObj.type.type == 2) {
            //不限购
            this.times_txt.text = ""
        } else {
            this.times_txt.text = "限购(" + buyNum + "/" + cfgObj.type.value + ")"
        }

        this.buy.visible = (this.imgBuyEnd.visible || this.info.text != "") ? false : true;
        this.priceIcon1.text = CommonUtils.overLength(cfgObj.showgold)
        this.priceIcon2.text = CommonUtils.overLength(cfgObj.gold.count)
        this.priceIcon1.type = this.priceIcon2.type = cfgObj.gold.id
        this.mark.visible = cfgObj.mark;
        if (this.mark.visible) {
            this.disPirce_txt.text = cfgObj.mark + "折";
        }

    }


}