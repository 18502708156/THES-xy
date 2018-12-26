class EntityEffData {

	// private static m_List: EntityEffData[] = []
	private static m_List: EntityEffData = new EntityEffData

	public mSkillData: any[]
	public mSourceHandle: number
	public mTargetX: number
	public mTargetY: number

	public mSelfDir: number
	public mSelfX: number
	public mSelfY: number

	public static Get(skillData: any[], sourceHandle: number, targetX: number, targetY: number, selfDir: number, selfX: number, selfY: number): EntityEffData {
		let data = this.m_List//.pop() || new EntityEffData
		data.mSkillData = skillData
		data.mSourceHandle = sourceHandle
		data.mTargetX = targetX
		data.mTargetY = targetY
		data.mSelfDir = selfDir
		data.mSelfX = selfX
		data.mSelfY = selfY
		return data
	}

	// public static Set(data: EntityEffData): void {
	// 	if (!data) {
	// 		return
	// 	}
	// 	this.m_List.push(data)
	// }
}