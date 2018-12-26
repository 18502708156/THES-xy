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
var GameBattleManualPanel = (function (_super) {
    __extends(GameBattleManualPanel, _super);
    function GameBattleManualPanel(context) {
        var _this = _super.call(this) || this;
        _this.selectTypeIndex = EntityType.Role;
        _this.battleManual = {};
        _this.mIsAuto = true;
        // 忽略三秒计时
        _this.mIgnoreTime = false;
        _this.mIsPlay = false;
        _this.mState = 0;
        // 释放技能顺序
        _this.USE_SORT = (_a = {},
            _a[EntityType.Role] = EntityType.Pet,
            _a[EntityType.Pet] = null,
            _a);
        _this.m_Timer = 0;
        _this.m_IsUpdate = false;
        _this.skinName = "GameBattleManualSkin";
        _this.m_Context = context;
        _this.skillList.itemRenderer = GameBattleBtn2Item;
        // this._AddClick(this.skillList, this._OnItemClick)
        _this._AddClick(_this.autoBtn, _this._OnClick);
        _this._AddClick(_this.petBtn, _this._OnClick);
        _this._AddClick(_this.roleBtn, _this._OnClick);
        _this.roleBtn["typeIcon"].source = "ui_bm_juesebiaoji";
        _this.petBtn["typeIcon"].source = "ui_bm_chongwubiaoji";
        return _this;
        var _a;
    }
    GameBattleManualPanel.prototype.OnOpen = function () {
        this.timeLabel.visible = false;
        this.autoBtnGroup.visible = false;
        this.mIsAuto = true;
        this.mIgnoreTime = false;
        this.mIsPlay = false;
        this.observe(MessageDef.BATTLE_TURN, this.StartTurn);
        this.observe(MessageDef.BATTLE_TURN_START, this.StartTurnStart);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos);
        this.StartManual();
        this._UpdatePos();
    };
    GameBattleManualPanel.prototype._UpdatePos = function () {
        MiniChatPanel.UpdateViewPos(this.bottomGroup);
    };
    GameBattleManualPanel.prototype.OnClose = function () {
        this.ClearUpdateTimer();
    };
    GameBattleManualPanel.prototype.SelectNextSkill = function () {
        var data = this.battleManual[this.selectTypeIndex];
        if (!data) {
            this.UpdateSelSkillGroup(false);
            this.UseSelSkill();
            return;
        }
        this.UpdateSelSkillGroup(true, this.selectTypeIndex);
    };
    GameBattleManualPanel.prototype.StartTurn = function () {
        // if (!this.selSkillGroup.visible) {
        //     this.autoBtnGroup.visible = true
        // }
        this.mIsPlay = false;
    };
    GameBattleManualPanel.prototype.StartTurnStart = function () {
        this.mIsPlay = true;
        // this.autoBtnGroup.visible = false
        this.selSkillGroup.visible = false;
        this.ShowTimeGroup(false);
        this.SetBtnIcon();
    };
    GameBattleManualPanel.prototype.ShowTimeGroup = function (state) {
        this.timeLabel.visible = state;
    };
    GameBattleManualPanel.prototype._OnItemClick = function (itemData) {
        // let index = e.itemIndex
        // let itemData = e.item
        var data = this.battleManual[itemData.type];
        if (!data) {
            return;
        }
        data.skillId = itemData.skillId;
        this.UpdateSelSkillGroup(false);
        this.m_Context.SelectTarget(itemData.type, itemData.skillId);
        this.autoBtn.icon = GameBattleManualPanel.IMG.RETURN;
    };
    GameBattleManualPanel.prototype.SelectTarget = function (roleType, skillId, handles) {
        var data = this.battleManual[roleType];
        if (!data) {
            console.error("SelectTarget error roleType => " + roleType);
            return;
        }
        data.targets = handles;
        this.selectTypeIndex = this.USE_SORT[roleType];
        this.SelectNextSkill();
    };
    GameBattleManualPanel.prototype.UseSelSkill = function () {
        var list = [];
        for (var key in this.battleManual) {
            var data = this.battleManual[key];
            if (data) {
                var item = new GameBattleManualData;
                item.skillId = data.skillId;
                item.handle = data.handle;
                item.targets = data.targets;
                list.push(item);
                data.skillId = 0;
                data.targets = [];
            }
        }
        GameGlobal.RaidMgr.mBattleRaid.UseSkill(list);
    };
    GameBattleManualPanel.prototype._OnClick = function (e) {
        switch (e.target) {
            case this.autoBtn:
                // 自动释放技能状态
                if (this.mIsAuto) {
                    this.mIsAuto = false;
                    this.ClearUpdateTimer();
                    if (this.mIsPlay || this.mIgnoreTime) {
                        UserTips.InfoTip("下回合开始手动释放技能");
                    }
                    else {
                        this.selectTypeIndex = EntityType.Role;
                        this.SelectNextSkill();
                    }
                    this.mIgnoreTime = true;
                    this.SetBtnIcon();
                    GameGlobal.RaidMgr.mBattleRaid.SendSetAuto(false);
                    // 如果是手动释放技能
                }
                else {
                    if (this.autoBtn.icon == GameBattleManualPanel.IMG.RETURN) {
                        this.m_Context.CancelSelectTarget();
                        this.selectTypeIndex = EntityType.Role;
                        this.SelectNextSkill();
                    }
                    else if (this.autoBtn.icon == GameBattleManualPanel.IMG.AUTO) {
                        this.mIsAuto = true;
                        // 隐藏技能框，开始自动释放技能
                        this.UpdateSelSkillGroup(false);
                        GameGlobal.RaidMgr.mBattleRaid.SendSetAuto(true);
                        this.SetBtnIcon();
                    }
                }
                break;
            case this.roleBtn:
                this.UpdateSelSkillGroup(true, EntityType.Role);
                break;
            case this.petBtn:
                this.UpdateSelSkillGroup(true, EntityType.Pet);
                break;
        }
    };
    GameBattleManualPanel.prototype.UpdateContent = function () {
        this.UpdateSkillBtn();
    };
    GameBattleManualPanel.prototype.UpdateSkillBtn = function () {
        this.battleManual = {};
        var raid = GameGlobal.RaidMgr.mBattleRaid;
        var entityDataList = raid.mEntityDatas[raid.mMySide - 1];
        for (var _i = 0, entityDataList_1 = entityDataList; _i < entityDataList_1.length; _i++) {
            var data = entityDataList_1[_i];
            var setData = null;
            var entity = raid.GetEntity(data.handle);
            if (!entity) {
                continue;
            }
            // 死亡
            if (entity.mAI.IsDead()) {
                continue;
            }
            if (data.type == EntityType.Role) {
                setData = true;
                // 宠物需要出战状态
            }
            else if (data.type == EntityType.Pet && data.posIndex != -1) {
                setData = true;
            }
            if (setData) {
                var manualData = new GameBattleManualData;
                manualData.handle = data.handle;
                manualData.skillId = data.GetSkillIDs()[0] || 0;
                this.battleManual[data.type] = manualData;
            }
        }
        this.UpdateSkillBtnDesc();
    };
    GameBattleManualPanel.prototype.UpdateSkillBtnDesc = function () {
        if (this.battleManual[EntityType.Role]) {
            this.roleBtn.icon = SkillsConfig.GetSkillIcon(this.battleManual[EntityType.Role].skillId);
        }
        else {
            UIHelper.SetVisible(this.roleBtn, false);
        }
        if (this.battleManual[EntityType.Pet]) {
            this.petBtn.icon = SkillsConfig.GetSkillIcon(this.battleManual[EntityType.Pet].skillId);
        }
        else {
            UIHelper.SetVisible(this.petBtn, false);
        }
    };
    GameBattleManualPanel.prototype.UpdateSelSkillGroup = function (state, index) {
        if (index === void 0) { index = -1; }
        this.selSkillGroup.visible = state;
        // this.autoBtnGroup.visible = !state
        if (index < 0) {
            return;
        }
        var data = this.battleManual[index];
        if (!data) {
            return;
        }
        var entity = GameGlobal.RaidMgr.mBattleRaid.mEntityList[data.handle];
        if (!entity) {
            return;
        }
        var info = entity.GetInfo();
        if (!info) {
            return;
        }
        this.autoBtn.icon = GameBattleManualPanel.IMG.AUTO;
        var title = "";
        var selId = data.skillId || 0;
        if (info.type == EntityType.Role) {
            title = "角色技能";
        }
        else if (info.type == EntityType.Pet) {
            title = "宠物技能";
        }
        else {
            title = "未知技能";
        }
        this.label.text = title;
        var list = [];
        for (var _i = 0, _a = info.GetSkillIDs(); _i < _a.length; _i++) {
            var id = _a[_i];
            list.push({
                handle: info.handle,
                type: info.type,
                skillId: id,
                selId: selId
            });
        }
        this.skillList.dataProvider = new eui.ArrayCollection(list);
    };
    // 开始手动技能计时
    GameBattleManualPanel.prototype.StartManual = function (entitySkill) {
        if (entitySkill === void 0) { entitySkill = null; }
        // 刷新使用的技能
        this.UpdateSkillBtn();
        this.mEntitySkill = null;
        if (entitySkill) {
            var data = {};
            for (var _i = 0, entitySkill_1 = entitySkill; _i < entitySkill_1.length; _i++) {
                var data1 = entitySkill_1[_i];
                if (data1.skills) {
                    var dict = {};
                    for (var _a = 0, _b = data1.skills; _a < _b.length; _a++) {
                        var data2 = _b[_a];
                        dict[data2] = true;
                    }
                    data[data1.handler] = dict;
                }
            }
            this.mEntitySkill = data;
        }
        if (!this.mIsAuto) {
            this.SetBtnIcon();
            this.selectTypeIndex = EntityType.Role;
            this.SelectNextSkill();
            return;
        }
        this.SetBtnIcon();
        if (!this.mIgnoreTime && !this.m_IsUpdate) {
            this.ShowTimeGroup(true);
            this.m_Timer = 3;
            this.m_IsUpdate = true;
            this._UpdateTimer();
            this.AddTimer(700, 5, this._UpdateTimer);
        }
    };
    GameBattleManualPanel.prototype.SetAuto = function (isauto) {
        this.mIsAuto = isauto;
        if (!isauto) {
            this.mIgnoreTime = true;
        }
        this.SetBtnIcon();
    };
    GameBattleManualPanel.prototype.SetBtnIcon = function () {
        var isAuto = this.mIsAuto;
        if (isAuto) {
            this.autoBtn.icon = GameBattleManualPanel.IMG.MANUAL;
        }
        else {
            this.autoBtn.icon = GameBattleManualPanel.IMG.AUTO;
        }
    };
    GameBattleManualPanel.prototype.ClearUpdateTimer = function () {
        this.ShowTimeGroup(false);
        if (this.m_IsUpdate) {
            this.m_IsUpdate = false;
            TimerManager.ins().remove(this._UpdateTimer, this);
        }
    };
    GameBattleManualPanel.prototype._UpdateTimer = function () {
        this.timeLabel.text = (this.m_Timer--) + "";
        if (this.m_Timer < 0) {
            this.ClearUpdateTimer();
        }
    };
    /////////////////////////////////////////////////////////////////////////////
    GameBattleManualPanel.IMG = {
        RETURN: "ui_bm_fanhui",
        AUTO: "ui_bm_zidong",
        MANUAL: "ui_zd_bt_shoudong",
    };
    GameBattleManualPanel.STATE_AUTO = 0;
    GameBattleManualPanel.STATE_MANUAL = 1;
    return GameBattleManualPanel;
}(BaseView));
__reflect(GameBattleManualPanel.prototype, "GameBattleManualPanel");
var GameBattleManualData = (function () {
    function GameBattleManualData() {
        this.targets = [];
    }
    return GameBattleManualData;
}());
__reflect(GameBattleManualData.prototype, "GameBattleManualData");
var GameBattleBtn2Item = (function (_super) {
    __extends(GameBattleBtn2Item, _super);
    function GameBattleBtn2Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GameBattleBtn2Item.prototype.childrenCreated = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    GameBattleBtn2Item.prototype._OnClick = function () {
        if (this.IsCool()) {
            UserTips.InfoTip("技能冷却中");
            return;
        }
        Util.GetParentByType(this, GameBattleManualPanel)._OnItemClick(this.data);
    };
    GameBattleBtn2Item.prototype.IsCool = function () {
        var parent = Util.GetParentByType(this, GameBattleManualPanel);
        var skillId = this.data.skillId;
        var handle = this.data.handle;
        if (parent.mEntitySkill == null) {
            return false;
        }
        return parent.mEntitySkill[handle] && parent.mEntitySkill[handle][skillId] ? false : true;
    };
    GameBattleBtn2Item.prototype.dataChanged = function () {
        var selId = this.data.selId;
        var skillId = this.data.skillId;
        var handle = this.data.handle;
        var icon = SkillsConfig.GetSkillIcon(skillId);
        this.skillIcon.source = icon;
        this.coolLabel.visible = this.IsCool();
    };
    return GameBattleBtn2Item;
}(eui.ItemRenderer));
__reflect(GameBattleBtn2Item.prototype, "GameBattleBtn2Item");
//# sourceMappingURL=GameBattleManualPanel.js.map