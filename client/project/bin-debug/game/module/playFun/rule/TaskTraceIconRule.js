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
var TaskTraceIconRule = (function (_super) {
    __extends(TaskTraceIconRule, _super);
    function TaskTraceIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.m_TaskXPos = null;
        _this.m_id = 0;
        _this.TaskIndexs = [
            ViewIndexDef.EquipWearAssign,
            ViewIndexDef.ChapterClear,
            ViewIndexDef.PetActive,
            // ViewIndexDef.TeamFb, 
            ViewIndexDef.MaterialFb,
            ViewIndexDef.HeavenFb,
            ViewIndexDef.ChapterGoto,
        ];
        _this.updateMessage = [MessageDef.UPDATE_MAIN_TASK];
        _this.taskTraceName = t.getChildByName("taskTraceName");
        _this.taskTraceAward0 = t.getChildByName("priceicon0");
        _this.taskTraceAward1 = t.getChildByName("priceicon1");
        return _this;
    }
    TaskTraceIconRule.prototype.checkShowIcon = function () {
        return this._CheckShowIcon();
    };
    TaskTraceIconRule.prototype._CheckShowIcon = function () {
        var isShow = false;
        var data = GameGlobal.UserTask.mainTaskData[0];
        if (data) {
            isShow = true;
            var config = GameGlobal.UserTask.getTaskConfigById(data.id);
            if (config) {
                switch (data.state) {
                    case 1:
                        var maxValue = this.TaskIndexs.indexOf(config.condition.type) > -1 ? 1 : config.condition.value;
                        this.taskTraceName.textFlow = TextFlowMaker.generateTextFlow(config.desc + "|C:0xff0000&T:(" + data.value + "/" + maxValue + ")|");
                        break;
                    case 2:
                        this.taskTraceName.textFlow = TextFlowMaker.generateTextFlow(config.desc + "|C:0x00ff00&T:(完成)|");
                        break;
                }
                this.showAwards(config.showAward);
                this.upDateTaskGuild();
            }
            if (!this.m_TaskXPos) {
                this.m_TaskXPos = this.taskTraceName.x;
            }
            if (this.m_id != data.id) {
                var t = egret.Tween.get(this.taskTraceAward0);
                t.to({ "x": this.m_TaskXPos + 100, "alpha": 0 }, 200).to({ "x": 0 }, 200).to({ "x": this.m_TaskXPos, "alpha": 1 }, 200);
                var t1 = egret.Tween.get(this.taskTraceAward1);
                t1.to({ "x": this.m_TaskXPos + 202, "alpha": 0 }, 200).to({ "x": 0 }, 200).to({ "x": this.m_TaskXPos + 102, "alpha": 1 }, 200);
                var t2 = egret.Tween.get(this.taskTraceName);
                t2.to({ "x": this.m_TaskXPos + 100, "alpha": 0 }, 200).to({ "x": 0 }, 200).to({ "x": this.m_TaskXPos, "alpha": 1 }, 200);
            }
            this.m_id = data.id;
        }
        else {
            isShow = false;
        }
        return isShow;
    };
    TaskTraceIconRule.prototype.showAwards = function (awards) {
        var i = 0;
        for (var index in awards) {
            if (0 == i) {
                this.taskTraceAward0.type = awards[index].id;
                this.taskTraceAward0.setPrice(awards[index].count, 2);
            }
            else if (1 == i) {
                this.taskTraceAward1.type = awards[index].id;
                this.taskTraceAward1.setPrice(awards[index].count, 2);
            }
            i++;
        }
    };
    TaskTraceIconRule.prototype.upDateTaskGuild = function () {
        var data = GameGlobal.UserTask.mainTaskData[0];
        if (!data) {
            return;
        }
        var config = GameGlobal.UserTask.getTaskConfigById(data.id);
        if (config) {
            switch (data.state) {
                case 1:
                    TaskTraceIconRule[data.id] = false;
                    if (config.guide) {
                        var has = true;
                        if (config.guidecount) {
                            has = config.guidecount > (GameGlobal.GuideUtil.mGuideDoneCount[config.guide] || 0);
                        }
                        if (has && !ViewManager.ins().isShow(WelComeLandingPanel)) {
                            GameGlobal.GuideUtil.Start(config.guide);
                        }
                    }
                    break;
                case TaskState.GET:
                    if (config.guideAward) {
                        GameGlobal.GuideUtil.Finish(ViewManager.ins().getView(PlayFunView), this.tar);
                    }
                    if (TaskTraceIconRule[data.id] == false) {
                        delete TaskTraceIconRule[data.id];
                        GameGlobal.PlotModel.OnTaskFinish(data.id);
                    }
                    break;
            }
        }
    };
    TaskTraceIconRule.prototype.getEffName = function (redPointNum) {
        if (GameGlobal.actorModel.level < GameGlobal.Config.GuideBaseConfig.showeff) {
            return null;
        }
        var eff;
        var data = GameGlobal.UserTask.mainTaskData[0];
        if (data) {
            switch (data.state) {
                case 0:
                    if (GameGlobal.GameLogic.actorModel.level <= 20) {
                    }
                    break;
                case TaskState.GET:
                    eff = "battle_001";
                    break;
            }
        }
        this.effX = TaskTraceIconRule.EFF_X;
        this.effY = TaskTraceIconRule.EFF_Y;
        return eff;
    };
    ;
    TaskTraceIconRule.prototype.tapExecute = function () {
        var data = GameGlobal.UserTask.mainTaskData[0];
        if (!data) {
            return;
        }
        if (data.state == 1) {
            var obj = GameGlobal.UserTask.getTaskConditionById(data.id);
            if (obj.type == 30010 && GameGlobal.UserFb.guanqiaID < GameGlobal.Config.GuideBaseConfig.chapterid) {
                GuanQiaRewardPanel.CLICK_TASK_COMEIN = true;
            }
            else {
                GuanQiaRewardPanel.CLICK_TASK_COMEIN = false;
            }
            ViewManager.ins().Guide(obj.type, obj.value);
        }
        else {
            GameGlobal.UserTask.sendGetTask(data.id);
            if (!GameGlobal.UserTask.getTaskConfigById(data.id + 1)) {
                UserTips.ins().showTips("已完成所有任务!");
            }
        }
    };
    ;
    TaskTraceIconRule.UN_TASK_LIST = {};
    TaskTraceIconRule.EFF_X = 173;
    TaskTraceIconRule.EFF_Y = 47;
    return TaskTraceIconRule;
}(RuleIconBase));
__reflect(TaskTraceIconRule.prototype, "TaskTraceIconRule");
//# sourceMappingURL=TaskTraceIconRule.js.map