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
var PlayFunTipBtnType;
(function (PlayFunTipBtnType) {
    PlayFunTipBtnType[PlayFunTipBtnType["CATCH_PET"] = 0] = "CATCH_PET";
    PlayFunTipBtnType[PlayFunTipBtnType["TEAM"] = 1] = "TEAM";
    PlayFunTipBtnType[PlayFunTipBtnType["MAIL"] = 2] = "MAIL";
    PlayFunTipBtnType[PlayFunTipBtnType["QUJING_AWARD"] = 3] = "QUJING_AWARD";
    PlayFunTipBtnType[PlayFunTipBtnType["QUJING_ROBBED"] = 4] = "QUJING_ROBBED";
})(PlayFunTipBtnType || (PlayFunTipBtnType = {}));
var PlayFunTipBtn = (function (_super) {
    __extends(PlayFunTipBtn, _super);
    function PlayFunTipBtn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayFunTipBtn.prototype.childrenCreated = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    PlayFunTipBtn.prototype._OnClick = function () {
        var data = this.data;
        if (data.id == PlayFunTipBtnType.CATCH_PET) {
            var view = ViewManager.ins().getView(PlayFunView);
            view.CatchPetClick();
        }
        else if (data.id == PlayFunTipBtnType.TEAM) {
            TeamBaseModelMsg.GoHasTeamPanel();
        }
        else if (data.id == PlayFunTipBtnType.MAIL) {
            ViewManager.ins().open(MailWin);
        }
        else if (data.id == PlayFunTipBtnType.QUJING_AWARD) {
            ViewManager.ins().open(QujingMainWin);
        }
        else if (data.id == PlayFunTipBtnType.QUJING_ROBBED) {
            ViewManager.ins().open(QujingRecordWin);
        }
    };
    PlayFunTipBtn.prototype.DoUpdate = function () {
        var data = this.data;
        return false;
    };
    PlayFunTipBtn.prototype.dataChanged = function () {
        var data = this.data;
        this.iconDisplay.source = PlayFunTipBtn.ICON[data.id];
    };
    /////////////////////////////////////////////////////////////////////////////
    PlayFunTipBtn.ICON = (_a = {},
        _a[PlayFunTipBtnType.CATCH_PET] = "ui_bm_zhuabu",
        _a[PlayFunTipBtnType.TEAM] = "ui_zjm_bt_zudui",
        _a[PlayFunTipBtnType.MAIL] = "ui_bm_youjian",
        _a[PlayFunTipBtnType.QUJING_AWARD] = "ui_bm_husongjiangli",
        _a[PlayFunTipBtnType.QUJING_ROBBED] = "ui_bm_beijie",
        _a);
    return PlayFunTipBtn;
}(eui.ItemRenderer));
__reflect(PlayFunTipBtn.prototype, "PlayFunTipBtn");
var PlayFunTipBtnData = (function () {
    function PlayFunTipBtnData() {
    }
    return PlayFunTipBtnData;
}());
__reflect(PlayFunTipBtnData.prototype, "PlayFunTipBtnData");
var _a;
//# sourceMappingURL=PlayFunTipBtn.js.map