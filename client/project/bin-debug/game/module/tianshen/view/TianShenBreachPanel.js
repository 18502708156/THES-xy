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
var TianShenBreachPanel = (function (_super) {
    __extends(TianShenBreachPanel, _super);
    function TianShenBreachPanel() {
        var _this = _super.call(this) || this;
        _this.curLevel = 0;
        _this.needLevel = 0;
        _this.isEnough = true;
        return _this;
    }
    TianShenBreachPanel.prototype.childrenCreated = function () {
        this._AddClick(this.breachBtn, this._OnClickBtn);
    };
    TianShenBreachPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.TIANSHEN_UPDATE_BREACH, this.UpdateContent);
    };
    TianShenBreachPanel.prototype._OnClickBtn = function (e) {
        if (this.curLevel < this.needLevel) {
            UserTips.ins().showTips('天神进阶等级不够，不能突破');
            return;
        }
        if (!this.isEnough) {
            UserTips.ins().showTips('突破道具不足');
            return;
        }
        GameGlobal.TianShenBreachModel.sendTianShenBreach(this.tianShenId);
    };
    TianShenBreachPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.TianShenModel;
        var selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex];
        this.tianShenId = selectConfig.id;
        if (!model.HasTianShen(this.tianShenId)) {
            this.group.visible = false;
            return;
        }
        this.group.visible = true;
        this.tname.text = selectConfig.name;
        this.tname.textColor = ItemBase.GetColorByQuality(selectConfig.quality);
        var tianShenInfo = model.mTianShenList[this.tianShenId];
        this.petShowPanel.SetBody(tianShenInfo.GetSkin());
        this.lbLev.text = tianShenInfo.mBreachLv + "\n级";
        this.powerLabel.text = GameGlobal.TianShenBreachModel.getPower(this.tianShenId, tianShenInfo.mBreachLv);
        //突破等级配置
        var levelsConfig = GameGlobal.TianShenBreachModel.getLevelsConfig(this.tianShenId);
        var curConfig = levelsConfig[tianShenInfo.mBreachLv];
        var nextConfig = levelsConfig[tianShenInfo.mBreachLv + 1];
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
        for (var i = 0; i < nextConfig.cost.length; i++) {
            this['needItemView' + i].SetItemId(nextConfig.cost[i].id, nextConfig.cost[i].count);
            this['needItemView' + i].visible = true;
            if (this.isEnough)
                this.isEnough = GameGlobal.UserBag.GetCount(nextConfig.cost[i].id) >= nextConfig.cost[i].count;
        }
        this.tcurName.text = selectConfig.name + '+' + tianShenInfo.mBreachLv;
        this.tnextName.text = selectConfig.name + '+' + (tianShenInfo.mBreachLv + 1);
        this.showCurAttrs(curConfig);
        this.showNextAttrs(nextConfig);
        this.tpower.text = '战力+' + (GameGlobal.TianShenBreachModel.getPower(this.tianShenId, tianShenInfo.mBreachLv + 1) - GameGlobal.TianShenBreachModel.getPower(this.tianShenId, tianShenInfo.mBreachLv));
    };
    TianShenBreachPanel.prototype.showCurAttrs = function (config) {
        if (!config) {
            this.curProLabel1.text = '0';
            this.curProLabel2.text = '0';
            this.curProLabel3.text = '0';
            return;
        }
        this.curProLabel1.text = AttributeData.getAttStrByType(config.attrs[0], 0, '+', false, '#ffffff');
        this.curProLabel2.text = AttributeData.getAttStrByType(config.attrs[1], 0, '+', false, '#ffffff');
        this.curProLabel3.text = AttributeData.getAttStrByType(config.attrs[2], 0, '+', false, '#ffffff');
    };
    TianShenBreachPanel.prototype.showNextAttrs = function (config) {
        if (!config)
            return;
        this.nextProLabel1.text = AttributeData.getAttStrByType(config.attrs[0], 0, '+', false, '#ffffff');
        this.nextProLabel2.text = AttributeData.getAttStrByType(config.attrs[1], 0, '+', false, '#ffffff');
        this.nextProLabel3.text = AttributeData.getAttStrByType(config.attrs[2], 0, '+', false, '#ffffff');
        this.newSkillGroup.visible = false;
        if (config.skillid) {
            this.newSkillGroup.visible = true;
            var skillid = config.skillid[config.skillid.length - 1];
            var skillConfig = GameGlobal.Config.EffectsConfig[skillid];
            if (skillConfig) {
                this.tskillName.text = this.nextProLabel4.text = skillConfig[GameGlobal.Config.EffectsConfig_keys.skinName];
                this.breachSkillDes.text = skillConfig[GameGlobal.Config.EffectsConfig_keys.desc];
                this.skillIcon.source = skillConfig[GameGlobal.Config.EffectsConfig_keys.icon];
            }
            else {
                this.tskillName.text = this.nextProLabel4.text = '没得配置';
                this.breachSkillDes.text = '技能ID获取不了配置：' + skillid;
                this.skillIcon.source = '';
            }
        }
    };
    TianShenBreachPanel.NAME = "突破";
    return TianShenBreachPanel;
}(BaseView));
__reflect(TianShenBreachPanel.prototype, "TianShenBreachPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=TianShenBreachPanel.js.map