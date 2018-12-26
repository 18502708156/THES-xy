class AuctionInfo {
	
	public id: number = 0
	/**物品ID */
	public itemid: number = 0;
	/**物品数量 */
	public count: number = 0;
	/**当前价格 (单价) */
	public price: number = 0; 
	/**物品拥有者 */
	public playername: string = '';
	/**当前出价的人 */
	public offername: string = '';
	/**1公示 2竞拍 3抢拍 4成交 5流拍 */
	public status: number = 0
	/**上架时间 */
	public createtime: number = 0;
	/**交易时间 */
	public dealtime: number = 0;
	/**是否是一口价 1 或 0 */
	public isbuy: number = 0;

	public dealprice: number; // tag 10
	public addprice: number; // tag 11
	public numerictype: number; // tag 12

	public parser(data:Sproto.auction_item) {
		this.id = data.id;
		this.itemid = data.itemid;
		this.count = data.count;
		this.price = data.price;
		this.playername = data.playername;
		this.offername = data.offername;
		this.status = data.status;
		this.createtime = data.createtime;
		this.dealtime = data.dealtime;
		this.isbuy = data.isbuy;

		this.dealprice = data.dealprice
		this.addprice = data.addprice
		this.numerictype = data.numerictype
	}

	// 是否有竞拍的人
	public HasOffer(): boolean {
		return this.offername ? true : false
	}
}

