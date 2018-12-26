class RechargeModel extends BaseSystem {

    public static MAX_VIPLV = 20;

    /**充值类型已充记录 */
    public reward: {[key: number]: boolean} = {}

    public firsttime: number = 0
    /**首充充值人民币数 */
    public rechargeNum: number = 0;
    /**首充界面领取状态 */
    private rewardState: number[] = []

    /**每日充值人民币数 */
    public dailyRechare: number = 0;
    /**每日充值界面领取状态 0=未领取，1=领取 */
    public dailyReward: number = 0;
    /**每日充值界面对应哪天配置id */
    public dailyId: number = 0;


    /**玩家当天充值人民币数 */
    // public todayRechargeNum: number = 0;
    /**玩家累计充值人民币数 */
    public totalRechargeNum: number = 0;

    /**充值特惠 */
    public choicerechare: number = 0;

    public finish: {[key: number]: boolean} = {}

    /**玄女卡 */
    public xuanNvCard = false;
    public constructor() {
        super();
        this.regNetMsg(S2cProtocol.sc_recharge_double, this._DoUpdateDoublechargeInfo)
        this.regNetMsg(S2cProtocol.sc_recharge_first_info, this._DoUpdateFirstChargeInfo)
        this.regNetMsg(S2cProtocol.sc_recharge_dailyrechare, this._DoUpdateReChargDaily)
        this.regNetMsg(S2cProtocol.sc_recharge_count, this._DoUpdateReChargeCount)
    }

    public GetFirstRewardState(id: number): boolean {
        for (let data of this.rewardState) {
            if (data == id) {
                return true
            }
        }
        return false
    }

    public getPayItemsConfig() {
        return PayItemsConfig.GetConfig()
    }
    public getVipConfig() {
        return GameGlobal.Config.VipConfig;
    }
    public getListItemDate() {
        let config = this.getPayItemsConfig();
        let dataCll = [];
        for (let key in config) {
            let data = config[key]
            if (data.show == 1) {
                if (data.vipLv && GameGlobal.actorModel.vipLv < data.vipLv) {
                    continue
                }
                dataCll.push(data);
            }
        }
        SortTools.sortMap(dataCll, "reorder");
        let week = GameGlobal.FuliModel.FuliData.week;
        let month = GameGlobal.FuliModel.FuliData.month;
        let foreverFlag = GameGlobal.FuliModel.FuliData.foreverFlag
        for (let i=dataCll.length-1; i >= 0; i--) {
            let data = dataCll[i]
            if ((data.type == 2 && month > 0)
                || (data.type == 3 && week > 0)
                || (data.type == 6 && foreverFlag)) {
                    dataCll.splice(i, 1)
                }
            else if (data.condId && !this.finish[data.condId]) {
                dataCll.splice(i, 1)
            }
        }

        // if (month > 0)
        //     for (let i = 0; i < dataCll.length;)
        //         if (dataCll[i].type == 2)//2月卡
        //             dataCll.splice(i, 1);
        //         else
        //             i++
        // if (week > 0)
        //     for (let i = 0; i < dataCll.length;)
        //         if (dataCll[i].type == 3)//3周卡
        //             dataCll.splice(i, 1);
        //         else
        //             i++

        return dataCll
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //--------发送请求和接收结果----------------------------------------------------------------------
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public sendRecharge(id) {
        let orderInfo = RechargeModel.GetYbOrderInfo(id)
        if (!orderInfo) {
            console.error("not found recharge id => ", id)
            return
        }
        if (ActorModel.IsGM()) {
            let req = new Sproto.cs_recharge_normal_request();
            req.rechargeid = id;
            this.Rpc(C2sProtocol.cs_recharge_normal, req);
        } else {
            this._Pay(orderInfo)
        }
    }

    private _DoUpdateDoublechargeInfo(rsp: Sproto.sc_recharge_double_request) {
        this.reward = {}
        for (let data of rsp.reward || []) {
            this.reward[data] = true
        }
        this.finish = {}
        for (let data of rsp.finish || []) {
            this.finish[data] = true
        }
        this.choicerechare = rsp.choicerechare;
        MessageCenter.ins().dispatch(MessageDef.RECHARGE_UPDATE, rsp.reward);
    }


    /**首充 --领取奖励 */
    public sendRechargeFirstReward(id) {
        let req = new Sproto.cs_recharge_first_reward_request
        req.id = id;
        this.Rpc(C2sProtocol.cs_recharge_first_reward, req);
    }

    /**每日充值 1=任意金额奖励，2=48元奖励 --领取奖励*/
    public sendRechargeDailyReward(id) {
        let req = new Sproto.cs_recharge_get_dailyrecharge_reward_request
        req.rewardid = id;
        this.Rpc(C2sProtocol.cs_recharge_get_dailyrecharge_reward, req);
    }


    /**首充 */
    private _DoUpdateFirstChargeInfo(rsp: Sproto.sc_recharge_first_info_request) {
        this.rechargeNum = rsp.rechargeNum;
        this.rewardState = rsp.reward;
        this.firsttime = rsp.firsttime
        MessageCenter.ins().dispatch(MessageDef.RECHARGE_FIRST_UPDATE);
    }

    /**每日充值 */
    private _DoUpdateReChargDaily(rsp: Sproto.sc_recharge_dailyrechare_request) {
        this.dailyRechare = rsp.dailyrechare;
        this.dailyReward = rsp.rewardmark;
        this.dailyId = rsp.dailyid;
        // this.dailyId = (GameServer.serverOpenDay % 8) + 1
        this.xuanNvCard = true;
        MessageCenter.ins().dispatch(MessageDef.RECHARGE_DAILY_UPDATE);
    }

    /**玩家充值数量 */
    private _DoUpdateReChargeCount(rsp: Sproto.sc_recharge_count_request) {
        // this.todayRechargeNum = rsp.today;
        this.totalRechargeNum = rsp.total;
        MessageCenter.ins().dispatch(MessageDef.PLAYER_RECHARGE_UPDATE);
    }

    /**领取充值特惠奖励 */
    public sendGiftAward() {
        if (this.choicerechare > 0) {
            let req = new Sproto.cs_recharge_get_choice_reward_request
            this.Rpc(C2sProtocol.cs_recharge_get_choice_reward, req);
        }
    }


    /** */
    private static GetBaseInfo(): RechargeOrderInfo {
        let orderInfo: any = {}
        orderInfo.productCode = "0"
        orderInfo.uid = Main.Instance.UserName
        orderInfo.username = Main.Instance.UserName || ""
        orderInfo.userRoleId = GameGlobal.actorModel.actorID + ""
        orderInfo.userRoleName = GameGlobal.actorModel.name + ""
        orderInfo.userServer = Main.Instance.mConnectServerData.id + ""
        orderInfo.userLevel = (GameGlobal.actorModel.level) + ""
        orderInfo.count = 1;
        orderInfo.quantifier = '个';
        orderInfo.callbackUrl = 'http://zzby.mjh5.com:8501'
        orderInfo.extrasParams = Main.Instance.mConnectServerData.id + "," + GameGlobal.actorModel.actorID;
        orderInfo.vipLevel = UserVip.ins().lv || 0

        return orderInfo
    }

    private static GetYbOrderInfo(id: number) {
        let config = GameGlobal.Config.PayItemsConfig
        let configData = null
        for (let key in config) {
            if (config[key].id == id) {
                configData = config[key]
                break
            }
        }
        if (!configData) {
            console.log("not found pay id", id)
            return
        }
        let orderInfo = RechargeModel.GetBaseInfo()
        orderInfo.cpOrderNo = 'yborderno00000' + id;
        orderInfo.amount = configData.cash + ""
        orderInfo.subject = configData.itemName + ""
        orderInfo.desc = configData.itemName + ""
        orderInfo.goodsId = this.GetGoodsId(RechargeGoodsType.YUAN_BAO, id)
        orderInfo.extrasParams += ',' + this.GetGoodsId(RechargeGoodsType.YUAN_BAO, id)
        return orderInfo
    }

    private static GetGoodsId(type: RechargeGoodsType, index: number): number {
        switch (type) {
            case RechargeGoodsType.YUAN_BAO: return index;
            case RechargeGoodsType.MONTY_CARD: return 10000 + index;
            case RechargeGoodsType.INVEST: return 20000 + index;
            case RechargeGoodsType.GOD_01: return 1010000 + index;
            case RechargeGoodsType.GOD_02: return 1020000 + index;
            case RechargeGoodsType.RED_BAG: return index;
        }
        return index
    }

    private _Pay(orderInfo: RechargeOrderInfo) {
        if (window["__REC__"]) {
            this.Rpc(C2sProtocol.cs_recharge_get_order_number, null, (rsp) => {
                let rspData = rsp as Sproto.cs_recharge_get_order_number_response
                orderInfo.cpNo = rspData.order_number + ""
                window["__REC__"](orderInfo)
            })
        } else {
            console.error("not recharge !!!")
        }
    }
}

enum RechargeGoodsType {
    YUAN_BAO = 0,		// 元宝
    MONTY_CARD = 1,		// 月卡
    INVEST = 2,			// 投资
    GOD_01 = 3,
    GOD_02 = 4,
    RED_BAG = 5,
}

interface RechargeOrderInfo {
    productCode				// QuickSDK后台自动分配的参数
    uid						// 渠道UID
    username				// 渠道username
    userRoleId				// 游戏内角色ID
    userRoleName			// 游戏角色
    userServer				// 角色所在区服
    userLevel				// 角色等级
    cpOrderNo				// 游戏内的订单,服务器通知中会回传
    amount					// 购买金额
    count					// 购买商品个数
    quantifier				// 购买商品单位，如，个
    subject					// 道具名称
    desc					// 道具描述
    callbackUrl				// 服务器通知地址
    extrasParams			// 透传参数,服务器通知中原样回传
    goodsId					// 商品ID

    cpNo					// 订单唯一id，没任何用，平台需要
}
