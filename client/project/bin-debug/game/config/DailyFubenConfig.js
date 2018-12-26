var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DailyFubenConfig = (function () {
    function DailyFubenConfig() {
    }
    /**  获取个人boss配置列表 */
    DailyFubenConfig.getPersonalBossFbIds = function () {
        var result = [];
        for (var i in GlobalConfig.ins().DailyFubenConfig) {
            var c = GlobalConfig.ins().DailyFubenConfig[i];
            if (c && c.kind == 0)
                result.push(c);
        }
        return result;
    };
    ;
    /** 是否含有该配置 */
    DailyFubenConfig.isContains = function (config) {
        for (var i in GlobalConfig.ins().DailyFubenConfig) {
            var c = GlobalConfig.ins().DailyFubenConfig[i];
            if (config == c)
                return true;
        }
        return false;
    };
    ;
    /** 是否有可挑战 */
    // public static isCanChallenge  () {
    //     var datas = this.getPersonalBossFbIds();
    //     var len = datas.length;
    //     var data;
    //     var sCount;
    //     for (var i = 0; i < len; i++) {
    //         data = datas[i];
    //         //还没数据不处理
    //         if (!GameGlobal.UserFb.getFbDataById(data.id))
    //             continue;
    //         //还有次数
    //         sCount = GameGlobal.UserFb.getFbDataById(data.id).getCount();
    //         if (sCount > 0) {
    //             if (data.zsLevel > 0) {
    //                 if (UserZs.ins().lv >= data.zsLevel)
    //                     return true;
    //             }
    //             else {
    //                 if (GameLogic.ins().actorModel.level >= data.levelLimit)
    //                     return true;
    //             }
    //         }
    //     }
    //     return false;
    // };
    /**  获取最低等级的副本 */
    DailyFubenConfig.getLowestFbIdByKind = function (kind) {
        for (var i in GlobalConfig.ins().DailyFubenConfig) {
            var c = GlobalConfig.ins().DailyFubenConfig[i];
            if (c.kind == kind)
                return c.id;
        }
    };
    ;
    return DailyFubenConfig;
}());
__reflect(DailyFubenConfig.prototype, "DailyFubenConfig");
//# sourceMappingURL=DailyFubenConfig.js.map