/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 15:01
 * @meaning: 升级/打造详情
 *
 **/
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
var TreasureUpLvPanel = (function (_super) {
    __extends(TreasureUpLvPanel, _super);
    function TreasureUpLvPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        // imgResoure: eui.Image;
        _this.tPanelData = []; //界面总体数据数据(装备)
        _this.tHaveData = []; //拥有而为装备的法宝
        _this.nType = 0; // 0为主界面 1为升级界面
        _this.tDress = []; //装备列表
        _this.nSelect = 0; //选择位置
        _this.tArrInfo = []; //属性列表
        _this.skinName = "TreasureUpPanelSkin";
        _this.roleShowPanel.mShowTianx = false;
        _this.listView.itemRenderer = TreasureHoldIcon;
        _this.mRoleSendCheckData = new RoleSendCheckData(function (type) {
            GameGlobal.TreasureModel.sendSpellsResUpLv(_this.nSelect + 1, type); //位置是从1开始,所以需要加1
        }, function () {
            var config = _this.tPanelData[_this.nSelect];
            if (config && config.cost) {
                var cost = config.cost;
                return [3, 0, cost.id, cost.count]; //因为不消耗钱币,所以,第一二个参数都是模拟为了可以继续进行自动购买
            }
            return null;
        }, function () {
            return _this.checkBox.selected;
        });
        return _this;
    }
    TreasureUpLvPanel.prototype.childrenCreated = function () {
        for (var i = 1; i <= 4; i++) {
            var item = this["pDress" + i];
            this.tDress[i] = item;
            item.initPos(i - 1);
        }
        this._AddClick(this.tDress[1], this.onClick1);
        this._AddClick(this.tDress[2], this.onClick2);
        this._AddClick(this.tDress[3], this.onClick3);
        this._AddClick(this.tDress[4], this.onClick4);
        this.pArrInfo1.lbTitle.text = "下级属性";
        //属性信息列表
        for (var i = 0; i <= 1; i++) {
            var item = this["pArrInfo" + i];
            this.tArrInfo[i] = item;
        }
    };
    TreasureUpLvPanel.prototype.upList = function () {
        this.setData();
        this.listView.dataProvider.replaceAll(this.tHaveData);
    };
    TreasureUpLvPanel.prototype.UpdateContent = function () {
        this.setData();
        this.listView.dataProvider = new eui.ArrayCollection(this.tHaveData);
        for (var i = 1; i <= 4; i++) {
            if (this.tPanelData[i - 1]) {
                this.tDress[i].setData(this.tPanelData[i - 1], this.nSelect);
            }
            else {
                this.tDress[i].setData(null, this.nSelect);
            }
        }
        this.upDateShowRect();
        this.updateTotalPower();
        //更新属性内容
        if (this.nType == 1) {
            //属性内容
            for (var item in this.tArrInfo) {
                this.upDateArrInfo(this.tArrInfo[item], parseInt(item));
            }
        }
        //更新购买消耗提示
        this.upDateBuyInfo();
    };
    TreasureUpLvPanel.prototype.upDateBuyInfo = function () {
        var pArr = this.tPanelData[this.nSelect];
        if (pArr && pArr.cost && pArr.cost.type) {
            var config = GameGlobal.Config.ItemConfig[pArr.cost.id];
            // this.imgResoure.source = RewardData.GetCurrencyMiniRes(pArr.cost.id)
            // this.lbHave.textFlow = ConsumeLabel.GetValueColor(GameGlobal.UserBag.GetCount(pArr.cost.id), pArr.cost.count)
            this.consumeLabel.mIsImg = true;
            this.consumeLabel.consumeItemId = pArr.cost.id;
            this.consumeLabel.curValue = GameGlobal.UserBag.GetCount(pArr.cost.id);
            this.consumeLabel.consumeValue = pArr.cost.count;
            // this.priceIcon.price = 
        }
    };
    /**
     * 显示总战力
     */
    TreasureUpLvPanel.prototype.updateTotalPower = function () {
        var powerAttrs = [];
        for (var pos in this.tPanelData) {
            var data = this.tPanelData[pos];
            if (data && data.attrs) {
                for (var i = 0; i < data.attrs.length; i++) {
                    var attr = new AttributeData;
                    attr.type = data.attrs[i].type;
                    attr.value = data.attrs[i].value;
                    powerAttrs.push(attr);
                }
            }
        }
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(powerAttrs);
    };
    //刷新属性内容
    TreasureUpLvPanel.prototype.upDateArrInfo = function (_item, _index) {
        var pArr = this.tPanelData[this.nSelect];
        if (!pArr)
            return;
        //属性文本内容
        var tcurAttrTxts = [];
        tcurAttrTxts.push(_item.lbArr0);
        tcurAttrTxts.push(_item.lbArr1);
        tcurAttrTxts.push(_item.lbArr2);
        for (var item in tcurAttrTxts) {
            tcurAttrTxts[item].text = "";
        }
        var strSkill = "";
        var strExArr = "";
        var tabelColor = ItemBase.QUALITY_TIP_COLOR[0];
        var tArr;
        if (_index === 0) {
            tArr = pArr.attrs;
            var skillId = pArr.skillid ? (pArr.skillid[0] || 0) : 0;
            //如果没有技能的话技能不需要显示
            if (skillId) {
                strSkill = PetConst.GetSkillName(skillId) + ": " + PetConst.GetSkillDesc(skillId);
                var type = SkillsConfig.GetSkillQuality(skillId);
                tabelColor = ItemBase.QUALITY_TIP_COLOR[type];
            }
            strExArr = "基础属性加成" + pArr.attrstips + "%";
        }
        else {
            if (pArr && pArr.id && pArr.level) {
                var pSpellsLv = GlobalConfig.ins().SpellsResLvproConfig[pArr.id][pArr.level + 1]; //下一级属性
                if (pSpellsLv) {
                    tArr = pSpellsLv.attrs;
                    var skillId = pArr.skillid ? (pArr.skillid[0] || 0) : 0;
                    if (skillId) {
                        strSkill = PetConst.GetSkillName(skillId) + ": " + PetConst.GetSkillDesc(skillId);
                        var type = SkillsConfig.GetSkillQuality(skillId);
                        tabelColor = ItemBase.QUALITY_TIP_COLOR[type];
                    }
                    //如果没有技能的话技能不需要显示
                    // if(pSpellsLv.skillid)
                    // {
                    // 	strSkill =  PetConst.GetSkillName(pSpellsLv.skillid)  +": " +  PetConst.GetSkillDesc(pSpellsLv.skillid)
                    // }
                    strExArr = "基础属性加成" + pSpellsLv.attrstips + "%";
                }
            }
        }
        if (tArr) {
            for (var item in tArr) {
                var data = tArr[item];
                var attrData = void 0;
                attrData = new AttributeData;
                attrData.type = data.type;
                attrData.value = data.value;
                tcurAttrTxts[item].text = AttributeData.getAttStr(attrData, 0);
            }
        }
        //_item.lbSkillInfo.text = strSkill; //技能
        _item.lbSkillInfo.text = ""; //临时处理
        //_item.lbSkillInfo.textFlow=(new egret.HtmlTextParser).parser("<a color="+tabelColor+">" + strSkill + "</a>");
        _item.lbBaseAtt.text = strExArr; //增加属性值
        //_item.lbBaseAtt.textFlow=(new egret.HtmlTextParser).parser("<a color="+tabelColor+">" + strExArr + "</a>");
    };
    //点击选择框改变内容
    TreasureUpLvPanel.prototype.chage = function () {
    };
    //自动购买的内容
    TreasureUpLvPanel.prototype._DoUpdateExp = function () {
    };
    TreasureUpLvPanel.prototype.SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    TreasureUpLvPanel.prototype.setData = function () {
        this.tPanelData = GameGlobal.TreasureModel.getUseList();
        var tGetList = this.deepCopy(GameGlobal.TreasureModel.getHaveList());
        this.tHaveData = [];
        for (var item in tGetList) {
            var pObj = tGetList[item];
            pObj.nPos = this.nSelect + 1; //告诉界面,当前选择位置(后端位置需要从1开始)
            this.tHaveData.push(pObj);
        }
    };
    //实现深拷贝
    TreasureUpLvPanel.prototype.deepCopy = function (target) {
        if (typeof target !== 'object')
            return;
        //判断目标类型，来创建返回值
        var newObj = target instanceof Array ? [] : {};
        for (var item in target) {
            //只复制元素自身的属性，不复制原型链上的
            if (target.hasOwnProperty(item)) {
                newObj[item] = typeof target[item] == 'object' ? this.deepCopy(target[item]) : target[item]; //判断属性值类型
            }
        }
        return newObj;
    };
    TreasureUpLvPanel.prototype.onClick1 = function () {
        this.onClick(0);
    };
    TreasureUpLvPanel.prototype.onClick2 = function () {
        this.onClick(1);
    };
    TreasureUpLvPanel.prototype.onClick3 = function () {
        this.onClick(2);
    };
    TreasureUpLvPanel.prototype.onClick4 = function () {
        this.onClick(3);
    };
    TreasureUpLvPanel.prototype.onClick = function (_nSl) {
        var nSl = _nSl;
        if (this.nSelect === nSl) {
            //弹窗
            this.onEquip(nSl);
            this.upDateShowRect();
        }
        else {
            this.nSelect = nSl;
            this.UpdateContent();
        }
    };
    //装备  _nSl 位置
    TreasureUpLvPanel.prototype.onEquip = function (_nSl) {
        if (this.tPanelData[this.nSelect]) {
            if (!this.tPanelData[this.nSelect].id) {
                //后端以1为开始的数组下标
                if (this.tHaveData[0] && this.tHaveData[0].spellsId) {
                    if (GameGlobal.TreasureModel.canEquip(this.tHaveData[0].type, _nSl)) {
                        GameGlobal.TreasureModel.sendSpellsResUse(_nSl + 1, this.tHaveData[0].spellsId);
                    }
                    else {
                        UserTips.ins().showTips("相同类型的法宝不能装备");
                    }
                }
            }
            else {
                ViewManager.ins().open(TreasureArrInfo, this.tPanelData[this.nSelect], false, false, GameLogic.ins().actorModel.name);
            }
        }
    };
    TreasureUpLvPanel.prototype.upDateShowRect = function () {
        if (this.nType === 1) {
            if (this.tPanelData[this.nSelect] && this.tPanelData[this.nSelect].id) {
                this.gpUp.visible = true;
                this.gpHave.visible = false;
            }
            else {
                this.gpUp.visible = false;
                this.gpHave.visible = true;
            }
        }
    };
    TreasureUpLvPanel.prototype.onUpClick = function (e) {
        switch (e.target) {
            case this.btnDress:
                // if(this.checkBox.selected)
                // {
                // 	this.mRoleAutoSendData.Toggle()
                // }
                // else
                // {
                // 	this.SendUp()
                // }
                this.SendUp();
                break;
        }
    };
    TreasureUpLvPanel.prototype.setType = function (_type) {
        this.observe(MessageDef.TREASURE_CHANGE, this.UpdateContent); //法宝变化
        this.observe(MessageDef.TREASURE_LOCK, this.upList); //上锁变化
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent); //物品变化的时候也刷新一下内容
        // this.observe(MessageDef.TREASURE_UPDATE_LV, this._DoUpdateExp)
        this._AddChange(this.checkBox, this.chage);
        this._AddClick(this.btnDress, this.onUpClick);
        this.nType = _type;
        this.UpdateContent();
        if (this.nType == 0) {
            this.gpHave.visible = true;
            this.gpUp.visible = false;
        }
        else {
            this.gpHave.visible = false;
            this.gpUp.visible = true;
        }
        var roleData = SubRoles.ins().GetRoleData().GetSubRoleData();
        roleData.titleId = 0;
        this.roleShowPanel.SetAll(roleData);
    };
    return TreasureUpLvPanel;
}(BaseView));
__reflect(TreasureUpLvPanel.prototype, "TreasureUpLvPanel", ["ICommonWindowTitle"]);
//身上法宝列表icon
var TreasureHaveIcon = (function (_super) {
    __extends(TreasureHaveIcon, _super);
    function TreasureHaveIcon() {
        var _this = _super.call(this) || this;
        _this.nPos = 0; //选择位置
        _this.nSelect = 0;
        _this.tLockLvList = []; //等级锁列表
        _this.tLockVipList = []; //Vip锁列表
        // 皮肤名称
        _this.skinName = "TreasureHoldIconSkin";
        _this.currentState = "dress";
        return _this;
    }
    //初始化位置
    TreasureHaveIcon.prototype.initPos = function (_pos) {
        this.nPos = _pos;
        var tLockLvList = GlobalConfig.ins().SpellsResBaseConfig.unlocklv;
        for (var item in tLockLvList) {
            this.tLockLvList.push(item);
        }
        var tLockVipList = GlobalConfig.ins().SpellsResBaseConfig.unlockvip;
        for (var item in tLockVipList) {
            this.tLockVipList.push(item);
        }
    };
    TreasureHaveIcon.prototype.setData = function (_data, _select) {
        this.data = _data;
        this.nSelect = _select;
        this.dataChanged();
    };
    TreasureHaveIcon.prototype.dataChanged = function () {
        if (this.nPos == this.nSelect) {
            this.imgSelect.visible = true;
        }
        else {
            this.imgSelect.visible = false;
        }
        if (this.data) {
            if (this.data.name) {
                this.imgCover.visible = false;
                this.gpLv.visible = true;
                this.baseCricle.visible = true;
                //是否开放
                if (this.data.name) {
                    this.lbName.text = this.data.name;
                }
                if (this.data.quality) {
                    this.lbName.textColor = ItemBase.QUALITY_COLOR[this.data.quality];
                }
                //圆形圆圈
                this.baseCricle.setData(this.data);
                //等级
                if (typeof (this.data.level) === "number") {
                    this.lbLv.text = this.data.level;
                }
            }
            else {
                this.lbName.text = "";
                this.gpLv.visible = false;
                this.imgCover.visible = false;
                this.baseCricle.visible = true;
            }
        }
        else {
            if (this.tLockLvList[this.nPos] && this.tLockVipList[this.nPos]) {
                this.lbName.text = this.tLockLvList[this.nPos] + "级或v" + this.tLockVipList[this.nPos];
            }
            this.gpLv.visible = false;
            this.imgCover.visible = true;
            this.lbName.textColor = Color.l_normal;
            this.baseCricle.visible = false;
        }
    };
    return TreasureHaveIcon;
}(BaseView));
__reflect(TreasureHaveIcon.prototype, "TreasureHaveIcon");
//法宝主界面
var TreasureUpFirPanel = (function (_super) {
    __extends(TreasureUpFirPanel, _super);
    function TreasureUpFirPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreasureUpFirPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.setType(0);
    };
    TreasureUpFirPanel.NAME = "法宝";
    return TreasureUpFirPanel;
}(TreasureUpLvPanel));
__reflect(TreasureUpFirPanel.prototype, "TreasureUpFirPanel");
;
//法宝升级界面
var TreasureUpSecPanel = (function (_super) {
    __extends(TreasureUpSecPanel, _super);
    function TreasureUpSecPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreasureUpSecPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.setType(1);
    };
    TreasureUpSecPanel.RedPointCheck = function () {
        return GameGlobal.TreasureModel.mRedPoint.Get(TreasureRedPoint.INDEX_UP_TREASURE);
    };
    TreasureUpSecPanel.NAME = "升级";
    return TreasureUpSecPanel;
}(TreasureUpLvPanel));
__reflect(TreasureUpSecPanel.prototype, "TreasureUpSecPanel");
;
//# sourceMappingURL=TreasureUpLvPanel.js.map