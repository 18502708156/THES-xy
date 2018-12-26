class HavingReikiPanel extends RoleRidePanel {

    public static NAME = "灵气"

    public constructor() {
        super()
        this.mModel = GameGlobal.HavingLingqModel
        this.mModelRedPoint = GameGlobal.HavingLingqModel.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.tiannv_nimbus
    }

    public childrenCreated() {
        super.childrenCreated()
        this.btnSkin.visible = false;

    }

    public static RedPointCheck(): boolean {
        return GameGlobal.HavingLingqModel.mRedPoint.IsRedPoint()
    }
}