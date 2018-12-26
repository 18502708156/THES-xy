/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/17 17:15
 * @meaning: 勇闯天庭数据类
 *
 **/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FbTiantingData = (function () {
    function FbTiantingData() {
        this.id = 0; //关卡id
        this.fbId = 0; //基础副本id
        this.bossId = 0; //BOSSid
        this.firstAward = []; //首通奖励 (宝箱奖励)
        this.specialAwardshow = []; //首通特殊奖励展示
        this.uishow = 0; //奖励id
        this.caption1 = "";
        this.caption2 = "";
        // //更新服务端数据
        // public updataDataByServer(_data)
        // {
        //     this.todayNum = _data.todayNum
        //     this.star = _data.star 
        // }
    }
    //自定义字段 _data 基本数据 _ex 额外数据
    FbTiantingData.prototype.initLocalData = function (_data) {
        this.id = _data.id; //关卡id
        this.fbId = _data.fbId; //基础副本id
        this.bossId = _data.bossId; //BOSSid
        this.firstAward = _data.firstAward; //首通奖励 (宝箱奖励)
        this.specialAwardshow = _data.specialAwardshow; //首通特殊奖励展示
        this.uishow = _data.uishow;
        this.caption1 = _data.caption1;
        this.caption2 = _data.caption2;
    };
    return FbTiantingData;
}());
__reflect(FbTiantingData.prototype, "FbTiantingData");
//# sourceMappingURL=FbTiantingData.js.map