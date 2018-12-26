class CrossGuildModel extends BaseSystem {

	//========我方=========
	public myGuildName: string;
	public myGuildScore: number;
	public myGuildTotalCity: number;
	public myGuildCity: number;

	//========敌方=========
	public otherGuildName: string;
	public otherGuildScore: number;
	public otherGuildTotalCity: number;
	public otherGuildCity: number;


	/**攻城状态 3 已结束， 2 开战中， 1 倒计时结束后开战 */
	public state: number;

	public constructor() {
		super();

	}

	

}
