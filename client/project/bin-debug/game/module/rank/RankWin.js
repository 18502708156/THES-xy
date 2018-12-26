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
var RankWin = (function (_super) {
    __extends(RankWin, _super);
    function RankWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'RankWinSkin';
        return _this;
        // this.listView.itemRenderer = ItemBaseNotName;
    }
    RankWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.commonDialogBg.OnAdded(this);
        this.rewardList = [];
        // this._AddItemClick(this.itemList,this.onItemClick)
        // this._AddClick(this.gReBg,this.onBgClick)
    };
    ;
    /**排行榜
     * @param 竞技排行类型
     */
    RankWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var type = param.length ? param[0] : RankDataType.TYPE_ARENA;
        var rank = null;
        switch (type) {
            case RankDataType.TYPE_ARENA:
                this.currentState = "four";
                this.itemList.itemRenderer = RankDataItem;
                this.tValue1.text = "战力";
                this.commonDialogBg.title = '竞技排名';
                this.observe(MessageDef.ARENA_RANK_DATA, this.getRankData);
                GameGlobal.Arena.sendArenaRank();
                rank = GameGlobal.Arena.getMyRank();
                var config = GameGlobal.Arena.getRankRewards(rank);
                this.showContent(rank, config);
                break;
            case RankDataType.TYPE_GANG_BOSS_PERSON:
                this.HandleBossPersonRank(GameGlobal.GangBossModel.mCurRank, false);
                break;
            case RankDataType.TYPE_ACROSS_PERSON:
                this.HandleBossPersonRank(GameGlobal.AcrossBossController.mCurRank, true);
                break;
        }
    };
    RankWin.prototype.HandleBossPersonRank = function (rank, showServer) {
        this.itemList.itemRenderer = RankDataHurtItem;
        this.tValue1.text = "伤害";
        this.commonDialogBg.title = '伤害排名';
        this.currentState = "three";
        //rank = GameGlobal.AcrossBossController.mCurRank
        this.gScore.visible = true;
        this.lbExNe.text = "伤害:";
        if (rank.mydamage) {
            this.tScore.text = rank.mydamage + "";
        }
        else {
            this.tScore.text = "";
        }
        if (rank.myrank) {
            this.tRank.text = rank.myrank + "";
        }
        else {
            this.tRank.text = "";
        }
        var tRank = [];
        for (var i = 0; i < rank.playerranks.length; i++) {
            var oRank = { rank: 1, name: "", value: 0 };
            oRank.rank = i + 1;
            var serverText = showServer ? " .S" + rank.playerranks[i].serverid : "";
            oRank.name = rank.playerranks[i].name + serverText;
            oRank.value = rank.playerranks[i].damage;
            tRank.push(oRank);
        }
        this.itemList.dataProvider = new eui.ArrayCollection(tRank);
    };
    RankWin.prototype.getRankData = function (rsp) {
        this.itemList.dataProvider = new eui.ArrayCollection(rsp.ranklist);
    };
    RankWin.prototype.showContent = function (rank, config) {
        this.tRank.text = rank + '';
        if (config) {
            var i = 0, len = config.length;
            var rewardCon = void 0;
            for (i; i < len; i++) {
                rewardCon = this.rewardList[i];
                if (!rewardCon) {
                    rewardCon = new IconWithText();
                    rewardCon.y = 897;
                    this.addChild(rewardCon);
                    this.rewardList.push(rewardCon);
                }
                rewardCon.setIcon(config[i].id);
                rewardCon.setCount(config[i].count + '');
                rewardCon.x = 430 + (rewardCon.width + 2) * i >> 0;
            }
        }
    };
    RankWin.prototype.OnClose = function () {
        this.removeObserve();
    };
    RankWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return RankWin;
}(BaseEuiView));
__reflect(RankWin.prototype, "RankWin");
//# sourceMappingURL=RankWin.js.map