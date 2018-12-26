class RelationIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}
	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_41, true)
	}
	checkShowRedPoint () {
		let length = GameGlobal.TeacherController.teacherInfo.messageData.length
		return length>0
	}

	tapExecute  () {
		let	openId = GameGlobal.Config.MasterBaseConfig.openid
		if(Deblocking.Check(openId))	
		{
			ViewManager.ins().open(RelationWin)
		}
	}
}