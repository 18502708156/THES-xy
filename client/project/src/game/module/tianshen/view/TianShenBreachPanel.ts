class TianShenBreachPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "突破"

    /////////////////////////////////////////////////////////////////////////////
    // TianShenBreachSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected lbLev: eui.Label;
    protected powerLabel: PowerLabel;
    protected petShowPanel: PetShowPanel;
    protected tname: eui.Label;
    protected tpower: eui.Label;
    protected tcurName: eui.Label;
    protected curProLabel1: eui.Label;
    protected curProLabel2: eui.Label;
    protected curProLabel3: eui.Label;
    protected tnextName: eui.Label;
    protected nextProLabel1: eui.Label;
    protected nextProLabel2: eui.Label;
    protected nextProLabel3: eui.Label;
    protected newSkillGroup: eui.Group;
    protected nextProLabel4: eui.Label;
    protected tskillName: eui.Label;
    protected breachSkillDes: eui.Label;
    protected needItemView0: NeedItemView;
    protected needItemView1: NeedItemView;
    protected breachBtn: eui.Button;
    protected tcondition: eui.Label;
    protected skillIcon: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
    protected mContext: TianShenMainPanel;
    private tianShenId: number;
    private curLevel: number = 0;
    private needLevel: number = 0;
    private isEnough: boolean = true;

    public constructor() {
        super()
    }

    public childrenCreated() {
        this._AddClick(this.breachBtn, this._OnClickBtn);
    }

    public OnOpen(...args: any[]) {
        this.observe(MessageDef.TIANSHEN_UPDATE_BREACH, this.UpdateContent)
    }

    private _OnClickBtn(e: egret.TouchEvent) {
        if (this.curLevel < this.needLevel) {
            UserTips.ins().showTips('天神进阶等级不够，不能突破');
            return;
        }
        if (!this.isEnough) {
            UserTips.ins().showTips('突破道具不足');
            return;
        }
        GameGlobal.TianShenBreachModel.sendTianShenBreach(this.tianShenId);
    }

    public UpdateContent() {
        let model = GameGlobal.TianShenModel
        let selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex]
        this.tianShenId = selectConfig.id
        if (!model.HasTianShen(this.tianShenId)) {
            this.group.visible = false;
            return
        }
        this.group.visible = true;


        this.tname.text = selectConfig.name;
        this.tname.textColor = ItemBase.GetColorByQuality(selectConfig.quality);
        let tianShenInfo = model.mTianShenList[this.tianShenId];
        this.petShowPanel.SetBody(tianShenInfo.GetSkin());
        this.lbLev.text = tianShenInfo.mBreachLv + "\n级"
        this.powerLabel.text = GameGlobal.TianShenBreachModel.getPower(this.tianShenId, tianShenInfo.mBreachLv);
        //突破等级配置
        let levelsConfig = GameGlobal.TianShenBreachModel.getLevelsConfig(this.tianShenId);
        let curConfig = levelsConfig[tianShenInfo.mBreachLv];
        let nextConfig = levelsConfig[tianShenInfo.mBreachLv + 1];
        if (!nextConfig) {
            this.currentState = 'full';
            this.tcurName.text = selectConfig.name + '+' + tianShenInfo.mBreachLv;
            this.showCurAttrs(curConfig);
            return;
        }
        else {
            this.currentState = 'normal';
        }
        this.curLevel = tianShenInfo.mLevel;
        this.needLevel = nextConfig.needlevel;
        this.tcondition.text = '需求' + tianShenInfo.mLevel + '/' + nextConfig.needlevel + '级';
        this.needItemView0.visible = this.needItemView1.visible = false;
        for (let i = 0; i < nextConfig.cost.length; i++) {
            this['needItemView' + i].SetItemId(nextConfig.cost[i].id, nextConfig.cost[i].count);
            this['needItemView' + i].visible = true;
            if (this.isEnough) this.isEnough = GameGlobal.UserBag.GetCount(nextConfig.cost[i].id) >= nextConfig.cost[i].count;
        }
        this.tcurName.text = selectConfig.name + '+' + tianShenInfo.mBreachLv;
        this.tnextName.text = selectConfig.name + '+' + (tianShenInfo.mBreachLv + 1);
        this.showCurAttrs(curConfig);
        this.showNextAttrs(nextConfig);

        this.tpower.text = '战力+' + (GameGlobal.TianShenBreachModel.getPower(this.tianShenId, tianShenInfo.mBreachLv + 1) - GameGlobal.TianShenBreachModel.getPower(this.tianShenId, tianShenInfo.mBreachLv));
    }

    private showCurAttrs(config) {
        if (!config) {
            this.curProLabel1.text = '0'
            this.curProLabel2.text = '0'
            this.curProLabel3.text = '0'
            return;
        }
        this.curProLabel1.text = AttributeData.getAttStrByType(config.attrs[0], 0, '+', false, '#ffffff');
        this.curProLabel2.text = AttributeData.getAttStrByType(config.attrs[1], 0, '+', false, '#ffffff');
        this.curProLabel3.text = AttributeData.getAttStrByType(config.attrs[2], 0, '+', false, '#ffffff');
    }

    private showNextAttrs(config) {
        if (!config) return;
        this.nextProLabel1.text = AttributeData.getAttStrByType(config.attrs[0], 0, '+', false, '#ffffff');
        this.nextProLabel2.text = AttributeData.getAttStrByType(config.attrs[1], 0, '+', false, '#ffffff');
        this.nextProLabel3.text = AttributeData.getAttStrByType(config.attrs[2], 0, '+', false, '#ffffff');
        this.newSkillGroup.visible = false;
        if (config.skillid) {
            this.newSkillGroup.visible = true;
            let skillid = config.skillid[config.skillid.length - 1];
            let skillConfig = GameGlobal.Config.EffectsConfig[skillid];
            if (skillConfig) {
                this.tskillName.text = this.nextProLabel4.text = skillConfig[GameGlobal.Config.EffectsConfig_keys.skinName];
                this.breachSkillDes.text = skillConfig[GameGlobal.Config.EffectsConfig_keys.desc];
                this.skillIcon.source = skillConfig[GameGlobal.Config.EffectsConfig_keys.icon];
            }
            else {
                this.tskillName.text = this.nextProLabel4.text = '没得配置'
                this.breachSkillDes.text = '技能ID获取不了配置：' + skillid;
                this.skillIcon.source = '';
            }
        }
    }
}