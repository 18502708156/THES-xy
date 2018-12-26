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
var MailListPanel = (function (_super) {
    __extends(MailListPanel, _super);
    //protected group: eui.Group
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function MailListPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "MailListSkin";
        _this._mails = [];
        _this.mailList.itemRenderer = MailItem;
        return _this;
        // this.mailScroller.viewport = this.mailList
    }
    MailListPanel.prototype.OnOpen = function () {
        this.allReceiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.mailList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendMail, this);
        this.observe(MessageDef.MAIL_DATA_CHANGE, this.setMailData);
        this.observe(MessageDef.OPEN_MAIL, this.setOpenMail);
        this.setMailData();
    };
    MailListPanel.prototype.OnClose = function () {
        this.allReceiveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.mailList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendMail, this);
        GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_DATA_CHANGE, this.setMailData, this);
        GameGlobal.MessageCenter.removeListener(MessageDef.OPEN_MAIL, this.setOpenMail, this);
    };
    MailListPanel.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.allReceiveBtn:
                for (var t = [], i = MailModel.ins().getMailByReceive(), n = 0; n < i.length; n++)
                    t.push(i[n].handle);
                MailModel.ins().sendGetItem(t);
        }
    };
    MailListPanel.prototype.onSendMail = function (e) {
        var t = e.target.parent;
        if (t) {
            var i = t.data;
            i && MailModel.ins().sendMailContentData(i.handle);
        }
    };
    MailListPanel.prototype.setMailData = function () {
        var bRead = false;
        this._mails = MailModel.ins().mailData;
        this.mailList.dataProvider = new eui.ArrayCollection(this._mails);
        // this.allReceiveBtn.visible = Boolean(MailModel.ins().getMailByReceive().length)
        //this.group.visible = Boolean(MailModel.ins().getMailByReceive().length)
        MailModel.ins().mailData.length > 0 && (this.noMailTip.visible = !1);
        if (!(MailModel.ins().mailData.length > 0)) {
            this.allReceiveBtn.visible = false;
            this.bgbg.visible = false;
        }
        for (var index in this._mails) {
            var pMail = this._mails[index];
            if (pMail.receive === 0) {
                bRead = true; //有未读邮件
                break;
            }
        }
        //领取按钮显示
        if (bRead) {
            this.allReceiveBtn.visible = true;
            this.mailScroller.height = 727;
        }
        else {
            this.allReceiveBtn.visible = false;
            this.mailScroller.height = 840;
        }
    };
    MailListPanel.prototype.setOpenMail = function (e) {
        for (var t = 0; t < this.mailList.numChildren; t++) {
            var mailItem = this.mailList.getChildAt(t);
            if (mailItem.data.handle == e.handle)
                return void (mailItem.data = e);
        }
    };
    MailListPanel.prototype.UpdateContent = function () {
    };
    MailListPanel.NAME = "邮件";
    return MailListPanel;
}(BaseView));
__reflect(MailListPanel.prototype, "MailListPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=MailListPanel.js.map