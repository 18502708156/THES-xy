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
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 进入Scene调用
     */
    MainScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        ViewManager.ins().open(GameSceneView);
        ViewManager.ins().open(MainTopPanel);
        ViewManager.ins().open(MainTop2Panel);
        ViewManager.ins().open(MainBottomPanel);
        ViewManager.ins().open(TipsView);
        // GameGlobal.SoundManager.PlayBg("guaji_mp3");
    };
    return MainScene;
}(BaseScene));
__reflect(MainScene.prototype, "MainScene");
//# sourceMappingURL=MainScene.js.map