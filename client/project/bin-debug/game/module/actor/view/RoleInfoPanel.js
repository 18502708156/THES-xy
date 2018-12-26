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
var RoleInfoPanel = (function (_super) {
    __extends(RoleInfoPanel, _super);
    function RoleInfoPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 引导对象
    RoleInfoPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.oneKeyChange,
            _a;
        var _a;
    };
    RoleInfoPanel.prototype.childrenCreated = function () {
        this.touchEnabled = false;
        this.touchChildren = true;
        this.equips = [];
        for (var i = 0; i < EquipPos.MAX; i++) {
            this.equips[i] = this['item' + i];
            this.equips[i].touchEnabled = true;
        }
        this._AddClick(this.checkAttr, this._OnClick);
        this._AddClick(this.oneKeyChange, this._OnClick);
        this._AddClick(this.upgreadBtn, this._OnClick);
        this._AddClick(this.roleTitle, this._OnClick);
        this._AddClick(this.dressBtn, this._OnClick);
        this._AddClick(this.bless, this._OnClick);
        this._AddClick(this.btnDeityEquip, this._OnClick);
        this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 110);
        this.mListLRBtnCtrl.mNotVisible = true;
        this.list.itemRenderer = RoleInfoItem;
        this.list.dataProvider = new eui.ArrayCollection;
        // this._AddItemClick(this.list, this._OnItemClick);
    };
    RoleInfoPanel.prototype._OnClick = function (e) {
        switch (e.target) {
            case this.upgreadBtn:
                GameGlobal.actorModel.SendUpLevel();
                break;
            case this.checkAttr:
                ViewManager.ins().open(RoleAttrWin);
                break;
            case this.oneKeyChange:
                GameGlobal.UserRole.SendEquip();
                break;
            case this.roleTitle:
                // UIHelper.SetBtnEffe(this.roleTitle,"ui_yhy002",false);
                ViewManager.ins().open(RoleTitlePanel, GameGlobal.UserTitle);
                break;
            case this.dressBtn:
                // UIHelper.SetBtnEffe(this.dressBtn,"ui_yhy002",false);
                ViewManager.ins().open(RoleSkinPanel, GameGlobal.UserSkin);
                break;
            case this.btnDeityEquip:
                ViewManager.ins().open(DeityEquipWin);
                break;
            case this.bless:
                // UIHelper.SetBtnEffe(this.bless,"ui_yhy002",false);
                ViewManager.ins().open(TreasureWin);
                break;
        }
    };
    RoleInfoPanel.prototype.OnItemClick = function (data) {
        if (data.name == "神兵系统") {
            UIHelper.SetBtnEffe(this["list"].getChildAt(0), "ui_yhy002", false);
        }
        ViewManager.ins().open(data.win);
        // if (e.item.isopen) {
        // ViewManager.ins().open(e.item.win);
        // }
        // else {
        // 	UserTips.ins().showTips(e.item.level + '级开启' + e.item.name);
        // }
    };
    RoleInfoPanel.prototype.OnOpen = function () {
        this.observe(GameGlobal.TianxModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.TianxModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.SwordModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.SwordModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(MessageDef.CHANGE_EQUIP, this.UpdateRedPoint);
        this.observe(MessageDef.RP_TREASURE, this.UpdateRedPoint);
        this.observe(MessageDef.RP_ROLE_HINT, this.UpdateRedPoint);
        this.observe(MessageDef.ROLE_HINT, this.UpdateRedPoint);
        this.observe(MessageDef.CHANGE_EQUIP, this.updataEquip);
        this.observe(MessageDef.EXP_CHANGE, this.UpdateListContent);
        this.observe(MessageDef.LEVEL_CHANGE, this.UpdateExp);
        this.observe(MessageDef.ROLE_TITLE_UPDATE, this.UpdateTitle);
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng);
        this.UpdateListContent();
        this.updateJiJieBtnPng();
        // this.UpdateFateEff();  //暫時屏蔽預告Eff
    };
    RoleInfoPanel.prototype.updateJiJieBtnPng = function () {
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.list.getChildAt(0), [ActivityKaiFuJiJieType.fairy, ActivityKaiFuJiJieType.weapon]);
    };
    RoleInfoPanel.prototype.UpdateListContent = function () {
        var lv = GameGlobal.actorModel.level;
        var datas = [
            { icon: "ui_bt_shouhu", redPoint: GameGlobal.TianxModel.mRedPoint.IsRedPoint() || GameGlobal.SwordModel.mRedPoint.IsRedPoint(), name: '神兵系统', win: TianxianMainPanel },
            // {icon: "ui_bt_zhenxing", redPoint: GameGlobal.FormationModel.mRedPoint.IsRedPoint(), name: '阵型系统', win: FormationWin},
            { icon: "ui_bt_danyao", redPoint: GameGlobal.UserRole.GetIndexElixir(), name: '丹药系统', win: RoleElixirPanel },
            { icon: "ui_bt_jingmai", redPoint: GameGlobal.UserRole.GetIndexJingmai(), name: '经脉系统', win: RoleJingMaiPanel },
            { icon: "ui_bt_taozhuang", redPoint: false, name: '套装系统', win: RoleSuitPanel },
            { icon: "ui_bt_taozhuangdaren", redPoint: false, name: '套装达人系统', win: RoleSuitTipPanel },
        ];
        this.list.dataProvider.replaceAll(datas);
        this.list.validateNow();
        this.leftBtn.visible = this.rightBtn.visible = datas.length > 5;
        this.UpdateExp();
    };
    RoleInfoPanel.prototype.UpdateExp = function () {
        var actorModel = GameGlobal.actorModel;
        this.levelLabel.text = actorModel.level + "";
        var config = GameGlobal.Config.ExpConfig[actorModel.level];
        var str = "";
        var canUp = false;
        if (GameGlobal.Config.ExpConfig[actorModel.level + 1]) {
            str = "/" + CommonUtils.overLength(config.exp);
            canUp = actorModel.exp >= config.exp;
        }
        this.expLabel.text = CommonUtils.overLength(actorModel.exp) + str;
        this.upgreadBtn.enabled = canUp;
    };
    RoleInfoPanel.prototype.UpdateTitle = function () {
        var role = SubRoles.ins().GetRoleData();
        this.roleShowPanel.SetAll(role);
    };
    RoleInfoPanel.prototype.updataEquip = function () {
        var model = SubRoles.ins().GetRoleData();
        this.setEquip(model);
    };
    /** 设置装备 */
    RoleInfoPanel.prototype.setEquip = function (role) {
        if (!role)
            return;
        var len = role.getEquipLen();
        var canEquips = GameGlobal.UserRole.canChangeEquips;
        for (var i = 0; i < len; i++) {
            var element = role.getEquipByIndex(i);
            this.equips[i].model = role;
            this.equips[i].data = element.item;
            if (!element.item.configID) {
                this.equips[i].setItemImg(ResDataPath.GetEquipDefaultGreyIcon(i));
            }
        }
        this.roleShowPanel.SetAll(role);
        this.totalPower.text = GameLogic.ins().actorModel.power + "";
        this.UpdateRedPointEquip();
    };
    RoleInfoPanel.prototype.UpdateRedPointEquip = function () {
        var role = GameGlobal.SubRoles.GetRoleData();
        var can = false;
        if (role) {
            var canEquips = GameGlobal.UserRole.canChangeEquips;
            for (var i = 0, len = role.getEquipLen(); i < len; i++) {
                var canEquip = canEquips[i] ? true : false;
                this.equips[i].IsShowRedPoint((canEquip) ? true : false);
                this.equips[i].IsShowUp(GameGlobal.UserRole.IsOrange(i) ? true : false);
                if (canEquip) {
                    can = true;
                }
            }
        }
        this.oneKeyChange.visible = can;
    };
    RoleInfoPanel.prototype.UpdateRedPoint = function () {
        this.UpdateRedPointEquip();
        UIHelper.ShowRedPoint(this.dressBtn, GameGlobal.UserRole.Get(UserRole.INDEX_SKIN));
        UIHelper.ShowRedPoint(this.roleTitle, GameGlobal.UserRole.Get(UserRole.INDEX_TITLE));
        UIHelper.ShowRedPoint(this.bless, GameGlobal.TreasureModel.mRedPoint.IsRedPoint());
        UIHelper.ShowRedPoint(this.btnDeityEquip, GameGlobal.UserEquip.HasDeityEquipAwake() || GameGlobal.UserEquip.HasDeityEquipInject());
        this.UpdateListContent();
    };
    RoleInfoPanel.prototype.UpdateFateEff = function () {
        FateEff.isShowEff2(this);
    };
    // setCanChange() {
    // 	var n = this.equips.length;
    // 	for (var i = 0; i < n; i++) {
    // 		this.equips[i].IsShowRedPoint(false)
    // 	}
    // 	
    // };
    RoleInfoPanel.prototype.UpdateContent = function () {
        this.UpdateRedPoint();
        this.updataEquip();
        this.UpdateTitle();
    };
    RoleInfoPanel.RedPointCheck = function () {
        if (GameGlobal.UserRole.IsRedEquip()) {
            return true;
        }
        if (GameGlobal.UserRole.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.TianxModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.SwordModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.TreasureModel.mRedPoint.IsRedPoint()) {
            return true;
        }
        if (GameGlobal.UserEquip.mDeityEquipRP.IsRedPoint()) {
            return true;
        }
        return false;
    };
    RoleInfoPanel.NAME = "角色";
    return RoleInfoPanel;
}(BaseView));
__reflect(RoleInfoPanel.prototype, "RoleInfoPanel", ["ICommonWindowTitle"]);
var RoleInfoItem = (function (_super) {
    __extends(RoleInfoItem, _super);
    function RoleInfoItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    RoleInfoItem.prototype.childrenCreated = function () {
        this.width = 96;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
    };
    RoleInfoItem.prototype.OnClick = function () {
        var panel = Util.GetParentByType(this, RoleInfoPanel);
        panel.OnItemClick(this.data);
    };
    RoleInfoItem.prototype.dataChanged = function () {
        this.iconDisplay.source = this.data.icon;
        this.redPoint.visible = this.data.redPoint;
    };
    return RoleInfoItem;
}(eui.ItemRenderer));
__reflect(RoleInfoItem.prototype, "RoleInfoItem");
//# sourceMappingURL=RoleInfoPanel.js.map