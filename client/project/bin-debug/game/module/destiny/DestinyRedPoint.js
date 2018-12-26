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
var DestinyRedPoint = (function (_super) {
    __extends(DestinyRedPoint, _super);
    function DestinyRedPoint() {
        var _this = _super.call(this) || this;
        _this.m_Upgrade = {};
        return _this;
    }
    /**
     * 检查索引对应的方法
     */
    DestinyRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[DestinyRedPoint.INDEX_UPGRADE] = this.GetIndexEquip,
            _a;
        var _a;
    };
    /**
     * 事件定义，根据事件类型更新状态
     */
    DestinyRedPoint.prototype.GetMessageDef = function () {
        return [
            MessageDef.DESTINY_CHANGE,
            MessageDef.DESTINY_UP_ITEM
        ];
    };
    /**
     * 如果某个索引状态发生变化，会回调这个方法，子类重写这个用来广播事件
     */
    DestinyRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.DESTINY_RP);
    };
    DestinyRedPoint.prototype.GetIndexEquip = function () {
        this.m_Upgrade = {};
        var list = GameGlobal.DestinyController.getUseDestinyData() || [];
        var index = 0;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data = list_1[_i];
            var i = index++;
            if (data && data.level && data.id) {
                var config = GameGlobal.Config.DestinyResolveConfig[data.type][data.level - 1];
                if (!config) {
                    continue;
                }
                var upId = GameGlobal.Config.DestinyBaseConfig.uplevelitemid;
                var curNum = GameGlobal.UserBag.GetCount(upId);
                if (curNum >= config.promotestar) {
                    this.m_Upgrade[i] = true;
                }
            }
        }
        for (var key in this.m_Upgrade) {
            if (this.m_Upgrade[key]) {
                return true;
            }
        }
        return false;
    };
    DestinyRedPoint.prototype.IsRedUp = function (index) {
        return this.m_Upgrade[index];
    };
    DestinyRedPoint.INDEX_UPGRADE = 0;
    return DestinyRedPoint;
}(IRedPoint));
__reflect(DestinyRedPoint.prototype, "DestinyRedPoint");
//# sourceMappingURL=DestinyRedPoint.js.map