class PetTonglPanel extends RoleTemplatePanel {

    public static NAME = "通灵"
    protected mHasDress = false
    public mWindowHelpId = 9

    public constructor() {
        super()
        this.mModel = GameGlobal.PetTonglModel
        this.mModelRedPoint = GameGlobal.PetTonglModel.mRedPoint

        this.m_activityJiJieId = ActivityKaiFuJiJieType.pet_soul
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.PetTonglModel.mRedPoint.IsRedPoint()
    }

    public static openCheck(...param: any[]) {
        return Deblocking.Check(DeblockingType.TYPE_13)
    }
}