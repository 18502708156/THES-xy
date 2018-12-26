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
/**
 * 红包介面
 */
var BriberyPanel = (function (_super) {
    __extends(BriberyPanel, _super);
    function BriberyPanel() {
        var _this = _super.call(this) || this;
        _this.briberyDic = {};
        _this.briberyId = 0;
        _this.skinName = "briberySkin";
        //this._AddClick(this.com,this.CloseSelf);
        _this._AddClick(_this.closeImg, _this.CloseSelf);
        _this._AddClick(_this.okBtn, _this._OnClick);
        return _this;
    }
    BriberyPanel.prototype.OnOpen = function (briberyDic, briberyKey, item) {
        this.observe(MessageDef.FULI_GET_RECEIVEBRIBERY, this.OpenXXX);
        this.briberyDic = briberyDic;
        this.briberyId = briberyKey;
        this.item = item;
        this.lab.textFlow =
            (new egret.HtmlTextParser).parser("<a color=0xFFD700>【"
                + GameGlobal.FuliModel.FuliData.playerName +
                "】</a>给全服发了一波红包,快来拼手气!");
    };
    BriberyPanel.prototype.OnClose = function () {
    };
    BriberyPanel.prototype.OpenXXX = function (rsp) {
        if (rsp.ret) {
            ViewManager.ins().open(BriberyOpenPanel, rsp);
        }
        else {
            UserTips.ins().showTips("红包已被抢光");
            this.item.visible = false;
            if (this.item.parent != null)
                this.item.parent.removeChild(this.item);
        }
        ViewManager.ins().close(BriberyPanel);
    };
    BriberyPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.okBtn:
                // ViewManager.ins().close(BriberyPanel);
                if (this.briberyDic[this.briberyId] - GameServer.serverTime > 2) {
                    GameGlobal.FuliModel.ReceiveBribery(this.briberyId);
                    // ViewManager.ins().open(BriberyOpenPanel);
                    this.item.visible = false;
                    if (this.item.parent != null)
                        this.item.parent.removeChild(this.item);
                }
                else
                    UserTips.ins().showTips("红包已被抢光");
                this.item.visible = false;
                if (this.item.parent != null)
                    this.item.parent.removeChild(this.item);
                break;
        }
    };
    BriberyPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return BriberyPanel;
}(BaseEuiView));
__reflect(BriberyPanel.prototype, "BriberyPanel");
//# sourceMappingURL=BriberyPanel.js.map