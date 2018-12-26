var AcrossBossState;
(function (AcrossBossState) {
    // 0 关闭  1 等待boss  2 boss存在  3 boss被击杀 4 复活中(用于帮会BOSS)
    AcrossBossState[AcrossBossState["CLOSE"] = 0] = "CLOSE";
    AcrossBossState[AcrossBossState["WAIT"] = 1] = "WAIT";
    AcrossBossState[AcrossBossState["BOSS"] = 2] = "BOSS";
    AcrossBossState[AcrossBossState["KILL"] = 3] = "KILL";
    AcrossBossState[AcrossBossState["REBORNING"] = 4] = "REBORNING";
})(AcrossBossState || (AcrossBossState = {}));
//# sourceMappingURL=AcrossBossState.js.map