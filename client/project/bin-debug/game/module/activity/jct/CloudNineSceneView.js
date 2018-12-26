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
var CloudNineSceneView = (function (_super) {
    __extends(CloudNineSceneView, _super);
    function CloudNineSceneView() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.nextGiftScore = 0;
        _this.score = 0;
        _this.maxScore = 0;
        _this.skinName = "CloudNineSceneSkin";
        var scoretask = GameGlobal.Config.ClimbTowerBaseConfig.scoretask;
        for (var key in scoretask)
            _this.maxScore = scoretask[key].score;
        return _this;
    }
    CloudNineSceneView.prototype.OnOpen = function () {
        this.observe(MessageDef.CLOUD_NINE_GIFT_REFRES, this.RefresTaskTraceBtn);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup);
        this._AddClick(this.manualBtn, this._OnClick);
        this._AddClick(this.rankBtn, this._OnClick);
        this._AddClick(this.taskTraceBtn, this._OnClick);
        var activityTime = GameGlobal.CloudNineModel.getActivityTime();
        this.counterLabel.SetColor(Color.Green);
        this.counterLabel.SetEndTime(activityTime, DurationLabel.TIMETEXT_TYPE_MMSS);
        this.RefreshHeadImg();
        this.powerLabel.text = GameLogic.ins().actorModel.power.toString();
        var lv = GameGlobal.actorModel.level || 0;
        this.lbLev.text = "lv." + lv;
        this.lbName.text = GameGlobal.actorModel.name;
        this.UpdataContent();
    };
    CloudNineSceneView.prototype.UpdataContent = function () {
        this.lvTxt.text = GameGlobal.Config.MapConfig[GameMap.fubenID].name;
        this.AdaptationGroup();
        this.RefresTaskTraceBtn();
    };
    CloudNineSceneView.prototype.AdaptationGroup = function () {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
        this.groupAdaptation.y -= 300;
    };
    CloudNineSceneView.prototype.RefresTaskTraceBtn = function () {
        var score = GameGlobal.CloudNineModel.score;
        var rewardsocre = GameGlobal.CloudNineModel.rewardsocre;
        this.score = score;
        this.nextGiftScore = rewardsocre;
        var scoretask = GameGlobal.Config.ClimbTowerBaseConfig.scoretask;
        var itemConfig = GameGlobal.Config.ItemConfig;
        for (var key in scoretask)
            if (scoretask[key].score == rewardsocre) {
                this.giftBagTxt.textColor = ItemBase.GetColorByQuality(itemConfig[scoretask[key].item].quality);
                this.giftBagTxt.text = GameGlobal.Config.ItemConfig[scoretask[key].item].name;
            }
        this.integralTxt.textFlow = TextFlowMaker.generateTextFlow((this.score >= rewardsocre ? '|C:' + Color.Green + "&T:" : '|C:' + Color.Red + "&T:") + this.score + '|C:' + Color.Green + "&T:" + '/' + rewardsocre);
        if (this.score >= scoretask[scoretask.length - 1].score) {
            if (this.nextGiftScore != -1) {
                this.giftBagTxt.textColor = ItemBase.GetColorByQuality(itemConfig[scoretask[scoretask.length - 1].item].quality);
                this.giftBagTxt.text = GameGlobal.Config.ItemConfig[scoretask[scoretask.length - 1].item].name;
                this.giftTipsTxt.text = '奖励：';
            }
            else {
                this.giftBagTxt.textColor = Color.Red;
                this.giftBagTxt.text = "积分目标已全部达成";
                this.integralTxt.text = this.score + '/' + scoretask[scoretask.length - 1].score;
                this.giftTipsTxt.text = '';
            }
        }
    };
    CloudNineSceneView.prototype.OnClose = function () {
        this.removeObserve();
        TimerManager.ins().removeAll(this);
    };
    CloudNineSceneView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.manualBtn:
                ViewManager.ins().open(ActivityDescPanel, GameGlobal.Config.ClimbTowerBaseConfig.tips);
                break;
            case this.rankBtn:
                ViewManager.ins().open(CloudNineRankPanel, CloudNineRankType.local);
                break;
            case this.taskTraceBtn:
                if (this.score >= this.nextGiftScore) {
                    if (this.nextGiftScore != -1)
                        GameGlobal.CloudNineModel.sendGetGoods();
                    else
                        GameGlobal.UserTips.showTips("积分目标已全部达成");
                }
                else
                    GameGlobal.UserTips.showTips("积分不足");
                break;
        }
    };
    CloudNineSceneView.prototype.RefreshHeadImg = function () {
        var role = SubRoles.ins().GetRoleData();
        if (role) {
            this.face.source = ResDataPath.GetHeadImgName(role.job, role.sex);
        }
    };
    CloudNineSceneView.LAYER_LEVEL = LayerManager.UI_BATTLE;
    return CloudNineSceneView;
}(BaseEuiView));
__reflect(CloudNineSceneView.prototype, "CloudNineSceneView");
//# sourceMappingURL=CloudNineSceneView.js.map