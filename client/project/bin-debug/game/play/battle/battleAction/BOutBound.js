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
var BOutBound = (function (_super) {
    __extends(BOutBound, _super);
    function BOutBound() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_OUTBOUND;
        return _this;
    }
    BOutBound.Create = function (data) {
        var action = new BOutBound;
        action.target = data.target;
        action.id = data.id;
        return action;
    };
    BOutBound.prototype.OnUpdate = function (delta) {
        if (this.m_Create == null) {
            var handle = this.DoExecute();
            if (handle) {
                var entity = this.mContext.GetEntity(handle);
                if (entity) {
                    var pos = egret.$TempPoint;
                    var info = entity.GetInfo();
                    BattleCtrl.GetPos(info.IsSide(), info.posIndex + 5, pos);
                    var x = entity.x;
                    var y = entity.y;
                    entity.SetPos(pos.x, pos.y);
                    this.m_MoveData = new AIUnitMoveData;
                    this.m_MoveData.Init(pos.x, pos.y, x, y, MoveTeam.MOVE_SPEED * 2, 0);
                }
            }
            this.m_Create = handle || 0;
            return AIUnitReturn.CONTINUE;
        }
        else {
            var entity = this.mContext.GetEntity(this.m_Create);
            if (entity && this.m_MoveData) {
                var pos = egret.$TempPoint;
                var ret = this.m_MoveData.Update(delta, pos);
                entity.SetPos(pos.x, pos.y);
                if (ret == AIUnitMoveData.STATE_FINISH) {
                    this.m_MoveData = null;
                    return AIUnitReturn.NEXT;
                }
                return AIUnitReturn.CONTINUE;
            }
        }
        return AIUnitReturn.NEXT;
    };
    BOutBound.prototype.DoExecute = function () {
        for (var _i = 0, _a = this.mContext.mEntityDatas; _i < _a.length; _i++) {
            var data1 = _a[_i];
            for (var _b = 0, data1_1 = data1; _b < data1_1.length; _b++) {
                var data2 = data1_1[_b];
                if (data2.handle == this.target) {
                    data2.posIndex = this.id;
                    this.mContext.Create(data2);
                    return data2.handle;
                }
            }
        }
        return 0;
    };
    return BOutBound;
}(BUnitAction));
__reflect(BOutBound.prototype, "BOutBound");
//# sourceMappingURL=BOutBound.js.map