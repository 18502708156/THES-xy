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
var GameBattlePanel = (function (_super) {
    __extends(GameBattlePanel, _super);
    function GameBattlePanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mChildView = [];
        _this.showFinishTurn = null;
        _this.m_IsTip = false;
        _this.mShowType = 0;
        _this.skinName = "GameBattleSkin";
        _this.timeLabel.visible = false;
        _this._AddClick(_this.finishBtn, _this._OnClick);
        _this._AddClick(_this.speedBtn, _this._OnClick);
        return _this;
    }
    GameBattlePanel.prototype.destoryView = function () {
    };
    GameBattlePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mShowType = param[0];
        this.caName.text = BattleMap.mFbName;
        this.lbDes.text = BattleMap.mFbDesc;
        this.observe(MessageDef.BATTLE_TURN, this.UpdateContent);
        this.observe(MessageDef.BATTLE_TURN_START, this.TurnStart);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos);
        this._UpdatePos();
        this.UpdateSpdBtn();
        this.showFinishTurn = null;
        this.m_IsTip = false;
        this.finishBtn.visible = false;
        if (BattleMap.IsNoramlLevel()) {
            this.battleInfo.visible = false;
            this.treasureInfo.visible = false;
        }
        else {
            var skipbattle = false;
            this.battleInfo.visible = true;
            if (BattleMap.IsGuanQiaBoss()) {
                var cfg = GameGlobal.RaidModel.mChapterData.fbcfg;
                this.treasureInfo.visible = false;
                this.showFinishTurn = cfg.jbutton;
            }
            else {
                var cfg = GameGlobal.Config.InstanceConfig[BattleMap.mFbId];
                this.showFinishTurn = cfg[GameGlobal.Config.InstanceConfig_keys.jbutton];
                skipbattle = cfg[GameGlobal.Config.InstanceConfig_keys.skipbattle];
                //是否为藏宝图副本
                if (BattleMap.IsCangBaoTu()) {
                    this.bossInfo.visible = false;
                    this.treasureInfo.visible = true;
                    //需要特殊的按钮跳过方式 by 海梵 
                    if (UserVip.ins().lv >= GameGlobal.Config.TreasureMapBaseConfig.roundviplevel) {
                        //通关后的
                        if (GameGlobal.UserFb.bCbtAcross) {
                            this.showFinishTurn = 1; //开始就出现逃过按钮
                        }
                    }
                }
                else {
                    this.bossInfo.visible = true;
                    this.treasureInfo.visible = false;
                }
            }
            if (this.showFinishTurn) {
                if (skipbattle && GameGlobal.FuliModel.FuliData.IsMonth()) {
                    this.showFinishTurn = 1;
                }
            }
        }
        if (GameGlobal.RaidMgr.mBattleRaid.mIsManual) {
            if (!this.mManualPanel) {
                this.mManualPanel = new GameBattleManualPanel(this);
            }
            this.addChild(this.mManualPanel);
            this.mManualPanel.DoOpen();
            this.mManualPanel.UpdateContent();
        }
        else {
            if (this.mManualPanel && this.mManualPanel.parent) {
                DisplayUtils.removeFromParent(this.mManualPanel);
            }
        }
        this.UpdateContent();
    };
    GameBattlePanel.prototype._UpdatePos = function () {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
    };
    GameBattlePanel.prototype.StartManual = function (time, entitySkill) {
        if (time) {
            this.timeLabel.visible = true;
            this.timeLabel.text = time + "";
            this.AddTimer(1000, time, this._UpdateTime);
        }
        if (this.mManualPanel) {
            this.mManualPanel.StartManual(entitySkill);
        }
    };
    GameBattlePanel.prototype.SetAuto = function (isauto) {
        if (this.mManualPanel) {
            this.mManualPanel.SetAuto(isauto);
        }
    };
    GameBattlePanel.prototype._UpdateTime = function () {
        var val = Math.max(Number(this.timeLabel.text) - 1, 0);
        this.timeLabel.text = val + "";
    };
    GameBattlePanel.prototype.TurnStart = function () {
        if (!this.m_IsTip && BattleMap.IsGuanQiaBoss()) {
            LayerManager.UI_Main_2.addChild(new BossComeToAttackView);
            this.m_IsTip = true;
        }
        if (this.timeLabel.visible) {
            this.timeLabel.visible = false;
            TimerManager.ins().remove(this._UpdateTime, this);
        }
        if (this.mSelectPanel) {
            this.mSelectPanel.CancelSelectTarget();
        }
    };
    GameBattlePanel.prototype.AddChildBaseView = function (view) {
        this.mChildView.push(view);
        this.addChildAt(view, 0);
        view.DoOpen(null);
    };
    GameBattlePanel.prototype.OnClose = function () {
        for (var _i = 0, _a = this.mChildView; _i < _a.length; _i++) {
            var view = _a[_i];
            DisplayUtils.removeFromParent(view);
            view.DoClose();
        }
        this.mChildView = [];
        if (this.mManualPanel && this.mManualPanel.parent) {
            this.mManualPanel.DoClose();
            DisplayUtils.removeFromParent(this.mManualPanel);
        }
    };
    GameBattlePanel.prototype._OnClick = function (e) {
        switch (e.target) {
            case this.finishBtn:
                GameGlobal.RaidMgr.mBattleRaid.FinishBattle();
                break;
            case this.speedBtn:
                var speed = SystemSettingPanel.GetSpeed();
                if (speed > 1.5) {
                    FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, false);
                    FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, false);
                }
                else if (speed > 1) {
                    if (GameGlobal.actorModel.vipLv >= 9) {
                        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, true);
                    }
                    else {
                        UserTips.InfoTip("达到VIP9，开启3倍速度");
                        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, false);
                        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, false);
                    }
                }
                else {
                    FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, true);
                }
                this.UpdateSpdBtn();
                break;
        }
    };
    GameBattlePanel.prototype.UpdateSpdBtn = function () {
        var speed = SystemSettingPanel.GetSpeed();
        if (speed > 1.5) {
            this.speedBtn.icon = GameBattlePanel.SPPED_ICON[2];
        }
        else if (speed > 1) {
            this.speedBtn.icon = GameBattlePanel.SPPED_ICON[1];
        }
        else {
            this.speedBtn.icon = GameBattlePanel.SPPED_ICON[0];
        }
    };
    GameBattlePanel.prototype.UpdateContent = function () {
        var config = GameGlobal.Config.InstanceConfig[BattleMap.mFbId];
        var maxTurn = config ? (config[GameGlobal.Config.InstanceConfig_keys.totalTime] || 5) : 5;
        var turnid = GameGlobal.RaidMgr.mBattleRaid.GetTurnId();
        turnid = turnid <= maxTurn ? turnid : maxTurn;
        this.turnLabel.text = turnid + "/" + maxTurn;
        if (GameGlobal.RaidMgr.mBattleRaid.mIsVideo) {
            this.finishBtn.visible = true;
        }
        else if (this.showFinishTurn) {
            this.finishBtn.visible = turnid >= this.showFinishTurn;
        }
        //是否为藏宝图副本
        if (BattleMap.IsCangBaoTu()) {
            this.lbMax.text = maxTurn;
            this.lbMid.text = GameGlobal.Config.TreasureMapBaseConfig.onestar;
            this.lbMin.text = GameGlobal.Config.TreasureMapBaseConfig.twostar;
            this.progress.labelDisplay.visible = false;
            this.progress.maximum = maxTurn;
            this.progress.value = (maxTurn - turnid);
        }
    };
    GameBattlePanel.prototype.CancelSelectTarget = function () {
        if (this.mSelectPanel) {
            this.mSelectPanel.CancelSelectTarget();
        }
    };
    GameBattlePanel.prototype.SelectTarget = function (roleType, skillId) {
        if (!this.mSelectPanel) {
            this.mSelectPanel = new GameBattleSelectPanel(this);
        }
        this.selGroup.addChild(this.mSelectPanel);
        this.mSelectPanel.SelectTarget(roleType, skillId);
    };
    GameBattlePanel.prototype.SelectDone = function (roleType, skillId, handle) {
        if (this.mManualPanel) {
            this.mManualPanel.SelectTarget(roleType, skillId, handle);
        }
        else {
            console.error("not mManualPanel");
        }
    };
    GameBattlePanel.LAYER_LEVEL = LayerManager.UI_BATTLE;
    GameBattlePanel.VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM;
    GameBattlePanel.SPPED_ICON = [
        "ui_bm_sp_1",
        "ui_bm_sp_2",
        "ui_bm_sp_3",
    ];
    return GameBattlePanel;
}(BaseEuiView));
__reflect(GameBattlePanel.prototype, "GameBattlePanel");
//# sourceMappingURL=GameBattlePanel.js.map