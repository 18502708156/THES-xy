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
var FriendTipsPanel = (function (_super) {
    __extends(FriendTipsPanel, _super);
    function FriendTipsPanel() {
        return _super.call(this) || this;
    }
    FriendTipsPanel.prototype.childrenCreated = function () {
        this.skinName = "FriendTipsSkin";
        this.commonDialog.title = "提示";
    };
    FriendTipsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this._AddClick(this.affirmBtn, this.onClick);
        this._AddClick(this.cancelBtn, this.onClick);
        this.data = param[0];
        this.UpdateContent();
    };
    FriendTipsPanel.prototype.UpdateContent = function () {
        this.playerAvatar.setItemImg(ResDataPath.GetHeadImgName(this.data.job, this.data.sex));
        this.nameTxt.text = this.data.name;
        this.lvTxt.text = this.data.level;
        this.gangNameTxt.text = this.data.guildNames;
        this.vipTxt.visible = this.data.vip > 0;
        this.tipsTxt.text = "\u786E\u8BA4\u8981\u53D6\u6D88\u5BF9\u3010" + this.data.name + "\u3011\u7684\u5173\u6CE8\uFF1F";
    };
    FriendTipsPanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.affirmBtn:
                GameGlobal.FriendModel.sendDleFriend(this.data.dbid);
                ViewManager.ins().close(FriendTipsPanel);
                break;
            case this.cancelBtn:
                ViewManager.ins().close(FriendTipsPanel);
                break;
        }
    };
    FriendTipsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FriendTipsPanel;
}(BaseEuiView));
__reflect(FriendTipsPanel.prototype, "FriendTipsPanel");
//# sourceMappingURL=FriendTipsPanel.js.map