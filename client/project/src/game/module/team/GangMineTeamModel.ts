class GangMineTeamModel extends TeamBaseModel {

	public constructor() {
		super(UserFb.FB_TYPE_GANGMINE);
	}

	protected CheckEnter(id: number): boolean {
		return true
	}
}