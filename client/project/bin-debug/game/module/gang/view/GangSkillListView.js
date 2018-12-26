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
var GangSkillListView = (function (_super) {
    __extends(GangSkillListView, _super);
    //tDanYaoImg = ["ui_gang_skill_1","ui_gang_skill_2","ui_gang_skill_3","ui_gang_skill_4","ui_gang_skill_5","ui_gang_skill_6","ui_gang_skill_7","ui_gang_skill_8"];
    function GangSkillListView() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mItems = [];
        _this.nSelectIndex = 0;
        // posId 		0 : integer
        // level 		1 : integer
        _this.skillInfoData = [];
        _this.allPower = 0;
        _this.AttrName = ["生命+0", "攻击+0", "防御+0", "速度+0", "暴击+0", "抗暴+0", "命中+0", "闪避+0"];
        return _this;
    }
    GangSkillListView.prototype.childrenCreated = function () {
        for (var i = 0; i <= 7; i++) {
            var item = this["g" + i];
            item.currentState = "open";
            item.nameGroup.visible = false;
            this.mItems[i] = item;
            this._AddClick(item, this._OnItemClick);
            var skill_data = { "posId": i, "level": 0 };
            this.skillInfoData.push(skill_data);
        }
    };
    GangSkillListView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._AddClick(this.btnUp, this.onCkick);
        //this.observe(MessageDef.GANG_SKILL_UP, this.UpdateContent)
        this.observe(MessageDef.GANG_SKILL_UP, this.UpdateSkillInfo);
        this.observe(MessageDef.GUILD_CONTRIB_UPDATE, this.upDateInfo);
        this.observe(MessageDef.GANG_SKILL_LEARN_UP, this.UpdateLearnSkillInfo);
        //this.UpdateContent();
        GameGlobal.GangModel.sendGetSkillInfos();
    };
    GangSkillListView.prototype.UpdateSkillInfo = function (infos) {
        if (infos != null) {
            this.skillInfoData = infos;
        }
        this.nSelectIndex = this.getNextUpSkillData();
        this.UpdateContent();
    };
    GangSkillListView.prototype.UpdateLearnSkillInfo = function (infos) {
        if (infos != null) {
            for (var i = 0; i < this.skillInfoData.length; i++) {
                if (this.skillInfoData[i].posId == infos.posId) {
                    this.skillInfoData[i].level = infos.level;
                    break;
                }
            }
        }
        this.nSelectIndex = this.getNextUpSkillData();
        this.UpdateContent();
    };
    GangSkillListView.prototype.onCkick = function (e) {
        var upDataPos = this.getNextUpSkillData();
        var lv = this.skillInfoData[upDataPos].level;
        var config = this.getNextNeedCostByPosAndLv(lv, this.nSelectIndex);
        if (config == null) {
            return;
        }
        if (GameGlobal.actorModel.contrib >= config.cost.count) {
            GameGlobal.GangModel.sendLearnGangSkill();
        }
        else {
            // UserWarn.ins().BuyGoodsWarn(config.icon)
            UserWarn.ins().BuyGoodsWarn(config.cost.id);
        }
    };
    GangSkillListView.prototype.getNextUpSkillData = function () {
        var nextPos = 0;
        var lv = 1000;
        for (var i = 0; i < this.skillInfoData.length; i++) {
            if (this.skillInfoData[i].level < lv) {
                lv = this.skillInfoData[i].level;
                nextPos = this.skillInfoData[i].posId;
            }
        }
        return nextPos;
    };
    GangSkillListView.prototype.getNextNeedCostByPosAndLv = function (lv, pos, isNext) {
        if (isNext === void 0) { isNext = true; }
        if (isNext) {
            lv = lv + 1;
        }
        var config = GameGlobal.Config.GuildCommonSkillConfig[lv];
        if (config == null) {
            return null;
        }
        return config[pos];
    };
    GangSkillListView.prototype.UpdateContent = function () {
        var gangLevel = GameGlobal.GangModel.myGangInfo.mLevel;
        var config = GameGlobal.Config.GuildLevelConfig[gangLevel];
        this.lvMax_label.text = this.skillInfoData[0].level + "/" + config.skilllv;
        this.upDateInfo();
        this.allPower = 0;
        //总属性战力
        this.setAllSkillAttrs();
        //战力
        this.powerLabel.text = this.allPower;
    };
    GangSkillListView.prototype.upDateInfo = function () {
        var selectIndex = this.nSelectIndex;
        for (var i = 0; i < this.mItems.length; i++) {
            var item = this.mItems[i];
            item.img_select.visible = i == selectIndex;
            this.UpdateItem(i);
        }
        var lv = this.skillInfoData[this.nSelectIndex].level;
        var curConfig = this.getNextNeedCostByPosAndLv(lv, this.nSelectIndex, false);
        var nextConfig = this.getNextNeedCostByPosAndLv(lv, this.nSelectIndex);
        this.nextImage.visible = true;
        this.setCurSkllAttrs(curConfig);
        this.setNextSkllAttrs(nextConfig);
        if (nextConfig == null) {
            return;
        }
        var cost = nextConfig.cost;
        this.price.setType(cost.id);
        this.price.setPrice(cost.count);
        this.price.setMyCount(GameGlobal.actorModel.contrib);
    };
    GangSkillListView.prototype.getCurAllSkillLv = function () {
        var curLV = 0;
        for (var i = 0; i < this.skillInfoData.length; i++) {
            curLV += this.skillInfoData[i].level;
        }
        return curLV;
    };
    GangSkillListView.prototype.UpdateItem = function (itemIndex) {
        var item = this.mItems[itemIndex];
        if (itemIndex < 8) {
            item.img_icon.source = GangConst.GetSkillIcon(itemIndex);
        }
        var strLv = this.skillInfoData[itemIndex].level;
        item.lb_level.text = strLv;
        item.lb_name.textColor = 0x682f00;
    };
    GangSkillListView.prototype._OnItemClick = function (e) {
        // let index = this.mItems.indexOf(e.currentTarget)
        // this.nSelectIndex = index
        // this.upDateInfo()
        for (var i = 0; i < this.mItems.length; i++) {
            if (i == this.nSelectIndex) {
                this.mItems[i].currentState = "down";
            }
            else {
                this.mItems[i].currentState = "up";
            }
        }
    };
    GangSkillListView.prototype.OnClose = function () {
        GameGlobal.MessageCenter.removeAll(this);
        this.removeEvents();
    };
    //private isHadCur = false;
    GangSkillListView.prototype.setCurSkllAttrs = function (config) {
        this.curAttr_label.text = "";
        if (config == null) {
            this.nextImage.visible = false;
            //this.isHadCur = false;
            return;
        }
        //this.isHadCur = true;
        var attrs = config.attrpower;
        for (var i = 0; i < attrs.length; i++) {
            this.curAttr_label.text += AttributeData.getAttStrByType(attrs[i], 0, "+", false, '#682f00');
            if (i % 2 != 0) {
                this.curAttr_label.text += "\n";
            }
            else {
                this.curAttr_label.text += "         ";
            }
        }
    };
    GangSkillListView.prototype.setNextSkllAttrs = function (config) {
        this.nextAttrs_label.text = "";
        if (config == null) {
            this.nextImage.visible = false;
            return;
        }
        this.nextImage.visible = true;
        var attrs = config.attrpower;
        for (var i = 0; i < attrs.length; i++) {
            this.nextAttrs_label.text += AttributeData.getAttStrByType(attrs[i], 0, "+", false, '#682f00');
            if (i % 2 != 0) {
                this.nextAttrs_label.text += "\n";
            }
            else {
                this.nextAttrs_label.text += "         ";
            }
        }
    };
    GangSkillListView.prototype.setAllSkillAttrs = function () {
        var i = 0;
        var config;
        var attrs = new Object();
        for (i = 0; i < this.skillInfoData.length; i++) {
            var lv = this.skillInfoData[i].level;
            config = GameGlobal.Config.GuildCommonSkillConfig[lv];
            if (config == null) {
                continue;
            }
            var _attrs = config[i].attrpower;
            this.allPower += ItemConfig.CalcAttrScoreValue(_attrs);
            for (var j = 0; j < _attrs.length; j++) {
                if (attrs[_attrs[j].type] == null) {
                    attrs[_attrs[j].type] = 0;
                }
                attrs[_attrs[j].type] += _attrs[j].value;
            }
        }
        for (var i_1 = 0; i_1 < 8; i_1++) {
            this['totalAttr' + i_1].text = this.AttrName[i_1];
        }
        var index = 0;
        for (var key in attrs) {
            var attributeData = new AttributeData();
            attributeData.type = parseInt(key);
            attributeData.value = attrs[key];
            if (attributeData) {
                this['totalAttr' + index].text = AttributeData.getAttStrByType(attributeData, 0, "+", false, '#682f00');
            }
            else {
                this['totalAttr' + index].text = '';
            }
            index++;
        }
        //return  attrs;
    };
    GangSkillListView.NAME = "帮会技能";
    return GangSkillListView;
}(BaseView));
__reflect(GangSkillListView.prototype, "GangSkillListView", ["ICommonWindowTitle"]);
//# sourceMappingURL=GangSkillListView.js.map