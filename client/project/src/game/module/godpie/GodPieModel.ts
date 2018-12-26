class GodPieModel extends BaseSystem {

    private m_Infos: Sproto.sc_rechargew_shit_request[] = []

    public static IsActOpen(info: Sproto.sc_rechargew_shit_request): boolean {
        if (info == null || info.config == null) {
            return false
        }

        if (info.config.endTime < GameServer.serverTime || GameServer.serverTime < info.config.startTime) {
            return false
        }

        return true
    }

    public constructor() {
        super();
        this.regNetMsg(S2cProtocol.sc_rechargew_shitinit, this.doGodPiePanlInitData)
        this.regNetMsg(S2cProtocol.sc_rechargew_shit, this.doGodPiePanlData)
        this.regNetMsg(S2cProtocol.sc_rechargew_shitstep, this.newdata)
        this.regNetMsg(S2cProtocol.sc_rechargew_shitclose, this._DoShitClose)
        this.regNetMsg(S2cProtocol.sc_rechargew_shitindex, this._DoShitIndex)
    }

    private m_PopStep = 0

    private _ShowPop(): void {
        if (this.m_PopStep > 0) {
            return
        }
        this.m_PopStep = 1
        TimerManager.ins().doTimer(3000, 1, this._Show, this)
    }

    public SetShowState(): void {
        this.m_PopStep = 2
    }

    private _Show(): void {
        if (this.m_PopStep == 1) {
            this.SetShowState()

            // if (UserFb.ins().guanqiaID <= 20) {
            //     return
            // }
            if (!GodPieModel.IsDeblocking()) {
                return
            }

            for (let i = 0; i < this.m_Infos.length; ++i) {
                let info = this.m_Infos[i]
                if (!GodPieModel.IsActOpen(info)) {
                    continue
                }
                let canBuy = false
                for (let j = 0; j < info.config.awards.length; ++j) {
                    if ((info.info.getnum[j] || 0) < (info.config.awards[j].buycount || 1)) {
                        canBuy = true
                    }
                }
                if (canBuy && !FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GOD_PIE)) {
                    ViewManager.ins().open(GodPieWin, i)
                    break
                }
            }
        }
    }

    private _SetDefaultData(config: Sproto.rechargew_shit_info): void {
        if (config == null || config.awards == null) {
            return
        }
        for (let award of config.awards) {
            if (!award.buycount) {
                award.buycount = 1
            }
        }
    }

    public ClearData(): void {
        this.m_Infos = []
    }

    private doGodPiePanlInitData(rsp: Sproto.sc_rechargew_shitinit_request) {
        for (let data of rsp.initinfo) {
            this._SetDefaultData(data.config)
            this.m_Infos.push(data as any)
        }
        if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GOD_PIE) && this.m_Infos.length > 0) {
            this._ShowPop()
        }
        // for (let data of this.m_Infos) {
        //     if (!data.info.nopop) {
        //         this._ShowPop()
        //         break
        //     }
        // }
        GameGlobal.MessageCenter.dispatch(MessageDef.GOGPIE_UPDATE);
    }

    private doGodPiePanlData(bytes: Sproto.sc_rechargew_shit_request) {
        this._SetDefaultData(bytes.config)
        this.m_Infos.push(bytes)
        GameGlobal.MessageCenter.dispatch(MessageDef.GOGPIE_UPDATE);

        // if (!bytes.info.nopop) {
        //     this._ShowPop()
        // }
    }

    private newdata(bytes: Sproto.sc_rechargew_shitstep_request) {
        let info = this.GetInfo(bytes.payType, bytes.gid)
        if (info) {
            info.info.step = bytes.step
            info.info.getnum = bytes.getnum
            info.info.steps = bytes.steps
            GameGlobal.MessageCenter.dispatch(MessageDef.GOGPIE_UPDATE);
        }
    }

    private _DoShitClose(rsp: Sproto.sc_rechargew_shitclose_request) {
        let info = this.GetInfo(rsp.payType, rsp.gid)
        if (info) {
            info.config.endTime = 0
            GameGlobal.MessageCenter.dispatch(MessageDef.GOGPIE_UPDATE);
        }
    }

    private _DoShitIndex(rsp: Sproto.sc_rechargew_shitindex_request) {
        // Recharge.ins().Godpie(rsp.payType, rsp.gid, rsp.index, rsp.price)
    }

    public GetInfo(payType: number, gid: number): Sproto.sc_rechargew_shit_request {
        for (let info of this.m_Infos) {
            if (info.config.payType == payType && info.config.gid == gid) {
                return info
            }
        }
        return null
    }

    public TopDataProvider(): Sproto.sc_rechargew_shit_request[] {
        let list = []
        for (let info of this.m_Infos) {
            if (GodPieModel.IsActOpen(info) && !GodPieModel.IsGotten(info)) {
                list.push(info)
            }
        }
        return list
    }

    // static GODPIE_ICONLIST = [
    //     "ui_hd_icon_tjxb01",
    //     "ui_hd_icon_tjxb02",
    //     "ui_hd_icon_tjxb03",
    //     "ui_hd_icon_tjxb04",
    //     "ui_hd_icon_tjxb05"
    // ]


    // public Sendnopop(payType: number, gid: number, nopop: boolean) {
    //     let req = new Sproto.cs_rechargew_setpop_request
    //     req.payType = payType
    //     req.gid = gid
    //     req.nopop = nopop
    //     // this.select = nopop
    //     let info = this.GetInfo(payType, gid)
    //     if (info) {
    //         info.info.nopop = nopop
    //     }
    //     this.Rpc(C2sProtocol.cs_rechargew_setpop, req)
    // }

    public Sendbuy(payType, gid, index) {
        let req = new Sproto.cs_rechargew_getawards_request
        req.payType = payType
        req.gid = gid
        req.index = index

        this.Rpc(C2sProtocol.cs_rechargew_getawards, req)
    }

    public IsRedPoint(): boolean {
        for (let info of this.m_Infos) {
            if (!GodPieModel.IsActOpen(info)) {
                continue
            }
            for (let i = 0; i < info.config.awards.length; ++i) {
                if (GodPieModel.GetInfoStateByIndex(info, i) == RewardState.CanGet) {
                    return true
                }
            }
        }
        return false
    }

    public static GetInfoIndex(info: Sproto.sc_rechargew_shit_request): number {
        // 单笔充值只显示第一页
        // if (info.config.condType == GodPieCondType.TYPE_03) {
        //     return 0
        // }
        for (var i = 0; i < info.config.awards.length; i++) {
            var a = info.info.getnum[i] || 0
            var b = info.config.awards[i].buycount || 1
            if (a < b) {
                return i
            }
        }
        return info.config.awards.length - 1
    }

    public static IsGotten(info: Sproto.sc_rechargew_shit_request) {
        if (info == null || info.config == null) {
            return false
        }
        let awards = info.config.awards
        // for (let award of awards) {
        for (let i = 0; i < awards.length; ++i) {
            let award = awards[i]
            let buyCount = award.buycount || 1
            let getNum = info.info.getnum[i] || 0
            if (getNum < buyCount) {
                return false
            }
        }
        return true
    }

    public static GetInfoStateByIndex(info: Sproto.sc_rechargew_shit_request, index: number): RewardState {
        let totalCount = info.config.awards[index].buycount || 1
        let buyCount = info.info.getnum[index] || 0
        if (buyCount >= totalCount) {
            return RewardState.Gotten
        }
        
        if (!this.IsActOpen(info)) {
            return RewardState.NotReached
        }
        let cond = false
        if (info.config.condType == 0) {
            cond = true
        } else {
            if (info.config.condType == GodPieCondType.TYPE_03) {
                // for (let i = 0; i < info.config.targets.length; ++i) {
                //     if (info.info.steps[i] >= info.config.targets[i]) {
                //         cond = true
                //         break
                //     }
                // }
                cond = (info.info.steps[index] || 0) >= (info.config.targets[index] || 0)
            } else {
                cond = info.info.step >= (info.config.targets[index] || 0)
            }
        }

        if (!cond) {
            return RewardState.NotReached
        }

        let prices = info.config.prices[index] || 0
        if (!prices) {
            return RewardState.CanGet
        }

        if (info.config.gtype == 2 && Checker.Money(MoneyConst.yuanbao, prices, false)) {
            return RewardState.CanGet
        }
    }

    public static GetBuyCountStr(info: Sproto.sc_rechargew_shit_request, index: number): string {
        try {
            let buyCount = info.config.awards[index].buycount || 1
            if (buyCount == 1) {
                return ""
            }
            return ` (${(info.info.getnum[index] || 0)}/${(buyCount)})`
        } catch (e) {

        }
        return ""
    }

    public static IsFinish(info: Sproto.sc_rechargew_shit_request): boolean {
        return info == null || GameServer.serverTime > info.config.endTime
    }

    public static IsDeblocking(): boolean {
        return Deblocking.Check(DeblockingType.TYPE_29, true)
    }
}