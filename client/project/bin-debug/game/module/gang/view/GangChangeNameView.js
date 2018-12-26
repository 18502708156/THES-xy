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
var GangChangeNameView = (function (_super) {
    __extends(GangChangeNameView, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangChangeNameView() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangChangeNameSkin";
        _this._AddClick(_this.btnRename, _this._OnClick);
        _this._AddClick(_this.btnCancel, _this._OnClick);
        return _this;
    }
    GangChangeNameView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.GANG_CHANGE_NAME, this.upDataGangName);
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "帮会改名";
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        this.input.textColor = 0x755E4F;
        this.input.text = myGangInfo.mGangName;
        this.input.maxChars = 6;
        var type = GameGlobal.Config.GuildConfig.renamecost.id;
        var count = GameGlobal.Config.GuildConfig.renamecost.count;
        this.price.setType(type);
        this.price.setPrice(count);
    };
    GangChangeNameView.prototype.OnClose = function () {
        this.removeEvents();
        this.removeObserve();
        this.commonDialog.OnRemoved();
    };
    GangChangeNameView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnRename:
                this.HandleRename();
                break;
            case this.btnCancel:
                ViewManager.ins().close(this);
                break;
        }
    };
    GangChangeNameView.prototype.HandleRename = function () {
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        var gangName = this.input.text;
        if (gangName == "") {
            UserTips.ins().showTips("帮会名字不可为空");
            return;
        }
        if (gangName == myGangInfo.mGangName) {
            UserTips.ins().showTips("不能与帮会原名相同");
            return;
        }
        if (Checker.Money(GameGlobal.Config.GuildConfig.renamecost.id, GameGlobal.Config.GuildConfig.renamecost.count)) {
            GameGlobal.GangModel.sendChangeName(gangName);
        }
    };
    GangChangeNameView.prototype.upDataGangName = function () {
        UserTips.ins().showTips("修改帮会名字成功");
        ViewManager.ins().close(this);
    };
    GangChangeNameView.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangChangeNameView;
}(BaseEuiView));
__reflect(GangChangeNameView.prototype, "GangChangeNameView");
//# sourceMappingURL=GangChangeNameView.js.map