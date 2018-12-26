class CrossBattleResultWin  extends ResultBasePanel {

	/////////////////////////////////////////////////////////////////////////////
    // CrossBattleResultWinSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected titleLabel: eui.BitmapLabel;
    protected list: eui.List;
    protected closeBtn: eui.Button;
    protected gpStar: eui.Group;
    protected bmStar2: eui.Image;
    protected bmStar0: eui.Image;
    protected bmStar1: eui.Image;
    protected jf: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
		super();
		this.skinName = "CrossBattleResultWinSkin";
	}

	OnOpen(...param: any[]) {
		this.SetBtnLabel("领取奖励")
		this.SetTitleLabel("获得奖励")
		this.SetCloseFunc(param[1])
		super.OnOpen()
		var rewards = param[0];
        this.jf.text = "积分：" + rewards
		// if (rewards) {
		// 	rewards.sort(this.sortFunc);
		// }
		// this.list.dataProvider = new eui.ArrayCollection(rewards);
		// this.list.validateNow()
		let star = param[2]
		if (star != null) {
			if (star == 0) {
				this.bmStar0.visible = false	
				this.bmStar1.visible = false	
				this.bmStar2.visible = false	
			} else if (star == 1) {
				this.bmStar0.visible = false	
				this.bmStar2.visible = false	
			} else if (star == 2) {
				this.bmStar1.visible = false	
				this.bmStar0.x = 233
				this.bmStar2.x = 400
			}
		}
		else
		{
			this.bmStar0.visible = false	
			this.bmStar1.visible = false	
			this.bmStar2.visible = false	
		}
	}
}