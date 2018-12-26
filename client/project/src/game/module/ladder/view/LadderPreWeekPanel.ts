class LadderPreWeekPanel extends BaseView implements ICommonWindowTitle {

    /////////////////////////////////////////////////////////////////////////////
    // LadderPreWeekPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected rankTab: eui.TabBar;
    protected scroller0: eui.Scroller;
    protected list0: eui.List;
    protected scroller1: eui.Scroller;
    protected list1: eui.List;
    protected levtxt: eui.Label;
    protected labelText: eui.Label;
    protected winNum: eui.Label;
    protected levelIcon: LadderLevelIcon;
    protected getReward: eui.Button;
    /////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "LadderPreWeekPanelSkin"
	}

	childrenCreated() {
		this.rankTab.dataProvider = new eui.ArrayCollection(["王者额外奖励", "王者排名奖励"])
		
		this.list0.itemRenderer = LastWeekRankItemRenderer
		this.list1.itemRenderer = LadderRankRewardRenderer
	}

	OnOpen() {
		this.AddClick(this.getReward, this.onTap)
		this.rankTab.selectedIndex = 0
		this.rankTab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._ItemClick, this)
		this._ItemClick()

		this.observe(MessageDef.LADDER_UPWEEK_RANK_UPDATE, this.UpdateContent)
		this.UpdateContent()
	}

	OnClose() {
		this.rankTab.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._ItemClick, this)
	}

	//分别获取排行数据
	private _ItemClick() {
		let index = this.rankTab.selectedIndex
		this.scroller0.visible = index == 0
		this.scroller1.visible = index == 1
	}

	//领取上周奖励
	onTap(e) {
		switch (e.currentTarget) {
			case this.getReward:
				this.getReward.visible = false;
				this.GetLadderModel().isCanReward = false;
				this.GetLadderModel().sendGetWeekReward();
				break;
		}
	}

    //更新数据
	UpdateContent() {
		let ladder = this.GetLadderModel()

		var config = ladder.GetSelfUpLevelConfig();

		this.list0.dataProvider = new eui.ArrayCollection(CommonUtils.GetArray(GameGlobal.Config.KingSportsRankConfig, "id"));
		this.list1.dataProvider = new eui.ArrayCollection(CommonUtils.GetArray(GameGlobal.Config.DWKingSportsConfig, "type"));
		this.levtxt.text = ladder.upWeekRank ? ladder.upWeekRank + "" : "未上榜"
		this.winNum.text = "净胜场：" + ladder.upWin + "场";
		this.getReward.visible = ladder.isCanReward;
	
		if (ladder.playUpTime) {
			this.levelIcon.SetRank2(ladder.upgrade)
		} else {
			this.levelIcon.SetRank2(1)
		}
	};

	protected GetLadderModel(): Ladder {
		return GameGlobal.Ladder
	}

	public static NAME = "上周"
}