class IAIUnitArgs {
	
	public SetAnimName(anim: string): void {
	}

	public SetMovePos(x: number, y: number): void {
	}

	public SetTurnData(turnData: BattleAction) {
	}

	public Protect(src: number, beSrc: number) {
	}
	
	public Clear(): void {
	}
}

class AIUnitArgs extends IAIUnitArgs {
	public mAnim: string

	public SetAnimName(anim: string): void {
		this.mAnim = anim
	}

	public mEndX: number
	public mEndY: number

	public SetMovePos(x: number, y: number): void {
		this.mEndX = x
		this.mEndY = y
	}

	public mTurnData: BattleAction

	public SetTurnData(turnData: BattleAction) {
		this.mTurnData = turnData
	}

	public mBlockSrc: number
	public mBeBlockSrc: number

	public Protect(src: number, beSrc: number) {
		this.mBlockSrc = src
		this.mBeBlockSrc = beSrc
	}

	public Clear(): void {
		this.mAnim = null
		this.mEndX = null
		this.mEndY = null
	}
}

interface AIUnitAtkArgs {
	target: number
	values: number[]
	deadIndex: number
}