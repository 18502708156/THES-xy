class RankWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// RankWinSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialogBg: CommonDialog;
	protected tValue1: eui.Label;
	protected tValue2: eui.Label;
	protected tRank: eui.Label;
	protected lbExNe: eui.Label;
	protected treward: eui.Label;
	protected tScore: eui.Label;
	
	protected itemList: eui.List;
	
	/////////////////////////////////////////////////////////////////////////////
	private rewardList: IconWithText[];


	//奖励内容
	gReBg :eui.Group;
	gReward:eui.Group;
	protected listView: eui.List;
	protected gScore: eui.Group;
	
	pScr;
	


	public constructor() {
		super();
		this.skinName = 'RankWinSkin';
		// this.listView.itemRenderer = ItemBaseNotName;
	}

	initUI() {
		super.initUI();
		this.commonDialogBg.OnAdded(this);
		this.rewardList = [];

		// this._AddItemClick(this.itemList,this.onItemClick)
		// this._AddClick(this.gReBg,this.onBgClick)


	};

	/**排行榜
	 * @param 竞技排行类型
	 */
	OnOpen(...param: any[]) {
		let type = param.length ? param[0] : RankDataType.TYPE_ARENA;
		let rank = null
		switch (type) {
			case RankDataType.TYPE_ARENA:
				this.currentState = "four"
				this.itemList.itemRenderer = RankDataItem;

				this.tValue1.text = "战力"
			
				this.commonDialogBg.title = '竞技排名';
				this.observe(MessageDef.ARENA_RANK_DATA, this.getRankData);
				GameGlobal.Arena.sendArenaRank();
				rank = GameGlobal.Arena.getMyRank();
				let config = GameGlobal.Arena.getRankRewards(rank);
				this.showContent(rank, config);
				break;
			case RankDataType.TYPE_GANG_BOSS_PERSON:
				this.HandleBossPersonRank(GameGlobal.GangBossModel.mCurRank, false)
				break
			case RankDataType.TYPE_ACROSS_PERSON:
				this.HandleBossPersonRank(GameGlobal.AcrossBossController.mCurRank, true)
			break
		}
	}

	private HandleBossPersonRank(rank, showServer) {
		this.itemList.itemRenderer = RankDataHurtItem;
			
		this.tValue1.text = "伤害"
		this.commonDialogBg.title = '伤害排名';
		this.currentState = "three"
		//rank = GameGlobal.AcrossBossController.mCurRank

		this.gScore.visible = true
		this.lbExNe.text = "伤害:"
		if(rank.mydamage)
		{
			this.tScore.text = rank.mydamage + ""
		}
		else
		{
			this.tScore.text = ""
		}

		if(rank.myrank)
		{
			this.tRank.text = rank.myrank + ""
		}
		else
		{
			this.tRank.text = ""
		}		
		
		let tRank  = []

		for(let i = 0;i< rank.playerranks.length;i++)
		{
			let oRank = {rank:1,name:"",value:0}
			oRank.rank = i+1
			let serverText = showServer ? ` .S${rank.playerranks[i].serverid}` : ""
			oRank.name = rank.playerranks[i].name + serverText
			oRank.value = rank.playerranks[i].damage
			tRank.push(oRank)
		}
		this.itemList.dataProvider = new eui.ArrayCollection(tRank);
	}

	private getRankData(rsp: Sproto.cs_arena_rank_response): void {
		this.itemList.dataProvider = new eui.ArrayCollection(rsp.ranklist);
	}

	private showContent(rank, config): void {
		this.tRank.text = rank + '';
		if (config) {
			let i = 0, len = config.length;
			let rewardCon: IconWithText;
			for (i; i < len; i++) {
				rewardCon = this.rewardList[i];
				if (!rewardCon) {
					rewardCon = new IconWithText();
					rewardCon.y = 897;
					this.addChild(rewardCon);
					this.rewardList.push(rewardCon);
				}
				rewardCon.setIcon(config[i].id);
				rewardCon.setCount(config[i].count + '');
				rewardCon.x = 430 + (rewardCon.width + 2) * i >> 0;
			}
		}
	}

	OnClose() {
		this.removeObserve();
	}

	//
	// onItemClick (e: eui.ItemTapEvent)
	// {
	// 	var item = e;
	// 	if(e.item.rank)
	// 	{
	// 		let rankNo = e.item.rank;
	// 		let tConfig = GlobalConfig.ins().AnswerAwardConfig
	// 		for (const index in tConfig) {
	// 			if(rankNo >=tConfig[index].rank[0]&&rankNo <=tConfig[index].rank[1])
	// 			{
	// 				(this.listView.dataProvider as eui.ArrayCollection).replaceAll(tConfig[index].reward);
	// 			}
	// 		}
	// 	}
		 
	// 	this.gReBg.visible = true
	// 	this.gReward.y = e.itemRenderer.y  + this.pScr.y  -this.gReward.height  - this.itemList.scrollV
	// }

	// onBgClick()
	// {
	// 	this.gReBg.visible = false
	// }


}