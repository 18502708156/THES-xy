class TsumKoModel extends TeamBaseModel {

	public btnSign0=true;
	public btnSign1=true;


	public constructor() {
		super(UserFb.FB_TYPE_LIFE_DEATH_PLUNDER);
	}

	protected CheckEnter(id: number): boolean {
		return true
	}
}