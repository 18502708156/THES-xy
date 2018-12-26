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
var NoticeView = (function (_super) {
    __extends(NoticeView, _super);
    function NoticeView() {
        var _this = _super.call(this) || this;
        _this.m_LabelList = [];
        _this.m_TextList = [];
        _this.m_IsFirst = true;
        _this.m_LabelList2 = [];
        _this.m_TextList2 = [];
        return _this;
    }
    NoticeView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.touchChildren = false;
        this.touchEnabled = false;
        this.frame = new eui.Image;
        this.frame.source = "ui_cm_black";
        this.frame.alpha = 0.5;
        this.frame.percentWidth = 100;
        this.frame.height = 40;
        var scroll = this.scroll = new eui.Scroller;
        scroll.touchEnabled = false;
        scroll.touchChildren = false;
        scroll.x = 0;
        scroll.percentWidth = 100;
        scroll.height = this.frame.height;
        var group = this.scrollGroup = new eui.Group;
        group.percentWidth = 100;
        group.percentHeight = 100;
        scroll.addChild(group);
        scroll.viewport = group;
        var staticFrame = new eui.Image;
        staticFrame.source = this.frame.source;
        staticFrame.percentWidth = 100;
        staticFrame.percentHeight = 100;
        staticFrame.alpha = 0.5;
        this.scrollGroup.addChild(staticFrame);
        this.updatePosY();
    };
    NoticeView.prototype.updatePosY = function () {
        this.frame.y = 160;
        this.scroll.y = this.frame.y + this.frame.height + 10;
    };
    /**
     * 显示公告
     */
    NoticeView.prototype.ShowNotice = function (str) {
        this.m_TextList.push(str);
        this.StartTween();
    };
    NoticeView.prototype.StartTween = function () {
        if (this.frame.parent) {
            return;
        }
        this.addChild(this.frame);
        if (this.m_IsFirst) {
            this.m_IsFirst = false;
            egret.setTimeout(this.DoTween, this, 20);
        }
        else {
            this.DoTween();
        }
    };
    NoticeView.prototype.DoTween = function () {
        var text = this.m_TextList.shift();
        if (text == null) {
            DisplayUtils.removeFromParent(this.frame);
            return;
        }
        var lab = this.m_LabelList.pop();
        if (!lab) {
            lab = new eui.Label;
            lab.size = 24;
            lab.textColor = 0xff8534;
        }
        this.addChild(lab);
        lab.x = this.frame.width;
        lab.y = this.frame.y + 8;
        lab.textFlow = TextFlowMaker.generateTextFlow(text);
        var tweenX = -lab.width;
        var tween = egret.Tween.get(lab);
        tween.to({ "x": tweenX }, lab.width * 25).call(this.TweenEnd, this, [lab]);
    };
    NoticeView.prototype.TweenEnd = function (lab) {
        DisplayUtils.removeFromParent(lab);
        this.m_LabelList.push(lab);
        this.DoTween();
    };
    // 静止公告
    NoticeView.prototype.ShowStaticNotice = function (str) {
        this.m_TextList2.push(str);
        this.StartTween2();
    };
    NoticeView.prototype.StartTween2 = function () {
        if (this.scroll.parent) {
            return;
        }
        this.addChild(this.scroll);
        this.DoTween2();
    };
    NoticeView.prototype.DoTween2 = function () {
        var text = this.m_TextList2.shift();
        if (text == null) {
            DisplayUtils.removeFromParent(this.scroll);
            return;
        }
        var lab = this.m_LabelList2.pop();
        if (!lab) {
            lab = new eui.Label;
            lab.size = 24;
            lab.textAlign = "center";
            lab.textColor = 0xff8534;
        }
        this.scrollGroup.addChild(lab);
        lab.y = this.scroll.height;
        lab.horizontalCenter = 0;
        lab.textFlow = TextFlowMaker.generateTextFlow(text);
        var labWidth = lab.width;
        var sWidth = GameGlobal.StageUtils.GetWidth() - 30;
        var endCenter = null;
        if (labWidth > sWidth) {
            var val = ((labWidth - sWidth) >> 1);
            lab.horizontalCenter = val;
            endCenter = val;
        }
        var tween = egret.Tween.get(lab);
        tween.to({ y: 8 }, 250, egret.Ease.sineOut);
        if (endCenter) {
            tween.wait(1500);
            tween.to({
                horizontalCenter: -endCenter
            }, endCenter * 25);
            tween.wait(2500);
        }
        else {
            tween.wait(5000);
        }
        tween.to({ y: -this.scroll.height }, 180);
        tween.call(this.TweenEnd2, this, [lab]);
    };
    NoticeView.prototype.TweenEnd2 = function (lab) {
        DisplayUtils.removeFromParent(lab);
        this.m_LabelList2.push(lab);
        this.DoTween2();
    };
    NoticeView.LAYER_LEVEL = LayerManager.UI_Tips;
    return NoticeView;
}(BaseEuiView));
__reflect(NoticeView.prototype, "NoticeView");
//# sourceMappingURL=NoticeView.js.map