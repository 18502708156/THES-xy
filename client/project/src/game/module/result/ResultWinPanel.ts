class ResultWinPanel  extends ResultBasePanel {

    /////////////////////////////////////////////////////////////////////////////
    // ResultWinSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected titleLabel: eui.BitmapLabel;
    protected list: eui.List;
    protected closeBtn: eui.Button;
    protected gpStar: eui.Group;
    protected bmStar0: eui.Image;
    protected bmStar1: eui.Image;
    protected bmStar2: eui.Image;
	protected imgTitle: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "ResultWinSkin";
		this.list.itemRenderer = ItemBase
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


	OnOpen(...param: any[]) {
		this.SetBtnLabel("领取奖励")
		this.SetTitleLabel("获得奖励")
		this.SetCloseFunc(param[1])
		super.OnOpen()
		var rewards = param[0]
		let star = param[2]
		let state = param[3]
		if (rewards) {
			rewards.sort(this.sortFunc)
		}
		this.list.dataProvider = new eui.ArrayCollection(rewards)
		this.list.validateNow()
		
		if (state == 3)
			this.imgTitle.source = "ui_js_bm_tiaozhanjieshu"

		if (star == null || star == 0) {
			this.bmStar0.visible = false	
			this.bmStar1.visible = false	
			this.bmStar2.visible = false
			return
		}

		this.bmStar1.filters = star > 1 ? null : Color.GetFilter()
		this.bmStar2.filters = star > 2 ? null : Color.GetFilter()
	}
}