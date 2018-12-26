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
var CatchPetModel = (function (_super) {
    __extends(CatchPetModel, _super);
    function CatchPetModel() {
        var _this = _super.call(this) || this;
        _this.monsterid = null;
        _this.catchtime = null;
        _this.regNetMsg(S2cProtocol.sc_pet_catch, _this.CatchPet);
        _this.regNetMsg(S2cProtocol.sc_pet_catch_result, _this.CatchPetResult);
        return _this;
    }
    CatchPetModel.prototype.HasCatch = function () {
        if (GameGlobal.CatchPetModel.catchtime != null && GameGlobal.CatchPetModel.monsterid != null) {
            return true;
        }
        return false;
    };
    CatchPetModel.prototype.ClearTime = function () {
        this.monsterid = null;
        this.catchtime = null;
    };
    CatchPetModel.prototype.CatchPet = function (rsp) {
        if (GameGlobal.Config.petBiographyConfig[rsp.monsterid]) {
            this.monsterid = rsp.monsterid;
            this.catchtime = rsp.catchtime;
            GameGlobal.MessageCenter.dispatch(MessageDef.BZ_PET_INFO);
        }
    };
    CatchPetModel.prototype.CatchPetResult = function (rsp) {
        this.result = rsp.result;
        var raid = GameGlobal.RaidMgr.mBattleRaid;
        if (raid && egret.is(raid, "CatchPetRaid")) {
            var finishAction = new CatchPetFinishData;
            finishAction.iswin = rsp.result;
            finishAction.id = this.monsterid;
            raid.SetFinishAction(finishAction);
        }
        this.ClearTime();
        GameGlobal.RaidMgr.BuZhuoPet();
    };
    CatchPetModel.prototype.SendPetCatch = function () {
        this.Rpc(C2sProtocol.cs_pet_catch);
    };
    CatchPetModel.prototype.OpenRaid = function () {
        return egret.is(GameGlobal.RaidMgr.mBattleRaid, "CatchPetRaid");
    };
    CatchPetModel.prototype.OnSocketClose = function () {
        this.ClearTime();
    };
    return CatchPetModel;
}(BaseSystem));
__reflect(CatchPetModel.prototype, "CatchPetModel");
//# sourceMappingURL=CatchPetModel.js.map