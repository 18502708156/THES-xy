class FuliModel extends BaseSystem {
    FuliData = new FuliData;
    public mRedPoint: FuliRedPoint

    public constructor() {
        super()
        this.mRedPoint = new FuliRedPoint(this)
        this.regNetMsg(S2cProtocol.sc_welfare_info, this._DoInitInfo);
        this.regNetMsg(S2cProtocol.sc_welfare_signin_info, this.getSignInInfo);
        this.regNetMsg(S2cProtocol.sc_welfare_bonus_add, this._briberyInfo);
        this.regNetMsg(S2cProtocol.sc_accu_login, this._giveGoldInfo);
        this.regNetMsg(S2cProtocol.sc_cashCow_info, this._GoldTreeInfo);
    }
    public IsRedPoint() {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_125)) {
            return false
        }
        return this.mRedPoint.signShowRedPoint() || this.mRedPoint.lvShowRedPoint() || this.mRedPoint.PracticeShowRedPoint()
            || this.mRedPoint.GoldShowRedPoint() || this.mRedPoint.IsGoldTree() || this.mRedPoint.IsGodTreeBox()
    }
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //--------发送请求和接收结果----------------------------------------------------------------------
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**请求签到*/
    sendSignIn(type: number) {
        if (type == 2) {
            if (GameGlobal.actorModel.vipLv < GameGlobal.Config.WelfareBaseConfig.viplv) {
                GameGlobal.UserTips.showTips("VIP等级不足，请提升VIP等级")
                return;
            }

        }
        if (type == 3) {
            if (GameGlobal.RechargeModel.dailyRechare <= 0) {
                WarnWin.show("未充值任意金额，请前往充值", function () {
                    RechargeWin.Open();
                }, this)
                return;
            }
        }
        let req = new Sproto.cs_welfare_signin_req_request;
        req.rewardType = type;
        this.Rpc(C2sProtocol.cs_welfare_signin_req, req, this.signInSuccess, this)
    }

    signInSuccess(req: Sproto.cs_welfare_signin_req_response) {
        if (req.ret) {
            GameGlobal.UserTips.showTips("领取成功");
            GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_GIFT_SUCCEED)
        }
    }

    getSignInInfo(req: Sproto.sc_welfare_signin_info_request) {
        this.FuliData.dailyId = req.dailyId || 1;
        this.FuliData.nextGiftDay = (req.totalDay + 1) || 1;
        this.FuliData.accDay = req.totalDay || 1;
        this.FuliData.rewardMark = req.rewardMark || 0;
    }

    sendLvGiftBag(id: number) {
        let req = new Sproto.cs_welfare_lv_reward_request;
        req.no = id;
        this.Rpc(C2sProtocol.cs_welfare_lv_reward, req, this.getLvGiftBag, this)
    }

    getLvGiftBag(req: Sproto.cs_welfare_lv_reward_response) {
        if (req.ret) {
            GameGlobal.UserTips.showTips("领取成功");
            this.FuliData.lvMark = req.lvReward;
            GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_GIFT_SUCCEED)
        }
    }

    private _DoInitInfo(rsp: Sproto.sc_welfare_info_request) {
        this.FuliData.month = rsp.month;
        this.FuliData.week = rsp.week;
        this.FuliData.firstMonth=rsp.firstMonth;
        this.FuliData.foreverFlag = rsp.forever > 0
        this.FuliData.lvMark = rsp.lvReward;
        this.FuliData.welfareReward = rsp.welfareReward;
        this.FuliData.rankData = rsp.rankData;
        this.FuliData.avgLv = rsp.avgLv;
        GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_GIFT_SUCCEED)
        if (rsp.month > 0 || rsp.week > 0 || rsp.forever > 0)
            MessageCenter.ins().dispatch(MessageDef.FULI_MONTH_WEEK_CHANGE)
    }
    //红包 信息
    private _briberyInfo(rsp: Sproto.sc_welfare_bonus_add_request) {
        //this.FuliData.itemDic[rsp.id]=rsp.endtime;
        this.FuliData.briberyID = rsp.id;
        this.FuliData.playerName = rsp.name;
        this.FuliData.endtime = rsp.endtime;
        //    this.FuliData.itemDataArr = 

        if (ViewManager.ins().isShow(BriberyBasePanel) == false) {
            ViewManager.ins().open(BriberyBasePanel);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_HAVEBRIBERY, rsp);

    }
    //送十万元宝 信息
    private _giveGoldInfo(rsp: Sproto.sc_accu_login_request) {
        //this.FuliData.itemDic[rsp.id]=rsp.endtime;
        this.FuliData.addDayCount = rsp.count;
        this.FuliData.recordEdIndex = rsp.record;
        GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GIVEGOLD_INFO);
    }

    //搖錢樹 信息
    private _GoldTreeInfo(rsp: Sproto.sc_cashCow_info_request) 
    {
        this.FuliData.level = rsp.level;
        this.FuliData.exp = rsp.exp;
        this.FuliData.odds = rsp.odds;
        this.FuliData.shake = rsp.shake;
        this.FuliData.drawBin = rsp.drawBin;
        this.FuliData.amplitude=rsp.amplitude;
        GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GOLDTREE_INFO);
    }


    //兑换码
    public SendRedeemCode(str) //0 : integer #1月卡 2周卡
    {
        let req = new Sproto.cs_welfare_redeemcode_request
        req.redeemcode = str;
        this.Rpc(C2sProtocol.cs_welfare_redeemcode, req, (rsp: Sproto.cs_welfare_redeemcode_response) => {
            GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_REDEEMCODE, rsp);
        }, this)
    }
    //领取福利
    public ReceiveItem(index: number) {
        let req = new Sproto.cs_welfare_reward_request
        req.no = index;
        this.Rpc(C2sProtocol.cs_welfare_reward, req, (rsp: Sproto.cs_welfare_reward_response) => {
            if (rsp.ret) {
                this.FuliData.welfareReward = rsp.welfareReward;
                GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_RECEIVEITEMSIGN, rsp);
            }
        }, this)
    }
    //历练是否领取宝箱
    public isReceive(index: number) {
        return (this.FuliData.welfareReward & Math.pow(2, index)) > 0;
    }
    //领取红包
    public ReceiveBribery(id: number) {
        let req = new Sproto.cs_welfare_bonus_open_request
        req.id = id;
        this.Rpc(C2sProtocol.cs_welfare_bonus_open, req, (rsp: Sproto.cs_welfare_bonus_open_response) => {
            GameGlobal.MessageCenter.dispatch(MessageDef.FULI_GET_RECEIVEBRIBERY, rsp);
        }, this)
    }

    //送十万元宝
    public GiveGold(index: number) {
        let req = new Sproto.cs_accu_login_get_request
        req.index = index;
        this.Rpc(C2sProtocol.cs_accu_login_get, req);
    }
    //送十万元宝_是否領取元宝
    public isReceiveGold(Id): boolean {
        return (this.FuliData.recordEdIndex & Math.pow(2, Id)) > 0;
    }

    //搖錢
    public playGold():void
    {
        let req=new Sproto.cs_cashCow_shake_request;
        this.Rpc(C2sProtocol.cs_cashCow_shake, req);
    }

    //搖錢_寶箱
    public playGoldBox(boxid):void
    {
        let req=new Sproto.cs_cashCow_box_rewards_request;
        req.boxid=boxid;
        this.Rpc(C2sProtocol.cs_cashCow_box_rewards, req);
    }

}

