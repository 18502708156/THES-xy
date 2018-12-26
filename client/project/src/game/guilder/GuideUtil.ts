class GuideUtil {

    public mGuideDoneCount: {[key: number]: number} = {}

    private m_LastTime: number = 0
    private m_GuideId: number
    private m_IsBindMsg = false

    /**
     * 当前显示状态
     * 0、已经关闭 1、正在显示 >=2、等待关闭界面界面的延时
     */
    private m_ShowState = 0

    private guideHand: GuideHand

    public get GuideId(): number
    {
        return this.m_GuideId
    }

    private get mGuideHand(): GuideHand {
        if (!this.guideHand) {
            this.guideHand = new GuideHand
        }
        return this.guideHand
    }

    public static mCheckPart: {[key: number]: boolean} = {}

    public static CheckPart(type: number): boolean {
        return this.mCheckPart[type] ? true : false
    }

    // 结束引导，停留箭头
    public Finish(panel: BaseView, target: egret.DisplayObject) {
        if (!panel || !target) {
            return
        }
        this.m_GuideId = -1
        this.m_GuideStep = null
        this.m_GuideDelay = null
        this.Show(panel, target, 0)
    }

    /**
     * 开始显示引导
     */
    public Start(guideId: number) {
        let config = GameGlobal.Config.GuideStepConfig[guideId]
        if (!config) {
            return
        }
        this.m_GuideId = guideId
        this.m_GuideStep = null
        this.m_GuideDelay = null
        this.DoGuide(0)
    }

    private m_IsAdd = false

    /**
     * 引导结束触发事件
     * @returns true 继续执行
     *          false 中断引导，需要执行其它事件
     */
    private Trigger(data, step: number) {
        if (!data) {
            return true
        }
        if (data.type == 2) {
            if (!this.m_IsAdd) {
                this.m_IsAdd = true
                GameGlobal.MessageCenter.addListener(MessageDef.PLOT_PLAY_END, this.OnPlotEnd, this)
            }
            PlotPanel.OpenPlot(data.value, this.m_GuideId * 1000000 + step)
            return false
        }
        return true
    }

    private OnPlotEnd(flagId: number) {
        if (this.m_IsAdd) {
            this.m_IsAdd = false
            GameGlobal.MessageCenter.removeListener(MessageDef.PLOT_PLAY_END, this.OnPlotEnd, this)
        }
        let guide = Math.floor(flagId / 1000000)
        let step = flagId % 1000000
        if (guide == this.m_GuideId) {
            this.Guide(step + 1)
        }
    }

    /**
     * 引导前触发的事件
     */
    private PreTrigger(data, step: number) {
        if (!data) {
            return true
        }
        if (data.type == 1) {
            GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL_ALL)
            let text = GameGlobal.Config.GuideBaseConfig.text
            GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_COPY_NAME, text[MathUtils.limitInteger(0, text.length - 1)], true)
        } else {
            console.error("not imple PreTrigger type => " + data.type)
        }
        return true
    }

    private m_GuideDelay = null
    private m_GuideStep: number = null

    /**
     * 引导步骤
     */
    private Guide(step: number) {
        this.m_GuideStep = step
        this.m_GuideDelay = 3
    }

    private DoGuide(step: number) {
        let config = GameGlobal.Config.GuideStepConfig[this.m_GuideId]
        if (!config) {
            this.HideGuideHand()
            return
        }
        let data = config[step]
        if (!data) {
            this.HideGuideHand()
            return
        }
        if (!this.CheckCondition(data.preCon)) {
            console.log("条件不满足退出 => ", this.m_GuideId, step)
            this.HideGuideHand()
            return
        }
        if (!this.PreTrigger(data.preui, step)) {
            this.HideGuideHand()
            return
        }
        let datas = GuideConst.GetTarget(data.panel, data.pos) 
        if (datas) {
            let view = datas[0]
            let target = datas[1]
            this.Show(view, target, step)
        } else {
            this.HideGuideHand()
        }
    }

    private GetTopLayer(panel: egret.DisplayObject) {
        if (!panel) {
            return null
        }
        let parent = panel
        while (true) {
            if (parent["__TOP_LAYER__"]) {
                return parent
            }
            parent = parent.parent
            if (!parent) {
                return null
            }
        }
    }

    /**
     * 指向引导对象
     */
    private Show(panel: BaseView, target: egret.DisplayObject, step: number) {
        if (!panel || !target) {
            this.HideGuideHand()
            return
        }
        DisplayUtils.removeFromParent(this.mGuideHand)
        let topLayer = this.GetTopLayer(panel)
        if (topLayer) {
            topLayer.parent.addChildAt(this.mGuideHand, topLayer.parent.getChildIndex(topLayer) + 1) 
        }
        if (this.m_ShowState != 0 && this.mGuideHand.$visible) {
            this.mGuideHand.MoveToTarget(this.m_GuideId, step, panel, target)
        } else {
            this.mGuideHand.ShowTarget(this.m_GuideId, step, panel, target)
        }
        this.m_ShowState = 1
    }

    public Init() {
        egret.startTick(this.UpdateTime, this)
    }

    private UpdateTime(timeStamp: number) {
        if (this.m_GuideStep != null) {
            if (this.m_GuideDelay) {
                --this.m_GuideDelay
            } else {
                let step = this.m_GuideStep
                this.m_GuideStep = null
                this.DoGuide(step)
            }
        }

        let delta = timeStamp - this.m_LastTime;
		this.m_LastTime = timeStamp;
        if (this.guideHand && this.guideHand.parent && this.m_ShowState == 1) {
            this.guideHand.OnUpdate(delta)
        }
        if (this.m_ShowState >= 2) {
            --this.m_ShowState
            if (this.m_ShowState <= 2) {
                if (this.guideHand) {
                    this.guideHand.OnClose()
                    DisplayUtils.removeFromParent(this.guideHand)
                }
                this.m_ShowState = 0    
            }
        }
		return false
    }

    private CheckCondition(data) {
        if (!data) {
            return true
        }
        switch (data.type) {
            case 1:
                return GameGlobal.UserFb.CanPkBoss()
            default:
                console.error("not impl check condition => " + data)
                break
        }
        return true
    }

    private HideGuideHand(force: boolean = false) {
        if (force) {
            this.m_ShowState = 2
        } else {
            this.m_ShowState = 2 + 4 // 延时4帧结束动画
        }
    }

    // 目标被移除
    public OnTargetRemoved(targetId: number, stepId: number) {
        if (this.m_GuideId != targetId) {
            return
        }
        this.HideGuideHand()
    }

    public OnTargetTap(targetId: number, stepId: number) {
        if (this.m_GuideId != targetId) {
            return
        }
        let config = GameGlobal.Config.GuideStepConfig[targetId]
        if (!config) {
            this.HideGuideHand()
            return
        }
        let data = config[stepId]
        if (!this.Trigger(data.ui, stepId)) {
            this.HideGuideHand()
            return
        }
        if (!config[stepId + 1]) {
            // console.log("完成引导 => ", targetId, stepId)
            this.mGuideDoneCount[targetId] = (this.mGuideDoneCount[targetId] || 0) + 1
            this.HideGuideHand(true)
        } else {
            this.Guide(stepId + 1)
        }
    }
}