class AuctionAllServicePanel extends AuctionBasePanel {

	public static NAME = '全服拍品';

	public constructor() {
		super()
	}

	public childrenCreated() {
		super.childrenCreated();
	}

	public OnOpen(...param: any[]) {
		AuctionBasePanel.aucType = 0;
		super.OnOpen();
	}
}