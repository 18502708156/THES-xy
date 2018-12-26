class ActivityBaseData implements IActivityBaseData {

	startTime: number
	endTime: number
	openState: number
	id: number
	type: number
	/**奖励领取 状态记录，支持数组和数字两种方式
	 *如果是数组 # 1 名额已满 2 名额未满未达成 3 已达成可领取未领取 4 已领取
	 */
	record: number | number[]

	public UpdateBase(rsp: Sproto.activity_base_type) {
		this.startTime = rsp.startTime
		this.endTime = rsp.endTime
		this.openState = rsp.openState
		this.id = rsp.id
		this.type = rsp.type
	}

	update(data) { 

	}

	public hasReward(): boolean {
		if (!this.isOpenActivity()) {
			return false;
		}
		let arr = this.GetConfig();
		let i: number;
		let len: number = arr.length;
		for (i = 0; i < len; i++) {
			if (this.canGetRecordByIndex(i + 1)) {
				return true;
			}
		}
		return false;
	}

	// 所以的都已经领取
	public AllGotten(): boolean {
		// return false
		let data = this.record
		if (!data) {
			return false
		}
		let arr = this.GetConfig();
		let len: number = arr.length;
		for (let i = 0; i < len; i++) {
			if (data[i] != 4) {
				return false
			}
		}
		return true
	}

	public GetRecordByIndex(index: number): boolean {
		if (this.record instanceof Array) {
			return this.record[index - 1] == 4
		}
		return (this.record & (1 << index)) > 0
	}

	/**如果是数组，子类一般不需要重写 */
	public canGetRecordByIndex(index: number): boolean {
		if (!this.isOpenActivity()) {
			return false;
		}
		if (this.record instanceof Array) {
			if (this.record[index - 1] != 3) {
				return false;
			}
		} else {
			return false
		}
		return !this.GetRecordByIndex(index);
	}

	isOpenActivity(): boolean {
		return this.isOpenTime()
	}

	init() { }

	// static sort(e, t) {
	// 	return e.state == RewardState.CanGet && t.state != RewardState.CanGet ? -1 : e.state != RewardState.CanGet && t.state == RewardState.CanGet ? 1 : e.state == RewardState.Gotten && t.state != RewardState.Gotten ? 1 : e.state != RewardState.Gotten && t.state == RewardState.Gotten ? -1 : e.index < t.index ? -1 : e.index > t.index ? 1 : 0
	// }

	getRemindTimeString() {
		var self = this
		let startTime = Math.floor(self.startTime - GameServer.serverTime)
		let endTime = Math.max(Math.floor(self.endTime - GameServer.serverTime), 0)
		if (startTime >= 0) return "活动未开启";
		if (0 >= endTime) return "活动已结束";
		if (endTime * 1000 < DateUtils.MS_PER_DAY) {
			return `倒计时：|C:${Color.GetStr(Color.l_green_1)}&T:${DateUtils.format_1(endTime * 1000)}|`
		}
		return `倒计时：|C:${Color.GetStr(Color.l_green_1)}&T:${ActivityBaseData.GetTimeStr(endTime)}|`
	}

	public static GetTimeStr(time: number): string {
		let d = Math.floor(time / 86400)
		let h = Math.floor(time % 86400 / 3600)
		let m = Math.floor(time % 3600 / 60)
		return d + "天" + h + "小时" + m + "分";
	}

	/**活动开启显示时间 */
	public isOpenTime(): boolean {
		if (this.endTime == 0) {
			return true
		}
		return this.startTime < GameServer.serverTime && (this.endTime + this.delayCloseActivityTime()) > GameServer.serverTime
	}

	public GetSurplusTimeStr(): string {
		return `剩余时间：${this.getRemindTimeString()}`
	}

	public GetConfig(): any {
		return GameGlobal.Config["ActivityType" + this.type + "Config"][this.id];
	}

	/**客户端延迟消失的秒数 */
	private delayCloseActivityTime(): number {
		let cfg = GameGlobal.Config.ActivityConfig[this.id];
		if (!cfg) {
			return 0
		}
		if (cfg.closetime) {
			return cfg.closetime * 3600
		}
		return 0
	}
}