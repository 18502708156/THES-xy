class HttpHelper {

	public static GetPlayerServerInfo(token: string, callback: Function, thisObject: any) {
		var request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT
		request.open(WindowData._GetServerAddr() + "/get_player_serverinfo?token=" + token + "&platformid=" + WindowData._GetPlatformId(), egret.HttpMethod.GET);
		request.send()
		request.addEventListener(egret.Event.COMPLETE, callback, thisObject);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.Error, this);
	}

	public static GetServerList(page: number, callback: Function, thisObject: any): void {
		var request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT
		request.open(WindowData._GetServerAddr() + "/get_serverlist?platformid=" + WindowData._GetPlatformId() + "&page=" + page, egret.HttpMethod.GET);
		request.send()
		request.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
			callback.call(thisObject, page, event)
		}, thisObject);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.Error, this);
	}

	public static GetRandomName(serverid: number, sex: number, callback: Function, thisObject: any): void {
		var request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT
		request.open(WindowData._GetServerAddr() + "/get_random_name?platformid=" + WindowData._GetPlatformId() + "&serverid=" + serverid + "&sex=" + sex, egret.HttpMethod.GET);
		request.send()
		request.addEventListener(egret.Event.COMPLETE, callback, thisObject);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.Error, this);
	}

	public static CheckName(serverid: number, name: string, callback: Function, thisObject: any): void {
		var request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT
		request.open(WindowData._GetServerAddr() + "/check_lock_name?platformid=" + WindowData._GetPlatformId() + "&serverid=" + serverid + "&name=" + name, egret.HttpMethod.GET);
		request.send()
		request.addEventListener(egret.Event.COMPLETE, callback, thisObject);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.Error, this);
	}

	public static GetNotice(callback: Function, thisObject: any): void {
		var request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT
		request.open(WindowData._GetServerAddr() + "/get_total_notice?platformid=" + WindowData._GetPlatformId(), egret.HttpMethod.GET);
		request.send()
		request.addEventListener(egret.Event.COMPLETE, callback, thisObject);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.Error, this);	
	}

	private static m_Set = {}

	public static SendPoint(point: number): void {
		if (HttpHelper.m_Set[point] || !Main.Instance){
			return
		}
		HttpHelper.m_Set[point] = true
		var request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT
		request.open(WindowData._GetServerAddr() + "/set_account_point?account=" + Main.Instance.UserName + "&status=" + point, egret.HttpMethod.GET);
		request.send()
	}

	private static Error() {
		alert("请求错误，请稍后重试")
	}
}