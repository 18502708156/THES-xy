class AnswerRankWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// RankWinSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialogBg: CommonDialog;
	protected tValue1: eui.Label;
	protected tValue2: eui.Label;
	protected tRank: eui.Label;
	protected treward: eui.Label;
	protected tScore: eui.Label;
	protected itemList: eui.List;

	protected gScore: eui.Group;

	//奖励部分
	protected gReward: eui.Group;
	protected gReBg: eui.Group;
	protected listView: eui.List;
	protected pScr:eui.Scroller;

	
	/////////////////////////////////////////////////////////////////////////////
	private rewardList: IconWithText[];

	public constructor() {
		super();
		this.skinName = 'RankWinSkin';
		this.itemList.itemRenderer = AnswerRankItem;
		this.listView.itemRenderer = ItemBaseNotName;

	}

	initUI() {
		super.initUI();
		this.commonDialogBg.OnAdded(this);
		this.rewardList = [];


		this.tValue1.text = "分数"
	
	};

	/**排行榜
	 * @param 竞技排行类型
	 */
	OnOpen(...param: any[]) {

		this._AddItemClick(this.itemList,this.onItemClick)
		this._AddClick(this.gReBg,this.onBgClick)
		this._AddItemClick(this.itemList,this.onItemClick)

        let pData = param[0]
        if(pData)
        {
			var tList = []
			for (const item in pData) {
				var pRank = {name:"",point:0,rank:0}
				pRank.name = pData[item].name
				pRank.point = pData[item].point
				pRank.rank = parseInt(item) +1
				tList.push(pRank)
			}
            this.getRankData(tList)
        }
		this.showContent()
	}

	private getRankData(rsp): void {
		this.itemList.dataProvider = new eui.ArrayCollection(rsp);
	}

	private showContent(): void {
		var tData = GameGlobal.AnswerController.getAnswerData()
		this.tRank.text = tData.rankNo + "" || "" //排行

		this.gScore.visible = true
		this.tScore.text  =  tData.point + "" || "" //分数
		
	}

	OnClose() {
		this.removeObserve();
	}

	onItemClick (e: eui.ItemTapEvent)
	{
		var item = e;
		if(e.item.rank)
		{
			let rankNo = e.item.rank;
			let tConfig = GlobalConfig.ins().AnswerAwardConfig
			for (const index in tConfig) {
				if(rankNo >=tConfig[index].rank[0]&&rankNo <=tConfig[index].rank[1])
				{
					(this.listView.dataProvider as eui.ArrayCollection).replaceAll(tConfig[index].reward);
				}
			}
		}
		 
		this.gReBg.visible = true
		this.gReward.y = e.itemRenderer.y  + this.pScr.y  -this.gReward.height  - this.itemList.scrollV
	}

	onBgClick()
	{
		this.gReBg.visible = false
	}
}