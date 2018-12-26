var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AIConfig = (function () {
    function AIConfig() {
    }
    AIConfig.GetEffTime = function (effId) {
        return 2000;
    };
    AIConfig.GetDamageDelay = function (skillId) {
        return 300;
    };
    // 技能飘字动画持续时间
    AIConfig.WORD_EFF_TIME = 300;
    // 开始回合动画需要等待的时间
    AIConfig.START_TURN_WAIT_TIME = 1200;
    AIConfig.ANIM_TIME = 400;
    AIConfig.BODY_OFFSET = 50;
    // 受击时间点
    AIConfig.HIT_TIME = 300;
    AIConfig.HIT_RESET_TIME = 430;
    AIConfig.PLAY_ANIM_TIME = AIConfig.HIT_TIME + AIConfig.HIT_RESET_TIME;
    return AIConfig;
}());
__reflect(AIConfig.prototype, "AIConfig");
//# sourceMappingURL=AIConfig.js.map