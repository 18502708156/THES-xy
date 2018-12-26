class LadderRankPanel extends BaseView implements ICommonWindowTitle {

    /////////////////////////////////////////////////////////////////////////////
    // LadderRankPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    protected myRank: eui.Label;
    protected WinNum: eui.Label;
    protected levelIcon: LadderLevelIcon;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "LadderRankPanelSkin"
	}

	childrenCreated() {
		this.list.itemRenderer = LadderRankItemRenderer
	}

	UpdateContent() {
		let datas = GameGlobal.Ladder.mRankList
		// let selfRank = 0
		// let i = 0
		// for (let data of datas) {
		// 	if (data.id == GameGlobal.actorModel.actorID) {
		// 		selfRank = i
		// 		break
		// 	}
		// 	++i
		// }
		let selfRank = GameGlobal.Ladder.rank	
		var config = this.GetLadderModel().GetSelfLevelConfig();
		this.list.dataProvider = new eui.ArrayCollection(datas);
		this.myRank.text = selfRank ? "排名：" + selfRank : "排名：未上榜";
		this.WinNum.text = "净胜场：" + this.GetLadderModel().winNum + "场";
		this.levelIcon.SetRank2(this.GetLadderModel().grade)
	}

	protected GetLadderModel(): Ladder {
		return GameGlobal.Ladder
	}

	public static NAME = "排名"
}