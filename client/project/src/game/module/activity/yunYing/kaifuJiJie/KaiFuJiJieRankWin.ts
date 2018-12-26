class KaiFuJiJieRankWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Main
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieRankWinSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected list: eui.List;
    protected rankTitleTxt: eui.Label
    protected noRank_label: eui.Label
    protected powerTxt: eui.Label
    protected myInfo: eui.Label
    protected rankTitle_group: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

    private mMedalId: number
    private mChooseMedalId: number

    public constructor() {
        super()
        this.skinName = 'KaiFuJiJieRankWinSkin';
    }
    
    initUI() {
        super.initUI();
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle("进阶排行");
    };

    public childrenCreated() {
        this.list.itemRenderer = KaiFuJiJieRankItem
        this.list.dataProvider = new eui.ArrayCollection([]);
    }

    public UpdateContent() {
        // let myRank = 0
        // let myValue = 0

        let ranks = GameGlobal.ActivityKaiFuModel.advancedRank;
        if (ranks.length == 0) {
            this.rankTitle_group.visible = false;
            this.noRank_label.visible = true;
        } else {
            this.rankTitle_group.visible = true;
            this.noRank_label.visible = false;

            // let i = 0
            // for (let data of ranks) {
            //     if (data.id == GameGlobal.actorModel.actorID) {
            //         myRank = i
            //         myValue = data.power
            //     }
            //     ++i
            // }
        }
        (this.list.dataProvider as eui.ArrayCollection).replaceAll(ranks);

        let strRank = GameGlobal.ActivityKaiFuModel.advancedRankMySelfe || "未上榜"
        
        this.myInfo.textFlow = TextFlowMaker.generateTextFlow(`我的排名：|C:${Color.GetStr(Color.l_green_1)}&T:${strRank}|         我的战力：|C:${Color.GetStr(Color.l_green_1)}&T:${GameGlobal.ActivityKaiFuModel.advancedSelfPower || 0}|`)
    }

    public OnOpen(...param: any[]) {
        let type = param[0];
        this.rankTitleTxt.text = ActivityConst.JiJieTypeName2(type) + "阶数";
        this.powerTxt.text = ActivityConst.JiJieTypeName2(type) + "战力";
        this.observe(MessageDef.ACTIVITY_ADVANCED_RANK, this.UpdateContent)
        // GameGlobal.ActivityKaiFuModel.Send_advanced_rank();
        this.UpdateContent();
    }

    public OnClose() { };
}

class KaiFuJiJieRankItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieRankItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgBg: eui.Image;
    protected rank_txt: eui.Label;
    protected name_txt: eui.Label;
    protected powerTxt: eui.Label;
    protected lv_txt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    public childrenCreated() { }

    public dataChanged() {
        if (!this.data) return;
        let rankData: Sproto.rank_data_list = this.data
        this.imgBg.visible = this.itemIndex % 2 == 0

        this.rank_txt.text = (this.itemIndex + 1) + '';
        this.name_txt.text = rankData.name;
        this.powerTxt.text = rankData.power + '';
        this.lv_txt.text = rankData.lv ? rankData.lv + '' : '0';
    }
}
