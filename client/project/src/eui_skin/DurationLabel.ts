class DurationLabel extends eui.Component implements eui.UIComponent {

	public static TIMETEXT_TYPE_HHMMSS = 1
	public static TIMETEXT_TYPE_MMSS = 2
	public static TIMETEXT_TYPE_HHMM = 3
	public static TIMETEXT_TYPE_ONLYSS = 4
	public static TIMETEXT_TYPE_DDHH_HHMMSS = 5
	/////////////////////////////////////////////////////////////////////////////
	// DurationLabelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected label: eui.Label;
	/////////////////////////////////////////////////////////////////////////////
	private mCbFun: Function;
	private mEndTime: number;
	private mType: number;
	private mTextFormat: string

	public constructor() {
		super()
		this.skinName = 'DurationLabelSkin';
	}

	childrenCreated() {
		this.label.text = ""
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.OnRemove, this)
	}

	/*
	 *	定时器倒计时结束时的回调
	 */
	public SetCallbackFunc(fun: Function): void {
		this.mCbFun = fun;
	}

	/*
	*	time: 结束时间戳 单位为秒
	*	type: 时间文本标式 HH:MM:SS MM:SS HH:MM三种 
	*/
	public SetEndTime(time, type = DurationLabel.TIMETEXT_TYPE_HHMMSS) {
		this.mEndTime = time
		this.mType = type

		let diffTime = this.mEndTime - GameServer.serverTime
		this.label.text = this._GetText(Math.max(diffTime, 0))

		TimerManager.ins().remove(this._DoTimer, this)
		TimerManager.ins().doTimer(1000, 0, this._DoTimer, this)
	}

	/*
	*	text: 文本格式 如文本为 14:33后刷新商店  则传参为 {0}后刷新商店
	*/
	public SetTextFormat(text) {
		this.mTextFormat = text
	}

	public SetColor(color) {
		this.label.textColor = color
	}

	public SetTextSize(size) {
		this.label.size = size
	}
	/*
	*	停下定时器，一般用于 快速完成 操作，请求返回。主动停下定时器，以及回调方法的调用
	*	p.s 一般倒计时到0，会自动停下定时器回调。关闭窗口 也会停下定时器回调
	*/
	public Stop() {
		TimerManager.ins().remove(this._DoTimer, this)
	}

	private _DoTimer() {
		let diffTime = this.mEndTime - GameServer.serverTime
		if (diffTime <= 0) {
			TimerManager.ins().remove(this._DoTimer, this)
			this.label.text = ""

			if (this.mCbFun) {
				this.mCbFun()
			}
			return
		}

		this.label.text = this._GetText(diffTime)
	}

	private OnRemove() {
		TimerManager.ins().remove(this._DoTimer, this)
	}

	private _GetText(diffTime) {
		let timeText = this._GetTimeText(diffTime)
		if (this.mTextFormat) {
			return this.mTextFormat.replace("{0}", timeText)
		}

		return timeText
	}

	private _GetTimeText(diffTime) {
		if (this.mType == DurationLabel.TIMETEXT_TYPE_ONLYSS) {
			return `${diffTime}`
		}

		let hour = Math.floor(diffTime / 3600)
		let min = Math.floor(diffTime / 60) % 60
		let sec = diffTime % 60
		if (this.mType == DurationLabel.TIMETEXT_TYPE_DDHH_HHMMSS) {
			if (hour < 23)
				return `${hour}:${this._Complement(min)}:${this._Complement(sec)}`

			let day = Math.floor(hour / 24)
			hour = hour % 24
			return `${day}天${hour}时`
		}

		if (this.mType == DurationLabel.TIMETEXT_TYPE_HHMMSS) {
			return `${hour}:${this._Complement(min)}:${this._Complement(sec)}`
		}

		if (this.mType == DurationLabel.TIMETEXT_TYPE_HHMM) {
			return `${hour}:${this._Complement(min)}`
		}

		return `${this._Complement(hour * 60 + min)}:${this._Complement(sec)}`
	}

	private _Complement(num) {
		if (num <= 9)
			return `0${num}`

		return num
	}

}
