class AuctionIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.AUCTION_REDPOINT_UPDATE];
	}

	checkShowIcon() {
		if (Deblocking.Check(DeblockingType.TYPE_112, true)) {
			return true;
		}
		return false;
	}

	checkShowRedPoint() {
		let view = ViewManager.ins().getView(AuctionMainPanel);
		if (view) {
			GameGlobal.AuctionModel.isRedPoint = false;
		}
		return GameGlobal.AuctionModel.isRedPoint;
	}

	tapExecute() {
		GameGlobal.AuctionModel.isRedPoint = false;
		ViewManager.ins().open(AuctionMainPanel)
	}
}