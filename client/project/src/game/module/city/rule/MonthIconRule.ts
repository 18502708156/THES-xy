class MonthIconRule extends RuleIconBase {
	//月卡
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}

	checkShowIcon() {
		this.iconDisplay.source = "ui_zc_bt_yueka"
		return Deblocking.Check(DeblockingType.TYPE_127, true)
	}

	checkShowRedPoint() {
		return false
	}
	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		// this.firstTap = false
		let config = GameGlobal.Config.LvRewardConfig;
		let showLvPanel = true;
		for (let key in config) {
			showLvPanel = (GameGlobal.FuliModel.FuliData.lvMark & 1 << config[key].id) < 1
			if (showLvPanel) break
		}
		if(showLvPanel==false)
			ViewManager.ins().open(FuliWin,3);
		else
			ViewManager.ins().open(FuliWin,4);
	}
}
