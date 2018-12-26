class CatchPetSUnitSkill {
    public mSkillId: number

    private m_SkillConfig: any[]
    public mTargets: number[] = []
    public handle: number = 0

    public constructor(skillId,handle) {
        this.mSkillId = skillId
        this.handle = handle
    }

    public Init() {
        this.m_SkillConfig = GameGlobal.Config.SkillsConfig[this.mSkillId]
    }

    public Use(targets: number[]): BUnitAction {
        this.mTargets = targets || []
        let action = new CatchSkillAction
        action.src = this.handle 
        action.skillId = this.mSkillId
        action.targets = targets
        let event = []
        if (targets) {         
            let actions = this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.actions]
            let list: BUseSkillAtkAction[] = []
            for (let dt of actions) {
                let dta = this.ExecuteAction(dt,this.handle,targets)
                dta.skill = action
                list.push(dta)
            }
            action.actions = list
        } else {
            console.warn("not enm")
        }
        return action
    }

    private ExecuteAction(actionId: number,handle:number,tar): BUseSkillAtkAction {
        let atkData = new BUseSkillAtkAction
        atkData.src = handle 
        atkData.actionId = actionId
        let configData = GameGlobal.Config.SkillsExeConfig[actionId]
        if (!configData) {
            console.error("not config id => " + actionId)
            return atkData
        }
        let targets = tar
        if (!targets || targets.length == 0) {
            atkData.targets = []
            console.log("not target => " + actionId)
            return atkData
        }
        atkData.targets = tar
        let list = []
        for (let targetId of targets) {
            let tmpData = new BattleDamageBaseData
            tmpData.target = tar
            tmpData.type = 0
            tmpData.value = null
            atkData.event.push(tmpData)
        }
        return atkData
    }
}
