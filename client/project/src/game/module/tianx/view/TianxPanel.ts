class TianxPanel extends RoleRidePanel {

    public static NAME = "守护"

    public constructor() {
        super()
        this.mModel = GameGlobal.TianxModel
        this.mModelRedPoint = GameGlobal.TianxModel.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.fairy
    }

    public static openCheck(...param: any[]) {
       return Deblocking.Check(DeblockingType.TYPE_27);
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.TianxModel.mRedPoint.IsRedPoint()
    }
}