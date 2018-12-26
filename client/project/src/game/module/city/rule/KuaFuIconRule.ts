class KuaFuIconRule extends RuleIconBase {

	private imgDouble: eui.Image

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.KF_BOSS_UPDATE_INFO]

		this.tar["redPoint"] = (this.tar as eui.Button).getChildByName("redPoint")
		this.imgDouble = (this.tar as eui.Button).getChildByName("imgDouble") as eui.Image
	}
	checkShowRedPoint () {
		if (!Deblocking.Check(DeblockingType.TYPE_63, true)) {
			return false
		}
		if (GameGlobal.CrossTeamModel.IsDoubleReward())
		{
			this.imgDouble.visible = true
			return false
		}

		this.imgDouble.visible = false
		return GameGlobal.AcrossBossController.IsAcrossBossAct()
	}

	checkShowIcon() {
		return true
	}

	tapExecute  () {
		ViewManager.ins().open(CrossMainPanel)
	}
}