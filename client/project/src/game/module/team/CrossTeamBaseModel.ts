class CrossTeamBaseModel extends TeamBaseModel {
	public index=-1;
	public constructor(type: number) {
		super(type)
	}

	public IsFirst(key: number) {
		return true
	}

	public IsNotEnter(id: number) :string {
		return ""
	}
}