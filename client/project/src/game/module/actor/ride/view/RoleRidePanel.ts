class RoleRidePanel extends RoleTemplatePanel {

    public static NAME = "坐骑"

    public mWindowHelpId: number = 1

    protected mHasDress = true

    public constructor() {
        super()
        this.mModel = GameGlobal.UserRide
        this.mModelRedPoint = GameGlobal.UserRide.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.ride
    }

    // 引导对象
    public GetGuideTarget() {
        return {
            [1]: this.btnCulture,
            [2]: this.btnAuto,
        }
    }


    public static RedPointCheck(): boolean {
        return GameGlobal.UserRide.mRedPoint.IsRedPoint()
    }

}

interface RideMiniItem extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // RideMiniItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    item: ItemBaseNotName;
    /////////////////////////////////////////////////////////////////////////////


}

