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
var RideShowPanel = (function (_super) {
    __extends(RideShowPanel, _super);
    function RideShowPanel() {
        return _super.call(this) || this;
    }
    RideShowPanel.prototype.SetBodyId = function (value) {
        var ridePath = AppearanceConfig.GetUIPath(value);
        this.mScale = AppearanceConfig.GetScale(value);
        if (this.m_Ride == ridePath) {
            return;
        }
        this.m_Ride = ridePath;
        if (ridePath.indexOf("horse") != -1) {
            this.m_RideHead = AppearanceConfig.GetUIPath(value, null, null, true);
        }
        else {
            this.m_RideHead = null;
        }
        this._Update();
    };
    RideShowPanel.prototype.SetBody = function (value) {
        this.mScale = 1;
        if (this.m_Ride == value) {
            return;
        }
        this.m_Ride = value;
        this._Update();
    };
    RideShowPanel.prototype._SetSource = function (img, newPath) {
        if (!img) {
            return;
        }
        if (StringUtils.IsNullOrEmpty(newPath)) {
            img.LoadByUrl(null);
        }
        else {
            img.LoadByUrl(newPath, -1, true);
        }
    };
    RideShowPanel.prototype._NewMovieObject = function () {
        var obj = new MovieObject;
        var scale = 1;
        obj.scaleX = obj.scaleY = scale;
        obj.x = (this.width * scale) >> 1;
        obj.y = (this.height * scale) >> 1;
        this.addChild(obj);
        return obj;
    };
    RideShowPanel.prototype._Update = function () {
        if (!this.$stage) {
            return;
        }
        this.rideMv = this._InitMv(this.m_Ride, this.rideMv);
        if (this.rideMv) {
            this.rideMv.scaleX = this.rideMv.scaleY = this.mScale;
        }
        if (this.m_RideHead) {
            this.rideHeadMv = this._InitMv(this.m_RideHead, this.rideHeadMv);
        }
        if (this.rideHeadMv)
            this.rideHeadMv.visible = this.m_RideHead ? true : false;
        if (this.m_Ride) {
            if (this.m_RideHead) {
                this.rideMv.once(egret.Event.CHANGE, this._LoadBodyEnd, this);
            }
            this._SetSource(this.rideMv, this.m_Ride);
        }
    };
    RideShowPanel.prototype._LoadBodyEnd = function () {
        if (this.m_RideHead) {
            this.rideHeadMv.once(egret.Event.CHANGE, this.SyncFrame, this);
            this.rideHeadMv.LoadByUrl(this.m_RideHead, -1, false);
        }
    };
    RideShowPanel.prototype.SyncFrame = function (e) {
        var mc = e.currentTarget;
        if (this.rideMv && !StringUtils.IsNullOrEmpty(this.m_RideHead)) {
            mc.gotoAndPlay(this.rideMv.currentFrame, -1);
        }
        else {
            mc.gotoAndPlay(1, -1);
        }
    };
    RideShowPanel.prototype._InitMv = function (resName, mvObj) {
        if (!StringUtils.IsNullOrEmpty(resName)) {
            if (!mvObj) {
                mvObj = this._NewMovieObject();
            }
        }
        else {
            if (mvObj) {
                mvObj.LoadByUrl(null);
            }
        }
        return mvObj;
    };
    RideShowPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._Update();
    };
    return RideShowPanel;
}(eui.Component));
__reflect(RideShowPanel.prototype, "RideShowPanel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=RideShowPanel.js.map