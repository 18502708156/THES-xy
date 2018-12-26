class FriendRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.FRIEND_RED_POINT_CHANGE, MessageDef.LEVEL_CHANGE]
	}
	checkShowRedPoint() {
		return GameGlobal.FriendModel.checkRedPoint();
	}
	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_89, true)
	}
	tapExecute() {
		ViewManager.ins().open(FriendMainPanel)
	}
}