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
var HavingShow = (function (_super) {
    __extends(HavingShow, _super);
    function HavingShow() {
        var _this = _super.call(this) || this;
        _this.needVipLv = 9;
        _this._resources = ["ui_xn_bm_db", "xuannvxiafan_json"];
        _this.skinName = "HavingShowSkin";
        return _this;
    }
    HavingShow.prototype.childrenCreated = function () {
        this.needVipLv = GameGlobal.Config.GuideBaseConfig.viplv;
        this.skillList.itemRenderer = HavingSkillIcon;
        this.list.itemRenderer = ItemBaseNotName;
        this.list.dataProvider = new eui.ArrayCollection(GameGlobal.VipModel.getVipAward(this.needVipLv));
    };
    HavingShow.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SHOW_XUANNV, true);
        this._AddClick(this.closeBtn, this.CloseSelf);
        this._AddClick(this.btn, this.tap);
        this._AddItemClick(this.skillList, this._OnItemClick);
        this.observe(MessageDef.UPDATA_VIP_AWARDS, this.updateContent);
        this.observe(MessageDef.VIP_LEVEL_CHANGE, this.updateContent);
        GameGlobal.RechargeModel.xuanNvCard = false;
        this.updateContent();
    };
    HavingShow.prototype.updateContent = function () {
        this.xingxiang.SetBody(AppearanceConfig.GetUIPath(GameGlobal.Config.FemaleDevaSkinConfig[1].pid));
        this.updateSkills();
        this.btn.label = "立即提升VIP";
        if (UserVip.ins().lv >= 9)
            this.btn.label = "领取奖励";
        if (BitUtil.Has(UserVip.ins().state, this.needVipLv))
            this.btn.visible = false;
    };
    HavingShow.prototype._OnItemClick = function (e) {
        var index = e.itemIndex;
        var skillId = this.skillIds[index];
        if (!skillId) {
            ViewManager.ins().open(HavingSkillTipPanel, 1);
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, index > 2 ? 2 : index, skillId, false);
    };
    HavingShow.prototype.updateSkills = function () {
        this.skillIds = [];
        var baseConfig = GameGlobal.HavingModel.getBaseConfig();
        this.skillIds.length = 6;
        this.skillIds[0] = baseConfig.skill;
        this.skillIds[1] = baseConfig.hskill;
        this.skillIds[2] = GameGlobal.Config.FemaleDevaMagicConfig[1].attrs[3];
        this.skillList.dataProvider = new eui.ArrayCollection(this.skillIds);
    };
    HavingShow.prototype.tap = function () {
        if (this.btn.label == "立即提升VIP") {
            if (GameGlobal.RechargeModel.choicerechare == 0)
                GameGlobal.RechargeModel.sendRecharge(6);
            else {
                RechargeWin.Open();
                this.CloseSelf();
            }
        }
        else {
            UserVip.ins().sendGetAwards(this.needVipLv);
        }
    };
    HavingShow.LAYER_LEVEL = LayerManager.UI_Popup;
    return HavingShow;
}(BaseEuiView));
__reflect(HavingShow.prototype, "HavingShow");
//# sourceMappingURL=HavingShow.js.map