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
var ResVersionManager = (function (_super) {
    __extends(ResVersionManager, _super);
    function ResVersionManager() {
        var _this = _super.call(this) || this;
        _this.tempDict = {};
        _this.__base_ver__ = 1;
        _this.resVersionData = window["verData"];
        _this.__base_ver__ = _this.resVersionData["__base_ver__"] || 1;
        _this.res_loadByVersion();
        return _this;
    }
    ResVersionManager.ins = function () {
        return _super.ins.call(this);
    };
    ResVersionManager.prototype._GetVer = function (fullName) {
        if (fullName == null || fullName.length == 0 || this.resVersionData == null) {
            return 1;
        }
        var code = this.tempDict[fullName];
        if (code == null) {
            var array = fullName.split("/");
            var dict = this.resVersionData;
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var value = array_1[_i];
                dict = dict[value];
                if (dict == null) {
                    break;
                }
            }
            if (dict == null || typeof (dict) != "number") {
                code = this.__base_ver__;
            }
            else {
                code = dict;
            }
            this.tempDict[fullName] = code;
        }
        return code;
    };
    /**
     * Res加载使用版本号的形式
     */
    ResVersionManager.prototype.res_loadByVersion = function () {
        var _this = this;
        var verPlat = LocationProperty.VerPlat();
        if (window["__LOCAL_RES__"]) {
            if (window["__LOCAL_RES__"] == 1) {
                var resUrl_1 = WindowData._GetResAddr();
                RES.web.Html5VersionController.prototype.getVirtualUrl = function (url) {
                    return resUrl_1 + url;
                };
            }
        }
        else {
            var resVersionData = this.resVersionData;
            var resUrl_2 = WindowData._GetResAddr();
            RES.web.Html5VersionController.prototype.getVirtualUrl = function (url) {
                if (true) {
                    if (url.lastIndexOf(".exml") != -1) {
                        return url;
                    }
                }
                if (url.indexOf("http") == -1) {
                    var version = 1;
                    if (url.indexOf("resource/assets/map/") != -1) {
                        var name_1 = "resource/assets/map/" + url.split("/")[3] + "/small.jpg";
                        version = _this._GetVer(name_1);
                    }
                    else {
                        version = _this._GetVer(url);
                    }
                    if (verPlat) {
                        var arr = url.split(".");
                        url = "" + resUrl_2 + version + "/" + arr[0] + "_" + verPlat + "_" + version + "." + arr.slice(1).join(".");
                    }
                    else {
                        url = resUrl_2 + version + "/" + url;
                    }
                }
                return url;
            };
        }
    };
    return ResVersionManager;
}(BaseClass));
__reflect(ResVersionManager.prototype, "ResVersionManager");
//# sourceMappingURL=ResVersionManager.js.map