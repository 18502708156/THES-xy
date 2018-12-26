class RoleSkillPanel extends BaseView implements ICommonWindowTitle {
    public static NAME = "技能"
    /////////////////////////////////////////////////////////////////////////////
    // RoleSkillSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected g0: eui.Component;
    protected g1: eui.Component;
    protected g2: eui.Component;
    protected g3: eui.Component;
    protected g4: eui.Component;
    protected g5: eui.Component;
    protected g6: eui.Component;
    protected g7: eui.Component;
    protected skillSettingBtn: eui.Button;
    protected grpUpOper: eui.Group;
    protected priceicon1: PriceIcon;
    protected priceicon2: PriceIcon;
    protected oneKeyUp: eui.Button;
    protected onup: eui.Button;
    protected skillDes: eui.Label;
    protected skillLv: eui.Label;
    protected skillName: eui.Label;
    protected limitLabel: eui.Label;
    protected lbMaxLv: eui.Label;//最大等级提示
    
    
    /////////////////////////////////////////////////////////////////////////////

    private mItems: RoleSkillItem[] = []
    private mSelectIndex: number = 0

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.oneKeyUp
		}
	}

    public constructor() {
        super()
    }

    public childrenCreated() {
        for (let i = 0; i <= 7; i++) {
            let item = this["g" + i]
            this.mItems[i] = item
            this._AddClick(item, this._OnItemClick)
        }
        this._AddClick(this.oneKeyUp, this._OnClick)
        this._AddClick(this.onup, this._OnClick)
        this._AddClick(this.skillSettingBtn, this._OnClick)
        this.priceicon1.type = MoneyConst.gold
        this.priceicon2.type = MoneyConst.gold
    }

    public OnOpen() {
        this.mSelectIndex = 0;//初始化
        this.observe(MessageDef.SKILL_UPGRADE, this.grewupSkillCB)
        this.observe(MessageDef.SKILL_GREWUPALL, this.grewupAllSkillCB)
        this.UpdateContent()
    }

    UpdateContent(): void {
        let selectIndex = this.mSelectIndex
        for (let i = 0; i < this.mItems.length; i++) {
            let item = this.mItems[i]
            item.img_select.visible = i == selectIndex
            this.UpdateItem(i)
        }
        var role = SubRoles.ins().GetRoleData()
        var skillsId = role.GetCurSkillIDs();
        var skillId = skillsId[selectIndex];
        
        var skillLevel = role.getSkillsDataByIndex(selectIndex);

        var skillConfig = SkillsConfig.GetSkillEffConfig(skillId)
        this.skillDes.text = SkillsConfig.GetSkillDesc(skillId, skillLevel, selectIndex)//技能描述
        this.skillName.text = SkillsConfig.GetSkillName(skillId)//名称
        
        

        let strSkillLv =  `|C:0x4fcd4c&T:${skillLevel}|C:0x6E330B&T: 级|`
        
        this.skillLv.textFlow =   TextFlowMaker.generateTextFlow(strSkillLv) //    skillLevel + "级"//技能等级

        //this.label.textFlow = TextFlowMaker.generateTextFlow(str);

        //是否显示已满级
        if(!UserSkill.ins().canGrewupAllSkills())
        {
            this.priceicon2.visible = false;
            this.lbMaxLv.visible = true;
        }
        else
        {
            this.priceicon2.visible = true;
            this.lbMaxLv.visible = false;
        }
        

        let openLevel = SkillsConfig.GetOpenLevel(selectIndex)
        if (openLevel > GameGlobal.actorModel.level) {
            this.grpUpOper.visible = false
            this.limitLabel.visible = true
            this.limitLabel.text = "解锁当前技能需要到达" + openLevel + "级"
        } else {
            this.grpUpOper.visible = true
            this.limitLabel.visible = false
            let skillUP = GlobalConfig.ins().SkillsUpgradeConfig[skillLevel];
            var costNum = GlobalConfig.ins().SkillsUpgradeConfig[skillLevel].cost;
            var costAllNum = UserSkill.ins().getAllSkillGrewupCost();
            if (costAllNum == 0) {
                costAllNum = costNum;
            }
            this.priceicon1.price = costNum;
            this.priceicon2.price = costAllNum;
        }
    }

    UpdateItem(itemIndex: number) {
        let item = this.mItems[itemIndex]
        var role = SubRoles.ins().GetRoleData()
        var skillsId = role.GetCurSkillIDs();
        let skillIds = role.GetCurSkillIDs()
        let skillId = skillIds[itemIndex]
        let skillLevel = role.getSkillsDataByIndex(itemIndex)
        // if (skillLevel <= 0) {
        let openConfig = GlobalConfig.ins().SkillsOpenConfig[itemIndex + 1]
        if (openConfig) {
            if (!openConfig.id[role.job - 1]) {
                item.currentState = "lock"
            } else {
                item.currentState = "open"
                item.img_icon.source =  SkillsConfig.GetSkillIcon(skillId)
                if (skillLevel <= 0) {
                    let limitLv = UserSkill.ins().getSkillLimitLevel()//test
                    if (UserSkill.ins().getSkillLimitLevel() >= openConfig.level) {
                        item.lb_name.text = "开启";
                    } else {
                        item.lb_name.text = openConfig.level + "级开启";
                    }
                    item.img_lv_bg.visible = false;
                    item.lb_level.visible = false;
                    item.img_icon.filters = Color.GetFilter()//变灰
                    item.lb_name.textColor = 0xEACDAB;
                } else {
                    item.lb_level.text = skillLevel + ""
                    item.lb_name.text = SkillsConfig.GetSkillName(skillId)
                    item.img_lv_bg.visible = true;
                    item.lb_level.visible = true;
                    item.img_icon.filters = null//恢复
                    item.lb_name.textColor = 0x682f00;

                }
            }
        } else {
            item.currentState = "lock"
            item.lb_name.text = "未开放"
        }
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.target) {
            case this.oneKeyUp:
                this.grewUpAllSkillBtnCB()
                break
            case this.onup:
                this.grewUpSkillBtnCB()
                break
            case this.skillSettingBtn:
                //打开技能配置界面
                ViewManager.ins().open(RoleSkilSetLayer)
                break
        }
    }

    private _OnItemClick(e: egret.TouchEvent) {
        let index = this.mItems.indexOf(e.currentTarget)
        if (SkillsConfig.IsLock(index)) {
            return
        }
        this.mSelectIndex = index
        this.UpdateContent()
    }

    grewupSkillCB(skillId: number, level: number, upLevel: number) {
        this.grewupTip(skillId, upLevel);
        this.UpdateContent();
    }

    grewupAllSkillCB(kills: number[], upSkills: number[]) {
        var role = SubRoles.ins().GetRoleData()
        var skillsLevel = role.skillLevels;
        for (var k in skillsLevel) {
            var upLv = upSkills[k];
            if (upLv > 0) {
                if (skillsLevel[k] != 0)
                    this.grewupTip(parseInt(k), upLv);
            }
        }
        this.UpdateContent();
    }

    grewupTip(index: number, level: number) {
        // var tip: eui.BitmapLabel = new eui.BitmapLabel()
        let tip = new eui.Label
        tip.text = "+" + level
        tip.textColor = 0x3dff42 //添加颜色
        // tip.font = "font_zdlts_p2_fnt"
        tip.touchEnabled = false
        let skillItem = this.mItems[index]
        tip.x = skillItem.width ;
        tip.y = skillItem.height / 4;
        skillItem.addChild(tip);
        var t = egret.Tween.get(tip);
        t.to({ "y": tip.y - 45 }, 1000).to({ "alpha": 0 }, 500).call(function () {
            DisplayUtils.removeFromParent(tip);
        }, this);

        let eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("ui_eff_skilly_001"), true, 1);
        eff.x = skillItem.iconGroup.width >> 1;
        eff.y = skillItem.iconGroup.height >> 1;
        skillItem.iconGroup.addChild(eff);
    }

    grewUpSkillBtnCB() {
        var role = SubRoles.ins().GetRoleData()
        var skillLevel = role.getSkillsDataByIndex(this.mSelectIndex);
        var limitLevel = UserSkill.ins().getSkillLimitLevel();
        if (limitLevel > skillLevel) {
            if (GameLogic.ins().actorModel.gold >= GlobalConfig.ins().SkillsUpgradeConfig[skillLevel].cost)
                UserSkill.ins().sendGrewUpSkill(this.mSelectIndex);
            else {
                UserWarn.ins().setBuyGoodsWarn(1);
            }
        }
        else {
            if (GameLogic.ins().actorModel.gold < GlobalConfig.ins().SkillsUpgradeConfig[skillLevel].cost) {
                UserWarn.ins().setBuyGoodsWarn(1);
            }
            else
                this.showHint();
        }
    };

    grewUpAllSkillBtnCB() {
        if (!UserSkill.ins().canGrewupAllSkills()) {
            this.checkUpType();
            return;
        }
        var costAllNum = UserSkill.ins().getAllSkillGrewupCost();
        if (costAllNum && costAllNum <= GameLogic.ins().actorModel.gold) {
            this.onSendupgreadAll();
        }
        else {
            this.checkUpType();
            // UserWarn.ins().setBuyGoodsWarn(1);
        }
        // if (this.priceicon2.textColor == 0XFD000A) {
        //     UserWarn.ins().setBuyGoodsWarn(1);
        // }
    }

    private checkUpType() {
        var role = SubRoles.ins().GetRoleData()
        var skillLevel = role.getSkillsDataByIndex(this.mSelectIndex);
        var costNum = GlobalConfig.ins().SkillsUpgradeConfig[skillLevel].cost;
        var costAllNum = UserSkill.ins().getAllSkillGrewupCost();
        if (costAllNum == 0) {
            costAllNum = costNum;
        }
        if (GameLogic.ins().actorModel.gold >= costAllNum)
            this.showHint();
        else {
            GameGlobal.ViewManager.Guide(ViewIndexDef.TYPE_1025)
        }
    }

    onSendupgreadAll() {
        UserSkill.ins().sendGrewUpAllSkill();
    }

    showHint() {
        UserTips.ErrorTip("技能等级不能超过人物等级");
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.UserSkill.mRedPoint.IsRedPoint()
    }
}

interface RoleSkillItem extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // RoleSkillItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    img_select: eui.Image;
    img_icon: eui.Image;
    lb_name: eui.Label;
    lb_level: eui.Label;
    img_lv_bg: eui.Image;
    iconGroup: eui.Group
    redPoint: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
}