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
var PublicBossInfo = (function (_super) {
    __extends(PublicBossInfo, _super);
    function PublicBossInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**争夺人数 */
        _this.fightnum = 0;
        // leftTime: number
        /**已经复活次数*/
        _this.replyTimes = 0;
        return _this;
        // public IsClose(): boolean {
        //     return this.status == 2
        // }
    }
    PublicBossInfo.prototype.parser = function (data) {
        if (this.id != data.id) {
            return;
        }
        this.hp = data.hp;
        this.isKill = data.iskill ? 1 : 0;
        this.status = FieldBossState.OPEN;
        this.reborntime = data.reborntime;
        this.fightnum = data.fightnum;
    };
    PublicBossInfo.prototype.GetConfig = function () {
        return GameGlobal.Config.PublicBossConfig[this.id];
    };
    Object.defineProperty(PublicBossInfo.prototype, "isDie", {
        get: function () {
            return this.isKill == 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublicBossInfo.prototype, "Weight", {
        // isOpen(): number
        // {
        // 	return GameGlobal.actorModel.level >= this.level?1:0
        // }
        get: function () {
            if (GameGlobal.actorModel.level < this.level) {
                return this.id * 100000;
            }
            if (this.isKill) {
                return this.id * 10000;
            }
            return 1000 - this.id;
        },
        enumerable: true,
        configurable: true
    });
    return PublicBossInfo;
}(IBossInfo));
__reflect(PublicBossInfo.prototype, "PublicBossInfo");
//# sourceMappingURL=PublicBossInfo.js.map