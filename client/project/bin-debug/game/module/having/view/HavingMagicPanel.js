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
var HavingMagicPanel = (function (_super) {
    __extends(HavingMagicPanel, _super);
    function HavingMagicPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        /**天女法器model */
        _this.model = GameGlobal.HavingMagicModel;
        /**技能槽 */
        _this.skillPlots = [];
        /**当前装备位置索引 */
        _this.pos = 1;
        /**技能当前属性部位索引记录 */
        _this.skillAttrsDic = {};
        /**技能洗练属性部位索引记录 */
        _this.skillWashAttrsDic = {};
        /**技能洗练次数-- 对于星星显示的处理*/
        _this.skillWashNums = [];
        /**当前属性文本组*/
        _this.curAttrTxts = [];
        /**洗练属性文本组*/
        _this.washAttrTxts = [];
        /**洗练锁定属性位置 */
        _this.lockAry = [];
        /**洗练高品质提示位置 */
        _this.betterAry = [];
        return _this;
    }
    HavingMagicPanel.prototype.childrenCreated = function () {
        //装备槽
        this.skillPlots.push(this.HavingSkillItem1);
        this.skillPlots.push(this.HavingSkillItem2);
        this.skillPlots.push(this.HavingSkillItem3);
        this.skillPlots.push(this.HavingSkillItem4);
        //当前属性
        this.curAttrTxts.push(this.curAttackLabel);
        this.curAttrTxts.push(this.curDefenseLabel);
        this.curAttrTxts.push(this.curCritLabel);
        this.curAttrTxts.push(this.curSkill);
        //洗练属性
        this.washAttrTxts.push(this.xilianAttackLabel3);
        this.washAttrTxts.push(this.xilianDefenseLabel);
        this.washAttrTxts.push(this.xilianCritLabel);
        this.washAttrTxts.push(this.xilianSkill);
        this._AddClick(this.HavingSkillItem1, this._OnClick);
        this._AddClick(this.HavingSkillItem2, this._OnClick);
        this._AddClick(this.HavingSkillItem3, this._OnClick);
        this._AddClick(this.HavingSkillItem4, this._OnClick);
        this._AddClick(this.lock0, this._OnClick);
        this._AddClick(this.lock1, this._OnClick);
        this._AddClick(this.lock2, this._OnClick);
        this._AddClick(this.lock3, this._OnClick);
        this._AddClick(this.starGroup, this._OnClick);
        this._AddClick(this.btnXiLian, this._OnClick);
        this._AddClick(this.btnAdvXilian, this._OnClick);
        this._AddClick(this.btnChange, this._OnClick);
        this._AddClick(this.help, this._click);
        this.initViewData();
    };
    /**
 * 面板开启执行函数，用于子类继承
 * @param param 参数
 */
    HavingMagicPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.HAVING_UPDATE, this.initViewData);
        this.observe(MessageDef.HAVING_WASH_INFO, this.updateWashData);
        this.observe(MessageDef.HAVING_WASH_REPLACE_INFO, this.updateWashReplaceData);
        this.observe(MessageDef.BYB_CHANGE, this.updateItemCount);
        this.observe(MessageDef.YB_CHANGE, this.updateItemCount);
    };
    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    HavingMagicPanel.prototype.OnClose = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.removeObserve();
    };
    HavingMagicPanel.prototype._click = function () {
        ViewManager.ins().open(ActivityDescPanel, 14, "规则说明");
    };
    HavingMagicPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.HavingSkillItem1:
            case this.HavingSkillItem2:
            case this.HavingSkillItem3:
            case this.HavingSkillItem4:
                var item = e.currentTarget;
                if (item.isopen) {
                    this.setState(item.pos);
                    this.pos = item.pos;
                    this.showContent(this.pos);
                }
                else {
                    UserTips.ins().showTips(this.skillConfigData[item.pos].des);
                }
                break;
            case this.btnXiLian:
                if (UserBag.ins().GetCount(this.freshData[0].itemId) >= this.priceIcon2.price) {
                    if (this.isWarn()) {
                        var quality = GameGlobal.HavingModel.getBaseConfig().prompt;
                        WarnWin.showCheckBox("btnXiLian", '洗练属性存在|C:' + ItemBase.GetColorByQuality(quality) + '&T:[' + ItemBase.QUALITY_NAME_STR[quality] + '品质或以上]|的属性或技能，是否继续洗练？属性与技能替换后生效', this.okHandler, this);
                    }
                    else {
                        this.model.sendTiannvWash(this.pos, 1, this.lockAry);
                    }
                }
                else {
                    Checker.CheckItem(this.freshData[0].itemId, this.priceIcon2.price, false);
                }
                break;
            case this.btnAdvXilian:
                if (UserBag.ins().GetCount(this.freshData[1].itemId) >= this.priceIcon3.price) {
                    if (this.isWarn()) {
                        var quality = GameGlobal.HavingModel.getBaseConfig().prompt;
                        WarnWin.showCheckBox("btnAdvXilian", '洗练属性存在|C:' + ItemBase.GetColorByQuality(quality) + '&T:[' + ItemBase.QUALITY_NAME_STR[quality] + '品质以上]|的属性或技能，是否继续洗练？属性与技能替换后生效', this.okSuperHandler, this);
                    }
                    else {
                        this.model.sendTiannvWash(this.pos, 2, this.lockAry);
                    }
                }
                else {
                    // UserTips.ins().showTips('高级洗练道具不足');
                    Checker.CheckItem(this.freshData[1].itemId, this.priceIcon3.price, false);
                }
                break;
            case this.btnChange:
                if (this.skillWashAttrsDic[this.pos] && this.skillWashAttrsDic[this.pos].length > 0) {
                    this.model.sendTiannvWashReplace(this.pos);
                }
                else {
                    UserTips.ins().showTips('没有洗练属性可更换');
                }
                break;
            case this.starGroup:
                var desc = '法器洗练已累计刷新：';
                var count = this.skillWashNums[this.pos - 1] + "次";
                var c = 0xc400fd;
                ViewManager.ins().open(PetXilianTipPanel, this.skillConfigData[this.pos].name, desc, count, c, GameGlobal.Config.FemaleDevaBaseConfig.freshitemid);
                break;
            case this.lock0:
            case this.lock1:
            case this.lock2:
            case this.lock3:
                var lock = e.currentTarget;
                if (lock.islock || Checker.Money(MoneyConst.yuanbao, this.freshMoneyData[this.lockAry.length])) {
                    lock.islock = !lock.islock;
                    lock.setLockImg(lock.islock);
                    if (lock.islock) {
                        this.lockAry.push(lock.lockid);
                    }
                    else {
                        var index = this.lockAry.indexOf(lock.lockid);
                        if (index > -1) {
                            this.lockAry.splice(index, 1);
                        }
                    }
                    this.lockAry.sort();
                    this.showLockState(this.lockAry);
                    this.setPrice1();
                }
                break;
        }
    };
    HavingMagicPanel.prototype.isWarn = function () {
        var isBetter = false;
        for (var i = 0; i < this.betterAry.length; i++) {
            if (this.betterAry[i]) {
                if (this.lockAry.indexOf(i + 1) == -1) {
                    isBetter = true;
                }
            }
        }
        return isBetter;
    };
    HavingMagicPanel.prototype.showLockState = function (lockAry) {
        var i = 1;
        var len = this.lockAry.length;
        for (i = 1; i <= 4; i++) {
            this['lock' + (i - 1)].visible = true;
        }
        if (len == 3) {
            for (i = 1; i <= 4; i++) {
                var index = this.lockAry.indexOf(i);
                if (index == -1)
                    this['lock' + (i - 1)].visible = false;
            }
        }
    };
    HavingMagicPanel.prototype.okHandler = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        this.model.sendTiannvWash(this.pos, 1, this.lockAry);
    };
    HavingMagicPanel.prototype.okSuperHandler = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        this.model.sendTiannvWash(this.pos, 2, this.lockAry);
    };
    HavingMagicPanel.prototype.setState = function (index) {
        var i = 0, len = this.skillPlots.length;
        for (i; i < len; i++) {
            this.skillPlots[i].currentState = 'up';
        }
        this['HavingSkillItem' + index].currentState = 'down';
    };
    //初始化技能数据
    HavingMagicPanel.prototype.initViewData = function () {
        this.skillConfigData = this.model.getMagicConfig();
        //初始化技能图标和名字
        for (var index in this.skillConfigData) {
            var name_1 = this.skillConfigData[index].name;
            var icon = this.skillConfigData[index].icon;
            this.skillPlots[parseInt(index) - 1].setSkillName(parseInt(index), name_1);
            this.skillPlots[parseInt(index) - 1].setSkillIcon(icon, false);
            this.skillPlots[parseInt(index) - 1].pos = parseInt(index);
            this['skillAttr' + index].visible = false;
        }
        //获取技能属性
        var i = 0, len = this.model.skillData.length;
        for (i; i < len; i++) {
            this.skillPlots[i].setOpen(true); //开锁
            this['skillAttr' + (i + 1)].visible = true;
            this.skillAttrsDic[i + 1] = this.model.skillData[i].attrData;
            this.skillWashAttrsDic[i + 1] = this.model.skillData[i].washData;
            this.skillWashNums[i] = this.model.skillData[i].washNum;
        }
        //洗练所需的材料
        this.freshData = GameGlobal.HavingModel.getBaseConfig().freshitemid;
        this.priceIcon2.type = this.freshData[0].itemId;
        this.priceIcon2.price = 1;
        this.priceIcon2.setMyCount(UserBag.ins().GetCount(this.freshData[0].itemId));
        this.priceIcon3.type = this.freshData[1].itemId;
        this.priceIcon3.price = 1;
        this.priceIcon3.setMyCount(UserBag.ins().GetCount(this.freshData[1].itemId));
        //洗练锁定技能消耗元宝
        this.freshMoneyData = GameGlobal.HavingModel.getBaseConfig().freshMoney;
        this.priceIcon1.type = MoneyConst.yuanbao;
        this.priceIcon1.price = 0;
        this.UpdateContent();
    };
    HavingMagicPanel.prototype.UpdateContent = function () {
        this.showContent(this.pos);
    };
    /**
     * 显示当前选中技能槽数据
     * @param pos 索引从 1 开始
     */
    HavingMagicPanel.prototype.showContent = function (pos) {
        var xilianStars = GameGlobal.HavingModel.getBaseConfig().polishStar;
        if (this.skillWashNums[pos - 1] >= xilianStars[xilianStars.length - 1]) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
        }
        if (this.skillAttrsDic[pos]) {
            //选中
            this.setState(pos);
        }
        //设置形象
        this.showPanel.SetBody(AppearanceConfig.GetUIPath(GameGlobal.HavingModel.SkinConfig[GameGlobal.HavingModel.mDressId].pid));
        //显示属性
        this.updateAttrs(pos);
        this.updateWashAttrs(pos);
        //星星
        this.updateStars(pos);
        //战力
        this.updateTotalPower();
    };
    /**显示洗练次数星星 */
    HavingMagicPanel.prototype.updateStars = function (pos) {
        var xilianStars = GameGlobal.HavingModel.getBaseConfig().polishStar;
        for (var i = 0; i < this.starGroup.numChildren; i++) {
            var item = this.starGroup.getChildAt(i);
            item.source = this.skillWashNums[pos - 1] >= xilianStars[i] ? "ui_bm_star022" : "ui_bm_star021";
        }
    };
    /**当前属性
     * @param pos
     */
    HavingMagicPanel.prototype.updateAttrs = function (pos) {
        this.curIconImg.visible = false;
        this.curSkillDes.text = '';
        for (var x = 1; x < this.skillPlots.length + 1; x++) {
            if (this.skillAttrsDic[x]) {
                var i = 0, len = this.skillAttrsDic[x].length;
                var str = '';
                var data = void 0, config = void 0, data2 = void 0;
                var attrsConfig = void 0;
                this.lockAry = [];
                this.setPrice1();
                for (i; i < len; i++) {
                    //初始锁定图标状态
                    this['lock' + i].islock = false;
                    this['lock' + i].setLockImg(false);
                    this['lock' + i].lockid = i + 1;
                    if (this.skillAttrsDic[pos] != undefined)
                        data = this.skillAttrsDic[pos][i];
                    data2 = this.skillAttrsDic[x][i];
                    if (data != undefined) {
                        if (1 == data.type) {
                            attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data.attrs);
                            var attrs = new AttributeData;
                            attrs.type = attrsConfig.attrs.type;
                            attrs.value = attrsConfig.attrs.value;
                            this.curAttrTxts[i].text = AttributeData.getAttStr(attrs, 0);
                            var color = ItemBase.GetColorByQuality(attrsConfig.quality);
                            this.curAttrTxts[i].textColor = color;
                            // str += '|C:' + color + '&T:' + AttributeData.getAttStr(attrs, 0) + '|\n';
                        }
                        else if (2 == data.type) {
                            config = GameGlobal.Config.EffectsConfig[data.skillNo];
                            if (config) {
                                this.curIconImg.visible = true;
                                this.curIconImg.source = config[GameGlobal.Config.EffectsConfig_keys.icon];
                                this.curAttrTxts[i].text = config[GameGlobal.Config.EffectsConfig_keys.skinName];
                                var quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                                var color = ItemBase.GetColorByQuality(quality);
                                this.curAttrTxts[i].textColor = color;
                                this.curSkillDes.text = config[GameGlobal.Config.EffectsConfig_keys.desc];
                                // str += "|C:" + color + "&T:" + config[GameGlobal.Config.EffectsConfig_keys.skinName] + "|";
                            }
                            else {
                                if (true) {
                                    this.curAttrTxts[i].text = '没得配置';
                                    this.curSkillDes.text = '技能ID获取不了配置：' + data.skillNo;
                                }
                                else {
                                    this.curAttrTxts[i].text = '';
                                    this.curSkillDes.text = "";
                                }
                            }
                        }
                    }
                    else {
                        this.curAttrTxts[i].text = "";
                    }
                    if (data2) {
                        if (1 == data2.type) {
                            attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data2.attrs);
                            var attrs = new AttributeData;
                            attrs.type = attrsConfig.attrs.type;
                            attrs.value = attrsConfig.attrs.value;
                            var color = ItemBase.GetColorByQuality(attrsConfig.quality);
                            str += '|C:' + color + '&T:' + AttributeData.getAttStr(attrs, 0) + '|\n';
                        }
                        else if (2 == data2.type) {
                            config = GameGlobal.Config.EffectsConfig[data2.skillNo];
                            if (config) {
                                var quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                                var color = ItemBase.GetColorByQuality(quality);
                                str += "|C:" + color + "&T:" + config[GameGlobal.Config.EffectsConfig_keys.skinName] + "|";
                            }
                        }
                    }
                }
                this["attrsLabel" + x].textFlow = TextFlowMaker.generateTextFlow(str);
            }
        }
    };
    /**当前属性2
     * @param pos
     */
    HavingMagicPanel.prototype.updateAttrs2 = function (pos) {
        this.curIconImg.visible = false;
        this.curSkillDes.text = '';
        for (var x = 1; x < this.skillPlots.length + 1; x++) {
            if (this.skillAttrsDic[x]) {
                var i = 0, len = this.skillAttrsDic[x].length;
                var str = '';
                var data = void 0, config = void 0, data2 = void 0;
                var attrsConfig = void 0;
                // this.lockAry = [];
                this.setPrice1();
                for (i; i < len; i++) {
                    //初始锁定图标状态
                    // (this['lock' + i] as HavingLockItem).islock = false;
                    // (this['lock' + i] as HavingLockItem).setLockImg(false);
                    // (this['lock' + i] as HavingLockItem).lockid = i + 1;
                    if (this.skillAttrsDic[pos] != undefined)
                        data = this.skillAttrsDic[pos][i];
                    data2 = this.skillAttrsDic[x][i];
                    if (data != undefined) {
                        if (1 == data.type) {
                            attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data.attrs);
                            var attrs = new AttributeData;
                            attrs.type = attrsConfig.attrs.type;
                            attrs.value = attrsConfig.attrs.value;
                            this.curAttrTxts[i].text = AttributeData.getAttStr(attrs, 0);
                            var color = ItemBase.GetColorByQuality(attrsConfig.quality);
                            this.curAttrTxts[i].textColor = color;
                            // str += '|C:' + color + '&T:' + AttributeData.getAttStr(attrs, 0) + '|\n';
                        }
                        else if (2 == data.type) {
                            config = GameGlobal.Config.EffectsConfig[data.skillNo];
                            if (config) {
                                this.curIconImg.visible = true;
                                this.curIconImg.source = config[GameGlobal.Config.EffectsConfig_keys.icon];
                                this.curAttrTxts[i].text = config[GameGlobal.Config.EffectsConfig_keys.skinName];
                                var quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                                var color = ItemBase.GetColorByQuality(quality);
                                this.curAttrTxts[i].textColor = color;
                                this.curSkillDes.text = config[GameGlobal.Config.EffectsConfig_keys.desc];
                                // str += "|C:" + color + "&T:" + config[GameGlobal.Config.EffectsConfig_keys.skinName] + "|";
                            }
                            else {
                                if (true) {
                                    this.curAttrTxts[i].text = '没得配置';
                                    this.curSkillDes.text = '技能ID获取不了配置：' + data.skillNo;
                                }
                                else {
                                    this.curAttrTxts[i].text = '';
                                    this.curSkillDes.text = '';
                                }
                            }
                        }
                    }
                    else {
                        this.curAttrTxts[i].text = "";
                    }
                    if (data2) {
                        if (1 == data2.type) {
                            attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data2.attrs);
                            var attrs = new AttributeData;
                            attrs.type = attrsConfig.attrs.type;
                            attrs.value = attrsConfig.attrs.value;
                            var color = ItemBase.GetColorByQuality(attrsConfig.quality);
                            str += '|C:' + color + '&T:' + AttributeData.getAttStr(attrs, 0) + '|\n';
                        }
                        else if (2 == data2.type) {
                            config = GameGlobal.Config.EffectsConfig[data2.skillNo];
                            if (config) {
                                var quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                                var color = ItemBase.GetColorByQuality(quality);
                                str += "|C:" + color + "&T:" + config[GameGlobal.Config.EffectsConfig_keys.skinName] + "|";
                            }
                        }
                    }
                }
            }
        }
    };
    HavingMagicPanel.prototype.setPrice1 = function () {
        var len = this.lockAry.length;
        if (len > 0)
            this.priceIcon1.price = this.freshMoneyData[len - 1];
        else
            this.priceIcon1.price = 0;
    };
    /**洗练更换数据 */
    HavingMagicPanel.prototype.updateWashReplaceData = function (rsp) {
        this.skillAttrsDic[rsp.pos] = rsp.attrData;
        this.skillWashAttrsDic[rsp.pos] = rsp.washData;
        this.updateAttrs(rsp.pos);
        this.updateWashAttrs(rsp.pos, true);
        this.updateTotalPower();
    };
    /**洗练数据 */
    HavingMagicPanel.prototype.updateWashData = function (rsp) {
        this.priceIcon2.setMyCount(UserBag.ins().GetCount(this.freshData[0].itemId));
        this.priceIcon3.setMyCount(UserBag.ins().GetCount(this.freshData[1].itemId));
        this.skillWashAttrsDic[rsp.pos] = rsp.washData;
        if (rsp.washNum != undefined)
            this.skillWashNums[rsp.pos - 1] = rsp.washNum;
        this.updateStars(rsp.pos);
        this.updateWashAttrs(rsp.pos);
        //this.skillAttrsDic[rsp.pos] = rsp.attrData;
        this.updateAttrs2(rsp.pos);
    };
    //更新道具拥有个数
    HavingMagicPanel.prototype.updateItemCount = function () {
        this.priceIcon2.setMyCount(UserBag.ins().GetCount(this.freshData[0].itemId));
        this.priceIcon3.setMyCount(UserBag.ins().GetCount(this.freshData[1].itemId));
    };
    /**洗练属性
     * @param pos
     * @param isClear 是否清空数据
     */
    HavingMagicPanel.prototype.updateWashAttrs = function (pos, isClear) {
        if (isClear === void 0) { isClear = true; }
        this.nextIconImg.visible = false;
        if (isClear) {
            for (var j = 0; j < 4; j++) {
                this.washAttrTxts[j].text = '';
            }
            this.xilianSkillDes.text = '';
            this.betterAry = [];
        }
        if (this.skillWashAttrsDic[pos]) {
            var i = void 0;
            var len = this.skillWashAttrsDic[pos].length;
            var data = void 0, config = void 0;
            var attrsConfig = void 0;
            this.xilianSkillDes.text = '';
            for (i = 0; i < len; i++) {
                data = this.skillWashAttrsDic[pos][i];
                if (data) {
                    if (1 == data.type) {
                        attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data.attrs);
                        var attrs = new AttributeData;
                        attrs.type = attrsConfig.attrs.type;
                        attrs.value = attrsConfig.attrs.value;
                        this.washAttrTxts[i].text = AttributeData.getAttStr(attrs, 0);
                        this.washAttrTxts[i].textColor = ItemBase.GetColorByQuality(attrsConfig.quality);
                        if (this.lockAry.indexOf(i + 1) == -1) {
                            if (attrsConfig.quality >= GameGlobal.HavingModel.getBaseConfig().prompt) {
                                this.betterAry[i] = true;
                            }
                            else {
                                this.betterAry[i] = false;
                            }
                        }
                        else {
                            this.betterAry[i] = false;
                        }
                    }
                    else if (2 == data.type) {
                        config = GameGlobal.Config.EffectsConfig[data.skillNo];
                        if (config) {
                            this.nextIconImg.visible = true;
                            this.nextIconImg.source = config[GameGlobal.Config.EffectsConfig_keys.icon];
                            this.washAttrTxts[i].text = config[GameGlobal.Config.EffectsConfig_keys.skinName];
                            this.xilianSkillDes.text = config[GameGlobal.Config.EffectsConfig_keys.desc];
                            //好品质提示
                            var quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                            this.washAttrTxts[i].textColor = ItemBase.GetColorByQuality(quality);
                            if (this.lockAry.indexOf(i + 1) == -1) {
                                if (quality >= GameGlobal.HavingModel.getBaseConfig().prompt) {
                                    this.betterAry[i] = true;
                                }
                                else {
                                    this.betterAry[i] = false;
                                }
                            }
                            else {
                                this.betterAry[i] = false;
                            }
                        }
                        else {
                            if (true) {
                                this.washAttrTxts[i].text = '没得配置';
                                this.xilianSkillDes.text = '技能ID获取不了配置：' + data.skillNo;
                            }
                            else {
                                this.washAttrTxts[i].text = '';
                                this.xilianSkillDes.text = "";
                            }
                        }
                    }
                }
                else {
                    this.washAttrTxts[i].text = "";
                }
            }
        }
    };
    /**
     * 显示总战力
     */
    HavingMagicPanel.prototype.updateTotalPower = function () {
        var powerAttrs = [];
        for (var pos in this.skillAttrsDic) {
            var data = this.skillAttrsDic[pos];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i] && 1 == data[i].type) {
                        var attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data[i].attrs);
                        if (!attrsConfig) {
                            continue;
                        }
                        var attrs = new AttributeData;
                        attrs.type = attrsConfig.attrs.type;
                        attrs.value = attrsConfig.attrs.value;
                        powerAttrs.push(attrs);
                    }
                }
            }
        }
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(powerAttrs);
    };
    HavingMagicPanel.RedPointCheck = function () {
        return GameGlobal.HavingModel.mRedPoint.Get(HavingModelRedPoint.INDEX_SKILL_ITEM);
    };
    HavingMagicPanel.NAME = "法器";
    return HavingMagicPanel;
}(BaseView));
__reflect(HavingMagicPanel.prototype, "HavingMagicPanel", ["ICommonWindowTitle"]);
var HavingLockItem = (function (_super) {
    __extends(HavingLockItem, _super);
    function HavingLockItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.islock = false;
        _this.lockid = 0;
        return _this;
    }
    HavingLockItem.prototype.setLockImg = function (islock) {
        this.lockImg.source = islock ? 'ui_tn_icon_suo02' : 'ui_tn_icon_suo01';
    };
    return HavingLockItem;
}(eui.Component));
__reflect(HavingLockItem.prototype, "HavingLockItem");
var HavingSkillItem = (function (_super) {
    __extends(HavingSkillItem, _super);
    function HavingSkillItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.isopen = false;
        return _this;
    }
    //设置技能名称
    HavingSkillItem.prototype.setSkillName = function (index, name) {
        switch (index) {
            case 1:
            case 2:
                this.skillUpName.text = name;
                this.skillUpName.visible = true;
                break;
            case 3:
            case 4:
                this.skillBottomName.text = name;
                this.skillBottomName.visible = true;
                break;
        }
    };
    //设置技能图标
    HavingSkillItem.prototype.setSkillIcon = function (iconImg, isopen) {
        this.skillIcon.source = iconImg;
        this.setOpen(isopen);
    };
    HavingSkillItem.prototype.setOpen = function (isopen) {
        this.isopen = isopen;
        this.skillIcon.filters = isopen ? null : Color.GetFilter();
    };
    return HavingSkillItem;
}(eui.Component));
__reflect(HavingSkillItem.prototype, "HavingSkillItem");
//# sourceMappingURL=HavingMagicPanel.js.map