class DateUtils {

	/**
	 * 格式化字符串，返回时间戳
	 * xx:xx:xx
	 */
	public static FormatTimeString(str: string): number {
		if (!str) {
			return 0
		}
		let arr = str.split(":")
		let h = arr[0] || 0
		let m = arr[1] || 0
		let s = arr[2] || 0
		let date = new Date(GameServer.serverTime * 1000)
		date.setHours(Number(h), Number(m), Number(s))
		return date.getTime()
	}

	/**
		 * 把MiniDateTime转化为距离1970-01-01的毫秒数
		 * @param mdt 从2010年开始算起的秒数
		 * @return 从1970年开始算起的毫秒数
		 */
	public static formatMiniDateTime(mdt) {
		return DateUtils.MINI_DATE_TIME_BASE + (mdt & 0x7FFFFFFF) * DateUtils.MS_PER_SECOND;
	};
	/**转成服务器要用的时间***/
	public static formatServerTime(time) {
		return (time - DateUtils.MINI_DATE_TIME_BASE) / DateUtils.MS_PER_SECOND;
	};

	public static GetFormatSecond(time: number, type: number = 1): string {
		return DateUtils.getFormatBySecond(time, type)
	}
	
    /**
     * 根据秒数格式化字符串
     * @param  {number} second			秒数
     * @param  {number=1} type			时间格式类型（参考DateUtils.TIME_FORMAT_1, DateUtils.TIME_FORMAT_2...)
     * @param  {showLength}	showLength	显示长度（一个时间单位为一个长度，且仅在type为DateUtils.TIME_FORMAT_5的情况下有效）
     * @returns string
     */
	public static getFormatBySecond(second, type: number = 1, showLength: number = 2) {
		var str = "";
		var ms = second * 1000;
		switch (type) {
			case this.TIME_FORMAT_1:
				str = this.format_1(ms);
				break;
			case this.TIME_FORMAT_2:
				str = this.format_2(ms);
				break;
			case this.TIME_FORMAT_3:
				str = this.format_3(ms);
				break;
			case this.TIME_FORMAT_4:
				str = this.format_4(ms);
				break;
			case this.TIME_FORMAT_5:
				str = this.format_5(ms, showLength);
				break;
			case this.TIME_FORMAT_6:
				str = this.format_6(ms);
				break;
			case this.TIME_FORMAT_7:
				str = this.format_7(ms);
				break;
			case this.TIME_FORMAT_8:
				str = this.format_8(ms);
				break;
			case this.TIME_FORMAT_9:
				str = this.format_9(ms);
				break;
			case this.TIME_FORMAT_11:
				str = this.format_11(ms);
				break;	
			case this.TIME_FORMAT_14:
				str = this.format_14(ms);
				break;
			case this.TIME_FORMAT_15:
				str = this.format_15(ms);
				break;		
			// case this.TIME_FORMAT_10:
			// 	str = this.format_10(ms);
			// 	break;
		}
		return str;
	};
    /**
     * 格式1  00:00:00
     */
	public static format_1(ms) {
		var n = 0;
		var result = "##:##:##";
		n = Math.floor(ms / DateUtils.MS_PER_HOUR);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		if (n)
			ms -= n * DateUtils.MS_PER_HOUR;
		n = Math.floor(ms / DateUtils.MS_PER_MINUTE);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		if (n)
			ms -= n * DateUtils.MS_PER_MINUTE;
		n = Math.floor(ms / 1000);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		return result;
	};
    /**
     * 格式2  yyyy-mm-dd h:m:s
     */
	public static format_2(ms) {
		ms -= this.TIME_ZONE_OFFSET; //返回的是本地时间，中国位于东八区，要处理时区偏移
		var date = new Date(ms);
		var year = date.getFullYear();
		var month = date.getMonth() + 1; //返回的月份从0-11；
		var day = date.getDate();
		var hours = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
	};
    /**
     * 格式3  00:00
     */
	public static format_3(ms) {
		var str = this.format_1(ms);
		var strArr = str.split(":");
		return strArr[1] + ":" + strArr[2];
	};
    /**
     * 格式4  xx天前，xx小时前，xx分钟前
     */
	public static format_4(ms) {
		if (ms < this.MS_PER_HOUR) {
			return Math.floor(ms / this.MS_PER_MINUTE) + "分钟前";
		}
		else if (ms < this.MS_PER_DAY) {
			return Math.floor(ms / this.MS_PER_HOUR) + "小时前";
		}
		else {
			return Math.floor(ms / this.MS_PER_DAY) + "天前";
		}
	};
    
