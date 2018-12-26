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
var DeityEquipRedPoint = (function (_super) {
    __extends(DeityEquipRedPoint, _super);
    function DeityEquipRedPoint() {
        var _this = _super.call(this) || this;
        //////////////////////////////////////////
        _this.mRedPointMap = {};
        return _this;
    }
    DeityEquipRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.CHANGE_EQUIP, MessageDef.DEITYEQUIP_INIT, MessageDef.ITEM_COUNT_CHANGE];
    };
    DeityEquipRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[DeityEquipRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a;
        var _a;
    };
    DeityEquipRedPoint.prototype.OnChange = function (index) {
        if (index == DeityEquipRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.DEITYEQUIP_ALL_NOTICE);
        }
    };
    DeityEquipRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.mRedPointMap) {
            if (this.mRedPointMap[key]) {
                return true;
            }
        }
        return false;
    };
    DeityEquipRedPoint.prototype.DoActive = function () {
        this.mRedPointMap[DeityEquipRedPoint.AWAKE] = GameGlobal.UserEquip.HasDeityEquipAwake();
        this.mRedPointMap[DeityEquipRedPoint.INJECT] = GameGlobal.UserEquip.HasDeityEquipInject();
        this.mRedPointMap[DeityEquipRedPoint.RESOLVE] = GameGlobal.UserEquip.HasDeityEquipResolve();
    };
    DeityEquipRedPoint.prototype.IsRedAct = function (type) {
        this.Get(DeityEquipRedPoint.INDEX_ACT);
        return this.mRedPointMap[type];
    };
    DeityEquipRedPoint.INDEX_ACT = 0;
    /** 红点通知类型 */
    //////////////////////////////////////////
    DeityEquipRedPoint.AWAKE = 1;
    DeityEquipRedPoint.INJECT = 2;
    DeityEquipRedPoint.RESOLVE = 3;
    return DeityEquipRedPoint;
}(IRedPoint));
__reflect(DeityEquipRedPoint.prototype, "DeityEquipRedPoint");
//# sourceMappingURL=DeityEquipRedPoint.js.map