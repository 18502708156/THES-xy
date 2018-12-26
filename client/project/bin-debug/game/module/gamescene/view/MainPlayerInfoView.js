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
var MainPlayerInfoView = (function (_super) {
    __extends(MainPlayerInfoView, _super);
    function MainPlayerInfoView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    MainPlayerInfoView.prototype.childrenCreated = function () {
        this.face.source = "";
        this.face.touchEnabled = true;
        this.XinWulist.itemRenderer = ItemBaseNotName;
    };
    MainPlayerInfoView.prototype.RefreshHeadImg = function () {
        var role = SubRoles.ins().GetRoleData();
        if (role) {
            this.face.source = ResDataPath.GetHeadImgName(role.job, role.sex);
        }
    };
    MainPlayerInfoView.prototype.OnOpen = function () {
        this.AddClick(this.face, this.onClick);
        this.AddClick(this.rankBtn, this.onClick);
        this.AddClick(this.rechargeBtn, this.onClick);
        this.observe(MessageDef.SUB_ROLE_CHANGE, this.UpdateContent);
        this.observe(MessageDef.LEVEL_CHANGE, this.UpdateContent);
        this.observe(MessageDef.UPDATA_VIP_EXP, this.changeExpBtn);
        this.observe(MessageDef.UPDATA_VIP_AWARDS, this.showVipRedPoint);
        this.observe(MessageDef.VIP_LEVEL_CHANGE, this.UpdateContent);
        this.observe(MessageDef.POWER_CHANGE, this.UpdateContent);
        this.observe(MessageDef.NAME_CHANGE, this.UpdateContent);
        this.observe(MessageDef.IS_MARRY_INFO, this.ShowXinWu);
        this.observe(MessageDef.PHB_REPOINT_UPDATE, this.showRankRedPoint);
        this.observe(MessageDef.LEVEL_CHANGE, this.showRankRedPoint);
        this.showRankRedPoint();
        this.showVipRedPoint();
        this.UpdateContent();
        this.ShowXinWu();
    };
    MainPlayerInfoView.prototype.UpdateContent = function () {
        this.RefreshHeadImg();
        // this.powerLabel.text = "战 " + GameLogic.ins().actorModel.power.toString()
        this.powerLabel.text = GameLogic.ins().actorModel.power.toString();
        var lv = GameGlobal.actorModel.level || 0;
        this.lbLev.text = "Lv." + lv;
        this.lbName.text = GameGlobal.actorModel.name;
        this.vipBtn.setVipLv(GameGlobal.actorModel.vipLv);
        this.changeExpBtn();
    };
    MainPlayerInfoView.prototype.showRankRedPoint = function () {
        UIHelper.ShowRedPoint(this.rankBtn, GameGlobal.RankingModel.isRedPoint() && Deblocking.Check(DeblockingType.TYPE_86, true));
    };
    ;
    MainPlayerInfoView.prototype.showVipRedPoint = function () {
        this.redPointImg.visible = UserVip.ins().CheckRedPoint();
    };
    MainPlayerInfoView.prototype.changeExpBtn = function () {
        this.vipBtn.setVipLv(GameGlobal.actorModel.vipLv);
    };
    MainPlayerInfoView.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.face:
                ViewManager.ins().open(PlayerDetailsPanel, GameGlobal.GameLogic.actorModel.actorID);
                break;
            case this.rechargeBtn:
                RechargeWin.Open();
                break;
            case this.rankBtn:
                ViewManager.ins().open(RankingWin);
                break;
        }
    };
    ;
    MainPlayerInfoView.prototype.ShowXinWu = function () {
        this.XinWu.visible = GameGlobal.YingYuanModel.iSMarry();
        if (this.XinWu.visible) {
            var Config = GameGlobal.Config.MarryConfig[GameGlobal.YingYuanModel.marryInfo.grade];
            this.XinWulist.dataProvider = new eui.ArrayCollection([Config.id[0]]);
        }
    };
    return MainPlayerInfoView;
}(BaseView));
__reflect(MainPlayerInfoView.prototype, "MainPlayerInfoView");
//# sourceMappingURL=MainPlayerInfoView.js.map