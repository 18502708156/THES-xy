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
var CatchPetRaid = (function (_super) {
    __extends(CatchPetRaid, _super);
    function CatchPetRaid() {
        var _this = _super.call(this) || this;
        // 不显示血条
        _this.mNotShowBlood = true;
        _this.list1 = [];
        _this.list2 = [];
        return _this;
    }
    CatchPetRaid.prototype.FinishBattle = function () {
        GameGlobal.RaidMgr.EnterCurMapRaid();
    };
    CatchPetRaid.prototype.SetBattleData = function () {
        var list1 = [];
        var CatchPet = this.GetCatchPet(GameGlobal.CatchPetModel.monsterid);
        if (CatchPet) {
            CatchPet.posIndex = 8;
            list1.push(CatchPet);
        }
        var list2 = [];
        var entityRole = CatchPetRaid.GetMyRole();
        entityRole.posIndex = 8;
        list2.push(entityRole);
        var entityPet = NormalBattleRaid.GetMyPet();
        if (entityPet) {
            entityPet.posIndex = 3;
            list2.push(entityPet);
        }
        for (var i = 0; i < 2; i++) {
            var entity = NormalBattleRaid.GetXianlv(i);
            if (entity) {
                entity.posIndex = i == 0 ? 7 : 9;
                list2.push(entity);
            }
        }
        for (var _i = 0, list2_1 = list2; _i < list2_1.length; _i++) {
            var data = list2_1[_i];
            data.side = 2;
        }
        var list = [list1, list2];
        this.list1 = list1;
        this.list2 = list2;
        _super.prototype.SetBattleData.call(this, list);
    };
    CatchPetRaid.prototype.GetCatchPet = function (PetId) {
        var id = PetId;
        if (!id) {
            return;
        }
        var petInfo = GameGlobal.PetModel.GetPetInfo(PetId);
        var entity = new EntityPet;
        var handle = MonstersConfig.GetHandle();
        entity.parserBase({
            type: EntityType.Pet,
            handler: handle,
            monid: id,
            ownerid: GameGlobal.actorModel.actorID,
            attrs: NormalBattleRaid.CopyAttr(petInfo.GetAttrs()),
            shows: {
                id: id
            }
        });
        return entity;
    };
    CatchPetRaid.GetMyRole = function () {
        var entityRole = NormalBattleRaid.GetMyRole();
        if (entityRole) {
            entityRole.skillsData = [99001]; //个人技能ID 
        }
        return entityRole;
    };
    CatchPetRaid.prototype.CreatSkill = function () {
        var view = ViewManager.ins().getView(GameCatchPanel);
        if (view) {
            view.Catch();
        }
        if (!this.list1[0] || !this.list2[0]) {
            return [];
        }
        var entityData = this.list2[0];
        var petData = this.list1[0];
        var ids = entityData.GetSkillIDs()[0];
        if (!ids) {
            return [];
        }
        var skill = new CatchPetSUnitSkill(ids, entityData.handle);
        skill.Init();
        return [skill.Use([petData.handle])];
    };
    CatchPetRaid.prototype.OpenBattlePanel = function () {
        return ViewManager.ins().open(GameCatchPanel);
    };
    return CatchPetRaid;
}(BattleRaid));
__reflect(CatchPetRaid.prototype, "CatchPetRaid");
//# sourceMappingURL=CatchPetRaid.js.map