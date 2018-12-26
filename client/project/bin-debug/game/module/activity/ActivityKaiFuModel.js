var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ActivityKaiFuModel = (function (_super) {
    __extends(ActivityKaiFuModel, _super);
    function ActivityKaiFuModel() {
        var _this = _super.call(this) || this;
        _this.m_type_activityId = {};
        _this.m_activityData = {};
        _this.m_ReachData = {};
        _this.m_rankInfoList = {};
        _this.advancedRank = [];
        _this.advancedRankMySelfe = 0;
        _this.advancedSelfPower = 0;
        _this.answerFisrstNe = "";
        _this.advancedInfo = new ActivityAdvancedInfo();
        _this.regNetMsg(S2cProtocol.sc_activity_info_res, _this._DoActivity_init_answer);
        _this.regNetMsg(S2cProtocol.sc_activity_init_info, _this._DoActivity_init_info);
        _this.regNetMsg(S2cProtocol.sc_activity_reward_result, _this._DoRewardResult);
        _this.regNetMsg(S2cProtocol.sc_activity_dabiao_info, _this._DoDaBiaoInfo);
        _this.regNetMsg(S2cProtocol.sc_activity_dabiao_reward, _this._DoDaBiaoRewardStatu);
        _this.regNetMsg(S2cProtocol.sc_activity_update_info, _this._DoActivityUpdate);
        _this.regNetMsg(S2cProtocol.sc_activity_race_history, _this._DoRaceHistory);
        //------开服进阶
        _this.regNetMsg(S2cProtocol.sc_advanced_info, _this._DoAdvanced_info);
        _this.regNetMsg(S2cProtocol.sc_advanced_update, _this._DoAdvanced_update);
        _this.regNetMsg(S2cProtocol.sc_advanced_rank, _this._DoAdvanced_Rank);
        _this.regNetMsg(S2cProtocol.sc_activity_luckwheel_ret, _this.luckwheel_ret);
        GameGlobal.MessageCenter.addListener(MessageDef.GAME_SERVER_UPDATE_DAY, _this.updateAdvancedData, _this);
        GameGlobal.MessageCenter.addListener(MessageDef.LEVEL_CHANGE, _this.updateAdvancedData, _this);
        return _this;
    }
    ActivityKaiFuModel.prototype.updateAdvancedData = function () {
        // this.advancedInfo.updateEndTime();
        this.advancedRank = [];
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW);
    };
    ActivityKaiFuModel.prototype.init = function () {
        for (var key in GameGlobal.Config.ActivitySumBtnConfig) {
            if (GameGlobal.Config.ActivitySumBtnConfig.hasOwnProperty(key)) {
                var cfgObj = GameGlobal.Config.ActivitySumBtnConfig[key];
                if (cfgObj) {
                    if (cfgObj.openId == 2) {
                        ActivityKaiFuModel.Ids_ActivityTarget.push(cfgObj.id);
                    }
                    else if (cfgObj.openId == 3) {
                        ActivityKaiFuModel.Ids_ActivityQiTian.push(cfgObj.id);
                    }
                }
            }
        }
    };
    // enum ActivityKaiFuJiJieType{
    // ride = 1,//坐骑 
    // wing = 2 ,//翅膀
    // fairy = 3 ,//守护
    // weapon = 4,//神兵
    // pet_psychic = 5 ,//宠物兽魂
    // pet_soul = 6,//宠物通灵
    // xianlv_circle = 7 ,//仙侣仙位
    // xianlv_position = 8,//仙侣法阵
    // tiannv = 9 ,//玄女
    // tiannv_nimbus = 10 ,//玄女灵气
    // tiannv_flower = 11,//玄女花辇
    /**获取自己的进阶等级 */
    ActivityKaiFuModel.prototype.GetMyAdvancedLevel = function (type) {
        var stage = 0;
        switch (type) {
            case ActivityKaiFuJiJieType.ride:
                stage = GameGlobal.UserRide.mLevel;
                break;
            case ActivityKaiFuJiJieType.wing:
                stage = GameGlobal.UserWing.mLevel;
                break;
            case ActivityKaiFuJiJieType.fairy:
                stage = GameGlobal.TianxModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.weapon:
                stage = GameGlobal.SwordModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.pet_psychic:
                stage = GameGlobal.PetShouhModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.pet_soul:
                stage = GameGlobal.PetTonglModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.xianlv_circle:
                stage = GameGlobal.XianlvXwModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.xianlv_position:
                stage = GameGlobal.XianlvFzModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.tiannv:
                stage = GameGlobal.HavingModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.tiannv_nimbus:
                stage = GameGlobal.HavingLingqModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.tiannv_flower:
                stage = GameGlobal.HavingHuanModel.mLevel;
                break;
            case ActivityKaiFuJiJieType.lingtong:
                stage = GameGlobal.LingtongPetModel.GetMaxPetLevel();
                break;
            case ActivityKaiFuJiJieType.lingtong_yuling:
                stage = GameGlobal.LingtongPetModel.GetYulCount();
                break;
            case ActivityKaiFuJiJieType.lingtong_fate:
                stage = GameGlobal.DestinyController.GetCount();
                break;
            case 100:
                stage = GameGlobal.actorModel.vipLv;
                break;
        }
        return stage;
    };
    /**打开进阶界面 */
    ActivityKaiFuModel.prototype.OpenAdvancedPanel = function (type) {
        switch (type) {
            case ActivityKaiFuJiJieType.ride:
                if (Deblocking.Check(DeblockingType.TYPE_9))
                    ViewManager.ins().open(RoleWin, 2);
                break;
            case ActivityKaiFuJiJieType.wing:
                if (Deblocking.Check(DeblockingType.TYPE_10))
                    ViewManager.ins().open(RoleWin, 3);
                break;
            case ActivityKaiFuJiJieType.fairy:
                if (Deblocking.Check(DeblockingType.TYPE_27))
                    ViewManager.ins().open(TianxianMainPanel, 0);
                break;
            case ActivityKaiFuJiJieType.weapon:
                if (Deblocking.Check(DeblockingType.TYPE_28))
                    ViewManager.ins().open(TianxianMainPanel, 1);
                break;
            case ActivityKaiFuJiJieType.pet_psychic:
                if (Deblocking.Check(DeblockingType.TYPE_14))
                    ViewManager.ins().open(PetMainPanel, 3);
                break;
            case ActivityKaiFuJiJieType.pet_soul:
                if (Deblocking.Check(DeblockingType.TYPE_13))
                    ViewManager.ins().open(PetMainPanel, 2);
                break;
            case ActivityKaiFuJiJieType.xianlv_circle:
                if (Deblocking.Check(DeblockingType.TYPE_18))
                    ViewManager.ins().open(XianlvMainPanel, 3);
                break;
            case ActivityKaiFuJiJieType.xianlv_position:
                if (Deblocking.Check(DeblockingType.TYPE_17))
                    ViewManager.ins().open(XianlvMainPanel, 2);
                break;
            case ActivityKaiFuJiJieType.tiannv:
                if (Deblocking.Check(DeblockingType.TYPE_19))
                    ViewManager.ins().open(HavingMainPanel, 0);
                break;
            case ActivityKaiFuJiJieType.tiannv_nimbus:
                if (Deblocking.Check(DeblockingType.TYPE_22))
                    ViewManager.ins().open(HavingMainPanel, 3);
                break;
            case ActivityKaiFuJiJieType.tiannv_flower:
                if (Deblocking.Check(DeblockingType.TYPE_21))
                    ViewManager.ins().open(HavingMainPanel, 2);
                break;
            case ActivityKaiFuJiJieType.lingtong:
                ViewManager.ins().open(LingtongMainPanel);
                break;
            case ActivityKaiFuJiJieType.lingtong_yuling:
                ViewManager.ins().open(LingtongMainPanel, 1);
                break;
            case ActivityKaiFuJiJieType.lingtong_fate:
                ViewManager.ins().open(LingtongMainPanel, 2);
                break;
        }
        return 0;
    };
    ActivityKaiFuModel.prototype.GetActivityDataById = function (id) {
        if (!id) {
            return null;
        }
        return this.m_activityData[id];
    };
    ActivityKaiFuModel.prototype.GetActivityDataByType = function (type) {
        for (var key in this.m_activityData) {
            var data = this.m_activityData[key];
            if (type == data.type) {
                return data;
            }
        }
        return null;
    };
    ActivityKaiFuModel.prototype.getisCangetDabiao = function (id) {
        for (var i = 1; i <= this.GetMyReachIndex(id); ++i) {
            if (!BitUtil.Has(this.GetMyReachDraw(id), i)) {
                return true;
            }
        }
        return this.checkRedPointTemp(id);
    };
    ActivityKaiFuModel.prototype.GetMyReachIndex = function (id) {
        if (this.m_ReachData[id] == null) {
            return 0;
        }
        return this.m_ReachData[id].index;
    };
    ActivityKaiFuModel.prototype.GetMyReachDraw = function (id) {
        if (this.m_ReachData[id] == null) {
            return 0;
        }
        return this.m_ReachData[id].draw;
    };
    /**客户端自己判断个人达标活动奖励 */
    ActivityKaiFuModel.prototype.checkRedPointTemp = function (id) {
        var IActivityBaseData = this.GetActivityDataById(id);
        if (!IActivityBaseData || !IActivityBaseData.isOpenActivity()) {
            return false;
        }
        return false;
    };
    //*************************发送协议************************** */
    ActivityKaiFuModel.prototype.Send_advanced_charger_reward = function (id) {
        var req = new Sproto.cs_advanced_charger_reward_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_advanced_charger_reward, req);
    };
    ActivityKaiFuModel.prototype.Send_advanced_lv_reward = function (type, id) {
        var req = new Sproto.cs_advanced_lv_reward_request;
        req.typ = type;
        req.id = id;
        this.Rpc(C2sProtocol.cs_advanced_lv_reward, req);
    };
    ActivityKaiFuModel.prototype.Send_advanced_rank = function (id) {
        var req = new Sproto.cs_advanced_rank_request;
        if (id != undefined) {
            req.baby = id;
            this.Rpc(C2sProtocol.cs_advanced_rank, req);
        }
        else
            this.Rpc(C2sProtocol.cs_advanced_rank);
    };
    ActivityKaiFuModel.prototype.Send_advanced_buy = function (id, num, type) {
        var req = new Sproto.cs_advanced_buy_request;
        req.id = id;
        req.num = num;
        req.typ = type;
        this.Rpc(C2sProtocol.cs_advanced_buy, req);
    };
    ActivityKaiFuModel.prototype.SendLevelInfo = function (activityId) {
        var req = new Sproto.cs_activity_send_level_info_request;
        req.activityID = activityId;
        this.Rpc(C2sProtocol.cs_activity_send_level_info, req);
    };
    ActivityKaiFuModel.prototype.SendRaceHistory = function () {
        this.Rpc(C2sProtocol.cs_activity_race_history);
    };
    /**
     * 获取奖励
     */
    ActivityKaiFuModel.prototype.sendReward = function (id, index) {
        var req = new Sproto.cs_activity_send_reward_request;
        req.id = id;
        req.index = index;
        this.Rpc(C2sProtocol.cs_activity_send_reward, req);
    };
    ActivityKaiFuModel.prototype.sendDabiaoInfo = function (activityID) {
        var req = new Sproto.cs_activity_send_dabiao_info_request;
        req.activityID = activityID;
        this.Rpc(C2sProtocol.cs_activity_send_dabiao_info, req);
    };
    //战宠副本 挑战战宠
    ActivityKaiFuModel.prototype.sendPetFightInfo = function (activityID) {
        var req = new Sproto.cs_activity_action_request;
        req.activityId = activityID;
        this.Rpc(C2sProtocol.cs_activity_action, req);
    };
    /**投资 */
    ActivityKaiFuModel.prototype.sendInvestment = function (activityID) {
        var req = new Sproto.cs_activity_open_request;
        req.id = activityID;
        this.Rpc(C2sProtocol.cs_activity_open, req);
    };
    //=============================================
    ActivityKaiFuModel.prototype._DoActivity_init_info = function (rsp) {
        var baseConfig = GameGlobal.Config.ActivityConfig;
        for (var _i = 0, _a = rsp.datas; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.basecfg) {
                baseConfig[data.basecfg.Id] = data.basecfg;
                if (data.btncfg) {
                    try {
                        GameGlobal.Config.ActivitySumBtnConfig[data.basecfg.Id] = JSON.parse(data.btncfg) || {};
                    }
                    catch (e) {
                        console.error(data.btncfg);
                        console.error(e);
                    }
                }
                if (data.basecfg.activityType) {
                    try {
                        GameGlobal.Config["ActivityType" + data.basecfg.activityType + "Config"][data.basecfg.Id] = JSON.parse(data.config) || {};
                    }
                    catch (e) {
                        console.error(data.basecfg);
                        console.error(e);
                    }
                }
                else {
                    console.error("not activityType => ", data.basecfg);
                }
            }
            var acdata = ActivityKaiFuModel.GetActivityData(data);
            if (acdata) {
                var id = acdata.baseData.id;
                if (this.m_activityData[id]) {
                    this.m_activityData[id].UpdateBase(acdata.baseData);
                    this.m_activityData[id].update(acdata);
                    GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_UPDATE, id);
                }
                else {
                    var n = ActivityDataFactory.create(acdata);
                    n && (this.m_activityData[n.id] = n);
                }
            }
        }
        MessageCenter.ins().dispatch(MessageDef.ACTIVITY_INFO);
        // console.log(GameServer.serverTime);
        // console.log("==========================");
    };
    ActivityKaiFuModel.prototype._DoActivity_init_answer = function (rsp) {
        this.answerFisrstNe = rsp.answer;
    };
    ActivityKaiFuModel.prototype._DoRewardResult = function (e) {
        var index = e.id;
        if (this.m_activityData[index]) {
            var activityData = ActivityKaiFuModel.GetActivityData(e.data);
            this.m_activityData[index].UpdateBase(activityData.baseData);
            this.m_activityData[index].update(activityData);
            GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_UPDATE, index);
        }
    };
    ActivityKaiFuModel.prototype._DoDaBiaoInfo = function (rsp) {
        var array = this.m_rankInfoList[rsp.acId] = [];
        for (var i = 0; rsp.rankInfo.length > i; i++) {
            var data = new DabiaoRankData();
            array.push(data);
            data.prase(rsp.rankInfo[i], null);
        }
        this.m_ReachData[rsp.acId] = rsp;
        rsp.rankInfo = null;
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_DABIAO_UPDATE);
    };
    ActivityKaiFuModel.prototype._DoDaBiaoRewardStatu = function (e) {
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_IS_GET_AWARDS);
    };
    ActivityKaiFuModel.prototype._DoActivityUpdate = function (rsp) {
        var index = rsp.index;
        if (this.m_activityData[index]) {
            var activityData = ActivityKaiFuModel.GetActivityData(rsp.data);
            this.m_activityData[index].UpdateBase(activityData.baseData);
            this.m_activityData[index].update(activityData);
            GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_UPDATE, index);
        }
    };
    ActivityKaiFuModel.prototype._DoRaceHistory = function (rsp) {
        this.m_RaceHistory = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_RACE_HISTORY);
    };
    ActivityKaiFuModel.prototype._DoAdvanced_info = function (rsp) {
        this.advancedInfo.prase(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW);
    };
    ActivityKaiFuModel.prototype._DoAdvanced_update = function (rsp) {
        if (rsp.shop)
            this.advancedInfo.updateShop(rsp.shop);
        if (rsp.advancedReward)
            this.advancedInfo.updateAdvancedReward(rsp.advancedReward);
        if (rsp.chargerReward)
            this.advancedInfo.chargerReward = rsp.chargerReward;
        if (rsp.dayCharger)
            this.advancedInfo.dayChargeValue = rsp.dayCharger;
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW);
    };
    ActivityKaiFuModel.prototype._DoAdvanced_Rank = function (rsp) {
        this.advancedRank = rsp.datas || [];
        this.advancedRankMySelfe = rsp.selfRank;
        this.advancedSelfPower = rsp.selfPower;
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_RANK);
    };
    //===================================
    ActivityKaiFuModel.GetActivityData = function (data) {
        // for (let i = 1; i <= 27; ++i) {
        // 	let typeData = data["type" + (i < 10 ? ("0" + i) : i)]
        // 	if (typeData) {
        // 		return typeData
        // 	}
        // }
        for (var key in data) {
            if (key.indexOf("type") == 0)
                return data[key];
        }
        return null;
    };
    ActivityKaiFuModel.pushJiJieBtn = function (comp) {
        this.jjkh_btns.push(comp);
    };
    ActivityKaiFuModel.setJiJieOpenViewData = function (type) {
        // if (!Deblocking.Check(DeblockingType.TYPE_109, true)) {
        // 	return;
        // }
        // this.open_jjkh_view[type] = true;
        // GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW)
    };
    ActivityKaiFuModel.ShowJiJieKuangHuanIcon = function (btn, typeArr) {
        if (!Deblocking.Check(DeblockingType.TYPE_109, true)) {
            return;
        }
        var types = GameGlobal.ActivityKaiFuModel.GetAdvancedTypeArr();
        if (btn && btn['jjkh_img']) {
            var type = void 0;
            var show = false;
            var i = void 0;
            var len = typeArr.length;
            for (i = 0; i < len; i++) {
                type = typeArr[i];
                // if (!this.open_jjkh_view[type]) {
                if (types.indexOf(type) != -1) {
                    show = true;
                    break;
                }
                // }
            }
            btn['jjkh_img'].visible = show;
        }
    };
    ActivityKaiFuModel.prototype.GetAdvancedTypeArr = function () {
        var arr = [];
        var serverDay = GameServer.serverOpenDay;
        var ProgressCrazyBaseConfig = GameGlobal.Config.ProgressCrazyBaseConfig;
        if (serverDay <= ProgressCrazyBaseConfig.initialorder.length) {
            arr.push(ProgressCrazyBaseConfig.initialorder[serverDay - 1]);
        }
        else {
            var i = void 0;
            var index = (serverDay - ProgressCrazyBaseConfig.initialorder.length - 1) % ProgressCrazyBaseConfig.progressorder.length;
            arr = ProgressCrazyBaseConfig.progressorder[index];
        }
        return arr;
    };
    ActivityKaiFuModel.prototype.GetAdvancedReChargeType = function () {
        var serverDay = GameServer.serverOpenDay;
        var ProgressCrazyBaseConfig = GameGlobal.Config.ProgressCrazyBaseConfig;
        if (serverDay <= ProgressCrazyBaseConfig.initialorder.length) {
            return ProgressCrazyBaseConfig.initialorder[serverDay - 1];
        }
        else {
            var i = void 0;
            var index = (serverDay - ProgressCrazyBaseConfig.initialorder.length - 1) % ProgressCrazyBaseConfig.progressorder.length;
            return ProgressCrazyBaseConfig.rechargeorder[index];
        }
    };
    /**开服进阶 */
    ActivityKaiFuModel.prototype.RedPointAdvanced = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_109, true)) {
            return false;
        }
        var arr = this.GetAdvancedTypeArr();
        var i;
        var len = arr.length;
        for (i = 0; i < len; i++) {
            if (this.RedPointAdvancedUpLevelByType(arr[i]) == true) {
                return true;
            }
        }
        if (this.RedPointAdvancedReCharge() == true) {
            return true;
        }
        return false;
    };
    ActivityKaiFuModel.prototype.RedPointAdvancedUpLevelByType = function (type) {
        var config = GameGlobal.Config.ProgressCrazyRewardConfig;
        var obj = config[type];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var cfgObj = obj[key];
                var canGet = GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(type) >= cfgObj.value;
                if (canGet) {
                    var getted = GameGlobal.ActivityKaiFuModel.advancedInfo.GetAdvancedReward(type, cfgObj.index);
                    if (!getted)
                        return true;
                }
            }
        }
        return false;
    };
    ActivityKaiFuModel.prototype.RedPointAdvancedReCharge = function () {
        var type = this.GetAdvancedReChargeType();
        var config = GameGlobal.Config.ProgressCrazyRechargeConfig;
        var obj = config[type];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var cfgObj = obj[key];
                var canGet = GameGlobal.ActivityKaiFuModel.advancedInfo.dayChargeValue >= cfgObj.money;
                if (canGet) {
                    var getted = GameGlobal.ActivityKaiFuModel.advancedInfo.GetChargeReward(cfgObj.id);
                    if (!getted)
                        return true;
                }
            }
        }
        return false;
    };
    ActivityKaiFuModel.prototype.RedPointAdvanceShop = function () {
        var type = this.GetAdvancedReChargeType();
        var config = GameGlobal.Config.ProgressCrazyShopConfig;
        var configData = config[type];
        for (var key in configData) {
            var data = configData[key];
            if (data.type.type == 3 && this.advancedInfo.getBuyNum(data.shopid) >= data.type.value) {
                continue;
            }
            if (GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(data.value.type) < data.value.value) {
                continue;
            }
            var goldId = data.gold.id;
            if (goldId == MoneyConst.byb || goldId == MoneyConst.gold) {
                if (Checker.Money(goldId, data.gold.count, false)) {
                    return true;
                }
            }
        }
        return false;
    };
    /**七天目标 */
    ActivityKaiFuModel.prototype.RedPointTarget = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_97, true) &&
            !Deblocking.Check(DeblockingType.TYPE_98, true) &&
            !Deblocking.Check(DeblockingType.TYPE_99, true) &&
            !Deblocking.Check(DeblockingType.TYPE_100, true) &&
            !Deblocking.Check(DeblockingType.TYPE_101, true) &&
            !Deblocking.Check(DeblockingType.TYPE_102, true)) {
            return false;
        }
        var ids = ActivityKaiFuModel.Ids_ActivityTarget;
        var i;
        var len = ids.length;
        for (i = 0; i < len; i++) {
            var actData = this.GetActivityDataById(ids[i]);
            if (actData && actData.isOpenActivity()) {
                if (actData.hasReward()) {
                    return true;
                }
            }
        }
        return false;
    };
    /**七天尊享 */
    ActivityKaiFuModel.prototype.RedPointQiTian = function () {
        return false;
        // if (!Deblocking.Check(DeblockingType.TYPE_103, true)) {
        // 	return false;
        // }
        // let ids = ActivityKaiFuModel.Ids_ActivityQiTian;
        // let i: number;
        // let len: number = ids.length;
        // for (i = 0; i < len; i++) {
        // 	let actData = this.GetActivityDataById(ids[i]);
        // 	if (actData) {
        // 		if (actData.hasReward()) {
        // 			return true;
        // 		}
        // 	}
        // }
        // return false;
    };
    ActivityKaiFuModel.prototype.hasActivityQiTian = function () {
        return false;
        // if (!Deblocking.Check(DeblockingType.TYPE_103, true)) {
        // 	return false;
        // }
        // let ids = ActivityKaiFuModel.Ids_ActivityQiTian;
        // let i: number;
        // let len: number = ids.length;
        // for (i = 0; i < len; i++) {
        // 	let actData = this.GetActivityDataById(ids[i]);
        // 	if (actData && actData.isOpenActivity()) {
        // 		return true;
        // 	}
        // }
        // return false;
    };
    ActivityKaiFuModel.prototype.hasActivityTarget = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_97, true) &&
            !Deblocking.Check(DeblockingType.TYPE_98, true) &&
            !Deblocking.Check(DeblockingType.TYPE_99, true) &&
            !Deblocking.Check(DeblockingType.TYPE_100, true) &&
            !Deblocking.Check(DeblockingType.TYPE_101, true) &&
            !Deblocking.Check(DeblockingType.TYPE_102, true)) {
            return false;
        }
        var ids = ActivityKaiFuModel.Ids_ActivityTarget;
        var i;
        var len = ids.length;
        for (i = 0; i < len; i++) {
            var actData = this.GetActivityDataById(ids[i]);
            if (actData && actData.isOpenActivity()) {
                return true;
            }
        }
        return false;
    };
    ActivityKaiFuModel.prototype.jingCai_huoDong = function () {
        var serverDay = GameServer.serverOpenDay;
        var ActivityConfig = GameGlobal.Config.ActivityConfig;
        var ActivitySumBtnConfig = GameGlobal.Config.ActivitySumBtnConfig;
        var dataList = [];
        var idList = [];
        for (var Config in ActivitySumBtnConfig) {
            if (ActivitySumBtnConfig[Number(Config)].openId == 4) {
                dataList.push(Number(Config));
            }
        }
        for (var i = 0; i < dataList.length; i++) {
            var id = dataList[i];
            var cls = void 0;
            if (ActivityConfig[id].activityType == 6) {
                cls = ZhuangPanShopPanel;
            }
            if (ActivityConfig[id].activityType == 26) {
                cls = zheKouBasePanel;
            }
            var BaseModel = GameGlobal.ActivityKaiFuModel.GetActivityDataById(id);
            if (BaseModel) {
                if (BaseModel.openState) {
                    idList.push(id);
                }
            }
        }
        return idList;
    };
    ActivityKaiFuModel.prototype.jingCaiIconRedPoin = function () {
        var dataList = this.jingCai_huoDong();
        var ActivityConfig = GameGlobal.Config.ActivityConfig;
        for (var i = 0; i < dataList.length; i++) {
            if (this.jingCaiRedPoint(ActivityConfig[dataList[i]].activityType, dataList[i], i)[1]) {
                return true;
            }
        }
        return false;
    };
    ActivityKaiFuModel.prototype.luckwheel_ret = function (rsp) {
        GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ZHUANG_PAN_RULE, rsp);
    };
    ActivityKaiFuModel.prototype.jingCaiRedPoint = function (type, id, index) {
        if (type == 6) {
            var data = this.GetActivityDataById(id);
            if (!data) {
                return [index, false];
            }
            if (data.drawtime > 0) {
                return [index, true];
            }
        }
        return [index, false];
    };
    ActivityKaiFuModel.Ids_ActivityTarget = [];
    ActivityKaiFuModel.Ids_ActivityQiTian = [];
    // private static open_jjkh_view = {};
    ActivityKaiFuModel.jjkh_btns = [];
    return ActivityKaiFuModel;
}(BaseSystem));
__reflect(ActivityKaiFuModel.prototype, "ActivityKaiFuModel");
//# sourceMappingURL=ActivityKaiFuModel.js.map