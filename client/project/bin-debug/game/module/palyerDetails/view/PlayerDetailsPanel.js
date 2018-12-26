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
var PlayerDetailsPanel = (function (_super) {
    __extends(PlayerDetailsPanel, _super);
    function PlayerDetailsPanel() {
        var _this = _super.call(this) || this;
        _this.friend = true;
        _this.skinName = "PlayerInfoSkin";
        _this._AddClick(_this.infoBtn1, _this._OnClick);
        _this._AddClick(_this.infoBtn2, _this._OnClick);
        _this._AddClick(_this.infoBtn3, _this._OnClick);
        _this._AddClick(_this.monthCard, _this._OnClick);
        _this._AddClick(_this.vipCard, _this._OnClick);
        _this.AddClick(_this.blacklist, _this.setBlackList);
        _this.AddClick(_this.copyName, _this.setCopyName);
        return _this;
    }
    PlayerDetailsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "玩家信息";
        this.blacklist.textColor = Color.Green;
        this.blacklist.text = "拉黑";
        this.blacklist.label.size = 24;
        this.copyName.textColor = Color.Green;
        this.copyName.text = "复制昵称";
        this.copyName.label.size = 24;
        this.palyerId = param[0];
        GameGlobal.PlayerInfoModel.sendOtherId(this.palyerId);
        this.observe(MessageDef.PALYER_INFO, this.updateContent);
        this.observe(MessageDef.FRIEND_DATA_REFRESH, this.updateContent);
    };
    PlayerDetailsPanel.prototype.updateContent = function (rsp) {
        if (GameGlobal.FriendModel.isFriend(this.palyerId))
            this.infoBtn2.label = "取消关注";
        else
            this.infoBtn2.label = "关注";
        if (GameGlobal.FriendModel.isBlacklist(this.palyerId))
            this.blacklist.text = "取消拉黑";
        else
            this.blacklist.text = "拉黑";
        if (!rsp)
            return;
        if (this.palyerId == GameGlobal.GameLogic.actorModel.actorID)
            this.currentState = "self";
        else
            this.currentState = "other";
        if (this.currentState == "other") {
            var studentData = GameGlobal.TeacherController.teacherInfo.studentData;
            for (var _i = 0, studentData_1 = studentData; _i < studentData_1.length; _i++) {
                var val = studentData_1[_i];
                if (val.student == rsp.id) {
                    this.infoBtn3.visible = false;
                }
            }
            var teacherData = GameGlobal.TeacherController.teacherInfo.teacherData;
            if (teacherData.teacher == rsp.id) {
                this.infoBtn3.visible = false;
            }
            if (GameGlobal.actorModel.level - rsp.level >= 3) {
                this.infoBtn3.label = "收徒";
            }
            else
                this.infoBtn3.visible = false;
        }
        if (rsp.partner != "") {
            this.partnerTxt.text = "伴侣: " + rsp.partner;
        }
        else {
            this.partnerTxt.visible = false;
        }
        if (!rsp.guildName) {
            this.gangTxt.visible = false;
        }
        else {
            this.gangTxt.text = "帮会: " + rsp.guildName;
        }
        // this.roleShowPanel.SetAll(subRole)
        this.roleShowPanel.SetShowImage(rsp);
        this.playerAvatar["face"].source = ResDataPath.GetHeadImgName(rsp.job, rsp.sex);
        if (rsp.headframe)
            this.playerAvatar["imgFrame"].source = ResDataPath.GetHeadFrameImgName(rsp.headframe);
        this.powerLabel.text = rsp.power;
        this.nickName.text = "昵称: " + rsp.name;
        this.levelTxt.text = "等级: " + rsp.level;
        this.sexTxt.text = "性别: " + (rsp.sex == 0 ? '男' : '女');
        this.userChatData = new Sproto.chat_data;
        this.userChatData.id = this.palyerId;
        this.userChatData.job = rsp.job;
        this.userChatData.sex = rsp.sex;
        this.userChatData.name = rsp.name;
        this.vipCard.filters = rsp.vip > 0 ? null : Color.GetFilter();
        this.monthCard.filters = GameGlobal.FuliModel.FuliData.month > 0 ? null : Color.GetFilter();
    };
    PlayerDetailsPanel.prototype._OnClick = function (e) {
        var role = SubRoles.ins().GetRoleData();
        switch (e.currentTarget) {
            case this.infoBtn1:
                if (this.infoBtn1.label == "开始聊天") {
                    ViewManager.ins().open(PlayerChatpanel, this.userChatData);
                }
                else {
                    ViewManager.ins().open(PlayerChangeNamePanel, this.palyerId);
                    ViewManager.ins().close(PlayerDetailsPanel);
                }
                break;
            case this.infoBtn2:
                if (this.infoBtn2.label == "关注") {
                    GameGlobal.FriendModel.sendAddFriend(this.palyerId);
                }
                else if (this.infoBtn2.label == "取消关注") {
                    GameGlobal.FriendModel.sendDleFriend(this.palyerId);
                }
                else {
                    ViewManager.ins().open(SystemSettingPanel, this.palyerId);
                    ViewManager.ins().close(PlayerDetailsPanel);
                }
                break;
            case this.infoBtn3:
                var cost = GlobalConfig.ins().MasterBaseConfig.cost; //收徒花费
                if (cost && Checker.Datas(cost)) {
                    GameGlobal.TeacherManage.applyTeacher(this.palyerId);
                }
                break;
            case this.vipCard:
                ViewManager.ins().open(VipMainPanel);
                ViewManager.ins().close(PlayerDetailsPanel);
                break;
            case this.monthCard:
                for (var _i = 0, _a = FuliWin.WelfareIcon; _i < _a.length; _i++) {
                    var val = _a[_i];
                    if (val.cls == FuliMonthlyCardPanel) {
                        ViewManager.ins().open(FuliWin, val.type);
                        ViewManager.ins().close(PlayerDetailsPanel);
                        break;
                    }
                }
                break;
        }
    };
    //设置黑名单
    PlayerDetailsPanel.prototype.setBlackList = function (e) {
        if (this.blacklist.text == "拉黑") {
            this.blacklist.text = "取消拉黑";
            GameGlobal.FriendModel.sendAddBlacklist(this.palyerId);
        }
        else {
            this.blacklist.text = "拉黑";
            GameGlobal.FriendModel.sendRemoveBlacklist(this.palyerId);
        }
    };
    //复制昵称
    PlayerDetailsPanel.prototype.setCopyName = function (e) {
        // e.text
        CommonUtils.CopyToClipboard(this.name);
        GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_COPY_NAME, this.userChatData.name);
    };
    PlayerDetailsPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    PlayerDetailsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PlayerDetailsPanel;
}(BaseEuiView));
__reflect(PlayerDetailsPanel.prototype, "PlayerDetailsPanel", ["ICommonWindow"]);
//# sourceMappingURL=PlayerDetailsPanel.js.map