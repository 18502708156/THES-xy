var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameSocket = (function () {
    function GameSocket() {
        this.m_ByteList = [];
        this.m_IsUpdate = false;
        this.m_ReLoginTimer = 0;
        this.m_ServerTimeCounter = 5;
        this.socket_ = Socket.ins();
        this.socket_.proxy = this;
    }
    GameSocket.prototype.GetState = function () {
        return this.socket_.GetSocketState();
    };
    GameSocket.prototype.Rpc = function (tag, rpcReq, rpcRspHandler, thisObj) {
        if (rpcReq === void 0) { rpcReq = null; }
        if (rpcRspHandler === void 0) { rpcRspHandler = null; }
        if (thisObj === void 0) { thisObj = null; }
        this.send(Sproto.SprotoSender.Pack(tag, rpcReq, rpcRspHandler, thisObj));
        return true;
    };
    GameSocket.prototype.send = function (message) {
        if (this.socket_.GetSocketState() == Socket.STATUS_COMMUNICATION) {
            this.socket_.sendPack(message);
            this._SendGetServerTime();
            return true;
        }
        else {
            console.log("发送数据时没和服务连接或者未进入通信状态");
            return false;
        }
    };
    GameSocket.prototype.onSocketConnected = function () {
        TimerManager.ins().remove(this.reLogin, this);
    };
    ;
    GameSocket.prototype.onSocketRead = function (uint8Array) {
        this.m_ByteList.push(uint8Array);
        this.DoDispatch();
    };
    GameSocket.prototype.DoDispatch = function () {
        if (this.m_IsUpdate) {
            return;
        }
        this.m_IsUpdate = true;
        egret.startTick(this.UpdateDispatch, this);
    };
    GameSocket.prototype.UpdateDispatch = function (t) {
        for (var i = 0; i < 20; ++i) {
            var byte = this.m_ByteList.shift();
            if (byte) {
                var byteArray = Sproto.SprotoCore.Dispatch(byte);
                if (byteArray) {
                    this.send(byteArray);
                }
                if (egret.getTimer() - t > 10) {
                    break;
                }
            }
            else {
                this.m_IsUpdate = false;
                egret.stopTick(this.UpdateDispatch, this);
                break;
            }
        }
        return false;
    };
    GameSocket.prototype.onSocketClose = function (oldState) {
        if (this._onClosed) {
            this._onClosed();
        }
        // 如果是被顶号或者之前没有连接成功，就不自动连接
        if (GameServer.mOtherLogin) {
            return;
        }
        // let chatpanel = <ChatPanel>ViewManager.ins().getView(ChatPanel)
        // if(chatpanel)
        // {
        // 	chatpanel.ClearMsg();
        // }
        GameGlobal.OnSocketClose();
        this.m_ReLoginTimer = egret.getTimer();
        TimerManager.ins().doTimer(5000, 0, this.reLogin, this);
    };
    GameSocket.prototype.reLogin = function () {
        if (egret.getTimer() < this.m_ReLoginTimer + 4000) {
            return;
        }
        this.m_ReLoginTimer = egret.getTimer();
        this.socket_.close();
        this.login(this.socket_._host + ":" + this.socket_._port);
    };
    GameSocket.prototype.onFinishCheck = function (newStatus, oldStatus) {
        if (newStatus == Socket.STATUS_COMMUNICATION) {
        }
        else if (newStatus == Socket.STATUS_CHECKING) {
            if (this._onConnected) {
                this._onConnected();
            }
            this.sendCheckAccount();
        }
        else if (newStatus == Socket.STATUS_DISCONNECT) {
        }
    };
    ;
    GameSocket.prototype._SendGetServerTime = function () {
        if (egret.getTimer() > this.m_ServerTimeCounter + 200000) {
            this.m_ServerTimeCounter = egret.getTimer();
            this.Rpc(C2sProtocol.cs_base_get_game_time);
        }
    };
    GameSocket.prototype.sendCheckAccount = function () {
        if (!GameApp.mInit) {
            console.warn("not login not check account !!!");
            return;
        }
        console.log("开始验证账号");
        var checkAccount = new Sproto.checkAccount_request();
        checkAccount.token = Main.Instance.mToken;
        if (Main.Instance.mConnectServerData) {
            checkAccount.serverid = Number(Main.Instance.mConnectServerData.id);
        }
        checkAccount.lid = Main.Instance.lid;
        this.socket_.sendPack(Sproto.SprotoSender.Pack(C2sProtocol.checkAccount, checkAccount, GameGlobal.RoleMgr.doCheckAccount, GameGlobal.RoleMgr));
    };
    ;
    GameSocket.prototype.CheckAccount = function (suc) {
        if (suc) {
            this.socket_.updateStatus(Socket.STATUS_COMMUNICATION);
        }
        else {
            this.socket_.updateStatus(Socket.STATUS_DISCONNECT);
            this.socket_.close();
        }
    };
    GameSocket.prototype.login = function (ip) {
        var arr = ip.split(":");
        var host = arr[0];
        var port = arr[1];
        if (!this.socket_.connected) {
            this.socket_.connect(host, port);
        }
        else {
            this.sendCheckAccount();
        }
    };
    GameSocket.prototype.setOnClose = function (ex, obj) {
        this._onClosed = ex.bind(obj);
    };
    ;
    GameSocket.prototype.setOnConnected = function (ex, obj) {
        this._onConnected = ex.bind(obj);
    };
    ;
    GameSocket.prototype.close = function () {
        this.socket_.close();
    };
    GameSocket.ins = function () {
        if (!GameSocket._ins) {
            GameSocket._ins = new GameSocket();
        }
        return GameSocket._ins;
    };
    return GameSocket;
}());
__reflect(GameSocket.prototype, "GameSocket");
//# sourceMappingURL=GameSocket.js.map