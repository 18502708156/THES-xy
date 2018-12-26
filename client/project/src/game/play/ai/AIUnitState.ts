class AIUnitStateType {
	static readonly STAND = "STAND"
	static readonly Die = "Die"
	static readonly RUN = "RUN"
	static readonly BORN = "BORN"
	static readonly Atk = "Atk"
	static readonly HIT = "HIT"
	static readonly PROTECT = "BLOCK"

	static readonly FIND_NEXT_POS = "FIND_NEXT_POS"
}

interface IAIUnitState {
	mAIUnitArgs: AIUnitArgs
	Init(unit: AIUnit): void
	OnUpdate(delta: number): void
	OnEnter(): void
	OnExit(): void
}

class AIUnitState implements IAIUnitState {

	public mUnit: AIUnit
	public mAIUnitArgs: AIUnitArgs

	public mType: string
	public mIndex: number = 0
	public mAction: AIUnitAction[] = []

	public mIsEnter: boolean = false

	public constructor() {
		this.mAIUnitArgs = new AIUnitArgs
	}

	public ClearOtherAnim() {
		
	}

	public PlayHit(): number {
		return 0
	}

	public PlayEvade(): number {
		return 0
	}

	public Init(unit: AIUnit): void {
		this.mIndex = 0
		this.mUnit = unit
		for (let action of this.mAction) {
			action.Init(this)
		}
	}

	OnUpdate(delta: number): void {
		let action = this.mAction[this.mIndex]
		if (!action) {
			this.mUnit.StateEndEvent(this.mType)
			return
		}
		let ret = action.OnUpdate(delta)
		if (ret == AIUnitReturn.BREAK) {
			this.mUnit.StateEndEvent(this.mType)
			return
		}
		if (ret == AIUnitReturn.NEXT) {
			action.OnExit()
			let nextAction = this.mAction[++this.mIndex]
			if (nextAction) {
				nextAction.OnEnter()
			} else {
				this.mUnit.StateEndEvent(this.mType)
			}
		}
	}

	OnEnter(): void {
		this.mIndex = 0
		let action = this.mAction[this.mIndex]
		if (action) {
			action.OnEnter()
		}
	}

	OnExit(): void {
		let action = this.mAction[this.mIndex]
		if (action) {
			action.OnExit()
		}
	}
}