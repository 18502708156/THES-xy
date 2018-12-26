class PetShouhPanel extends RoleTemplatePanel {

    public static NAME = "兽魂"
    protected mHasDress = false
    public mWindowHelpId = 10

    public constructor() {
        super()
        this.mModel = GameGlobal.PetShouhModel
        this.mModelRedPoint = GameGlobal.PetShouhModel.mRedPoint
        this.m_activityJiJieId = ActivityKaiFuJiJieType.pet_psychic
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.PetShouhModel.mRedPoint.IsRedPoint()
    }

    public static openCheck(...param: any[]) {
        return Deblocking.Check(DeblockingType.TYPE_14)
    }

    
}