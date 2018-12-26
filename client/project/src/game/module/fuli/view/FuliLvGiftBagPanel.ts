class FuliLvGiftBagPanel extends BaseView {
    /////////////////////////////////////////////////////////////////////////////
    // LevelGiftBagSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////
    protected giftLv;

    public static CheckRedPoint() {
        return GameGlobal.FuliModel.mRedPoint.lvShowRedPoint();
    }
    public constructor() {
        super();
        this.skinName = "FuliLvGiftBagSkin"
        this.list.itemRenderer = FuliliLvGiftBagItem;
    }

    public OnOpen(...param: any[]) {
        this.observe(MessageDef.FULI_GET_GIFT_SUCCEED, this.UpdateContent)
        this.observe(MessageDef.LEVEL_CHANGE, this.UpdateList)

        this.UpdateContent()
        let config = GameGlobal.Config.LvRewardConfig;
        for (let val of config) {
            if (GameGlobal.actorModel.level < val.level) {
                this.giftLv = val.level;
                break;
            }
        }
    }

    UpdateContent() {
        let tail = [];
        let head = [];
        for (let key in GameGlobal.Config.LvRewardConfig) {
            let itemData = {};
            itemData = GameGlobal.Config.LvRewardConfig[key];
            itemData["tips"] = `${GameGlobal.Config.LvRewardConfig[key].level}级礼包`;
            if (BitUtil.Has(GameGlobal.FuliModel.FuliData.lvMark, itemData["id"]))
                tail.push(itemData)
            else
                head.push(itemData)
        }
        SortTools.sortMap(tail, "level", false)
        SortTools.sortMap(head, "level")
        this.list.dataProvider = new eui.ArrayCollection(head.concat(tail));

        this.UpdateList()
    }

    private UpdateList() {
        UIHelper.ListRefresh(this.list)
    }
}

class FuliliLvGiftBagItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // SignBoardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tipsTxt: eui.Label;
    protected list: eui.List;
    protected btn: eui.Button;
    protected maylvTxt: eui.Label;
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
        this.list.dataProvider = new eui.ArrayCollection(this.data.reward)
        this.getGiftSucceed();

    }
    protected getGiftSucceed() {
        this.currentState = GameGlobal.actorModel.level >= this.data.level ? (GameGlobal.FuliModel.FuliData.lvMark & 1 << this.data.id) < 1 ? "normal" : "get" : "maylv"
        this.maylvTxt.textFlow = TextFlowMaker.generateTextFlow(`${GameGlobal.actorModel.level}级 / |C: ${Color.l_brown_2}&T:${this.data.level}级`);
    }
    protected onClick() {
        GameGlobal.FuliModel.sendLvGiftBag(this.data.id)
    }
}