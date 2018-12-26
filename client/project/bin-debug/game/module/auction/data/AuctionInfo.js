var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AuctionInfo = (function () {
    function AuctionInfo() {
        this.id = 0;
        /**物品ID */
        this.itemid = 0;
        /**物品数量 */
        this.count = 0;
        /**当前价格 (单价) */
        this.price = 0;
        /**物品拥有者 */
        this.playername = '';
        /**当前出价的人 */
        this.offername = '';
        /**1公示 2竞拍 3抢拍 4成交 5流拍 */
        this.status = 0;
        /**上架时间 */
        this.createtime = 0;
        /**交易时间 */
        this.dealtime = 0;
        /**是否是一口价 1 或 0 */
        this.isbuy = 0;
    }
    AuctionInfo.prototype.parser = function (data) {
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
        this.dealprice = data.dealprice;
        this.addprice = data.addprice;
        this.numerictype = data.numerictype;
    };
    // 是否有竞拍的人
    AuctionInfo.prototype.HasOffer = function () {
        return this.offername ? true : false;
    };
    return AuctionInfo;
}());
__reflect(AuctionInfo.prototype, "AuctionInfo");
//# sourceMappingURL=AuctionInfo.js.map