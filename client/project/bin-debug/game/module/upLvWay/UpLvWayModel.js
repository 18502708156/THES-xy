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
var UpLvWayModel = (function (_super) {
    __extends(UpLvWayModel, _super);
    function UpLvWayModel() {
        var _this = _super.call(this) || this;
        _this.dic = {};
        //积分
        _this.score = 0;
        _this.rewards = [];
        _this.mRedPoint = new UpLvWayRedPoint(_this);
        _this.regNetMsg(S2cProtocol.sc_enhance_info, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_enhance_add_info, _this._DoUpdate);
        return _this;
    }
    UpLvWayModel.prototype._DoInitInfo = function (rsp) {
        this.score = rsp.point;
        this.rewards = rsp.rewards;
        for (var i = 0; i < rsp.data.length; i++) {
            var data = rsp.data[i];
            this.dic[data["no"]] = data["val"];
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.UPLVWAY_CHANGE_SCORE);
    };
    UpLvWayModel.prototype._DoUpdate = function (rsp) {
        this.score = rsp.point;
        this.dic[rsp.no] = rsp.val;
        GameGlobal.MessageCenter.dispatch(MessageDef.UPLVWAY_CHANGE_SCORE);
    };
    UpLvWayModel.prototype._Reward = function (ID) {
        var _this = this;
        var req = new Sproto.cs_enhance_get_reward_request;
        req.no = ID;
        this.Rpc(C2sProtocol.cs_enhance_get_reward, req, function (rsp) {
            if (rsp.ret == true) {
                if (_this.rewards.indexOf(req.no) == -1)
                    _this.rewards.push(rsp.no);
                GameGlobal.MessageCenter.dispatch(MessageDef.UPLVWAY_ACQUIRE_ITEM);
            }
        }, this);
    };
    UpLvWayModel.prototype.isFinish = function (id, tabNeedCount) {
        for (var key in this.dic) {
            if (Number(key) == id) {
                if (this.dic[key] >= tabNeedCount)
                    return true;
            }
        }
        return false;
    };
    return UpLvWayModel;
}(BaseSystem));
__reflect(UpLvWayModel.prototype, "UpLvWayModel");
var UpLvWayRedPoint = (function (_super) {
    __extends(UpLvWayRedPoint, _super);
    function UpLvWayRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.tabItemCound = 4;
        _this.mModel = model;
        return _this;
    }
    UpLvWayRedPoint.prototype.GetMessageDef = function () {
        return [
            MessageDef.UPLVWAY_CHANGE_SCORE,
        ];
    };
    UpLvWayRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[UpLvWayRedPoint.UPLVWAY_ACTIVATION] = this.showRedPoint,
            _a;
        var _a;
    };
    UpLvWayRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.UPLVWAY_REDPOINT_NOTICE);
    };
    UpLvWayRedPoint.prototype.showRedPoint = function () {
        for (var i = 0; i < 4; i++) {
            if (this.mModel.score >= GameGlobal.Config.BianQiangRewardConfig[i + 1].points) {
                if (this.mModel.rewards.indexOf(i + 1) == -1)
                    return true;
            }
        }
        return false;
    };
    UpLvWayRedPoint.UPLVWAY_ACTIVATION = 0;
    return UpLvWayRedPoint;
}(IRedPoint));
__reflect(UpLvWayRedPoint.prototype, "UpLvWayRedPoint");
//# sourceMappingURL=UpLvWayModel.js.map