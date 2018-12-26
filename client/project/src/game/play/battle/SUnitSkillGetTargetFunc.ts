abstract class SUnitSkillGetTarget {

	protected mTargets: number[] = []
	protected mArgs: any
	
	public Init(targets: number[], args: any) {
		this.mArgs = args
		CommonUtils.CopyTo(targets, this.mTargets)
	}
}

class SUnitSkillGetTarget10001 extends SUnitSkillGetTarget {

	public Get(): number[] {
		return this.mTargets
		
	}
}

class SUnitSkillGetTarget10002 extends SUnitSkillGetTarget {

	private mIndex: number = 0

	public Get(): number[] {
		return [this.mTargets[(this.mIndex++) % this.mTargets.length]]
	}
}

class SUnitSkillGetTarget10003 extends SUnitSkillGetTarget {

	public Get(): number[] {
		if (this.mTargets.length == 0) {
			return []
		}
		let index = MathUtils.limitInteger(0, this.mTargets.length - 1)
		let list = [this.mTargets[index]]
		this.mTargets.splice(index, 1)
		return list

	}
}

class SUnitSkillGetTarget10004 extends SUnitSkillGetTarget {

	public Get(): number[] {
		return MathUtils.RandomArrayData(this.mTargets, this.mArgs ? this.mArgs.count : 1)
	}
}