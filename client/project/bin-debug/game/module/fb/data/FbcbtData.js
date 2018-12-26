/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/17 17:15
 * @meaning: 藏宝图数据类
 *
 **/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FbcbtData = (function () {
    function FbcbtData() {
        this.todayNum = 0; //当天通关次数
        this.star = 0; //星数
    }
    //自定义字段 _data 基本数据 _ex 额外数据
    FbcbtData.prototype.initLocalData = function (_data, _ex) {
        this.id = _data.id;
        this.page = _data.page;
        this.dod = _data.dod;
        this.fbId = _data.fbId;
        this.firstAwardSw = _data.firstAwardSw || [];
        this.dayAward = _data.dayAward || [];
        this.item = _data.item; //奖励数据
        this.caption = _data.caption; //获得描述
        this.name = _ex.name || "";
        this.desc = _ex.desc || "";
    };
    //更新服务端数据
    FbcbtData.prototype.updataDataByServer = function (_data) {
        this.todayNum = _data.todayNum;
        this.star = _data.star;
    };
    return FbcbtData;
}());
__reflect(FbcbtData.prototype, "FbcbtData");
//# sourceMappingURL=FbcbtData.js.map