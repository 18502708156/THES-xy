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
var GuanQiaRewardPanel = (function (_super) {
    __extends(GuanQiaRewardPanel, _super);
    function GuanQiaRewardPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        /** 宝箱指向关卡 */
        _this.boxPass = 0;
        _this.guideHand = null;
        _this.guideFrame = null;
        return _this;
    }
    // 引导对象
    GuanQiaRewardPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.challengeBtn,
            _a;
        var _a;
    };
    GuanQiaRewardPanel.prototype.childrenCreated = function () {
        this.challengeBtn.visible = false;
        this.bar.value = 0;
    };
    ;
    GuanQiaRewardPanel.prototype.OnOpen = function () {
        this.AddClick(this.showRankTxt, this.onTouchTap);
        this.AddClick(this.challengeBtn, this.onTouchTap);
        this.AddClick(this.btn_help, this.onTouchTap);
        this.observe(MessageDef.FUBEN_CHANGE, this.upDataGuanqia);
        GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_FB);
        this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent);
        this.UpdateContent();
        TimerManager.ins().doTimer(100, 1, this.startUpdateRule, this); //时间更新函数
    };
    ;
    GuanQiaRewardPanel.prototype.OnClose = function () {
        GuanQiaRewardPanel.CLICK_TASK_COMEIN = false;
        // this.simpleRankPanel.close()
        //  TimerManager.ins().remove(this.hideGuideHand, this)
        // this.hideGuideHand()
    };
    ;
    GuanQiaRewardPanel.prototype.startUpdateRule = function () {
    };
    GuanQiaRewardPanel.prototype.onTouchTap = function (e) {
        switch (e.currentTarget) {
            case this.challengeBtn:
                if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
                    BagFullTipsPanel.Open();
                }
                else {
                    GameGlobal.UserFb.sendPKBoss();
                }
                break;
            case this.showRankTxt:
                ViewManager.ins().open(GuanQiaRankPanel);
                break;
            case this.btn_help:
                if (Deblocking.Check(DeblockingType.TYPE_49) && Deblocking.Check(DeblockingType.TYPE_115)) {
                    if (GameGlobal.UserFb.isShowBossPK()) {
                        GameGlobal.Chat.chatShareInfo(20, null); //目前只有世界
                        UserTips.InfoTip("已发送求助信息到世界聊天");
                        // UserTips.ins().showTips("5秒后才能再请求")
                    }
                    else {
                        UserTips.ins().showTips("请先击杀剩余怪物");
                    }
                }
                break;
        }
    };
    ;
    GuanQiaRewardPanel.prototype.upDataGuanqia = function () {
        this.UpdateContent();
    };
    ;
    GuanQiaRewardPanel.prototype.upDateGuanqiaWroldReward = function () {
        this.boxPass = GameGlobal.UserFb.getWorldGuanQia();
    };
    ;
    /** 获取头像下表计算起始值 */
    GuanQiaRewardPanel.prototype.getPassIndex = function (guanqiaID) {
        var index;
        if (guanqiaID % GuanQiaRewardPanel.BOSS_HEAD_COUNT == 0)
            index = guanqiaID - GuanQiaRewardPanel.BOSS_HEAD_COUNT + 1;
        else
            index = guanqiaID - guanqiaID % GuanQiaRewardPanel.BOSS_HEAD_COUNT + 1;
        return index;
    };
    ;
    GuanQiaRewardPanel.prototype.UpdateContent = function () {
        var rankData = GameGlobal.RankingModel.ranks[RankingModel.RANK_TYPE_FB];
        if (rankData)
            for (var _i = 0, _a = rankData.datas; _i < _a.length; _i++) {
                var value = _a[_i];
                if (value.pos == 1)
                    this.lb_r0.text = value.pos + "  " + value.name + "  " + value.chapterlevel + "\u5173";
                else if (value.pos == 2)
                    this.lb_r1.text = value.pos + "  " + value.name + "  " + value.chapterlevel + "\u5173";
                else if (value.pos == 3)
                    this.lb_r2.text = value.pos + "  " + value.name + "  " + value.chapterlevel + "\u5173";
            }
        var guanqiaID = GameGlobal.UserFb.guanqiaID;
        var bossReward = GameGlobal.UserFb.config.showAward;
        // var [config, isReward]  = ChapterRewardPanel.IsReward()
        var isReward = false;
        // var config = GlobalConfig.ins().ChaptersRewardConfig[GameGlobal.UserFb.guanqiaReward];
        // var preConfig = GlobalConfig.ins().ChaptersRewardConfig[GameGlobal.UserFb.guanqiaReward - 1];
        // if (!config) {
        // 	config = preConfig;
        // } else {
        // 	this.bar.maximum = preConfig ? config.needLevel - preConfig.needLevel : config.needLevel;
        // 	this.bar.value = guanqiaID - (preConfig ? preConfig.needLevel : 0) - 1;
        // 	isReward = this.bar.value >= this.bar.maximum
        // }
        //关卡求助内容
        // appealtime = 0
        // helptime = 0
        var nMaxAppeal = GlobalConfig.ins().ChaptersCommonConfig.appealtime || 0;
        var nMaxHelp = GlobalConfig.ins().ChaptersCommonConfig.helptime || 0;
        this.lb_helpNum.text = "已求助次数：" + GameGlobal.UserFb.appealtime + "/" + nMaxAppeal;
        this.lb_beHelpNum.text = "可协助次数：" + GameGlobal.UserFb.helptime + "/" + nMaxHelp;
        var guanqiaId = GameGlobal.UserFb.guanqiaID - 1;
        var chapterConfig = GameGlobal.Config.ChaptersRewardConfig[Math.floor(guanqiaId / 10) + 1];
        this.gchapreward.data = chapterConfig.rewards[0];
        this.bar.maximum = 10;
        this.bar.value = guanqiaId % 10;
        this.showPanel.SetBodyId(Number(GameGlobal.UserFb.config.bossId.avatar));
        this.mapNameTxt.text = "第" + GameGlobal.UserFb.guanqiaID + "关 " + GameGlobal.UserFb.Desc;
        var item;
        for (var i = 0; i < this.itemGroup.numChildren; i++) {
            item = this.itemGroup.getChildAt(i);
            if (bossReward[i]) {
                item.data = bossReward[i];
            }
            else {
                DisplayUtils.removeFromParent(item);
            }
        }
        var userFb = GameGlobal.UserFb;
        this.updateChallenge();
        this.showChallengeGuide();
    };
    ;
    GuanQiaRewardPanel.prototype.updateChallenge = function () {
        if (GuanQiaRewardPanel.CLICK_TASK_COMEIN && GameGlobal.UserFb.guanqiaID < GameGlobal.Config.GuideBaseConfig.chapterid) {
            this.challengeBtn.visible = true;
        }
        else {
            this.challengeBtn.visible = GameGlobal.UserFb.isShowBossPK();
        }
        this.needWave.visible = !this.challengeBtn.visible;
        this.needWave.text = "再击杀" + GameGlobal.UserFb.getNeedWave() + "波怪物可挑战";
        if (GameGlobal.UserFb.guanqiaID >= GameGlobal.UserFb.checkGuanKaMax()) {
            this.challengeBtn.visible = false;
            this.needWave.visible = true;
            this.needWave.text = "恭喜通关所有关卡";
        }
    };
    ;
    /**
     * 显示挑战引导
     * @returns void
     */
    GuanQiaRewardPanel.prototype.showChallengeGuide = function () {
    };
    ;
    GuanQiaRewardPanel.NAME = "关卡";
    /** boss头像数量 */
    GuanQiaRewardPanel.BOSS_HEAD_COUNT = 10;
    return GuanQiaRewardPanel;
}(BaseView));
__reflect(GuanQiaRewardPanel.prototype, "GuanQiaRewardPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=GuanQiaRewardPanel.js.map