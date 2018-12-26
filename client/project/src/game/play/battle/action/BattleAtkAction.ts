class BattleAtkAction {
    public mUnit: BattleUnit

    public Init(unit: BattleUnit) {
        this.mUnit = unit
    }


    public Turn(): BUnitAction {
        let skill = this.GetUseSkill()
        if (!skill) {
            console.error("not can use skill => ")
            return
        }
        let enemyList = skill.ScanEnemy()
        return skill.Use(enemyList)
    }

    public tmpCheck = 0

	public GetUseSkill(): SUnitSkill {
        if (!this.mUnit.CanUseSkill()) {
            return null
        }
        let index = this.tmpCheck++
        for (let i = 0, len = this.mUnit.mSkill.length; i < len; i++) {
            let j = (i + index) % len
            let skill = this.mUnit.mSkill[j]
            if (!skill.IsAbilitySkill()) {
                continue
            }
            if (skill.CheckCondition()) {
                return skill
            }
        }
        return null        
	}
}
