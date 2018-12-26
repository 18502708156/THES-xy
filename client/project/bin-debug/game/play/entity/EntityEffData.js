var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EntityEffData = (function () {
    function EntityEffData() {
    }
    EntityEffData.Get = function (skillData, sourceHandle, targetX, targetY, selfDir, selfX, selfY) {
        var data = this.m_List; //.pop() || new EntityEffData
        data.mSkillData = skillData;
        data.mSourceHandle = sourceHandle;
        data.mTargetX = targetX;
        data.mTargetY = targetY;
        data.mSelfDir = selfDir;
        data.mSelfX = selfX;
        data.mSelfY = selfY;
        return data;
    };
    // private static m_List: EntityEffData[] = []
    EntityEffData.m_List = new EntityEffData;
    return EntityEffData;
}());
__reflect(EntityEffData.prototype, "EntityEffData");
//# sourceMappingURL=EntityEffData.js.map