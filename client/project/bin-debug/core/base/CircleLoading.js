var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CircleLoading = (function () {
    function CircleLoading() {
        this.m_IsShow = false;
        this.speed = 10 / (1000 / 60);
        this.init();
    }
    CircleLoading.prototype.init = function () {
        var group = new eui.Group;
        this.content = group;
        group.percentWidth = 100;
        group.percentHeight = 100;
        group.touchEnabled = true;
        var bg = new eui.Image;
        // bg.source = "ui_cm_bg_02"
        bg.percentWidth = 100;
        bg.percentHeight = 100;
        group.addChild(bg);
        this.uiImageContainer = new eui.Group();
        this.uiImageContainer.horizontalCenter = 0;
        this.uiImageContainer.verticalCenter = 0;
        group.addChild(this.uiImageContainer);
        this.label = new eui.Label;
        group.addChild(this.label);
        this.label.size = 24;
        this.label.stroke = 2;
        this.label.strokeColor = Color.Black;
        this.label.text = "断线重连中";
        this.label.horizontalCenter = 0;
        this.label.verticalCenter = 90;
        // RES.getResByUrl(this.mResName, function (texture) {
        var img = new eui.Image;
        img.source = "load_Reel";
        img.x = -img.width * 0.5;
        img.y = -img.height * 0.5;
        this.uiImageContainer.addChild(img);
        // }, this, RES.ResourceItem.TYPE_IMAGE);
    };
    CircleLoading.prototype.enterFrame = function (time) {
        this.uiImageContainer.rotation += this.speed * time;
    };
    ;
    CircleLoading.prototype._Show = function () {
        if (this.label) {
            this.label.visible = true;
        }
        this.m_IsShow = true;
        GameGlobal.StageUtils.GetUIStage().addChild(this.content);
        TimerManager.ins().doFrame(1, 0, this.enterFrame, this);
    };
    CircleLoading.prototype._Hide = function () {
        this.m_IsShow = false;
        if (this.label) {
            this.label.visible = false;
        }
        if (this.content && this.content.parent) {
            GameGlobal.StageUtils.GetUIStage().removeChild(this.content);
            this.uiImageContainer.rotation = 0;
        }
        TimerManager.ins().remove(this.enterFrame, this);
    };
    return CircleLoading;
}());
__reflect(CircleLoading.prototype, "CircleLoading");
//# sourceMappingURL=CircleLoading.js.map