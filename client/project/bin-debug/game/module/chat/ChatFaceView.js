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
var ChatFaceView = (function (_super) {
    __extends(ChatFaceView, _super);
    function ChatFaceView(callback) {
        var _this = _super.call(this) || this;
        _this.skinName = "ChatFaceSkin";
        _this.m_Callback = callback;
        for (var i = 0; i < _this.faceGroup.numChildren; i++) {
            var index = i + 1;
            var img = _this.faceGroup.getChildAt(i);
            img.source = "ui_fc" + DateUtils.formatTimeNum(index);
        }
        _this.touchEnabled = true;
        _this.touchChildren = true;
        _this.bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this._OnCloseClick, _this);
        _this.faceGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, _this._OnClick, _this);
        return _this;
    }
    ChatFaceView.prototype._OnCloseClick = function (e) {
        DisplayUtils.removeFromParent(this);
    };
    ChatFaceView.prototype._OnClick = function (e) {
        var index = this.faceGroup.$children.indexOf(e.target);
        if (this.m_Callback) {
            this.m_Callback(index + 1);
            this.m_Callback = null;
        }
        DisplayUtils.removeFromParent(this);
    };
    ChatFaceView.prototype.SetPos = function (x, y) {
        this.posGroup.x = x;
        this.posGroup.y = y;
    };
    ChatFaceView.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        if (this.m_Callback) {
            this.m_Callback = null;
        }
    };
    return ChatFaceView;
}(eui.Component));
__reflect(ChatFaceView.prototype, "ChatFaceView");
//# sourceMappingURL=ChatFaceView.js.map