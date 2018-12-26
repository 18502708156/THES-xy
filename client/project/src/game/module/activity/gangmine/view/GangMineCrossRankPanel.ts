class GangMineCrossRankPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Main;

    /////////////////////////////////////////////////////////////////////////////
    // GangMineCrossRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected list: eui.List;
    protected tscore: eui.Label;
    protected trank: eui.Label;
    protected pageBtn: PageButton;
    /////////////////////////////////////////////////////////////////////////////

    private rankInfos: GangMineRankInfo[];
    /**每页数量 */
    private pageNum: number = 4;
    /**当前页 */
    private curpage: number = 1;

    public constructor() {
        super()
    }

    initUI() {
        super.initUI();
        this.skinName = "GangMineCrossRankSkin";
        this.commonWindowBg.SetTitle('跨服排名');
    };

    initData() {
        this.list.itemRenderer = GangMineRankItem;
        this.list.dataProvider = null;
        this.pageBtn.setPage(1);
        this.curpage = 1;
        this.pageBtn.setMax(1);
    }

    /**回调当前页码 */
    private pageChangeFun(page) {
        this.curpage = page;
        this.list.dataProvider = new eui.ArrayCollection(this.getPageList(this.curpage));
    }

    private getPageList(page) {
        let i = 0, len = this.rankInfos.length - (page - 1) * this.pageNum;
        let list: GangMineRankInfo[] = [];
        if (len > this.pageNum) len = this.pageNum;
        for (i; i < len; i++) {
            list[i] = this.rankInfos[i + (page - 1) * len];
        }
        return list;
    }

    OnOpen(...args: any[]) {
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GANGMINE_RANK_INFO, this.updateContent);
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.pageChangeFun);
        GameGlobal.GangMineModel.sendGangMineScoreRank(2);
    }

    private updateContent() {
        this.rankInfos = GameGlobal.GangMineModel.mineRanks[2];
        /**设置起始页 */
        this.pageBtn.setPage(1);
        this.curpage = 1;
        /**设置最大页 */
        this.pageBtn.setMax(this.rankInfos.length / this.pageNum >> 0);
        this.list.dataProvider = new eui.ArrayCollection(this.rankInfos);

        if (GameGlobal.actorModel.HasGuild()) {
            let isMe: boolean = false;
            for (let key in this.rankInfos) {
                if (this.rankInfos[key].guildId == GameGlobal.actorModel.guildID) {
                    this.trank.text = this.rankInfos[key].rank + '';
                    this.tscore.text = this.rankInfos[key].score + '分';
                    isMe = true;
                    break;
                }
            }
            if (!isMe) this.trank.text = '未上榜';
        }
        else {
            this.tscore.text = '0分';
            this.trank.text = '未上榜';
        }
    }

    OnClose() {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
}