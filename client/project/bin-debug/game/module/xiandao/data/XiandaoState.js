var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var XiandaoState = (function () {
    function XiandaoState() {
    }
    // 状态0未开始 1报名 2报名完毕 3预选 4预选结束 5.16强 6.16强结束 7.8强 8.8强结束 9.4强 10.4强结束 11.2强 12.2强结束
    XiandaoState.NOT_STARTED = 0;
    XiandaoState.APPLY = 1;
    XiandaoState.APPLY_DONE = 2;
    XiandaoState.PRIMARY = 3;
    XiandaoState.PRIMARY_DONE = 4;
    XiandaoState._16_FINAL = 5;
    XiandaoState._16_FINAL_DONE = 6;
    XiandaoState._8_FINAL = 7;
    XiandaoState._8_FINAL_DONE = 8;
    XiandaoState._4_FINAL = 9;
    XiandaoState._4_FINAL_DONE = 10;
    XiandaoState._2_FINAL = 11;
    XiandaoState._2_FINAL_DONE = 12;
    return XiandaoState;
}());
__reflect(XiandaoState.prototype, "XiandaoState");
//# sourceMappingURL=XiandaoState.js.map