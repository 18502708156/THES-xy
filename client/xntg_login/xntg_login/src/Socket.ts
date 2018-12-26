class Socket {

	/** 连接中 */
	public static STATUS_CONNECTING = 1;
	/** 检验中 */
	public static STATUS_CHECKING = 2;
	/** 连接生效 */
	public static STATUS_COMMUNICATION = 3;
	/** 关闭连接 */
	public static STATUS_DISCONNECT = 4;

	public UpdateStateEvent: Function

	private _socketStatus = 0;

	public _host: string;
	public _port: number

	private socket_: egret.WebSocket

	public proxy: {
		onSocketConnected: Function
		onSocketRead: Function
		onSocketClose: Function
		onFinishCheck: Function
	}

	public constructor() {
		this.newSocket();
	}

	private static _ins: Socket

	public static ins = function () {
		if (!Socket._ins) {
			Socket._ins = new Socket();
		}
		return Socket._ins;
	}

	get connected(): boolean {
		if (this.socket_) {
			return this.socket_.connected
		}
		return false
	}

	public newSocket() {
		if (this.socket_) {
			this.socket_.removeEventListener(egret.Event.CONNECT, this.onSocketConnected, this);
			this.socket_.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
			this.socket_.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketRead, this);
			this.socket_.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.connectError, this);
		}
		this.socket_ = new egret.WebSocket;
		this.socket_.type = egret.WebSocket.TYPE_BINARY;
		this.socket_.addEventListener(egret.Event.CONNECT, this.onSocketConnected, this);
		this.socket_.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
		this.socket_.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketRead, this);
		this.socket_.addEventListener(egret.IOErrorEvent.IO_ERROR, this.connectError, this);
	}

	public connectError() {
		alert("网络中断");
		if (window["connectError"]) {
			window["connectError"]();
		}
	}

	public connect(host: string, port: number) {
		this.updateStatus(Socket.STATUS_CONNECTING);
		this._host = host;
		this._port = port;

		this.Connect(host, port)

	}

	private Connect(host: string, port: number) {
		this.newSocket()
		let url = ""
		if (WindowData.IsHttps()) {
			let p = WindowData._GetPlatformId()
			if (p > 10000) {
				p = p % 10
			}
			let wssUrl = WindowData._GetCenterAddr()
			url = `wss://${wssUrl}:${50000}/${(port % 10000)}/`
		} else {
			url = "ws://" + host + ":" + port;
		}
		this.socket_.connectByUrl(url)
		console.log("connect to " + host + " ,port: " + port + " !");

		window.setTimeout(() => {
			if (this._socketStatus == Socket.STATUS_CONNECTING) {
				// 超时
				alert("连接超时");
				this.close()
			}
		}, 10000)
	}

	public close() {
		console.log("close socket！ip:" + this._host + " port:" + this._port);
		if (this.socket_) {
			this.socket_.close();
		}
		this.updateStatus(Socket.STATUS_DISCONNECT)
		egret.stopTick(this._SendHeartBeat, this)
	};

	public GetSocketState() {
		return this._socketStatus
	}

	public onSocketConnected(e) {
		console.log("与服务器连接成功！ip:" + this._host + " port:" + this._port);
		this.updateStatus(Socket.STATUS_CHECKING);
		egret.stopTick(this._SendHeartBeat, this)
		egret.startTick(this._SendHeartBeat, this)
		if (this.proxy) {
			this.proxy.onSocketConnected()
		}
	}

	private recvPack = new egret.ByteArray();

	public onSocketRead(e) {
		if (this.proxy) {
			var bytesCache = this.recvPack;
			let socket: any = this.socket_
			socket._readByte.position = 0
			let len = socket._readByte.bytesAvailable
			socket.readBytes(bytesCache, 0);
			this.proxy.onSocketRead(new Uint8Array(bytesCache.buffer.slice(0, len)))
		}
	}

	public onSocketClose(e) {
		console.log("与服务器的断开连接！ip:" + this._host + " port:" + this._port);
		let oldState = this._socketStatus
		this.updateStatus(Socket.STATUS_DISCONNECT);
		if (this.proxy) {
			this.proxy.onSocketClose(oldState)
		}
	}

	public updateStatus(status) {
		if (this._socketStatus != status) {
			var old = this._socketStatus;
			this._socketStatus = status;
			this.onFinishCheck(status, old);
		}
	}
	
	public onFinishCheck(newStatus, oldStatus) {
		if (newStatus == Socket.STATUS_COMMUNICATION) {
			console.log("与服务器建立通信成功！ip:" + this._host + " port:" + this._port);
		} else if (newStatus == Socket.STATUS_CHECKING) {
		} else if (newStatus == Socket.STATUS_DISCONNECT) {
		}
		if (this.UpdateStateEvent) {
			this.UpdateStateEvent(newStatus)
		}
		if (this.proxy) {
			this.proxy.onFinishCheck(newStatus, oldStatus)
		}
	};

	private m_PreHeartBeat = 0
	private m_ServerTimeCounter = 5
	private m_HeartBeat = new egret.ByteArray(new Uint8Array([17, 1, 4, 1, 199]))

	private _SendHeartBeat(time: number): boolean {
		if (time > this.m_PreHeartBeat + 20000) {
			this.m_PreHeartBeat = time
			this.sendPack(this.m_HeartBeat)
		}
		return false
	}

	public sendPack(pack) {
		if (pack == null || pack.length == 0) {
			throw new egret.error("数据不能为空！");
		}
		if (this.socket_ && this.socket_.connected) {
			this.socket_.writeBytes(pack);
		} else {
			console.error("not connect")
		}
	}

}