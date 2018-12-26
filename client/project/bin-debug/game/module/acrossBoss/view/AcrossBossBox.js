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
var AcrossBossBox = (function (_super) {
    __extends(AcrossBossBox, _super);
    function AcrossBossBox(box, clotime) {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mIds = {};
        _this.skinName = "AcrossBossBoxSkin";
        _this.mBox = box;
        _this.mClotieTime = clotime;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this._OnClick, _this);
        _this.dataGroup.x = -1 * (_this.dataGroup.width >> 1);
        _this.dataGroup.y = -1 * (_this.dataGroup.height >> 1);
        _this.barGroup.visible = false;
        return _this;
    }
    AcrossBossBox.prototype.GetBar = function () {
        var bar = new eui.ProgressBar;
        bar.skinName = "bar0Skin";
        var clotie = this.mClotieTime;
        bar.maximum = clotie;
        bar.value = clotie;
        bar.slideDuration = clotie * 1000;
        bar.width = 148;
        bar.height = 20;
        bar.labelFunction = function (cur, max) {
            return cur + "秒";
        };
        return bar;
    };
    AcrossBossBox.prototype.ResetBarValue = function (bar, value) {
        if (value == null) {
            value = GameGlobal.Config.KfBossBaseConfig.coltime;
        }
        value = Math.max(value - GameServer.serverTime, 0);
        bar.slideDuration = 0;
        bar.value = value;
        bar.slideDuration = value * 1000;
    };
    AcrossBossBox.prototype.OnAdded = function (notPlay) {
        if (!notPlay) {
            this.img.scaleX = this.img.scaleY = 0;
            var tween = egret.Tween.get(this.img);
            tween.to({
                scaleX: 1,
                scaleY: 1,
                y: -100
            }, 200, egret.Ease.backOut)
                .to({
                y: 0
            }, 100);
        }
        this.x = (this.mBox.x);
        this.y = (this.mBox.y);
        GameMap.GetMap().mMapEntityView.AddDrop(this);
    };
    AcrossBossBox.prototype.DoRemoved = function () {
        DisplayUtils.removeFromParent(this);
    };
    AcrossBossBox.prototype._OnClick = function () {
        GameGlobal.RaidMgr.mMapRaid.MoveOrder(this.mBox.id, this.x, this.y, 100);
    };
    AcrossBossBox.prototype.ShowBar = function (id, time) {
        var bar = this.mIds[id];
        if (!time) {
            if (bar) {
                DisplayUtils.removeFromParent(bar);
                delete this.mIds[id];
            }
        }
        else {
            if (!bar) {
                bar = this.GetBar();
                this.bar.addChild(bar);
                this.mIds[id] = bar;
            }
            this.ResetBarValue(bar, time);
            bar.value = 0;
        }
        this.barGroup.visible = this.bar.numChildren > 0;
    };
    AcrossBossBox.prototype.ShowBars = function (datas) {
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            this.ShowBar(data.playerid, data.time);
        }
    };
    AcrossBossBox.prototype.RemoveBar = function () {
        this.mIds = {};
        this.bar.removeChildren();
        this.barGroup.visible = false;
    };
    return AcrossBossBox;
}(eui.Component));
__reflect(AcrossBossBox.prototype, "AcrossBossBox");
//# sourceMappingURL=AcrossBossBox.js.map