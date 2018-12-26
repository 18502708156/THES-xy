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
var FuncOpenModel = (function (_super) {
    __extends(FuncOpenModel, _super);
    function FuncOpenModel() {
        return _super.call(this) || this;
        // GameGlobal.MessageCenter.addListener(MessageDef.LEVEL_CHANGE, this._ConditionChange, this)
        // GameGlobal.MessageCenter.addListener(MessageDef.GUANQIA_CHANGE, this._ConditionChange, this)
    }
    // public static MAX = 10
    // public static INDEX_TO_NAME = [
    // 	"",
    // 	"个人BOSS",
    // 	"披风",
    // 	"威名",
    // 	"PK",
    // 	"宝石副本",
    // 	"元神副本",
    // 	"龙装副本",
    // 	"斩将台",
    // 	"经验玉",
    // 	"帮会"
    // ]
    FuncOpenModel.ins = function () {
        return _super.ins.call(this);
    };
    FuncOpenModel.prototype.SendGetFuncOpen = function (index) {
        var req = new Sproto.cs_get_gongnengyugao_reward_request;
        req.index = index;
        this.Rpc(C2sProtocol.cs_get_gongnengyugao_reward, req, function (rsp) {
            var rspData = rsp;
            if (rspData.index == 0) {
                UserTips.ins().showTips("领取错误");
            }
            else {
                GameGlobal.actorModel.mFuncOpen = BitUtil.Set(GameGlobal.actorModel.mFuncOpen, rspData.index, true);
                // let icon:FuncOpenIconRule = FuncOpenIconRule.SelfTarget;
                // if(icon)
                // {
                // 	icon.checkShowIcon();
                // 	icon.checkShowRedPoint();
                // 	icon.update();
                // }
                // GameGlobal.MessageCenter.dispatch(MessageDef.FUNC_OPEN_UPDATE)
            }
        });
    };
    Object.defineProperty(FuncOpenModel.prototype, "m_Reward", {
        // 初始化计时器
        // private m_InitCounter = 1
        // private m_CurConfigData = null
        // private _ConditionChange() {
        // 	if (--this.m_InitCounter > 0) {
        // 		return
        // 	}
        // 	if (this.m_CurConfigData == null) {
        // 		this._SetNextConfigData()
        // 		return
        // 	}
        // 	this.CheckAndShow()
        // }
        // public CheckAndShow() {
        // 	if (this.m_CurConfigData == null) {
        // 		return
        // 	}
        // 	if (!ViewManager.ins().isShow(PlayFunView)) {
        // 		return
        // 	}
        // 	if (FuncOpenModel.CheckByData(this.m_CurConfigData)) {
        // 		this._SetNextConfigData()
        // 		ViewManager.ins().open(FuncOpenPanel)
        // 	}
        // }
        // 设置下一个检查的数据
        // private _SetNextConfigData() {
        // 	let data = this.GetNextConfigData()
        // 	if (data == null) {
        // 		//  清空数据
        // 		this.m_CurConfigData = null
        // 		GameGlobal.MessageCenter.removeListener(MessageDef.LEVEL_CHANGE, this._ConditionChange, this)
        // 		GameGlobal.MessageCenter.removeListener(MessageDef.GUANQIA_CHANGE, this._ConditionChange, this)
        // 		return
        // 	}
        // 	this.m_CurConfigData = data.openLv
        // }
        get: function () {
            return GameGlobal.actorModel.mFuncOpen;
        },
        enumerable: true,
        configurable: true
    });
    FuncOpenModel.prototype.GetNextIndex = function () {
        var config = GameGlobal.Config.FuncNoticeConfig;
        var i = FuncOpenModel.MAX_COUNT;
        var index = -1;
        var len = 0;
        for (i; i > len; i--) {
            var cfgObj = config[i];
            if (cfgObj) {
                if (BitUtil.Has(this.m_Reward, i) == false) {
                    var state = FuncOpenModel.ins().GetRewardState(i);
                    if (state == RewardState.CanGet) {
                        index = i;
                        break;
                    }
                    else if (state == RewardState.NotReached) {
                        index = i;
                    }
                }
            }
        }
        return index;
    };
    // public GetNextConfigData(): any {
    // 	let index = this.GetNextIndex()
    // 	if (index != -1) {
    // 		return GameGlobal.Config.FuncNoticeConfig[index]
    // 	}
    // 	return null
    // }
    // public GetCurCanRewardIndex(): number {
    // 	for (let i = 1; i <= FuncOpenModel.MAX; ++i) {
    // 		if (this.CanReward(i)) {
    // 			return i
    // 		}
    // 	}
    // 	return -1
    // }
    FuncOpenModel.prototype.CanReward = function (index) {
        return this.GetRewardState(index) == RewardState.CanGet;
    };
    FuncOpenModel.prototype.GetRewardState = function (index) {
        var configData = GameGlobal.Config.FuncNoticeConfig[index];
        if (!configData)
            return RewardState.Undo;
        if (FuncOpenModel.CheckByData(configData.openLv)) {
            if (BitUtil.Has(this.m_Reward, index)) {
                return RewardState.Gotten;
            }
            return RewardState.CanGet;
        }
        return RewardState.NotReached;
    };
    FuncOpenModel.prototype.HasReward = function () {
        for (var i = 1; i <= FuncOpenModel.MAX_COUNT; ++i) {
            if (this.CanReward(i)) {
                return true;
            }
        }
        return false;
    };
    FuncOpenModel.Check = function (type, value) {
        switch (type) {
            case 1:
                return GameGlobal.UserFb.guanqiaID >= value;
            case 2:
                return GameGlobal.actorModel.level >= value;
            case 4:
                return GameServer.serverOpenDay >= value;
            case 5:
                return GameServer.loginDay >= value;
        }
        return false;
    };
    FuncOpenModel.CheckByData = function (openLvs) {
        var i;
        var len = openLvs.length;
        for (i = 0; i < len; i++) {
            if (FuncOpenModel.Check(openLvs[i][0], openLvs[i][1]) == false) {
                return false;
            }
        }
        return true;
    };
    FuncOpenModel.GetTipStrByData = function (openLvs, sign) {
        var str = "";
        var i;
        var len = openLvs.length;
        for (i = 0; i < len; i++) {
            if (sign && str != "")
                str += sign;
            str += this.GetTipStr(openLvs[i][0], openLvs[i][1]);
        }
        return str;
    };
    // public static GetTipStrByIndex(index: number): string {
    // 	let data = GameGlobal.Config.FuncNoticeConfig[index]
    // 	let prefix = FuncOpenModel.GetTipStr(data.openLv[0], data.openLv[1])
    // 	return prefix// + "开启" + FuncOpenModel.INDEX_TO_NAME[index]
    // }
    FuncOpenModel.GetTipStr = function (type, value) {
        switch (type) {
            case 1:
                return "\u901A\u8FC7\u7B2C" + value + "\u5173";
            case 2:
                if (value >= 1000) {
                    return "\u89D2\u8272" + Math.floor(value / 1000) + "\u9636";
                }
                else {
                    return "\u89D2\u8272\u7B49\u7EA7\u8FBE\u5230" + value + "\u7EA7";
                }
            case 4:
                return "\u5F00\u670D\u7B2C" + value + "\u5929";
            case 5:
                return "\u767B\u9646\u7B2C" + value + "\u5929";
        }
        return "";
    };
    FuncOpenModel.Send = function () {
        var req = new Sproto.cs_set_clientvalue_request;
        req.value = GameGlobal.actorModel.mSaveData;
        req.list = GameGlobal.actorModel.mSaveDataList;
        GameSocket.ins().Rpc(C2sProtocol.cs_set_clientvalue, req);
    };
    FuncOpenModel.HasSaveData = function (value) {
        return BitUtil.Has(GameGlobal.actorModel.mSaveData, value);
    };
    FuncOpenModel.SetData = function (index, value) {
        GameGlobal.actorModel.mSaveData = BitUtil.Set(GameGlobal.actorModel.mSaveData, index, value);
        this.Send();
    };
    FuncOpenModel.GetValue = function (index) {
        var value = GameGlobal.actorModel.mSaveDataList[index];
        if (value == null) {
            value = FuncOpenModel.DEF_VALUE[index];
        }
        return value || 0;
    };
    FuncOpenModel.SetValue = function (index, value) {
        var oldValue = GameGlobal.actorModel.mSaveDataList[index];
        if (oldValue == value) {
            return;
        }
        GameGlobal.actorModel.mSaveDataList[index] = value;
        this.Send();
    };
    FuncOpenModel.MAX_COUNT = 31;
    // public static GetTipStr2(type: number, value: number): string {
    // 	switch (type) {
    // 		case 1:
    // 			return `通过第${value}关`
    // 		case 2:
    // 			return `角色等级达到${value}级`
    // 	}
    // 	return ""
    // }
    // 客户端保存数据
    FuncOpenModel.SAVE_GAME_OTHER_PLAYER = 1;
    FuncOpenModel.SAVE_GAME_BLOOD_VIEW = 2;
    FuncOpenModel.SAVE_BAG_RONG_LIAN = 3;
    FuncOpenModel.SAVE_SYSTEM_SETTING_SY = 4;
    FuncOpenModel.SAVE_SYSTEM_SETTING_YX = 5;
    FuncOpenModel.SAVE_SYSTEM_SETTING_CB = 6;
    FuncOpenModel.SAVE_SYSTEM_SETTING_CH = 7;
    FuncOpenModel.SAVE_SYSTEM_SETTING_TX = 8;
    FuncOpenModel.SAVE_SYSTEM_SETTING_XW = 9;
    FuncOpenModel.SAVE_SYSTEM_SETTING_FZ = 10;
    FuncOpenModel.SAVE_SYSTEM_SETTING_TL = 11;
    FuncOpenModel.SAVE_SYSTEM_SETTING_SH = 12;
    FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER = 13;
    // public static SAVE_SYSTEM_SETTING_ZDSD1 = 14
    FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2 = 15;
    FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3 = 16;
    FuncOpenModel.SAVE_SYSTEM_SHOW_XUANNV = 17; // 第一次限时玄女界面
    FuncOpenModel.SAVE_GOD_PIE = 18; // 天降好礼提示
    FuncOpenModel.SAVE_DATA_FALG = false;
    FuncOpenModel.SAVE_VAL_SOUND = 0;
    FuncOpenModel.DEF_VALUE = (_a = {},
        _a[FuncOpenModel.SAVE_VAL_SOUND] = 0.5,
        _a);
    return FuncOpenModel;
}(BaseSystem));
__reflect(FuncOpenModel.prototype, "FuncOpenModel");
var _a;
//# sourceMappingURL=FuncOpenModel.js.map