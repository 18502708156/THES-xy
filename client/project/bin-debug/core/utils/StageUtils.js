var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StageUtils = (function () {
    function StageUtils() {
        if (StageUtils._uiStage == null) {
            StageUtils._uiStage = new eui.UILayer();
            StageUtils._uiStage.touchEnabled = false;
            StageUtils._uiStage.percentHeight = 100;
            StageUtils._uiStage.percentWidth = 100;
            // StageUtils._uiStage.scaleX = StageUtils._uiStage.scaleY = 2.25
            this.GetStage().addChildAt(StageUtils._uiStage, 0);
        }
    }
    StageUtils.prototype.GetHeight = function () {
        return this.GetStage().stageHeight;
    };
    /**
     * 获取游戏宽度
     */
    StageUtils.prototype.GetWidth = function () {
        return this.GetStage().stageWidth;
    };
    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    StageUtils.prototype.setTouchChildren = function (value) {
        this.GetStage().touchChildren = value;
    };
    /**
     * 设置同时可触发几个点击事件，默认为2
     */
    StageUtils.prototype.SetMaxTouches = function (value) {
        this.GetStage().maxTouches = value;
    };
    /**
     * 设置帧频
     */
    StageUtils.prototype.SetFrameRate = function (value) {
        this.GetStage().frameRate = value;
    };
    StageUtils.prototype.GetStage = function () {
        return egret.MainContext.instance.stage;
    };
    /**
     * 获取唯一UIStage
     */
    StageUtils.prototype.GetUIStage = function () {
        return StageUtils._uiStage;
    };
    StageUtils.WIDTH = 720;
    StageUtils.HEIGHT = 1280;
    return StageUtils;
}());
__reflect(StageUtils.prototype, "StageUtils");
//# sourceMappingURL=StageUtils.js.map