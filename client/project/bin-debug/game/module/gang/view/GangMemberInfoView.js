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
var GangMemberInfoView = (function (_super) {
    __extends(GangMemberInfoView, _super);
    function GangMemberInfoView() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangMemberInfoSkin";
        _this._AddClick(_this.btnChat, _this._OnClick);
        _this._AddClick(_this.btnConcern, _this._OnClick);
        _this._AddClick(_this.btnOffice, _this._OnClick);
        _this._AddClick(_this.btnKickOut, _this._OnClick);
        _this._AddClick(_this.imgVIp, _this._OnClick);
        _this._AddClick(_this.imgMouthVip, _this._OnClick);
        return _this;
    }
    GangMemberInfoView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mPlayerId = param[0];
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "玩家信息";
        this.observe(MessageDef.GANG_UPDATE_MEMBER_INFO, this.UpdateContent);
        this.observe(MessageDef.PALYER_INFO, this.UpdatePlayerInfo);
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.HandleAddFriend);
        this.UpdateContent();
        GameGlobal.PlayerInfoModel.sendOtherId(this.mPlayerId);
    };
    GangMemberInfoView.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GangMemberInfoView.prototype.UpdateContent = function () {
        var memberInfo = GameGlobal.GangModel.GetMemberInfoByPlayerId(this.mPlayerId);
        this.labOffice.text = "\u804C\u4F4D\uFF1A" + GangConst.OFFICE_TO_TEXT[memberInfo.mOffice];
        this.labContribute.text = "\u8D21\u732E\uFF1A" + memberInfo.mContribute;
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        if (myGangInfo.mOffice == GangConst.MASTER_OFFICE) {
            this.btnOffice.label = memberInfo.mOffice == GangConst.DEPUTY_OFFICE ? "降职" : "升职";
            return;
        }
        this.btnOffice.visible = false;
        if (myGangInfo.mOffice == GangConst.DEPUTY_OFFICE) {
            this.btnKickOut.$setX(this.btnOffice.$getX());
            return;
        }
        this.btnKickOut.visible = false;
    };
    GangMemberInfoView.prototype.UpdatePlayerInfo = function (playerInfo) {
        this.imgFace.source = ResDataPath.GetHeadImgName(playerInfo.job, playerInfo.sex);
        this.labPlayerName.text = "\u6635\u79F0\uFF1A" + playerInfo.name;
        this.labSex.text = "\u6027\u522B\uFF1A" + (playerInfo.sex == 1 ? "女" : "男");
        this.labLevel.text = "\u7B49\u7EA7\uFF1A" + playerInfo.level;
        this.powerLabel.text = playerInfo.power;
        this.userChatData = new Sproto.chat_data;
        this.userChatData.id = this.mPlayerId;
        this.userChatData.job = playerInfo.job;
        this.userChatData.sex = playerInfo.sex;
        this.userChatData.name = playerInfo.name;
        this.imgVIp.filters = playerInfo.vip > 0 ? null : Color.GetFilter();
        this.imgMouthVip.filters = GameGlobal.FuliModel.FuliData.month > 0 ? null : Color.GetFilter();
        this.roleShowPanel.SetShowImage(playerInfo);
    };
    GangMemberInfoView.prototype.HandleAddFriend = function () {
        UserTips.ins().showTips("关注成功");
    };
    GangMemberInfoView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnChat:
                ViewManager.ins().open(PlayerChatpanel, this.userChatData);
                break;
            case this.btnConcern:
                if (GameGlobal.FriendModel.isFriend(this.mPlayerId)) {
                    UserTips.ins().showTips("你们已经是好友了");
                    return;
                }
                GameGlobal.FriendModel.sendAddFriend(this.mPlayerId);
                break;
            case this.btnOffice:
                this.HandleExchangOffice();
                break;
            case this.btnKickOut:
                this.HandleKickOutMember();
                break;
            case this.imgVIp:
                ViewManager.ins().open(VipMainPanel, this.mPlayerId);
                ViewManager.ins().close(GangMemberInfoView);
                break;
            case this.imgMouthVip:
                for (var _i = 0, _a = FuliWin.WelfareIcon; _i < _a.length; _i++) {
                    var val = _a[_i];
                    if (val.cls == FuliMonthlyCardPanel) {
                        ViewManager.ins().open(FuliWin, val.type);
                        ViewManager.ins().close(GangMemberInfoView);
                        break;
                    }
                }
                break;
        }
    };
    GangMemberInfoView.prototype.HandleExchangOffice = function () {
        var memberInfo = GameGlobal.GangModel.GetMemberInfoByPlayerId(this.mPlayerId);
        var office = memberInfo.mOffice == GangConst.DEPUTY_OFFICE ? GangConst.MEMBER_OFFICE : GangConst.DEPUTY_OFFICE;
        if (office == GangConst.DEPUTY_OFFICE
            && GameGlobal.GangModel.GetDeputyCount() >= GameGlobal.Config.GuildConfig.management) {
            UserTips.ins().showTips("\u526F\u5E2E\u4E3B\u53EA\u6709" + GameGlobal.Config.GuildConfig.management + "\u4F4D");
            return;
        }
        GameGlobal.GangModel.SendExchangOffice(this.mPlayerId, office);
    };
    GangMemberInfoView.prototype.HandleKickOutMember = function () {
        var _this = this;
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        if (!GangConst.GetKickOutRight(myGangInfo.mOffice)) {
            UserTips.ins().showTips("你没有这个权限");
            return;
        }
        var memberInfo = GameGlobal.GangModel.GetMemberInfoByPlayerId(this.mPlayerId);
        if (memberInfo.mOffice != GangConst.MEMBER_OFFICE) {
            UserTips.ins().showTips("不可踢出管理人员");
            return;
        }
        WarnWin.show("是否要将该成员踢出帮会？", function () {
            GameGlobal.GangModel.SendKickOutMember(_this.mPlayerId);
            ViewManager.ins().close(_this);
        }, this);
    };
    GangMemberInfoView.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangMemberInfoView;
}(BaseEuiView));
__reflect(GangMemberInfoView.prototype, "GangMemberInfoView");
//# sourceMappingURL=GangMemberInfoView.js.map