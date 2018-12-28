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
var QujingRevengeWin = (function (_super) {
    __extends(QujingRevengeWin, _super);
    function QujingRevengeWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "QujingRevengeSkin";
        _this._AddClick(_this.btnConfirm, _this._OnClick);
        _this._AddClick(_this.btnCancel, _this._OnClick);
        return _this;
    }
    QujingRevengeWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.observe(MessageDef.PALYER_INFO, this.UpdateContent);
        this.mId = param[0];
        this.mType = param[1];
        this.list.itemRenderer = ItemBaseNotName;
        this.list.dataProvider = new eui.ArrayCollection([]);
        if (this.mType == QujingModel.ESCORT_FIGHT_TYPE_REVENGE) {
            this.commonDialog.title = "复仇";
            this.labAwardTitle.text = "复仇奖励";
            this.labTip.visible = true;
            var recordInfo = GameGlobal.QujingModel.GetRecordInfo(this.mId);
            GameGlobal.PlayerInfoModel.sendOtherId(recordInfo.mPlayerId);
        }
        else {
            this.commonDialog.title = "拦截";
            this.labAwardTitle.text = "拦截奖励";
            this.labTip.visible = false;
            var escortInfo = GameGlobal.QujingModel.GetEscortInfo(this.mId);
            GameGlobal.PlayerInfoModel.sendOtherId(escortInfo.mPlayerId);
        }
    };
    QujingRevengeWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    QujingRevengeWin.prototype.UpdateContent = function (playerInfo) {
        this.imgFace.source = ResDataPath.GetHeadImgName(playerInfo.job, playerInfo.sex);
        this.labName.text = "\u540D\u79F0\uFF1A" + playerInfo.name;
        this.labPower.text = "\u6218\u529B\uFF1A" + playerInfo.power;
        this.labGangName.text = playerInfo.guildName ? "\u5E2E\u4F1A\uFF1A" + playerInfo.guildName : "";
        var rewards;
        if (this.mType == QujingModel.ESCORT_FIGHT_TYPE_REVENGE) {
            var info = GameGlobal.QujingModel.GetRecordInfo(this.mId);
            var config = GameGlobal.QujingModel.GetConfigByQuality(info.mQuality);
            rewards = config.revengeaward;
        }
        else {
            var info = GameGlobal.QujingModel.GetEscortInfo(this.mId);
            var config = GameGlobal.QujingModel.GetConfigByQuality(info.mQuality);
            rewards = config.robreward;
        }
        this.list.dataProvider = new eui.ArrayCollection(rewards);
    };
    QujingRevengeWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnCancel:
                ViewManager.ins().close(this);
                break;
            case this.btnConfirm:
                if (!UserFb.CheckFighting())
                    return;
                if (this.mType == QujingModel.ESCORT_FIGHT_TYPE_REVENGE)
                    GameGlobal.QujingModel.SendRevenge(this.mId);
                else
                    GameGlobal.QujingModel.SendRob(this.mId);
                ViewManager.ins().close(this);
                break;
        }
    };
    QujingRevengeWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return QujingRevengeWin;
}(BaseEuiView));
__reflect(QujingRevengeWin.prototype, "QujingRevengeWin");
//# sourceMappingURL=QujingRevengeWin.js.map