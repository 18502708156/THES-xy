class KaiFuIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE, MessageDef.ACTIVITY_DABIAO_UPDATE, MessageDef.ACTIVITY_IS_GET_AWARDS
		,MessageDef.ACTIVITY_ADVANCED_INFO,MessageDef.ACTIVITY_ADVANCED_ICON_SHOW]
	}
	checkShowRedPoint() {
		if (!Deblocking.IsDeblocking(DeblockingType.TYPE_124))
		{
			return false
		}

		if (GameGlobal.ActivityKaiFuModel.RedPointAdvanced())
		{
			return true;
		}	
		if (GameGlobal.ActivityKaiFuModel.RedPointQiTian())
		{
			return true;
		}	
		if (GameGlobal.ActivityKaiFuModel.RedPointTarget())
		{
			return true;
		}
		if (GameGlobal.ActivityKaiFuModel.RedPointAdvanceShop()) {
			return true
		}
		return false
	}
	checkShowIcon() {
		if (!Deblocking.IsDeblocking(DeblockingType.TYPE_124))
		{
			return false
		}
		// if (GameGlobal.ActivityKaiFuModel.hasActivityQiTian())
		// {
		// 	return true;
		// }	
		// if (GameGlobal.ActivityKaiFuModel.hasActivityTarget())
		// {
		// 	return true;
		// }
		// return false;
		return true
	}

	tapExecute  () {
		KaiFuActivityWin.Show()
	}
}
