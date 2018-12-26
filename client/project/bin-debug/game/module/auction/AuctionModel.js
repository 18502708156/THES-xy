var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AuctionModel = (function (_super) {
    __extends(AuctionModel, _super);
    function AuctionModel() {
        var _this = _super.call(this) || this;
        /**充值拍卖额度 */
        _this.rechargeRatio = 0;
        /**活跃拍卖额度 */
        _this.activeRatio = 0;
        /**正在竞拍中的额度 */
        _this.lockRatio = 0;
        /**所有标签拍卖列表，key = (0全服，1帮会), value = AuctionInfo[]*/
        _this.auctionLists = {};
        /**拍卖交易记录*/
        _this.recordInfos = [];
        /**新上架红点通知 */
        _this.isRedPoint = false;
        _this.mAuctionItemPrice = {};
        _this.auctionLists = (_a = {},
            _a[0] = [],
            _a[1] = [],
            _a);
        _this.regNetMsg(S2cProtocol.sc_auction_list, _this._DoUpdateAuctionList);
        _this.regNetMsg(S2cProtocol.sc_auction_update, _this._DoUpdateAuctionInfo);
        _this.regNetMsg(S2cProtocol.sc_auction_record, _this._DoUpdateAuctionRecord);
        _this.regNetMsg(S2cProtocol.sc_auction_select, _this._DoUpdateAuctionSelect);
        _this.regNetMsg(S2cProtocol.sc_ratio_change, _this._DoUpdateAuctionRatio);
        _this.regNetMsg(S2cProtocol.sc_aution_notice, _this._DoUpdateAuctionRedPoint);
        return _this;
        var _a;
    }
    AuctionModel.prototype._DoUpdateAuctionItem = function () {
        GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_ITEM_PRICE_UPDATE);
    };
    /**拍卖行列表  */
    AuctionModel.prototype._DoUpdateAuctionList = function (rsp) {
        this.rechargeRatio = rsp.ratio;
        this.activeRatio = rsp.ratioAct;
        this.lockRatio = rsp.lockratio;
        var len = rsp.items.length;
        var auctionInfos = [];
        var info;
        for (var i = 0; i < len; i++) {
            info = new AuctionInfo;
            info.parser(rsp.items[i]);
            auctionInfos[i] = info;
        }
        this.sortInfos(auctionInfos);
        this.auctionLists[rsp.guildid > 0 ? 1 : 0] = auctionInfos;
        GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_LIST_UPDATE);
        this.calculateRedPointState();
    };
    AuctionModel.prototype.sortInfos = function (infos) {
        var weight = function (info) {
            return info.createtime;
        };
        infos.sort(function (lhs, rhs) {
            return weight(rhs) - weight(lhs);
        });
    };
    /**更新单个拍卖信息 */
    AuctionModel.prototype._DoUpdateAuctionInfo = function (rsp) {
        var lists = this.auctionLists[rsp.guildid > 0 ? 1 : 0];
        var len = lists.length;
        if (len > 0) {
            var info = void 0;
            for (var i = 0; i < len; i++) {
                info = lists[i];
                if (info.id == rsp.item.id) {
                    info.parser(rsp.item);
                    if (info.status > 3)
                        lists.splice(i, 1);
                    GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_LIST_UPDATE);
                    break;
                }
            }
        }
        this.calculateRedPointState();
    };
    /**拍卖记录 */
    AuctionModel.prototype._DoUpdateAuctionRecord = function (rsp) {
        var len = rsp.items.length;
        this.recordInfos = [];
        var info;
        for (var i = 0; i < len; i++) {
            info = new AuctionInfo;
            info.parser(rsp.items[i]);
            this.recordInfos[i] = info;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_RECORD_UPDATE);
    };
    /**获得物品选择 */
    AuctionModel.prototype._DoUpdateAuctionSelect = function (rsp) {
        ViewManager.ins().open(AuctionSelectPanel, rsp.rewards[0]);
    };
    /**拍卖额度更新 */
    AuctionModel.prototype._DoUpdateAuctionRatio = function (rsp) {
        this.rechargeRatio = rsp.ratio;
        this.activeRatio = rsp.ratioAct;
        this.lockRatio = rsp.lockratio;
    };
    AuctionModel.prototype._DoUpdateAuctionRedPoint = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        // this.isRedPoint = true;
        // GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_REDPOINT_UPDATE);
        // 新增物品数据只有重新请求列表数据，才能得到
        GameGlobal.AuctionModel.sendAuctionList(0);
        if (GameGlobal.GangModel.HasGang())
            GameGlobal.AuctionModel.sendAuctionList(1);
    };
    /**使用物品 */
    AuctionModel.prototype.sendAuctionUseItem = function (id) {
        var req = new Sproto.cs_auction_useitem_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_auction_useitem, req);
    };
    /**物品选择1自用 2拍卖 */
    AuctionModel.prototype.sendAuctionSelect = function (choose) {
        var req = new Sproto.cs_auction_select_request;
        req.choose = choose;
        this.Rpc(C2sProtocol.cs_auction_select, req);
    };
    /**拍卖列表 0全服 1帮会*/
    AuctionModel.prototype.sendAuctionList = function (auctype) {
        var req = new Sproto.cs_auction_list_request;
        req.auctype = auctype;
        this.Rpc(C2sProtocol.cs_auction_list, req);
    };
    /**竞拍物品 */
    AuctionModel.prototype.sendAuctionOffer = function (id, auctype) {
        var req = new Sproto.cs_auction_offer_request;
        req.id = id;
        req.guildid = auctype;
        this.Rpc(C2sProtocol.cs_auction_offer, req);
    };
    AuctionModel.prototype.SendGetItemPrice = function (id) {
        var _this = this;
        var req = new Sproto.cs_auction_query_item_request;
        req.itemid = id;
        this.Rpc(C2sProtocol.cs_auction_query_item, req, function (rsp) {
            _this.mAuctionItemPrice[id] = rsp;
        });
    };
    /**一口价买走 */
    AuctionModel.prototype.sendAuctionBuy = function (id, auctype) {
        var req = new Sproto.cs_auction_buy_request;
        req.id = id;
        req.guildid = auctype;
        this.Rpc(C2sProtocol.cs_auction_buy, req);
    };
    /**竞拍物品记录 */
    AuctionModel.prototype.sendAuctionRecord = function (auctype) {
        var req = new Sproto.cs_auction_record_request;
        req.auctype = auctype;
        this.Rpc(C2sProtocol.cs_auction_record, req);
    };
    /**请求更新竞拍物品 */
    AuctionModel.prototype.sendAuctionUpdate = function (id, auctype) {
        var req = new Sproto.cs_auction_update_request;
        req.id = id;
        req.guildid = auctype;
        this.Rpc(C2sProtocol.cs_auction_update, req);
    };
    /**拍卖基础配置*/
    AuctionModel.prototype.getBaseConfig = function () {
        return GameGlobal.Config.AuctionBaseConfig;
    };
    /**1公示 2竞拍 3抢拍 4成交 5流拍 */
    AuctionModel.prototype.getDescByStatus = function (status) {
        var str = '';
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
    };
    AuctionModel.prototype.calculateRedPointState = function () {
        this.isRedPoint = false;
        for (var key in this.auctionLists) {
            if (this.auctionLists[key].length > 0) {
                this.isRedPoint = true;
                break;
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.AUCTION_REDPOINT_UPDATE);
    };
    /**拍卖剩余额度 */
    AuctionModel.prototype.getRemainRatio = function () {
        return this.rechargeRatio + this.activeRatio - this.lockRatio;
    };
    /**拍卖额度不足提示 */
    AuctionModel.prototype.showAlert = function () {
        var ratio1 = this.activeRatio - this.lockRatio > 0 ? this.activeRatio - this.lockRatio : 0;
        var ratio2 = ratio1 > 0 ? this.rechargeRatio : this.getRemainRatio();
        var str = '\n您在拍卖行的消费额度不足，无法参与竞拍\n\n|C:0x019704&T:充值额度剩余：' + ratio2 +
            '\n活跃剩余额度：' + ratio1 + '(优先消耗活跃额度)|\n\n'
            + '花费额度获得途径：\n每充值1元宝，增加' + this.getBaseConfig().goldratio + '元宝购买额度\n' +
            '每1点活跃度，可转化为' + this.getBaseConfig().activeratio + '元宝购买额度\n';
        WarnWin.show(str, function () { }, this, null, null, 'sure', { title: '拍卖提示' });
    };
    /**查看拍卖额度 */
    AuctionModel.prototype.showRatioPanel = function () {
        var ratio1 = this.activeRatio - this.lockRatio > 0 ? this.activeRatio - this.lockRatio : 0;
        var ratio2 = ratio1 > 0 ? this.rechargeRatio : this.getRemainRatio();
        var str = '\n|C:0x019704&T:充值额度剩余：' + ratio2 +
            '\n活跃剩余额度：' + ratio1 + '(优先消耗活跃额度)|\n\n'
            + '花费额度获得途径：\n每充值1元宝，增加' + this.getBaseConfig().goldratio + '元宝购买额度\n' +
            '每1点活跃度，可转化为' + this.getBaseConfig().activeratio + '元宝购买额度\n';
        WarnWin.show(str, function () { }, this, null, null, 'sure');
    };
    return AuctionModel;
}(BaseSystem));
__reflect(AuctionModel.prototype, "AuctionModel");
//# sourceMappingURL=AuctionModel.js.map