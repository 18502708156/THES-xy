var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ExpeditionConst = (function () {
    function ExpeditionConst() {
    }
    // 0: 完胜 1：惨败 2：胜负未知
    ExpeditionConst.GetFightState = function (lingTPower, taskId, idx) {
        var rateNum = GameGlobal.Config.ExploreBaseConfig.successfulRate / 100;
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[taskId];
        if (!taskConfig)
            return 2;
        var monsterInfo = taskConfig.pet[idx];
        var monsterPower = monsterInfo.ce;
        var rate = (monsterPower - lingTPower) / lingTPower;
        if (rate <= -rateNum)
            return 0;
        if (rate >= rateNum)
            return 1;
        return 2;
    };
    ExpeditionConst.GetFightRate = function (lingTPower, taskId, idx) {
        var state = this.GetFightState(lingTPower, taskId, idx);
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[taskId];
        if (!taskConfig)
            return 0;
        return taskConfig.success[state].rate;
    };
    ExpeditionConst.GetFightResultImg = function (lingTPower, taskId, idx) {
        var state = this.GetFightState(lingTPower, taskId, idx);
        if (state == 0)
            return "ui_lstx_bm_wansheng01";
        if (state == 1)
            return "ui_lstx_bm_canbai01";
        if (state == 2)
            return "ui_lstx_bm_shengfuweizhi01";
    };
    ExpeditionConst.GetFightResultImgForSelect = function (lingTPower, taskId, idx) {
        var state = this.GetFightState(lingTPower, taskId, idx);
        if (state == 0)
            return "ui_lstx_bm_wansheng02";
        if (state == 1)
            return "ui_lstx_bm_canbai02";
        if (state == 2)
            return "ui_lstx_bm_shengfuweizhi02";
    };
    ExpeditionConst.GetTaskTypeName = function (taskType) {
        var infos = GameGlobal.Config.ExploreBaseConfig.taskname;
        for (var _i = 0, _a = infos || []; _i < _a.length; _i++) {
            var info = _a[_i];
            if (info.type == taskType)
                return info.name;
        }
        return "";
    };
    ExpeditionConst.GetTaskTypeSource = function (taskType) {
        var infos = GameGlobal.Config.ExploreBaseConfig.taskname;
        for (var _i = 0, _a = infos || []; _i < _a.length; _i++) {
            var info = _a[_i];
            if (info.type == taskType)
                return info.icon;
        }
        return "";
    };
    ExpeditionConst.GetQualitySource = function (quality) {
        var source = "";
        switch (quality) {
            case 1:
                source = "ui_lstx_bm_E";
                break;
            case 2:
                source = "ui_lstx_bm_D";
                break;
            case 3:
                source = "ui_lstx_bm_C";
                break;
            case 4:
                source = "ui_lstx_bm_B";
                break;
            case 5:
                source = "ui_lstx_bm_A";
                break;
            case 6:
                source = "ui_lstx_bm_S";
                break;
        }
        return source;
    };
    return ExpeditionConst;
}());
__reflect(ExpeditionConst.prototype, "ExpeditionConst");
//# sourceMappingURL=ExpeditionConst.js.map