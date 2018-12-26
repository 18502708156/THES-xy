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
var GlobalConfig = (function (_super) {
    __extends(GlobalConfig, _super);
    function GlobalConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalConfig.DecompressZip = function () {
        var t = egret.getTimer();
        var zip = new JSZip(RES.getRes("config_json"));
        var list = zip.file(/json/i);
        var jsonData = {};
        for (var i = 0, len = list.length; i < len; ++i) {
            var obj = JSON.parse(list[i].asText());
            for (var key in obj) {
                jsonData[key] = obj[key];
            }
        }
        GlobalConfig.setIns(jsonData);
        RES.destroyRes("config_json");
        console.log("配置解析完成 耗时:" + (egret.getTimer() - t));
    };
    GlobalConfig.ins = function () {
        return this._instance;
    };
    GlobalConfig.setIns = function (value) {
        if (!GlobalConfig._instance) {
            this._instance = value;
        }
        else {
            throw new Error("配置文件应该只设置一次");
        }
    };
    ;
    return GlobalConfig;
}(GameGlobalConfigDef));
__reflect(GlobalConfig.prototype, "GlobalConfig");
//# sourceMappingURL=GlobalConfig.js.map