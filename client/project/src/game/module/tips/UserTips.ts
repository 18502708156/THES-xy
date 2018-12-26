class UserTips extends BaseSystem {

    public static ins(): UserTips {
        return super.ins()
    }

    public constructor() {
        super()
        MessageCenter.ins().addListener(MessageDef.POWER_BOOST, this.showBoostPower, this)
        this.regNetMsg(S2cProtocol.sc_error_code, this._ErrorTip)
    }

    private _ErrorTip(rsp: Sproto.sc_error_code_request) {
        let msg = rsp.msg
        if (msg) {
            this.showTips(msg)
        }
    }

    public static ErrorTip(str: string): void {
        UserTips.ins().showTips("|C:0xff0000&T:" + str + "|");
    }

    // string, ...args: any[]
    public static FormatTip(...args: any[]) {
        UserTips.ins().showTips("|C:0xFFF5E0&T:" + StringUtils.FormatS.apply(null, args) + "|");
    }

    public static InfoTip(str: string): void {
        UserTips.ins().showTips("|C:0xFFF5E0&T:" + str + "|");
    }

    public static InfoTip2(str: string): void {
        UserTips.ins().showTips("|C:0x00ff00&T:" + str + "|");
    }

    public showTips(str) {
        let view = <TipsView>ViewManager.ins().getView(TipsView)
        if (!view) {
            view = ViewManager.ins().open(TipsView) as TipsView
        } 
        view.showIconTips(str,"")
    }

   public showContTips(str,src) {
        let view = <TipsView>ViewManager.ins().getView(TipsView)
        if (!view) {
            view = ViewManager.ins().open(TipsView) as TipsView
        } 
        view.showIconTips(str,src)
    }

    public showGoodEquipTips(itemData) {
        let view = <TipsView>ViewManager.ins().getView(TipsView)
        if (!view) {
            view = ViewManager.ins().open(TipsView) as TipsView
        } 
        view.showGoodEquipTip(itemData);
    }

    public showBoostPower(currentValue, lastValue): void {
        let view = <BoostPowerView>ViewManager.ins().getView(BoostPowerView)
        if (!view) {
            view = ViewManager.ins().open(BoostPowerView) as BoostPowerView
        } 
        view.showBoostPower(currentValue, lastValue);
    }

    public showFuncNotice(lv) {
        // ViewManager.ins().open(FuncNoticeWin).showWin(lv);
    }
}
