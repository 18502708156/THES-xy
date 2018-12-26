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
var PetChangeNamePanel = (function (_super) {
    __extends(PetChangeNamePanel, _super);
    function PetChangeNamePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetRenameSkin";
        // this.groupBg.visible = true
        _this._AddClick(_this.btnRename, _this._OnClick);
        _this._AddClick(_this.btnCancel, _this._OnClick);
        UIHelper.SetInputMaxChar(_this.input, 12);
        return _this;
    }
    /**
     * param[0] 标题字符串 param[1]改名成功消息  param[2]回调函数
     */
    PetChangeNamePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(param[1], this.upDataGangName);
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = param[0];
        this.input.text = param[2] || "";
        this.callFun = param[3];
    };
    PetChangeNamePanel.prototype.OnClose = function () {
        this.removeEvents();
        this.removeObserve();
        this.commonDialog.OnRemoved();
    };
    PetChangeNamePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnRename:
                var roleName = this.input.text;
                if (roleName == "") {
                    UserTips.ins().showTips("宠物名字不可为空");
                }
                else if (roleName == GameGlobal.actorModel.name) {
                    UserTips.ins().showTips("不能与原名相同");
                }
                else {
                    this.callFun(this.input.text);
                }
                break;
            case this.btnCancel:
                ViewManager.ins().close(this);
                break;
        }
    };
    PetChangeNamePanel.prototype.upDataGangName = function () {
        UserTips.ins().showTips("修改名字成功");
        ViewManager.ins().close(this);
    };
    PetChangeNamePanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetChangeNamePanel;
}(BaseEuiView));
__reflect(PetChangeNamePanel.prototype, "PetChangeNamePanel");
//# sourceMappingURL=PetChangeNamePanel.js.map