	    /**
     * 格式5 X天X小时X分X秒
     * @param  {number} ms				毫秒
     * @param  {number=2} showLength	显示长度（一个时间单位为一个长度）
     * @returns string
     */
	public static format_5(ms, showLength = 2): string {
		return this.FormatType5(ms, showLength, null)
	};

	public static format_12(ms, showLength = 2): string {
		var result = "";
		if (showLength >= 4) {
			let d = Math.floor(ms / this.MS_PER_DAY);
			if (d > 0) {
				ms -= d * this.MS_PER_DAY;
				result += (result.length > 0 ? this.formatTimeNum(d) : d) + "天"
			}
		}
		if (showLength >= 3) {
			let h = Math.floor(ms / this.MS_PER_HOUR);
			if (h > 0) {
				ms -= h * this.MS_PER_HOUR;
				result += (result.length > 0 ? this.formatTimeNum(h) : h) + "小时"
			}
		}
		let m = Math.floor(ms / this.MS_PER_MINUTE);
		if (m > 0) {
			ms -= m * this.MS_PER_MINUTE;
			result += (result.length > 0 ? this.formatTimeNum(m) : m) + "分"
		}
		return result;
	};
	public static format_13(ms, showLength = 2): string {
		return this.FormatType5(ms, showLength, ":")
	};

	private static FormatType5(ms, showLength = 2, typeStr = null) {
		var result = "";
		if (showLength >= 4) {
			let d = Math.floor(ms / this.MS_PER_DAY);
			if (d > 0) {
				ms -= d * this.MS_PER_DAY;
				result += (result.length > 0 ? this.formatTimeNum(d) : d) + (typeStr ? typeStr : "天")
			}
		}
		if (showLength >= 3) {
			let h = Math.floor(ms / this.MS_PER_HOUR);
			if (h > 0) {
				ms -= h * this.MS_PER_HOUR;
				result += (result.length > 0 ? this.formatTimeNum(h) : h) + (typeStr ? typeStr : "小时")
			}
		}
		if (showLength >= 2) {
			let m = Math.floor(ms / this.MS_PER_MINUTE);
			if (m > 0) {
				ms -= m * this.MS_PER_MINUTE;
				result += (result.length > 0 ? this.formatTimeNum(m) : m) + (typeStr ? typeStr : "分")
			}
		}
		let s = Math.floor(ms / 1000);
		result += this.formatTimeNum(s) + (typeStr ? "" : "秒")

		return result;
	}

	// public static format_5(ms, showLength = 2): string {
	// 	var result = "";
	// 	var unitStr = ["天", "小时", "分", "秒"];
	// 	var arr = [];
	// 	var d = Math.floor(ms / this.MS_PER_DAY);
	// 	arr.push(d);
	// 	ms -= d * this.MS_PER_DAY;
	// 	var h = Math.floor(ms / this.MS_PER_HOUR);
	// 	arr.push(h);
	// 	ms -= h * this.MS_PER_HOUR;
	// 	var m = Math.floor(ms / this.MS_PER_MINUTE);
	// 	arr.push(m);
	// 	ms -= m * this.MS_PER_MINUTE;
	// 	var s = Math.floor(ms / 1000);
	// 	arr.push(s);
	// 	for (var k in arr) {
	// 		if (arr[k] > 0) {
	// 			result += this.formatTimeNum(arr[k]) + unitStr[k];
	// 			showLength--;
	// 			if (showLength <= 0)
	// 				break;
	// 		}
	// 	}
	// 	return result;
	// };
    /**
     * 格式6  h:m:s
     * @param  {number} ms		毫秒
     * @returns string			返回自1970年1月1号0点开始的对应的时间点（不包含年月日）
     */
	public static format_6(ms) {
		ms -= this.TIME_ZONE_OFFSET; //返回的是本地时间，中国位于东八区，要处理时区偏移
		var date = new Date(ms);
		var hours = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		return this.formatTimeNum(hours) + ":" + this.formatTimeNum(minute) + ":" + this.formatTimeNum(second);
	};
    /**
     * 格式7  X天/X小时/<1小时
     * @param  {number} ms		毫秒
     * @returns string
     */
	public static format_7(ms) {
		if (ms < this.MS_PER_HOUR) {
			return "&lt;1小时";
		}
		else if (ms < this.MS_PER_DAY) {
			return Math.floor(ms / this.MS_PER_HOUR) + "小时";
		}
		else {
			return Math.floor(ms / this.MS_PER_DAY) + "天";
		}
	};
    /**
     * 格式8  yyyy-mm-dd h:m
     * @param  {number} ms		毫秒
     * @returns string			返回自1970年1月1号0点开始的对应的时间点（不包含秒）
     */
	public static format_8(ms) {
		ms -= this.TIME_ZONE_OFFSET; //返回的是本地时间，中国位于东八区，要处理时区偏移
		var date = new Date(ms);
		var year = date.getFullYear();
		var month = date.getMonth() + 1; //返回的月份从0-11；
		var day = date.getDate();
		var hours = date.getHours();
		var minute = date.getMinutes();
		return year + "-" + month + "-" + day + " " + hours + ":" + minute;
	};

