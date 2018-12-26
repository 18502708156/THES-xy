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
var RoleSuitPanel = (function (_super) {
    __extends(RoleSuitPanel, _super);
    function RoleSuitPanel() {
        var _this = _super.call(this) || this;
        _this.mSelectIndex = 0;
        /**是否有配置时装，没有就用角色自身 */
        _this.isFashion = false;
        _this.skinName = "RoleSuitSkin";
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 112);
        return _this;
    }
    RoleSuitPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = RoleSuitHeadItem;
        var mList = CommonUtils.GetArray(GameGlobal.Config.SuitConfig, "id");
        this.list.dataProvider = new eui.ArrayCollection(mList);
        this.list.selectedIndex = this.mSelectIndex;
        this._AddItemClick(this.list, this._OnItemTap);
        this.itemList.itemRenderer = RoleSuitEquipItem;
        this.itemList.dataProvider = null;
    };
    RoleSuitPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle('套装');
        this.mListLRBtnCtrl.OnRefresh();
        this.UpdateContent();
    };
    RoleSuitPanel.prototype._OnItemTap = function (e) {
        this.mSelectIndex = e.itemIndex;
        this.UpdateContent();
    };
    RoleSuitPanel.prototype.UpdateContent = function () {
        var id = this.mSelectIndex + 1;
        var config = GameGlobal.Config.SuitConfig[id];
        if (config) {
            var num = 0;
            var addPower = 0;
            var equips = [];
            this.isFashion = false;
            var role = SubRoles.ins().GetRoleData();
            var roleShowData = new RoleShowData;
            roleShowData.job = role.job;
            roleShowData.sex = role.sex;
            for (var i = 0; i < config.activation.length; i++) {
                var type = config.activation[i].type;
                var skinIds = this.getSkinIdsByType(type);
                var skinid = config.activation[i].id;
                var index = skinIds.indexOf(skinid);
                var skinConfig = this.getSkinConfig(type, skinid, roleShowData);
                if (index > -1) {
                    num++;
                    if (type == UserTemplate.TYPE_DRESS_FATION) {
                        addPower += ItemConfig.CalcAttrScoreValue(skinConfig[GameGlobal.actorModel.sex].attrpower);
                    }
                    else
                        addPower += ItemConfig.CalcAttrScoreValue(skinConfig.attrpower);
                }
                equips[i] = {
                    type: type,
                    flag: index > -1,
                    config: (type == UserTemplate.TYPE_DRESS_FATION ? skinConfig[GameGlobal.actorModel.sex] : skinConfig),
                };
            }
            this.itemList.dataProvider = new eui.ArrayCollection(equips);
            if (!this.isFashion) {
                // this.roleShowPanel.SetBody(RoleShowPanel.GetPath(role.GetSubRoleData().GetBodyId(), role.job, role.sex, true));
                roleShowData.clothID = role.GetSubRoleData().GetBodyId();
            }
            this.roleShowPanel.SetAll(roleShowData);
            var item = void 0;
            for (var i = 1; i <= 3; i++) {
                item = this['item' + i];
                item.bg.source = num >= (i + 1) ? 'ui_tz_bm_jihuoshuxingbg01' : 'ui_tz_bm_jihuoshuxingbg02';
                item.title.textColor = num >= (i + 1) ? 0x6e330b : 0x986d43;
                item.title.text = '激活' + (i + 1) + '件';
                item.attr.textColor = num >= (i + 1) ? 0x6e330b : 0x986d43;
                item.attr.text = "\u6218\u529B\uFF1A" + ItemConfig.CalcAttrScoreValue(config['attrpower_' + i]) + "\n" + AttributeData.getAttStr(config['attrpower_' + i], 0, 1, '：');
            }
            this.powerLabel.text = addPower;
            this.nameLab.text = config.name;
        }
    };
    RoleSuitPanel.prototype.getSkinConfig = function (type, skinid, roleShowData) {
        var config;
        switch (type) {
            case UserTemplate.TYPE_RIDE:
                config = GameGlobal.Config.RideSkinConfig[skinid];
                // this.roleShowPanel.SetRide(AppearanceConfig.GetUIPath(config.pid));
                roleShowData.rideId = config.pid;
                break;
            case UserTemplate.TYPE_WING:
                config = GameGlobal.Config.WingSkinConfig[skinid];
                // this.roleShowPanel.SetWing(AppearanceConfig.GetUIPath(config.pid));
                roleShowData.wingId = config.pid;
                break;
            case UserTemplate.TYPE_SHENGB:
                config = GameGlobal.Config.WeaponSkinConfig[skinid];
                // this.roleShowPanel.SetWeapon(AppearanceConfig.GetUIPath(config.pid));
                roleShowData.swordID = config.pid;
                break;
            case UserTemplate.TYPE_DRESS_FATION:
                config = GameGlobal.Config.FashionSkinConfig[skinid];
                // this.roleShowPanel.SetBody(AppearanceConfig.GetUIPath(config[GameGlobal.actorModel.sex].pid));
                this.isFashion = true;
                roleShowData.clothID = config[GameGlobal.actorModel.sex].pid;
                break;
            case UserTemplate.TYPE_TIANX:
                config = GameGlobal.Config.FairySkinConfig[skinid];
                // this.roleShowPanel.SetTianx(AppearanceConfig.GetUIPath(config.pid));
                roleShowData.tianxId = config.pid;
                break;
        }
        return config;
    };
    /**获取角色的某个类型皮肤ID集合*/
    RoleSuitPanel.prototype.getSkinIdsByType = function (type) {
        var role = SubRoles.ins().GetRoleData();
        var skinList = role.skinDic[type] || [];
        return skinList;
    };
    RoleSuitPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleSuitPanel;
}(BaseEuiView));
__reflect(RoleSuitPanel.prototype, "RoleSuitPanel", ["ICommonWindow"]);
var RoleSuitHeadItem = (function (_super) {
    __extends(RoleSuitHeadItem, _super);
    function RoleSuitHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    RoleSuitHeadItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        var config = this.data;
        this.icon.source = config.icon;
    };
    return RoleSuitHeadItem;
}(eui.ItemRenderer));
__reflect(RoleSuitHeadItem.prototype, "RoleSuitHeadItem");
var RoleSuitItem = (function (_super) {
    __extends(RoleSuitItem, _super);
    function RoleSuitItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RoleSuitItem;
}(eui.Component));
__reflect(RoleSuitItem.prototype, "RoleSuitItem");
var RoleSuitEquipItem = (function (_super) {
    __extends(RoleSuitEquipItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function RoleSuitEquipItem() {
        var _this = _super.call(this) || this;
        _this.skinName = 'RoleSuitEquipItemSkin';
        return _this;
    }
    RoleSuitEquipItem.prototype.createChildren = function () {
        this.title.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
    };
    RoleSuitEquipItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        this.flagImg.source = this.data.flag ? 'ui_yuan' : 'ui_yuan_quse';
        this.flag.text = this.data.flag ? '已激活' : '未激活';
        this.flag.textColor = this.data.flag ? 0xd27701 : 0x94999b;
        if (this.data.config) {
            UIHelper.SetLinkStyleLabel(this.title, this.data.config.name);
            this.itemIcon.data = this.data.config.itemid;
            this.power.textColor = this.data.flag ? 0xd27701 : 0x94999b;
            this.power.text = '战力 ' + ItemConfig.CalcAttrScoreValue(this.data.config.attrpower);
        }
    };
    RoleSuitEquipItem.prototype.tap = function () {
        var pid = this.data.config.skinid;
        if (this.data.type == 1)
            ViewManager.ins().open(RoleRideDressPanel, GameGlobal.UserRide, pid);
        else if (this.data.type == 2)
            ViewManager.ins().open(RoleRideDressPanel, GameGlobal.UserWing, pid);
        else if (this.data.type == 3)
            ViewManager.ins().open(RoleRideDressPanel, GameGlobal.TianxModel, pid);
        else if (this.data.type == 4)
            ViewManager.ins().open(RoleRideDressPanel, GameGlobal.SwordModel, pid);
    };
    return RoleSuitEquipItem;
}(eui.ItemRenderer));
__reflect(RoleSuitEquipItem.prototype, "RoleSuitEquipItem");
//# sourceMappingURL=RoleSuitPanel.js.map