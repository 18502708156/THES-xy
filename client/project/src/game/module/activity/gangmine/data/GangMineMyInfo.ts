class GangMineMyInfo {

	/**1=采矿中，2=空闲*/
	public status: number = 0;
	/**下次进攻时间 */
	public attackTime: number = 0;
	/**连锁加成 */
	public chainrate: number = 0;
	/**下次采集时间 */
	public gatherTime: number = 0;
	/**矿脉ID */
	public mineId: number;
	/**本帮积分 */
	public score: number = 0;
	/**本帮排名 */
	public rank: number = 0;

	public updateInfo(info: Sproto.sc_guildmine_mine_mystatus_request) {
		this.status = info.status;
		this.attackTime = info.attackTime;
		this.chainrate = info.chainrate;
		this.gatherTime = info.gatherTime;
		this.mineId = info.mineId;
		this.score = info.guildScore;
		this.rank = info.guildRank;
	}
}