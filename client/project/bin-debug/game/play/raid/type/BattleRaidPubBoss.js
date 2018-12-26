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
var BattleRaidPubBoss = (function (_super) {
    __extends(BattleRaidPubBoss, _super);
    function BattleRaidPubBoss() {
        return _super.call(this) || this;
    }
    BattleRaidPubBoss.prototype.ShowBattleLayer = function () {
        _super.prototype.ShowBattleLayer.call(this);
        // 添加显示的视图
        var panel = ViewManager.ins().getView(GameBattlePanel);
        if (!this.view) {
            this.view = new GameBattlePubBossView;
        }
        panel.AddChildBaseView(this.view);
        this.view.UpdateHp(0, 0);
    };
    BattleRaidPubBoss.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        this.UpdateHp();
    };
    BattleRaidPubBoss.prototype.UpdateHp = function () {
        if (this.mBossHandle) {
            var entity = this.GetEntity(this.mBossHandle);
            if (entity) {
                var info = entity.GetInfo();
                if (this.view) {
                    this.view.UpdateHp(info.getAtt(AttributeType.atHp), info.getAtt(AttributeType.atMaxHp));
                }
            }
        }
    };
    // 血量更新事件
    BattleRaidPubBoss.prototype.OnEventDamage = function (handle) {
        if (this.mBossHandle && this.mBossHandle == handle) {
            this.UpdateHp();
        }
    };
    return BattleRaidPubBoss;
}(BattleRaid));
__reflect(BattleRaidPubBoss.prototype, "BattleRaidPubBoss");
//# sourceMappingURL=BattleRaidPubBoss.js.map