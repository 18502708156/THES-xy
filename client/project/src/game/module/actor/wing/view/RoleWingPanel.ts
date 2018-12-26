class RoleWingPanel extends RoleRidePanel {

    public static NAME = "翅膀"

    public constructor() {
        super()
        this.mModel = GameGlobal.UserWing
        this.mModelRedPoint = GameGlobal.UserWing.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.wing
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.UserWing.mRedPoint.IsRedPoint()
    }

}