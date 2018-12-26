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
var GangModifyNoticeView = (function (_super) {
    __extends(GangModifyNoticeView, _super);
    function GangModifyNoticeView() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangModifyNoticeSkin";
        _this._AddClick(_this.btnComfirn, _this._OnClick);
        _this._AddClick(_this.btnCancel, _this._OnClick);
        _this.labInput.addEventListener(egret.Event.CHANGE, _this._OnChang, _this);
        return _this;
    }
    GangModifyNoticeView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "公告";
        this.labInput.type = "input";
        this.labInput.multiline = this.labInput.wordWrap = true;
        this.labInput.maxChars = 150;
    };
    GangModifyNoticeView.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GangModifyNoticeView.prototype._OnChang = function (e) {
        this.labNumTip.text = e.target.text.length + "/150";
    };
    GangModifyNoticeView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnComfirn:
                var text = this.labInput.text;
                GameGlobal.GangModel.SendModifyNotice(text);
                ViewManager.ins().close(this);
                break;
            case this.btnCancel:
                ViewManager.ins().close(this);
                break;
        }
    };
    GangModifyNoticeView.prototype.InitGang = function () {
        UserTips.ins().showTips("创建帮会成功");
        ViewManager.ins().close(this);
    };
    GangModifyNoticeView.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangModifyNoticeView;
}(BaseEuiView));
__reflect(GangModifyNoticeView.prototype, "GangModifyNoticeView");
//# sourceMappingURL=GangModifyNoticeView.js.map