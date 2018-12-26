class AuctionModel extends BaseSystem {

	/**充值拍卖额度 */
	public rechargeRatio: number = 0;
	/**活跃拍卖额度 */
	public activeRatio: number = 0;
	/**正在竞拍中的额度 */
	public lockRatio: number = 0;

	/**所有标签拍卖列表，key = (0全服，1帮会), value = AuctionInfo[]*/
	public auctionLists: { [key: number]: AuctionInfo[] } = {};

	/**拍卖交易记录*/
	public recordInfos: AuctionInfo[] = [];

	/**新上架红点通知 */
	public isRedPoint: boolean = false;

	public mAuctionItemPrice: {[key: number]: Sproto.cs_auction_query_item_response} = {}

	public constructor() {
		super();
		this.auctionLists = {
			[0]: [],
			[1]: [],
		};
		this.regNetMsg(S2cProtocol.sc_auction_list, this._DoUpdateAuctionList);
		this.regNetMsg(S2cProtocol.sc_auction_update, this._DoUpdateAuctionInfo);
		this.regNetMsg(S2cProtocol.sc_auction_record, this._DoUpdateAuctionRecord);
		this.regNetMsg(S2cProtocol.sc_auction_select, this._DoUpdateAuctionSelect);
		this.regNetMsg(S2cProtocol.sc_ratio_change, this._DoUpdateAuctionRatio);
		this.regNetMsg(S2cProtocol.sc_aution_notice, this._DoUpdateAuctionRedPoint);
	}

	private _DoUpdateAuctionItem() {
		GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_ITEM_PRICE_UPDATE);
	}

	/**拍卖行列表  */
	private _DoUpdateAuctionList(rsp: Sproto.sc_auction_list_request) {
		this.rechargeRatio = rsp.ratio;
		this.activeRatio = rsp.ratioAct;
		this.lockRatio = rsp.lockratio;
		let len = rsp.items.length;
		let auctionInfos = [];
		let info: AuctionInfo;
		for (let i = 0; i < len; i++) {
			info = new AuctionInfo;
			info.parser(rsp.items[i]);
			auctionInfos[i] = info;
		}
		this.sortInfos(auctionInfos);
		this.auctionLists[rsp.guildid > 0 ? 1 : 0] = auctionInfos;
		GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_LIST_UPDATE);

		this.calculateRedPointState()
	}

	private sortInfos(infos) {
		let weight = (info: AuctionInfo) => {
			return info.createtime;
		}
		infos.sort((lhs, rhs) => {
			return weight(rhs) - weight(lhs)
		})
	}

	/**更新单个拍卖信息 */
	private _DoUpdateAuctionInfo(rsp: Sproto.sc_auction_update_request) {
		let lists = this.auctionLists[rsp.guildid > 0 ? 1 : 0];
		let len = lists.length;
		if (len > 0) {
			let info: AuctionInfo;
			for (let i = 0; i < len; i++) {
				info = lists[i];
				if (info.id == rsp.item.id) {
					info.parser(rsp.item);
					if (info.status > 3) lists.splice(i, 1);
					GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_LIST_UPDATE);
					break;
				}
			}
		}

		this.calculateRedPointState()
	}

	/**拍卖记录 */
	private _DoUpdateAuctionRecord(rsp: Sproto.sc_auction_record_request) {
		let len = rsp.items.length;
		this.recordInfos = [];
		let info: AuctionInfo;
		for (let i = 0; i < len; i++) {
			info = new AuctionInfo;
			info.parser(rsp.items[i]);
			this.recordInfos[i] = info;
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_RECORD_UPDATE);
	}

	/**获得物品选择 */
	private _DoUpdateAuctionSelect(rsp: Sproto.sc_auction_select_request) {
		ViewManager.ins().open(AuctionSelectPanel, rsp.rewards[0]);
	}

	/**拍卖额度更新 */
	private _DoUpdateAuctionRatio(rsp: Sproto.sc_ratio_change_request) {
		this.rechargeRatio = rsp.ratio;
		this.activeRatio = rsp.ratioAct;
		this.lockRatio = rsp.lockratio;
	}

	private _DoUpdateAuctionRedPoint(...param) {
		// this.isRedPoint = true;
		// GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_REDPOINT_UPDATE);
		// 新增物品数据只有重新请求列表数据，才能得到
		GameGlobal.AuctionModel.sendAuctionList(0)
		if (GameGlobal.GangModel.HasGang())
			GameGlobal.AuctionModel.sendAuctionList(1)
	}

	/**使用物品 */
	public sendAuctionUseItem(id) {
		let req = new Sproto.cs_auction_useitem_request;
		req.id = id;
		this.Rpc(C2sProtocol.cs_auction_useitem, req);
	}

	/**物品选择1自用 2拍卖 */
	public sendAuctionSelect(choose) {
		let req = new Sproto.cs_auction_select_request;
		req.choose = choose;
		this.Rpc(C2sProtocol.cs_auction_select, req);
	}

	/**拍卖列表 0全服 1帮会*/
	public sendAuctionList(auctype) {
		let req = new Sproto.cs_auction_list_request;
		req.auctype = auctype;
		this.Rpc(C2sProtocol.cs_auction_list, req);
	}

	/**竞拍物品 */
	public sendAuctionOffer(id, auctype) {
		let req = new Sproto.cs_auction_offer_request;
		req.id = id;
		req.guildid = auctype;
		this.Rpc(C2sProtocol.cs_auction_offer, req);
	}

	public SendGetItemPrice(id: number) {
		let req = new Sproto.cs_auction_query_item_request
		req.itemid = id
		this.Rpc(C2sProtocol.cs_auction_query_item, req, (rsp: Sproto.cs_auction_query_item_response) => {
			this.mAuctionItemPrice[id] = rsp
		})
	}

	/**一口价买走 */
	public sendAuctionBuy(id, auctype) {
		let req = new Sproto.cs_auction_buy_request;
		req.id = id;
		req.guildid = auctype;
		this.Rpc(C2sProtocol.cs_auction_buy, req);
	}

	/**竞拍物品记录 */
	public sendAuctionRecord(auctype) {
		let req = new Sproto.cs_auction_record_request;
		req.auctype = auctype;
		this.Rpc(C2sProtocol.cs_auction_record, req);
	}

	/**请求更新竞拍物品 */
	public sendAuctionUpdate(id, auctype) {
		let req = new Sproto.cs_auction_update_request;
		req.id = id;
		req.guildid = auctype;
		this.Rpc(C2sProtocol.cs_auction_update, req);
	}



	/**拍卖基础配置*/
	public getBaseConfig() {
		return GameGlobal.Config.AuctionBaseConfig;
	}

	/**1公示 2竞拍 3抢拍 4成交 5流拍 */
	public getDescByStatus(status) {
		let str = ''
		switch (status) {
			case 1:
				str = '|C:' + Color.Blue + '&T:展示阶段|';
				break;
			case 2:
				str = '|C:0x019704&T:竞拍阶段|';
				break;
			case 3:
				str = '|C:' + Color.Red + '&T:抢拍阶段|';
				break;
			case 4:
				str = '成交阶段';
				break;
			case 5:
				str = '流拍阶段';
				break;
		}
		return str;
	}

	public calculateRedPointState() {
		this.isRedPoint = false
		for (let key in this.auctionLists) {
			if (this.auctionLists[key].length > 0) {
				this.isRedPoint = true
				break
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_REDPOINT_UPDATE)
	}

	/**拍卖剩余额度 */
	public getRemainRatio() {
		return this.rechargeRatio + this.activeRatio - this.lockRatio;
	}

	/**拍卖额度不足提示 */
	public showAlert() {
		let ratio1 = this.activeRatio - this.lockRatio > 0 ? this.activeRatio - this.lockRatio : 0;
		let ratio2 = ratio1 > 0 ? this.rechargeRatio : this.getRemainRatio();
		let str = '\n您在拍卖行的消费额度不足，无法参与竞拍\n\n|C:0x019704&T:充值额度剩余：' + ratio2 +
			'\n活跃剩余额度：' + ratio1 + '(优先消耗活跃额度)|\n\n'
			+ '花费额度获得途径：\n每充值1元宝，增加' + this.getBaseConfig().goldratio + '元宝购买额度\n' +
			'每1点活跃度，可转化为' + this.getBaseConfig().activeratio + '元宝购买额度\n'
		WarnWin.show(str, () => { }, this, null, null, 'sure', { title: '拍卖提示' });
	}

	/**查看拍卖额度 */
	public showRatioPanel() {
		let ratio1 = this.activeRatio - this.lockRatio > 0 ? this.activeRatio - this.lockRatio : 0;
		let ratio2 = ratio1 > 0 ? this.rechargeRatio : this.getRemainRatio();
		let str = '\n|C:0x019704&T:充值额度剩余：' + ratio2 +
			'\n活跃剩余额度：' + ratio1 + '(优先消耗活跃额度)|\n\n'
			+ '花费额度获得途径：\n每充值1元宝，增加' + this.getBaseConfig().goldratio + '元宝购买额度\n' +
			'每1点活跃度，可转化为' + this.getBaseConfig().activeratio + '元宝购买额度\n'
		WarnWin.show(str, () => { }, this, null, null, 'sure');
	}
}

