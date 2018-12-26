class JinJieRankIconRule extends RuleIconBase {

	public static mIsFirst = true

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.LEVEL_CHANGE]
	}

	checkShowIcon() {
		if (!Deblocking.Check(DeblockingType.TYPE_9, true)) {
			return false;
		}
		let serverDay = GameServer.serverOpenDay;
		if (serverDay <= GameGlobal.Config.ProgressCrazyBaseConfig.initialorder.length) {
			let icon = GameGlobal.Config.ProgressCrazyBaseConfig.rankbtn[GameGlobal.Config.ProgressCrazyBaseConfig.initialorder[serverDay - 1] - 1]
			this.iconDisplay.source = icon
		} else {
			this.iconDisplay.source = "";
		}
		return serverDay <= GameGlobal.Config.ProgressCrazyBaseConfig.initialorder.length;
	}

	checkShowRedPoint() {
		if (JinJieRankIconRule.mIsFirst) {
			return true
		}
		return false
	}

	tapExecute() {
		JinJieRankIconRule.mIsFirst = false
		KaiFuActivityWin.Show(ActivityKaiFuFuncType.ACT_99991_JiJieRank, false) //传如了一个进阶排行活动id 打开要选中进阶排行
	}
}
