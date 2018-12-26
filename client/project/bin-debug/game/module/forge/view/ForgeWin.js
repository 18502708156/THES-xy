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
var ForgeWin = (function (_super) {
    __extends(ForgeWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ForgeWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "ForgeSkin";
        return _this;
    }
    ForgeWin.prototype.childrenCreated = function () {
        ForgeViewHelper.InitItemGroup(this.equipComp);
        var args = { mContext: this, equipComp: this.equipComp };
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(ForgeqhPanel, args),
            TabView.CreateTabViewData(ForgejlPanel, args),
            TabView.CreateTabViewData(ForgedlPanel, args),
            TabView.CreateTabViewData(ForgeGemPanel, args),
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
        this._AddClick(this.equipComp.getwayLabel, this._OnClick);
        this._AddClick(this.equipComp.onKeyBtn, this._OnClick);
        this._AddClick(this.equipComp.masterBtn, this._OnClick);
    };
    ForgeWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this, args.length ? args[0] : 0);
        this.observe(MessageDef.FORGE_UPDATE, this.UpdateForge);
        this.observe(MessageDef.RP_FORGE, this.UpdateRedPoint);
        this.UpdateRedPoint();
    };
    ForgeWin.prototype.OnClose = function () {
        MainBottomPanel.CloseNav(this);
    };
    ForgeWin.prototype._OnClick = function (e) {
        var forgePanel = this.commonWindowBg.GetCurViewStackElement();
        switch (e.currentTarget) {
            case this.equipComp.onKeyBtn:
                if (forgePanel.CheckUpgrade()) {
                    forgePanel.SendUpgrade();
                }
                else {
                    if (forgePanel.mForgeType === ForgeType.BOOST) {
                        // UserTips.ins().showTips("调到兑换界面,待完成")
                    }
                    else {
                        var data = forgePanel.GetConsumeValue();
                        if (data) {
                            UserWarn.ins().setBuyGoodsWarn(data.id);
                        }
                    }
                }
                break;
            case this.equipComp.masterBtn:
                ViewManager.ins().open(ForgeMasterTipPanel, forgePanel.mForgeType);
                break;
            case this.equipComp.getwayLabel:
                UserWarn.ins().BuyGoodsWarn(this.equipComp.consumeLabel.consumeItemId);
                break;
        }
    };
    ForgeWin.prototype.UpdateForge = function (forgeType) {
        var forgePanel = this.commonWindowBg.GetCurViewStackElement();
        if (forgeType == forgePanel.mForgeType) {
            forgePanel.UpdateForge();
        }
    };
    ForgeWin.prototype.UpdateRedPoint = function () {
        this.mCommonWindowBg.CheckTalRedPoint(0);
        this.mCommonWindowBg.CheckTalRedPoint(1);
        this.mCommonWindowBg.CheckTalRedPoint(2);
        this.mCommonWindowBg.CheckTalRedPoint(3);
    };
    ForgeWin.LAYER_LEVEL = LayerManager.UI_Main;
    return ForgeWin;
}(BaseEuiView));
__reflect(ForgeWin.prototype, "ForgeWin");
//# sourceMappingURL=ForgeWin.js.map