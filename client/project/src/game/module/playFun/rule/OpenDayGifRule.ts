class OpenDayGifRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.LOGINDAYGIF]
	}
	checkShowRedPoint() {
		return GameGlobal.OpenDayGifModel.OpenDayPointRed()
	}

	checkShowIcon() {
		let show = GameGlobal.OpenDayGifModel.OpenDayIcon()
		if (show) {
			this.tar.icon = GameGlobal.OpenDayGifModel.GetShowDayImg()
		}
		return Deblocking.Check(DeblockingType.TYPE_130, true) && show
	}

	tapExecute() {
		ViewManager.ins().open(OpenDayGifWin);
	}

	public static Open() {
		if (!Deblocking.Check(DeblockingType.TYPE_130)) {
			return
		}
		if (!GameGlobal.OpenDayGifModel.OpenDayIcon()) {
			UserTips.InfoTip("»î¶¯½áÊø")
			return
		}
		ViewManager.ins().open(OpenDayGifWin);
	}

}