	public static format_14(ms: number) {
		var date = new Date(ms || 0);
		var year = date.getFullYear();
		var month = date.getMonth() + 1; //返回的月份从0-11；
		var day = date.getDate();
		var hours = date.getHours();
		var minute = date.getMinutes();
		return year + "年" + month + "月" + day + "日"
	}

	public static format_15(ms: number) {
		var date = new Date(ms || 0);
		var year = date.getFullYear();
		var month = date.getMonth() + 1; //返回的月份从0-11；
		var day = date.getDate();
		var hours = date.getHours();
		var minute = date.getMinutes();
		return year + "-" + month + "-" + day
	}

	public static format_16(time: number, showM?: boolean): string {
		let str
		if (time >= DateUtils.MS_PER_DAY) {
			let d = Math.floor(time / DateUtils.MS_PER_DAY)
			let h = Math.floor(time % DateUtils.MS_PER_DAY / DateUtils.MS_PER_HOUR)
			str = d + "天" + h + "时" 
			if (showM)
			{
				let m = Math.floor(time % DateUtils.MS_PER_HOUR / 60)
				str += m + "分"
			}	
			return str
		}else
		{
			return this.format_1(time)
		}
		
	}

	public static format_17(time: number): string {
		let str
		if (time >= DateUtils.MS_PER_DAY) {
			let d = Math.floor(time / DateUtils.MS_PER_DAY)
			let h = Math.floor(time % DateUtils.MS_PER_DAY / DateUtils.MS_PER_HOUR)
			let m = Math.floor(time % DateUtils.MS_PER_HOUR / DateUtils.MS_PER_MINUTE)
			let s = Math.floor(time % DateUtils.MS_PER_MINUTE / DateUtils.MS_PER_SECOND)
			str = d + "天" + h + "时" + m + "分" + s + "秒"	
			return str
		}else
		{
			return this.format_1(time)
		}
		
	}

    /**
     * 格式9  x小时x分钟x秒
     * @param  {number} ms		毫秒
     * @returns string
     */
	public static format_9(ms) {
		var h = Math.floor(ms / this.MS_PER_HOUR);
		ms -= h * this.MS_PER_HOUR;
		var m = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		var s = Math.floor(ms / 1000);
		return h + "小时" + m + "分钟" + s + "秒";
	};

	//格式 h:m:s
	public static format_11(ms,fixation = true,dibit = false) {
			var h = Math.floor(ms / this.MS_PER_HOUR);
			ms -= h * this.MS_PER_HOUR;
			var m = Math.floor(ms / this.MS_PER_MINUTE);
			ms -= m * this.MS_PER_MINUTE;
			var s = Math.floor(ms / 1000);
			let hstr = h < 10?dibit?"0" + h:h:h
			let mstr = m < 10?dibit?"0" + m:m:m
			let sstr = s < 10?dibit?"0" + s:s:s
			if(fixation)
			{
				
				return hstr + ":" + mstr + ":" + sstr;
			}else {
				if(h == 0)
				{
					return mstr + ":" + sstr;
				}
			}
			
		};
    /**
     * 格式化时间数为两位数
     * @param  {number} t 时间数
     * @returns String
     */
	public static formatTimeNum(t) {
		return t >= 10 ? t.toString() : "0" + t;
	};

