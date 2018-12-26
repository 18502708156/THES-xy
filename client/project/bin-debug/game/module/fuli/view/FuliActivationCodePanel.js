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
 * 福利_兑换码
 */
var FuliActivationCodePanel = (function (_super) {
    __extends(FuliActivationCodePanel, _super);
    function FuliActivationCodePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliActivationCodeSkin";
        return _this;
    }
    FuliActivationCodePanel.prototype.childrenCreated = function () {
        this.tab = GameGlobal.Config.WelfareBaseConfig;
        this._AddClick(this.receiveBtn, this._OnClick);
        this._AddClick(this.inputText, this._OnClick);
        this.observe(MessageDef.FULI_GET_REDEEMCODE, this.msgPrompt);
    };
    FuliActivationCodePanel.prototype.OnOpen = function () {
        // this.inputText.text = "请输入激活码";
    };
    FuliActivationCodePanel.prototype.UpdateContent = function () {
    };
    FuliActivationCodePanel.prototype.msgPrompt = function (msg) {
        if (msg.ret != undefined && msg.ret != null) {
            var str = "";
            switch (msg.ret) {
                case 0:
                    if (this.inputText) {
                        this.inputText.text = "";
                        str = "激活码礼包兑换成功，请去邮箱查看领取！";
                    }
                    break;
                case -1:
                    str = "不存在激活码";
                    break;
                case 1:
                    str = "不存在激活码";
                    break;
                case 2:
                    str = "不存在的礼包";
                    break;
                case 3:
                    str = "激活码已使用";
                    break;
                case 4:
                    str = "已兑换相同礼包";
                    break;
                case 5:
                    str = "验证失败";
                    break;
                case 6:
                    str = "激活码已过期";
                    break;
                default:
                    str = msg.ret + "";
                    break;
            }
            UserTips.ins().showTips(str);
        }
    };
    FuliActivationCodePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.receiveBtn:
                var item = this.inputText.text;
                if (item != "") {
                    GameGlobal.FuliModel.SendRedeemCode(item);
                }
                break;
            case this.inputText:
                // this.inputText.text="";
                break;
        }
    };
    FuliActivationCodePanel.prototype.OnClose = function () {
    };
    //skinName
    //FuliActivationCodeSkin.exml
    FuliActivationCodePanel.LAYER_LEVEL = LayerManager.UI_Main;
    return FuliActivationCodePanel;
}(BaseEuiView));
__reflect(FuliActivationCodePanel.prototype, "FuliActivationCodePanel");
//# sourceMappingURL=FuliActivationCodePanel.js.map