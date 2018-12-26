var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FriendData = (function () {
    function FriendData() {
        /**关注列表数据 */
        this.friendsDate = [];
        /**黑名单列表数据 */
        this.blacklistData = [];
        /**推荐列表数据 */
        this.referrerDate = [];
        /**粉丝列表数据 */
        this.fansData = [];
        /**友币次数 */
        this.curCoinNum = 0;
        /**接收友币次数 */
        this.takeCoinNum = 0;
    }
    return FriendData;
}());
__reflect(FriendData.prototype, "FriendData");
//# sourceMappingURL=FriendData.js.map