	private static m_StrToDate: {[key: string]: Date} = {}

	public static StrToDate(str: string): Date {
		if (str == null) {
			return null
		}
		if (this.m_StrToDate[str]) {
			return this.m_StrToDate[str]
		}
		try {
			let array = str.split("-")	
			if (array) {
				let day = array[0]
				let time = array[1]
				var tempDate = new Date(0)
				if (day) {
					let ymd = day.split('.')
					if (ymd) {
						if (ymd[0]) {
							tempDate.setFullYear(Number(ymd[0]))
						}
						if (ymd[1]) {
							tempDate.setMonth(Number(ymd[1]) - 1)
						}
						if (ymd[2]) {
							tempDate.setDate(Number(ymd[2]))
						}
					}
				}
				if (time) {
					let hms = time.split(":")
					if (hms) {
						if (hms[0]) {
							tempDate.setHours(Number(hms[0]))
						}
						if (hms[1]) {
							tempDate.setMinutes(Number(hms[1]))
						}
						if (hms[2]) {
							tempDate.setSeconds(Number(hms[2]))
						}
					}
				}
				this.m_StrToDate[str] = tempDate
				return tempDate
			}
		} catch (e) {

		}
		console.log("invalid date => " + str)
		return null
	}

	public static GetDay(date: Date): number {
		return date.getDay() == 0 ? 7 : date.getDay()
	}

	public static getGMT8Date(times):Date
	{
		let newDate = new Date(times);
		let GMT8 = -480;
		let deffValue
		deffValue = (GMT8 - newDate.getTimezoneOffset()) * DateUtils.MS_PER_MINUTE
		newDate = new Date(times - deffValue)
		return newDate
	}
	/**当天时间点对比 返回<0表示还没有到，0，表示正好到， >0表示已经超过 */
	public static compareOneDayTime(timeStr,h,m,s?):number
	{
		let timeArr = timeStr.split(":");

		let h1 = timeArr[0]
		let m1 = timeArr[1]
		let s1 = timeArr.length == 3? timeArr[2]:0
		let T1 = parseInt(this.formatTimeNum(h) + this.formatTimeNum(m) + this.formatTimeNum(s||0));
		let T2 = parseInt(this.formatTimeNum(h1) + this.formatTimeNum(m1) + this.formatTimeNum(s1||0));
		return T1 - T2
	}

	/**00:00:00 */
	public static TIME_FORMAT_1 = 1;
	/**yyyy-mm-dd h:m:s */
	public static TIME_FORMAT_2 = 2;
	/**00:00 */
	public static TIME_FORMAT_3 = 3;
	/**xx天前/xx小时前/xx分钟前 */
	public static TIME_FORMAT_4 = 4;
	/**x天x小时x分x秒 */
	public static TIME_FORMAT_5 = 5;
	/*h:m:s */
	public static TIME_FORMAT_6 = 6;
	/**xx天/xx小时/<1小时 */
	public static TIME_FORMAT_7 = 7;
	/**yyyy-mm-dd h:m */
	public static TIME_FORMAT_8 = 8;
	/**x小时x分钟x秒 */
	public static TIME_FORMAT_9 = 9;
	/**x小时x分钟x秒 */
	public static TIME_FORMAT_11 = 11;
	public static TIME_FORMAT_14 = 14;
	public static TIME_FORMAT_15 = 15;
	public static DAYS_OF_WEEK = 7;
	public static HOURS_PER_DAY = 24;
	public static SECONDS_PER_HOUR = 3600;
	public static MS_PER_SECOND = 1000;
	public static MS_PER_MINUTE = 60 * 1000;
	public static MS_PER_HOUR = 60 * 60 * 1000;
	public static MS_PER_DAY = 24 * 60 * 60 * 1000;
	public static MS_PER_MONTH = 30 * DateUtils.MS_PER_DAY;
	public static MS_PER_YEAR = 12 * DateUtils.MS_PER_MONTH;
	public static MINI_DATE_TIME_BASE = Date.UTC(2010, 0) + new Date().getTimezoneOffset() * DateUtils.MS_PER_MINUTE;
	public static TIME_ZONE_OFFSET = 0
}