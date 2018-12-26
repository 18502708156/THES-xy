class GangMineInfo {

	/**帮派名字 */
	public guildName: string;
	/**1=怪物守护， 2=玩家守护者， 3=怪物守护战斗中， 4=玩家守护战斗中， 5=玩家守护战斗过(不可加入)*/
	public status: number = 0;
	/**矿脉ID */
	public mineId: number;
	/**矿脉玩家守护列表 */
	public guardList: GangMineGuardInfo[];

	public updateInfo(info: Sproto.mine_info) {
		this.status = info.status;
		this.mineId = info.mineId;
		if (info.status != 1) {
			this.guildName = info.guildName;
			let i = 0, len = info.guard.length;
			let guardInfo: GangMineGuardInfo;
			this.guardList = [];
			for (i; i < len; i++) {
				guardInfo = new GangMineGuardInfo;
				guardInfo.updateInfo(info.guard[i]);
				this.guardList[i] = guardInfo;
			}
		}
	}
}

class GangMineGuardInfo {

	/**玩家职业 */
	public job: number;
	/**玩家性别 */
	public sex: number;
	/**玩家名字 */
	public name: string;
	/**玩家等级 */
	public level: number = 0;
	/**玩家战力 */
	public power: number = 0;
	/**玩家血条百分比 */
	public hp: number = 0;

	public updateInfo(info: Sproto.guard_info) {
		this.name = info.name;
		this.hp = info.hp;
		this.level = info.level;
		this.power = info.power;
		this.job = info.job;
		this.sex = info.sex;
	}
}