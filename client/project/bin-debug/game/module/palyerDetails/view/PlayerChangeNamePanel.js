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
var PlayerChangeNamePanel = (function (_super) {
    __extends(PlayerChangeNamePanel, _super);
    function PlayerChangeNamePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PlayerChangeNameSkin";
        // this.groupBg.visible = true
        _this._AddClick(_this.btnRename, _this._OnClick);
        _this._AddClick(_this.btnCancel, _this._OnClick);
        UIHelper.SetInputMaxChar(_this.input, 12);
        return _this;
    }
    PlayerChangeNamePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.PLAYER_CHANGE_NAME, this.upDataGangName);
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "玩家改名";
        this.price.setPrice(GameGlobal.Config.RoleBaseConfig.changenamecost.count);
        this.price.visible = GameGlobal.PlayerInfoModel.detailsData.renameCount > 0;
        this.costTxt.visible = GameGlobal.PlayerInfoModel.detailsData.renameCount < 1;
    };
    PlayerChangeNamePanel.prototype.OnClose = function () {
        this.removeEvents();
        this.removeObserve();
        this.commonDialog.OnRemoved();
    };
    PlayerChangeNamePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnRename:
                var roleName = this.input.text;
                if (roleName == "") {
                    UserTips.ins().showTips("玩家名字不可为空");
                }
                else if (roleName == GameGlobal.actorModel.name) {
                    UserTips.ins().showTips("不能与原名相同");
                }
                else if (GameGlobal.PlayerInfoModel.detailsData.renameCount < 1
                    || Checker.Money(GameGlobal.Config.RoleBaseConfig.changenamecost.id, GameGlobal.Config.RoleBaseConfig.changenamecost.count)) {
                    GameGlobal.PlayerInfoModel.sendChangeName(roleName);
                }
                break;
            case this.btnCancel:
                ViewManager.ins().close(this);
                break;
        }
    };
    PlayerChangeNamePanel.prototype.upDataGangName = function (req) {
        UserTips.ins().showTips("修改名字成功");
        ViewManager.ins().close(this);
    };
    PlayerChangeNamePanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PlayerChangeNamePanel;
}(BaseEuiView));
__reflect(PlayerChangeNamePanel.prototype, "PlayerChangeNamePanel");
//# sourceMappingURL=PlayerChangeNamePanel.js.map