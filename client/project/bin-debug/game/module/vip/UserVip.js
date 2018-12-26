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
var UserVip = (function (_super) {
    __extends(UserVip, _super);
    function UserVip() {
        var _this = _super.call(this) || this;
        _this.lv = 0;
        _this.exp = 0;
        _this.state = 0;
        _this.otherreward = 0;
        _this.regNetMsg(S2cProtocol.sc_vip_update_data, _this.doUpdateVipData);
        return _this;
    }
    UserVip.ins = function () {
        return _super.ins.call(this);
    };
    /**
    * 领取VIP奖励
     * @param lv
     */
    UserVip.prototype.sendGetAwards = function (lv) {
        var req = new Sproto.cs_vip_get_awards_request;
        req.lv = lv;
        this.Rpc(C2sProtocol.cs_vip_get_awards, req);
    };
    ;
    /**
    * 领取玄女奖励
     * @param lv
     */
    UserVip.prototype.sendXuanNvAwards = function (lv) {
        var req = new Sproto.cs_vip_get_other_awards_request;
        req.lv = lv;
        this.Rpc(C2sProtocol.cs_vip_get_other_awards, req);
    };
    ;
    /**更新VIP数据 */
    UserVip.prototype.doUpdateVipData = function (bytes) {
        var oldLv = this.lv;
        var oldExp = this.exp;
        var oldState = this.state;
        this.lv = bytes.lv;
        this.exp = bytes.exp;
        this.state = bytes.state;
        this.otherreward = bytes.otherreward;
        if (this.lv != oldLv) {
            GameGlobal.MessageCenter.dispatch(MessageDef.VIP_LEVEL_CHANGE);
            Deblocking.Update(Deblocking.CHECK_TYPE_03);
        }
        if (this.exp != oldExp) {
            GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_EXP);
        }
        // if (this.state != oldState) {
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_AWARDS);
        // }
    };
    ;
    /**更新经验 */
    UserVip.prototype.doUpdataExp = function (bytes) {
        var lv = bytes.readShort();
        this.exp = bytes.readInt();
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_EXP);
        if (lv > this.lv) {
            this.lv = lv;
            GameGlobal.MessageCenter.dispatch(MessageDef.VIP_LEVEL_CHANGE);
        }
    };
    ;
    // /**更新领取奖励状态 */
    UserVip.prototype.doUpdateVipAwards = function (bytes) {
        this.state = bytes.readInt();
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_AWARDS);
    };
    ;
    /**获取奖励状态 */
    UserVip.prototype.getVipState = function () {
        var bool = false;
        for (var i = 1; i <= this.lv; i++) {
            if (this.state != undefined && ((this.state >> i) & 1) == 0) {
                bool = true;
                return bool;
            }
        }
        return bool;
    };
    ;
    UserVip.prototype.GetRewardState = function (lv) {
        if (this.state != null && (this.state >> lv) > 0) {
            return true;
        }
        return false;
    };
    UserVip.prototype.CheckRedPoint = function (vipLv) {
        var bool = false;
        if (!vipLv) {
            for (var i = 1; i <= this.lv; i++) {
                if (this.state != undefined && ((this.state >> i) & 1) == 0) {
                    bool = true;
                    return bool;
                }
            }
            return bool;
        }
        else {
            if (GameGlobal.actorModel.vipLv >= vipLv)
                return this.state != undefined && ((this.state >> vipLv) & 1) == 0;
            else
                return false;
        }
    };
    UserVip.MAX_LV = 20;
    return UserVip;
}(BaseSystem));
__reflect(UserVip.prototype, "UserVip");
//# sourceMappingURL=UserVip.js.map