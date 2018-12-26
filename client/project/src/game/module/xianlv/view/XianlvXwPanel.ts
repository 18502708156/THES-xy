class XianlvXwPanel extends RoleTemplatePanel {

    public static NAME = "仙位"
    mWindowHelpId?: number = 7
    protected mHasDress = false
    protected help: eui.Button;
    public constructor() {
        super()
        this.mModel = GameGlobal.XianlvXwModel
        this.mModelRedPoint = GameGlobal.XianlvXwModel.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.xianlv_circle
    }

    public childrenCreated() {
        super.childrenCreated()
        // this.SetEquipIconList(RoleRidePanel.EQUIP_ICON)
        this._AddClick(this.help, this._click)

    }

    public static RedPointCheck(): boolean {
        return GameGlobal.XianlvXwModel.mRedPoint.IsRedPoint()
    }

    public _click() {
        ViewManager.ins().open(ActivityDescPanel, 7, "规则说明");
    }

    public static openCheck(...param: any[]) {
        return Deblocking.Check(DeblockingType.TYPE_18)
    }
}