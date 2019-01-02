class GameSocket {

	private _onConnected: any;
	private _onClosed: any;

	private socket_: Socket

	public constructor() {
		this.socket_ = Socket.ins()
		this.socket_.proxy = this
	}

	private static _ins: GameSocket;

	public static ins = function () {
		if (!GameSocket._ins) {
			GameSocket._ins = new GameSocket();
		}
		return GameSocket._ins;
	}

	public GetState(): number {
		return this.socket_.GetSocketState()
	}

	public Rpc(tag: number, rpcReq: Sproto.SprotoTypeBase = null, rpcRspHandler: Function = null, thisObj: any = null): boolean {
		this.send(Sproto.SprotoSender.Pack(tag, rpcReq, rpcRspHandler, thisObj))
		return true;
	}

	public send(message: egret.ByteArray): boolean {
		if (this.socket_.GetSocketState() == Socket.STATUS_COMMUNICATION) {
			this.socket_.sendPack(message);
			console.log("服务器地址：" + this.socket_._host, "服务器端口：" + this.socket_._port);
			this._SendGetServerTime()
			return true;
		} else {
			console.log("发送数据时没和服务连接或者未进入通信状态");
			return false;
		}
	}

	public onSocketConnected() {
		TimerManager.ins().remove(this.reLogin, this);
	};

	private m_ByteList: Uint8Array[] = []

	public onSocketRead(uint8Array: Uint8Array) {
		this.m_ByteList.push(uint8Array)
		this.DoDispatch()
	}

	private m_IsUpdate = false

	private DoDispatch() {
		if (this.m_IsUpdate) {
			return
		}
		this.m_IsUpdate = true
		egret.startTick(this.UpdateDispatch, this)
	}

	private UpdateDispatch(t: number): boolean {
		for (let i = 0; i < 20; ++i) {
			let byte = this.m_ByteList.shift()
			if (byte) {
				let byteArray = Sproto.SprotoCore.Dispatch(byte);
				if (byteArray) {
					this.send(byteArray);
				}
				if (egret.getTimer() - t > 10) {
					break
				}
			} else {
				this.m_IsUpdate = false
				egret.stopTick(this.UpdateDispatch, this)
				break
			}
		}
		return false
	}

	private m_ReLoginTimer = 0

	public onSocketClose(oldState) {
		if (this._onClosed) {
			this._onClosed();
		}
		// 如果是被顶号或者之前没有连接成功，就不自动连接
		if (GameServer.mOtherLogin) {
			return
		}
		// let chatpanel = <ChatPanel>ViewManager.ins().getView(ChatPanel)
		// if(chatpanel)
		// {
		// 	chatpanel.ClearMsg();
		// }
		GameGlobal.OnSocketClose()

		this.m_ReLoginTimer = egret.getTimer()
		TimerManager.ins().doTimer(5000, 0, this.reLogin, this);
	}

	public reLogin() {
		if (egret.getTimer() < this.m_ReLoginTimer + 4000) {
			return
		}
		this.m_ReLoginTimer = egret.getTimer()
		this.socket_.close();
		this.login(this.socket_._host + ":" + this.socket_._port);
	}

	public onFinishCheck(newStatus, oldStatus) {
		if (newStatus == Socket.STATUS_COMMUNICATION) {
		} else if (newStatus == Socket.STATUS_CHECKING) {
			if (this._onConnected) {
				this._onConnected()
			}
			this.sendCheckAccount();
		} else if (newStatus == Socket.STATUS_DISCONNECT) {
		}
	};

	private m_ServerTimeCounter = 5

	private _SendGetServerTime() {
		if (egret.getTimer() > this.m_ServerTimeCounter + 200000) {
			this.m_ServerTimeCounter = egret.getTimer()
			this.Rpc(C2sProtocol.cs_base_get_game_time)
		}
	}

	public sendCheckAccount() {
		if (!this.mIsLogin) {
			console.warn("not login not check account !!!")
			return
		}
		console.log("开始验证账号")
		let checkAccount = new Sproto.checkAccount_request();
		checkAccount.token = Main.Instance.mToken
		if (Main.Instance.mConnectServerData) {
			checkAccount.serverid = Number(Main.Instance.mConnectServerData.id)
		}
		checkAccount.lid = Main.Instance.lid
		this.socket_.sendPack(Sproto.SprotoSender.Pack(C2sProtocol.checkAccount, checkAccount, GameGlobal.RoleMgr.doCheckAccount, GameGlobal.RoleMgr))
	};

	public CheckAccount(suc: boolean) {
		if (suc) {
			this.socket_.updateStatus(Socket.STATUS_COMMUNICATION)
		} else {
			this.socket_.updateStatus(Socket.STATUS_DISCONNECT)
			this.socket_.close()
		}
	}

	public mIsLogin = false

	public login(ip) {
		this.mIsLogin = true

		let arr = ip.split(":")
		let host = arr[0]
		let port = arr[1]
		if (!this.socket_.connected) {
			this.socket_.connect(host, port);
		} else {
			this.sendCheckAccount();
		}
	}

	public setOnClose(ex, obj) {
		this._onClosed = ex.bind(obj);
	};
	public setOnConnected(ex, obj) {
		this._onConnected = ex.bind(obj);
	};

	public close() {
		this.socket_.close()
	}
}