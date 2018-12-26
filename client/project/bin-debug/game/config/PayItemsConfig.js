var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PayItemsConfig = (function () {
    function PayItemsConfig() {
    }
    PayItemsConfig.GetConfig = function () {
        if (!this.CONFIG) {
            var id = LocationProperty.GetRechargeId() || 1;
            var config = GameGlobal.Config.PayItemsConfig;
            var outData = this.CONFIG = {};
            for (var key in config) {
                var data = config[key];
                if (data.plat) {
                    if (data.plat == id) {
                        outData[data.id] = data;
                    }
                }
                else {
                    outData[data.id] = data;
                }
            }
        }
        return this.CONFIG;
    };
    return PayItemsConfig;
}());
__reflect(PayItemsConfig.prototype, "PayItemsConfig");
//# sourceMappingURL=PayItemsConfig.js.map