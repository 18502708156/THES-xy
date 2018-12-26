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
var GBattleScoreWin = (function (_super) {
    __extends(GBattleScoreWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleScoreWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleScoreListSkin";
        _this.commonWindowBg.SetTitle("积分奖励");
        return _this;
    }
    GBattleScoreWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = GBattleScoreItem;
        this.UpdateContent();
    };
    GBattleScoreWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.UpdateContent);
        this.commonWindowBg.OnAdded(this);
    };
    GBattleScoreWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    GBattleScoreWin.prototype.UpdateContent = function () {
        var scoreList = GangBattleConst.GetScoreList();
        var getWeight = function (config) {
            var confId = config.id;
            if (GameGlobal.GangBattleModel.HasScoreRewardGain(confId)) {
                return confId + 1000;
            }
            if (GameGlobal.GangBattleModel.CanScoreRewardGain(confId)) {
                return confId - 1000;
            }
            return confId;
        };
        scoreList.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(scoreList);
    };
    GBattleScoreWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GBattleScoreWin;
}(BaseEuiView));
__reflect(GBattleScoreWin.prototype, "GBattleScoreWin", ["ICommonWindow"]);
var GBattleScoreItem = (function (_super) {
    __extends(GBattleScoreItem, _super);
    function GBattleScoreItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GBattleScoreItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBase;
        this.btnGain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    GBattleScoreItem.prototype.dataChanged = function () {
        var config = this.data;
        this.list.dataProvider = new eui.ArrayCollection(config.showitem);
        this.imgGained.visible = GameGlobal.GangBattleModel.HasScoreRewardGain(config.id);
        this.labUndone.visible = !GameGlobal.GangBattleModel.CanScoreRewardGain(config.id);
        this.btnGain.visible = !this.imgGained.visible && !this.labUndone.visible;
        var text = "|C:0x019704&T:\u3010\u79EF\u5206\u793C\u5305\u3011|C:0x6e330b&T:(\u79EF\u5206\u8FBE\u5230" + config.needpoints + "\u53EF\u9886\u53D6)|";
        this.labText.textFlow = TextFlowMaker.generateTextFlow(text);
        var gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo;
        var curScore = gbPlayerGlobalInfo.mScore;
        var scoreText = "";
        if (curScore >= config.needpoints) {
            scoreText = "|C:0x019704&T:" + curScore;
        }
        else {
            scoreText = "|C:0xdb0000&T:" + curScore;
        }
        this.labScore.textFlow = TextFlowMaker.generateTextFlow(scoreText + "|C:0x6e330b&T:/" + config.needpoints + "|");
    };
    GBattleScoreItem.prototype._OnBtnClick = function (e) {
        GameGlobal.GangBattleModel.SendGainScoreAward(this.data.id);
    };
    return GBattleScoreItem;
}(eui.ItemRenderer));
__reflect(GBattleScoreItem.prototype, "GBattleScoreItem");
//# sourceMappingURL=GBattleScoreWin.js.map