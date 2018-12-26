/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/23 18:15
 * @meaning: 称号管理类
 *
 **/
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
var UserTitle = (function (_super) {
    __extends(UserTitle, _super);
    function UserTitle() {
        var _this = _super.call(this) || this;
        _this.mMsgDefUpdate = MessageDef.ROLE_TITLE_UPDATE;
        // this.mRedPoint = new UserWingRedPoint(this)
        _this.regNetMsg(S2cProtocol.sc_effect_title_update, _this.doWaveData);
        return _this;
    }
    UserTitle.prototype.Init = function () {
        this.titleConfig = GameGlobal.Config.TitleConf;
        _super.prototype.Init.call(this);
    };
    UserTitle.prototype.GetSkinConfig = function () {
        var config = this.titleConfig;
        var list = [];
        for (var k in config) {
            if (parseInt(k) >= 1000) {
                list.push(config[k]);
            }
        }
        list.sort(function (lhs, rhs) {
            return lhs.skinid - rhs.skinid;
        });
        return list;
        // CommonUtils.GetArray(this.titleConfig, "skinid")
    };
    UserTitle.prototype.HasDress = function (id) {
        var bHave = false;
        if (this.tServerData) {
            for (var item in this.tServerData.ownlist) {
                if (this.tServerData.ownlist[item].id === id) {
                    bHave = true;
                    break;
                }
            }
        }
        return bHave;
    };
    UserTitle.prototype.GetDressData = function (id) {
        if (this.tServerData) {
            for (var item in this.tServerData.ownlist) {
                if (this.tServerData.ownlist[item].id === id) {
                    return this.tServerData.ownlist[item];
                }
            }
        }
        return null;
    };
    UserTitle.prototype.getOwnList = function () {
        return this.tServerData.ownlist;
    };
    UserTitle.prototype.SendActiveDress = function (id) {
        var req;
        if (id === this.tServerData.wearid) {
            this.changDress(id);
        }
        else {
            req = new Sproto.cs_effect_title_activate_request;
            req.id = id;
            this.Rpc(C2sProtocol.cs_effect_title_activate, req);
        }
    };
    UserTitle.prototype.changDress = function (id) {
        var req;
        req = new Sproto.cs_effect_title_change_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_effect_title_change, req);
    };
    UserTitle.prototype.doWaveData = function (rsp) {
        var weardId = this.getWearId();
        this.tServerData = rsp; //赋值
        //发送更新数据
        GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_TITLE_UPDATE);
        // if (weardId != this.getWearId()) {
        GameGlobal.RaidMgr.UpdateRole();
        // }
    };
    //att [] 属性数组 用于取属性战力
    UserTitle.prototype.GetDressPower = function () {
        var power = 0;
        for (var item in this.titleConfig) {
            for (var index in this.tServerData.ownlist) {
                var wearid = this.tServerData.ownlist[index].id;
                if (wearid === this.titleConfig[item].skinid) {
                    power += ItemConfig.CalcAttrScoreValue(this.titleConfig[item].attrpower);
                }
            }
        }
        return power;
    };
    UserTitle.prototype.GetActiveDressCount = function () {
        if (!this.tServerData) {
            return 0;
        }
        return this.tServerData.ownlist.length;
    };
    //获取已经穿戴id
    UserTitle.prototype.getWearId = function () {
        if (this.tServerData) {
            return this.tServerData.wearid;
        }
        return 0;
    };
    UserTitle.prototype.GetIndex = function (index) {
        if (this.tServerData && this.tServerData.ownlist) {
            return this.tServerData.ownlist[index] || null;
        }
        return null;
    };
    //獲取半分比
    UserTitle.prototype.GetAddAttrRate = function (type) {
        var pow = 0;
        var config = GameGlobal.Config.TitleAttrConf;
        for (var key in config) {
            if (this.HasDress(config[key].skinid) == true) {
                if (config[key].type == type)
                    pow += config[key].attrpower;
            }
        }
        return pow / 100;
    };
    return UserTitle;
}(BaseSystem));
__reflect(UserTitle.prototype, "UserTitle");
//# sourceMappingURL=UserTitle.js.map