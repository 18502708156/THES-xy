class SystemSettingPanel extends BaseEuiView implements ICommonWindow {
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // SystemSettingSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected closeVoice: eui.CheckBox;
    protected closeVoice0: eui.CheckBox;
    protected hideWing: eui.CheckBox;
    protected hideCH: eui.CheckBox;
    protected hideTX: eui.CheckBox;
    protected hideXW: eui.CheckBox;
    protected hideFZ: eui.CheckBox;
    protected hideTL: eui.CheckBox;
    protected hideSH: eui.CheckBox;
    protected hideOtherPaler: eui.CheckBox;
    protected combat1: eui.CheckBox;
    protected combat2: eui.CheckBox;
    
    /////////////////////////////////////////////////////////////////////////////

    public static IsQuick(): boolean {
        return FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2)
    }

    public static GetSpeed(): number {
        if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3)) {
            return 2
        }
        if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2)) {
            return 1.5
        }
        return 1
    }

    public constructor() {
        super()
        this.skinName = "SystemSettingSkin";

        ///单选按钮组
        var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        this.closeVoice.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.closeVoice0.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.hideWing.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.hideCH.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.hideTX.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.hideXW.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.hideFZ.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.hideTL.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.hideSH.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.hideOtherPaler.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.combat1.addEventListener(egret.Event.CHANGE, this.onChange, this);
        this.combat2.addEventListener(egret.Event.CHANGE, this.onChange, this);
    }

    public OnOpen(...param: any[]) {
        this.commonDialog.OnAdded(this)

        this.commonDialog.title = '系统设置'
        this.closeVoice.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SY)
        this.closeVoice0.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_YX)
        this.hideWing.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_CB)
        this.hideCH.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_CH)
        this.hideTX.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_TX)
        this.hideXW.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW)
        this.hideFZ.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_FZ)
        this.hideTL.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_TL)
        this.hideSH.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SH)
        this.hideOtherPaler.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER)
        this.combat2.selected = SystemSettingPanel.GetSpeed() > 1
        this.combat1.selected = !this.combat2.selected
    }

    public static ShowOther() {
        GameGlobal.RaidMgr.mMapRaid.IsShowOther(!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER))
    }

    private onChange(event: egret.TouchEvent) {
        switch (event.target) {
            case this.closeVoice:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_SY, this.closeVoice.selected)
                GameGlobal.SoundManager.SetBgOn(!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SY))
                break
            case this.closeVoice0:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_YX, this.closeVoice0.selected)
                break
            case this.hideWing:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_CB, this.hideWing.selected)
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_CB)
                break
            case this.hideCH:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_CH, this.hideCH.selected)
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_CH)
                break
            case this.hideTX:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_TX, this.hideTX.selected)
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_TX)
                break
            case this.hideXW:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW, this.hideXW.selected)
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_XW)
                break
            case this.hideFZ:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_FZ, this.hideFZ.selected)
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_FZ)
                break
            case this.hideTL:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_TL, this.hideTL.selected)
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_TL)
                break
            case this.hideSH:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_SH, this.hideSH.selected)
                GameGlobal.RaidMgr.UpdateSetting(FuncOpenModel.SAVE_SYSTEM_SETTING_SH)
                break
            case this.hideOtherPaler:
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER, this.hideOtherPaler.selected)
                SystemSettingPanel.ShowOther()
                break
            case this.combat1:
                this.combat2.selected = !this.combat1.selected;
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, this.combat2.selected)
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, false)
                break
            case this.combat2:
                this.combat1.selected = !this.combat2.selected;
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, this.combat2.selected)
                FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, false)
                break
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_CHANGE_SYSTEM_SETTING);
    }

    public static ChangeShowOther(val: boolean) {
        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER, val)
        SystemSettingPanel.ShowOther()
    }

    public OnClose() {
        this.commonDialog.OnRemoved()
    }
}