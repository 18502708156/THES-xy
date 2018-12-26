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
var ChatTipsWin = (function (_super) {
    __extends(ChatTipsWin, _super);
    function ChatTipsWin() {
        var _this = _super.call(this) || this;
        _this.time = 0;
        return _this;
    }
    ChatTipsWin.prototype.initUI = function () {
        this.skinName = "ChatTipsWinSkin";
    };
    ChatTipsWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.sureBtn, this.onTouch);
        this.AddClick(this.cancelBtn, this.onTouch);
        this.AddClick(this.checkbox, this.onTouch);
        this.time = param[0],
            this.callback = param[1],
            this.update();
    };
    ChatTipsWin.prototype.onTouch = function (t) {
        var e = GlobalConfig.ins().ChatConstConfig;
        switch (t.currentTarget) {
            case this.sureBtn:
                GameLogic.ins().actorModel.yb < e.cost ? UserTips.ins().showTips("|C:0xff0000&T:元宝不足|") : this.callback && this.callback();
                ViewManager.ins().close(this);
                break;
            case this.cancelBtn:
                GameGlobal.Chat.isNoShowTipsPanel = !1;
                ViewManager.ins().close(this);
                break;
            case this.checkbox:
                GameGlobal.Chat.isNoShowTipsPanel = this.checkbox.selected;
        }
    };
    ChatTipsWin.prototype.update = function () {
        this.time > 0 && (TimerManager.ins().isExists(this.updateCD, this) || TimerManager.ins().doTimer(1e3, this.time, this.updateCD, this), this.show());
    };
    ChatTipsWin.prototype.show = function () {
        var t = GlobalConfig.ins().ChatConstConfig;
        this.descTF.textFlow = TextFlowMaker.generateTextFlow1("世界频道每次发言需间隔" + t.worldChatCd + "秒，" + this.time + "秒后可以免费发言\n花费|C:0xEEEE00&T:" + t.cost + "元宝|即可立即发言");
    };
    ChatTipsWin.prototype.updateCD = function () {
        this.time--;
        this.time <= 0 && (TimerManager.ins().remove(this.updateCD, this), ViewManager.ins().close(this));
        this.show();
    };
    ChatTipsWin.prototype.OnClose = function () {
        TimerManager.ins().remove(this.updateCD, this);
    };
    return ChatTipsWin;
}(BaseEuiView));
__reflect(ChatTipsWin.prototype, "ChatTipsWin");
ChatTipsWin.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=ChatTipsWin.js.map