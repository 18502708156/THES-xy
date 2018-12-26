var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AppearanceConfig = (function () {
    function AppearanceConfig() {
    }
    AppearanceConfig.GetAppeName = function (appe, isUI, isHead, isRide) {
        if (isRide === void 0) { isRide = false; }
        if (!appe) {
            return "";
        }
        if (isHead) {
            if (isUI) {
                appe += "_h";
            }
            else {
                if (GameGlobal.Config.AppearancePosConfig[appe].downRes) {
                    appe = appe.replace("_s", "_h_s");
                }
                else {
                    appe = null;
                }
            }
        }
        if (isUI) {
            // 场面模型用在ui上需要添加后缀
            appe += "_3" + EntityClipTypeToName[isRide ? EntityClipType.RIDE_STAND : EntityClipType.STAND][0];
        }
        return appe;
    };
    AppearanceConfig.GetAppe = function (id, job, sex, isHead, isRide) {
        if (job === void 0) { job = null; }
        if (sex === void 0) { sex = null; }
        if (isHead === void 0) { isHead = false; }
        if (isRide === void 0) { isRide = false; }
        var config = GameGlobal.Config.AppearanceConfig[id];
        if (config) {
            var path = void 0;
            if (job != null && sex != null) {
                path = config["job" + job + sex];
            }
            if (!path) {
                path = config.appearance;
            }
            if (path) {
                path = this.GetAppeName(path, false, isHead, isRide);
            }
            return path || "";
        }
        return "";
    };
    AppearanceConfig.GetUIAppe = function (id, job, sex, isHead, isRide) {
        if (job === void 0) { job = null; }
        if (sex === void 0) { sex = null; }
        if (isHead === void 0) { isHead = false; }
        if (isRide === void 0) { isRide = false; }
        var config = GameGlobal.Config.AppearanceConfig[id];
        if (config) {
            var path = void 0;
            if (job != null && sex != null) {
                if (isRide) {
                    path = config["job" + job + sex + "show"];
                }
                else {
                    path = config["job" + job + sex + "showa"];
                }
            }
            if (!path) {
                path = config.uishow;
            }
            if (path) {
                path = this.GetAppeName(path, false, isHead, isRide);
            }
            else {
                if (!path) {
                    path = config.appearance;
                }
                if (path) {
                    var isWay = true;
                    // 如果是没有方向
                    if (config.way) {
                        isWay = false;
                    }
                    path = this.GetAppeName(path, isWay, isHead, isRide);
                }
            }
            return path || "";
        }
        return "";
    };
    AppearanceConfig.GetScale = function (id) {
        var config = GameGlobal.Config.AppearanceConfig[id];
        if (config) {
            if (config.scale) {
                return 1 / (config.scale * 0.01);
            }
            return 1;
        }
        return 1;
    };
    AppearanceConfig.GetUIPath = function (id, job, sex, isHead, isRide) {
        if (job === void 0) { job = null; }
        if (sex === void 0) { sex = null; }
        if (isHead === void 0) { isHead = false; }
        if (isRide === void 0) { isRide = false; }
        var path = this.GetUIAppe(id, job, sex, isHead, isRide);
        if (path) {
            return ResDataPath.GetMovieStandPath(path);
        }
        return "";
    };
    AppearanceConfig.GetRideOffset = function (rideId, isUI) {
        if (isUI === void 0) { isUI = false; }
        var config = GameGlobal.Config.AppearanceConfig[rideId];
        if (!config) {
            return AppearanceConfig.TMP_DATA;
        }
        var name = null;
        if (isUI) {
            name = config.uishow;
        }
        if (!name) {
            name = config.appearance;
        }
        config = GameGlobal.Config.AppearancePosConfig[name];
        if (!config) {
            return AppearanceConfig.TMP_DATA;
        }
        return config.offset || AppearanceConfig.TMP_DATA;
    };
    AppearanceConfig.TMP_DATA = { x: 0, y: 0 };
    return AppearanceConfig;
}());
__reflect(AppearanceConfig.prototype, "AppearanceConfig");
//# sourceMappingURL=AppearanceConfig.js.map