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
var KaiFuTargetShopPanel = (function (_super) {
    __extends(KaiFuTargetShopPanel, _super);
    function KaiFuTargetShopPanel() {
        var _this = _super.call(this) || this;
        _this.curLookAttrs = [];
        _this.activityType = ActivityKaiFuFuncType.ACT_26_DisCountShop;
        _this.skinName = "KaiFuTargetShopSkin";
        return _this;
    }
    KaiFuTargetShopPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = KaiFuTargetShopItem;
        this.roleShowPanel.scaleX = 0.7;
        this.roleShowPanel.scaleY = 0.7;
    };
    KaiFuTargetShopPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ACTIVITY_TARGET_ShOP_LOOK, this.upDataLook);
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
        _super.prototype.OnOpen.call(this);
        KaiFuTargetShopPanel.curLookIndex = -1;
    };
    KaiFuTargetShopPanel.prototype.upDataLook = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args) {
            var cfgObj = args[0];
            if (cfgObj.stype == 2) {
                var xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(cfgObj.pid);
                if (!xianlvInfo) {
                    return;
                }
                this.attrs_label.text = "战力：\n" + xianlvInfo.GetPower(1);
                this.imageShow_img.source = "";
                this.roleShowPanel.ClearCache();
                this.roleShowPanel.y = 433;
                this.roleShowPanel.SetBody(AppearanceConfig.GetUIPath(cfgObj.pid));
            }
            else {
                KaiFuTargetShopPanel.curLookIndex = cfgObj.index;
                var skinId = cfgObj.pid;
                var type = cfgObj.itemtype;
                var config = this.getSkinConfig(type, skinId);
                if (config == null)
                    return;
                //this.curLookAttrs = this.getPowerAttrs(type,pid);
                this.attrs_label.text = "战力：\n" + ItemConfig.CalcAttrScoreValue(config.attrpower);
                this.roleShowPanel.ClearCache();
                this.imageShow_img.source = "";
                if (type == RoleShowDataType.ROLE_TITLE) {
                    this.imageShow_img.source = config.icon + "";
                }
                else if (type == RoleShowDataType.ROLE_TIANXIAN) {
                    this.roleShowPanel.y = 370;
                    this.roleShowPanel.SetBody(AppearanceConfig.GetUIPath(config.pid));
                }
                else {
                    this.roleShowPanel.y = 433;
                    this.roleShowPanel.SetAll(this.getShowById(type, config.pid));
                }
                this.UpdateContent();
            }
        }
    };
    KaiFuTargetShopPanel.prototype.getSkinConfig = function (type, skinId) {
        var config;
        if (type == RoleShowDataType.ROLE_TITLE) {
            config = GameGlobal.Config.TitleConf;
        }
        else if (type == RoleShowDataType.ROLE_RIDE) {
            config = GameGlobal.Config.RideSkinConfig;
        }
        else if (type == RoleShowDataType.ROLE_WING) {
            config = GameGlobal.Config.WingSkinConfig;
        }
        else if (type == RoleShowDataType.ROLE_SWORD) {
            config = GameGlobal.Config.WeaponSkinConfig;
        }
        else if (type == RoleShowDataType.ROLE_TIANXIAN) {
            config = GameGlobal.Config.FairySkinConfig;
        }
        else if (type == RoleShowDataType.ROLE_SKIN) {
            config = GameGlobal.Config.FashionSkinConfig;
            return config[skinId][GameGlobal.actorModel.sex];
        }
        return config[skinId];
    };
    KaiFuTargetShopPanel.prototype.getShowById = function (type, pid) {
        var role = SubRoles.ins().GetRoleData();
        var roleShowData = role.GetSubRoleData();
        var subRole = new RoleShowData();
        subRole.job = roleShowData.job;
        subRole.sex = roleShowData.sex;
        subRole.rideId = roleShowData.rideId;
        subRole.wingId = roleShowData.wingId;
        subRole.clothID = roleShowData.clothID;
        subRole.swordID = roleShowData.swordID;
        subRole.tianxId = 0;
        if (type == RoleShowDataType.ROLE_RIDE) {
            subRole.rideId = pid;
        }
        else if (type == RoleShowDataType.ROLE_WING) {
            subRole.wingId = pid;
        }
        else if (type == RoleShowDataType.ROLE_SWORD) {
            subRole.swordID = pid;
        }
        else if (type == RoleShowDataType.ROLE_SKIN) {
            subRole.clothID = pid;
        }
        return subRole;
    };
    KaiFuTargetShopPanel.prototype.UpdateContent = function () {
        _super.prototype.UpdateContent.call(this);
    };
    KaiFuTargetShopPanel.curLookIndex = -1;
    return KaiFuTargetShopPanel;
}(KaiFuTargetBasePanel));
__reflect(KaiFuTargetShopPanel.prototype, "KaiFuTargetShopPanel");
var KaiFuTargetShopItem = (function (_super) {
    __extends(KaiFuTargetShopItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuTargetShopItem() {
        return _super.call(this) || this;
    }
    KaiFuTargetShopItem.prototype.childrenCreated = function () {
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.btn_look.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.gainway_txt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    KaiFuTargetShopItem.prototype.onClick = function (e) {
        if (e.currentTarget == this.btn_buy) {
            if (!Checker.Money(this.data.cfg.gold.id, this.data.cfg.gold.count, true)) {
                return;
            }
            GameGlobal.ActivityKaiFuModel.sendReward(this.data.cfg.Id, this.data.cfg.index);
        }
        else if (e.currentTarget == this.btn_look) {
            GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_TARGET_ShOP_LOOK, this.data.cfg);
        }
        else if (e.currentTarget == this.gainway_txt) {
            var cfgObj = this.data.cfg;
            GameGlobal.ViewManager.Guide(cfgObj.gainway[0][1][0]);
        }
    };
    KaiFuTargetShopItem.prototype.dataChanged = function () {
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        var actType = this.data.actType;
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
        this.itemIcon.data = cfgObj.itemid;
        this.itemIcon.isShowName(false);
        this.itemIcon.setCount(cfgObj.count);
        var goodsCfg = GameGlobal.Config.ItemConfig[cfgObj.itemid];
        this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
        this.name_txt.text = goodsCfg.name;
        var buyNum = 0;
        this.btn_look.visible = true;
        if (KaiFuTargetShopPanel.curLookIndex == cfgObj.index) {
            this.btn_look.visible = false;
        }
        if (cfgObj.type.type == 2) {
            //不限购
            this.limit_txt.text = "不限购";
        }
        else {
            if (activityData) {
                buyNum = activityData.buynums[cfgObj.index - 1];
            }
            this.limit_txt.text = "限购（" + buyNum + "/" + cfgObj.type.value + "）";
        }
        var value = cfgObj.value;
        this.imgBuyEnd.visible = false;
        //buyNum = GameGlobal.ActivityKaiFuModel.advancedInfo.getBuyNum(cfgObj.Id);
        if (cfgObj.type.type != 2 && cfgObj.type.value <= buyNum) {
            this.imgBuyEnd.visible = true;
        }
        else {
            if (KaiFuTargetShopPanel.curLookIndex == -1) {
                KaiFuTargetShopPanel.curLookIndex = cfgObj.index;
                GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_TARGET_ShOP_LOOK, cfgObj);
            }
        }
        this.btn_buy.visible = (this.imgBuyEnd.visible) ? false : true;
        this.priceIcon1.text = cfgObj.showgold;
        this.priceIcon2.text = cfgObj.gold.count;
        if (cfgObj.gainway) {
            this.gainway_txt.text = cfgObj.gainway[0][0];
            UIHelper.SetLinkStyleLabel(this.gainway_txt, cfgObj.gainway[0][0]);
        }
        this.gainway_txt.visible = cfgObj.gainway;
    };
    return KaiFuTargetShopItem;
}(eui.ItemRenderer));
__reflect(KaiFuTargetShopItem.prototype, "KaiFuTargetShopItem");
//# sourceMappingURL=KaiFuTargetShopPanel.js.map