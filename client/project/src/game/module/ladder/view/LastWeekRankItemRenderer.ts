class LastWeekRankItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super();
	}
    /////////////////////////////////////////////////////////////////////////////
    // LastWeekRankItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected nameLabel: eui.Label;
    protected winNum: eui.Label;
    protected item1: ItemBaseNotName;
    protected levelIcon: LadderLevelIcon;
    protected rankImg: eui.Image;
    protected rankLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	index
	

	private getRankImg(index){
		switch(index){
			case 1: return "ui_wzzb_ks"				//魁首
			case 2: return "ui_wzzb_by"				//榜眼
			case 3: return "ui_wzzb_th"				//探花
			default: return ""
		}
	}

	//排名数据更新
	dataChanged() {
		
		this.index = this.itemIndex + 1;
		let config = this.data

		if(this.itemIndex >= 3){
			this.rankLabel.text = '第' + (this.itemIndex + 1) + '名';
			this.rankImg.source = ""
		}else{	
			this.rankLabel.text = ""
			this.rankImg.source = LadderRankItemRenderer.RANK_ICON[this.itemIndex]
		}

		this.item1.data = config.rankreward[0]

		let rankData = GameGlobal.Ladder.upRankList[this.itemIndex]
		if (rankData) {
			this.nameLabel.text = GameString.GetSerAndName(rankData.serverid, rankData.player) 
			this.winNum.text = "净胜场：" + rankData.winNum + "场";
			
			this.levelIcon.SetRank2(rankData.grade)

			UIHelper.SetVisible(this.winNum, true)

			// this.head.visible = true
			// UIHelper.SetHead(this.head, rankData.job, rankData.sex)
		} else {
			let nameStr = LadderConst.GetRankIconTwo(5)
			this.nameLabel.text = nameStr + "级别第" + this.index + "名";
			this.levelIcon.SetRank2(18)

			UIHelper.SetVisible(this.winNum, false)
			// this.head.visible = false
		}
	}

	protected GetTianTiRankConfig(): any {
		return GlobalConfig.ins().DWKingSportsConfig
	}
}