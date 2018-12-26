class NoticeView extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Tips

    // list
    private frame: eui.Image
    private scroll: eui.Scroller
    private scrollGroup: eui.Group

    private m_LabelList: eui.Label[] = []
    private m_TextList: string[] = []
    private m_IsFirst = true

    private m_LabelList2: eui.Label[] = []
    private m_TextList2: string[] = []

    public constructor() {
        super();
    }
    
    initUI() {
        super.initUI();

        this.touchChildren = false;
        this.touchEnabled = false;

        this.frame = new eui.Image;
        this.frame.source = "ui_cm_black";
        this.frame.alpha = 0.5
        this.frame.percentWidth = 100
        this.frame.height = 40;

        let scroll = this.scroll = new eui.Scroller
        scroll.touchEnabled = false
        scroll.touchChildren = false
        scroll.x = 0;
        scroll.percentWidth = 100
        scroll.height = this.frame.height;

        let group = this.scrollGroup = new eui.Group
        group.percentWidth = 100
        group.percentHeight = 100
        scroll.addChild(group)
        scroll.viewport = group

        let staticFrame = new eui.Image;
        staticFrame.source = this.frame.source;
        staticFrame.percentWidth = 100
        staticFrame.percentHeight = 100
        staticFrame.alpha = 0.5
        this.scrollGroup.addChild(staticFrame);

        this.updatePosY();
    }

    private updatePosY(): void {
        this.frame.y = 160;
        this.scroll.y = this.frame.y + this.frame.height + 10;
    }

    /**
     * 显示公告
     */
    public ShowNotice(str: string) {
        this.m_TextList.push(str)
        this.StartTween()
    }

    private StartTween() {
        if (this.frame.parent) {
            return
        }
        this.addChild(this.frame)
        if (this.m_IsFirst) {
            this.m_IsFirst = false
            egret.setTimeout(this.DoTween, this, 20)
        } else {
            this.DoTween()
        }
    }

    private DoTween() {
        let text = this.m_TextList.shift()
        if (text == null) {
            DisplayUtils.removeFromParent(this.frame)
            return
        }
        let lab = this.m_LabelList.pop()
        if (!lab) {
            lab = new eui.Label;
            lab.size = 24;
            lab.textColor = 0xff8534;
        }
        this.addChild(lab);
        lab.x = this.frame.width;
        lab.y = this.frame.y + 8;
        lab.textFlow = TextFlowMaker.generateTextFlow(text);
        let tweenX = -lab.width
        let tween = egret.Tween.get(lab)

        tween.to({ "x": tweenX }, lab.width * 25).call(this.TweenEnd, this, [lab])
    }

    private TweenEnd(lab: eui.Label): void {
        DisplayUtils.removeFromParent(lab)
        this.m_LabelList.push(lab)
        this.DoTween()
    }

    // 静止公告
    public ShowStaticNotice(str: string) {
        this.m_TextList2.push(str)
        this.StartTween2()
    }

    private StartTween2() {
        if (this.scroll.parent) {
            return
        }
        this.addChild(this.scroll)
        this.DoTween2()
    }

    private DoTween2() {
        let text = this.m_TextList2.shift()
        if (text == null) {
            DisplayUtils.removeFromParent(this.scroll)
            return
        }
        let lab = this.m_LabelList2.pop()
        if (!lab) {
            lab = new eui.Label;
            lab.size = 24
            lab.textAlign = "center"
            lab.textColor = 0xff8534;
        }
        this.scrollGroup.addChild(lab);
        lab.y = this.scroll.height
        lab.horizontalCenter = 0
        lab.textFlow = TextFlowMaker.generateTextFlow(text);

        let labWidth = lab.width
        let sWidth = GameGlobal.StageUtils.GetWidth() - 30

        let endCenter = null
        if (labWidth > sWidth) {
            let val = ((labWidth - sWidth) >> 1)
            lab.horizontalCenter = val
            endCenter = val
        }

        let tween = egret.Tween.get(lab)
        tween.to({ y: 8 }, 250, egret.Ease.sineOut)
        if (endCenter) {
            tween.wait(1500)
            tween.to({
                    horizontalCenter: -endCenter
            }, endCenter * 25)
            tween.wait(2500)
        } else {
            tween.wait(5000)
        }
        tween.to({ y: -this.scroll.height }, 180)
        tween.call(this.TweenEnd2, this, [lab])
    }

    private TweenEnd2(lab: eui.Label): void {
        DisplayUtils.removeFromParent(lab)
        this.m_LabelList2.push(lab)
        this.DoTween2()
    }
}