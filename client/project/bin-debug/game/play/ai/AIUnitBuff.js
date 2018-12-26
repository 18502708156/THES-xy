var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AIUnitBuff = (function () {
    function AIUnitBuff() {
        this.mBuffId = 0;
    }
    AIUnitBuff.prototype.GetEff = function () {
        var config = GameGlobal.Config.EffectsConfig[this.mBuffId];
        if (!config) {
            return;
        }
        var id = config[GameGlobal.Config.EffectsConfig_keys.effID];
        if (!id) {
            return;
        }
        var effConfig = GameGlobal.Config.BuffEffConfig[id];
        if (!effConfig) {
            return;
        }
        return effConfig;
    };
    return AIUnitBuff;
}());
__reflect(AIUnitBuff.prototype, "AIUnitBuff");
//# sourceMappingURL=AIUnitBuff.js.map