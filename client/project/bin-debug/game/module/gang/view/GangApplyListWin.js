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
var GangApplyListWin = (function (_super) {
    __extends(GangApplyListWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangApplyListWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangApplyListSkin";
        _this.commonWindowBg.SetTitle("申请列表");
        _this._AddClick(_this.btnSet, _this._OnClick);
        GameGlobal.GangModel.SendGetApplicantList();
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        if (!GangConst.GetAuditingRight(myGangInfo.mOffice)) {
            _this.groupSetting.visible = false;
        }
        return _this;
    }
    GangApplyListWin.prototype.childrenCreated = function () {
        this.listApply.itemRenderer = GangApplyItem;
        this.input.restrict = '0-9';
    };
    GangApplyListWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.GANG_UPDATE_APPLICANT_LIST, this.UpdateContent);
        this.commonWindowBg.OnAdded(this);
        this.UpdateSettingInfo();
    };
    GangApplyListWin.prototype.OnClose = function () {
        MainBottomPanel.CloseNav(this);
    };
    GangApplyListWin.prototype._OnClick = function (e) {
        var power = parseInt(this.input.text);
        if (power == NaN) {
            UserTips.ins().showTips("请输入正确的战斗力");
            return;
        }
        var auto = this.checkBox.selected ? 1 : 0;
        GameGlobal.GangModel.SendAutoJoin(auto, power);
    };
    GangApplyListWin.prototype.UpdateContent = function () {
        var applicantList = GameGlobal.GangModel.applicantList;
        this.listApply.dataProvider = new eui.ArrayCollection(applicantList);
    };
    GangApplyListWin.prototype.UpdateSettingInfo = function () {
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        this.checkBox.selected = myGangInfo.mAutoJoin == 1;
        this.input.text = myGangInfo.mNeedPower.toString();
    };
    GangApplyListWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GangApplyListWin;
}(BaseEuiView));
__reflect(GangApplyListWin.prototype, "GangApplyListWin", ["ICommonWindow"]);
var GangApplyItem = (function (_super) {
    __extends(GangApplyItem, _super);
    function GangApplyItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangApplyItem.prototype.childrenCreated = function () {
        this.btnAgree.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAgreeBtnClick, this);
        this.btnRefuse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRefuseBtnClick, this);
    };
    GangApplyItem.prototype.dataChanged = function () {
        var applicantInfo = this.data;
        this.btnAgree.name = applicantInfo.mPlayerId;
        this.btnRefuse.name = applicantInfo.mPlayerId;
        this.imgFace.source = ResDataPath.GetHeadImgName(applicantInfo.mJob, applicantInfo.mSex);
        this.labRoleName.text = "名字：" + applicantInfo.mPlayerName;
        this.labLevel.text = "等级：" + applicantInfo.mLevel;
        this.labPower.text = "战力：" + applicantInfo.mPower;
        this.SetLogoutTimeInfo(applicantInfo.mLogoutTime);
    };
    GangApplyItem.prototype._OnAgreeBtnClick = function (e) {
        var playerId = parseInt(e.currentTarget.name);
        this._sendHandleApplicant(playerId, true);
    };
    GangApplyItem.prototype._OnRefuseBtnClick = function (e) {
        var playerId = parseInt(e.currentTarget.name);
        this._sendHandleApplicant(playerId, false);
    };
    GangApplyItem.prototype._sendHandleApplicant = function (playerId, isAgree) {
        GameGlobal.GangModel.SendSetApply(playerId, isAgree);
        GameGlobal.GangModel.HandleApplicant(playerId);
    };
    GangApplyItem.prototype.SetLogoutTimeInfo = function (logoutTime) {
        if (logoutTime == 0) {
            this.labLogoutTime.text = "在线";
            this.labLogoutTime.textColor = Color.l_green_1;
        }
        else {
            var diffTime = GameServer.serverTime - logoutTime;
            this.labLogoutTime.textColor = Color.Red;
            if (diffTime < 60) {
                this.labLogoutTime.text = "离线少于1分钟";
                return;
            }
            if (diffTime < 3600) {
                this.labLogoutTime.text = "\u79BB\u7EBF" + Math.floor(diffTime / 60) + "\u5206\u949F";
                return;
            }
            this.labLogoutTime.text = "\u79BB\u7EBF" + Math.floor(diffTime / 3600) + "\u5C0F\u65F6";
        }
    };
    return GangApplyItem;
}(eui.ItemRenderer));
__reflect(GangApplyItem.prototype, "GangApplyItem");
//# sourceMappingURL=GangApplyListWin.js.map