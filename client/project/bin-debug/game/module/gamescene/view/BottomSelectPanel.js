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
var BottomSelectPanel = (function (_super) {
    __extends(BottomSelectPanel, _super);
    function BottomSelectPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "BottomSelectPanelSkins";
        _this.navBtn = [_this.tianvBtn, _this.xiannvBtn0, _this.tianshenBtn, _this.lingtongBtn];
        _this.navBind = [HavingMainPanel, XianlvMainPanel, TianShenMainPanel, LingtongMainPanel];
        return _this;
    }
    BottomSelectPanel.prototype.destoryView = function () { };
    BottomSelectPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.parent.globalToLocal(0, GameGlobal.StageUtils.GetHeight() - 130, egret.$TempPoint);
        this.conGroup.y = egret.$TempPoint.y;
        this.ShowCount();
        for (var i = 0; i < this.navBtn.length; i++) {
            this.navBtn[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        }
        this.observe(GameGlobal.XianlvFzModel.GetItemRpUpdateMsg(), this.UpdateXianlvRedPoint);
        this.observe(GameGlobal.XianlvFzModel.GetItemEquipRpUpdateMsg(), this.UpdateXianlvRedPoint);
        this.observe(GameGlobal.XianlvXwModel.GetItemRpUpdateMsg(), this.UpdateXianlvRedPoint);
        this.observe(GameGlobal.XianlvXwModel.GetItemEquipRpUpdateMsg(), this.UpdateXianlvRedPoint);
        this.observe(MessageDef.RP_BAG_XIANLV_ACT_ITEM, this.UpdateXianlvRedPoint);
        this.observe(MessageDef.RP_XIANLV, this.UpdateXianlvRedPoint);
        this.observe(MessageDef.YUANFEN_ALL_NOTICE, this.UpdateXianlvRedPoint);
        this.UpdateXianlvRedPoint();
        this.observe(GameGlobal.HavingModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint);
        this.observe(GameGlobal.HavingModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint);
        this.observe(GameGlobal.HavingHuanModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint);
        this.observe(GameGlobal.HavingHuanModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint);
        this.observe(GameGlobal.HavingLingqModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint);
        this.observe(GameGlobal.HavingLingqModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint);
        this.UpdateTiannvRedPoint();
        this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateTiansRedPoint);
        this.observe(MessageDef.RP_TIANSHEN, this.UpdateTiansRedPoint);
        this.observe(MessageDef.YUANFEN_ALL_NOTICE, this.UpdateTiansRedPoint);
        this.UpdateTiansRedPoint();
        this.observe(GameGlobal.LingtongModel.GetItemRpUpdateMsg(), this.UpdateLigntongRedPoint);
        this.observe(GameGlobal.LingtongModel.GetItemEquipRpUpdateMsg(), this.UpdateLigntongRedPoint);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateLigntongRedPoint);
        this.UpdateLigntongRedPoint();
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng);
        this.anim.play(0);
    };
    BottomSelectPanel.prototype.OnClose = function () {
    };
    BottomSelectPanel.prototype.ShowCount = function () {
        var tiansState = Deblocking.Check(DeblockingType.TYPE_23, true);
        UIHelper.SetVisible(this.tianshenBtn, tiansState);
        UIHelper.SetVisible(this.tianshenBtnline, tiansState);
        var tiannvState = Deblocking.Check(DeblockingType.TYPE_19, true);
        UIHelper.SetVisible(this.tianvBtn, tiannvState);
        UIHelper.SetVisible(this.tianvBtnline, tiannvState);
        var lingtState = Deblocking.Check(DeblockingType.TYPE_116, true);
        UIHelper.SetVisible(this.lingtongBtn, lingtState);
        UIHelper.SetVisible(this.lingtongBtnline, lingtState);
        UIHelper.SetVisible(this.xiannvBtn0, true);
        this.btnGroup.horizontalCenter = tiansState && tiannvState && lingtState ? -73 : 0;
        var state = tiansState || tiannvState || lingtState;
        return state;
    };
    BottomSelectPanel.prototype.updateJiJieBtnPng = function () {
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.tianvBtn, [ActivityKaiFuJiJieType.tiannv_nimbus, ActivityKaiFuJiJieType.tiannv_flower]);
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.xiannvBtn0, [ActivityKaiFuJiJieType.xianlv_circle, ActivityKaiFuJiJieType.xianlv_position]);
    };
    BottomSelectPanel.prototype.onClick = function (e) {
        var index = this.navBtn.indexOf(e.currentTarget);
        var navCls = this.navBind[index];
        if (navCls) {
            if (ViewManager.ins().isShow(navCls)) {
                ViewManager.ins().close(navCls);
            }
            else {
                ViewManager.ins().open(navCls);
                ViewManager.ins().close(this);
            }
        }
    };
    BottomSelectPanel.prototype.GetXianlvRedPoint = function () {
        if (GameGlobal.XianlvModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.XianlvFzModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.XianlvXwModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.YuanfenModel.IsRedPoint()) {
            return true;
        }
        return false;
    };
    BottomSelectPanel.prototype.UpdateXianlvRedPoint = function () {
        UIHelper.ShowRedPoint(this.xiannvBtn0, this.GetXianlvRedPoint());
    };
    BottomSelectPanel.prototype.GetTiannvRedPoint = function () {
        if (GameGlobal.HavingModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.HavingHuanModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.HavingLingqModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        return false;
    };
    BottomSelectPanel.prototype.UpdateTiannvRedPoint = function () {
        UIHelper.ShowRedPoint(this.tianvBtn, this.GetTiannvRedPoint());
    };
    BottomSelectPanel.prototype.UpdateTiansRedPoint = function () {
        UIHelper.ShowRedPoint(this.tianshenBtn, GameGlobal.TianShenModel.mRedPoint.IsRedPoint() || GameGlobal.YuanfenModel.IsRedPoint());
    };
    BottomSelectPanel.prototype.UpdateLigntongRedPoint = function () {
        UIHelper.ShowRedPoint(this.lingtongBtn, GameGlobal.LingtongAttrModel.IsRedPoint());
    };
    BottomSelectPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return BottomSelectPanel;
}(BaseEuiView));
__reflect(BottomSelectPanel.prototype, "BottomSelectPanel");
//# sourceMappingURL=BottomSelectPanel.js.map