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
var GameBattleSelectPanel = (function (_super) {
    __extends(GameBattleSelectPanel, _super);
    function GameBattleSelectPanel(context) {
        var _this = _super.call(this) || this;
        _this.mSelectView = [];
        _this.mSelectCount = 0;
        _this.mTarget = [];
        _this.m_Context = context;
        return _this;
    }
    GameBattleSelectPanel.prototype.CancelSelectTarget = function () {
        this.mRoleType = 0;
        this.mSkillId = 0;
        this.mSelectCount = 0;
        this.mTarget = [];
        this.removeChildren();
        DisplayUtils.removeFromParent(this);
    };
    GameBattleSelectPanel.prototype.SelectTarget = function (roleType, skillId) {
        this.mRoleType = roleType;
        this.mSkillId = skillId;
        this.mSelectCount = 0;
        this.mTarget = [];
        var config = GameGlobal.Config.SkillsConfig[skillId];
        if (!config) {
            this.SelectDone();
            return;
        }
        var ttype = config[GameGlobal.Config.SkillsConfig_keys.ttype];
        var args = config[GameGlobal.Config.SkillsConfig_keys.targetType];
        var raid = GameGlobal.RaidMgr.mBattleRaid;
        if (ttype == 1 || ttype == 2 || ttype == 4) {
            this.SelectDone();
            return;
        }
        var side = ttype == 3 ? 1 : 0;
        // this.mSelectCount = args.count
        // 只需要选择一个对象
        this.mSelectCount = 1;
        var entityDatas = raid.mEntityDatas[side];
        for (var _i = 0, entityDatas_1 = entityDatas; _i < entityDatas_1.length; _i++) {
            var data = entityDatas_1[_i];
            var entity = raid.GetEntity(data.handle);
            if (entity && entity.mAI && entity.mAI.IsTarget()) {
                this.AddSelectView(data.handle, side, data.posIndex);
            }
        }
    };
    GameBattleSelectPanel.prototype.AddSelectView = function (handle, side, posIndex) {
        var list = this.mSelectView[side];
        if (!list) {
            list = this.mSelectView[side] = [];
        }
        if (!list[posIndex]) {
            var view = list[posIndex] = new GameBattleSelectItem;
            var data = BattleCtrl.POS_EM[posIndex];
            var pos = egret.$TempPoint;
            GameMap.GetBattleView().GetEntityGlobal(data[0], data[1], pos);
            this.globalToLocal(pos.x, pos.y, pos);
            view.x = pos.x;
            view.y = pos.y;
            this._AddClick(view, this._OnSelClick);
        }
        this.addChild(list[posIndex]);
        list[posIndex].SetData(handle);
    };
    GameBattleSelectPanel.prototype.SelectDone = function () {
        this.m_Context.SelectDone(this.mRoleType, this.mSkillId, this.mTarget);
    };
    GameBattleSelectPanel.prototype._OnSelClick = function (e) {
        var target = e.currentTarget;
        DisplayUtils.removeFromParent(target);
        this.mTarget.push(target.mHandle);
        if (this.mTarget.length >= this.mSelectCount || this.numChildren < 1) {
            this.SelectDone();
            this.CancelSelectTarget();
        }
    };
    return GameBattleSelectPanel;
}(BaseView));
__reflect(GameBattleSelectPanel.prototype, "GameBattleSelectPanel");
var GameBattleSelectItem = (function (_super) {
    __extends(GameBattleSelectItem, _super);
    function GameBattleSelectItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "GameBattleSelectSkin";
        _this.group.x = _this.group.y = 0;
        return _this;
    }
    GameBattleSelectItem.prototype.SetData = function (handle) {
        this.mHandle = handle;
    };
    return GameBattleSelectItem;
}(eui.Component));
__reflect(GameBattleSelectItem.prototype, "GameBattleSelectItem");
//# sourceMappingURL=GameBattleSelectPanel.js.map