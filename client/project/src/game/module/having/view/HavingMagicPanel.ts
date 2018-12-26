class HavingMagicPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "法器";

    /////////////////////////////////////////////////////////////////////////////
    // HavingMagicSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected powerLabel: PowerLabel;
    protected showPanel: PetShowPanel;
    protected skillAttr1: eui.Group;
    protected attrsLabel1: eui.Label;
    protected skillAttr2: eui.Group;
    protected attrsLabel2: eui.Label;
    protected skillAttr3: eui.Group;
    protected attrsLabel3: eui.Label;
    protected skillAttr4: eui.Group;
    protected attrsLabel4: eui.Label;
    protected curIconImg: eui.Image;
    protected nextIconImg: eui.Image;
    protected HavingSkillItem1: HavingSkillItem;
    protected HavingSkillItem2: HavingSkillItem;
    protected HavingSkillItem3: HavingSkillItem;
    protected HavingSkillItem4: HavingSkillItem;
    protected curAttackLabel: eui.Label;
    protected curDefenseLabel: eui.Label;
    protected curCritLabel: eui.Label;
    protected xilianAttackLabel3: eui.Label;
    protected xilianDefenseLabel: eui.Label;
    protected xilianCritLabel: eui.Label;
    protected curSkill: eui.Label;
    protected xilianSkill: eui.Label;
    protected priceIcon1: PriceIcon;
    protected curSkillDes: eui.Label;
    protected xilianSkillDes: eui.Label;
    protected starGroup: eui.Group;
    protected lock0: HavingLockItem;
    protected lock1: HavingLockItem;
    protected lock2: HavingLockItem;
    protected lock3: HavingLockItem;
    protected btnXiLian: eui.Button;
    protected btnAdvXilian: eui.Button;
    protected btnChange: eui.Button;
    protected priceIcon2: PriceIcon;
    protected priceIcon3: PriceIcon;
    protected help: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    /**天女法器model */
    private model = GameGlobal.HavingMagicModel;
    /**天女法器配置数据*/
    private skillConfigData;
    /**技能槽 */
    private skillPlots = [];
    /**当前装备位置索引 */
    private pos: number = 1;

    /**技能当前属性部位索引记录 */
    private skillAttrsDic = {};
    /**技能洗练属性部位索引记录 */
    private skillWashAttrsDic = {};
    /**技能洗练次数-- 对于星星显示的处理*/
    private skillWashNums = [];
    /**当前属性文本组*/
    private curAttrTxts = [];
    /**洗练属性文本组*/
    private washAttrTxts = [];

    /**洗练物品数据 */
    private freshData;
    /**洗练次数元宝数 */
    private freshMoneyData;
    /**洗练锁定属性位置 */
    private lockAry = [];
    /**洗练高品质提示位置 */
    private betterAry = [];

    public constructor() {
        super()
    }

    public childrenCreated() {
        //装备槽
        this.skillPlots.push(this.HavingSkillItem1)
        this.skillPlots.push(this.HavingSkillItem2)
        this.skillPlots.push(this.HavingSkillItem3)
        this.skillPlots.push(this.HavingSkillItem4)

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
        this._AddClick(this.btnXiLian, this._OnClick)
        this._AddClick(this.btnAdvXilian, this._OnClick)
        this._AddClick(this.btnChange, this._OnClick);
        this._AddClick(this.help, this._click)

        this.initViewData()
    }

    /**
 * 面板开启执行函数，用于子类继承
 * @param param 参数
 */
    public OnOpen(...param: any[]) {

        this.observe(MessageDef.HAVING_UPDATE, this.initViewData);
        
        this.observe(MessageDef.HAVING_WASH_INFO, this.updateWashData);
        this.observe(MessageDef.HAVING_WASH_REPLACE_INFO, this.updateWashReplaceData);

        this.observe(MessageDef.BYB_CHANGE, this.updateItemCount);
        this.observe(MessageDef.YB_CHANGE, this.updateItemCount);
    }

    /**
	 * 面板关闭执行函数，用于子类继承
	 * @param param 参数
	 */
    public OnClose(...param: any[]) {
        this.removeObserve();
    }

    public _click() {
        ViewManager.ins().open(ActivityDescPanel, 14, "规则说明");
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.HavingSkillItem1:
            case this.HavingSkillItem2:
            case this.HavingSkillItem3:
            case this.HavingSkillItem4:
                let item: HavingSkillItem = e.currentTarget as HavingSkillItem;
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
                        let quality = GameGlobal.HavingModel.getBaseConfig().prompt;
                        WarnWin.showCheckBox("btnXiLian",'洗练属性存在|C:' + ItemBase.GetColorByQuality(quality) + '&T:[' + ItemBase.QUALITY_NAME_STR[quality] + '品质或以上]|的属性或技能，是否继续洗练？属性与技能替换后生效', this.okHandler, this);
                    } else {
                        this.model.sendTiannvWash(this.pos, 1, this.lockAry);
                    }
                }
                else {
                    Checker.CheckItem(this.freshData[0].itemId, this.priceIcon2.price, false)
                }
                break;
            case this.btnAdvXilian:
                if (UserBag.ins().GetCount(this.freshData[1].itemId) >= this.priceIcon3.price) {
                    if (this.isWarn()) {
                         let quality = GameGlobal.HavingModel.getBaseConfig().prompt;
                        WarnWin.showCheckBox("btnAdvXilian",'洗练属性存在|C:' + ItemBase.GetColorByQuality(quality) + '&T:[' + ItemBase.QUALITY_NAME_STR[quality] + '品质以上]|的属性或技能，是否继续洗练？属性与技能替换后生效', this.okSuperHandler, this);
                    } else {
                        this.model.sendTiannvWash(this.pos, 2, this.lockAry);
                    }
                }
                else {
                    // UserTips.ins().showTips('高级洗练道具不足');
                    Checker.CheckItem(this.freshData[1].itemId, this.priceIcon3.price, false)
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
                let desc = '法器洗练已累计刷新：';
                let count = this.skillWashNums[this.pos - 1] + "次"
                let c = 0xc400fd;
                ViewManager.ins().open(PetXilianTipPanel, this.skillConfigData[this.pos].name, desc, count, c, GameGlobal.Config.FemaleDevaBaseConfig.freshitemid);
                break
            case this.lock0:
            case this.lock1:
            case this.lock2:
            case this.lock3:
                let lock = e.currentTarget as HavingLockItem;
                if (lock.islock || Checker.Money(MoneyConst.yuanbao, this.freshMoneyData[this.lockAry.length])) {
                    lock.islock = !lock.islock;
                    lock.setLockImg(lock.islock);
                    if (lock.islock) {
                        this.lockAry.push(lock.lockid);
                    }
                    else {
                        let index = this.lockAry.indexOf(lock.lockid);
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
    }

    private isWarn(): boolean {
        let isBetter = false;
        for (let i = 0; i < this.betterAry.length; i++) {
            if (this.betterAry[i]) {
                if (this.lockAry.indexOf(i + 1) == -1) {
                    isBetter = true;
                }
            }
        }
        return isBetter;
    }

    private showLockState(lockAry) {
        let i = 1;
        let len = this.lockAry.length;
        for (i = 1; i <= 4; i++) {
            this['lock' + (i - 1)].visible = true;
        }
        if (len == 3) {
            for (i = 1; i <= 4; i++) {
                let index = this.lockAry.indexOf(i);
                if (index == -1) this['lock' + (i - 1)].visible = false;
            }
        }
    }

    private okHandler(...rest) {
        this.model.sendTiannvWash(this.pos, 1, this.lockAry);
    }
    private okSuperHandler(...rest) {
        this.model.sendTiannvWash(this.pos, 2, this.lockAry);
    }

    private setState(index: number): void {
        let i = 0, len = this.skillPlots.length;
        for (i; i < len; i++) {
            this.skillPlots[i].currentState = 'up';
        }
        this['HavingSkillItem' + index].currentState = 'down';
    }

    //初始化技能数据
    private initViewData() {
        this.skillConfigData = this.model.getMagicConfig();
        //初始化技能图标和名字
        for (let index in this.skillConfigData) {
            let name = this.skillConfigData[index].name;
            let icon = this.skillConfigData[index].icon;
            this.skillPlots[parseInt(index) - 1].setSkillName(parseInt(index), name);
            this.skillPlots[parseInt(index) - 1].setSkillIcon(icon, false);
            this.skillPlots[parseInt(index) - 1].pos = parseInt(index);
            this['skillAttr' + index].visible = false;
        }

        //获取技能属性
        let i = 0, len = this.model.skillData.length;
        for (i; i < len; i++) {
            this.skillPlots[i].setOpen(true);//开锁
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
    }

    public UpdateContent() {
        this.showContent(this.pos);
    }

    /**
     * 显示当前选中技能槽数据
     * @param pos 索引从 1 开始
     */
    private showContent(pos) {
        let xilianStars = GameGlobal.HavingModel.getBaseConfig().polishStar;
        if (this.skillWashNums[pos - 1] >= xilianStars[xilianStars.length - 1]) {
            this.currentState = "full"
        } else {
            this.currentState = "normal"
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
    }

    /**显示洗练次数星星 */
    private updateStars(pos) {
        let xilianStars = GameGlobal.HavingModel.getBaseConfig().polishStar;
        for (let i = 0; i < this.starGroup.numChildren; i++) {
            let item = this.starGroup.getChildAt(i) as eui.Image
            item.source = this.skillWashNums[pos - 1] >= xilianStars[i] ? "ui_bm_star022" : "ui_bm_star021";
        }
    }

    /**当前属性
     * @param pos
     */
    private updateAttrs(pos): void {
        this.curIconImg.visible = false;
        this.curSkillDes.text = '';
        for (let x = 1; x < this.skillPlots.length + 1; x++) {
            if (this.skillAttrsDic[x]) {
                let i = 0, len = this.skillAttrsDic[x].length;
                let str = ''
                let data, config, data2;
                let attrsConfig;
                this.lockAry = [];
                this.setPrice1();
                for (i; i < len; i++) {
                    //初始锁定图标状态
                    (this['lock' + i] as HavingLockItem).islock = false;
                    (this['lock' + i] as HavingLockItem).setLockImg(false);
                    (this['lock' + i] as HavingLockItem).lockid = i + 1;
                    if (this.skillAttrsDic[pos] != undefined)
                        data = this.skillAttrsDic[pos][i];
                    data2 = this.skillAttrsDic[x][i];
                    if (data != undefined) {
                        if (1 == data.type) {
                            attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data.attrs);
                            let attrs = new AttributeData;
                            attrs.type = attrsConfig.attrs.type;
                            attrs.value = attrsConfig.attrs.value;
                            this.curAttrTxts[i].text = AttributeData.getAttStr(attrs, 0);
                            let color = ItemBase.GetColorByQuality(attrsConfig.quality);
                            this.curAttrTxts[i].textColor = color;
                            // str += '|C:' + color + '&T:' + AttributeData.getAttStr(attrs, 0) + '|\n';
                        }
                        else if (2 == data.type) {
                            config = GameGlobal.Config.EffectsConfig[data.skillNo];
                            if (config) {
                                this.curIconImg.visible = true;
                                this.curIconImg.source = config[GameGlobal.Config.EffectsConfig_keys.icon];
                                this.curAttrTxts[i].text = config[GameGlobal.Config.EffectsConfig_keys.skinName];
                                let quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                                let color = ItemBase.GetColorByQuality(quality);
                                this.curAttrTxts[i].textColor = color;
                                this.curSkillDes.text = config[GameGlobal.Config.EffectsConfig_keys.desc];
                                // str += "|C:" + color + "&T:" + config[GameGlobal.Config.EffectsConfig_keys.skinName] + "|";
                            }
                            else {

                                if (DEBUG) {
                                    this.curAttrTxts[i].text = '没得配置'
                                    this.curSkillDes.text = '技能ID获取不了配置：' + data.skillNo;
                                } else {
                                    this.curAttrTxts[i].text = ''
                                    this.curSkillDes.text = ""
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
                            let attrs = new AttributeData;
                            attrs.type = attrsConfig.attrs.type;
                            attrs.value = attrsConfig.attrs.value;
                            let color = ItemBase.GetColorByQuality(attrsConfig.quality);
                            str += '|C:' + color + '&T:' + AttributeData.getAttStr(attrs, 0) + '|\n';
                        }
                        else if (2 == data2.type) {
                            config = GameGlobal.Config.EffectsConfig[data2.skillNo];
                            if (config) {
                                let quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                                let color = ItemBase.GetColorByQuality(quality);
                                str += "|C:" + color + "&T:" + config[GameGlobal.Config.EffectsConfig_keys.skinName] + "|";
                            }
                        }
                    }
                }
                this["attrsLabel" + x].textFlow = TextFlowMaker.generateTextFlow(str);
            }

        }

    }



    /**当前属性2
     * @param pos
     */
    private updateAttrs2(pos): void {
        this.curIconImg.visible = false;
        this.curSkillDes.text = '';
        for (let x = 1; x < this.skillPlots.length + 1; x++) {
            if (this.skillAttrsDic[x]) {
                let i = 0, len = this.skillAttrsDic[x].length;
                let str = ''
                let data, config, data2;
                let attrsConfig;
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
                            let attrs = new AttributeData;
                            attrs.type = attrsConfig.attrs.type;
                            attrs.value = attrsConfig.attrs.value;
                            this.curAttrTxts[i].text = AttributeData.getAttStr(attrs, 0);
                            let color = ItemBase.GetColorByQuality(attrsConfig.quality);
                            this.curAttrTxts[i].textColor = color;
                            // str += '|C:' + color + '&T:' + AttributeData.getAttStr(attrs, 0) + '|\n';
                        }
                        else if (2 == data.type) {
                            config = GameGlobal.Config.EffectsConfig[data.skillNo];
                            if (config) {
                                this.curIconImg.visible = true;
                                this.curIconImg.source = config[GameGlobal.Config.EffectsConfig_keys.icon];
                                this.curAttrTxts[i].text = config[GameGlobal.Config.EffectsConfig_keys.skinName];
                                let quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                                let color = ItemBase.GetColorByQuality(quality);
                                this.curAttrTxts[i].textColor = color;
                                this.curSkillDes.text = config[GameGlobal.Config.EffectsConfig_keys.desc];
                                // str += "|C:" + color + "&T:" + config[GameGlobal.Config.EffectsConfig_keys.skinName] + "|";
                            }
                            else {
                                if (DEBUG) {
                                    this.curAttrTxts[i].text = '没得配置'
                                    this.curSkillDes.text = '技能ID获取不了配置：' + data.skillNo;
                                } else {
                                    this.curAttrTxts[i].text = ''
                                     this.curSkillDes.text = ''
                                }

                                
                            }
                        }
                    }
                    else
                    {
                        this.curAttrTxts[i].text="";
                    }
                    if (data2) {
                        if (1 == data2.type) {
                            attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data2.attrs);
                            let attrs = new AttributeData;
                            attrs.type = attrsConfig.attrs.type;
                            attrs.value = attrsConfig.attrs.value;
                            let color = ItemBase.GetColorByQuality(attrsConfig.quality);
                            str += '|C:' + color + '&T:' + AttributeData.getAttStr(attrs, 0) + '|\n';
                        }
                        else if (2 == data2.type) {
                            config = GameGlobal.Config.EffectsConfig[data2.skillNo];
                            if (config) {
                                let quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                                let color = ItemBase.GetColorByQuality(quality);
                                str += "|C:" + color + "&T:" + config[GameGlobal.Config.EffectsConfig_keys.skinName] + "|";
                            }
                        }
                    }
                }
            }
        }
    }


    private setPrice1() {
        let len = this.lockAry.length;
        if (len > 0) this.priceIcon1.price = this.freshMoneyData[len - 1];
        else this.priceIcon1.price = 0;
    }

    /**洗练更换数据 */
    private updateWashReplaceData(rsp: Sproto.sc_tiannv_wash_replace_res_request) {
        this.skillAttrsDic[rsp.pos] = rsp.attrData;
        this.skillWashAttrsDic[rsp.pos] = rsp.washData;
        this.updateAttrs(rsp.pos);
        this.updateWashAttrs(rsp.pos, true);
        this.updateTotalPower();
    }

    /**洗练数据 */
    private updateWashData(rsp: Sproto.sc_tiannv_wash_res_request) {
        this.priceIcon2.setMyCount(UserBag.ins().GetCount(this.freshData[0].itemId));
        this.priceIcon3.setMyCount(UserBag.ins().GetCount(this.freshData[1].itemId));
        this.skillWashAttrsDic[rsp.pos] = rsp.washData;
        if (rsp.washNum != undefined)
            this.skillWashNums[rsp.pos - 1] = rsp.washNum;
        this.updateStars(rsp.pos);
        this.updateWashAttrs(rsp.pos);
        //this.skillAttrsDic[rsp.pos] = rsp.attrData;
        this.updateAttrs2(rsp.pos);
    }
    //更新道具拥有个数
    private updateItemCount() {
        this.priceIcon2.setMyCount(UserBag.ins().GetCount(this.freshData[0].itemId));
        this.priceIcon3.setMyCount(UserBag.ins().GetCount(this.freshData[1].itemId));
    }

    /**洗练属性
     * @param pos
     * @param isClear 是否清空数据
     */
    private updateWashAttrs(pos, isClear: boolean = true) {
        this.nextIconImg.visible = false;
        if (isClear) {
            for (let j = 0; j < 4; j++) {
                this.washAttrTxts[j].text = '';
            }
            this.xilianSkillDes.text = '';
            this.betterAry = [];
        }
        if (this.skillWashAttrsDic[pos]) {
            let i;
            let len = this.skillWashAttrsDic[pos].length;
            let data, config;
            let attrsConfig;
            this.xilianSkillDes.text = '';
            for (i = 0; i < len; i++) {
                data = this.skillWashAttrsDic[pos][i];
                if (data) {
                    if (1 == data.type) {
                        attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data.attrs);
                        let attrs = new AttributeData;
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
                            let quality = config[GameGlobal.Config.EffectsConfig_keys.quality];
                            this.washAttrTxts[i].textColor = ItemBase.GetColorByQuality(quality);


                            if (this.lockAry.indexOf(i + 1) == -1) {
                                if (quality >= GameGlobal.HavingModel.getBaseConfig().prompt) {
                                    this.betterAry[i] = true;
                                } else {
                                    this.betterAry[i] = false;
                                }
                            }
                            else {
                                this.betterAry[i] = false;
                            }
                        }
                        else {
                            if (DEBUG) {
                                this.washAttrTxts[i].text = '没得配置'
                                this.xilianSkillDes.text = '技能ID获取不了配置：' + data.skillNo;
                            } else {
                                this.washAttrTxts[i].text = ''
                                this.xilianSkillDes.text = ""
                            }
                        }
                    }
                } else {
                    this.washAttrTxts[i].text = ""
                }
            }
        }
    }

    /**
     * 显示总战力
     */
    private updateTotalPower() {
        let powerAttrs = [];
        for (let pos in this.skillAttrsDic) {
            let data = this.skillAttrsDic[pos];
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] && 1 == data[i].type) {
                        let attrsConfig = GameGlobal.HavingMagicModel.getAttrsConfigById(data[i].attrs);
                        if (!attrsConfig) {
                            continue
                        }
                        let attrs = new AttributeData;
                        attrs.type = attrsConfig.attrs.type;
                        attrs.value = attrsConfig.attrs.value;
                        powerAttrs.push(attrs);
                    }
                }
            }
        }
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(powerAttrs);
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.HavingModel.mRedPoint.Get(HavingModelRedPoint.INDEX_SKILL_ITEM)
    }
}

class HavingLockItem extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // HavingLockItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    private lockImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
    public islock: boolean = false;
    public lockid: number = 0;

    public setLockImg(islock) {
        this.lockImg.source = islock ? 'ui_tn_icon_suo02' : 'ui_tn_icon_suo01';
    }
}

class HavingSkillItem extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // HavingSkillItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected skillUpName: eui.Label;
    protected skillBottomName: eui.Label;
    protected skillIcon: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
    public isopen: boolean = false;
    public pos: number;
    //设置技能名称
    public setSkillName(index: number, name: string): void {
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
    }
    //设置技能图标
    public setSkillIcon(iconImg: string, isopen: boolean) {
        this.skillIcon.source = iconImg;
        this.setOpen(isopen);
    }

    public setOpen(isopen) {
        this.isopen = isopen;
        this.skillIcon.filters = isopen ? null : Color.GetFilter();
    }
}
