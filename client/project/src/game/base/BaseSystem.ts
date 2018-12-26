class BaseSystem extends BaseClass {

    public constructor() {
        super();

        GameGlobal.AllModule.push(this)
    }

    private m_Init = false

    public InitConfig() {
        if (this.m_Init) {
            return
        }
        this.m_Init = true
        this.Init()
    }

    public Init() {

    }

    /**
     * 注册协议，不能重复注册，新注册的会覆盖旧的
     */
    public regNetMsg(msgId: number, fun: Function) {
        Sproto.SprotoReceiver.AddHandler(msgId, fun, this)
    }

    /**
     * 可重复注册协议方法
     */
    public RegNetMsgs(msgId: number, fun: Function) {
        Sproto.SprotoReceiver.AddHandlers(msgId, fun, this)
    }

    public Rpc(tag: number, rpcReq: Sproto.SprotoTypeBase = null, rpcRspHandler: Function = null, thisObj: any = null): void {
        GameSocket.ins().Rpc(tag, rpcReq, rpcRspHandler, this)
    }

    public OnDayTimer() {

    }

    public OnSocketClose() {

    }
}