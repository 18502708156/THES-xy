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
var AnswerRankWin = (function (_super) {
    __extends(AnswerRankWin, _super);
    function AnswerRankWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'RankWinSkin';
        _this.itemList.itemRenderer = AnswerRankItem;
        _this.listView.itemRenderer = ItemBaseNotName;
        return _this;
    }
    AnswerRankWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.commonDialogBg.OnAdded(this);
        this.rewardList = [];
        this.tValue1.text = "分数";
    };
    ;
    /**排行榜
     * @param 竞技排行类型
     */
    AnswerRankWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._AddItemClick(this.itemList, this.onItemClick);
        this._AddClick(this.gReBg, this.onBgClick);
        this._AddItemClick(this.itemList, this.onItemClick);
        var pData = param[0];
        if (pData) {
            var tList = [];
            for (var item in pData) {
                var pRank = { name: "", point: 0, rank: 0 };
                pRank.name = pData[item].name;
                pRank.point = pData[item].point;
                pRank.rank = parseInt(item) + 1;
                tList.push(pRank);
            }
            this.getRankData(tList);
        }
        this.showContent();
    };
    AnswerRankWin.prototype.getRankData = function (rsp) {
        this.itemList.dataProvider = new eui.ArrayCollection(rsp);
    };
    AnswerRankWin.prototype.showContent = function () {
        var tData = GameGlobal.AnswerController.getAnswerData();
        this.tRank.text = tData.rankNo + "" || ""; //排行
        this.gScore.visible = true;
        this.tScore.text = tData.point + "" || ""; //分数
    };
    AnswerRankWin.prototype.OnClose = function () {
        this.removeObserve();
    };
    AnswerRankWin.prototype.onItemClick = function (e) {
        var item = e;
        if (e.item.rank) {
            var rankNo = e.item.rank;
            var tConfig = GlobalConfig.ins().AnswerAwardConfig;
            for (var index in tConfig) {
                if (rankNo >= tConfig[index].rank[0] && rankNo <= tConfig[index].rank[1]) {
                    this.listView.dataProvider.replaceAll(tConfig[index].reward);
                }
            }
        }
        this.gReBg.visible = true;
        this.gReward.y = e.itemRenderer.y + this.pScr.y - this.gReward.height - this.itemList.scrollV;
    };
    AnswerRankWin.prototype.onBgClick = function () {
        this.gReBg.visible = false;
    };
    AnswerRankWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return AnswerRankWin;
}(BaseEuiView));
__reflect(AnswerRankWin.prototype, "AnswerRankWin");
//# sourceMappingURL=AnswerRankWin.js.map