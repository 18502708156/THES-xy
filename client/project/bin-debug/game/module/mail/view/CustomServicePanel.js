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
var CustomServicePanel = (function (_super) {
    __extends(CustomServicePanel, _super);
    function CustomServicePanel() {
        var _this = _super.call(this) || this;
        _this.defaultText = "点击输入咨询内容";
        _this.skinName = "CustomServicePanelSkin";
        if (CustomServicePanel.QQ_STR == null) {
            GameSocket.ins().Rpc(C2sProtocol.cs_get_kefu_qq, null, _this._DoUpdateQQStr, _this);
        }
        return _this;
    }
    CustomServicePanel.prototype._DoUpdateQQStr = function (rsp) {
        CustomServicePanel.QQ_STR = rsp.qq;
        this._UpateQQLabel();
    };
    CustomServicePanel.prototype._UpateQQLabel = function () {
        if (this.qqLabel == null) {
            return;
        }
        var qq = CustomServicePanel.QQ_STR;
        if (StringUtils.IsNullOrEmpty(qq)) {
            this.qqLabel.text = "";
        }
        else {
            this.qqLabel.text = "客服QQ：" + qq;
        }
    };
    CustomServicePanel.prototype.childrenCreated = function () {
        this._SetShowState(0);
    };
    CustomServicePanel.prototype._SetShowState = function (state) {
        var canInput = state == 0;
        this.qqLabel.visible = canInput;
        this.sendBtn.visible = canInput;
        this.input.visible = canInput;
    };
    CustomServicePanel.prototype.OnOpen = function () {
        this._UpateQQLabel();
        this.AddClick(this.sendBtn, this.OnClick);
    };
    CustomServicePanel.prototype.OnClick = function (t) {
        if (0 == this.input.text.length || this.input.text == this.defaultText) {
            UserTips.ins().showTips("内容不能为空");
            return;
        }
        var text = this.input.text;
        this.input.text = "";
        var req = new Sproto.cs_send_kefu_msg_request;
        req.msg = text;
        GameSocket.ins().Rpc(C2sProtocol.cs_send_kefu_msg, req);
        UserTips.ins().showTips("发送成功");
        // this.SendMsg(text)
    };
    // private SendMsg(text) {
    // 	var request = new egret.HttpRequest();
    //     request.responseType = egret.HttpResponseType.TEXT
    //     request.open("http://api.zzby.mjh5.com/leniu/kf_info", egret.HttpMethod.POST);
    // 	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //     request.send(`platformid=${WindowData._GetPlatformId()}&serverid=${Main.Instance.mConnectServerData.id}&account=${GameGlobal.actorModel.actorID}&content=${text}`)
    //     request.addEventListener(egret.Event.COMPLETE, this._Complete, this);
    // 	request.addEventListener(egret.IOErrorEvent.IO_ERROR, this._Error, this);
    // }
    CustomServicePanel.prototype._Complete = function (event) {
        var request = event.currentTarget;
        console.log(request.response);
    };
    CustomServicePanel.prototype._Error = function (event) {
        console.log("event error");
    };
    CustomServicePanel.prototype.UpdateContent = function () {
    };
    CustomServicePanel.NAME = "意见反馈";
    /////////////////////////////////////////////////////////////////////////////
    CustomServicePanel.QQ_STR = null;
    return CustomServicePanel;
}(BaseView));
__reflect(CustomServicePanel.prototype, "CustomServicePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=CustomServicePanel.js.map