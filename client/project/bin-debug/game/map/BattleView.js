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
var BattleView = (function (_super) {
    __extends(BattleView, _super);
    function BattleView() {
        var _this = _super.call(this) || this;
        _this.m_IsUpdate = false;
        _this.width = StageUtils.WIDTH;
        _this._bgMapImg = new eui.Image;
        _this._bgMapImg.horizontalCenter = 0;
        _this._bgMapImg.x = -120;
        _this.addChild(_this._bgMapImg);
        _this._blackImg1 = new eui.Image;
        _this._blackImg1.source = "ui_cm_black";
        _this.addChild(_this._blackImg1);
        _this._Img = new eui.Image;
        _this._Img.source = ResDataPath.ROOT + "image/battlemap/backMark.png";
        _this._Img.horizontalCenter = 0;
        _this.addChild(_this._Img);
        _this._Img.addEventListener(egret.Event.COMPLETE, _this.onResize, _this);
        _this._entityLayer = new egret.DisplayObjectContainer;
        _this._entityLayer.width = 529;
        _this._entityLayer.height = 548;
        _this.addChild(_this._entityLayer);
        _this.bloodLayer = new BloodView;
        _this.addChild(_this.bloodLayer);
        _this.onResize();
        return _this;
    }
    BattleView.prototype.onResize = function () {
        var stageWidth = egret.MainContext.instance.stage.stageWidth;
        var stageHeight = egret.MainContext.instance.stage.stageHeight;
        this._Img.x = (stageWidth - this._Img.width) >> 1;
        this._Img.y = ((stageHeight - this._Img.height) >> 1) - 60;
        this._bgMapImg.height = stageHeight;
        this._bgMapImg.height = stageHeight / StageUtils.HEIGHT * 960;
        this._bgMapImg.x = (stageWidth - this._bgMapImg.width) >> 1;
        this._bgMapImg.y = 0;
        this._blackImg1.x = -100;
        this._blackImg1.y = -100;
        this._blackImg1.width = stageWidth + 200;
        this._blackImg1.height = stageHeight + 200;
        this._entityLayer.x = (stageWidth - this._entityLayer.width) >> 1;
        this._entityLayer.y = ((stageHeight - this._entityLayer.height) >> 1) - 40;
        this.bloodLayer.x = this._entityLayer.x;
        this.bloodLayer.y = this._entityLayer.y;
    };
    // public Show(resName: string): void {
    // }
    BattleView.prototype.showMapBg = function (resName) {
        this._bgMapImg.visible = true;
        this._blackImg1.alpha = 0.7;
        this._Img.alpha = 1;
        this.alpha = 1;
        GameMap.mBattleLayer.addChild(this);
        var imgPath = resName;
        if (this._bgMapImg.source != imgPath) {
            ResMgr.Ref(imgPath);
        }
        this._bgMapImg.source = imgPath;
    };
    BattleView.prototype.Hide = function () {
        var imgPath = this._bgMapImg.source;
        if (imgPath) {
            ResMgr.Unref(imgPath);
            this._bgMapImg.source = "";
        }
        this._bgMapImg.visible = false;
        DisplayUtils.removeFromParent(this);
    };
    BattleView.prototype.ShowDefault = function () {
        this._bgMapImg.visible = false;
        this._blackImg1.alpha = 0;
        this._Img.alpha = 0;
        this.alpha = 1;
        GameMap.mBattleLayer.addChild(this);
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this._blackImg1);
        egret.Tween.removeTweens(this._Img);
        egret.Tween.get(this._blackImg1).to({
            alpha: 0.7
        }, 300);
        egret.Tween.get(this._Img).to({
            alpha: 1
        }, 300);
    };
    BattleView.prototype.StartHide = function (func) {
        var _this = this;
        egret.Tween.get(this).to({
            alpha: 0
        }, 500).call(function () {
            _this.Hide();
            if (func)
                (func());
        });
    };
    BattleView.prototype.AddEntity = function (entity) {
        this._entityLayer.addChild(entity);
        this.UpdateSort();
    };
    // 获取对应的全局坐标
    BattleView.prototype.GetEntityGlobal = function (x, y, pos) {
        this._entityLayer.localToGlobal(x, y, pos);
    };
    BattleView.prototype.Clear = function () {
        this.bloodLayer.Clear();
    };
    BattleView.prototype.UpdateSort = function (immediately) {
        if (immediately === void 0) { immediately = false; }
        if (immediately) {
            TimerManager.ins().remove(this.UpdateIndex, this);
            this.UpdateIndex();
        }
        else {
            if (!this.m_IsUpdate) {
                this.m_IsUpdate = true;
                if (this._entityLayer.$children.length) {
                    TimerManager.ins().doTimer(500, 1, this.UpdateIndex, this);
                }
            }
        }
    };
    BattleView.prototype.UpdateIndex = function () {
        this.m_IsUpdate = false;
        this._entityLayer.$children.sort(MapView.sortF);
    };
    return BattleView;
}(egret.DisplayObjectContainer));
__reflect(BattleView.prototype, "BattleView");
//# sourceMappingURL=BattleView.js.map