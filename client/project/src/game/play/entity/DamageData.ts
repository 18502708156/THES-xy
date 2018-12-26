class DamageData {

	private static ins = new DamageData

	public team: number
	public x: number
	public y: number
	public type: DamageTypes
	public value: number
	public skillId: number

	public static Set(team: Team, x: number, y: number, type: DamageTypes, value: number, skillId: number): DamageData {
		this.ins.team = team
		this.ins.x = x
		this.ins.y = y
		this.ins.type = type
		this.ins.value = value
		this.ins.skillId = skillId
		return this.ins
	}
}

class DamageSourceData {

	private static list: DamageSourceData[] = []

	public team: number
	public x: number
	public y: number
	public job: JobConst
	public entityType: EntityType

	public static Get(team: Team, x: number, y: number, entityType: EntityType, job: JobConst): DamageSourceData {
		let ins = this.list.pop() || new DamageSourceData
		ins.team = team
		ins.x = x
		ins.y = y
		ins.job = job
		ins.entityType = entityType
		return ins
	}

	public static Set(data: DamageSourceData): void {
		this.list.push(data)
	}
}