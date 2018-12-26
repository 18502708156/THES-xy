/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/26 20:15
 * @meaning: 灵童命格数据类
 *
 **/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DestinyData = (function () {
    function DestinyData() {
    }
    //自定义字段 _data 基本数据 _ex 额外数据
    DestinyData.prototype.initLocalData = function (_data) {
        if (!_data)
            return;
        this.item = _data.item;
        this.sort = _data.sort;
        this.type = _data.type;
        this.level = _data.level;
        this.id = _data.id;
        this.attars = _data.attars;
        this.buffid = _data.buffid;
        this.skillName = _data.skillName;
        this.desc = _data.desc;
    };
    //更新服务端数据
    DestinyData.prototype.updataDataByServer = function (_data) {
        // this.todayNum = _data.todayNum
        // this.star = _data.star 
    };
    return DestinyData;
}());
__reflect(DestinyData.prototype, "DestinyData");
//# sourceMappingURL=DestinyData.js.map