class HavingHuanPanel extends RoleRidePanel {

	public static NAME = "花辇"

    public constructor() {
        super()
        this.mModel = GameGlobal.HavingHuanModel
        this.mModelRedPoint = GameGlobal.HavingHuanModel.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.tiannv_flower
    }

     public childrenCreated() {
        super.childrenCreated()
		this.btnSkin.visible = false;
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.HavingHuanModel.mRedPoint.IsRedPoint()
    }
}