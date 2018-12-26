class CrossGuildInfo {

	public name: string;
	public power: number;
	public score: number;
	/** 是否战斗中*/
	public isWaring: boolean;
	/**城池状态 3 完整， 2 1 冒烟， 0 摧毁 */
	public state: number;
	/**是否属性自己方 */
	public isMySide: boolean;

	public constructor() {
		this.reset();
	}

	public reset() {
		this.name = '';
		this.power = this.score = 0;
		this.state = 3;
		this.isWaring = false;
		this.isMySide = true;
	}

	public updateInfo(data) {

	}

}
