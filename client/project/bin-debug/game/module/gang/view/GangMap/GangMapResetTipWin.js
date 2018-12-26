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
var GangMapResetTipWin = (function (_super) {
    __extends(GangMapResetTipWin, _super);
    function GangMapResetTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangMapTaskResetTipSkin";
        _this._AddClick(_this.btnConfirm, _this._OnClick);
        _this._AddClick(_this.btnCancel, _this.CloseSelf);
        _this._AddClick(_this.labToVIp, _this._OnClick);
        return _this;
    }
    GangMapResetTipWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "任务重置";
        UIHelper.SetLinkStyleLabel(this.labToVIp);
        this.mConfig = param[0];
        var cost = this.mConfig.resetcost;
        this.priceicon.type = cost.id;
        this.priceicon.price = cost.count;
        var taskName = this.mConfig.type == 0 ? "帮会怪物" : "帮会采集";
        this.labTip.text = "\u91CD\u7F6E" + taskName + "\u4EFB\u52A1\uFF1F";
        var vipLv = GameGlobal.actorModel.vipLv;
        var vipConfig = GameGlobal.Config.VipPrivilegeConfig[vipLv];
        var taskInfo = GameGlobal.GangMapModel.GetTaskInfo(this.mConfig.id);
        var count = vipConfig.buyreset - taskInfo.mResetCount;
        this.labCount.text = count + "\u6B21";
        var nextVipConfig = GameGlobal.Config.VipPrivilegeConfig[vipLv + 1];
        if (!nextVipConfig) {
            this.groupVip.visible = false;
            return;
        }
        var vipText = "|C:0x019704&T:VIP" + (vipLv + 1) + "|\u53EF\u518D\u8D2D\u4E70|C:0x019704&T:" + (nextVipConfig.buyreset - vipConfig.buyreset) + "|\u6B21";
        this.labVipTip.textFlow = TextFlowMaker.generateTextFlow(vipText);
    };
    GangMapResetTipWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GangMapResetTipWin.prototype._OnClick = function (e) {
        var _this = this;
        switch (e.currentTarget) {
            case this.btnConfirm:
                var cost = this.mConfig.resetcost;
                Checker.Money(cost.id, cost.count, true, null, function () {
                    GameGlobal.GangMapModel.SendResetTask(_this.mConfig.id);
                });
                this.CloseSelf();
                break;
            case this.labToVIp:
                ViewManager.ins().open(VipMainPanel);
                break;
        }
    };
    GangMapResetTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangMapResetTipWin;
}(BaseEuiView));
__reflect(GangMapResetTipWin.prototype, "GangMapResetTipWin");
//# sourceMappingURL=GangMapResetTipWin.js.map