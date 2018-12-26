class MailIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.MAIL_DATA_CHANGE, MessageDef.MAIL_GET_ITEM]
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_134, true)
	}

	checkShowRedPoint () {
		return MailIconRule.CheckShowRedPoint() ? 1 : 0
	}

	public static CheckShowRedPoint(): boolean {
		return MailModel.ins().mailData ? MailModel.ins().getUnreadMail() : false
	}

	tapExecute  () {
		ViewManager.ins().open(MailWin)
	}
}