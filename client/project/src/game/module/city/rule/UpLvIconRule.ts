/**
 * 我要變強 Rule
 */
class UpLvIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}

	checkShowIcon() 
	{
		return Deblocking.Check(136, true) 
	}

	checkShowRedPoint() 
	{
		if (GameGlobal.UpLvWayModel.mRedPoint.showRedPoint()) 
		{
			return true
		}
		return false
	}

	tapExecute() {
		ViewManager.ins().open(UpLvWayMainWin);
	}
}
