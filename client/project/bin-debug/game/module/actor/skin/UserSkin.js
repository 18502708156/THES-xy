/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/25 16:15
 * @meaning: 时装管理类
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
var UserSkin = (function (_super) {
    __extends(UserSkin, _super);
    function UserSkin() {
        var _this = _super.call(this) || this;
        _this.mMsgDefUpdate = MessageDef.ROLE_SKIN_UPDATE;
        _this.titleConfig = []; //称号本地文件
        // this.mRedPoint = new UserWingRedPoint(this)
        _this.regNetMsg(S2cProtocol.sc_effect_skin_update, _this.doWaveData);
        return _this;
    }
    UserSkin.prototype.Init = function () {
        this.titleConfig = GameGlobal.Config.FashionSkinConfig;
        _super.prototype.Init.call(this);
    };
    UserSkin.prototype.GetSkinConfig = function () {
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
    UserSkin.prototype.HasDress = function (id) {
        var bHave = false;
        if (this.tServerData && this.tServerData.ownlist) {
            for (var item in this.tServerData.ownlist) {
                if (this.tServerData.ownlist[item].id === id) {
                    bHave = true;
                    break;
                }
            }
        }
        return bHave;
    };
    UserSkin.prototype.GetDressData = function (id) {
        if (this.tServerData) {
            for (var item in this.tServerData.ownlist) {
                if (this.tServerData.ownlist[item].id === id) {
                    return this.tServerData.ownlist[item];
                }
            }
        }
        return null;
    };
    UserSkin.prototype.SendActiveDress = function (id) {
        var req;
        if (this.tServerData && this.tServerData.wearid != null) {
            if (id === this.tServerData.wearid) {
                this.changDress(id);
            }
            else {
                req = new Sproto.cs_effect_skin_activate_request;
                req.id = id;
                this.Rpc(C2sProtocol.cs_effect_skin_activate, req);
            }
        }
    };
    UserSkin.prototype.changDress = function (id) {
        var req;
        req = new Sproto.cs_effect_skin_change_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_effect_skin_change, req);
    };
    UserSkin.prototype.doWaveData = function (rsp) {
        this.tServerData = rsp; //赋值
        //发送更新数据
        GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_SKIN_UPDATE);
        GameGlobal.RaidMgr.UpdateRole();
    };
    //att [] 属性数组 用于取属性战力
    UserSkin.prototype.GetDressPower = function () {
        var power = 0;
        for (var item in this.titleConfig) {
            if (this.tServerData && this.tServerData.ownlist) {
                for (var index in this.tServerData.ownlist) {
                    var wearid = this.tServerData.ownlist[index].id;
                    if (wearid === this.titleConfig[item][GameGlobal.actorModel.sex].skinid) {
                        power += ItemConfig.CalcAttrScoreValue(this.titleConfig[item][GameGlobal.actorModel.sex].attrpower);
                    }
                }
            }
        }
        return power;
    };
    //获取已经穿戴id
    UserSkin.prototype.getWearId = function () {
        if (this.tServerData) {
            return this.tServerData.wearid;
        }
        return 0;
    };
    UserSkin.prototype.GetActiveDressCount = function () {
        if (this.tServerData && this.tServerData.ownlist) {
            return this.tServerData.ownlist.length;
        }
        else {
            return 0;
        }
    };
    UserSkin.prototype.IsOpen = function (index) {
        0;
        // let openLevel = this.GetOpenLevel(index)
        // return this.mLevel >= openLevel
    };
    return UserSkin;
}(BaseSystem));
__reflect(UserSkin.prototype, "UserSkin");
//# sourceMappingURL=UserSkin.js.map