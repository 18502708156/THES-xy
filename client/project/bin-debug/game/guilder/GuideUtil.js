var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GuideUtil = (function () {
    function GuideUtil() {
        this.mGuideDoneCount = {};
        this.m_LastTime = 0;
        this.m_IsBindMsg = false;
        /**
         * 当前显示状态
         * 0、已经关闭 1、正在显示 >=2、等待关闭界面界面的延时
         */
        this.m_ShowState = 0;
        this.m_IsAdd = false;
        this.m_GuideDelay = null;
        this.m_GuideStep = null;
    }
    Object.defineProperty(GuideUtil.prototype, "GuideId", {
        get: function () {
            return this.m_GuideId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuideUtil.prototype, "mGuideHand", {
        get: function () {
            if (!this.guideHand) {
                this.guideHand = new GuideHand;
            }
            return this.guideHand;
        },
        enumerable: true,
        configurable: true
    });
    GuideUtil.CheckPart = function (type) {
        return this.mCheckPart[type] ? true : false;
    };
    // 结束引导，停留箭头
    GuideUtil.prototype.Finish = function (panel, target) {
        if (!panel || !target) {
            return;
        }
        this.m_GuideId = -1;
        this.m_GuideStep = null;
        this.m_GuideDelay = null;
        this.Show(panel, target, 0);
    };
    /**
     * 开始显示引导
     */
    GuideUtil.prototype.Start = function (guideId) {
        var config = GameGlobal.Config.GuideStepConfig[guideId];
        if (!config) {
            return;
        }
        this.m_GuideId = guideId;
        this.m_GuideStep = null;
        this.m_GuideDelay = null;
        this.DoGuide(0);
    };
    /**
     * 引导结束触发事件
     * @returns true 继续执行
     *          false 中断引导，需要执行其它事件
     */
    GuideUtil.prototype.Trigger = function (data, step) {
        if (!data) {
            return true;
        }
        if (data.type == 2) {
            if (!this.m_IsAdd) {
                this.m_IsAdd = true;
                GameGlobal.MessageCenter.addListener(MessageDef.PLOT_PLAY_END, this.OnPlotEnd, this);
            }
            PlotPanel.OpenPlot(data.value, this.m_GuideId * 1000000 + step);
            return false;
        }
        return true;
    };
    GuideUtil.prototype.OnPlotEnd = function (flagId) {
        if (this.m_IsAdd) {
            this.m_IsAdd = false;
            GameGlobal.MessageCenter.removeListener(MessageDef.PLOT_PLAY_END, this.OnPlotEnd, this);
        }
        var guide = Math.floor(flagId / 1000000);
        var step = flagId % 1000000;
        if (guide == this.m_GuideId) {
            this.Guide(step + 1);
        }
    };
    /**
     * 引导前触发的事件
     */
    GuideUtil.prototype.PreTrigger = function (data, step) {
        if (!data) {
            return true;
        }
        if (data.type == 1) {
            GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL_ALL);
            var text = GameGlobal.Config.GuideBaseConfig.text;
            GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_COPY_NAME, text[MathUtils.limitInteger(0, text.length - 1)], true);
        }
        else {
            console.error("not imple PreTrigger type => " + data.type);
        }
        return true;
    };
    /**
     * 引导步骤
     */
    GuideUtil.prototype.Guide = function (step) {
        this.m_GuideStep = step;
        this.m_GuideDelay = 3;
    };
    GuideUtil.prototype.DoGuide = function (step) {
        var config = GameGlobal.Config.GuideStepConfig[this.m_GuideId];
        if (!config) {
            this.HideGuideHand();
            return;
        }
        var data = config[step];
        if (!data) {
            this.HideGuideHand();
            return;
        }
        if (!this.CheckCondition(data.preCon)) {
            console.log("条件不满足退出 => ", this.m_GuideId, step);
            this.HideGuideHand();
            return;
        }
        if (!this.PreTrigger(data.preui, step)) {
            this.HideGuideHand();
            return;
        }
        var datas = GuideConst.GetTarget(data.panel, data.pos);
        if (datas) {
            var view = datas[0];
            var target = datas[1];
            this.Show(view, target, step);
        }
        else {
            this.HideGuideHand();
        }
    };
    GuideUtil.prototype.GetTopLayer = function (panel) {
        if (!panel) {
            return null;
        }
        var parent = panel;
        while (true) {
            if (parent["__TOP_LAYER__"]) {
                return parent;
            }
            parent = parent.parent;
            if (!parent) {
                return null;
            }
        }
    };
    /**
     * 指向引导对象
     */
    GuideUtil.prototype.Show = function (panel, target, step) {
        if (!panel || !target) {
            this.HideGuideHand();
            return;
        }
        DisplayUtils.removeFromParent(this.mGuideHand);
        var topLayer = this.GetTopLayer(panel);
        if (topLayer) {
            topLayer.parent.addChildAt(this.mGuideHand, topLayer.parent.getChildIndex(topLayer) + 1);
        }
        if (this.m_ShowState != 0 && this.mGuideHand.$visible) {
            this.mGuideHand.MoveToTarget(this.m_GuideId, step, panel, target);
        }
        else {
            this.mGuideHand.ShowTarget(this.m_GuideId, step, panel, target);
        }
        this.m_ShowState = 1;
    };
    GuideUtil.prototype.Init = function () {
        egret.startTick(this.UpdateTime, this);
    };
    GuideUtil.prototype.UpdateTime = function (timeStamp) {
        if (this.m_GuideStep != null) {
            if (this.m_GuideDelay) {
                --this.m_GuideDelay;
            }
            else {
                var step = this.m_GuideStep;
                this.m_GuideStep = null;
                this.DoGuide(step);
            }
        }
        var delta = timeStamp - this.m_LastTime;
        this.m_LastTime = timeStamp;
        if (this.guideHand && this.guideHand.parent && this.m_ShowState == 1) {
            this.guideHand.OnUpdate(delta);
        }
        if (this.m_ShowState >= 2) {
            --this.m_ShowState;
            if (this.m_ShowState <= 2) {
                if (this.guideHand) {
                    this.guideHand.OnClose();
                    DisplayUtils.removeFromParent(this.guideHand);
                }
                this.m_ShowState = 0;
            }
        }
        return false;
    };
    GuideUtil.prototype.CheckCondition = function (data) {
        if (!data) {
            return true;
        }
        switch (data.type) {
            case 1:
                return GameGlobal.UserFb.CanPkBoss();
            default:
                console.error("not impl check condition => " + data);
                break;
        }
        return true;
    };
    GuideUtil.prototype.HideGuideHand = function (force) {
        if (force === void 0) { force = false; }
        if (force) {
            this.m_ShowState = 2;
        }
        else {
            this.m_ShowState = 2 + 4; // 延时4帧结束动画
        }
    };
    // 目标被移除
    GuideUtil.prototype.OnTargetRemoved = function (targetId, stepId) {
        if (this.m_GuideId != targetId) {
            return;
        }
        this.HideGuideHand();
    };
    GuideUtil.prototype.OnTargetTap = function (targetId, stepId) {
        if (this.m_GuideId != targetId) {
            return;
        }
        var config = GameGlobal.Config.GuideStepConfig[targetId];
        if (!config) {
            this.HideGuideHand();
            return;
        }
        var data = config[stepId];
        if (!this.Trigger(data.ui, stepId)) {
            this.HideGuideHand();
            return;
        }
        if (!config[stepId + 1]) {
            // console.log("完成引导 => ", targetId, stepId)
            this.mGuideDoneCount[targetId] = (this.mGuideDoneCount[targetId] || 0) + 1;
            this.HideGuideHand(true);
        }
        else {
            this.Guide(stepId + 1);
        }
    };
    GuideUtil.mCheckPart = {};
    return GuideUtil;
}());
__reflect(GuideUtil.prototype, "GuideUtil");
//# sourceMappingURL=GuideUtil.js.map