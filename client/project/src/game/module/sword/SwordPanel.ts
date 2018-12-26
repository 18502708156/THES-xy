class SwordPanel extends RoleRidePanel {

    public static NAME = "神兵"

    public constructor() {
        super()
        this.mModel = GameGlobal.SwordModel
        this.mModelRedPoint = GameGlobal.SwordModel.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.weapon
    }

    public static openCheck(...param: any[]) {
        return Deblocking.Check(DeblockingType.TYPE_28);
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.SwordModel.mRedPoint.IsRedPoint()
    }
}