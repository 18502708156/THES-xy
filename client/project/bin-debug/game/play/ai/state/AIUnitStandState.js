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
var AIUnitStandState = (function (_super) {
    __extends(AIUnitStandState, _super);
    function AIUnitStandState() {
        var _this = _super.call(this) || this;
        _this.mType = AIUnitStateType.STAND;
        return _this;
    }
    AIUnitStandState.prototype.PlayHit = function () {
        if (this.m_Play) {
            if (!egret.is(this.m_Play, "AIUnitHitAction")) {
                this.m_Play.OnExit();
                this.m_Play = null;
            }
        }
        var play = this.m_Play;
        if (!play) {
            if (!this.m_Hit) {
                this.m_Hit = new AIUnitHitAction;
                this.m_Hit.Init(this);
            }
            play = this.m_Hit;
            play.OnEnter();
            this.m_Play = play;
        }
        return play.mHit;
    };
    AIUnitStandState.prototype.PlayEvade = function () {
        if (!this.m_Play) {
            if (!this.m_Evade) {
                this.m_Evade = new AIUnitEvadeAction;
                this.m_Evade.Init(this);
            }
            this.m_Play = this.m_Evade;
            this.m_Play.OnEnter();
        }
        return 0;
    };
    AIUnitStandState.prototype.ClearOtherAnim = function () {
        if (this.m_Play) {
            this.m_Play.OnExit();
            this.m_Play = null;
        }
    };
    AIUnitStandState.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        this.mUnit.mEntity.UpdateAction(EntityClipType.STAND, false);
    };
    AIUnitStandState.prototype.OnUpdate = function (delta) {
        if (this.m_Play) {
            if (this.m_Play.OnUpdate(delta) == AIUnitReturn.NEXT) {
                this.m_Play.OnExit();
                this.m_Play = null;
            }
        }
    };
    AIUnitStandState.prototype.OnExit = function () {
    };
    return AIUnitStandState;
}(AIUnitState));
__reflect(AIUnitStandState.prototype, "AIUnitStandState");
//# sourceMappingURL=AIUnitStandState.js.map