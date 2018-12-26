class FuliData {
	/**累计登录天数 */
	accDay = 1;

	/**下个累计天数 */
	nextGiftDay = 1;

	/**每天签到奖励id */
	dailyId = 1;

	/**每天奖励领取标记 位运算& 1为 领取 0 为未领取s */
	rewardMark = 1;

	/**等级奖励领取标记 位运算& 1为 领取 0 为未领取s */
	lvMark = 1;

	//剩余多少天 0没开通
	public month;
	public week;
	public foreverFlag;
	//已领取 0未领取
	public monthReward;
	public weekReward;
	//历练奖励 领到那个阶段1,2,3
	public welfareReward;
	//平均等级
	public avgLv;
	//玩家数据
	public rankData;

	//红包id
	public briberyID;
	//玩家名字
	public playerName;
	//有效时间
	public endtime;
	//ItemDic
	//public itemDic={};
	// public itemDataArr;

	//送十万元宝
	//累计登陆的天数
	public addDayCount;
	//已经领取的index
	public recordEdIndex;
	//是否购买过月卡 0没买过 1买过了
	public firstMonth;

	//搖錢樹
	public level;
	public exp;
	//暴擊
	public odds;
	//当天摇钱次数
	public shake;
	//索引=boxid, 值=1 名额已满 2 名额未满未达成 3 已达成可领取未领取 4 已领取
	public drawBin;
	//加成
	public amplitude;

	public IsMonth() {
		return this.month ? true : false
	}
}	