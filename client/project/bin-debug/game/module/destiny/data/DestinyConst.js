var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DestinyConst = (function () {
    function DestinyConst() {
    }
    DestinyConst.GetLockLevel = function (index) {
        // if (!this.LOCK) {
        // 	let lock = this.LOCK = {}
        // 	let config = GameGlobal.Config.DestinyBaseConfig.openlevel1
        // 	for (let key in config) {
        // 		let level = Number(key)
        // 		let equipIndex = config[level]
        // 		if (!lock[equipIndex]) {
        // 			lock[equipIndex] = level
        // 		} else {
        // 			if (level < lock[equipIndex]) {
        // 				lock[equipIndex] = level
        // 			}
        // 		}
        // 	}
        // }
        // return this.LOCK[index + 1] + 1
        return 0;
    };
    return DestinyConst;
}());
__reflect(DestinyConst.prototype, "DestinyConst");
//# sourceMappingURL=DestinyConst.js.map