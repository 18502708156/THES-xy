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
var MonShowPanel = (function (_super) {
    __extends(MonShowPanel, _super);
    function MonShowPanel() {
        return _super.call(this) || this;
    }
    MonShowPanel.prototype.SetBody = function (value) {
        this.m_Body = value;
        this._Update();
    };
    MonShowPanel.prototype._SetSource = function (img, newPath) {
        if (!img) {
            return;
        }
        if (StringUtils.IsNullOrEmpty(newPath)) {
            img.LoadByUrl(null);
        }
        else {
            img.LoadByUrl("resource/assets/movie/mon_show/" + newPath, -1, true);
        }
    };
    MonShowPanel.prototype._NewMovieObject = function () {
        var obj = new MovieObject;
        obj.x = this.width >> 1;
        obj.y = this.height >> 1;
        this.addChild(obj);
        return obj;
    };
    MonShowPanel.prototype._Update = function () {
        if (!this.$stage) {
            return;
        }
        this.bodyMv = this._InitMv(this.m_Body, this.bodyMv);
        this._SetSource(this.bodyMv, this.m_Body);
    };
    MonShowPanel.prototype._InitMv = function (resName, mvObj) {
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
    MonShowPanel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    MonShowPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._Update();
    };
    return MonShowPanel;
}(eui.Component));
__reflect(MonShowPanel.prototype, "MonShowPanel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=MonShowPanel.js.map