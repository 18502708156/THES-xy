class ArenaPKResultPanel extends ResultBasePanel {

	/////////////////////////////////////////////////////////////////////////////
	// AreanPKResultSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected winGroup: eui.Group;
	protected failGroup: eui.Image;
	protected titleLabel: eui.BitmapLabel;
	protected list: eui.List;
	protected closeBtn: eui.Button;
	protected lastRankTxt: eui.Label;
	protected curRankTxt: eui.Label;
	protected rewardTxt: eui.Label;
	protected upImg: eui.Image;
	protected upRankTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "AreanPKResultSkin";
		this.list.itemRenderer = ItemBase;
	}

	/** 货币排序 */
	sortFunc(a, b) {
		if (a.type == 1 && b.type == 1) {
			var aItem = GlobalConfig.ins().ItemConfig[a.id];
			var bItem = GlobalConfig.ins().ItemConfig[b.id];
			if (aItem.quality > bItem.quality)
				return -1;
			else if (aItem.quality < bItem.quality)
				return 1;
			else {
				if (aItem.level > bItem.level)
					return -1;
				else if (aItem.level < bItem.level)
					return 1;
			}
		}
		else {
			if (a.type < b.type)
				return -1;
			else if (a.type > b.type)
				return 1;
		}
		return 0;
	};

	/**
	 * @param
	 * 0 成功|失败
	 * 1 奖励
	 * 2 历史最高排名
	 * 3 当前排名
	 * 4 挑战前排名
	 * 5 回调函数
	 */
	OnOpen(...param: any[]) {
		this.SetBtnLabel("领取奖励")
		this.SetTitleLabel("获得奖励")
		this.SetCloseFunc(param[5])
		super.OnOpen();

		this.winGroup.visible = param[0];
		this.failGroup.visible = !param[0];

		var rewards = param[1];
		if (rewards) {
			rewards.sort(this.sortFunc);
		}
		this.list.dataProvider = new eui.ArrayCollection(rewards);
		this.list.validateNow();

		this.lastRankTxt.text = param[2] + '';
		this.curRankTxt.text = param[3] + '';
		//排名变化
		let upRank: number = param[4] - param[3];
		if (upRank > 0) {
			this.upImg.visible = true;
			this.upRankTxt.text = upRank + '';
		}
		else {
			this.upImg.visible = false;
			this.upRankTxt.text = '不变';
		}
		//奖励倍数
		let reward: number = 0;
		if (param[2] > param[3]) {
			reward = param[2] - param[3];
		}
		this.rewardTxt.text = reward * GameGlobal.Arena.getUpRankReward() + '';
	}
}