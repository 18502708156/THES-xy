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
var MailModel = (function (_super) {
    __extends(MailModel, _super);
    function MailModel() {
        var _this = _super.call(this) || this;
        _this.mailData = [];
        _this.currentMailHandle = 0;
        _this.regNetMsg(S2cProtocol.sc_mail_init_info, _this.doMailData);
        _this.regNetMsg(S2cProtocol.sc_mail_detailed_info, _this.doMailDetailedData);
        _this.regNetMsg(S2cProtocol.sc_mail_delete, _this.doDeleteMail);
        _this.regNetMsg(S2cProtocol.sc_mail_update_info, _this.doGetItemMail);
        _this.regNetMsg(S2cProtocol.sc_mail_add_info, _this.doAddMail);
        return _this;
    }
    MailModel.ins = function () {
        return _super.ins.call(this);
    };
    MailModel.prototype.sendMailContentData = function (handle) {
        var req = new Sproto.cs_mail_get_content_request;
        req.handle = handle;
        this.Rpc(C2sProtocol.cs_mail_get_content, req);
    };
    MailModel.prototype.sendGetItem = function (handles) {
        if (!handles || handles.length == 0)
            return;
        var req = new Sproto.cs_mail_get_reward_request;
        req.handle = handles;
        this.Rpc(C2sProtocol.cs_mail_get_reward, req);
    };
    MailModel.prototype.doMailData = function (rsp) {
        this.mailData = [];
        for (var i = rsp.mailData.length, n = 0; i > n; n++) {
            var r = new MailData;
            r.disposeData(rsp.mailData[n]), this.mailData.push(r);
        }
        this.mailSort(1);
        GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE);
    };
    MailModel.prototype.doAddMail = function (rsp) {
        this.mailData || (this.mailData = []);
        var r = new MailData;
        r.disposeData(rsp.mailData);
        this.mailData.unshift(r);
        GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE);
    };
    MailModel.prototype.doMailDetailedData = function (rsp) {
        var data = new MailData;
        data.parser(rsp);
        var find = false;
        for (var i = 0; i < this.mailData.length; i++)
            if (this.mailData[i].handle == data.handle) {
                this.mailData[i] = data;
                find = true;
                break;
            }
        find && (this.currentMailHandle = data.handle, ViewManager.ins().open(MailDetailedWin), GameGlobal.MessageCenter.dispatch(MessageDef.OPEN_MAIL, data), GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE));
    };
    MailModel.prototype.getMailDataByHandle = function (e) {
        for (var t = 0; t < this.mailData.length; t++)
            if (this.mailData[t].handle == e)
                return this.mailData[t];
        return null;
    };
    MailModel.prototype.doDeleteMail = function (e) {
        if (this.mailData)
            for (var t = 0; t < this.mailData.length; t++)
                if (this.mailData[t].handle == e.handle) {
                    GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE);
                    return void this.mailData.splice(t, 1);
                }
    };
    MailModel.prototype.getMailByReceive = function (e) {
        if (e === void 0) { e = 0; }
        var t = [];
        if (this.mailData.length > 0)
            for (var i = this.mailData.length - 1; i >= 0; i--)
                this.mailData[i].receive == e && t.push(this.mailData[i]);
        return t;
    };
    MailModel.prototype.getUnreadMail = function () {
        if (this.mailData.length > 0) {
            for (var t = this.mailData.length - 1; t >= 0; t--) {
                if (0 == this.mailData[t].type || 0 == this.mailData[t].receive) {
                    return true;
                }
            }
        }
        return false;
    };
    MailModel.prototype.getCurrentMail = function () {
        return this.getMailDataByHandle(this.currentMailHandle);
    };
    MailModel.prototype.doGetItemMail = function (e) {
        for (var t = e.updateData.length, i = 0; t > i; i++) {
            var data = e.updateData[i];
            for (var n = data.handle, r = 0; r < this.mailData.length; r++)
                if (this.mailData[r].handle == n) {
                    this.mailData[r].type = data.type, this.mailData[r].receive = data.receive, GameGlobal.MessageCenter.dispatch(MessageDef.OPEN_MAIL, this.mailData[r]);
                    break;
                }
        }
        if (e.showWarnBagSpace)
            // UserTips.ins().showTips("|C:0xff0000&T:背包空间不足|");
            BagFullTipsPanel.Open();
        GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_GET_ITEM);
        GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE);
    };
    MailModel.prototype.sort1 = function (e, t) {
        var i = e.times, n = t.times;
        return i > n ? -1 : n > i ? 1 : 0;
    };
    MailModel.prototype.sort2 = function (e, t) {
        var i = e.times, n = t.times;
        return n > i ? -1 : i > n ? 1 : 0;
    };
    MailModel.prototype.mailSort = function (e) {
        var t = this.mailData;
        return e ? t.sort(this.sort1) : t.sort(this.sort2), t;
    };
    return MailModel;
}(BaseSystem));
__reflect(MailModel.prototype, "MailModel");
//# sourceMappingURL=MailModel.js.map