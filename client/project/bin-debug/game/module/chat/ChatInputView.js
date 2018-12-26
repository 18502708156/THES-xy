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
var ChatInputView = (function (_super) {
    __extends(ChatInputView, _super);
    function ChatInputView() {
        var _this = _super.call(this) || this;
        _this.skinName = "ChatInputSkin";
        _this.sendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnSend, _this);
        _this.biaoQingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnClick, _this);
        return _this;
    }
    ChatInputView.prototype.OnClick = function () {
        var _this = this;
        if (this.faceGroup.numChildren > 0) {
            this.faceGroup.removeChildren();
            return;
        }
        var comp = new ChatFaceView(function (id) {
            _this.input.text += "[" + id + "]";
        });
        // let pos = egret.$TempPoint
        // this.biaoQingBtn.parent.localToGlobal(this.biaoQingBtn.x, this.biaoQingBtn.y, pos)
        // this.globalToLocal(pos.x, pos.y, pos)
        // let x = pos.x + (this.biaoQingBtn.width >> 1)
        // let y = pos.y + (this.biaoQingBtn.height >> 1)
        comp.SetPos(0, 0);
        this.faceGroup.addChild(comp);
    };
    ChatInputView.prototype.SetCallback = function (callback) {
        this.m_Callback = callback;
    };
    ChatInputView.prototype.SetText = function (val) {
        this.input.text = val;
    };
    ChatInputView.prototype.OnSend = function () {
        if (this.m_Callback) {
            this.m_Callback(this.input.text);
        }
        // Chat.Send(this.bar.selectedIndex, this.input.text, () => {
        // 	this.input.text = ""
        // })
    };
    return ChatInputView;
}(eui.Component));
__reflect(ChatInputView.prototype, "ChatInputView");
//# sourceMappingURL=ChatInputView.js.map