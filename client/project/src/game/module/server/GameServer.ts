class GameServer {

	public static ETNER_GAME_TIME: number

	private static _serverTime: number = 0;
	public static serverOpenDay: number;
	public static loginDay: number = 1
	public static mergeDay: number = 0

	public static mOtherLogin = false

	public constructor() {
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_base_open_day, this.doGetOpenServer, this);
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_base_game_time, this.doServerTime, this);
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_base_replace_account, this._DoBaseReplaceAccount, this);
	}
	
	/** 获取服务器当前时间从1970年开始的(即时)(秒) */
	public static get serverTime() {
		return GameServer._serverTime + Math.floor(egret.getTimer() * 0.001)
	}
	/** 服务器毫秒数 */
	public static get serverTimeMilli() {
		return GameServer._serverTime  * 1000 + egret.getTimer()
	}

	public static setServerTime(t: number) {
		GameServer._serverTime = t - Math.floor(egret.getTimer() * 0.001)

		if (!GameServer.ETNER_GAME_TIME) {
			GameServer.ETNER_GAME_TIME = GameServer._serverTime
		}

		this.updateTheDayEndTime();
	}
	
	private static _dayEndTime: number
	public static _dayEnd2Time: number
	public static _dayEnd3Time: number

	/**当天结束时刻的毫秒数 */
	private static updateTheDayEndTime(): void
	{
		let date: Date = new Date(GameServer.serverTimeMilli);
		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(59);
		this._dayEndTime = date.getTime() 

		let date2 = new Date(GameServer.serverTimeMilli)
		date2.setDate(date2.getDate() + 1)
		date2.setHours(23);
		date2.setMinutes(59);
		date2.setSeconds(59);
		this._dayEnd2Time = date2.getTime()
		
		let date3 = new Date(GameServer.serverTimeMilli)
		date3.setDate(date3.getDate() + 2)
		date3.setHours(23);
		date3.setMinutes(59);
		date3.setSeconds(59);
		this._dayEnd3Time = date3.getTime()
	}
	public static get dayEndTime(): number
	{
		return this._dayEndTime
	}

	private doGetOpenServer(bytes: Sproto.sc_base_open_day_request) {
		let oldDay = GameServer.serverOpenDay

		GameServer.serverOpenDay = bytes.day
		GameServer.loginDay = bytes.loginDay
		GameServer.updateTheDayEndTime();

		GameGlobal.MessageCenter.dispatch(MessageDef.GAME_SERVER_UPDATE_DAY)
		Deblocking.Update(Deblocking.CHECK_TYPE_04)

		if (oldDay && oldDay != GameServer.serverOpenDay) {
			GameGlobal.OnDayTimer()
		}
		
	}

	private doServerTime(bytes: Sproto.sc_base_game_time_request) {
		GameServer.setServerTime(bytes.time);
	}

	public static GetSurplusTime(timestamp: number, format: number = DateUtils.TIME_FORMAT_5, showLength: number = 2) {
		let t = Math.max(0, (timestamp || 0) - this.serverTime)
		return DateUtils.getFormatBySecond(t, format, showLength)
	}

	public static GetPkTime(timestamp: number, format: number = DateUtils.TIME_FORMAT_11, showLength: number = 2) {
		let t = Math.max(0, (timestamp || 0) - this.serverTime)
		return DateUtils.getFormatBySecond(t, format, showLength)
	}

	public static GettreeTime(timestamp: number, format: number = DateUtils.TIME_FORMAT_11, showLength: number = 3) {
		let t = Math.max(0, (timestamp || 0) - this.serverTime)
		return DateUtils.getFormatBySecond(t, format, showLength)
	}

	public static Redbag(timestamp: number, format: number = DateUtils.TIME_FORMAT_15, showLength: number = 3) {
		let t = Math.max(0, (timestamp || 0))
		return DateUtils.getFormatBySecond(t, format, showLength)	
	}

	public static JfShow(timestamp: number, format: number = DateUtils.TIME_FORMAT_9, showLength: number = 3) {
		let t = Math.max(0, (timestamp || 0))
		return DateUtils.getFormatBySecond(t, format, showLength)	
	}

	public static PanTaoHui(timestamp: number, format: number = DateUtils.TIME_FORMAT_2, showLength: number = 3) {
		let t = Math.max(0, (timestamp || 0))
		return DateUtils.getFormatBySecond(t, format, showLength)	
	}

	public static JieHun(timestamp: number, format: number = DateUtils.TIME_FORMAT_14, showLength: number = 3) {
		let t = Math.max(0, (timestamp || 0))
		return DateUtils.getFormatBySecond(t, format, showLength)	
	}

	public static IsMerge(): boolean {
		return this.mergeDay > 0
	}

	private _DoBaseReplaceAccount() {
		GameServer.mOtherLogin = true
		alert("你的账号在其它地方登陆")
		LocationProperty.Reload()
	}
}