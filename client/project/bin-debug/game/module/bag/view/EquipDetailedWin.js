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
var EquipDetailedWin = (function (_super) {
    __extends(EquipDetailedWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function EquipDetailedWin() {
        return _super.call(this) || this;
    }
    EquipDetailedWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "EquipTipsSkin";
    };
    ;
    EquipDetailedWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var configID = param[0];
        var data = param[1];
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
        this.setData(configID, data);
    };
    EquipDetailedWin.prototype.OnClose = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
    };
    EquipDetailedWin.prototype.otherClose = function (evt) {
        ViewManager.ins().close(EquipDetailedWin);
    };
    EquipDetailedWin.prototype._SetType = function (str) {
        if (str)
            this.type.text = "部位：" + str;
    };
    EquipDetailedWin.prototype._SetLv = function (str, color) {
        // this.lv.textFlow = TextFlowMaker.generateTextFlow(`${txt}：|C:${color}&T:${str}|`)
        if (str)
            this.lv.text = str;
    };
    EquipDetailedWin.prototype.setData = function (configID, data) {
        var itemConfig;
        itemConfig = GlobalConfig.ins().ItemConfig[configID];
        this.nameLabel.text = itemConfig.name;
        this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[itemConfig.quality];
        this.itemIcon.setData(itemConfig);
        this.imgTipRect.source = ResDataPath.ITEM_TIp_QUALITY[itemConfig.quality];
        if (data instanceof ItemData || itemConfig != null) {
            var color = void 0;
            color = GameLogic.ins().actorModel.level < itemConfig.lv ? Color.Red : Color.Green;
            if (itemConfig.type == ItemType.EQUIP) {
                this._SetLv("等级：" + itemConfig.level + "级", Color.GetStr(color));
                this._SetType(Role.getEquipNameByType(itemConfig.subType));
                this.career.text = "职业：" + Role.getJobNameByJob(itemConfig.job);
            }
            else {
                this._SetLv("阶数：" + itemConfig.level + "阶", Color.GetStr(color));
                this._SetType(Role.typeNumberToName2[itemConfig.subType]);
                this.career.text = "系统：" + ItemConst.TYPE_NAME[itemConfig.type];
            }
        }
        var equipConfig = GlobalConfig.ins().EquipConfig[configID];
        var strAtt = AttributeData.getAttStr(equipConfig.attrs, 1);
        this.attr.text = strAtt;
        if (data && data.GetScore) {
            this.score.text = "评分: " + data.GetScore();
            this.powerLabel.text = data.GetScore();
        }
        else {
            this.score.text = "评分: " + ItemConfig.CalcAttrScoreValue(equipConfig.attrs);
            this.powerLabel.text = ItemConfig.CalcAttrScoreValue(equipConfig.attrs);
        }
        if (data && data.att && data.att.length) {
            this.AddAttrTips("附加属性", data.att);
        }
        egret.callLater(this.LaterUpdate, this);
    };
    EquipDetailedWin.prototype.AddAttrTips = function (type, attr) {
        var group = EquipUserDetailedWin.GetTipsGroup();
        var titleAttrTxt = new eui.Label;
        titleAttrTxt.x = this.attTitleLabel.x;
        titleAttrTxt.y = this.attTitleLabel.y;
        titleAttrTxt.style = this.attTitleLabel.style;
        titleAttrTxt.text = type;
        group.addChild(titleAttrTxt);
        var attrTxt = new eui.Label;
        attrTxt.x = this.attr.x;
        attrTxt.y = this.attr.y;
        attrTxt.style = this.attr.style;
        group.addChild(attrTxt);
        attrTxt.text = AttributeData.getAttStr(attr, 1);
        this.forgeGroup.addChild(group);
    };
    EquipDetailedWin.prototype.AddTips = function (descStr) {
        var group = EquipUserDetailedWin.GetTipsGroup();
        var desc = new eui.Label;
        desc.style = this.attTitleLabel.style;
        desc.x = this.attTitleLabel.x;
        desc.y = this.attTitleLabel.y;
        desc.style = this.attTitleLabel.style;
        desc.textFlow = TextFlowMaker.generateTextFlow(descStr);
        group.addChild(desc);
        this.forgeGroup.addChild(group);
    };
    EquipDetailedWin.prototype.LaterUpdate = function () {
        this.background.height = this.group.height + 50;
    };
    return EquipDetailedWin;
}(BaseEuiView));
__reflect(EquipDetailedWin.prototype, "EquipDetailedWin");
EquipDetailedWin.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=EquipDetailedWin.js.map