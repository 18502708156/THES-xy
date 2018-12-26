class LingLongRankPanel extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // GuaQiaRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected list: eui.List;
    protected isMeTxt: eui.Label;
    protected guanQiaTxt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
    public constructor() {
        super();
        this.skinName = 'GuaQiaRankSkin';
    }

    initUI() {
        super.initUI();
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "玲珑塔排行榜";
    };
    initData() {
        this.list.itemRenderer = LingLongRankItem;
    }

    OnOpen(...param: any[]) {
        GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_LLT);
        this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent)
        this.UpdateContent();
    }

    UpdateContent() {
        let rankData = GameGlobal.RankingModel.ranks[RankingModel.RANK_TYPE_LLT]
        this.list.dataProvider = new eui.ArrayCollection(rankData.datas)
        this.guanQiaTxt.text = `${GameGlobal.UserFb.lltModel.layer}层`
        let isMe;
        for (let value of rankData.datas) {
            if (value.id == GameGlobal.actorModel.actorID)
                isMe = true
        }
        if (isMe)
            this.isMeTxt.text = `${rankData.selfRank}`;
        else
            this.isMeTxt.text = "未上榜"
    }
}

class LingLongRankItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GuaQiaRankItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected rankTxt: eui.Label;
    protected nameTxt: eui.Label;
    protected guanQiaTxt: eui.Label;
    protected powerTxt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////


    public constructor() {
        super();
        this.skinName = "GuaQiaRankItemSkin"
    }

    public childrenCreated() {
        super.childrenCreated()
    }

    public dataChanged() {
        if (this.itemIndex % 2 == 0)
            this.currentState = "state1"
        else
            this.currentState = "state2"
        this.rankTxt.textColor = 0x6C310A;
        this.nameTxt.textColor = 0x6C310A;
        if (this.data.pos == 1) {
            this.rankTxt.textColor = 0xFF5900;
            this.nameTxt.textColor = 0xFF5900;
        }
        else if (this.data.pos == 2) {
            this.rankTxt.textColor = 0xAF2BB7;
            this.nameTxt.textColor = 0xAF2BB7;
        }
        else if (this.data.pos == 3) {
            this.rankTxt.textColor = 0x5A6EE7;
            this.nameTxt.textColor = 0x5A6EE7;
        }
        this.rankTxt.text = this.data.pos
        this.nameTxt.text = this.data.name
        this.guanQiaTxt.text = this.data.chapterlevel + "层"
        this.powerTxt.text = this.data.power
    }
} 