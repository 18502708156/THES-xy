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
var DailyInfoPanel = (function (_super) {
    __extends(DailyInfoPanel, _super);
    function DailyInfoPanel() {
        return _super.call(this) || this;
    }
    DailyInfoPanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnUpgrade, this._OnClick);
        this._AddClick(this.btnPrev, this._OnClick);
        this._AddClick(this.btnNext, this._OnClick);
        this._AddClick(this.btnResRetrieve, this._OnClick);
        this._AddClick(this.btnExpRetrieve, this._OnClick);
        this.list.itemRenderer = DailyTaskItem;
        this.SetTaskList();
        this.SetRetrieveBtn();
        this.SetMedalInfo();
        this.SetActiveNumInfo();
    };
    DailyInfoPanel.prototype.UpdateContent = function () {
    };
    DailyInfoPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.DAILY_ACTIVE_UPDATE, this.SetActiveNumInfo);
        this.observe(MessageDef.DAILY_MEDAL_UPDATE, this.SetMedalInfo);
        this.observe(MessageDef.DAILY_TASKLIST_UPDATE, this.SetTaskList);
        this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.SetRetrieveBtn);
        this.observe(MessageDef.DAILY_UPDATE_RETREVE_VIEW, this.SetRetrieveBtn);
    };
    DailyInfoPanel.prototype.OnClose = function () {
    };
    DailyInfoPanel.prototype.SetRetrieveBtn = function () {
        UIHelper.ShowRedPoint(this.btnExpRetrieve, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.EXP_RETRIEVE));
        UIHelper.ShowRedPoint(this.btnResRetrieve, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.RES_RETRIEVE));
    };
    DailyInfoPanel.prototype.SetTaskList = function () {
        var taskList = CommonUtils.GetArray(GameGlobal.Config.DailyProgressConfig, "id");
        var getWeight = function (config) {
            var confId = config.id;
            if (GameGlobal.DailyModel.GetTaskCount(confId) >= config.maxtimes)
                confId += 1000;
            var curLevel = GameGlobal.actorModel.level;
            if (curLevel < config.openlv)
                confId += 500;
            return confId;
        };
        taskList.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(taskList);
    };
    DailyInfoPanel.prototype.SetActiveNumInfo = function () {
        var baseInfo = GameGlobal.DailyModel.baseInfo;
        this.labActiveNum.text = baseInfo.mCurActive.toString();
        var maxActiveNum = GameGlobal.Config.DailyBaseConfig.activeupnum;
        this.progActive.maximum = GameGlobal.Config.DailyBaseConfig.activeupnum;
        this.progActive.value = baseInfo.mCurActive;
        var boxList = CommonUtils.GetArray(GameGlobal.Config.DailyActiveConfig, "id");
        var idx = 1;
        for (var _i = 0, boxList_1 = boxList; _i < boxList_1.length; _i++) {
            var config = boxList_1[_i];
            if (this["boxItem" + idx]) {
                this["boxItem" + idx].visible = true;
                this["boxItem" + idx].$setX((config.target / maxActiveNum) * 500 - 36);
                this["boxItem" + idx].setBoxInfo(config);
            }
            idx++;
        }
    };
    DailyInfoPanel.prototype.SetMedalInfo = function () {
        var baseInfo = GameGlobal.DailyModel.baseInfo;
        this.mMedalId = DailyConst.GetMedalId(baseInfo.mLevel);
        this.SetMedal(this.mMedalId);
        this.labLevel.text = "Lv." + baseInfo.mLevel;
        var curConfig = GameGlobal.Config.DailyAttrsConfig[baseInfo.mLevel];
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(curConfig.attrpower);
        UIHelper.ShowRedPoint(this.btnUpgrade, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.MEDAL_UPGRADE));
        var idx = 1;
        for (var _i = 0, _a = curConfig.attrpower; _i < _a.length; _i++) {
            var attr = _a[_i];
            if (this["labPropName" + idx]) {
                this["labPropName" + idx].text = AttributeData.getAttrStrByType(attr.type) + "\uFF1A";
                this["labPropNum" + idx].text = attr.value;
            }
            idx++;
        }
        var NextConfig = GameGlobal.Config.DailyAttrsConfig[baseInfo.mLevel + 1];
        if (NextConfig) {
            this.progExp.maximum = NextConfig.proexp;
            this.progExp.value = baseInfo.mExp;
            this.labLvExp.text = baseInfo.mExp + "/" + NextConfig.proexp;
            var idx_1 = 1;
            for (var _b = 0, _c = NextConfig.rewards; _b < _c.length; _b++) {
                var reward = _c[_b];
                if (this["item" + idx_1]) {
                    this["item" + idx_1].visible = true;
                    this["item" + idx_1].setItemAward(reward.type, reward.id, reward.count);
                }
                idx_1++;
            }
        }
        else {
            this.progExp.maximum = 999;
            this.progExp.value = 999;
            this.labLvExp.text = "";
            this.btnUpgrade.filters = Color.GetFilter();
            this.btnUpgrade.enabled = false;
            var idx_2 = 1;
            for (var _d = 0, _e = curConfig.rewards; _d < _e.length; _d++) {
                var reward = _e[_d];
                if (this["item" + idx_2]) {
                    this["item" + idx_2].visible = true;
                    this["item" + idx_2].setItemAward(reward.type, reward.id, reward.count);
                }
                idx_2++;
            }
        }
    };
    DailyInfoPanel.prototype.SetMedal = function (medalId) {
        this.mChooseMedalId = medalId;
        var config = GameGlobal.Config.DailyMedalConfig[medalId];
        if (!config) {
            return;
        }
        this.imgIcon.source = config.icon;
        this.imgQuality.source = "ui_xyll_bm_" + config.grade;
        this.btnPrev.visible = DailyConst.HasPrevMedal(medalId);
        this.btnNext.visible = DailyConst.HasNextMedal(medalId) && medalId <= this.mMedalId;
        this.labUpgradeTip.visible = medalId > this.mMedalId;
        if (medalId > this.mMedalId) {
            var day = GameGlobal.DailyModel.GetTimeReach(config.level);
            var text = "|C:0x019704&T:" + config.level + "|C:0x6e330b&T:\u7EA7\u6FC0\u6D3B(\u7EA6|C:0x019704&T:" + day + "|C:0x6e330b&T:\u5929\u540E)|";
            this.labUpgradeTip.textFlow = TextFlowMaker.generateTextFlow(text);
        }
    };
    DailyInfoPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnUpgrade:
                var baseInfo = GameGlobal.DailyModel.baseInfo;
                var NextConfig = GameGlobal.Config.DailyAttrsConfig[baseInfo.mLevel + 1];
                if (NextConfig.proexp <= baseInfo.mExp) {
                    GameGlobal.DailyModel.SendUpgradeMedal();
                }
                break;
            case this.btnPrev:
                this.SetMedal(this.mChooseMedalId - 1);
                break;
            case this.btnNext:
                this.SetMedal(this.mChooseMedalId + 1);
                break;
            case this.btnExpRetrieve:
                GameGlobal.DailyModel.RecordExpFlag(true);
                ViewManager.ins().open(DailyExpRetrieveWin);
                break;
            case this.btnResRetrieve:
                GameGlobal.DailyModel.RecordResFlag(true);
                ViewManager.ins().open(DailyResRetrieveWin);
                break;
        }
    };
    DailyInfoPanel.NAME = "西游历练";
    return DailyInfoPanel;
}(BaseView));
__reflect(DailyInfoPanel.prototype, "DailyInfoPanel", ["ICommonWindowTitle"]);
var DailyTaskItem = (function (_super) {
    __extends(DailyTaskItem, _super);
    function DailyTaskItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    DailyTaskItem.prototype.childrenCreated = function () {
        this.btnGoto.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGotoBtnClick, this);
    };
    DailyTaskItem.prototype.dataChanged = function () {
        var config = this.data;
        this.imgBg.visible = this.itemIndex % 2 == 0;
        this.btnGoto.name = config.id;
        this.labTaskName.text = config.name;
        this.labCount.text = GameGlobal.DailyModel.GetTaskCount(config.id) + "/" + config.maxtimes;
        this.labActiveTip.text = config.exp + "\u70B9/\u6B21";
        var curLevel = GameGlobal.actorModel.level;
        if (GameGlobal.DailyModel.GetTaskCount(config.id) < config.maxtimes) {
            this.btnGoto.visible = curLevel >= config.openlv;
            this.labTip.visible = curLevel < config.openlv;
            this.labTip.text = config.openlv + "\u7EA7\u5F00\u542F";
            this.labTip.textColor = Color.Red;
            return;
        }
        this.btnGoto.visible = false;
        this.labTip.visible = true;
        this.labTip.text = "已完成";
        this.labTip.textColor = Color.l_green_1;
    };
    DailyTaskItem.prototype._OnGotoBtnClick = function (e) {
        var taskId = parseInt(e.currentTarget.name);
        switch (taskId) {
            case DailyConst.TASK_TYPE_PERSONALBOSS:
                ViewManager.ins().open(BossMainPanel);
                break;
            case DailyConst.TASK_TYPE_PUBLICBOSS:
                ViewManager.ins().openIndex(BossMainPanel, 1);
                break;
            case DailyConst.TASK_TYPE_EQUIPSMELT:
                ViewManager.ins().open(SmeltEquipTotalWin);
                break;
            case DailyConst.TASK_TYPE_ARENA:
                ViewManager.ins().open(ArenaWin);
                break;
            case DailyConst.TASK_TYPE_MATERIALCOPY:
                ViewManager.ins().open(FbLayer);
                break;
            case DailyConst.TASK_TYPE_ESCORT:
                ViewManager.ins().open(QujingMainWin);
                break;
            case DailyConst.TASK_TYPE_TEAMCOPY:
                ViewManager.ins().open(CrossMainPanel);
                break;
            case DailyConst.TASK_TYPE_PERCHARGE:
                RechargeWin.Open();
                break;
        }
        ViewManager.ins().close(DailyMainWin);
    };
    return DailyTaskItem;
}(eui.ItemRenderer));
__reflect(DailyTaskItem.prototype, "DailyTaskItem");
//# sourceMappingURL=DailyInfoPanel.js.map