var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var JobItemIconConst = (function () {
    function JobItemIconConst() {
    }
    return JobItemIconConst;
}());
__reflect(JobItemIconConst.prototype, "JobItemIconConst");
JobItemIconConst[0] = "";
JobItemIconConst[1] = "zhang";
JobItemIconConst[2] = "jin";
JobItemIconConst[3] = "xue";
var JobHeadIconConst = (function () {
    function JobHeadIconConst() {
    }
    JobHeadIconConst.GetIcon = function (job, sex) {
        return ResDataPath.GetHeadMiniImgName(job, sex);
    };
    return JobHeadIconConst;
}());
__reflect(JobHeadIconConst.prototype, "JobHeadIconConst");
//# sourceMappingURL=JobHeadIconConst.js.map