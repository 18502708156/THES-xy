class GangMineRankInfo {

	/**#1=当天活动，2=月度排行 */
	public rankType: number;
	/**帮派Id */
	public guildId: number = 0;
	/**服务器id */
	public serverId: number = 0;
	/**帮派名字 */
	public guildName: string;
	/**积分 */
	public score: number = 0;
	/**排名 */
	public rank: number = 0;

	public updateInfo(info: Sproto.score_info) {
		this.guildId = info.guildId;
		this.guildName = info.guildName;
		this.rank = info.rank;
		this.score = info.score;
	}

	/**获取排名奖励 */
	public getRankReward(): any[] {
		let config = GameGlobal.Config.RankRewardConfig[this.rankType][this.rank - 1];
		if(config) {
			return config.reward;
		}
		return [];
	}
}