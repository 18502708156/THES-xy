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
var MailDetailedWin = (function (_super) {
    __extends(MailDetailedWin, _super);
    function MailDetailedWin() {
        return _super.call(this) || this;
    }
    MailDetailedWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "MailContentSkin";
        this.itemList.itemRenderer = ItemBase;
    };
    MailDetailedWin.prototype.OnOpen = function () {
        for (var e = [], t = 0; t < arguments.length; t++)
            e[t] = arguments[t];
        this.receiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.observe(MessageDef.MAIL_GET_ITEM, this.setMailData);
        this.observe(MessageDef.MAIL_DATA_CHANGE, this.setMailData);
        this.setMailData();
        this.commonDialog.OnAdded(this);
    };
    MailDetailedWin.prototype.OnClose = function () {
        for (var e = [], t = 0; t < arguments.length; t++)
            e[t] = arguments[t];
        this.commonDialog.OnRemoved();
        this.receiveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_GET_ITEM, this.setMailData, this);
        GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_DATA_CHANGE, this.setMailData, this);
    };
    MailDetailedWin.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.receiveBtn:
                var t = [];
                t.push(MailModel.ins().currentMailHandle), MailModel.ins().sendGetItem(t);
        }
    };
    MailDetailedWin.prototype.otherClose = function (e) {
        var t = this.background;
        e.localX >= t.x && e.localX <= t.x + t.width && e.localY >= t.y && e.localY <= t.y + t.height || ViewManager.ins().close(MailDetailedWin);
    };
    MailDetailedWin.prototype.setMailData = function () {
        var e = MailModel.ins().getCurrentMail();
        this.textLabel.text = e.text, this.setReceiveBtn(e.receive, e.item.length > 0), this.itemList.dataProvider = new eui.ArrayCollection(e.item);
        //判断是否将按钮变色
        if (e.receive === 1) {
            this.receiveBtn.filters = Color.GetFilter(); //变灰
        }
        //判断是否需要显示附件内容
        if (e.item.length > 0) {
            this.pAddGronp.visible = true;
        }
        else {
            this.pAddGronp.visible = false;
        }
    };
    MailDetailedWin.prototype.setReceiveBtn = function (e, t) {
        void 0 === t && (t = !1);
        var i = "";
        this.receiveBtn.visible = e >= 0, i = e ? "已领取" : "领取", this.receiveBtn.label = i, this.receiveBtn.enabled = !Boolean(e), this.receiveBtn.visible = t, this.desc.visible = !t;
    };
    return MailDetailedWin;
}(BaseEuiView));
__reflect(MailDetailedWin.prototype, "MailDetailedWin");
MailDetailedWin.LAYER_LEVEL = LayerManager.UI_Main;
//# sourceMappingURL=MailDetailedWin.js.map