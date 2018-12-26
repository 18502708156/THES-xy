class JobItemIconConst {
} 

JobItemIconConst[0] = "";
JobItemIconConst[1] = "zhang";
JobItemIconConst[2] = "jin";
JobItemIconConst[3] = "xue";

class JobHeadIconConst{
    static GetIcon(job, sex) {
        return ResDataPath.GetHeadMiniImgName(job, sex)
    }
}