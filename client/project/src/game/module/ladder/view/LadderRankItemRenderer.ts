class LadderRankItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "TiantiRankItem";
	}

    /////////////////////////////////////////////////////////////////////////////
    // TiantiRankItem.exml
    /////////////////////////////////////////////////////////////////////////////
    protected nameLabel: eui.Label;
    protected winNum: eui.Label;
    protected levelIcon: LadderLevelIcon;
    protected rankImg: eui.Image;
    protected rankLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public static RANK_ICON = [
		"ui_kfwz_bm_pmk01",
		"ui_kfwz_bm_pmk02",
		"ui_kfwz_bm_pmk03",
	]

	dataChanged() {
		let data = this.data as Sproto.rank_data_ladder
		
		if(this.itemIndex >= 3){
			this.rankLabel.text = '第' + (this.itemIndex + 1) + '名';
			this.rankImg.source = ""
		}else{	
			this.rankLabel.text = ""
			this.rankImg.source = LadderRankItemRenderer.RANK_ICON[this.itemIndex]
		}
		this.winNum.text = data.winNum +"场"
		this.levelIcon.SetRank2(data.grade)
		this.nameLabel.text = GameString.GetSerAndName(data.serverid, data.player)

		// UIHelper.SetHead(this.head, data.job, data.sex)
	}

	private getRankIcon(pos: number): string{
		switch(pos){
			case 1: return "ui_wzzb_ks"			//榜首
			case 2: return "ui_wzzb_by"			//榜眼
			case 3: return "ui_wzzb_th"			//探花
			default: return ""
		}
	}

	// 	// this.bg.source = this.itemIndex % 2 == 0 ? "ui_ph_di_q" : "ui_ph_di_s"
	// 	let pos
	// 	let name
	// 	let winNum
	// 	let challgeLevel
	// 	let challgeId
	// 	var info

	// 	if (egret.is(this.data, "RankDataLadder")) {
	// 		let rankData: RankDataLadder = this.data;
	// 		pos = rankData.pos
	// 		name = rankData.player
	// 		winNum = rankData.winNum
	// 		challgeLevel = rankData.challgeLevel
	// 		challgeId = rankData.challgeId
			
	// 	} else {
	// 		let data = this.data as Sproto.rank_data_ladder
	// 		pos = this.itemIndex + 1
	// 		if (data.serverid) {
	// 			name = GameString.GetSerAndName(data.serverid, data.player)
	// 		} else {
	// 			name = data.player
	// 		}
	// 		winNum = data.winNum
	// 		challgeLevel = data.challgeLevel
	// 		challgeId = data.challgeId
	// 	}

		// if (pos <= 3) {	
		// 	let data = this.data as Sproto.rank_data_ladder;	
		// 	// this.rankImg.source = ResDataPath.GetHeadMiniImgName2(data.job, data.sex);
		// 	this.designation.source = LadderWin.GetRankIcon(pos);
		// 	this.rank.text = "";
		// 	this.monthVip.label.text = "";
		// 	this.height = 98;
		// 	this.monthVip.y= 48;
		// 	this.nameLabel.y=60;
		// 	switch(pos){
		// 		case 1 : this.bigBg.source= "ui_wzzb_h"; break;
		// 		case 2 : this.bigBg.source= "ui_wzzb_l"; break;
		// 		case 3 : this.bigBg.source= "ui_wzzb_z"; break;
		// 		default : this.bigBg.source= ""; break;			
		// 	}
		
		// } else {
		// 	this.rank.visible = true;
		// 	this.rankImgbg.source = "";
		// 	this.rank.text = pos + "";
		// 	this.rankImg.source = "";
		// 	this.designation.source = "";
		// 	this.monthVip.label.text = "";	
		// 	this.height = 70;
		// 	this.monthVip.y= 30;
		// 	this.nameLabel.y=30;				
		// }

	// 	this.nameLabel.text = name;
	// 	this.winNum.text = winNum + "场";
	// 	this.levelIcon.SetRank(challgeLevel, challgeId)
	// }
	// // protected GetLadderModel(): Ladder {	
	// // 	return GameGlobal.Ladder				
	// // }
}