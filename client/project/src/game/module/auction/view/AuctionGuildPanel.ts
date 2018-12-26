class AuctionGuildPanel extends AuctionBasePanel {

	public static NAME = '帮会拍品';

	public constructor() {
		super()
	}

	public childrenCreated() {
		super.childrenCreated();
	}

	public OnOpen(...param: any[]) {
		AuctionBasePanel.aucType = 1;
		super.OnOpen();
	}
}