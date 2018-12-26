class WindowData {

	private static m_IsShow = false

	public static ShowFps(): void {
		if (this.m_IsShow) {
			return
		}
		this.m_IsShow = true
		try {
			document.querySelectorAll(".egret-player")[0]["egret-player"].player.displayFPS(true, false, null, { x: 0, y: 0, size: 12, textColor: "0xffffff", bgAlpha: 0.2 })
		} catch (e) {

		}
	}

	public static _LoginToken(callback: Function) {
		window["_LoginToken"](callback)
	}

	public static _GetServerAddr(): string {
		if (WindowData.IsHttps()) {
			return "https://" + WindowData._GetCenterAddr() + ":" + WindowData.HttpsPort()
		}
		return "http://" + WindowData._GetCenterAddr() + ":" + WindowData.HttpPort()
	}

	public static _GetBGImg(): string {
		return window["__CONFIG__"]["__LOING_BG__"] || ""
	}

	public static _GetStartType(): number {
		return window["__CONFIG__"]["__START_TYPE__"] || 0
	}

	public static _GetCenterAddr(): string {
		return window["__CONFIG__"]["__SER_URL__"]
	}

	public static _GetResAddr(): string {
		return window["__CONFIG__"]["__RES_URL__"]
	}

	public static _GetStartResAddr(): string {
		return window["__CONFIG__"]["__START_RES__"]
	}

	public static _GetPlatformId(): number {
		return window["__CONFIG__"]["__PLATFORM_ID__"]
	}

	public static _MainCls(): string {
		return window["__CONFIG__"]["__MAIN_CLS__"] || "StartMain"
	}

	public static _DirectLogin(): boolean {
		return window["__CONFIG__"]["__DIRECT_LOGIN__"]
	}

	// public static _WssUrl(): string {
	// 	return window["__CONFIG__"]["__WSS_URL__"]
	// }

	public static _GetServerName(serverId: number): string {
		let func = window["__CONFIG__"]["__ServerNameFunc__"]
		if (func) {
			let name = func(serverId)
			if (name) {
				return name
			}
		}
		return `双线${serverId}服`
	}
	private static HasClientConfig(index: number): boolean {
		return this.Has(window["__CONFIG__"]["__CLIENT_CONFIG__"] || 0, index)
	}

	public static StartLoading() {
		let func = window["__StartLoading"]
		if (func) {
			func()
		}
	}

	public static RemoveBg() {
		let func = window["__RemoveBg"]
		if (func) {
			func()
		}
	}

	public static IsHttps(): boolean {
		if ("https:" == location.href.substr(0, 6)) {
			return true
		} else {
			return false
		}
	}

	public static HttpsPort(): string {
		let port = window["__CONFIG__"]["__HTTPS_PORT__"]
		if (port) {
			return port
		}
		return "8601"
	}

	public static HttpPort(): string {
		let port = window["__CONFIG__"]["__HTTP_PORT__"]
		if (port) {
			return port
		}
		return "8501"
	}

	private static _IsFullScreen
	/***是否支持全屏 */
	public static IsFullScreen(): boolean {
		if (this._IsFullScreen) {
			return this._IsFullScreen
		}
		let isPhone = this.HasClientConfig(1);
		if (isPhone == false) {
			this._IsFullScreen = !egret.Capabilities.isMobile
		} else {
			this._IsFullScreen = false;
		}
		return this._IsFullScreen
	}
	public static Has(value: number, bit: number) {
		return (value & (1 << bit)) > 0
	}

	public static GetThmType(): number {
		return parseInt(window["__CONFIG__"]["__THM__"] || 0)
	}

	public static GetDefaultSel(): number {
		return parseInt(window["__CONFIG__"]["__DEFAULT_JOB__"] || 0)
	}
}