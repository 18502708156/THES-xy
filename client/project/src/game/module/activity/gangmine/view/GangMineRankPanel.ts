class GangMineRankPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Main;

    /////////////////////////////////////////////////////////////////////////////
    // GangMineRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected list: eui.List;
    protected trank: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super()
    }

    initUI() {
        super.initUI();
        this.skinName = "GangMineRankSkin";
        this.commonWindowBg.SetTitle('排名');
    };

    initData() {
        this.list.itemRenderer = GangMineRankItem;
        this.list.dataProvider = null;
    }

    OnOpen(...args: any[]) {
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GANGMINE_RANK_INFO, this.updateContent);
        GameGlobal.GangMineModel.sendGangMineScoreRank(1);
    }

    private updateContent() {
        let rankInfos = GameGlobal.GangMineModel.mineRanks[1];
        this.list.dataProvider = new eui.ArrayCollection(rankInfos);
        let isMe: boolean = false;
        for (let key in rankInfos) {
            if (rankInfos[key].guildId == GameGlobal.actorModel.guildID) {
                this.trank.text = rankInfos[key].rank + '';
                isMe = true;
                break;
            }
        }
        if(!isMe) this.trank.text = '未上榜';
    }

    OnClose() {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
}