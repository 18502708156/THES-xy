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
var FieldBossDetailPanel = (function (_super) {
    __extends(FieldBossDetailPanel, _super);
    function FieldBossDetailPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FieldBossDetailSkin";
        _this.list1.itemRenderer = ItemBaseNotName;
        _this.list2.itemRenderer = ItemBaseNotName;
        _this.bar.labelFunction = function (cur, max) {
            return Math.floor(cur * 100 / max) + "%";
        };
        return _this;
    }
    FieldBossDetailPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.m_bossId = param[0];
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "野外BOSS";
        var config = GameGlobal.Config.FieldBossConfig[this.m_bossId];
        this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.bossid)));
        this.list1.dataProvider = new eui.ArrayCollection(config.fixedshowitem);
        this.list2.dataProvider = new eui.ArrayCollection(config.showitem);
        var monsterCfg = GameGlobal.Config.MonstersConfig[config.bossid];
        this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name] + "(" + monsterCfg[GameGlobal.Config.MonstersConfig_keys.level] + "级)";
        var bossInfo = GameGlobal.BossModel.GetBossInfoById(Enum_BOSSTYPE.field_boss, config.id);
        this.bar.maximum = monsterCfg[GameGlobal.Config.MonstersConfig_keys.hp];
        this.bar.value = bossInfo.hp;
        this.challengeLabel.text = config.level + "级";
        var canEnter = GameGlobal.actorModel.level >= config.level; // && GameGlobal.BossModel.IsChallengeTime() && bossInfo.status == FieldBossState.OPEN
        var leftTime = 0;
        if (canEnter && !bossInfo.isDie && !GameGlobal.BossModel.IsRun()) {
            if (config.needbossprops) {
                var myCount = GameGlobal.UserBag.getBagGoodsCountById(0, config.needbossprops.id);
                if (config.needbossprops.count > myCount) {
                    this.enterLabel.text = "未满足";
                    this.enterLabel.textColor = 0xff0000;
                }
            }
            else {
                this.enterLabel.text = "已满足";
                this.enterLabel.textColor = 0x6E330B;
            }
            leftTime = this.m_LeftTime = GameGlobal.BossModel.GetRunLeftTime();
            this.runLabel.text = DateUtils.format_3(leftTime); //GameGlobal.BossModel.GetRunTime();
            this.runLabel.textColor = 0x6E330B;
        }
        else {
            if (bossInfo.isDie || GameGlobal.BossModel.IsRun()) {
                this.runLabel.text = "Boss刷新后25分钟";
                this.runLabel.textColor = 0xff0000;
            }
            else {
                leftTime = this.m_LeftTime = GameGlobal.BossModel.GetRunLeftTime();
                this.runLabel.text = DateUtils.format_3(leftTime); //GameGlobal.BossModel.GetRunTime();
                this.runLabel.textColor = 0x6E330B;
            }
            this.enterLabel.text = "未满足";
            this.enterLabel.textColor = 0xff0000;
        }
        if (bossInfo.ownerId && bossInfo.leftTime > 0) {
            this.m_owner = bossInfo.ownerName;
            this.m_ownerTime = bossInfo.leftTime;
            this.bossOwnerLabel.textFlow = TextFlowMaker.generateTextFlow("|C:0x6E330B&T:BOSS\u5F53\u524D\u5F52\u5C5E\uFF1A|C:0x2F6FF6&T:" + bossInfo.ownerName + "|C:0xd27701&T:(" + bossInfo.leftTime + "s)|");
            UIHelper.SetHeadByHeadId(this.headComp, bossInfo.ownerHeadId, false);
            this.AddTimer(1000, this.m_ownerTime, this.UpdateOwnTime);
        }
        else {
            this.bossOwnerLabel.text = "BOSS当前归属：无";
            UIHelper.SetHeadByHeadId(this.headComp, 0, false);
        }
        if (leftTime) {
            this.AddTimer(1000, Math.ceil(leftTime * 0.001), this.UpdateTime);
        }
        this.challengeCardGroup.visible = !bossInfo.ischallenge;
        if (config.needbossprops) {
            var myCount = GameGlobal.UserBag.getBagGoodsCountById(0, config.needbossprops.id); //GameGlobal.UserBag.GetCount(200495)
            this.challengeCard_txt.textFlow = TextFlowMaker.consumeLabel(myCount, config.needbossprops.count);
        }
        else {
            this.challengeCardGroup.visible = false;
        }
        this.AddClick(this.goBtn, this.OnTap);
        this.AddClick(this.addBtn, this.OnTap);
    };
    FieldBossDetailPanel.prototype.OnClose = function () {
        GameGlobal.BossModel.sendCallFieldBossList();
        this.commonDialog.OnRemoved();
        TimerManager.ins().remove(this.UpdateTime, this);
    };
    FieldBossDetailPanel.prototype.UpdateOwnTime = function () {
        if (this.m_ownerTime) {
            this.bossOwnerLabel.textFlow = TextFlowMaker.generateTextFlow("|C:0x6E330B&T:BOSS\u5F53\u524D\u5F52\u5C5E\uFF1A|C:0x2F6FF6&T:" + this.m_owner + "|C:0xd27701&T:(" + this.m_ownerTime + "s)|");
            this.m_ownerTime--;
            if (this.m_ownerTime <= 0) {
                TimerManager.ins().remove(this.UpdateOwnTime, this);
                this.m_ownerTime = 0;
                this.bossOwnerLabel.text = "BOSS当前归属：无";
            }
        }
    };
    FieldBossDetailPanel.prototype.UpdateTime = function () {
        if (this.m_LeftTime) {
            this.runLabel.text = DateUtils.format_3(this.m_LeftTime);
            this.m_LeftTime -= 1000;
            if (this.m_LeftTime <= 0) {
                TimerManager.ins().remove(this.UpdateTime, this);
                this.m_LeftTime = 0;
                this.runLabel.text = "已逃跑";
                this.runLabel.textColor = 0xff0000;
            }
        }
    };
    FieldBossDetailPanel.prototype.OnTap = function (e) {
        var config = GameGlobal.Config.FieldBossConfig[this.m_bossId];
        switch (e.target) {
            case this.goBtn:
                var bossInfo = GameGlobal.BossModel.GetBossInfoById(Enum_BOSSTYPE.field_boss, config.id);
                if (!bossInfo && bossInfo.hp <= 0) {
                    return;
                }
                if (GameGlobal.actorModel.level < config.level) {
                    UserTips.ErrorTip("主角等级不足");
                    return;
                }
                else if (bossInfo.isDie) {
                    UserTips.ErrorTip("BOSS已击杀");
                    return;
                }
                else if (bossInfo.IsClose()) {
                    UserTips.ErrorTip("BOSS已关闭");
                    return;
                }
                else if (GameGlobal.BossModel.IsRun()) {
                    UserTips.ErrorTip("BOSS已逃跑");
                    return;
                }
                else if (!bossInfo.ischallenge) {
                    if (config.needbossprops) {
                        var myCount = GameGlobal.UserBag.getBagGoodsCountById(0, config.needbossprops.id);
                        if (config.needbossprops.count > myCount) {
                            UserTips.ErrorTip(GameGlobal.Config.ItemConfig[config.needbossprops.id].name + "不足");
                            return;
                        }
                    }
                }
                if (!UserFb.FinishAndCheckFighting2()) {
                }
                else {
                    GameGlobal.BossModel.sendChallenge(this.m_bossId);
                    this.CloseSelf();
                }
                break;
            case this.addBtn:
                UserWarn.ins().setBuyGoodsWarn(config.needbossprops.id, config.needbossprops.count);
                break;
        }
    };
    FieldBossDetailPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FieldBossDetailPanel;
}(BaseEuiView));
__reflect(FieldBossDetailPanel.prototype, "FieldBossDetailPanel");
//# sourceMappingURL=FieldBossDetailPanel.js.map