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
var ResultFailPanel = (function (_super) {
    __extends(ResultFailPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ResultFailPanel() {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.skinName = "ResultFailSkin";
        return _this;
    }
    ResultFailPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.SetBtnLabel("退出");
        this.SetTitleLabel("我要变强");
        this.SetCloseFunc(param[1]);
        for (var i = 0; i < 4; i++) {
            this._AddClick(this["img" + i], this.click);
        }
        this._AddClick(this.helpBtn, this.click);
        this._AddClick(this.gifBtn, this.click);
        var state = param[2] || 0;
        if (state == 2) {
            this.titleImg.source = "ui_js_bm_tiaozhanjieshu";
            this.gpGuanqia.visible = false;
        }
        else {
            this.titleImg.source = "ui_bm_shibai";
        }
        this.gpGuanqia.visible = BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS;
        _super.prototype.OnOpen.call(this);
        this.showGif();
    };
    ResultFailPanel.prototype.click = function (e) {
        switch (e.target) {
            case this.img0:
                ViewManager.ins().open(GrowUpWin);
                this.CloseSelf();
                break;
            case this.img1:
                ViewManager.ins().open(PetMainPanel);
                this.CloseSelf();
                break;
            case this.img2:
                ViewManager.ins().open(ForgeWin);
                this.CloseSelf();
                break;
            case this.img3:
                ViewManager.ins().open(RoleSkilSetLayer);
                this.CloseSelf();
                break;
            case this.helpBtn:
                this.help();
                break;
            case this.gifBtn:
                if (this.index == 0) {
                    return;
                }
                var config = GameGlobal.Config.RecmdGiftConfig[this.index];
                ViewManager.ins().Guide(config.taget);
                this.CloseSelf();
                break;
        }
    };
    ResultFailPanel.prototype.showGif = function () {
        if (this.gpGuanqia.visible) {
            this.gifBtn.visible = false;
            return;
        }
        if (this.selectShouCong()) {
            this.index = 1;
            this.showBnt();
            return;
        }
        if (!this.selectXuanNv()) {
            this.index = 2;
            this.showBnt();
            return;
        }
        if (this.selectGif()) {
            this.index = 3;
            this.showBnt();
            return;
        }
        this.showBnt();
    };
    ResultFailPanel.prototype.showBnt = function () {
        if (this.index == 0) {
            this.gifBtn.visible = false;
            return;
        }
        var config = GameGlobal.Config.RecmdGiftConfig[this.index];
        this.gifBtn.icon = config.icon;
    };
    ResultFailPanel.prototype.selectShouCong = function () {
        var result = false;
        var config = GameGlobal.Config.FirstRechargeConfig;
        for (var key in config) {
            if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
                result = true;
                break;
            }
        }
        return result;
    };
    ResultFailPanel.prototype.selectXuanNv = function () {
        return Deblocking.Check(DeblockingType.TYPE_19, true);
    };
    ResultFailPanel.prototype.selectGif = function () {
        var data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(9);
        if (data) {
            var config = data.GetConfig();
            if (!config[data.reachday]) {
                return false;
            }
            //this.tar.icon = config[data.reachday].icon;
            if (data.runday <= data.reachday) {
                return false;
            }
            if (data.isOpenActivity() && Deblocking.Check(DeblockingType.TYPE_104, true)) {
                return true;
            }
        }
        return false;
    };
    ResultFailPanel.prototype.help = function () {
        if (Deblocking.Check(DeblockingType.TYPE_49) && Deblocking.Check(DeblockingType.TYPE_115)) {
            GameGlobal.Chat.chatShareInfo(20, null); //目前只有世界
        }
    };
    return ResultFailPanel;
}(ResultBasePanel));
__reflect(ResultFailPanel.prototype, "ResultFailPanel");
//# sourceMappingURL=ResultFailPanel.js.map