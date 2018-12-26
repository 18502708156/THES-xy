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
var GangMemberListWin = (function (_super) {
    __extends(GangMemberListWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangMemberListWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangMemberListSkin";
        _this.commonWindowBg.SetTitle("成员列表");
        _this._AddClick(_this.btnExit, _this._OnClick);
        _this._AddClick(_this.labContributeTIp, _this._OnClick);
        _this._AddClick(_this.labPowerTip, _this._OnClick);
        GameGlobal.GangModel.SendGetMemberList();
        return _this;
    }
    GangMemberListWin.prototype.childrenCreated = function () {
        this.listMember.itemRenderer = GangMemberItem;
        this.labContributeTIp.textFlow = (new egret.HtmlTextParser).parser("<font color='#6e330b'><u>" + "历史贡献" + "</u></font>");
        this.labPowerTip.textFlow = (new egret.HtmlTextParser).parser("<font color='#6e330b'><u>" + "战力" + "</u></font>");
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        var officeName = GangConst.OFFICE_TO_TEXT[myGangInfo.mOffice];
        this.labOffice.text = "\u6211\u7684\u804C\u4F4D\uFF1A" + officeName;
        this.labContribute.text = "\u5386\u53F2\u8D21\u732E\uFF1A" + CommonUtils.overLength(myGangInfo.mContribute);
    };
    GangMemberListWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.GANG_UPDATE_MEMBER_LIST, this.UpdateContent);
        this.observe(MessageDef.GANG_EXIT_NOTICE, this.HandleExit);
        this.commonWindowBg.OnAdded(this);
    };
    GangMemberListWin.prototype.UpdateContent = function () {
        this.ResortByPower();
    };
    GangMemberListWin.prototype.ResortByContribute = function () {
        var memberList = GameGlobal.GangModel.memberList;
        memberList.sort(function (lhs, rhs) {
            if (rhs.mContribute == lhs.mContribute)
                return rhs.mOffice - lhs.mOffice;
            return rhs.mContribute - lhs.mContribute;
        });
        this.listMember.dataProvider = new eui.ArrayCollection(memberList);
    };
    GangMemberListWin.prototype.ResortByPower = function () {
        var memberList = GameGlobal.GangModel.memberList;
        memberList.sort(function (lhs, rhs) {
            if (rhs.mPower == lhs.mPower)
                return rhs.mOffice - lhs.mOffice;
            return rhs.mPower - lhs.mPower;
        });
        this.listMember.dataProvider = new eui.ArrayCollection(memberList);
    };
    GangMemberListWin.prototype.OnClose = function () {
    };
    GangMemberListWin.prototype.HandleExit = function () {
        ViewManager.ins().close(this);
    };
    GangMemberListWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnExit:
                WarnWin.show("是否要退出帮会？", function () {
                    GameGlobal.GangModel.SendExit();
                }, this);
                break;
            case this.labContributeTIp:
                this.ResortByContribute();
                break;
            case this.labPowerTip:
                this.ResortByPower();
                break;
        }
    };
    GangMemberListWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GangMemberListWin;
}(BaseEuiView));
__reflect(GangMemberListWin.prototype, "GangMemberListWin", ["ICommonWindow"]);
var GangMemberItem = (function (_super) {
    __extends(GangMemberItem, _super);
    function GangMemberItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangMemberItem.prototype.childrenCreated = function () {
        this.btnAffair.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    GangMemberItem.prototype.dataChanged = function () {
        var memberInfo = this.data;
        this.btnAffair.name = memberInfo.mPlayerId;
        this.imgFace.source = ResDataPath.GetHeadImgName(memberInfo.mJob, memberInfo.mSex);
        this.labOfficeName.text = "\u3010" + GangConst.OFFICE_TO_TEXT[memberInfo.mOffice] + "\u3011";
        this.labPlayerName.text = memberInfo.mPlayerName;
        this.labContribute.text = memberInfo.mContribute;
        this.labPower.text = memberInfo.mPower;
        this.SetLogoutTimeInfo(memberInfo.mLogoutTime);
        this.btnAffair.visible = memberInfo.mPlayerId != GameGlobal.actorModel.actorID;
    };
    GangMemberItem.prototype.SetLogoutTimeInfo = function (logoutTime) {
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
    GangMemberItem.prototype._OnBtnClick = function (e) {
        var playerId = parseInt(e.currentTarget.name);
        ViewManager.ins().open(GangMemberInfoView, playerId);
    };
    return GangMemberItem;
}(eui.ItemRenderer));
__reflect(GangMemberItem.prototype, "GangMemberItem");
//# sourceMappingURL=GangMemberListWin.js.map