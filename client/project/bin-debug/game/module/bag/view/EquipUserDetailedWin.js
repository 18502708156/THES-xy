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
var EquipUserDetailedWin = (function (_super) {
    __extends(EquipUserDetailedWin, _super);
    function EquipUserDetailedWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._totalPower = 0;
        return _this;
    }
    EquipUserDetailedWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "EquipUserTipsSkin";
    };
    ;
    EquipUserDetailedWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var handle = param[0];
        var configID = param[1];
        var data = param[2];
        this.roleModel = param[3];
        this.mConfigId = configID;
        this.mData = data;
        this.setData(handle, configID, data);
        this.AddClick(this, this.CloseSelf);
        this.AddClick(this.btnShow, this.OnShow);
        var config = GameGlobal.Config.ItemConfig[configID];
        var show = GameGlobal.UserRole.IsOrange(config.subType) ? true : false;
        if (config && config.quality < 4 && GameGlobal.actorModel.level >= 40 || show) {
            this.orangeBtn.visible = true;
            this.AddClick(this.orangeBtn, this.OnClickOrange);
            UIHelper.ShowRedPoint(this.orangeBtn, show);
        }
        else {
            this.orangeBtn.visible = false;
        }
    };
    EquipUserDetailedWin.prototype.OnClose = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.CloseSelf, this);
    };
    EquipUserDetailedWin.prototype.OnClickOrange = function () {
        var type = GameGlobal.UserRole.IsOrange(GameGlobal.Config.ItemConfig[this.mConfigId].subType);
        if (!type) {
            var minLevel = 40;
            var actLevel = GameGlobal.actorModel.level;
            var level = Math.max(Math.floor(actLevel / 20) * 20, minLevel);
            type = level;
        }
        ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_EQUIP], type);
    };
    EquipUserDetailedWin.prototype.OnShow = function () {
        if (this.mData && this.mData.itemConfig) {
            //分享
            var tList = [];
            var tObj = { type: 5, value: this.mData.configID, valueEx: this.mData.itemConfig.subType };
            tList.push(tObj);
            GameGlobal.Chat.chatShareInfo(2, tList);
            // UserTips.ins().showTips("展示成功")
        }
    };
    EquipUserDetailedWin.prototype._SetType = function (str) {
        if (str)
            this.type.text = "部位：" + str;
    };
    EquipUserDetailedWin.prototype._SetLv = function (txt, str) {
        if (txt && str)
            this.lv.text = txt + "\uFF1A" + str;
    };
    EquipUserDetailedWin.prototype.setData = function (handle, configID, _data) {
        var data = _data;
        var itemConfig = GlobalConfig.ins().ItemConfig[configID];
        this.nameLabel.text = itemConfig.name;
        this.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
        this.imgTipRect.source = ResDataPath.ITEM_TIp_QUALITY[itemConfig.quality];
        this.itemIcon.setData(itemConfig);
        this._SetType(Role.getEquipNameByType(itemConfig.subType));
        var lv = itemConfig.level + "级";
        this._SetLv("等级", lv);
        this.career.text = "职业：" + Role.getJobNameByJob(itemConfig.job);
        var config = GlobalConfig.ins().EquipConfig[configID];
        var strAtt = AttributeData.getAttStr(config.attrs, 1);
        this.attr.text = strAtt;
        this._totalPower = 0;
        if (_data && _data.GetScore) {
            this._totalPower = _data.GetScore();
            this.score.text = "评分: " + this._totalPower;
        }
        if (this.roleModel) {
            //身上装备
            var len = this.roleModel.getEquipLen();
            for (var i = 0; i < len; i++) {
                var equipsData = this.roleModel.getEquipByIndex(i);
                if (configID && equipsData.item.configID == configID) {
                    this.SetInjectSoulAttr(equipsData, i);
                    this.setForge(equipsData, i);
                    break;
                }
            }
        }
        this.powerLabel.text = this._totalPower;
        egret.callLater(this.LaterUpdate, this);
    };
    EquipUserDetailedWin.prototype.LaterUpdate = function () {
        this.background.height = this.group.height + 50;
    };
    EquipUserDetailedWin.prototype.setForge = function (equipsData, pos) {
        var lv = 0;
        for (var i = 0; i < 4; i++) {
            var lv_1 = equipsData.GetForgeValue(i);
            if (lv_1 > 0) {
                var config = GameGlobal.ForgeModel.GetForgeConfigByPos(pos, lv_1, i);
                if (config) {
                    this.addTips(config.attr, i, lv_1);
                    var power = Math.floor(UserBag.getAttrPower(config.attr));
                    this._totalPower += power;
                }
            }
        }
    };
    ;
    EquipUserDetailedWin.GetTipsGroup = function () {
        var group = new eui.Group;
        group.percentWidth = 100;
        var img = new eui.Image;
        img.source = "ui_bm_tipsfengexian";
        img.left = 5;
        img.right = 5;
        group.addChild(img);
        return group;
    };
    EquipUserDetailedWin.prototype.addTips = function (attr, type, lv) {
        var group = EquipUserDetailedWin.GetTipsGroup();
        var titleAttrTxt = new eui.Label;
        titleAttrTxt.x = this.attTitleLabel.x;
        titleAttrTxt.y = this.attTitleLabel.y;
        titleAttrTxt.style = this.attTitleLabel.style;
        group.addChild(titleAttrTxt);
        var attrTxt = new eui.Label;
        attrTxt.x = this.attr.x;
        attrTxt.y = this.attr.y;
        attrTxt.style = this.attr.style;
        group.addChild(attrTxt);
        this.forgeGroup.addChild(group);
        var attrs;
        switch (type) {
            case ForgeType.BOOST:
                titleAttrTxt.text = "强化属性";
                attrs = AttributeData.getAttrStrAdd(attr, 11);
                break;
            case ForgeType.REFINE:
                titleAttrTxt.text = "精炼属性";
                attrs = AttributeData.getAttrStrAdd(attr, 11);
                break;
            case ForgeType.EXERCISE:
                titleAttrTxt.text = "锻炼属性";
                attrs = AttributeData.getAttrStrAdd(attr, 11);
                break;
            case ForgeType.GEM:
                titleAttrTxt.text = "宝石属性";
                var str = "";
                for (var i = 1; i < 5; i++) {
                    var gem = new eui.Image;
                    gem.x = attrTxt.x;
                    gem.y = (attrTxt.y) + (i - 1) * 28;
                    gem.width = gem.height = 24;
                    group.addChild(gem);
                    var attrName = AttributeData.getAttrStrByType(attr[0].type);
                    var len = ForgeGemPanel.GetLen(attr);
                    if (len > i) {
                        str += "|C:0x2ECA22&T:Lv10|\n";
                        lv -= 10;
                        gem.source = ForgeGemPanel.GetImg(attr[0].type, 10);
                    }
                    else if (len == i) {
                        if (lv == 10) {
                            str += "|C:0x2ECA22&T:Lv10|\n";
                        }
                        else {
                            str += "Lv" + lv;
                        }
                        gem.source = ForgeGemPanel.GetImg(attr[0].type, lv);
                    }
                    else {
                        if (i < 5)
                            str += "\n|C:0x909090&T:";
                        str += attrName + "宝石 未激活|";
                        gem.source = "";
                    }
                }
                attrTxt.lineSpacing = 8;
                var lvTxt = new eui.Label;
                lvTxt.size = 20;
                lvTxt.lineSpacing = 8;
                lvTxt.x = attrTxt.x + 26;
                lvTxt.y = attrTxt.y;
                lvTxt.textFlow = TextFlowMaker.generateTextFlow(str);
                group.addChild(lvTxt);
                attrTxt.x = lvTxt.x + 58;
                attrTxt.height = lvTxt.height;
                attrs = AttributeData.getAttrStrAdd(attr, 15);
                var list = [];
                for (var i_1 = 0; i_1 < attrs.length; i_1++) {
                    if (attrs[i_1].value) {
                        list.push(attrs[i_1]);
                    }
                }
                attrs = list;
                break;
        }
        attrTxt.text = AttributeData.getAttStr(attrs, 1);
    };
    ;
    EquipUserDetailedWin.prototype.SetInjectSoulAttr = function (equipsData, pos) {
        if (!DeityEquipConst.IsDeityEquip(equipsData.item.configID) || equipsData.deityEquipData.injectLevel == 0)
            return;
        var level = equipsData.deityEquipData.injectLevel;
        var config = GameGlobal.Config.DeitySpiritConfig[pos][level - 1];
        if (!config)
            return;
        var group = EquipUserDetailedWin.GetTipsGroup();
        var titleAttrTxt = new eui.Label;
        titleAttrTxt.x = this.attTitleLabel.x;
        titleAttrTxt.y = this.attTitleLabel.y;
        titleAttrTxt.style = this.attTitleLabel.style;
        group.addChild(titleAttrTxt);
        var attrTxt = new eui.Label;
        attrTxt.x = this.attr.x;
        attrTxt.y = this.attr.y;
        attrTxt.style = this.attr.style;
        group.addChild(attrTxt);
        this.forgeGroup.addChild(group);
        titleAttrTxt.text = "注灵属性";
        attrTxt.text = AttributeData.getAttStr(config.attrpower, 1);
    };
    EquipUserDetailedWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return EquipUserDetailedWin;
}(BaseEuiView));
__reflect(EquipUserDetailedWin.prototype, "EquipUserDetailedWin");
//# sourceMappingURL=EquipUserDetailedWin.js.map