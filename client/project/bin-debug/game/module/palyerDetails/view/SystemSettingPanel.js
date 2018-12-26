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
var SystemSettingPanel = (function (_super) {
    __extends(SystemSettingPanel, _super);
    function SystemSettingPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "SystemSettingSkin";
        ///单选按钮组
        var radioGroup = new eui.RadioButtonGroup();
        _this.closeVoice.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.closeVoice0.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.hideWing.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.hideCH.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.hideTX.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.hideXW.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.hideFZ.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.hideTL.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.hideSH.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.hideOtherPaler.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.combat1.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        _this.combat2.addEventListener(egret.Event.CHANGE, _this.onChange, _this);
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    SystemSettingPanel.IsQuick = function () {
        return FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2);
    };
    SystemSettingPanel.GetSpeed = function () {
        if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3)) {
            return 2;
        }
        if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2)) {
            return 1.5;
        }
        return 1;
    };
    SystemSettingPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = '系统设置';
        this.closeVoice.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SY);
        this.closeVoice0.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_YX);
        this.hideWing.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_CB);
        this.hideCH.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_CH);
        this.hideTX.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_TX);
        this.hideXW.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW);
        this.hideFZ.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_FZ);
        this.hideTL.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_TL);
        this.hideSH.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SH);
        this.hideOtherPaler.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER);
        this.combat2.selected = SystemSettingPanel.GetSpeed() > 1;
        this.combat1.selected = !this.combat2.selected;
    };
    SystemSettingPanel.ShowOther = function () {
        GameGlobal.RaidMgr.mMapRaid.IsShowOther(!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER));
    };
    SystemSettingPanel.prototype.onChange = function (event) {
        switch (event.target) {
            case this.closeVoice:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_SY, this.closeVoice.selected);
                GameGlobal.SoundManager.SetBgOn(!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SY));
                break;
            case this.closeVoice0:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_YX, this.closeVoice0.selected);
                break;
            case this.hideWing:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_CB, this.hideWing.selected);
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_CB);
                break;
            case this.hideCH:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_CH, this.hideCH.selected);
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_CH);
                break;
            case this.hideTX:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_TX, this.hideTX.selected);
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_TX);
                break;
            case this.hideXW:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW, this.hideXW.selected);
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_XW);
                break;
            case this.hideFZ:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_FZ, this.hideFZ.selected);
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_FZ);
                break;
            case this.hideTL:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_TL, this.hideTL.selected);
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_TL);
                break;
            case this.hideSH:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_SH, this.hideSH.selected);
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_SH);
                break;
            case this.hideOtherPaler:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER, this.hideOtherPaler.selected);
                SystemSettingPanel.ShowOther();
                break;
            case this.combat1:
                this.combat2.selected = !this.combat1.selected;
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, this.combat2.selected);
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, false);
                break;
            case this.combat2:
                this.combat1.selected = !this.combat2.selected;
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, this.combat2.selected);
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, false);
                break;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_CHANGE_SYSTEM_SETTING);
    };
    SystemSettingPanel.ChangeShowOther = function (val) {
        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER, val);
        SystemSettingPanel.ShowOther();
    };
    SystemSettingPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    SystemSettingPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return SystemSettingPanel;
}(BaseEuiView));
__reflect(SystemSettingPanel.prototype, "SystemSettingPanel", ["ICommonWindow"]);
//# sourceMappingURL=SystemSettingPanel.js.map