class FuliRedPoint extends IRedPoint {

    public static readonly INDEX_UP_SIGN = 0
    public static readonly INDEX_UP_LEVEL = 1
    public static readonly INDEX_UP_PRA = 2
    public static readonly INDEX_UP_GOLD = 3
    private mModel: FuliModel

    constructor(model: FuliModel) {
        super()
        this.mModel = model
    }

    protected GetCheckFuncList(): { [key: number]: Function } {
        return {
            [FuliRedPoint.INDEX_UP_SIGN]: this.signShowRedPoint,
            [FuliRedPoint.INDEX_UP_LEVEL]: this.lvShowRedPoint,
            [FuliRedPoint.INDEX_UP_PRA]: this.PracticeShowRedPoint,
            [FuliRedPoint.INDEX_UP_GOLD]: this.GoldShowRedPoint
        }
    }

    public GetMessageDef(): string[] {
        return [
            MessageDef.FULI_GET_GIFT_SUCCEED,
            MessageDef.FULI_GET_RECEIVEITEMSIGN,
            MessageDef.FULI_GIVEGOLD_INFO,
            MessageDef.DAILY_ACTIVE_UPDATE,
            MessageDef.LEVEL_CHANGE,
            MessageDef.RECHARGE_DAILY_UPDATE
        ]
    }

    protected OnChange(index: number): void {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_SIGN_UPDATE)
    }

    public signShowRedPoint() {
        let show = false;
        let vipLv = UserVip.ins().lv;
        for (let i = 0; i < 4; i++) {
            if (GameGlobal.Config.WelfareBaseConfig.viplv > vipLv && i == 1) continue;
            if (GameGlobal.RechargeModel.dailyRechare <= 0 && i == 2) continue;
            show = !BitUtil.Has(this.mModel.FuliData.rewardMark, i)
            if (show)
                break;
        }
        return show;
    }

    public lvShowRedPoint() {
        let show = false;
        let config = GameGlobal.Config.LvRewardConfig
        for (let key in config) {
            if (GameGlobal.actorModel.level >= config[key].level) {
                show = !BitUtil.Has(this.mModel.FuliData.lvMark, Object.keys(config).indexOf(key) + 1)
                if (show)
                    break;
            }
        }
        return show;
    }

    public PracticeShowRedPoint() {
        if (Deblocking.IsDeblocking(GameGlobal.Config.WelfareBaseConfig.opentype)) {
            let show = false;
            let baseInfo = GameGlobal.DailyModel.baseInfo;
            let score = baseInfo.mCurActive;
            let config = GameGlobal.Config.WelfareBaseConfig.score
            for (let key in config) {
                if (score >= config[key]) {
                    show = !this.mModel.isReceive(parseInt(key) + 1)
                    if (show)
                        break;
                }
            }
            return show;
        }
        else
            return false;
    }

    public GoldShowRedPoint() {
        let show = false;
        let config = GameGlobal.Config.PresentGoldConfig
        for (let key in config) {
            if (this.mModel.FuliData.addDayCount >= config[key].days) {
                show = !this.mModel.isReceiveGold(config[key].id)
                if (show)
                    break;
            }
        }
        return show;
    }

    public IsGoldTree(): boolean {
        let config = GameGlobal.Config.CashCowBasicConfig[GameGlobal.FuliModel.FuliData.shake + 1]
        if (config) {
            return config.yuanbao == 0
        }
        return false
    }

    public IsGodTreeBox(): boolean {
		let boxArr = GameGlobal.FuliModel.FuliData.drawBin;
        if (!boxArr || !boxArr.length) {
            return
        }
		for (let i = 0; i < boxArr.length; i++) {
			if (boxArr[i] == 2 || boxArr[i] == 3) {
				let config = GameGlobal.Config.CashCowBoxConfig[i + 1]
				if (!config) {
					continue
				}
				let openBoxCount = config.time;
				if (openBoxCount <= GameGlobal.FuliModel.FuliData.shake) {
					return true
				}
			}
		}
		return false
    }
}