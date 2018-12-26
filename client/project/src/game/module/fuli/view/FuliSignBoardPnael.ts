class FuliSignBoardPnael extends BaseView {
    /////////////////////////////////////////////////////////////////////////////
    // SignBoardSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected scroller: eui.Scroller;
    protected list: eui.List;
    protected awardTxt: eui.Label;
    protected signDayTxt: eui.Label;
    protected awardIcon: ItemBaseNotName;
    protected btn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////
    protected dataPrvidre: eui.ArrayCollection
    public constructor() {
        super();
        this.skinName = "FuliSignBoardSkin"

    }

    childrenCreated() {
        this.list.itemRenderer = FuliSignBoardItem;
        this.dataPrvidre = new eui.ArrayCollection
        let dailyId = GameGlobal.FuliModel.FuliData.dailyId;
        let itemData = {};
        itemData["type"] = 1;
        itemData["tips"] = "每日登录可领取"
        itemData["item"] = GameGlobal.Config.SignInConfig[dailyId]['dailyreward']
        this.dataPrvidre.addItem(itemData);

        itemData = {}
        itemData["type"] = 2;
        itemData["tips"] = `vip${GameGlobal.Config.WelfareBaseConfig.viplv}可领取`
        itemData["item"] = GameGlobal.Config.SignInConfig[dailyId]['vipreward']
        this.dataPrvidre.addItem(itemData);

        itemData = {}
        itemData["type"] = 3;
        itemData["tips"] = '充值任意金额可领取'
        itemData["item"] = GameGlobal.Config.SignInConfig[dailyId]['rechargereward']
        this.dataPrvidre.addItem(itemData);


    }
    public OnOpen(...param: any[]) {
        this.AddClick(this.btn, this.onClick)
        this.observe(MessageDef.FULI_GET_GIFT_SUCCEED, this.getGiftSucceed)
        this.UpdateContent()
    }

    private UpdateContent() {
        this.list.dataProvider = this.dataPrvidre;
        this.signDayTxt.textFlow = TextFlowMaker.generateTextFlow(`累计登录|C:${Color.Green}&T:${GameGlobal.FuliModel.FuliData.accDay}|C:${Color.White}&T:天`)
        this.awardTxt.textFlow = TextFlowMaker.generateTextFlow(`累计登录|C:${Color.Green}&T:${GameGlobal.FuliModel.FuliData.accDay}|C:${Color.White}&T:天奖励`)
        CommonUtils.addLableStrokeColor(this.awardTxt, Color.Black, 1);
        CommonUtils.addLableStrokeColor(this.signDayTxt, Color.Black, 1);
        this.getGiftSucceed();
    }

    private onClick() {
        GameGlobal.FuliModel.sendSignIn(4)
    }

    private  getGiftSucceed() {
        let config = GameGlobal.Config.AccSignInConfig;
        let accDay = GameGlobal.FuliModel.FuliData.accDay;
        let maxDay = 30;
        for (let key in config)
            maxDay = config[key].day

        this.btn.touchEnabled = (GameGlobal.FuliModel.FuliData.rewardMark & (1 << 3)) < 1;
        this.awardIcon.data = config[accDay > maxDay ? maxDay : accDay].reward[0];
        if (!this.btn.touchEnabled) {
            this.awardIcon.data = config[accDay >= maxDay ? maxDay : accDay + 1].reward[0];
            this.awardTxt.textFlow = TextFlowMaker.generateTextFlow(`累计登录|C:${Color.Green}&T:${GameGlobal.FuliModel.FuliData.nextGiftDay}|C:${Color.White}&T:天奖励`)
        }

        this.btn.filters = (GameGlobal.FuliModel.FuliData.rewardMark & (1 << 3)) < 1 ? null : Color.GetFilter();

        UIHelper.ListRefresh(this.list)
    }

    public static CheckRedPoint() {
        return GameGlobal.FuliModel.mRedPoint.signShowRedPoint();
    }
}

class FuliSignBoardItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // SignBoardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tipsTxt: eui.Label;
    protected list: eui.List;
    protected btn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////


    public constructor() {
        super();
        this.skinName = "FuliSignBoardItemSkin"
    }

    childrenCreated() {
        this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    dataChanged() {
        this.tipsTxt.text = this.data.tips;
        this.list.dataProvider = new eui.ArrayCollection(this.data.item)
        this.getGiftSucceed();

    }
    protected getGiftSucceed() {
        this.btn.touchEnabled = (GameGlobal.FuliModel.FuliData.rewardMark & (1 << this.data.type - 1)) < 1;
        this.currentState = (GameGlobal.FuliModel.FuliData.rewardMark & (1 << this.data.type - 1)) < 1 ? "normal" : "get";
    }
    protected onClick() {
        GameGlobal.FuliModel.sendSignIn(this.data.type)
    }
}
