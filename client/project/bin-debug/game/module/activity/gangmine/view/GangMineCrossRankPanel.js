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
var GangMineCrossRankPanel = (function (_super) {
    __extends(GangMineCrossRankPanel, _super);
    function GangMineCrossRankPanel() {
        var _this = _super.call(this) || this;
        /**每页数量 */
        _this.pageNum = 4;
        /**当前页 */
        _this.curpage = 1;
        return _this;
    }
    GangMineCrossRankPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "GangMineCrossRankSkin";
        this.commonWindowBg.SetTitle('跨服排名');
    };
    ;
    GangMineCrossRankPanel.prototype.initData = function () {
        this.list.itemRenderer = GangMineRankItem;
        this.list.dataProvider = null;
        this.pageBtn.setPage(1);
        this.curpage = 1;
        this.pageBtn.setMax(1);
    };
    /**回调当前页码 */
    GangMineCrossRankPanel.prototype.pageChangeFun = function (page) {
        this.curpage = page;
        this.list.dataProvider = new eui.ArrayCollection(this.getPageList(this.curpage));
    };
    GangMineCrossRankPanel.prototype.getPageList = function (page) {
        var i = 0, len = this.rankInfos.length - (page - 1) * this.pageNum;
        var list = [];
        if (len > this.pageNum)
            len = this.pageNum;
        for (i; i < len; i++) {
            list[i] = this.rankInfos[i + (page - 1) * len];
        }
        return list;
    };
    GangMineCrossRankPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GANGMINE_RANK_INFO, this.updateContent);
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.pageChangeFun);
        GameGlobal.GangMineModel.sendGangMineScoreRank(2);
    };
    GangMineCrossRankPanel.prototype.updateContent = function () {
        this.rankInfos = GameGlobal.GangMineModel.mineRanks[2];
        /**设置起始页 */
        this.pageBtn.setPage(1);
        this.curpage = 1;
        /**设置最大页 */
        this.pageBtn.setMax(this.rankInfos.length / this.pageNum >> 0);
        this.list.dataProvider = new eui.ArrayCollection(this.rankInfos);
        if (GameGlobal.actorModel.HasGuild()) {
            var isMe = false;
            for (var key in this.rankInfos) {
                if (this.rankInfos[key].guildId == GameGlobal.actorModel.guildID) {
                    this.trank.text = this.rankInfos[key].rank + '';
                    this.tscore.text = this.rankInfos[key].score + '分';
                    isMe = true;
                    break;
                }
            }
            if (!isMe)
                this.trank.text = '未上榜';
        }
        else {
            this.tscore.text = '0分';
            this.trank.text = '未上榜';
        }
    };
    GangMineCrossRankPanel.prototype.OnClose = function () {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    ;
    GangMineCrossRankPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return GangMineCrossRankPanel;
}(BaseEuiView));
__reflect(GangMineCrossRankPanel.prototype, "GangMineCrossRankPanel");
//# sourceMappingURL=GangMineCrossRankPanel.js.map