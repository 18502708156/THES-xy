class XianlvFzPanel extends RoleTemplatePanel {

    public static NAME = "法阵"
    mWindowHelpId?: number = 6
    protected mHasDress = false
    protected help: eui.Button;
    public constructor() {
        super()
        this.mModel = GameGlobal.XianlvFzModel
        this.mModelRedPoint = GameGlobal.XianlvFzModel.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.xianlv_position
    }

    public childrenCreated() {
        super.childrenCreated()
        // this.SetEquipIconList(RoleRidePanel.EQUIP_ICON)
        this._AddClick(this.help, this._click)

    }

    public static RedPointCheck(): boolean {
        return GameGlobal.XianlvFzModel.mRedPoint.IsRedPoint()
    }

    public _click() {
        ViewManager.ins().open(ActivityDescPanel, 6, "规则说明");
    }

    public static openCheck(...param: any[]) {
        return Deblocking.Check(DeblockingType.TYPE_17)
    }
}