class FormationInfo {

	public mFormationId: number
	public mSkillId: number
	public mLevel: number
	public mUpNum: number
	public mSoulLv: number
	public mSoulUpNum: number

	

	public UpdateInfo(info: Sproto.formation_data) {
		this.mFormationId = info.no
		this.mSkillId = info.skillNo
		this.mLevel = info.lv
		this.mUpNum = info.upNum
		this.mSoulLv = info.soulLv
		this.mSoulUpNum = info.soulUpNum
	}

	public UpdateExp(info: Sproto.cs_formation_add_exp_response) {
		this.mLevel = info.lv
		this.mUpNum = info.upNum
	}

	public UpdateSoulExp(info: Sproto.cs_formation_soul_add_exp_response) {
		this.mSoulLv = info.soulLv
		this.mSoulUpNum = info.soulUpNum
	}
}
