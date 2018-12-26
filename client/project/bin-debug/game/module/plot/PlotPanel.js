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
var PlotPanel = (function (_super) {
    __extends(PlotPanel, _super);
    function PlotPanel() {
        var _this = _super.call(this) || this;
        _this.m_CurMsg = "";
        _this.m_FlagId = 0;
        _this.skinName = "PlotSkin";
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this._OnClick, _this);
        return _this;
    }
    /**
     * @param plotId 剧情id
     * @param flagId 标记id，用于剧情结束的事件
     */
    PlotPanel.OpenPlot = function (plotId, flagId) {
        if (flagId === void 0) { flagId = 0; }
        if (!GameGlobal.Config.StoryDialogueConfig[plotId]) {
            return;
        }
        var view = ViewManager.ins().getView(PlotPanel);
        if (!view) {
            view = ViewManager.ins().open(PlotPanel);
        }
        view.SetData(plotId, flagId);
    };
    PlotPanel.prototype.GetComp = function (skinName) {
        var comp = new eui.Component;
        comp.skinName = skinName;
        comp.visible = false;
        this.addChild(comp);
        return comp;
    };
    PlotPanel.prototype.GetRightComp = function () {
        if (!this.m_RightComp) {
            this.m_RightComp = this.GetComp("PlotRightMsgSkin");
            this.m_RightComp.__out_x__ = StageUtils.WIDTH;
            this.m_RightComp.__in_x__ = StageUtils.WIDTH - 356;
            this.addChild(this.m_RightComp);
        }
        this.m_RightComp.visible = true;
        this.m_RightComp.y = 650;
        return this.m_RightComp;
    };
    PlotPanel.prototype.GetLeftComp = function () {
        if (!this.m_LeftComp) {
            this.m_LeftComp = this.GetComp("PlotLeftMsgSkin");
            this.m_LeftComp.__out_x__ = -356;
            this.m_LeftComp.__in_x__ = 0;
            this.addChild(this.m_LeftComp);
        }
        this.m_LeftComp.visible = true;
        this.m_LeftComp.y = 650;
        return this.m_LeftComp;
    };
    PlotPanel.prototype._OnClick = function () {
        if (!this.m_CurComp) {
            return;
        }
        if (this.m_CurComp.textLabel.text.length < this.m_CurMsg.length) {
            this.m_CurComp.textLabel.text = this.m_CurMsg;
            TimerManager.ins().remove(this.UpdateDesc, this);
            this.WaitMsg();
        }
        else {
            TimerManager.ins().remove(this.UpdateMsg, this);
            this.UpdateMsg();
        }
    };
    PlotPanel.prototype.SetData = function (plotId, flagId) {
        this.m_Index = 0;
        if (this.m_FlagId) {
            // 清理上一个剧情id
            GameGlobal.MessageCenter.dispatch(MessageDef.PLOT_PLAY_END, this.m_FlagId);
        }
        this.m_FlagId = flagId;
        this.m_PlotConfig = GameGlobal.Config.StoryDialogueConfig[plotId];
        if (!this.m_PlotConfig) {
            UserTips.ErrorTip("剧情ID：" + plotId + "不存在");
            this.CloseSelf();
            return;
        }
        this.UpdateMsg();
    };
    PlotPanel.prototype.UpdateMsg = function () {
        var data = this.m_PlotConfig[this.m_Index];
        if (!data) {
            this.CloseSelf();
            if (this.m_FlagId) {
                GameGlobal.MessageCenter.dispatch(MessageDef.PLOT_PLAY_END, this.m_FlagId);
            }
            return;
        }
        var isNewImg = true;
        var preData = this.m_PlotConfig[this.m_Index - 1];
        if (preData) {
            isNewImg = !(preData.pos == data.pos && preData.characterid == data.characterid);
            if (isNewImg && this.m_CurComp) {
                var img_1 = this.m_CurComp;
                egret.Tween.removeTweens(img_1);
                egret.Tween.get(img_1).to({ x: img_1.__out_x__ }, PlotPanel.IMG_SPEED).call(function () {
                    img_1.visible = false;
                });
            }
        }
        ++this.m_Index;
        if (isNewImg) {
            var img = void 0;
            if (data.pos == 0) {
                img = this.GetLeftComp();
            }
            else if (data.pos == 1) {
                img = this.GetRightComp();
            }
            this.m_CurComp = img;
            if (this.m_CurComp) {
                egret.Tween.removeTweens(this.m_CurComp);
                this.m_CurComp.x = this.m_CurComp.__out_x__;
                egret.Tween.get(this.m_CurComp).to({ x: this.m_CurComp.__in_x__ }, PlotPanel.IMG_SPEED);
            }
        }
        if (data.name) {
            this.m_CurComp.nameLabel.text = data.name;
        }
        else {
            this.m_CurComp.nameLabel.text = "";
        }
        if (data.icon) {
            this.m_CurComp.img.source = data.icon;
        }
        else {
            this.m_CurComp.img.source = "";
        }
        this.m_CurMsg = data.des;
        this.m_CurComp.textLabel.text = "";
        TimerManager.ins().doTimer(PlotPanel.LABEL_SPEED, data.des.length, this.UpdateDesc, this, this.WaitMsg, this);
    };
    PlotPanel.prototype.UpdateDesc = function () {
        this.m_CurComp.textLabel.text = this.m_CurMsg.substr(0, this.m_CurComp.textLabel.text.length + 1);
    };
    PlotPanel.prototype.WaitMsg = function () {
        TimerManager.ins().doTimer(2000, 1, this.UpdateMsg, this);
    };
    PlotPanel.LAYER_LEVEL = LayerManager.UI_Message;
    PlotPanel.LABEL_SPEED = 50;
    PlotPanel.IMG_SPEED = 200;
    return PlotPanel;
}(BaseEuiView));
__reflect(PlotPanel.prototype, "PlotPanel");
//# sourceMappingURL=PlotPanel.js.map